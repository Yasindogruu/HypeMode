import SwiftUI
import UIKit
import WebKit
import UserNotifications
import WidgetKit

let HM_URL = URL(string: "https://yasindogruu.github.io/HypeMode/")!

struct WebView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.allowsInlineMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []
        cfg.websiteDataStore = .default()
        let uc = WKUserContentController()
        uc.add(context.coordinator, name: "hm")
        uc.addUserScript(WKUserScript(source: "window.HM_NATIVE={v:1,health:true,ble:true};", injectionTime: .atDocumentStart, forMainFrameOnly: true))
        cfg.userContentController = uc

        let wv = WKWebView(frame: .zero, configuration: cfg)
        wv.isOpaque = false
        wv.backgroundColor = .black
        wv.scrollView.backgroundColor = .black
        wv.scrollView.contentInsetAdjustmentBehavior = .never
        wv.allowsBackForwardNavigationGestures = false
        wv.uiDelegate = context.coordinator
        wv.navigationDelegate = context.coordinator
        if #available(iOS 16.4, *) { wv.isInspectable = true }
        context.coordinator.web = wv
        wv.load(URLRequest(url: HM_URL, cachePolicy: .reloadRevalidatingCacheData))
        return wv
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKScriptMessageHandler, WKUIDelegate, WKNavigationDelegate {
        weak var web: WKWebView?
        let health = Health()
        let hrm = HRM()

        override init() {
            super.init()
            hrm.onBpm = { [weak self] b, name in
                let n = name.replacingOccurrences(of: "'", with: "")
                self?.js("window.__hmHR&&__hmHR(\(b),'\(n)')")
            }
            hrm.onState = { [weak self] st in self?.js("window.__hmHRState&&__hmHRState('\(st)')") }
            hrm.onBattery = { [weak self] v, name in
                let n = name.replacingOccurrences(of: "'", with: "")
                self?.js("window.__hmBat&&__hmBat(\(v),'\(n)')")
            }
        }

        func js(_ s: String) {
            DispatchQueue.main.async { self.web?.evaluateJavaScript(s, completionHandler: nil) }
        }

        func reply(_ id: String, _ obj: [String: Any]) {
            guard let d = try? JSONSerialization.data(withJSONObject: obj), let str = String(data: d, encoding: .utf8) else {
                js("window.__hmNative&&__hmNative('\(id)',{error:'json'})"); return
            }
            js("window.__hmNative&&__hmNative('\(id)',\(str))")
        }

        func userContentController(_ uc: WKUserContentController, didReceive message: WKScriptMessage) {
            guard let b = message.body as? [String: Any], let cmd = b["cmd"] as? String else { return }
            let id = b["id"] as? String ?? ""
            switch cmd {
            case "health":
                let days = b["days"] as? Int ?? 30
                health.sync(days: days) { [weak self] out in self?.reply(id, out) }
            case "weight":
                let kg = (b["kg"] as? Double) ?? Double(b["kg"] as? Int ?? 0)
                health.saveWeight(kg: kg) { [weak self] ok in self?.reply(id, ["ok": ok]) }
            case "push":
                let items = b["items"] as? [[String: Any]] ?? [], del = b["del"] as? [String] ?? []
                health.push(items: items, del: del) { [weak self] n in self?.reply(id, ["n": n]) }
            case "hrm":
                if (b["on"] as? Bool) == true { hrm.start() } else { hrm.stop() }
            case "alarm":
                let c = UNUserNotificationCenter.current()
                c.removePendingNotificationRequests(withIdentifiers: ["swake", "swake2"])
                guard (b["on"] as? Bool) == true, let at = b["at"] as? Double else { break }
                c.requestAuthorization(options: [.alert, .sound, .badge]) { ok, _ in
                    guard ok else { return }
                    func add(_ id: String, _ t: Double, _ body: String) {
                        let ct = UNMutableNotificationContent()
                        ct.title = (b["title"] as? String) ?? "Günaydın"
                        ct.body = body
                        ct.sound = .default
                        let d = Date(timeIntervalSince1970: t / 1000)
                        let comps = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: d)
                        c.add(UNNotificationRequest(identifier: id, content: ct, trigger: UNCalendarNotificationTrigger(dateMatching: comps, repeats: false)))
                    }
                    add("swake", at, (b["body"] as? String) ?? "Uyku döngün bitti, kalkmak için en iyi an.")
                    if let at2 = b["at2"] as? Double, at2 > at { add("swake2", at2, "En geç kalkış saatin geldi.") }
                }
            case "widget":
                if let snap = b["snap"] as? String {
                    UserDefaults(suiteName: "group.com.yasindogru.hypemode")?.set(snap, forKey: "snap")
                    WidgetCenter.shared.reloadAllTimelines()
                }
                reply(id, ["ok": true])
            case "open":
                if let s = b["url"] as? String, let u = URL(string: s) { UIApplication.shared.open(u) }
            default: break
            }
        }

        // Kamera / mikrofon izni (getUserMedia)
        @available(iOS 15.0, *)
        func webView(_ webView: WKWebView, requestMediaCapturePermissionFor origin: WKSecurityOrigin, initiatedByFrame frame: WKFrameInfo, type: WKMediaCaptureType, decisionHandler: @escaping (WKPermissionDecision) -> Void) {
            decisionHandler(.grant)
        }

        // window.open → Safari
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let u = navigationAction.request.url { UIApplication.shared.open(u) }
            return nil
        }

        // Başka sitelere giden bağlantılar Safari'de açılır
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let u = navigationAction.request.url, navigationAction.targetFrame?.isMainFrame == true,
               let h = u.host, h != HM_URL.host, ["http", "https"].contains(u.scheme ?? "") {
                UIApplication.shared.open(u); decisionHandler(.cancel); return
            }
            if let u = navigationAction.request.url, let sc = u.scheme, !["http", "https", "about", "blob", "data"].contains(sc) {
                UIApplication.shared.open(u); decisionHandler(.cancel); return
            }
            decisionHandler(.allow)
        }

        func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { webView.reload() }

        // alert / confirm / prompt
        private func top() -> UIViewController? {
            let s = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
            var v = s?.windows.first(where: { $0.isKeyWindow })?.rootViewController
            while let p = v?.presentedViewController { v = p }
            return v
        }
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            a.addAction(UIAlertAction(title: "Tamam", style: .default) { _ in completionHandler() })
            if let t = top() { t.present(a, animated: true) } else { completionHandler() }
        }
        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
            let a = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            a.addAction(UIAlertAction(title: "Vazgeç", style: .cancel) { _ in completionHandler(false) })
            a.addAction(UIAlertAction(title: "Tamam", style: .default) { _ in completionHandler(true) })
            if let t = top() { t.present(a, animated: true) } else { completionHandler(false) }
        }
        func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
            let a = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
            a.addTextField { $0.text = defaultText }
            a.addAction(UIAlertAction(title: "Vazgeç", style: .cancel) { _ in completionHandler(nil) })
            a.addAction(UIAlertAction(title: "Tamam", style: .default) { _ in completionHandler(a.textFields?.first?.text) })
            if let t = top() { t.present(a, animated: true) } else { completionHandler(nil) }
        }
    }
}
