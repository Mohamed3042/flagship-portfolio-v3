"""Add Talent Atlas to existing published indexes, preserving other projects."""
from pathlib import Path
from html import escape
import json,re,hashlib
ROOT = Path(__file__).resolve().parents[1]
BASE = '/flagship-portfolio-v3'
for lang in ['en','ar']:
    en = lang == 'en'
    href = f'{BASE}/{lang}/work/talent-atlas/'
    title = 'Talent Atlas'
    description = 'A 90-second film controlled by your scroll. Follow sourcing, permission, evidence and human review.' if en else 'فيلم مدته 90 ثانية يتحكم فيه تمريرك. تتبّع الاستقطاب والموافقة والأدلة والمراجعة البشرية.'
    tag = 'Recruiting workspace' if en else 'مساحة عمل للتوظيف'
    boundary = 'Working prototype shown with fictional demo records. Provider integrations and production AI agents remain in development.' if en else 'نموذج عامل ببيانات تجريبية خيالية. ربط مزودي الخدمات ووكلاء الذكاء الاصطناعي للإنتاج قيد التطوير.'
    image = BASE+'/media/talent-atlas/film-poster.webp'
    item = dict(id='talent-atlas',group='career',title=title,tag=tag,description=description,href=href,external=False,image=image,imageAlt=title,imageLabel='Product film' if en else 'فيلم المنتج',tools=['React','SQLite','Remotion'],stat='90-second product film' if en else 'فيلم للمنتج مدته 90 ثانية',boundary=boundary,search='talent atlas recruiting evidence hiring sourcing consent review توظيف استقطاب أدلة مراجعة موافقة')
    path=ROOT/lang/'collection/index.html'
    s=path.read_text(encoding='utf-8')
    if 'data-gallery-item="talent-atlas"' not in s:
        pattern=r'(<script type="application/json" data-gallery-data>)(.*?)(</script>)'
        match=re.search(pattern,s); assert match
        items=json.loads(match[2]);old=len(items)
        position=next(i for i,x in enumerate(items) if x['id']=='hr-system')
        items.insert(position,item)
        s=s[:match.start(2)]+json.dumps(items,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+s[match.end(2):]
        card=f'''<li class="rg-card" data-gallery-item="talent-atlas" data-group="career" data-search="{item['search']}" style="--project-a:#c54a2b;--project-b:#f2f1ee">
<a class="rg-card-main" href="{href}" data-project="talent-atlas" data-astro-reload><div class="rg-card-art"><img src="{image}" alt="Talent Atlas" width="640" height="400" loading="lazy" decoding="async"><span class="rg-art-label">{item['imageLabel']}</span></div>
<div class="rg-card-copy"><span class="rg-card-number">{position+1:02}</span><div><p class="rg-card-tag">{tag}</p><h4>Talent Atlas</h4><p class="rg-card-description">{description}</p></div><span class="rg-card-arrow" aria-hidden="true">↗</span></div></a>
<button type="button" class="rg-quick rg-js-control" data-gallery-preview="talent-atlas" aria-label="{'Quick view: Talent Atlas' if en else 'نظرة سريعة: Talent Atlas'}">{'Look closer' if en else 'تعرّف أكثر'}<span aria-hidden="true">+</span></button></li>'''
        anchor='<li class="rg-card" data-gallery-item="hr-system"'
        assert anchor in s
        s=s.replace(anchor,card+anchor,1)
        n=[0]
        def renumber(m):n[0]+=1;return m[1]+f'{n[0]:02}'+m[2]
        s=re.sub(r'(<span class="rg-card-number">)\d+(</span>)',renumber,s)
        assert n[0]==len(items),(n[0],len(items))
        s=s.replace(f'01 — {old}</span>',f'01 — {len(items)}</span>',1)
        s=re.sub(r'(<p class="rg-inventory">)\d+',lambda m:m[1]+str(sum(x['group']!='worlds' for x in items)),s,count=1)
        for group in ['all','career']:
            total=len(items) if group=='all' else sum(x['group']=='career' for x in items)
            s=re.sub(r'(data-gallery-filter="'+group+r'"[^>]*>[^<]*<span>)\d+',lambda m:m[1]+str(total),s,count=1)
        s=re.sub(r'(<p data-gallery-count[^>]*>).*?(</p>)',lambda m:m[1]+(f'Showing all {len(items)} works' if en else f'عرض جميع الأعمال وعددها {len(items)}')+m[2],s,count=1)
        path.write_text(s,encoding='utf-8',newline='\n')
    path=ROOT/lang/'cinema/index.html';s=path.read_text(encoding='utf-8')
    if href not in s:
        anchor=f'<a href="{BASE}/{lang}/work/hr-system"'
        index=s.index(anchor)
        begin=s.rfind('<details class="lc-map-work">',0,index)
        end=s.index('</details>',index)+len('</details>')
        block=s[begin:end]
        link=f'<a href="{href}" data-astro-reload>Talent Atlas<span aria-hidden="true">↗</span></a>'
        block=block.replace(anchor,link+anchor,1)
        block=re.sub(r'(<summary>[^<]*· )(\d+)',lambda m:m[1]+str(int(m[2])+1),block,count=1)
        s=s[:begin]+block+s[end:]
        path.write_text(s,encoding='utf-8',newline='\n')
    path=ROOT/lang/'production/index.html';s=path.read_text(encoding='utf-8')
    if 'id="project-talent-atlas"' not in s:
        marker='<article id="project-mk-tones"'
        assert marker in s
        attr='data-astro-cid-tv3qrrlw'
        block=f'<article id="project-talent-atlas" {attr}><h3 {attr}>Talent Atlas</h3><p {attr}>{description}</p><p {attr}>{boundary}</p><a href="{href}" {attr}>{"Explore the product and film" if en else "استكشف المنتج والفيلم"} ↗</a></article>'
        s=s.replace(marker,block+marker,1);path.write_text(s,encoding='utf-8',newline='\n')
    path=ROOT/'sitemap-0.xml';s=path.read_text(encoding='utf-8')
    url='https://mohamed3042.github.io'+href
    if url not in s:
        s=s.replace('</urlset>',f'<url><loc>{url}</loc></url></urlset>')
        path.write_text(s,encoding='utf-8',newline='\n')
# The cinema loader verifies hashes of the existing saved HTML shells.
# Update those entries without adding the opt-in product film to its bulk download.
manifest=ROOT/'cinema-preload.json'
data=json.loads(manifest.read_text(encoding='utf-8'))
for asset in data['assets']:
    if asset['url'] in [BASE+'/en/cinema/index.html',BASE+'/ar/cinema/index.html']:
        body=(ROOT/asset['url'].removeprefix(BASE+'/')).read_bytes()
        asset['bytes']=len(body);asset['revision']=hashlib.sha256(body).hexdigest()
data['version']=hashlib.sha256(json.dumps(data['assets'],separators=(',',':')).encode()).hexdigest()[:16]
manifest.write_text(json.dumps(data,separators=(',',':'))+'\n',encoding='utf-8',newline='\n')
print('Talent Atlas integrated into both project galleries, cinema menus, production notes and sitemap; cached shell hashes refreshed.')
