#!/usr/bin/env python3
import json,re,urllib.request,urllib.parse,xml.etree.ElementTree as ET
from datetime import datetime,timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
FEEDS=[('Malijet','https://malijet.com/rss'),('Maliweb','https://www.maliweb.net/rss/latest-posts')]
OUT=Path('data/news.json'); PER_SOURCE=10

def clean(v):
 v=re.sub(r'<!\[CDATA\[|\]\]>','',v or ''); v=re.sub(r'<[^>]+>',' ',v); return re.sub(r'\s+',' ',v).strip()
def children(el,names):
 for n in list(el):
  if n.tag.rsplit('}',1)[-1] in names: yield n
def text_of(el,names):
 for n in list(el):
  if n.tag.rsplit('}',1)[-1] in set(names) and n.text: return clean(n.text)
 return ''
def image_url(item,link):
 for n in children(item,{'enclosure','content','thumbnail'}):
  u=n.attrib.get('url') or n.attrib.get('href')
  if u and re.match(r'https?://',u,re.I): return urllib.parse.urljoin(link,u)
 for n in children(item,{'description','encoded','content'}):
  raw=n.text or ''; m=re.search(r'<img[^>]+(?:src|data-src)=["\']([^"\']+)',raw,re.I)
  if m:return urllib.parse.urljoin(link,m.group(1))
 try:
  req=urllib.request.Request(link,headers={'User-Agent':'Mozilla/5.0 Radio-Ciwara'})
  with urllib.request.urlopen(req,timeout=12) as r: html=r.read(500000).decode('utf-8','ignore')
  for pat in [r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)']:
   m=re.search(pat,html,re.I)
   if m:return urllib.parse.urljoin(link,m.group(1))
 except Exception: pass
 return ''
def image_for_site(u):
 if not u:return ''
 if u.startswith('https://'):return u
 return 'https://images.weserv.nl/?url='+urllib.parse.quote(u,safe='')
def parse_date(v):
 try:
  d=parsedate_to_datetime(v); return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
 except Exception:return datetime.min.replace(tzinfo=timezone.utc)
def fetch(source,url):
 req=urllib.request.Request(url,headers={'User-Agent':'Radio-Ciwara-RSS/4.0'})
 with urllib.request.urlopen(req,timeout=30) as r: root=ET.fromstring(r.read())
 rows=[]
 for item in root.iter():
  if item.tag.rsplit('}',1)[-1]!='item':continue
  title=text_of(item,['title']); link=text_of(item,['link']); date=text_of(item,['pubDate','published','updated']); desc=text_of(item,['description','summary','encoded'])
  if title and link: rows.append({'title':title,'link':link,'source':source,'date':date,'description':desc[:280],'image':image_for_site(image_url(item,link)),'_sort':parse_date(date).isoformat()})
 return rows[:PER_SOURCE]
items=[];errors=[]
for source,url in FEEDS:
 try:items.extend(fetch(source,url))
 except Exception as e:errors.append({'source':source,'error':str(e)})
seen=set();unique=[]
for x in sorted(items,key=lambda a:a['_sort'],reverse=True):
 if x['link'] in seen:continue
 seen.add(x['link']);x.pop('_sort',None);unique.append(x)
if not unique:raise SystemExit("RSS update aborted: aucun flux RSS n'a pu etre recupere.")
OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps({'generatedAt':datetime.now(timezone.utc).isoformat(),'items':unique[:20],'sources':[x[0] for x in FEEDS],'errors':errors},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Radio Ciwara RSS: {len(unique[:20])} actualites; erreurs: {len(errors)}')