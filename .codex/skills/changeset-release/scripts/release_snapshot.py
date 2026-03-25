#!/usr/bin/env python3
"""Summarize release-relevant workspace state for this repository."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text())


def read_root_scripts(root: Path) -> dict[str, str]:
    package_json = load_json(root / "package.json")
    scripts = package_json.get("scripts", {})
    return {
        key: scripts[key]
        for key in ("changeset", "version-packages", "release")
        if key in scripts
    }


def read_packages(root: Path) -> list[dict]:
    packages_dir = root / "packages"
    packages: list[dict] = []
    for package_json_path in sorted(packages_dir.glob("*/package.json")):
        data = load_json(package_json_path)
        packages.append(
            {
                "dir": str(package_json_path.parent.relative_to(root)),
                "name": data["name"],
                "version": data["version"],
                "private": data.get("private", False),
                "publish_access": data.get("publishConfig", {}).get("access"),
                "dependencies": data.get("dependencies", {}),
                "dev_dependencies": data.get("devDependencies", {}),
                "peer_dependencies": data.get("peerDependencies", {}),
            }
        )
    return packages


def collect_workspace_edges(packages: list[dict]) -> list[dict]:
    package_names = {pkg["name"] for pkg in packages}
    edges: list[dict] = []
    dependency_sections = (
        ("dependencies", "dependencies"),
        ("dev_dependencies", "devDependencies"),
        ("peer_dependencies", "peerDependencies"),
    )
    for package in packages:
        for field_name, label in dependency_sections:
            for dependency_name, version in package[field_name].items():
                if dependency_name in package_names or str(version).startswith("workspace:"):
                    edges.append(
                        {
                            "from": package["name"],
                            "to": dependency_name,
                            "section": label,
                            "version": version,
                        }
                    )
    return sorted(edges, key=lambda item: (item["from"], item["section"], item["to"]))


def read_changesets(root: Path) -> list[str]:
    changeset_dir = root / ".changeset"
    if not changeset_dir.exists():
        return []
    files = []
    for path in sorted(changeset_dir.glob("*.md")):
        if path.name.lower() == "readme.md":
            continue
        files.append(path.name)
    return files


def build_snapshot(root: Path) -> dict:
    packages = read_packages(root)
    return {
        "root": str(root),
        "scripts": read_root_scripts(root),
        "packages": [
            {
                "dir": package["dir"],
                "name": package["name"],
                "version": package["version"],
                "private": package["private"],
                "publish_access": package["publish_access"],
            }
            for package in packages
        ],
        "workspace_edges": collect_workspace_edges(packages),
        "pending_changesets": read_changesets(root),
    }


def print_text(snapshot: dict) -> None:
    print("Release snapshot")
    print(f"root: {snapshot['root']}")
    print("")
    print("Scripts:")
    for name, command in snapshot["scripts"].items():
        print(f"- {name}: {command}")
    print("")
    print("Packages:")
    for package in snapshot["packages"]:
        access = package["publish_access"] or "unknown"
        private = "private" if package["private"] else "public"
        print(
            f"- {package['name']} @ {package['version']} "
            f"({private}, access={access}, dir={package['dir']})"
        )
    print("")
    print("Workspace dependencies:")
    if snapshot["workspace_edges"]:
        for edge in snapshot["workspace_edges"]:
            print(
                f"- {edge['from']} -> {edge['to']} "
                f"[{edge['section']}, {edge['version']}]"
            )
    else:
        print("- none")
    print("")
    print("Pending changesets:")
    if snapshot["pending_changesets"]:
        for name in snapshot["pending_changesets"]:
            print(f"- {name}")
    else:
        print("- none")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Summarize release-relevant workspace state."
    )
    parser.add_argument(
        "--root",
        default=".",
        help="Repository root to inspect. Defaults to the current directory.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print JSON instead of human-readable text.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    snapshot = build_snapshot(root)
    if args.json:
        print(json.dumps(snapshot, indent=2))
    else:
        print_text(snapshot)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
