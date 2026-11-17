import Foundation
import Capacitor
import AVFoundation
import Speech

// ChatTalk: records lectures (keeps going with the screen locked thanks to the "audio" background mode)
// and transcribes them on the iPhone itself with Apple's speech recognizer, so nothing leaves the phone.
@objc(ChatTalkPlugin)
public class ChatTalkPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ChatTalkPlugin"
    public let jsName = "ChatTalk"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "askPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "transcribe", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "folder", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "splice", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "export", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "backupAudio", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restoreAudio", returnType: CAPPluginReturnPromise)
    ]

    private var recorder: AVAudioRecorder?
    private var meterTimer: Timer?
    private var currentId = ""
    private var lastLoud = Date()
    private var level: Float = -160
    private var quietLimit: Double = 30      // seconds without loud (teacher-level) speech before auto-stop; 0 = off
    private var loudDb: Float = -38          // what counts as "loud": nearer/louder voices pass, distant chatter does not
    private var lastStop: [String: Any]? = nil
    private var progress: [String: Any] = [:]
    private var observing = false

    private func folder() -> URL {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("ChatTalk", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }
    private func fileURL(_ id: String) -> URL { folder().appendingPathComponent(id + ".m4a") }
    private func webPath(_ url: URL) -> String { bridge?.portablePath(fromLocalURL: url)?.absoluteString ?? url.absoluteString }

    @objc func askPermissions(_ call: CAPPluginCall) {
        AVAudioSession.sharedInstance().requestRecordPermission { mic in
            SFSpeechRecognizer.requestAuthorization { speech in
                let rec = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
                call.resolve(["microphone": mic, "speech": speech == .authorized, "onDevice": rec?.supportsOnDeviceRecognition ?? false])
            }
        }
    }

    @objc func start(_ call: CAPPluginCall) {
        let id = call.getString("id") ?? String(Int(Date().timeIntervalSince1970))
        quietLimit = call.getDouble("quietSeconds") ?? 30
        loudDb = Float(call.getDouble("loudDb") ?? -38)
        DispatchQueue.main.async {
            if self.recorder?.isRecording == true { call.reject("Already recording"); return }
            do {
                let session = AVAudioSession.sharedInstance()
                // A2DP only (not .allowBluetooth): Bluetooth headsets' call mic records at phone-call quality, so always use the iPhone's own mic.
                try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetoothA2DP])
                try session.setActive(true)
                if let mic = session.availableInputs?.first(where: { $0.portType == .builtInMic }) { try? session.setPreferredInput(mic) }
                // 44.1 kHz / 64 kbps AAC: clear speech for a far-away teacher (~29 MB per hour).
                let settings: [String: Any] = [AVFormatIDKey: Int(kAudioFormatMPEG4AAC), AVSampleRateKey: 44100, AVNumberOfChannelsKey: 1, AVEncoderBitRateKey: 64000, AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue]
                let r = try AVAudioRecorder(url: self.fileURL(id), settings: settings)
                r.isMeteringEnabled = true
                guard r.record() else { call.reject("The microphone could not start. Check Settings > PokemonCollege > Microphone."); return }
                self.recorder = r; self.currentId = id; self.lastLoud = Date(); self.lastStop = nil
                if !self.observing {
                    self.observing = true
                    NotificationCenter.default.addObserver(self, selector: #selector(self.interrupted(_:)), name: AVAudioSession.interruptionNotification, object: nil)
                }
                self.meterTimer?.invalidate()
                self.meterTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in self?.tick() }
                call.resolve(["id": id])
            } catch {
                call.reject("Could not start recording: " + error.localizedDescription)
            }
        }
    }

    private func tick() {
        guard let r = recorder, r.isRecording else { return }
        r.updateMeters()
        level = r.averagePower(forChannel: 0)
        if level > loudDb { lastLoud = Date() }
        if quietLimit > 0 && Date().timeIntervalSince(lastLoud) > quietLimit { finish("quiet") }
    }

    // A phone call or alarm pauses the recorder; carry on when the interruption ends.
    @objc private func interrupted(_ n: Notification) {
        guard let raw = n.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt, let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }
        if type == .ended, let r = recorder, !r.isRecording, !currentId.isEmpty {
            try? AVAudioSession.sharedInstance().setActive(true)
            r.record(); lastLoud = Date()
        }
    }

    @discardableResult private func finish(_ reason: String) -> [String: Any]? {
        guard let r = recorder else { return lastStop }
        let seconds = r.currentTime
        r.stop(); meterTimer?.invalidate(); meterTimer = nil; recorder = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        let url = fileURL(currentId)
        let info: [String: Any] = ["id": currentId, "reason": reason, "seconds": seconds, "path": url.path, "webPath": webPath(url), "endedAt": Date().timeIntervalSince1970 * 1000]
        lastStop = info; currentId = ""
        return info
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if let info = self.finish("manual") { call.resolve(info) } else { call.reject("Not recording") }
        }
    }

    @objc func status(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var out: [String: Any] = ["recording": self.recorder?.isRecording == true, "paused": self.recorder != nil && self.recorder?.isRecording == false, "id": self.currentId, "seconds": self.recorder?.currentTime ?? 0, "level": Double(self.level), "quietFor": Date().timeIntervalSince(self.lastLoud), "progress": self.progress]
            if let s = self.lastStop { out["lastStop"] = s }
            call.resolve(out)
        }
    }

    // The app's folder can move when the app is re-signed, so playback paths are rebuilt from this at launch.
    @objc func folder(_ call: CAPPluginCall) { call.resolve(["webPath": webPath(folder())]) }

    @objc func remove(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { call.reject("Missing id"); return }
        try? FileManager.default.removeItem(at: fileURL(id))
        call.resolve()
    }

    // Backups/Recordings mirrors every recording's audio next to the JSON backups (hard links: no extra space).
    private func backupDir() -> URL {
        let d = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("Backups", isDirectory: true).appendingPathComponent("Recordings", isDirectory: true)
        try? FileManager.default.createDirectory(at: d, withIntermediateDirectories: true)
        return d
    }
    @objc func backupAudio(_ call: CAPPluginCall) {
        let ids = Set((call.getArray("ids", String.self) ?? []).filter { !$0.isEmpty })
        let fm = FileManager.default, dir = backupDir()
        var n = 0
        for id in ids {
            let src = fileURL(id), dst = dir.appendingPathComponent(id + ".m4a")
            guard fm.fileExists(atPath: src.path) else { continue }
            let a = (try? fm.attributesOfItem(atPath: src.path)[.size] as? Int) ?? -1, b = (try? fm.attributesOfItem(atPath: dst.path)[.size] as? Int) ?? -2
            if a != b { try? fm.removeItem(at: dst); do { try fm.linkItem(at: src, to: dst) } catch { try? fm.copyItem(at: src, to: dst) } }
            n += 1
        }
        for f in (try? fm.contentsOfDirectory(atPath: dir.path)) ?? [] where f.hasSuffix(".m4a") && !ids.contains(String(f.dropLast(4))) {
            try? fm.removeItem(at: dir.appendingPathComponent(f))
        }
        call.resolve(["count": n])
    }
    // Puts back any recording audio that's missing from ChatTalk but present in Backups/Recordings.
    @objc func restoreAudio(_ call: CAPPluginCall) {
        let fm = FileManager.default, dir = backupDir()
        var n = 0
        for id in call.getArray("ids", String.self) ?? [] where !id.isEmpty {
            let src = dir.appendingPathComponent(id + ".m4a"), dst = fileURL(id)
            guard !fm.fileExists(atPath: dst.path), fm.fileExists(atPath: src.path) else { continue }
            do { try fm.linkItem(at: src, to: dst) } catch { try? fm.copyItem(at: src, to: dst) }
            n += 1
        }
        call.resolve(["count": n])
    }

    // Rebuilds Documents/ChatTalk Exports: one file per recording named by its title, inside a subfolder per in-app folder.
    // Files are hard links to the originals, so they take no extra space.
    @objc func export(_ call: CAPPluginCall) {
        guard let items = call.getArray("items", JSObject.self) else { call.reject("Nothing to export"); return }
        let fm = FileManager.default
        let root = fm.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("ChatTalk Exports", isDirectory: true)
        let clean: (String) -> String = { s in
            let bad = CharacterSet(charactersIn: "/\\:*?\"<>|").union(.newlines).union(.controlCharacters)
            let t = s.components(separatedBy: bad).joined(separator: " ").trimmingCharacters(in: .whitespacesAndNewlines)
            return t.isEmpty ? "Untitled" : String(t.prefix(80))
        }
        do {
            try? fm.removeItem(at: root)
            try fm.createDirectory(at: root, withIntermediateDirectories: true)
            var n = 0, used = Set<String>()
            for it in items {
                guard let id = it["id"] as? String else { continue }
                let src = fileURL(id)
                guard fm.fileExists(atPath: src.path) else { continue }
                var dir = root
                if let f = it["folder"] as? String, !f.isEmpty { dir = root.appendingPathComponent(clean(f), isDirectory: true); try fm.createDirectory(at: dir, withIntermediateDirectories: true) }
                let base = clean(it["name"] as? String ?? id)
                var name = base + ".m4a", k = 2
                while used.contains(dir.appendingPathComponent(name).path.lowercased()) { name = base + " (\(k)).m4a"; k += 1 }
                let dst = dir.appendingPathComponent(name); used.insert(dst.path.lowercased())
                do { try fm.linkItem(at: src, to: dst) } catch { try fm.copyItem(at: src, to: dst) }
                n += 1
            }
            call.resolve(["count": n, "folder": "ChatTalk Exports"])
        } catch {
            call.reject("Export failed: " + error.localizedDescription)
        }
    }

    // PokeSplicer: joins recording A then recording B into one new .m4a. "fade" fades A out over its last moments and fades B in.
    @objc func splice(_ call: CAPPluginCall) {
        guard let a = call.getString("a"), let b = call.getString("b"), let id = call.getString("id") else { call.reject("Missing recordings"); return }
        let fade = call.getString("mode") == "fade"
        let ua = fileURL(a), ub = fileURL(b), out = fileURL(id)
        guard FileManager.default.fileExists(atPath: ua.path), FileManager.default.fileExists(atPath: ub.path) else { call.reject("A recording's audio file is missing"); return }
        Task {
            do {
                let comp = AVMutableComposition()
                guard let track = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) else { throw NSError(domain: "ChatTalk", code: 3, userInfo: [NSLocalizedDescriptionKey: "Could not build the spliced track"]) }
                var at = CMTime.zero, durA = CMTime.zero
                for (i, u) in [ua, ub].enumerated() {
                    let asset = AVURLAsset(url: u)
                    guard let src = asset.tracks(withMediaType: .audio).first else { throw NSError(domain: "ChatTalk", code: 4, userInfo: [NSLocalizedDescriptionKey: "A recording has no audio"]) }
                    try track.insertTimeRange(CMTimeRange(start: .zero, duration: asset.duration), of: src, at: at)
                    at = CMTimeAdd(at, asset.duration); if i == 0 { durA = asset.duration }
                }
                try? FileManager.default.removeItem(at: out)
                guard let exp = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetAppleM4A) else { throw NSError(domain: "ChatTalk", code: 5, userInfo: [NSLocalizedDescriptionKey: "Could not export the spliced track"]) }
                exp.outputURL = out; exp.outputFileType = .m4a
                if fade {
                    let f = min(1.5, CMTimeGetSeconds(durA) / 3), p = AVMutableAudioMixInputParameters(track: track)
                    let fd = CMTime(seconds: f, preferredTimescale: 600)
                    p.setVolumeRamp(fromStartVolume: 1, toEndVolume: 0, timeRange: CMTimeRange(start: CMTimeSubtract(durA, fd), duration: fd))
                    p.setVolumeRamp(fromStartVolume: 0, toEndVolume: 1, timeRange: CMTimeRange(start: durA, duration: fd))
                    let mix = AVMutableAudioMix(); mix.inputParameters = [p]; exp.audioMix = mix
                }
                await withCheckedContinuation { (c: CheckedContinuation<Void, Never>) in exp.exportAsynchronously { c.resume() } }
                guard exp.status == .completed else { throw exp.error ?? NSError(domain: "ChatTalk", code: 6, userInfo: [NSLocalizedDescriptionKey: "Export failed"]) }
                call.resolve(["id": id, "seconds": CMTimeGetSeconds(at), "path": out.path, "webPath": self.webPath(out)])
            } catch {
                call.reject("Splice failed: " + error.localizedDescription)
            }
        }
    }

    // Transcribes in 50-second pieces, which keeps each request inside the recognizer's comfortable range.
    @objc func transcribe(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { call.reject("Missing id"); return }
        let url = fileURL(id)
        guard FileManager.default.fileExists(atPath: url.path) else { call.reject("Recording file not found"); return }
        guard let rec = SFSpeechRecognizer(locale: Locale(identifier: call.getString("locale") ?? "en-US")), rec.isAvailable else { call.reject("Speech recognition is not available right now"); return }
        guard rec.supportsOnDeviceRecognition else { call.reject("This iPhone can't transcribe offline for this language yet. In Settings > General > Keyboard, make sure Dictation is on and English is downloaded."); return }
        Task {
            do {
                let asset = AVURLAsset(url: url)
                let total = CMTimeGetSeconds(asset.duration)
                let chunk = 50.0
                var t = 0.0, parts: [String] = []
                let count = max(1, Int(ceil(total / chunk)))
                var n = 0
                while t < total - 0.25 {
                    n += 1
                    let part = n
                    DispatchQueue.main.async { self.progress = ["id": id, "part": part, "of": count] }
                    let tmp = FileManager.default.temporaryDirectory.appendingPathComponent("ct-\(id)-\(n).m4a")
                    try? FileManager.default.removeItem(at: tmp)
                    guard let exp = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetAppleM4A) else { throw NSError(domain: "ChatTalk", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not cut the recording"]) }
                    exp.outputURL = tmp
                    exp.outputFileType = .m4a
                    exp.timeRange = CMTimeRange(start: CMTime(seconds: t, preferredTimescale: 600), duration: CMTime(seconds: min(chunk, total - t), preferredTimescale: 600))
                    await withCheckedContinuation { (c: CheckedContinuation<Void, Never>) in exp.exportAsynchronously { c.resume() } }
                    guard exp.status == .completed else { throw exp.error ?? NSError(domain: "ChatTalk", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not cut the recording"]) }
                    let text = try await self.recognize(tmp, rec)
                    if !text.isEmpty { parts.append(text) }
                    try? FileManager.default.removeItem(at: tmp)
                    t += chunk
                }
                DispatchQueue.main.async { self.progress = [:] }
                call.resolve(["id": id, "text": parts.joined(separator: " "), "seconds": total])
            } catch {
                DispatchQueue.main.async { self.progress = [:] }
                call.reject("Transcription failed: " + error.localizedDescription)
            }
        }
    }

    private func recognize(_ url: URL, _ rec: SFSpeechRecognizer) async throws -> String {
        try await withCheckedThrowingContinuation { (cont: CheckedContinuation<String, Error>) in
            let req = SFSpeechURLRecognitionRequest(url: url)
            req.requiresOnDeviceRecognition = true
            req.shouldReportPartialResults = false
            if #available(iOS 16, *) { req.addsPunctuation = true }
            let once = Once()
            _ = rec.recognitionTask(with: req) { result, error in
                if once.done { return }
                if let r = result, r.isFinal {
                    once.done = true; cont.resume(returning: r.bestTranscription.formattedString)
                } else if let e = error {
                    once.done = true
                    // A stretch with no speech in it is not a failure; it just has no words.
                    let ns = e as NSError
                    if ns.code == 1110 || ns.code == 203 || ns.code == 1101 { cont.resume(returning: "") } else { cont.resume(throwing: e) }
                }
            }
        }
    }
}

// Makes sure each recognition request answers exactly once.
private final class Once { var done = false }
