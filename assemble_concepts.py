#!/usr/bin/env python3
# Assemble concept preview files = clean base (main) + additive concept layer (css/js) + GSAP + A/B/C switcher.
# Body content stays byte-identical to the base -> credibility/content guaranteed intact.
import io, os, sys

BASE = '_concept_base.html'
CONCEPTS = [
    ('a', 'cA', 'Command Center'),
    ('b', 'cB', 'Neural'),
    ('c', 'cC', 'Cinematic'),
]

GSAP = (
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n'
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n'
)

def switcher(active_key, available):
    chips = []
    for k, _cls, label in CONCEPTS:
        if k not in available:
            continue
        is_on = (k == active_key)
        style = (
            'padding:7px 12px;border-radius:999px;text-decoration:none;letter-spacing:.04em;'
            'transition:background .2s,color .2s;'
            + ('background:#00B4D8;color:#001;' if is_on else 'background:transparent;color:#cfd6da;')
        )
        chips.append(f'<a href="preview-concept-{k}.html" style="{style}">{k.upper()} · {label}</a>')
    inner = ''.join(chips)
    return (
        '<div id="conceptSwitch" aria-label="Comparer les concepts (preview locale)" '
        'style="position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;'
        'display:flex;gap:4px;padding:5px;border-radius:999px;background:rgba(8,10,12,.62);'
        "backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.16);box-shadow:0 10px 40px rgba(0,0,0,.4);"
        "font:600 12px/1 'Manrope',system-ui,sans-serif\">"
        + inner + '</div>'
    )

def build(base, key, cls, label, available):
    css = io.open(f'layer_{key}.css', encoding='utf-8').read()
    js = io.open(f'layer_{key}.js', encoding='utf-8').read()
    s = base
    head_inject = GSAP + f'<style id="concept-{key}">\n{css}\n</style>\n</head>'
    assert s.count('</head>') == 1, 'head anchor'
    s = s.replace('</head>', head_inject, 1)
    body_inject = (
        f'<script id="concept-js-{key}">\n{js}\n</script>\n'
        + switcher(key, available) + '\n</body>'
    )
    assert s.count('</body>') == 1, 'body anchor'
    s = s.replace('</body>', body_inject, 1)
    out = f'preview-concept-{key}.html'
    io.open(out, 'w', encoding='utf-8', newline='').write(s)
    return out, len(s)

def main():
    base = io.open(BASE, encoding='utf-8').read()
    available = [k for k, _c, _l in CONCEPTS
                 if os.path.exists(f'layer_{k}.css') and os.path.exists(f'layer_{k}.js')]
    print('available concepts:', available)
    for key, cls, label in CONCEPTS:
        if key not in available:
            print(f'SKIP {key}: layer files missing')
            continue
        out, n = build(base, key, cls, label, available)
        print(f'WROTE {out} ({n} bytes)')

if __name__ == '__main__':
    main()
