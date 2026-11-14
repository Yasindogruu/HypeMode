# Python araçları

```bash
pip install -r tools/requirements.txt
```

| Araç | Ne yapar |
|---|---|
| `analyze.py` | Uygulamadan indirdiğin yedek JSON'ını (Ayarlar → Depolama & veri → Yedeği indir) analiz eder: haftalık hacim, tahmini 1RM gelişimi, HRV/dinlenik nabız trendi, uyku istatistikleri, uyku ↔ antrenman ilişkisi (korelasyon + doğrusal model), beslenme ve kilo değişimi. Grafikli bir `rapor.html` ve CSV dosyaları üretir. Tamamen yerel çalışır. |
| `recovery_model.py` | **Toparlanma tahmini modeli.** Bugünkü uyku, antrenman yükü, adım, beslenme ve gece ölçümlerinden yarın sabahki toparlanmanı (0–100) tahmin eder. Ridge regresyon ve gradient boosting'i "yarın = bugün" tabanıyla zaman sıralı çapraz doğrulamada karşılaştırır, seni en çok etkileyen faktörleri gösterir ve uygulamaya taşınabilir model dosyası (`recovery_model.json`) üretir. `--demo` ile sentetik veriyle denenebilir. |
| `screenshots.py` | README galerisindeki ekran görüntülerini örnek veriyle otomatik çeker (Playwright). |

```bash
python tools/analyze.py hypemode-yedek-2026-11-14.json -o rapor
python tools/recovery_model.py hypemode-yedek-2026-11-14.json -o rapor
python tools/recovery_model.py --demo -o rapor   # örnek veriyle
python tools/screenshots.py -o docs/screenshots
```
