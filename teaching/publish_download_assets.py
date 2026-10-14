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
TAG = "macro-lecture-downloads"
ROOT = Path(__file__).resolve().parent


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validated_files(root=ROOT):
    records = {
        record["path"]: record
        for record in json.loads((root / "manifest.json").read_text(encoding="utf-8"))["files"]
    }
    files = []
    for lecture in range(1, 6):
        for extension in ("pptx", "pdf"):
            relative = f"macro-applications/downloads/lecture_{lecture}.{extension}"
            path = root / relative
            record = records[relative]
            digest = sha256(path)
            if digest != record["sha256"] or path.stat().st_size != record["bytes"]:
                raise ValueError(f"Published-file manifest does not match {relative}")
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
    files = validated_files()
    if args.check_only:
        print(f"Verified {len(files)} current lecture download files against the publication manifest.")
        return

    endpoint = f"repos/{REPOSITORY}/releases/tags/{TAG}"
    release_result = gh("api", endpoint, check=False)
    if release_result.returncode:
        if "HTTP 404" not in release_result.stderr:
            raise RuntimeError(release_result.stderr.strip())
        gh(
            "release", "create", TAG, "--repo", REPOSITORY,
            "--target", os.environ.get("GITHUB_SHA", "main"), "--latest=false",
            "--title", "Macroeconomic Applications: current lecture downloads",
            "--notes", "Current PDF and PowerPoint copies of the published lectures. "
            "The asset links stay the same when the lectures are updated. "
            "Interactive slides: https://davidchivers.co.uk/teaching/macro-applications/",
        )
        release_result = gh("api", endpoint)
    release = json.loads(release_result.stdout)
    assets = {asset["name"]: asset for asset in release["assets"]}

    for path, digest in files:
        if assets.get(path.name, {}).get("digest") == f"sha256:{digest}":
            print(f"Already current: {path.name}")
            continue
        gh("release", "upload", TAG, str(path), "--repo", REPOSITORY, "--clobber")
        print(f"Updated: {path.name}")

    final_release = json.loads(gh("api", endpoint).stdout)
    final_assets = {asset["name"]: asset for asset in final_release["assets"]}
    for path, digest in files:
        asset = final_assets[path.name]
        if asset.get("digest") != f"sha256:{digest}":
            raise RuntimeError(f"Release checksum mismatch: {path.name}")
        if asset["size"] != path.stat().st_size or asset["state"] != "uploaded":
            raise RuntimeError(f"Incomplete release download: {path.name}")
    print(f"Verified {len(files)} release assets. Stable tag: {TAG}.")


if __name__ == "__main__":
    main()
