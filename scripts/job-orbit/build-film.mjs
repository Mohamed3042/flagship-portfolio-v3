import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const base='/flagship-portfolio-v3';
const media=`${base}/media/job-orbit-flight`;
const release='https://github.com/Mohamed3042/motion-video-skill/releases/tag/job-orbit-v2.0';
const fullFilm='https://github.com/Mohamed3042/motion-video-skill/releases/download/job-orbit-v2.0/MK-Job-Orbit-v2-Share-1080p60.mp4';
const chapters=[
 [0,'noise','The job hunt is noise','ضوضاء البحث عن وظيفة'],
 [12,'direction','Noise becomes direction','من الضوضاء إلى الاتجاه'],
 [22,'profile','Profile & resume','الملف والسيرة الذاتية'],
 [30,'globe','The globe','الكرة الأرضية'],
 [38,'findings','New findings','أحدث النتائج'],
 [46,'focus','Job focus','تركيز الوظيفة'],
 [54,'fit','Your fit','مدى الملاءمة'],
 [62,'nextproof','Next proof','الدليل التالي'],
 [70,'market','My market','سوقي'],
 [78,'employers','Employers','أصحاب العمل'],
 [86,'engine','Evidence & agents','الأدلة والوكلاء'],
 [94,'anywhere','Yours, everywhere','معك في كل مكان'],
 [102,'finale','Your next chapter','فصلك القادم'],
];
const clock=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
for(const lang of ['en','ar']){
 const ar=lang==='ar',t=(en,arabic)=>ar?arabic:en;
 const route=`${base}/${lang}/work/job-orbit/`;
 const chapterLinks=chapters.map((c,i)=>`<li><a href="#${c[1]}" data-jump="${c[0]}"><span>${clock(c[0])}</span><b>${c[ar?3:2]}</b><i aria-hidden="true">↗</i></a></li>`).join('');
 const anchors=chapters.map(c=>`<span class="timeline-marker" id="${c[1]}" style="top:calc(var(--travel) * ${c[0]/120})" aria-hidden="true"></span>`).join('');
 const page=`<!doctype html><html lang="${lang}" dir="${ar?'rtl':'ltr'}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#040b36">
<title>${t('Job Engine Orbit — The scroll film','Job Engine Orbit — فيلم بالتمرير')} · Mohamed Mahmoud</title><meta name="description" content="${t('The film is the website. Scroll forward and backward through the complete Job Orbit flight, from job-search noise to ten connected feature worlds.','الفيلم هو الموقع. مرّر للأمام والخلف عبر رحلة Job Orbit الكاملة، من ضوضاء البحث إلى عشرة عوالم مترابطة.')}">
<link rel="canonical" href="https://mohamed3042.github.io${route}"><link rel="alternate" hreflang="en" href="https://mohamed3042.github.io${base}/en/work/job-orbit/"><link rel="alternate" hreflang="ar" href="https://mohamed3042.github.io${base}/ar/work/job-orbit/">
<meta property="og:type" content="website"><meta property="og:title" content="Job Engine Orbit — The Flight"><meta property="og:description" content="${t('Scroll is the playhead. A complete two-minute film world.','التمرير يتحكم بالفيلم. عالم سينمائي كامل لمدة دقيقتين.')}"><meta property="og:image" content="https://mohamed3042.github.io${media}/poster.webp"><meta property="og:url" content="https://mohamed3042.github.io${route}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${media}/orbit.png">
<link rel="stylesheet" href="${media}/film-world.css"><link rel="preload" as="font" type="font/woff2" crossorigin href="${media}/fonts/space.woff2">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CreativeWork',name:'Job Engine Orbit — The Flight',url:`https://mohamed3042.github.io${route}`,inLanguage:lang,creator:{'@type':'Person',name:'Mohamed Mahmoud'},description:'A scroll-controlled illustrated film with fictional sample data.',video:{'@type':'VideoObject',name:'Job Orbit v2 — The Flight',description:'An illustrated ten-station feature tour. Fictional sample data, not live product footage.',thumbnailUrl:`https://mohamed3042.github.io${media}/poster.webp`,uploadDate:'2026-10-03',duration:'PT2M',contentUrl:fullFilm}})}</script>
</head><body>
<a class="skip" href="#chapter-list">${t('Choose a chapter','اختر فصلاً')}</a>
<header class="world-header"><a href="${base}/${lang}/collection/#products" class="back-link">← <span>${t('Portfolio','المعرض')}</span></a><span class="world-name">JOB ORBIT <i>/ ${t('THE FLIGHT','الرحلة')}</i></span><a class="language" href="${base}/${ar?'en':'ar'}/work/job-orbit/">${ar?'EN':'العربية'}</a></header>
<main id="film-run" class="film-run" aria-label="${t('Job Orbit scroll film','فيلم Job Orbit بالتمرير')}">
<div class="film-stage"><canvas class="film-ambient" width="384" height="216" aria-hidden="true"></canvas><div class="ambient-shade" aria-hidden="true"></div><div class="video-stack"><video class="film-buffer" muted playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true"></video><video class="film-buffer" muted playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true"></video><video class="film-buffer" muted playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true"></video></div>
<div class="film-loading" role="status"><span class="loading-light" aria-hidden="true"></span><span data-load-message>${t('Loading the opening scene…','جارٍ تحميل المشهد الافتتاحي…')}</span><button type="button" data-retry hidden>${t('Try again','أعد المحاولة')}</button></div><p class="scroll-cue">${t('Scroll to fly','مرّر لتبدأ الرحلة')} <span aria-hidden="true">↓</span></p></div>
${anchors}<div class="sr-only"><h1>Job Engine Orbit — The Flight</h1><p>${t('Your scroll controls the actual film. Scrolling down moves forward, scrolling up moves backward, and stopping holds the frame.','التمرير يتحكم بالفيلم الفعلي. التمرير للأسفل يتقدم بالفيلم، والتمرير للأعلى يعكسه، والتوقف يثبت الإطار.')}</p></div>
</main>
<footer class="film-dock"><div class="film-position"><span class="current-chapter">${chapters[0][ar?3:2]}</span><span class="film-clock" dir="ltr"><b data-clock>00:00</b> / 02:00</span></div><div class="film-actions"><button type="button" data-chapters aria-haspopup="dialog">${t('Chapters','الفصول')}</button><button type="button" data-framing aria-pressed="false">${t('Fill screen','ملء الشاشة')}</button><button type="button" data-watch aria-haspopup="dialog">${t('Watch with sound','شاهد مع الصوت')}</button><button type="button" data-about aria-haspopup="dialog" aria-label="${t('About Job Orbit','عن Job Orbit')}">ⓘ</button></div><label class="film-scrubber"><span class="sr-only">${t('Film position in seconds','موضع الفيلم بالثواني')}</span><input type="range" min="0" max="120" step="0.1" value="0" aria-label="${t('Film position in seconds','موضع الفيلم بالثواني')}"></label></footer>
<dialog class="chapter-dialog" aria-labelledby="chapter-title"><div class="dialog-heading"><h2 id="chapter-title">${t('The Flight','الرحلة')}</h2><button type="button" data-close aria-label="${t('Close chapters','إغلاق الفصول')}">×</button></div><p class="dialog-kicker">120 ${t('seconds / one scroll playhead','ثانية / مسار تمرير واحد')}</p><ol id="chapter-list">${chapterLinks}</ol><a class="dialog-download" href="${release}">${t('Download the film & editable source','تنزيل الفيلم والمصدر القابل للتحرير')} ↗</a></dialog>
<dialog class="watch-dialog" aria-label="${t('Watch the complete film with sound','شاهد الفيلم كاملاً مع الصوت')}"><div class="dialog-heading"><h2>${t('The complete film','الفيلم الكامل')}</h2><button type="button" data-close aria-label="${t('Close film player','إغلاق مشغل الفيلم')}">×</button></div><video class="sound-film" controls playsinline preload="none" poster="${media}/poster.webp"></video><p>${t('Close the player to return to your scroll position.','أغلق المشغل للعودة إلى موضع التمرير.')}</p></dialog>
<dialog class="about-dialog" aria-labelledby="about-title"><div class="dialog-heading"><h2 id="about-title">Job Engine Orbit</h2><button type="button" data-close aria-label="${t('Close information','إغلاق المعلومات')}">×</button></div><p>${t('Career evidence, saved opportunity research and a useful next step.','أدلة مهنية وأبحاث فرص محفوظة وخطوة تالية مفيدة.')}</p><p>${t('The film uses fictional sample data and illustrated interfaces. It is not live product footage or proof of a completed application. Research with evidence; applications require review and authorization.','يستخدم الفيلم بيانات نموذجية خيالية وواجهات توضيحية. ليس تسجيلاً مباشراً للمنتج أو دليلاً على إتمام تقديم. البحث قائم على الأدلة، والتقديم يتطلب المراجعة والتفويض.')}</p><p>${t('Local workspace by default, with optional external AI, search and backup services. Phone access opens the PC service over a private connection; the PC must stay awake and Orbit must remain running.','المساحة محلية افتراضياً، مع خدمات خارجية اختيارية للذكاء الاصطناعي والبحث والنسخ الاحتياطي. يفتح الهاتف خدمة الحاسوب عبر اتصال خاص؛ يجب أن يبقى الحاسوب مستيقظاً وOrbit قيد التشغيل.')}</p><a href="https://github.com/Mohamed3042/motion-video-skill/blob/job-orbit-v2/docs/job-orbit/PRODUCT-TRUTH.md">${t('Feature and claim notes','ملاحظات الميزات والادعاءات')} ↗</a><a href="${base}/${lang}/production/#project-job-engine-desktop">${t('Portfolio software notes','توثيق البرمجيات في المعرض')} ↗</a></dialog>
<noscript><div class="no-script"><p>${t('Open the complete film with the native player.','افتح الفيلم الكامل باستخدام المشغل الأصلي.')}</p><a href="${fullFilm}">${t('Watch Job Orbit','شاهد Job Orbit')} ↗</a></div></noscript>
<script id="film-data" type="application/json">${JSON.stringify({lang,media,fullFilm,duration:120,fps:30,clipSeconds:5,clipCount:24,chapters:chapters.map(c=>({start:c[0],id:c[1],title:c[ar?3:2]}))})}</script><script src="${media}/film-world.js?v=2" defer></script></body></html>`;
 const directory=path.join(root,lang,'work/job-orbit');mkdirSync(directory,{recursive:true});writeFileSync(path.join(directory,'index.html'),page);
}
const sitemapPath=path.join(root,'sitemap-0.xml');let sitemap=readFileSync(sitemapPath,'utf8');
for(const lang of ['en','ar']){const url=`https://mohamed3042.github.io${base}/${lang}/work/job-orbit/`;if(!sitemap.includes(`<loc>${url}</loc>`))sitemap=sitemap.replace('</urlset>',`<url><loc>${url}</loc></url></urlset>`);}
writeFileSync(sitemapPath,sitemap);console.log('Built the bilingual scroll-controlled film world.');
