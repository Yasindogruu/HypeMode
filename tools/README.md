# Python araçları

```bash
pip install -r tools/requirements.txt
```

| Araç | Ne yapar |
|---|---|
| `analyze.py` | Uygulamadan indirdiğin yedek JSON'ını (Ayarlar → Depolama & veri → Yedeği indir) analiz eder: haftalık hacim, tahmini 1RM gelişimi, HRV/dinlenik nabız trendi, uyku istatistikleri, uyku ↔ antrenman ilişkisi (korelasyon + doğrusal model), beslenme ve kilo değişimi. Grafikli bir `rapor.html` ve CSV dosyaları üretir. Tamamen yerel çalışır. |
| `screenshots.py` | README galerisindeki ekran görüntülerini örnek veriyle otomatik çeker (Playwright). |

```bash
python tools/analyze.py hypemode-yedek-2026-11-14.json -o rapor
python tools/screenshots.py -o docs/screenshots
```
