"""Keep stable, attachment-style lecture downloads in one GitHub release.

The release tag and asset names are permanent. Updating a published export
replaces the asset behind the same URL. Never upload sources or answer sheets.
Run --check-only locally to validate inputs without contacting GitHub.
"""
from pathlib import Path
import argparse
import hashlib
import json
import os
import subprocess

REPOSITORY = "davidchivers/davidchivers.co.uk"
COURSES = (
    ("macro-applications", "macro-lecture-downloads", "Macroeconomic Applications", range(1, 6), ("pptx", "pdf")),
    # Only the reviewed first lecture is approved for a PowerPoint download.
    ("political-economy", "political-economy-lecture-downloads", "Political Economy", (1,), ("pptx",)),
)
ROOT = Path(__file__).resolve().parent


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validated_files(root=ROOT, course="macro-applications", lectures=range(1, 6), extensions=("pptx", "pdf")):
    records = {
        record["path"]: record
        for record in json.loads((root / "manifest.json").read_text(encoding="utf-8"))["files"]
    }
    files = []
    for lecture in lectures:
        for extension in extensions:
            relative = f"{course}/downloads/lecture_{lecture}.{extension}"
            path = root / relative
            record = records[relative]
            digest = sha256(path)
            if digest != record["sha256"] or path.stat().st_size != record["bytes"]:
                raise ValueError(f"Published-file manifest does not match {relative}")
            if course == "political-economy":
                if sha256(root / course / f"lecture_{lecture}.html") != record["lecture_sha256"]:
                    raise ValueError(f"Download no longer matches the published lecture: {relative}")
            signature = b"PK" if extension == "pptx" else b"%PDF-"
            if not path.read_bytes().startswith(signature):
                raise ValueError(f"Invalid file format: {relative}")
            files.append((path, digest))
    return files


def gh(*arguments, check=True):
    result = subprocess.run(
        ["gh", *arguments], text=True, capture_output=True, check=False
    )
    if check and result.returncode:
        raise RuntimeError(result.stderr.strip())
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()
    groups = [(course, tag, title, validated_files(ROOT, course, lectures, extensions))
              for course, tag, title, lectures, extensions in COURSES]
    if args.check_only:
        print(f"Verified {sum(len(group[3]) for group in groups)} current lecture download files against the publication manifest.")
        return
    for course, tag, title, files in groups:
        publish_release(course, tag, title, files)


def publish_release(course, tag, title, files):
    endpoint = f"repos/{REPOSITORY}/releases/tags/{tag}"
    release_result = gh("api", endpoint, check=False)
    if release_result.returncode:
        if "HTTP 404" not in release_result.stderr:
            raise RuntimeError(release_result.stderr.strip())
        gh(
            "release", "create", tag, "--repo", REPOSITORY,
            "--target", os.environ.get("GITHUB_SHA", "main"), "--latest=false",
            "--title", f"{title}: current lecture downloads",
            "--notes", "Current approved downloads of the published lectures. "
            "The asset links stay the same when the lectures are updated. "
            f"Interactive slides: https://davidchivers.co.uk/teaching/{course}/",
        )
        release_result = gh("api", endpoint)
    release = json.loads(release_result.stdout)
    assets = {asset["name"]: asset for asset in release["assets"]}

    for path, digest in files:
        if assets.get(path.name, {}).get("digest") == f"sha256:{digest}":
            print(f"Already current: {path.name}")
            continue
        gh("release", "upload", tag, str(path), "--repo", REPOSITORY, "--clobber")
        print(f"Updated: {path.name}")

    final_release = json.loads(gh("api", endpoint).stdout)
    final_assets = {asset["name"]: asset for asset in final_release["assets"]}
    for path, digest in files:
        asset = final_assets[path.name]
        if asset.get("digest") != f"sha256:{digest}":
            raise RuntimeError(f"Release checksum mismatch: {path.name}")
        if asset["size"] != path.stat().st_size or asset["state"] != "uploaded":
            raise RuntimeError(f"Incomplete release download: {path.name}")
    print(f"Verified {len(files)} release assets. Stable tag: {tag}.")


if __name__ == "__main__":
    main()
