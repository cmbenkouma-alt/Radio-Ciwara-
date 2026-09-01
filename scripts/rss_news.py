#!/usr/bin/env python3
import json, re, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

# Flux officiels vérifiés : Malijet publie bien un flux RSS et Maliweb
# expose son flux "Derniers messages" sur /rss/latest-posts.
FEEDS = [
    ("Malijet", "https://malijet.com/rss"),
    ("Maliweb", "https://www.maliweb.net/rss/latest-posts"),
]
OUT = Path("data/news.json")
PER_SOURCE = 10


def clean(value):
    value = re.sub(r"<!\[CDATA\[|\]\]>", "", value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def text_of(el, names):
    for name in names:
        node = el.find(name)
        if node is not None and node.text:
            return clean(node.text)
    # RSS avec namespace éventuel
    for node in list(el):
        if node.tag.rsplit("}", 1)[-1] in names and node.text:
            return clean(node.text)
    return ""


def parse_date(value):
    if not value:
        return datetime.min.replace(tzinfo=timezone.utc)
    try:
        dt = parsedate_to_datetime(value)
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.min.replace(tzinfo=timezone.utc)


def fetch(source, url):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Radio-Ciwara-RSS/2.0 (+https://www.ciwara-medias.ml/)"
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        root = ET.fromstring(response.read())

    rows = []
    for item in root.findall('.//item'):
        title = text_of(item, ["title"])
        link = text_of(item, ["link"])
        date = text_of(item, ["pubDate", "published", "updated"])
        desc = text_of(item, ["description", "summary", "encoded"])
        if title and link:
            rows.append({
                "title": title,
                "link": link,
                "source": source,
                "date": date,
                "description": desc[:280],
                "_sort": parse_date(date).isoformat(),
            })

    rows.sort(key=lambda x: x["_sort"], reverse=True)
    return rows[:PER_SOURCE]


items = []
errors = []
for source, url in FEEDS:
    try:
        items.extend(fetch(source, url))
    except Exception as exc:
        errors.append({"source": source, "error": str(exc)})

# Mélange les deux sources tout en gardant les plus récentes en tête.
seen = set()
unique = []
for item in sorted(items, key=lambda x: x["_sort"], reverse=True):
    if item["link"] in seen:
        continue
    seen.add(item["link"])
    item.pop("_sort", None)
    unique.append(item)

if not unique:
    raise SystemExit("RSS update aborted: aucun flux RSS n'a pu être récupéré.")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(
    json.dumps(
        {
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "items": unique[:20],
            "sources": [x[0] for x in FEEDS],
            "errors": errors,
        },
        ensure_ascii=False,
        indent=2,
    ) + "\n",
    encoding="utf-8",
)

print(f"Radio Ciwara RSS: {len(unique[:20])} actualités; erreurs: {len(errors)}")
