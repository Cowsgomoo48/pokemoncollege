import Foundation
import Capacitor
import UIKit
import UserNotifications

// App icon badge: the red number on the home-screen icon (how many tasks are due today).
// set() changes it right away. plan() queues silent, badge-only notifications for the next days
// so the number updates at midnight even when the app stays closed.
@objc(AppBadgePlugin)
public class AppBadgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AppBadgePlugin"
    public let jsName = "AppBadge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "plan", returnType: CAPPluginReturnPromise)
    ]
    // Not numbers, so the reminder code (which uses numeric ids) never cancels these.
    private let prefix = "pcbadge-"

    // The badge needs notification permission. Ask once if the person hasn't been asked yet.
    private func allowed(_ done: @escaping (Bool) -> Void) {
        let c = UNUserNotificationCenter.current()
        c.getNotificationSettings { s in
            switch s.authorizationStatus {
            case .notDetermined:
                c.requestAuthorization(options: [.badge, .alert, .sound]) { ok, _ in done(ok) }
            case .denied:
                done(false)
            default:
                done(s.badgeSetting != .disabled)
            }
        }
    }

    private func apply(_ n: Int) {
        if #available(iOS 16.0, *) {
            UNUserNotificationCenter.current().setBadgeCount(n) { _ in }
        } else {
            DispatchQueue.main.async { UIApplication.shared.applicationIconBadgeNumber = n }
        }
    }

    @objc func set(_ call: CAPPluginCall) {
        let n = max(0, call.getInt("count") ?? 0)
        allowed { ok in
            if ok { self.apply(n) }
            call.resolve(["ok": ok])
        }
    }

    @objc func plan(_ call: CAPPluginCall) {
        let days = call.getArray("days", JSObject.self) ?? []
        let c = UNUserNotificationCenter.current()
        c.getPendingNotificationRequests { reqs in
            c.removePendingNotificationRequests(withIdentifiers: reqs.map { $0.identifier }.filter { $0.hasPrefix(self.prefix) })
            if days.isEmpty { call.resolve(["count": 0]); return }
            self.allowed { ok in
                if !ok { call.resolve(["count": 0, "ok": false]); return }
                var added = 0
                for (i, d) in days.enumerated() {
                    guard let ms = (d["at"] as? NSNumber)?.doubleValue else { continue }
                    let when = Date(timeIntervalSince1970: ms / 1000)
                    if when.timeIntervalSinceNow < 5 { continue }
                    let content = UNMutableNotificationContent()   // no title, text or sound: it only changes the badge
                    content.badge = NSNumber(value: max(0, (d["count"] as? NSNumber)?.intValue ?? 0))
                    let parts = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute, .second], from: when)
                    let trigger = UNCalendarNotificationTrigger(dateMatching: parts, repeats: false)
                    c.add(UNNotificationRequest(identifier: self.prefix + String(i), content: content, trigger: trigger))
                    added += 1
                }
                call.resolve(["count": added, "ok": true])
            }
        }
    }
}
