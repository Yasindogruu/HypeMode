#!/usr/bin/env python3
"""HypeMode toparlanma tahmini modeli.

Bugünkü uyku, antrenman yükü, adım, beslenme ve gece ölçümlerinden
YARIN SABAHKİ toparlanmanı tahmin eder.

Hedef (toparlanma skoru, 0-100):
    Kalp atış hızı değişkenliğinin (ln HRV) ve dinlenik nabzın, senin 30 günlük
    normaline göre sapmasından hesaplanır. HRV normalinin üstünde ve nabız
    normalinin altındaysa skor yüksek olur. Uygulamadaki toparlanma skoruyla
    aynı mantık: z = 0.7·z(lnHRV) − 0.3·z(RHR), skor = 50 + 18·z.

Modeller (zaman sırasına göre, geleceği görmeden test edilir):
    - Taban 1: yarın = bugün (kalıcılık)
    - Taban 2: yarın = son 7 günün ortalaması
    - Ridge regresyon (yorumlanabilir; katsayılar uygulamaya taşınabilir)
    - Gradient boosting (doğrusal olmayan ilişkiler)

Kullanım:
    pip install -r tools/requirements.txt
    python tools/recovery_model.py hypemode-yedek-2026-11-14.json -o rapor
    python tools/recovery_model.py --demo -o rapor     # sentetik veriyle dene
"""
import argparse, base64, io, json, os, sys
from datetime import datetime

import numpy as np
import pandas as pd
import matplotlib
import matplotlib.dates
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import permutation_importance
from sklearn.linear_model import RidgeCV
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import TimeSeriesSplit
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

BG, FG, MUT, ACC = "#0b0b0d", "#ececf0", "#8a8a94", "#7cc4ff"
plt.rcParams.update({"figure.facecolor": BG, "axes.facecolor": BG, "axes.edgecolor": "#2a2a30",
                     "axes.labelcolor": MUT, "xtick.color": MUT, "ytick.color": MUT, "text.color": FG,
                     "font.size": 10, "axes.spines.top": False, "axes.spines.right": False})

FEATURES = {
    "sleep_h": "Uyku süresi (sa)",
    "deep_pct": "Derin uyku oranı",
    "rem_pct": "REM oranı",
    "sleep_eff": "Uyku verimi",
    "bed_dev": "Yatış saati sapması (sa)",
    "volume_t": "Antrenman hacmi (ton)",
    "sets": "Set sayısı",
    "hard_sets": "Ağır set (RPE≥8)",
    "cardio_min": "Kardiyo (dk)",
    "steps_k": "Adım (bin)",
    "load_7d": "7 günlük yük",
    "kcal": "Kalori",
    "protein": "Protein (g)",
    "rec_today": "Bugünkü toparlanma",
    "hrv_z": "HRV sapması (bugün)",
    "rhr_z": "Nabız sapması (bugün)",
    "rest_day": "Dinlenme günü",
}


# ---------------------------------------------------------------- veri
def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def hm(t):
    try:
        h, m = str(t).split(":")[:2]
        return int(h) + int(m) / 60
    except Exception:
        return np.nan


def build_daily(S):
    H = S.get("health") or {}
    if not H:
        raise SystemExit("Yedekte sağlık verisi yok. Saat bağlıyken birkaç hafta kullandıktan sonra tekrar dene.")
    days = pd.date_range(min(H), max(H), freq="D")
    df = pd.DataFrame(index=days)
    for d, x in H.items():
        t = pd.Timestamp(d)
        sl = x.get("sleep") or {}
        mn = sl.get("min")
        df.loc[t, "hrv"] = x.get("hrv")
        df.loc[t, "rhr"] = x.get("rhr")
        df.loc[t, "steps_k"] = (x.get("steps") or np.nan) / 1000 if x.get("steps") is not None else np.nan
        df.loc[t, "sleep_h"] = mn / 60 if mn else np.nan
        df.loc[t, "deep_pct"] = (sl.get("deep") or 0) / mn if mn else np.nan
        df.loc[t, "rem_pct"] = (sl.get("rem") or 0) / mn if mn else np.nan
        df.loc[t, "sleep_eff"] = (sl.get("eff") or np.nan) / 100 if sl.get("eff") else np.nan
        b = hm(sl.get("bed")) if sl.get("bed") else np.nan
        df.loc[t, "bed_h"] = b + 24 if b == b and b < 12 else b
    # antrenman
    vol, sets, hard = {}, {}, {}
    for s in S.get("sessions") or []:
        d = pd.to_datetime(s.get("date"), utc=True).tz_convert(None).normalize()
        for st in s.get("sets") or []:
            kg, r = float(st.get("kg") or 0), float(st.get("reps") or 0)
            vol[d] = vol.get(d, 0) + kg * r / 1000
            sets[d] = sets.get(d, 0) + 1
            if (st.get("rpe") or 0) and float(st.get("rpe")) >= 8:
                hard[d] = hard.get(d, 0) + 1
    card = {}
    for c in S.get("cardio") or []:
        d = pd.Timestamp(c.get("date"))
        card[d] = card.get(d, 0) + float(c.get("min") or 0)
    kc, pr = {}, {}
    for m in S.get("meals") or []:
        d = pd.Timestamp(m.get("date"))
        kc[d] = kc.get(d, 0) + float(m.get("kcal") or 0)
        pr[d] = pr.get(d, 0) + float(m.get("p") or 0)
    for name, src in [("volume_t", vol), ("sets", sets), ("hard_sets", hard), ("cardio_min", card), ("kcal", kc), ("protein", pr)]:
        df[name] = pd.Series(src).reindex(df.index).fillna(0)
    df.loc[df["kcal"] == 0, ["kcal", "protein"]] = np.nan  # kayıt yoksa bilinmiyor
    return df


def add_target(df):
    lh = np.log(df["hrv"].where(df["hrv"] > 0))
    base_h = lh.shift(1).rolling(30, min_periods=7)
    base_r = df["rhr"].shift(1).rolling(30, min_periods=7)
    df["hrv_z"] = (lh - base_h.mean()) / base_h.std().clip(lower=0.03)
    df["rhr_z"] = (df["rhr"] - base_r.mean()) / base_r.std().clip(lower=1)
    z = 0.7 * df["hrv_z"].fillna(0) - 0.3 * df["rhr_z"].fillna(0)
    df["rec"] = (50 + 18 * z).clip(0, 100).where(df["hrv_z"].notna() | df["rhr_z"].notna())
    df["rec_today"] = df["rec"]
    df["bed_dev"] = (df["bed_h"] - df["bed_h"].rolling(14, min_periods=5).median()).abs()
    df["load_7d"] = (df["volume_t"] * 10 + df["cardio_min"] / 6).rolling(7, min_periods=1).sum()
    df["rest_day"] = ((df["sets"] == 0) & (df["cardio_min"] == 0)).astype(float)
    df["target"] = df["rec"].shift(-1)  # yarın sabah
    return df


# ---------------------------------------------------------------- modelleme
def evaluate(df):
    data = df.dropna(subset=["target", "rec_today"]).copy()
    if len(data) < 30:
        raise SystemExit(f"Model için yeterli gün yok ({len(data)}). En az 30 günlük HRV/nabız verisi gerekli.")
    X = data[list(FEATURES)].copy()
    X = X.fillna(X.median())
    y = data["target"].values
    ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=np.logspace(-2, 3, 20)))
    gbm = HistGradientBoostingRegressor(max_depth=3, learning_rate=0.05, max_iter=250, l2_regularization=1.0, random_state=0)
    tss = TimeSeriesSplit(n_splits=min(5, max(2, len(data) // 15)))
    P = {k: np.full(len(y), np.nan) for k in ["Kalıcılık", "7 gün ort.", "Ridge", "Gradient boosting"]}
    for tr, te in tss.split(X):
        P["Kalıcılık"][te] = data["rec_today"].values[te]
        P["7 gün ort."][te] = data["rec"].rolling(7, min_periods=1).mean().values[te]
        ridge.fit(X.iloc[tr], y[tr]); P["Ridge"][te] = ridge.predict(X.iloc[te])
        gbm.fit(X.iloc[tr], y[tr]); P["Gradient boosting"][te] = gbm.predict(X.iloc[te])
    m = ~np.isnan(P["Ridge"])
    scores = {k: {"MAE": mean_absolute_error(y[m], v[m]), "R2": r2_score(y[m], v[m])} for k, v in P.items()}
    # final modeller tüm veriyle
    ridge.fit(X, y); gbm.fit(X, y)
    imp = permutation_importance(gbm, X, y, n_repeats=15, random_state=0)
    return data, X, y, P, m, scores, ridge, gbm, imp


def export_ridge(ridge, X, path):
    sc, rg = ridge.named_steps["standardscaler"], ridge.named_steps["ridgecv"]
    model = {"type": "ridge", "target": "next_morning_recovery_0_100", "created": datetime.now().isoformat(timespec="seconds"),
             "intercept": float(rg.intercept_), "alpha": float(rg.alpha_),
             "features": [{"key": k, "label": FEATURES[k], "mean": float(m), "std": float(s), "coef": float(c), "fill": float(X[k].median())}
                          for k, m, s, c in zip(X.columns, sc.mean_, sc.scale_, rg.coef_)]}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(model, f, ensure_ascii=False, indent=1)
    return model


# ---------------------------------------------------------------- rapor
def b64(fig):
    buf = io.BytesIO(); fig.savefig(buf, format="png", dpi=144, bbox_inches="tight"); plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def report(df, out):
    os.makedirs(out, exist_ok=True)
    data, X, y, P, m, scores, ridge, gbm, imp = evaluate(df)
    model = export_ridge(ridge, X, os.path.join(out, "recovery_model.json"))

    # tahmin vs gerçek
    fig, ax = plt.subplots(figsize=(7.2, 2.8))
    idx = data.index[m]
    ax.plot(idx, y[m], color=FG, lw=1.4, label="gerçek")
    ax.plot(idx, P["Ridge"][m], color=ACC, lw=1.4, label="Ridge tahmini")
    ax.plot(idx, P["Kalıcılık"][m], color="#55555e", lw=1, ls="--", label="yarın = bugün")
    ax.set_ylabel("toparlanma"); ax.legend(frameon=False, fontsize=8)
    ax.xaxis.set_major_locator(matplotlib.dates.MonthLocator()); ax.xaxis.set_major_formatter(matplotlib.dates.DateFormatter("%b"))
    img_ts = b64(fig)

    # önem
    order = np.argsort(imp.importances_mean)[::-1][:10]
    fig, ax = plt.subplots(figsize=(7.2, 3.2))
    ax.barh([FEATURES[X.columns[i]] for i in order][::-1], imp.importances_mean[order][::-1], color=ACC)
    ax.set_xlabel("MAE artışı (özellik karıştırılınca)")
    img_imp = b64(fig)

    # ridge katsayıları (yön)
    coefs = sorted(model["features"], key=lambda f: -abs(f["coef"]))[:8]
    coef_rows = "".join(f"<tr><td>{f['label']}</td><td style='color:{ACC if f['coef']>0 else '#ff9a7a'}'>{f['coef']:+.2f}</td></tr>" for f in coefs)

    # yarın için tahmin
    last = df.iloc[[-1]][list(FEATURES)].copy().fillna(X.median())
    tomorrow_r = float(np.clip(ridge.predict(last)[0], 0, 100))
    tomorrow_g = float(np.clip(gbm.predict(last)[0], 0, 100))

    best = min(scores, key=lambda k: scores[k]["MAE"])
    rows = "".join(f"<tr{' class=b' if k==best else ''}><td>{k}</td><td>{v['MAE']:.1f}</td><td>{v['R2']:.2f}</td></tr>" for k, v in scores.items())
    html = f"""<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>HypeMode toparlanma modeli</title><style>
body{{background:{BG};color:{FG};font:15px/1.5 -apple-system,Inter,sans-serif;max-width:760px;margin:0 auto;padding:28px 18px}}
h1{{font-size:28px;margin:0}} .sub{{color:{MUT};font:12px ui-monospace,Menlo,monospace;margin-bottom:22px}}
section{{border-top:1px solid #222;padding:16px 0}} h2{{font:600 13px ui-monospace,Menlo,monospace;color:{MUT};margin:0 0 10px}}
img{{width:100%;border-radius:8px}} table{{width:100%;border-collapse:collapse}} td{{padding:6px 0;border-bottom:1px solid #1d1d22}} td+td{{text-align:right;font-family:ui-monospace,Menlo,monospace}}
tr.b td{{color:{ACC}}} .big{{font:500 64px/1 Oswald,Inter,sans-serif}} .big small{{font-size:16px;color:{MUT}}}
</style><h1>Toparlanma tahmini</h1><div class="sub">{datetime.now():%d.%m.%Y %H:%M} · {len(data)} gün · yerel analiz</div>
<section><h2>yarın sabah için tahmin</h2><div class="big">{tomorrow_r:.0f}<small> / 100 · Ridge</small></div>
<p style="color:{MUT};font-size:13px">Gradient boosting: {tomorrow_g:.0f}. Bugünkü değerler kullanıldı; bu gecenin uykusu henüz bilinmediği için gerçek değer farklı olabilir.</p></section>
<section><h2>modeller (zaman sıralı çapraz doğrulama, düşük MAE daha iyi)</h2><table><tr><td><b>Model</b></td><td><b>MAE</b></td><td><b>R²</b></td></tr>{rows}</table>
<p style="color:{MUT};font-size:13px">Model, "yarın = bugün" tabanından iyi değilse henüz yeterli veri yok demektir; birkaç hafta sonra tekrar çalıştır.</p></section>
<section><h2>tahmin ve gerçek</h2><img src="data:image/png;base64,{img_ts}"></section>
<section><h2>toparlanmanı en çok etkileyenler</h2><img src="data:image/png;base64,{img_imp}"></section>
<section><h2>yön (Ridge katsayıları, standartlaştırılmış)</h2><table>{coef_rows}</table>
<p style="color:{MUT};font-size:13px">Pozitif: arttıkça yarın daha iyi toparlanıyorsun. Negatif: arttıkça toparlanman düşüyor. İlişkidir, kesin neden-sonuç değildir.</p></section>
<section><h2>uygulamaya aktarım</h2><p style="font-size:13px;color:{MUT}"><code>recovery_model.json</code> yalnızca ortalama, sapma ve katsayılardan oluşur; uygulama bunu okuyup cihazda tahmin yapabilir.</p></section>
</html>"""
    p = os.path.join(out, "toparlanma_modeli.html")
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    return p, scores, tomorrow_r


# ---------------------------------------------------------------- sentetik veri
def demo_backup(days=120, seed=7):
    """Gerçekçi ilişkiler içeren sentetik yedek (test ve gösterim için)."""
    rng = np.random.default_rng(seed)
    S = {"health": {}, "sessions": [], "cardio": [], "meals": []}
    start = pd.Timestamp("2026-07-01")
    lh, rhr = np.log(65), 60.0
    load, prev_hard, prev_sleep = 0.0, 0, 7.2
    for i in range(days):
        d = start + pd.Timedelta(days=i)
        ds = d.strftime("%Y-%m-%d")
        sleep = float(np.clip(rng.normal(7.2, 0.8), 4.5, 9.5))
        train = rng.random() < 0.55
        vol = float(rng.normal(9, 2.5)) if train else 0.0
        hard = int(rng.integers(3, 10)) if train else 0
        kcal = float(rng.normal(2400, 250))
        # bu sabahın fizyolojisi: dün geceki uyku ve dünkü yük belirler
        lh = 0.6 * lh + 0.4 * np.log(65) + 0.03 * (sleep - 7.2) + 0.015 * (prev_sleep - 7.2) - 0.014 * prev_hard - 0.003 * load + rng.normal(0, 0.04)
        rhr = 0.6 * rhr + 0.4 * 60 - 0.8 * (sleep - 7.2) + 0.18 * prev_hard + rng.normal(0, 1)
        load = 0.7 * load + vol
        prev_hard, prev_sleep = hard, sleep
        S["health"][ds] = {"hrv": round(float(np.exp(lh))), "rhr": round(rhr), "steps": int(rng.normal(8000, 2500)),
                           "sleep": {"min": int(sleep * 60), "deep": int(sleep * 60 * rng.uniform(.13, .22)),
                                     "rem": int(sleep * 60 * rng.uniform(.18, .26)), "eff": int(rng.uniform(85, 96)),
                                     "bed": f"{int(23 + rng.normal(0, .6)) % 24:02d}:{int(rng.integers(0, 59)):02d}"}}
        if train:
            S["sessions"].append({"id": f"s{i}", "date": ds + "T18:00:00Z",
                                  "sets": [{"kg": vol * 1000 / 8 / 18, "reps": 8, "rpe": 9 if k < hard else 7} for k in range(18)]})
        S["meals"].append({"date": ds, "kcal": kcal, "p": float(rng.normal(140, 20))})
    return S


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("backup", nargs="?", help="Uygulamadan indirilen yedek JSON dosyası")
    ap.add_argument("--demo", action="store_true", help="Sentetik veriyle çalıştır")
    ap.add_argument("-o", "--out", default="rapor")
    a = ap.parse_args()
    if not a.backup and not a.demo:
        ap.error("yedek dosyası ver ya da --demo kullan")
    S = demo_backup() if a.demo else load(a.backup)
    df = add_target(build_daily(S))
    p, scores, t = report(df, a.out)
    for k, v in scores.items():
        print(f"{k:20s} MAE {v['MAE']:5.1f}  R² {v['R2']:5.2f}")
    print(f"Yarın sabah tahmini toparlanma: {t:.0f}/100")
    print("Rapor:", p)


if __name__ == "__main__":
    sys.exit(main())
