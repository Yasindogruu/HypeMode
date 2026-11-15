# Python tools

```bash
pip install -r tools/requirements.txt
```

| Tool | What it does |
|---|---|
| `analyze.py` | Turns an app backup (Settings → Data → Download backup) into an HTML report and CSVs: training volume, 1RM progress, HRV and resting HR trends, sleep, sleep ↔ training correlation, nutrition and weight. Runs locally. |
| `recovery_model.py` | Predicts tomorrow morning's recovery (0–100) from today's sleep, training load, steps, nutrition and overnight vitals. Compares ridge regression and gradient boosting against a baseline with time-series cross-validation, shows the top factors and exports `recovery_model.json`. Try it with `--demo`. |
| `screenshots.py` | Captures the README screenshots with sample data (Playwright). |

```bash
python tools/analyze.py backup.json -o report
python tools/recovery_model.py backup.json -o report
python tools/recovery_model.py --demo -o report
python tools/screenshots.py -o docs/screenshots
```
