"""The movie IS the website: a native-scroll-controlled, full-viewport film."""
from pathlib import Path
from html import escape
import json
ROOT=Path(__file__).resolve().parents[1]
BASE='/flagship-portfolio-v3'
ASSET=BASE+'/media/talent-atlas'
chapters=[
 [0,'The problem','المشكلة',.13,.68],
 [10,'Talent Atlas','Talent Atlas',.13,.82],
 [16,'Define the role','تحديد الدور',.14,.65],
 [24,'Plan the source','خطة الاستقطاب',.22,.82],
 [32,'Permission first','الموافقة أولًا',.14,.73],
 [40,'Evidence, not appearances','الأدلة لا المظاهر',.50,.50],
 [44,'Review the evidence','مراجعة الأدلة',.20,.76],
 [52,'One rubric. For everyone.','معايير واحدة للجميع',.50,.50],
 [56,'Assess the work','تقييم العمل',.17,.67],
 [64,'A human decides','القرار للإنسان',.17,.72],
 [72,'Your workspace','مساحة عملك',.20,.75],
 [78,'In development','قيد التطوير',.22,.70],
 [82,'Closer to the source','أقرب إلى المصدر',.5,.5]
]
for lang in ['en','ar']:
 en=lang=='en'; other='ar' if en else 'en'
 title='Talent Atlas — A scroll film' if en else 'Talent Atlas — فيلم يقوده التمرير'
 desc='The film is the website. Scroll forward and backward through Talent Atlas, from sourcing and permission to evidence and human review.' if en else 'الفيلم هو الموقع. مرّر إلى الأمام والخلف داخل Talent Atlas، من الاستقطاب والموافقة إلى الأدلة والمراجعة البشرية.'
 route=f'{BASE}/{lang}/work/talent-atlas/'
 names=[dict(start=c[0],title=c[1 if en else 2],panStart=c[3],panEnd=c[4]) for c in chapters]
 buttons=''.join(f'<button type="button" data-chapter="{c[0]}"><time>{c[0]//60:02}:{c[0]%60:02}</time>{c[1 if en else 2]}</button>' for c in chapters)
 note=('This product film uses real interface captures and fictional demo records. Provider connections and production AI agents remain in development. Film V2.1 is separate from the software version.' if en else 'يستخدم الفيلم لقطات فعلية للواجهة وبيانات تجريبية خيالية. ربط الحسابات ووكلاء الذكاء الاصطناعي للإنتاج قيد التطوير. إصدار الفيلم V2.1 مستقل عن إصدار البرنامج.')
 transcript=('Layers of intermediaries obscure the candidate. Talent Atlas brings the role, sourcing plan, permission, evidence, assessment rubric and saved human review into view. The checker-shadow and equal-circle illusions ask the reviewer to look beyond appearances. Local exports and light/dark views follow. Planned integrations are clearly marked in development. An original piano score and interface sounds accompany the film; there is no spoken narration.' if en else 'تحجب طبقات الوسطاء رؤية المرشح. يكشف Talent Atlas عن الدور وخطة الاستقطاب والموافقة والأدلة ومعايير التقييم والمراجعة البشرية المحفوظة. تدعو خدعتا الظل والدوائر المتساوية إلى النظر خلف المظاهر. ثم يظهر التصدير المحلي والوضعان الفاتح والداكن. تُعرض الاتصالات المخططة بوصفها قيد التطوير. يرافق الفيلم بيانو أصلي ومؤثرات للواجهة دون تعليق صوتي.')
 html=f'''<!doctype html>
<html lang="{lang}" dir="{"ltr" if en else "rtl"}" data-framing="fit">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#17181a">
<title>{title} — Mohamed Mahmoud</title><meta name="description" content="{desc}"><link rel="canonical" href="https://mohamed3042.github.io{route}">
<link rel="alternate" hreflang="en" href="https://mohamed3042.github.io{BASE}/en/work/talent-atlas/"><link rel="alternate" hreflang="ar" href="https://mohamed3042.github.io{BASE}/ar/work/talent-atlas/">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:type" content="website"><meta property="og:image" content="https://mohamed3042.github.io{ASSET}/film-poster.webp"><meta property="og:url" content="https://mohamed3042.github.io{route}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{BASE}/apple-touch-icon.png"><link rel="preload" as="image" href="{ASSET}/scroll-poster.webp"><link rel="stylesheet" href="{ASSET}/scroll-film.css?v=1"><script defer src="{ASSET}/scroll-film.js?v=1"></script></head>
<body><a class="skip" href="#timeline">{"Skip to film controls" if en else "انتقل إلى عناصر التحكم"}</a>
<header class="chrome"><a class="home" href="{BASE}/{lang}/collection/#work" aria-label="{"Return to portfolio" if en else "العودة إلى معرض الأعمال"}">← <span>REFRACTION</span></a><div class="identity" dir="ltr">MK TALENT ATLAS</div>
<nav class="actions" aria-label="{"Film controls" if en else "التحكم في الفيلم"}">
<button class="play" type="button" data-play>▶ {"Play + sound" if en else "تشغيل بصوت"}</button>
<button type="button" data-fit aria-pressed="true">{"Fill screen" if en else "ملء الشاشة"}</button>
<button class="fullscreen" type="button" data-fullscreen aria-label="{"Fullscreen" if en else "ملء الشاشة"}">⛶</button>
<a href="{BASE}/{other}/work/talent-atlas/" lang="{other}">{"عربي" if en else "EN"}</a></nav></header>
<main class="reel" id="film"><h1 class="sr-only">{title}</h1><div class="viewport"><div class="picture">
<img src="{ASSET}/scroll-poster.webp" alt="" aria-hidden="true" width="1280" height="720">
<video muted playsinline preload="auto" disablepictureinpicture aria-label="{title}" data-phone="{ASSET}/film-scroll-phone.mp4" data-desktop="{ASSET}/film-scroll-desktop.mp4">
<track kind="captions" src="{ASSET}/captions-en.vtt" srclang="en" label="English"><track kind="captions" src="{ASSET}/captions-ar.vtt" srclang="ar" label="العربية"></video>
</div></div></main>
<div class="hint" data-hint><p data-hint-title>{"Scroll to enter the film" if en else "مرّر للدخول إلى الفيلم"} ↓</p><small data-hint-detail>{"Your scroll moves the picture. Forward and back." if en else "تمريرك يحرّك الصورة، إلى الأمام والخلف."}</small><button type="button" data-enable hidden>{"Enable scroll film" if en else "تفعيل الفيلم بالتمرير"}</button></div>
<p class="notice" role="status" data-status></p>
<a class="end-link" data-end hidden href="{BASE}/{lang}/collection/#work">{"Back to the portfolio" if en else "العودة إلى معرض الأعمال"} ↗</a>
<div class="controls"><div class="control-row"><div class="chapter"><span data-count dir="ltr">01 / 13</span><strong data-title>{names[0]['title']}</strong></div><span class="time"><span data-time>00:00</span> / 01:30</span><div class="chapter-tools"><button type="button" data-previous aria-label="{"Previous chapter" if en else "الفصل السابق"}">←</button><button type="button" data-chapters>{"Chapters" if en else "الفصول"}</button><button type="button" data-next aria-label="{"Next chapter" if en else "الفصل التالي"}">→</button></div></div>
<label class="sr-only" for="timeline">{"Film position in seconds" if en else "موضع الفيلم بالثواني"}</label><input class="timeline" id="timeline" type="range" min="0" max="89.966667" step="0.033333" value="0" aria-valuetext="00:00 / 01:30"></div>
<dialog aria-labelledby="chapters-title"><header><h2 id="chapters-title">{"Inside Talent Atlas" if en else "داخل Talent Atlas"}</h2><button type="button" data-close aria-label="{"Close chapters" if en else "إغلاق الفصول"}">×</button></header>
<div class="chapter-list">{buttons}</div><div class="film-note"><p>{note}</p><p><a href="{ASSET}/talent-atlas-film-v2.1.mp4">{"Open the complete film" if en else "افتح الفيلم كاملًا"} ↗</a></p><details><summary>{"Read the film’s story" if en else "اقرأ قصة الفيلم"}</summary><p>{transcript}</p></details></div></dialog>
<script type="application/json" id="film-chapters">{json.dumps(names,ensure_ascii=False)}</script>
<noscript><div class="no-script"><p>{desc}</p><a href="{ASSET}/talent-atlas-film-v2.1.mp4">{"Play the complete film" if en else "شغّل الفيلم كاملًا"} ↗</a></div></noscript>
</body></html>'''
 path=ROOT/lang/'work/talent-atlas/index.html';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(html,encoding='utf-8',newline='\n')
 print(path.relative_to(ROOT))
