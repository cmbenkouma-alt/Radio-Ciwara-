#!/usr/bin/env python3
"""Build the static news JSON consumed by the Radio Ciwara app.

No backend is required: GitHub Actions fetches the publishers' public RSS feeds
and commits only when the generated data changes.
"""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

FEEDS = [
    ("Maliweb", "https://www.maliweb.net/rss/latest-posts"),
    ("Malijet", "https://malijet.com/feed/index.rss"),
]
OUT = Path("data/news.json")
LIMIT = 20


def clean(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    return re.sub(r"\s+", " ", value).strip()


def text(el, names):
    for name in names:
        node = el.find(name)
        if node is not None and node.text:
            return clean(node.text)
    return ""


def fetch(source, url):
    req = urllib.request.Request(url, headers={"User-Agent": "Radio-Ciwara-News/1.0"})
    with urllib.request.urlopen(req, timeout=20) as response:
        root = ET.fromstring(response.read())

    items = []
    for item in root.findall(".//item"):
        title = text(item, ["title"])
        link = text(item, ["link"])
        date = text(item, ["pubDate", "published", "updated"])
        if title and link:
            items.append({"title": title, "link": link, "source": source, "date": date})
    return items


def main():
    merged = []
    errors = []
    for source, url in FEEDS:
        try:
            merged.extend(fetch(source, url))
        except Exception as exc:
            errors.append(f"{source}: {exc}")

    # Keep publisher order while removing duplicate URLs.
    seen = set()
    unique = []
    for item in merged:
        if item["link"] in seen:
            continue
        seen.add(item["link"])
        unique.append(item)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "items": unique[:LIMIT],
        "sources": [name for name, _ in FEEDS],
        "errors": errors,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(payload['items'])} news items from {len(FEEDS) - len(errors)} feed(s)")
    if errors:
        print("Feed warnings:")
        for error in errors:
            print(f"- {error}")
    if not unique:
        raise SystemExit("No RSS items were retrieved; refusing to publish an empty feed.")


if __name__ == "__main__":
    main()
