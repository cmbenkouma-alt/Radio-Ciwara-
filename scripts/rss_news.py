#!/usr/bin/env python3
import json,re,urllib.request,xml.etree.ElementTree as ET
from datetime import datetime,timezone
from pathlib import Path

OUT=Path('data/news.json'); CIWARA_OUT=Path('data/ciwara-info.json')
FEEDS=[('Malijet','https://malijet.com/rss'),('Maliweb','https://www.maliweb.net/rss/latest-posts')]
CIWARA_FEED='https://www.maliweb.net/author/CiwaraInfo/feed/'

def clean(v):
    v=re.sub(r'<!\[CDATA\[|\]\]>','',v or '');v=re.sub(r'<[^>]+>',' ',v);return re.sub(r'\s+',' ',v).strip()

def fetch(source,url,limit=30):
    req=urllib.request.Request(url,headers={'User-Agent':'Radio-Ciwara-RSS/2.0 (+https://www.ciwara-medias.ml/)'})
    with urllib.request.urlopen(req,timeout=25) as r: root=ET.fromstring(r.read())
    rows=[]
    nodes=root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')
    for item in nodes[:limit]:
        def val(names):
            for n in names:
                x=item.find(n)
                if x is not None and x.text:return clean(x.text)
            return ''
        title=val(['title','{http://www.w3.org/2005/Atom}title']);link=val(['link','{http://www.w3.org/2005/Atom}link'])
        if not link:
            x=item.find('{http://www.w3.org/2005/Atom}link');link=x.attrib.get('href','') if x is not None else ''
        date=val(['pubDate','published','updated','{http://www.w3.org/2005/Atom}published','{http://www.w3.org/2005/Atom}updated'])
        desc=val(['description','summary','{http://www.w3.org/2005/Atom}summary'])
        if title and link:rows.append({'title':title,'link':link,'source':source,'date':date,'description':desc[:260]})
    return rows

def unique(items,limit):
    seen=set();out=[]
    for x in items:
        k=x['link'].split('#')[0]
        if k in seen:continue
        seen.add(k);out.append(x)
    return out[:limit]

items=[];errors=[]
for source,url in FEEDS:
    try:items.extend(fetch(source,url))
    except Exception as exc:errors.append(f'{source}: {exc}')
ciwara=[]
try:ciwara=fetch('Ciwara Info',CIWARA_FEED,40)
except Exception as exc:errors.append(f'Ciwara Info: {exc}')
if not items and OUT.exists():
    try:items=json.loads(OUT.read_text(encoding='utf-8')).get('items',[])
    except Exception:items=[]
stamp=datetime.now(timezone.utc).isoformat();OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps({'generatedAt':stamp,'items':unique(items,40),'errors':errors},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
CIWARA_OUT.write_text(json.dumps({'generatedAt':stamp,'items':unique(ciwara,40)},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'News={len(items)} CiwaraInfo={len(ciwara)} warnings={len(errors)}')
