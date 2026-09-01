#!/usr/bin/env python3
import json, re, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

FEEDS=[
  ("Malijet","https://malijet.com/rss"),
  ("Maliweb","https://www.maliweb.net/rss/latest-posts"),
]
OUT=Path("data/news.json")
PER_SOURCE=10

def clean(value):
    value=re.sub(r"<!\[CDATA\[|\]\]>","",value or "")
    value=re.sub(r"<[^>]+>"," ",value)
    return re.sub(r"\s+"," ",value).strip()

def first(el,names):
    for name in names:
        node=el.find(name)
        if node is not None and node.text:
            return clean(node.text)
    return ""

def fetch(source,url):
    req=urllib.request.Request(url,headers={"User-Agent":"Radio-Ciwara-RSS/1.0"})
    with urllib.request.urlopen(req,timeout=25) as response:
        root=ET.fromstring(response.read())
    rows=[]
    for item in root.findall('.//item'):
        title=first(item,['title']); link=first(item,['link']); date=first(item,['pubDate','published','updated']); desc=first(item,['description','summary'])
        if title and link:
            rows.append({"title":title,"link":link,"source":source,"date":date,"description":desc[:240]})
    return rows[:PER_SOURCE]

items=[]; errors=[]
for source,url in FEEDS:
    try: items.extend(fetch(source,url))
    except Exception as exc: errors.append(f"{source}: {exc}")

seen=set(); unique=[]
for item in items:
    if item['link'] in seen: continue
    seen.add(item['link']); unique.append(item)

if not unique:
    raise SystemExit('RSS update aborted: no items retrieved.')
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps({"generatedAt":datetime.now(timezone.utc).isoformat(),"items":unique,"sources":[x[0] for x in FEEDS],"errors":errors},ensure_ascii=False,indent=2)+"\n",encoding='utf-8')
print(f"Generated {len(unique)} items from {len(FEEDS)-len(errors)} feed(s). Feed warnings: {len(errors)}")
