import AppIntents
import WebKit
import Foundation

// Siri / Kestirmeler komutları. Veriler web uygulamasında olduğu için komut,
// açık olan sayfadaki window.__hmVoice fonksiyonuna iletilir ve cevabı Siri söyler.
@MainActor
final class HMVoice {
    static let shared = HMVoice()
    weak var web: WKWebView?

    func run(_ cmd: [String: Any]) async -> String {
        // sayfanın yüklenmesini bekle (en çok ~15 sn)
        for _ in 0..<60 {
            if let w = web, let ok = try? await w.evaluateJavaScript("typeof window.__hmVoice==='function'") as? Bool, ok { break }
            try? await Task.sleep(nanoseconds: 250_000_000)
        }
        guard let w = web,
              let d = try? JSONSerialization.data(withJSONObject: cmd),
              let json = String(data: d, encoding: .utf8) else { return "Uygulama hazır değil, biraz sonra tekrar dene." }
        do {
            let r = try await w.callAsyncJavaScript("return await window.__hmVoice(\(json))", arguments: [:], in: nil, contentWorld: .page)
            return (r as? String) ?? "Tamam."
        } catch {
            return "Bir sorun oldu, uygulamada tekrar dene."
        }
    }
}

struct Snap: Decodable { var d: String?; var rec: Int?; var sleep: Int?; var steps: Int?; var rhr: Int?; var hrv: Int? }

// MARK: - Öğün ekle
struct AddMealIntent: AppIntent {
    static var title: LocalizedStringResource = "Öğün ekle"
    static var description = IntentDescription("Yediğini söyle, HypeMode kaloriyi hesaplayıp ekler. Örn: 3 yumurta ve 2 dilim ekmek")
    static var openAppWhenRun = true
    @Parameter(title: "Ne yedin?", requestValueDialog: "Ne yedin?") var food: String

    @MainActor func perform() async throws -> some IntentResult & ProvidesDialog {
        let r = await HMVoice.shared.run(["t": "meal", "q": food])
        return .result(dialog: IntentDialog(stringLiteral: r))
    }
}

// MARK: - İçecek ekle
enum DrinkKind: String, AppEnum {
    case su, cay, turk, filtre, espresso, ayran, sut, kola, maden
    static var typeDisplayRepresentation: TypeDisplayRepresentation = "İçecek"
    static var caseDisplayRepresentations: [DrinkKind: DisplayRepresentation] = [
        .su: "Su", .cay: "Çay", .turk: "Türk kahvesi", .filtre: "Filtre kahve", .espresso: "Espresso",
        .ayran: "Ayran", .sut: "Süt", .kola: "Kola", .maden: "Maden suyu"]
}

struct AddDrinkIntent: AppIntent {
    static var title: LocalizedStringResource = "İçecek ekle"
    static var openAppWhenRun = true
    @Parameter(title: "İçecek", default: .su) var kind: DrinkKind
    @Parameter(title: "Miktar (ml)") var ml: Int?

    @MainActor func perform() async throws -> some IntentResult & ProvidesDialog {
        var c: [String: Any] = ["t": "drink", "type": kind.rawValue]
        if let ml { c["ml"] = ml }
        let r = await HMVoice.shared.run(c)
        return .result(dialog: IntentDialog(stringLiteral: r))
    }
}

// MARK: - Antrenman başlat
struct StartWorkoutIntent: AppIntent {
    static var title: LocalizedStringResource = "Antrenman başlat"
    static var openAppWhenRun = true
    @Parameter(title: "Şablon (boş = sıradaki)") var name: String?

    @MainActor func perform() async throws -> some IntentResult & ProvidesDialog {
        var c: [String: Any] = ["t": "start"]
        if let name { c["name"] = name }
        let r = await HMVoice.shared.run(c)
        return .result(dialog: IntentDialog(stringLiteral: r))
    }
}

// MARK: - Durum (uygulamayı açmadan)
struct StatusIntent: AppIntent {
    static var title: LocalizedStringResource = "Bugünkü durumum"
    static var openAppWhenRun = false

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let raw = UserDefaults.standard.string(forKey: "hm-snap")
            ?? UserDefaults(suiteName: "group.com.yasindogru.hypemode")?.string(forKey: "snap")
        guard let raw, let d = raw.data(using: .utf8), let s = try? JSONDecoder().decode(Snap.self, from: d) else {
            return .result(dialog: "Henüz veri yok. HypeMode'u bir kez aç, sonra tekrar sor.")
        }
        var parts: [String] = []
        if let r = s.rec { parts.append("Toparlanman yüzde \(r)") }
        if let m = s.sleep, m > 0 { parts.append("uykun \(m / 60) saat \(m % 60) dakika") }
        if let st = s.steps { parts.append("\(st) adım attın") }
        if let h = s.rhr { parts.append("dinlenik nabzın \(h)") }
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"
        let old = s.d != nil && s.d != f.string(from: Date())
        let txt = parts.isEmpty ? "Bugün için veri yok." : parts.joined(separator: ", ") + "."
        return .result(dialog: IntentDialog(stringLiteral: old ? "Son güncelleme dünden. " + txt : txt))
    }
}

// MARK: - Siri cümleleri (ayar gerektirmez)
struct HMShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(intent: AddMealIntent(), phrases: [
            "\(.applicationName) öğün ekle", "\(.applicationName)'a öğün ekle", "\(.applicationName) yemek ekle", "Add a meal in \(.applicationName)"],
            shortTitle: "Öğün ekle", systemImageName: "fork.knife")
        AppShortcut(intent: AddDrinkIntent(), phrases: [
            "\(.applicationName) içecek ekle", "\(.applicationName)'a \(\.$kind) ekle", "\(.applicationName) \(\.$kind) içtim", "\(.applicationName) su ekle"],
            shortTitle: "İçecek ekle", systemImageName: "drop.fill")
        AppShortcut(intent: StartWorkoutIntent(), phrases: [
            "\(.applicationName) antrenman başlat", "\(.applicationName)'da antrenmanı başlat", "Start workout in \(.applicationName)"],
            shortTitle: "Antrenman başlat", systemImageName: "figure.strengthtraining.traditional")
        AppShortcut(intent: StatusIntent(), phrases: [
            "\(.applicationName) durumum", "\(.applicationName) bugün nasılım", "\(.applicationName) toparlanmam kaç", "How am I today in \(.applicationName)"],
            shortTitle: "Durumum", systemImageName: "heart.text.square")
    }
}
