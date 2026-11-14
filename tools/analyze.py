#!/usr/bin/env python3
"""HypeMode veri analizi.

Uygulamada Ayarlar > Depolama & veri > Yedeği indir ile aldığın JSON dosyasını
okur; antrenman, uyku, toparlanma ve beslenme verilerinden grafikli bir HTML
rapor üretir.

Kullanım:
    pip install pandas matplotlib
    python tools/analyze.py hypemode-yedek-2026-11-14.json -o rapor/
"""
import argparse, base64, io, json, os, sys
from datetime import date, datetime, timedelta

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

BG, FG, MUT, ACC = "#0b0b0d", "#ececf0", "#8a8a94", "#7cc4ff"
plt.rcParams.update({"figure.facecolor": BG, "axes.facecolor": BG, "axes.edgecolor": "#2a2a30",
                     "axes.labelcolor": MUT, "xtick.color": MUT, "ytick.color": MUT, "text.color": FG,
                     "font.size": 10, "axes.spines.top": False, "axes.spines.right": False})


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def sessions_df(S):
    rows = []
    for s in S.get("sessions", []):
        d = pd.to_datetime(s.get("date"), utc=True).tz_convert(None)
        for st in s.get("sets", []):
            kg, reps = float(st.get("kg") or 0), float(st.get("reps") or 0)
            rows.append({"date": d.normalize(), "session": s.get("id"), "plan": s.get("planName"),
                         "exercise": st.get("ex"), "muscle": st.get("muscle"), "kg": kg, "reps": reps,
                         "volume": kg * reps, "e1rm": kg * (1 + reps / 30) if reps and kg else np.nan})
    return pd.DataFrame(rows)


def health_df(S):
    rows = []
    for d, x in (S.get("health") or {}).items():
        sl = x.get("sleep") or {}
        rows.append({"date": pd.to_datetime(d), "sleep_min": sl.get("min"), "deep": sl.get("deep"),
                     "rem": sl.get("rem"), "hrv": x.get("hrv"), "rhr": x.get("rhr"),
                     "steps": x.get("steps"), "spo2": x.get("spo2"), "resp": x.get("resp")})
    return pd.DataFrame(rows).sort_values("date") if rows else pd.DataFrame(columns=["date"])


def nutrition_df(S):
    m = pd.DataFrame(S.get("meals") or [])
    if m.empty:
        return m
    m["date"] = pd.to_datetime(m["date"])
    return m.groupby("date")[["kcal", "p", "c", "f"]].sum().reset_index()


def weight_df(S):
    b = pd.DataFrame([x for x in S.get("body") or [] if x.get("weight")])
    if b.empty:
        return b
    b["date"] = pd.to_datetime(b["date"])
    return b.groupby("date")["weight"].last().reset_index()


def fig_b64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=144, bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def chart_weekly_volume(sets):
    w = sets.groupby(pd.Grouper(key="date", freq="W-MON"))["volume"].sum() / 1000
    fig, ax = plt.subplots(figsize=(7, 2.6))
    ax.bar(w.index, w.values, width=5, color=[ACC if v == w.max() else "#3a3a42" for v in w.values])
    ax.set_ylabel("ton / hafta")
    return fig_b64(fig)


def chart_e1rm(sets, top=4):
    ex = sets.groupby("exercise")["session"].nunique().sort_values(ascending=False).head(top).index
    fig, ax = plt.subplots(figsize=(7, 2.8))
    for i, e in enumerate(ex):
        s = sets[sets.exercise == e].groupby("date")["e1rm"].max().dropna()
        ax.plot(s.index, s.values, marker="o", ms=3, lw=1.6, color=ACC if i == 0 else plt.cm.Greys(0.4 + i * 0.15), label=e)
    ax.set_ylabel("tahmini 1RM (kg)")
    ax.legend(frameon=False, fontsize=8)
    return fig_b64(fig)


def chart_recovery(h):
    fig, ax = plt.subplots(figsize=(7, 2.6))
    if "hrv" in h and h["hrv"].notna().any():
        ax.plot(h["date"], h["hrv"], color=ACC, lw=1.6, label="HRV (ms)")
    if "rhr" in h and h["rhr"].notna().any():
        ax2 = ax.twinx()
        ax2.plot(h["date"], h["rhr"], color="#9a9aa4", lw=1.2, label="Dinlenik nabız")
        ax2.tick_params(colors=MUT)
    ax.legend(frameon=False, fontsize=8, loc="upper left")
    return fig_b64(fig)


def sleep_vs_training(sets, h):
    """Bir önceki gecenin uykusu ile o günkü antrenman hacmi arasındaki ilişki."""
    if sets.empty or h.empty or h["sleep_min"].isna().all():
        return None
    v = sets.groupby("date")["volume"].sum().rename("volume").reset_index()
    j = v.merge(h[["date", "sleep_min", "hrv"]], on="date", how="inner").dropna(subset=["sleep_min"])
    if len(j) < 4:
        return None
    r = j["volume"].corr(j["sleep_min"])
    X = np.c_[np.ones(len(j)), j["sleep_min"] / 60, j["hrv"].fillna(j["hrv"].mean() if j["hrv"].notna().any() else 0)]
    coef, *_ = np.linalg.lstsq(X, j["volume"].values, rcond=None)
    fig, ax = plt.subplots(figsize=(4.2, 3))
    ax.scatter(j["sleep_min"] / 60, j["volume"] / 1000, s=18, color=ACC)
    xs = np.linspace((j["sleep_min"] / 60).min(), (j["sleep_min"] / 60).max(), 20)
    ax.plot(xs, (coef[0] + coef[1] * xs + coef[2] * X[:, 2].mean()) / 1000, color=FG, lw=1)
    ax.set_xlabel("uyku (saat)"); ax.set_ylabel("hacim (ton)")
    return {"r": r, "per_hour": coef[1], "n": len(j), "img": fig_b64(fig)}


def report(S, out):
    os.makedirs(out, exist_ok=True)
    sets, h, nut, wt = sessions_df(S), health_df(S), nutrition_df(S), weight_df(S)
    parts = []
    def card(title, body):
        parts.append(f'<section><h2>{title}</h2>{body}</section>')
    def img(b):
        return f'<img src="data:image/png;base64,{b}">'

    n_sess = sets["session"].nunique() if not sets.empty else 0
    kpi = [("antrenman", n_sess), ("toplam set", len(sets)), ("toplam hacim", f"{sets['volume'].sum()/1000:.1f} t" if not sets.empty else "0"),
           ("sağlık verisi", f"{len(h)} gün"), ("öğün kaydı", f"{len(S.get('meals') or [])}")]
    parts.append('<div class="kpi">' + "".join(f"<div><b>{v}</b><small>{k}</small></div>" for k, v in kpi) + "</div>")

    if not sets.empty:
        card("Haftalık antrenman hacmi", img(chart_weekly_volume(sets)))
        card("Güç gelişimi (tahmini 1RM, Epley)", img(chart_e1rm(sets)))
        top = (sets.groupby("muscle")["reps"].count().sort_values(ascending=False) / max(1, n_sess)).round(1)
        card("Kas grubuna göre ortalama set / antrenman", "<table>" + "".join(f"<tr><td>{k}</td><td>{v}</td></tr>" for k, v in top.items()) + "</table>")
    if not h.empty and (h.get("hrv") is not None):
        card("Toparlanma: HRV ve dinlenik nabız", img(chart_recovery(h)))
        sl = h["sleep_min"].dropna()
        if len(sl):
            card("Uyku", f"<p>Ortalama <b>{sl.mean()/60:.1f} saat</b> · en kısa {sl.min()/60:.1f} · en uzun {sl.max()/60:.1f} · "
                         f"7 saatin altındaki gece oranı <b>%{(sl < 420).mean()*100:.0f}</b></p>")
    s2 = sleep_vs_training(sets, h)
    if s2:
        card("Uyku ↔ antrenman", f"<p>{s2['n']} günlük eşleşme. Korelasyon r = <b>{s2['r']:.2f}</b>. "
             f"Doğrusal modele göre her ek saat uyku hacmini yaklaşık <b>{s2['per_hour']/1000:+.2f} ton</b> değiştiriyor "
             f"(HRV sabit tutularak). Az veriyle bu sonuç kesin değildir.</p>{img(s2['img'])}")
    if not nut.empty:
        card("Beslenme", f"<p>Günlük ortalama <b>{nut['kcal'].mean():.0f} kcal</b>, protein <b>{nut['p'].mean():.0f} g</b> "
             f"({len(nut)} gün)</p>")
    if not wt.empty and len(wt) > 1:
        d = (wt["weight"].iloc[-1] - wt["weight"].iloc[0])
        days = max(1, (wt["date"].iloc[-1] - wt["date"].iloc[0]).days)
        card("Kilo", f"<p>{wt['weight'].iloc[0]:.1f} → <b>{wt['weight'].iloc[-1]:.1f} kg</b> ({d:+.1f} kg, haftada {d/days*7:+.2f} kg)</p>")

    html = f"""<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>HypeMode raporu</title><style>
body{{background:{BG};color:{FG};font:15px/1.5 -apple-system,Inter,sans-serif;max-width:760px;margin:0 auto;padding:28px 18px}}
h1{{font-size:28px;margin:0}} .sub{{color:{MUT};font:12px ui-monospace,Menlo,monospace;margin-bottom:22px}}
section{{border-top:1px solid #222;padding:16px 0}} h2{{font:600 13px ui-monospace,Menlo,monospace;color:{MUT};text-transform:lowercase;margin:0 0 10px}}
img{{width:100%;border-radius:8px}} .kpi{{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:10px 0 18px}}
.kpi div{{border:1px solid #222;border-radius:12px;padding:10px}} .kpi b{{display:block;font-size:20px}} .kpi small{{color:{MUT};font-size:11px}}
table{{width:100%;border-collapse:collapse}} td{{padding:6px 0;border-bottom:1px solid #1d1d22}} td+td{{text-align:right;font-family:ui-monospace,Menlo,monospace}}
</style><h1>HypeMode raporu</h1><div class="sub">{datetime.now():%d.%m.%Y %H:%M} · yerel analiz · veriler bilgisayarından çıkmaz</div>
{''.join(parts)}</html>"""
    p = os.path.join(out, "rapor.html")
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    for name, df in [("antrenman_setleri.csv", sets), ("saglik.csv", h), ("beslenme.csv", nut), ("kilo.csv", wt)]:
        if not df.empty:
            df.to_csv(os.path.join(out, name), index=False)
    return p


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("backup", help="Uygulamadan indirilen yedek JSON dosyası")
    ap.add_argument("-o", "--out", default="rapor", help="Çıktı klasörü (varsayılan: rapor)")
    a = ap.parse_args()
    p = report(load(a.backup), a.out)
    print("Rapor hazır:", p)


if __name__ == "__main__":
    sys.exit(main())
