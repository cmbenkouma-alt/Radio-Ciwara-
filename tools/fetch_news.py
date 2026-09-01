#!/usr/bin/env python3
import json, re, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SOURCES=ROOT/'data/news-sources.json'
NEWS=ROOT/'data/news.json'
CIWARA=ROOT/'data/ciwara-info.json'

def clean(v):
    if not v:return ''
    v=re.sub(r'<[^>]+>',' ',v)
    return re.sub(r'\s+',' ',v).strip()

def sanitize(raw):
    text=raw.decode('utf-8',errors='replace')
    text=re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F]','',text)
    text=re.sub(r'&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9A-Fa-f]+;)','&amp;',text)
    return text.encode('utf-8')

def text(node,names):
    for name in names:
        x=node.find(name)
        if x is not None and x.text:return x.text.strip()
    return ''

def parse(feed,name,limit=30):
    req=urllib.request.Request(feed,headers={'User-Agent':'Radio-Ciwara-News/2.0 (+https://www.ciwara-medias.ml/)'})
    with urllib.request.urlopen(req,timeout=25) as r: root=ET.fromstring(sanitize(r.read()))
    nodes=root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')
    out=[]
    for n in nodes[:limit]:
        title=clean(text(n,['title','{http://www.w3.org/2005/Atom}title']))
        link=text(n,['link','{http://www.w3.org/2005/Atom}link'])
        if not link:
            a=n.find('{http://www.w3.org/2005/Atom}link')
            link=a.attrib.get('href','') if a is not None else ''
        desc=clean(text(n,['description','summary','{http://www.w3.org/2005/Atom}summary']))
        date=text(n,['pubDate','published','updated','{http://www.w3.org/2005/Atom}published','{http://www.w3.org/2005/Atom}updated'])
        if title and link: out.append({'title':title,'link':link,'description':desc[:320],'date':date,'source':name})
    return out

def unique(items,limit):
    seen=set();out=[]
    for x in items:
        key=x['link'].split('#')[0]
        if key in seen:continue
        seen.add(key);out.append(x)
    return out[:limit]

cfg=json.loads(SOURCES.read_text(encoding='utf-8'))
news=[];errors=[]
for s in cfg['sources']:
    if not s.get('enabled'):continue
    try: news.extend(parse(s['feed'],s['name']))
    except Exception as e: errors.append({'source':s['name'],'error':str(e)})

# Ciwara Info est un flux éditorial séparé : seuls les éléments de ce flux sont publiés dans la page dédiée.
ciwara=[]
try:
    ciwara=parse('https://www.maliweb.net/author/CiwaraInfo/feed/','Ciwara Info',40)
except Exception as e:
    errors.append({'source':'Ciwara Info','error':str(e)})

stamp=datetime.now(timezone.utc).isoformat()
NEWS.write_text(json.dumps({'generatedAt':stamp,'items':unique(news,40),'errors':errors},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
CIWARA.write_text(json.dumps({'generatedAt':stamp,'items':unique(ciwara,40)},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'RSS: {len(news)} items; Ciwara Info: {len(ciwara)} items; errors: {len(errors)}')
