import Foundation
import Capacitor
import Vision
import UIKit

// PokéPics: keeps study photos inside the app and reads the text in them on the iPhone
// with Apple's Vision text recognition (offline, nothing is uploaded).
@objc(PokePicsPlugin)
public class PokePicsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PokePicsPlugin"
    public let jsName = "PokePics"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "folder", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "save", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "ocr", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise)
    ]

    private func dir() -> URL {
        let d = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("PokePics", isDirectory: true)
        try? FileManager.default.createDirectory(at: d, withIntermediateDirectories: true)
        return d
    }
    private func file(_ id: String) -> URL { dir().appendingPathComponent(id + ".jpg") }

    // The app's folder can move when the app is re-signed, so the page asks for it at launch instead of storing full paths.
    @objc func folder(_ call: CAPPluginCall) {
        let u = dir()
        call.resolve(["webPath": bridge?.portablePath(fromLocalURL: u)?.absoluteString ?? u.absoluteString])
    }

    @objc func save(_ call: CAPPluginCall) {
        guard let id = call.getString("id"), var b64 = call.getString("data") else { call.reject("Missing photo"); return }
        if let comma = b64.firstIndex(of: ",") { b64 = String(b64[b64.index(after: comma)...]) }
        guard let data = Data(base64Encoded: b64) else { call.reject("The photo could not be read"); return }
        do {
            try data.write(to: file(id), options: .atomic)
            call.resolve(["id": id])
        } catch {
            call.reject("Could not save the photo: " + error.localizedDescription)
        }
    }

    @objc func remove(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { call.reject("Missing id"); return }
        try? FileManager.default.removeItem(at: file(id))
        call.resolve()
    }

    @objc func ocr(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { call.reject("Missing id"); return }
        guard let img = UIImage(contentsOfFile: file(id).path), let cg = img.cgImage else { call.reject("Photo not found"); return }
        let request = VNRecognizeTextRequest { req, err in
            if let err = err { call.reject("Could not read the photo: " + err.localizedDescription); return }
            let lines = (req.results as? [VNRecognizedTextObservation] ?? [])
                .sorted { a, b in
                    // top-to-bottom, then left-to-right (Vision's y axis points up)
                    abs(a.boundingBox.midY - b.boundingBox.midY) > 0.01 ? a.boundingBox.midY > b.boundingBox.midY : a.boundingBox.minX < b.boundingBox.minX
                }
                .compactMap { $0.topCandidates(1).first?.string }
            call.resolve(["id": id, "text": lines.joined(separator: "\n")])
        }
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        let orientation = CGImagePropertyOrientation(img.imageOrientation)
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try VNImageRequestHandler(cgImage: cg, orientation: orientation, options: [:]).perform([request])
            } catch {
                call.reject("Could not read the photo: " + error.localizedDescription)
            }
        }
    }
}

extension CGImagePropertyOrientation {
    init(_ o: UIImage.Orientation) {
        switch o {
        case .up: self = .up
        case .down: self = .down
        case .left: self = .left
        case .right: self = .right
        case .upMirrored: self = .upMirrored
        case .downMirrored: self = .downMirrored
        case .leftMirrored: self = .leftMirrored
        case .rightMirrored: self = .rightMirrored
        @unknown default: self = .up
        }
    }
}
