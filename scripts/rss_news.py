#!/usr/bin/env python3
import hashlib, json, re, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

FEEDS = [
    ("Malijet", "https://malijet.com/rss"),
    ("Maliweb", "https://www.maliweb.net/rss/latest-posts"),
]
OUT = Path("data/news.json")
IMG_DIR = Path("data/news-images")
PER_SOURCE = 10


def clean(value):
    value = re.sub(r"<!\[CDATA\[|\]\]>", "", value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def children_by_localname(el, names):
    wanted = set(names)
    for node in list(el):
        if node.tag.rsplit("}", 1)[-1] in wanted:
            yield node


def text_of(el, names):
    wanted = set(names)
    for node in list(el):
        if node.tag.rsplit("}", 1)[-1] in wanted and node.text:
            return clean(node.text)
    for name in names:
        node = el.find(name)
        if node is not None and node.text:
            return clean(node.text)
    return ""


def image_url_from_item(item):
    # enclosure / media:content / media:thumbnail
    for node in children_by_localname(item, {"enclosure", "content", "thumbnail"}):
        url = node.attrib.get("url") or node.attrib.get("href")
        if url and re.match(r"https?://", url, re.I):
            return url
    # image dans description/content:encoded
    for node in children_by_localname(item, {"description", "encoded", "content"}):
        raw = node.text or ""
        m = re.search(r'<img[^>]+(?:src|data-src)=["\']([^"\']+)', raw, re.I)
        if m:
            return urllib.parse.urljoin(text_of(item, ["link"]), m.group(1))
    return ""


def article_og_image(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Radio-Ciwara"})
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read(500000).decode("utf-8", "ignore")
        for pattern in [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',
            r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)'
        ]:
            m = re.search(pattern, html, re.I)
            if m:
                return urllib.parse.urljoin(url, m.group(1))
    except Exception:
        pass
    return ""


def save_image(url, link):
    if not url:
        url = article_og_image(link)
    if not url or not re.match(r"https?://", url, re.I):
        return ""
    try:
        key = hashlib.sha256((url + link).encode()).hexdigest()[:20]
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Radio-Ciwara"})
        with urllib.request.urlopen(req, timeout=20) as response:
            data = response.read(1500000)
            ctype = (response.headers.get("Content-Type") or "").lower()
        if not data or (ctype and not ctype.startswith("image/")):
            return ""
        ext = ".jpg"
        if "png" in ctype: ext = ".png"
        elif "webp" in ctype: ext = ".webp"
        elif "gif" in ctype: ext = ".gif"
        name = key + ext
        IMG_DIR.mkdir(parents=True, exist_ok=True)
        (IMG_DIR / name).write_bytes(data)
        return "data/news-images/" + name
    except Exception:
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
    req = urllib.request.Request(url, headers={"User-Agent": "Radio-Ciwara-RSS/3.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        root = ET.fromstring(response.read())
    rows = []
    for item in root.iter():
        if item.tag.rsplit("}", 1)[-1] != "item":
            continue
        title = text_of(item, ["title"])
        link = text_of(item, ["link"])
        date = text_of(item, ["pubDate", "published", "updated"])
        desc = text_of(item, ["description", "summary", "encoded"])
        if title and link:
            image = save_image(image_url_from_item(item), link)
            rows.append({"title": title, "link": link, "source": source, "date": date, "description": desc[:280], "image": image, "_sort": parse_date(date).isoformat()})
    rows.sort(key=lambda x: x["_sort"], reverse=True)
    return rows[:PER_SOURCE]

items, errors = [], []
for source, url in FEEDS:
    try:
        items.extend(fetch(source, url))
    except Exception as exc:
        errors.append({"source": source, "error": str(exc)})

seen, unique = set(), []
for item in sorted(items, key=lambda x: x["_sort"], reverse=True):
    if item["link"] in seen: continue
    seen.add(item["link"])
    item.pop("_sort", None)
    unique.append(item)

if not unique:
    raise SystemExit("RSS update aborted: aucun flux RSS n'a pu etre recupere.")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({"generatedAt": datetime.now(timezone.utc).isoformat(), "items": unique[:20], "sources": [x[0] for x in FEEDS], "errors": errors}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Radio Ciwara RSS: {len(unique[:20])} actualites; erreurs: {len(errors)}")