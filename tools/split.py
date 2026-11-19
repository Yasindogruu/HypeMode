#!/usr/bin/env python3
"""HypeMode: tek dosyalık geliştirme kopyasını (index.html) okunur kaynak dosyalarına böler.
Kullanım: python3 tools/split.py <kaynak index.html> <src klasörü>
Bölme kayıpsızdır: tools/build.py aynı dosyayı byte byte geri üretir."""
import json, os, re, sys

# JS bölümleri: bu başlıklardan biriyle başlayan satırda yeni dosya başlar (sırayla)
JS = [
    (None, 'js/core.js'),
    ('/* ===== Performans ölçümü', 'js/perf/metrics.js'),
    ('/* ===== Kalıcı depolama', 'js/storage.js'),
    ('/* ---------- besin veritabanı', 'js/data-and-sync.js'),
    ('/* ===== Google Health API', 'js/health/google-health.js'),
    ('/* ===== iOS uygulaması (WKWebView', 'js/health/ios-bridge.js'),
    ('/* ===== v2: ana ekran mini kartları', 'js/health/health-views.js'),
    ('/* ================= Set türleri', 'js/workout/workout-extras.js'),
    ('/* ================= Regl döngüsü', 'js/health/cycle.js'),
    ('/* ================= Giriş (onboarding)', 'js/onboarding.js'),
    ('/* ================= Arkadaşlar', 'js/social/friends.js'),
    ('/* ===== Dil (TR / EN)', 'js/i18n.js'),
    ('/* ================= Uyarlanabilir kalori', 'js/nutrition/adaptive.js'),
    ('/* ===== Hızlı çizim', 'js/perf/morph.js'),
    ('/* ===== Araçlar v2', 'js/tools.js'),
    ('/* ===== Egzersiz Akademisi ===== */\nconst', 'js/workout/academy.js'),
    ('/* ===== Vücut tahmini (Bugün)', 'js/app.js'),
    ('/* ===== Sağlık durumu: diyabet', 'js/health/conditions.js'),
    ('/* ===== Beslenme programları', 'js/nutrition/programs.js'),
    ('/* ===== Haftalık beslenme programı', 'js/nutrition/weekly-plan.js'),
    ('/* ===== Kişiye özel antrenman programı', 'js/workout/program-generator.js'),
    ('/* ===== Rehber', 'js/guide-progress.js'),
    ('/* ===== Tahlil sonuçları', 'js/health/labs.js'),
    ('/* ===== Yenilikler', 'js/news.js'),
    ('/* ===== Hesap önbelleği', 'js/perf/runtime.js'),
]
CSS2 = [
    (None, 'css/app.css'),
    ('/* ===== Masaüstü (bilgisayar tarayıcısı)', 'css/desktop.css'),
    ('/* ===== v2: açılışla uyumlu görsel dil', 'css/theme.css'),
]

def cut(text, marks):
    """text'i işaretlere göre parçalar; işaret bulunamazsa o parça atlanır."""
    pos = [(0, marks[0][1])]
    start = 0
    for m, name in marks[1:]:
        i = text.find(m, start)
        if i < 0:
            continue
        pos.append((i, name)); start = i + 1
    out = []
    for k, (i, name) in enumerate(pos):
        j = pos[k + 1][0] if k + 1 < len(pos) else len(text)
        out.append((name, text[i:j]))
    return out

def main(src, dst):
    s = open(src, encoding='utf-8').read()
    parts = []  # (dosya, içerik)
    blocks = [(m.start(), m.end(), m.group(1), m.group(0)) for m in re.finditer(r'<(style|script)[^>]*>', s)]
    pos, n_style, html_n = 0, 0, 0
    for (a, b, tag, open_tag) in blocks:
        e = s.find('</%s>' % tag, b)
        html_n += 1
        parts.append(('html/%02d.html' % html_n, s[pos:b]))
        body = s[b:e]
        if tag == 'style':
            n_style += 1
            parts += [('css/base.css', body)] if n_style == 1 else cut(body, CSS2)
        elif 'application/json' in open_tag:
            parts.append(('i18n/en.json', body))
        else:
            parts += cut(body, JS)
        pos = e
    html_n += 1
    parts.append(('html/%02d.html' % html_n, s[pos:]))
    # yaz
    for root, _, files in os.walk(dst):
        for f in files:
            if f != 'README.md':
                os.remove(os.path.join(root, f))
    for name, body in parts:
        p = os.path.join(dst, name); os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, 'w', encoding='utf-8', newline='').write(body)
    json.dump([n for n, _ in parts], open(os.path.join(dst, 'manifest.json'), 'w'), indent=1)
    assert ''.join(b for _, b in parts) == s
    print(len(parts), 'parça →', dst)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
