import WidgetKit
import SwiftUI

let HM_GROUP = "group.com.yasindogru.hypemode"

// Uygulamanın (web) gönderdiği anlık görüntü
struct Snap: Codable {
    var d: String          // gün (yyyy-MM-dd)
    var t: Double          // güncellenme zamanı (ms)
    var rec: Int?          // toparlanma 0-100
    var sleep: Int?        // uyku dakikası
    var slS: Int?          // uyku skoru
    var steps: Int?
    var rhr: Int?
    var hrv: Int?
    var strain: Double?
    var e: [Double]?       // enerji eğrisi, 0:00'dan itibaren yarım saatlik (0..30 saat)
    var bed: Double?       // yatış saati (saat, 24+ olabilir)
    var lang: String?
    var kin: Int? = nil      // bugün alınan kcal
    var kgo: Int? = nil      // günlük kcal hedefi
    var wn: Int? = nil       // son 7 gündeki antrenman
    var wgo: Int? = nil      // haftalık antrenman hedefi
    var wt: Double? = nil    // trend kilo
    var wwk: Double? = nil   // kg / hafta
    var gw: Double? = nil    // hedef kilo

    static func load() -> Snap? {
        guard let s = UserDefaults(suiteName: HM_GROUP)?.string(forKey: "snap"),
              let data = s.data(using: .utf8) else { return nil }
        return try? JSONDecoder().decode(Snap.self, from: data)
    }
    var en: Bool { lang == "en" }
    func L(_ tr: String, _ en: String) -> String { self.en ? en : tr }
    var isToday: Bool {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"; f.locale = Locale(identifier: "en_US_POSIX")
        return d == f.string(from: Date())
    }
    // saat h için enerji (h: 0..30)
    func energy(at h: Double) -> Double? {
        guard let e = e, !e.isEmpty else { return nil }
        let i = max(0, min(Double(e.count - 1), h * 2)), a = Int(i.rounded(.down)), b = min(e.count - 1, a + 1), f = i - Double(a)
        return e[a] * (1 - f) + e[b] * f
    }
}

func hourOf(_ d: Date) -> Double {
    let c = Calendar.current.dateComponents([.hour, .minute], from: d)
    return Double(c.hour ?? 0) + Double(c.minute ?? 0) / 60
}

struct Entry: TimelineEntry {
    let date: Date
    let snap: Snap?
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> Entry {
        Entry(date: Date(), snap: Snap(d: "", t: 0, rec: 72, sleep: 445, slS: 80, steps: 6400, rhr: 58, hrv: 48, strain: 9.4,
                                       e: (0...60).map { 60 + 25 * sin(Double($0) / 9) }, bed: 23.5, lang: "tr"))
    }
    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) {
        completion(context.isPreview ? placeholder(in: context) : Entry(date: Date(), snap: Snap.load()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        let s = Snap.load(), now = Date()
        // enerji saate göre değiştiği için 6 saat boyunca her 30 dakikada bir giriş
        let entries = (0..<12).map { Entry(date: now.addingTimeInterval(Double($0) * 1800), snap: s) }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

// MARK: - Görünümler

let accent = Color(red: 124 / 255, green: 196 / 255, blue: 1)
let mono = Font.system(size: 10, weight: .medium, design: .monospaced)

func recColor(_ v: Int?) -> Color {
    guard let v = v else { return .gray }
    return v >= 67 ? Color(red: 0.36, green: 0.85, blue: 0.55) : v >= 34 ? Color(red: 1, green: 0.8, blue: 0.3) : Color(red: 1, green: 0.38, blue: 0.38)
}

func fmtSleep(_ m: Int?) -> String {
    guard let m = m, m > 0 else { return "–" }
    return "\(m / 60)s \(String(format: "%02d", m % 60))"
}

struct Ring: View {
    let v: Int?
    var lw: CGFloat = 7
    var body: some View {
        ZStack {
            Circle().stroke(Color.white.opacity(0.12), lineWidth: lw)
            Circle().trim(from: 0, to: CGFloat(v ?? 0) / 100)
                .stroke(recColor(v), style: StrokeStyle(lineWidth: lw, lineCap: .round))
                .rotationEffect(.degrees(-90))
        }
    }
}

struct Curve: View {
    let s: Snap
    let now: Double
    var body: some View {
        GeometryReader { g in
            let span = 10.0, h0 = now
            let pts: [CGPoint] = stride(from: 0.0, through: span, by: 0.25).compactMap { dh in
                guard let v = s.energy(at: min(30, h0 + dh)) else { return nil }
                return CGPoint(x: g.size.width * dh / span, y: g.size.height * (1 - v / 100))
            }
            ZStack(alignment: .topLeading) {
                Path { p in
                    guard let f = pts.first else { return }
                    p.move(to: CGPoint(x: f.x, y: g.size.height)); pts.forEach { p.addLine(to: $0) }
                    p.addLine(to: CGPoint(x: pts.last!.x, y: g.size.height)); p.closeSubpath()
                }.fill(LinearGradient(colors: [accent.opacity(0.35), accent.opacity(0)], startPoint: .top, endPoint: .bottom))
                Path { p in
                    guard let f = pts.first else { return }
                    p.move(to: f); pts.dropFirst().forEach { p.addLine(to: $0) }
                }.stroke(accent, style: StrokeStyle(lineWidth: 1.6, lineCap: .round, lineJoin: .round))
                if let f = pts.first { Circle().fill(Color.white).frame(width: 6, height: 6).position(f) }
            }
        }
    }
}

struct Stale: View {
    let s: Snap?
    var body: some View {
        VStack(spacing: 6) {
            Text("HYPEMODE").font(mono).tracking(2).foregroundColor(.white.opacity(0.6))
            Text(s?.L("Güncellemek için\nuygulamayı aç", "Open the app\nto update") ?? "Güncellemek için\nuygulamayı aç")
                .font(.system(size: 13, weight: .semibold)).multilineTextAlignment(.center).foregroundColor(.white)
        }
    }
}

struct SmallView: View {
    let e: Entry
    var body: some View {
        if let s = e.snap, s.isToday {
            let en = s.energy(at: hourOf(e.date))
            VStack(alignment: .leading, spacing: 4) {
                Text(s.L("TOPARLANMA", "RECOVERY")).font(mono).tracking(1.2).foregroundColor(.white.opacity(0.55))
                HStack(alignment: .center, spacing: 10) {
                    ZStack {
                        Ring(v: s.rec, lw: 6)
                        Text(s.rec.map(String.init) ?? "–").font(.system(size: 22, weight: .semibold, design: .rounded)).foregroundColor(.white)
                    }.frame(width: 58, height: 58)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(s.L("ENERJİ", "ENERGY")).font(mono).foregroundColor(.white.opacity(0.5))
                        Text(en.map { String(Int($0.rounded())) } ?? "–").font(.system(size: 20, weight: .semibold, design: .rounded)).foregroundColor(accent)
                    }
                }
                Spacer(minLength: 0)
                HStack(spacing: 8) {
                    Label(fmtSleep(s.sleep), systemImage: "moon.fill")
                    Label(s.steps.map { $0 >= 1000 ? String(format: "%.1fk", Double($0) / 1000) : "\($0)" } ?? "–", systemImage: "figure.walk")
                }.font(.system(size: 11, weight: .medium)).foregroundColor(.white.opacity(0.75)).labelStyle(TightLabel())
            }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        } else { Stale(s: e.snap) }
    }
}

struct TightLabel: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: 3) { configuration.icon.font(.system(size: 9)); configuration.title }
    }
}

struct MediumView: View {
    let e: Entry
    var body: some View {
        if let s = e.snap, s.isToday {
            let now = hourOf(e.date), en = s.energy(at: now)
            HStack(spacing: 14) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(s.L("TOPARLANMA", "RECOVERY")).font(mono).tracking(1.2).foregroundColor(.white.opacity(0.55))
                    ZStack {
                        Ring(v: s.rec, lw: 7)
                        Text(s.rec.map(String.init) ?? "–").font(.system(size: 26, weight: .semibold, design: .rounded)).foregroundColor(.white)
                    }.frame(width: 70, height: 70)
                    HStack(spacing: 8) {
                        Label(fmtSleep(s.sleep), systemImage: "moon.fill")
                    }.font(.system(size: 11, weight: .medium)).foregroundColor(.white.opacity(0.75)).labelStyle(TightLabel())
                }
                VStack(alignment: .leading, spacing: 4) {
                    HStack(alignment: .firstTextBaseline) {
                        Text(s.L("ENERJİ · 10 SAAT", "ENERGY · 10 H")).font(mono).tracking(1).foregroundColor(.white.opacity(0.55))
                        Spacer()
                        Text(en.map { String(Int($0.rounded())) } ?? "–").font(.system(size: 18, weight: .semibold, design: .rounded)).foregroundColor(accent)
                    }
                    if s.e != nil { Curve(s: s, now: now) } else { Spacer() }
                    HStack(spacing: 10) {
                        stat(s.L("NABIZ", "RHR"), s.rhr.map(String.init))
                        stat("HRV", s.hrv.map(String.init))
                        stat(s.L("ADIM", "STEPS"), s.steps.map { $0 >= 1000 ? String(format: "%.1fk", Double($0) / 1000) : "\($0)" })
                    }
                }
            }
        } else { Stale(s: e.snap) }
    }
    func stat(_ k: String, _ v: String?) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(k).font(.system(size: 8, weight: .medium, design: .monospaced)).foregroundColor(.white.opacity(0.5))
            Text(v ?? "–").font(.system(size: 13, weight: .semibold, design: .rounded)).foregroundColor(.white)
        }
    }
}

// Kilit ekranı
struct CircularView: View {
    let e: Entry
    var body: some View {
        let s = e.snap, ok = s?.isToday == true
        Gauge(value: Double(ok ? (s?.rec ?? 0) : 0), in: 0...100) {
                Text("REC")
            } currentValueLabel: {
                Text(ok ? (s?.rec.map(String.init) ?? "–") : "–")
            }.gaugeStyle(.accessoryCircular)
    }
}

struct RectView: View {
    let e: Entry
    var body: some View {
        if let s = e.snap, s.isToday {
            let en = s.energy(at: hourOf(e.date))
            VStack(alignment: .leading, spacing: 1) {
                Text("HYPEMODE").font(.system(size: 11, weight: .bold)).widgetAccentable()
                Text("\(s.L("Toparlanma", "Recovery")) \(s.rec.map(String.init) ?? "–") · \(s.L("Enerji", "Energy")) \(en.map { String(Int($0.rounded())) } ?? "–")")
                    .font(.system(size: 13, weight: .semibold))
                Text("\(s.L("Uyku", "Sleep")) \(fmtSleep(s.sleep)) · \(s.steps ?? 0) \(s.L("adım", "steps"))").font(.system(size: 12))
            }.frame(maxWidth: .infinity, alignment: .leading)
        } else {
            Text("HypeMode · \(e.snap?.L("uygulamayı aç", "open app") ?? "uygulamayı aç")").font(.system(size: 13))
        }
    }
}

struct InlineView: View {
    let e: Entry
    var body: some View {
        if let s = e.snap, s.isToday {
            Text("\(s.L("Toparlanma", "Recovery")) \(s.rec.map(String.init) ?? "–") · \(s.L("Uyku", "Sleep")) \(fmtSleep(s.sleep))")
        } else { Text("HypeMode") }
    }
}

extension View {
    @ViewBuilder func hmBackground() -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.containerBackground(for: .widget) { Color.black }
        } else {
            self.padding().background(Color.black)
        }
    }
    @ViewBuilder func lockBackground() -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            self.containerBackground(for: .widget) { Color.clear }
        } else { self }
    }
}

struct EntryView: View {
    @Environment(\.widgetFamily) var fam
    let e: Entry
    var body: some View {
        switch fam {
        case .systemMedium: MediumView(e: e).hmBackground()
        case .accessoryCircular: CircularView(e: e).lockBackground()
        case .accessoryRectangular: RectView(e: e).lockBackground()
        case .accessoryInline: InlineView(e: e).lockBackground()
        default: SmallView(e: e).hmBackground()
        }
    }
}

// MARK: - Günlük widget: kalori, adım, haftalık antrenman, kilo trendi
struct Bar: View {
    let f: Double; let c: Color
    var body: some View {
        GeometryReader { g in
            ZStack(alignment: .leading) {
                Capsule().fill(Color.white.opacity(0.12))
                Capsule().fill(c).frame(width: max(4, g.size.width * CGFloat(min(1, max(0, f)))))
            }
        }.frame(height: 6)
    }
}

struct DailyView: View {
    @Environment(\.widgetFamily) var fam
    let e: Entry
    var body: some View {
        if let s = e.snap, s.isToday {
            VStack(alignment: .leading, spacing: fam == .systemSmall ? 7 : 9) {
                Text(s.L("BUGÜN", "TODAY")).font(mono).tracking(1.2).foregroundColor(.white.opacity(0.55))
                row(s.L("Kalori", "Calories"), "\(s.kin ?? 0) / \(s.kgo ?? 0)", Double(s.kin ?? 0) / Double(max(1, s.kgo ?? 1)), Color(red: 1, green: 0.54, blue: 0.3))
                row(s.L("Adım", "Steps"), s.steps.map { $0 >= 1000 ? String(format: "%.1fk", Double($0) / 1000) : "\($0)" } ?? "–", Double(s.steps ?? 0) / 8000, Color(red: 0.2, green: 0.83, blue: 0.6))
                row(s.L("Antrenman · 7 gün", "Workouts · 7 d"), "\(s.wn ?? 0) / \(s.wgo ?? 3)", Double(s.wn ?? 0) / Double(max(1, s.wgo ?? 3)), Color(red: 0.78, green: 0.75, blue: 1))
                if fam != .systemSmall, let wt = s.wt {
                    HStack {
                        Text(s.L("Kilo", "Weight")).font(.system(size: 11, weight: .medium)).foregroundColor(.white.opacity(0.7))
                        Spacer()
                        Text(String(format: "%.1f kg", wt) + (s.wwk.map { String(format: "  %@%.2f/%@", $0 > 0 ? "+" : "", $0, s.L("hf", "wk")) } ?? ""))
                            .font(.system(size: 12, weight: .semibold, design: .rounded)).foregroundColor(.white)
                    }
                }
            }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        } else { Stale(s: e.snap) }
    }
    func row(_ k: String, _ v: String, _ f: Double, _ c: Color) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack {
                Text(k).font(.system(size: 11, weight: .medium)).foregroundColor(.white.opacity(0.7))
                Spacer()
                Text(v).font(.system(size: 12, weight: .semibold, design: .rounded)).foregroundColor(.white)
            }
            Bar(f: f, c: c)
        }
    }
}

struct HypeModeDaily: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HypeModeDaily", provider: Provider()) { e in
            DailyView(e: e).hmBackground()
        }
        .configurationDisplayName(Snap.load()?.en == true ? "HypeMode Today" : "HypeMode Bugün")
        .description("Kalori, adım, haftalık antrenman ve kilo trendi")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct HypeModeWidgets: WidgetBundle {
    var body: some Widget {
        HypeModeWidget()
        HypeModeDaily()
    }
}

struct HypeModeWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HypeModeWidget", provider: Provider()) { e in
            EntryView(e: e)
        }
        .configurationDisplayName("HypeMode")
        .description("Toparlanma, enerji ve uyku")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular, .accessoryInline])
    }
}
