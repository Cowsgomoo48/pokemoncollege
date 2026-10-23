import Foundation
import Capacitor
import Vision
import UIKit
import PhotosUI

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
        CAPPluginMethod(name: "remove", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pick", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "camera", returnType: CAPPluginReturnPromise)
    ]
    private var pendingPick: CAPPluginCall?
    private var pendingCamera: CAPPluginCall?

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

    // Saves a photo straight into the app's folder: upright, at most 2000 px on the long side, as JPEG.
    // (Doing this natively avoids sending big base64 strings through the web view, which was slow.)
    fileprivate func store(_ img: UIImage) -> String? {
        let id = String(UUID().uuidString.replacingOccurrences(of: "-", with: "").prefix(12)).lowercased() + String(Int(Date().timeIntervalSince1970 * 1000) % 100000, radix: 36)
        let s = img.size
        guard s.width > 0, s.height > 0 else { return nil }
        let k = min(1, 2000 / max(s.width, s.height))
        let size = CGSize(width: floor(s.width * k), height: floor(s.height * k))
        let fmt = UIGraphicsImageRendererFormat.default()
        fmt.scale = 1
        let out = UIGraphicsImageRenderer(size: size, format: fmt).image { _ in img.draw(in: CGRect(origin: .zero, size: size)) }
        guard let data = out.jpegData(compressionQuality: 0.85) else { return nil }
        do { try data.write(to: file(id), options: .atomic) } catch { return nil }
        return id
    }

    // Apple's own photo picker (no permission prompt needed); photos are saved one at a time to keep memory low.
    @objc func pick(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var cfg = PHPickerConfiguration()
            cfg.filter = .images
            cfg.selectionLimit = call.getInt("limit") ?? 0
            let picker = PHPickerViewController(configuration: cfg)
            picker.delegate = self
            self.pendingPick = call
            guard let vc = self.bridge?.viewController else { call.reject("Could not open the photo picker"); return }
            vc.present(picker, animated: true)
        }
    }

    @objc func camera(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard UIImagePickerController.isSourceTypeAvailable(.camera) else { call.reject("This device has no camera available"); return }
            let picker = UIImagePickerController()
            picker.sourceType = .camera
            picker.delegate = self
            self.pendingCamera = call
            guard let vc = self.bridge?.viewController else { call.reject("Could not open the camera"); return }
            vc.present(picker, animated: true)
        }
    }

    fileprivate func loadPicked(_ results: [PHPickerResult], _ index: Int, _ ids: [String], _ call: CAPPluginCall) {
        if index >= results.count {
            DispatchQueue.main.async { call.resolve(["ids": ids]) }
            return
        }
        let provider = results[index].itemProvider
        guard provider.canLoadObject(ofClass: UIImage.self) else { loadPicked(results, index + 1, ids, call); return }
        provider.loadObject(ofClass: UIImage.self) { obj, _ in
            var next = ids
            if let img = obj as? UIImage, let id = self.store(img) { next.append(id) }
            self.loadPicked(results, index + 1, next, call)
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

extension PokePicsPlugin: PHPickerViewControllerDelegate {
    public func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        guard let call = pendingPick else { return }
        pendingPick = nil
        if results.isEmpty { call.resolve(["ids": [String]()]); return }
        DispatchQueue.global(qos: .userInitiated).async { self.loadPicked(results, 0, [], call) }
    }
}

extension PokePicsPlugin: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    public func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        picker.dismiss(animated: true)
        guard let call = pendingCamera else { return }
        pendingCamera = nil
        guard let img = info[.originalImage] as? UIImage else { call.resolve(["ids": [String]()]); return }
        DispatchQueue.global(qos: .userInitiated).async {
            let id = self.store(img)
            DispatchQueue.main.async { call.resolve(["ids": id == nil ? [String]() : [id!]]) }
        }
    }
    public func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
        pendingCamera?.resolve(["ids": [String]()])
        pendingCamera = nil
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
