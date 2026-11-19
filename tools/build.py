#!/usr/bin/env python3
"""HypeMode: src/ altındaki kaynak dosyalarını manifest sırasıyla birleştirip tek dosyalık uygulamayı üretir.
Kullanım: python3 tools/build.py [src klasörü] [çıktı dosyası]"""
import json, os, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'src'
out = sys.argv[2] if len(sys.argv) > 2 else 'build/index.html'
order = json.load(open(os.path.join(src, 'manifest.json')))
html = ''.join(open(os.path.join(src, n), encoding='utf-8', newline='').read() for n in order)
os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
open(out, 'w', encoding='utf-8', newline='').write(html)
print(len(order), 'dosya →', out, f'({len(html)//1024} KB)')
