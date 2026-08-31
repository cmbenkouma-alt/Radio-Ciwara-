#!/usr/bin/env python3
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES_FILE = ROOT / "data" / "news-sources.json"
OUTPUT_FILE = ROOT / "data" / "news.json"


def clean(text):
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def first_text(node, names):
    for name in names:
        child = node.find(name)
        if child is not None and child.text:
            return child.text.strip()
    return ""


def parse_feed(source):
    request = urllib.request.Request(
        source["feed"],
        headers={"User-Agent": "Radio-Ciwara-News/1.0 (+https://radio-ciwara.com)"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        root = ET.fromstring(response.read())

    items = []
    nodes = root.findall(".//item")
    if not nodes:
        nodes = root.findall(".//{http://www.w3.org/2005/Atom}entry")

    for node in nodes[:20]:
        title = clean(first_text(node, ["title", "{http://www.w3.org/2005/Atom}title"]))
        link = first_text(node, ["link", "{http://www.w3.org/2005/Atom}link"])
        if not link:
            atom_link = node.find("{http://www.w3.org/2005/Atom}link")
            if atom_link is not None:
                link = atom_link.attrib.get("href", "")
        description = clean(first_text(node, ["description", "summary", "{http://www.w3.org/2005/Atom}summary"]))
        date = first_text(node, ["pubDate", "published", "updated", "{http://www.w3.org/2005/Atom}published", "{http://www.w3.org/2005/Atom}updated"])
        if title and link:
            items.append({"title": title, "link": link, "description": description[:300], "date": date, "source": source["name"]})
    return items


sources = json.loads(SOURCES_FILE.read_text(encoding="utf-8"))["sources"]
all_items = []
errors = []
for source in sources:
    if not source.get("enabled"):
        continue
    try:
        all_items.extend(parse_feed(source))
    except Exception as exc:
        errors.append({"source": source["name"], "error": str(exc)})

# Deduplicate by canonical article URL and keep the newest-looking entries first.
seen = set()
unique = []
for item in all_items:
    key = item["link"].split("#", 1)[0]
    if key in seen:
        continue
    seen.add(key)
    unique.append(item)

unique = unique[:40]
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.write_text(
    json.dumps(
        {"generatedAt": datetime.now(timezone.utc).isoformat(), "items": unique, "errors": errors},
        ensure_ascii=False,
        indent=2,
    ) + "\n",
    encoding="utf-8",
)
print(f"Generated {len(unique)} news items; {len(errors)} source errors")
if errors:
    print(json.dumps(errors, ensure_ascii=False))
