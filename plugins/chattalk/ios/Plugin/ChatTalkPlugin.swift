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
        CAPPluginMethod(name: "folder", returnType: CAPPluginReturnPromise)
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
                try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
                try session.setActive(true)
                let settings: [String: Any] = [AVFormatIDKey: Int(kAudioFormatMPEG4AAC), AVSampleRateKey: 16000, AVNumberOfChannelsKey: 1, AVEncoderAudioQualityKey: AVAudioQuality.medium.rawValue]
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
