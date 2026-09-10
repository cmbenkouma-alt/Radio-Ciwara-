#!/usr/bin/env python3
import json,re,urllib.request,urllib.parse,xml.etree.ElementTree as ET,time
from datetime import datetime,timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

# Sources éditoriales autorisées pour Ciwara Infos.
FEEDS=[
 ('Malijet','https://malijet.com/rss'),
 ('Maliweb','https://www.maliweb.net/rss/latest-posts')
]
OUT=Path('data/news.json')
PER_SOURCE=20
MAX_ITEMS=80
RETRIES=3
TIMEOUT=30

def clean(v):
 v=re.sub(r'<!\[CDATA\[|\]\]>','',v or '')
 v=re.sub(r'<[^>]+>',' ',v)
 return re.sub(r'\s+',' ',v).strip()

def children(el,names):
 for n in list(el):
  if n.tag.rsplit('}',1)[-1] in names:
   yield n

def text_of(el,names):
 wanted=set(names)
 for n in list(el):
  if n.tag.rsplit('}',1)[-1] in wanted and n.text:
   return clean(n.text)
 return ''

def image_url(item,link):
 for n in children(item,{'enclosure','content','thumbnail','media:content','media:thumbnail'}):
  u=n.attrib.get('url') or n.attrib.get('href')
  if u and re.match(r'https?://',u,re.I):
   return urllib.parse.urljoin(link,u)
 for n in children(item,{'description','encoded','content'}):
  raw=n.text or ''
  m=re.search(r'<img[^>]+(?:src|data-src)=["\']([^"\']+)',raw,re.I)
  if m:
   return urllib.parse.urljoin(link,m.group(1))
 try:
  req=urllib.request.Request(link,headers={'User-Agent':'Mozilla/5.0 Radio-Ciwara'})
  with urllib.request.urlopen(req,timeout=10) as r:
   html=r.read(500000).decode('utf-8','ignore')
  for pat in [r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)']:
   m=re.search(pat,html,re.I)
   if m:
    return urllib.parse.urljoin(link,m.group(1))
 except Exception:
  pass
 return ''

def image_for_site(u):
 if not u:return ''
 if u.startswith('https://'):return u
 return 'https://images.weserv.nl/?url='+urllib.parse.quote(u,safe='')

def parse_date(v):
 try:
  d=parsedate_to_datetime(v)
  return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
 except Exception:
  return datetime.min.replace(tzinfo=timezone.utc)

def fetch(source,url):
 last=None
 for attempt in range(1,RETRIES+1):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'Radio-Ciwara-RSS/6.0','Accept':'application/rss+xml, application/xml, text/xml, */*'})
   with urllib.request.urlopen(req,timeout=TIMEOUT) as r:
    root=ET.fromstring(r.read())
   rows=[]
   for item in root.iter():
    if item.tag.rsplit('}',1)[-1] not in {'item','entry'}:continue
    title=text_of(item,['title'])
    link=text_of(item,['link'])
    if not link:
     for n in list(item):
      if n.tag.rsplit('}',1)[-1]=='link' and n.attrib.get('href'):
       link=n.attrib['href'];break
    date=text_of(item,['pubDate','published','updated'])
    desc=text_of(item,['description','summary','encoded'])
    if title and link:
     rows.append({'title':title,'link':link,'source':source,'date':date,'description':desc[:280],'image':image_for_site(image_url(item,link)),'_sort':parse_date(date).isoformat()})
   return rows[:PER_SOURCE]
  except Exception as e:
   last=e
   if attempt<RETRIES:
    time.sleep(2**attempt)
 raise last

items=[]
errors=[]
for source,url in FEEDS:
 try:
  items.extend(fetch(source,url))
 except Exception as e:
  errors.append({'source':source,'error':str(e)})

seen=set();unique=[]
for x in sorted(items,key=lambda a:a['_sort'],reverse=True):
 if x['link'] in seen:continue
 seen.add(x['link'])
 x.pop('_sort',None)
 unique.append(x)

# Ne jamais remplacer un cache sain par un cache vide en cas de panne simultanée.
if not unique:
 if OUT.exists():
  print('RSS: aucun flux disponible; conservation du dernier cache valide.')
  raise SystemExit(0)
 raise SystemExit("RSS update aborted: aucun flux RSS n'a pu etre recupere et aucun cache n'existe.")

OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps({'generatedAt':datetime.now(timezone.utc).isoformat(),'items':unique[:MAX_ITEMS],'sources':[x[0] for x in FEEDS],'errors':errors},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Radio Ciwara RSS: {len(unique[:MAX_ITEMS])} actualites; sources: {len(FEEDS)}; erreurs: {len(errors)}')
