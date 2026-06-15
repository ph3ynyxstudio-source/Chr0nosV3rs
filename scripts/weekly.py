import argparse
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path


SECTION_TARGETS = {
    "contexte": "context",
    "realise": "progression",
    "decouvertes": "discoveries",
    "apprentissages": "learnings",
    "blocages": "blockers",
    "suite": "next",
    "resume": "session_summaries",
}

TECHNICAL_DETAIL_KEYWORDS = (
    "css",
    "grid template",
    "overflow",
    "z index",
    "padding",
    "min height",
    "tsx",
    "dashboard css",
    "app css",
    "projectcard css",
)

RESOLUTION_KEYWORDS = (
    "correction",
    "corrige",
    "corrigee",
    "clarification",
    "validation",
    "identification",
    "mise en place",
    "remplac",
    "debloqu",
    "resolu",
)

GROUP_KEYWORDS = (
    ("synthese", "python", "rust", "tauri", "weekly", "json"),
    ("dashboard", "weeklyview", "interface", "ui", "ux", "carte", "overlay"),
    ("progression", "compteur", "indicateur", "statut"),
    ("session", "semaine", "navigation", "projet"),
    ("documentation", "documentaire", "code_map", "index", "docs"),
    ("build", "cargo", "npm", "verification"),
)

TEMPLATE_GUIDE_LINES = {
    "Capacités observées aujourd'hui (optionnel) :",
    "- Analyse",
    "- Documentation",
    "- Débogage",
    "- Organisation",
    "- Communication",
    "- Créativité",
    "- Recherche",
    "- Résolution de problème",
    "Quelles capacités crois-tu avoir utilisées ou développées aujourd'hui ?",
}


def normalize(value: str) -> str:
    without_accents = unicodedata.normalize("NFKD", value)
    ascii_value = without_accents.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", " ", ascii_value.lower()).strip()


def clean_line(value: str) -> str:
    cleaned = value.strip()
    cleaned = re.sub(r"^[-*•]\s*", "", cleaned)
    cleaned = re.sub(r"^\d+[\).\s]+", "", cleaned)
    cleaned = cleaned.strip("[] ").strip()
    cleaned = re.sub(r"\s+", " ", cleaned)

    return cleaned


def add_unique(target: list[str], value: str) -> None:
    cleaned = clean_line(value)

    if value.strip() in TEMPLATE_GUIDE_LINES or cleaned in TEMPLATE_GUIDE_LINES:
        return

    if cleaned and normalize(cleaned) not in {normalize(item) for item in target}:
        target.append(cleaned)


def is_low_signal(value: str, *, allow_short: bool = False) -> bool:
    normalized_value = normalize(value)
    words = normalized_value.split()

    if not normalized_value:
        return True

    if value.endswith(":"):
        return True

    if not allow_short and len(words) <= 2:
        return True

    if re.fullmatch(r"`?[.#]?[a-z0-9_-]+(\.[a-z0-9_-]+)?`?", value.lower()):
        return True

    return False


def is_too_technical(value: str) -> bool:
    normalized_value = normalize(value)

    return any(keyword in normalized_value for keyword in TECHNICAL_DETAIL_KEYWORDS)


def trim_sentence(value: str, max_length: int = 170) -> str:
    cleaned = clean_line(value).strip(" .;")

    if len(cleaned) <= max_length:
        return cleaned

    trimmed = cleaned[:max_length].rsplit(" ", 1)[0].strip(" .;")

    return f"{trimmed}..."


def collect_candidates(
    items: list[str],
    *,
    max_count: int,
    allow_technical: bool = False,
    allow_short: bool = False,
) -> list[str]:
    selected: list[str] = []
    used_indexes: set[int] = set()

    for keyword_group in GROUP_KEYWORDS:
        for index, item in enumerate(items):
            normalized_item = normalize(item)

            if index in used_indexes:
                continue

            if not any(keyword in normalized_item for keyword in keyword_group):
                continue

            if is_low_signal(item, allow_short=allow_short):
                continue

            if not allow_technical and is_too_technical(item):
                continue

            add_unique(selected, trim_sentence(item))
            used_indexes.add(index)
            break

        if len(selected) >= max_count:
            return selected[:max_count]

    for index, item in enumerate(items):
        if index in used_indexes:
            continue

        if is_low_signal(item, allow_short=allow_short):
            continue

        if not allow_technical and is_too_technical(item):
            continue

        add_unique(selected, trim_sentence(item))

        if len(selected) >= max_count:
            break

    return selected[:max_count]


def collect_resolutions(
    progression: list[str],
    discoveries: list[str],
    *,
    max_count: int,
) -> list[str]:
    candidates = [
        item
        for item in progression + discoveries
        if any(keyword in normalize(item) for keyword in RESOLUTION_KEYWORDS)
    ]

    return collect_candidates(candidates, max_count=max_count)


def as_phrase(items: list[str]) -> str:
    cleaned_items = [trim_sentence(item, 120).strip(" .;") for item in items]

    if not cleaned_items:
        return ""

    if len(cleaned_items) == 1:
        return cleaned_items[0]

    return f"{', '.join(cleaned_items[:-1])} et {cleaned_items[-1]}"


def finish_sentence(value: str) -> str:
    cleaned = value.strip()

    if cleaned.endswith((".", "!", "?")):
        return cleaned

    return f"{cleaned}."


def target_for_heading(heading: str) -> str | None:
    normalized_heading = normalize(heading)

    for keyword, target in SECTION_TARGETS.items():
        if keyword in normalized_heading:
            return target

    return None


def collect_session_content(file_path: Path, result: dict[str, list[str]]) -> None:
    current_target: str | None = None
    fallback_notes: list[str] = []
    file_added_content = False

    for raw_line in file_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        if not line:
            continue

        if line.startswith("#"):
            current_target = target_for_heading(line.lstrip("#").strip())
            continue

        if current_target:
            add_unique(result[current_target], line)
            file_added_content = True
        else:
            add_unique(fallback_notes, line)

    if not file_added_content:
        for note in fallback_notes[:6]:
            add_unique(result["notes"], note)


def build_summary(
    session_count: int,
    progression: list[str],
    blockers: list[str],
    resolutions: list[str],
    next_items: list[str],
) -> str:
    if session_count == 0:
        return "Aucune session Markdown disponible pour cette semaine."

    sentences = [f"{session_count} sessions Markdown ont été analysées pour cette semaine."]

    if progression:
        sentences.append(
            finish_sentence(
                f"La progression principale concerne {as_phrase(progression[:2])}"
            )
        )

    if blockers:
        sentences.append(
            finish_sentence(
                f"Les blocages principaux portent sur {as_phrase(blockers[:2])}"
            )
        )

    if resolutions:
        sentences.append(
            finish_sentence(
                f"Les résolutions observées s'appuient sur {as_phrase(resolutions[:2])}"
            )
        )

    if next_items:
        sentences.append(finish_sentence(f"La suite prioritaire est {as_phrase(next_items[:2])}"))

    if len(sentences) == 1:
        sentences.append("Une proposition de synthèse hebdomadaire a été générée.")

    return " ".join(sentences[:5])


def generate_weekly_summary(input_folder: Path) -> dict[str, object]:
    markdown_files = sorted(input_folder.glob("*.md"))
    result = {
        "context": [],
        "progression": [],
        "blockers": [],
        "discoveries": [],
        "learnings": [],
        "next": [],
        "session_summaries": [],
        "notes": [],
    }

    for file_path in markdown_files:
        if file_path.is_file():
            collect_session_content(file_path, result)

    progression = collect_candidates(result["progression"], max_count=5)
    blockers = collect_candidates(result["blockers"], max_count=3)
    resolutions = collect_resolutions(
        result["progression"],
        result["discoveries"],
        max_count=3,
    )
    discoveries = collect_candidates(result["discoveries"], max_count=3)
    learnings = collect_candidates(
        result["learnings"],
        max_count=5,
        allow_short=True,
    )
    next_items = collect_candidates(result["next"], max_count=3, allow_technical=True)
    notes = collect_candidates(
        result["notes"]
        + result["context"]
        + result["session_summaries"]
        + result["discoveries"]
        + result["next"],
        max_count=6,
        allow_technical=True,
    )

    return {
        "meta": {
            "created_at": datetime.now(timezone.utc).isoformat(),
            "session_count": len(markdown_files),
        },
        "summary": build_summary(
            len(markdown_files),
            progression,
            blockers,
            resolutions,
            next_items,
        ),
        "progression": progression,
        "achievements": progression,
        "blockers": blockers,
        "resolutions": resolutions,
        "discoveries": discoveries,
        "learnings": learnings,
        "next": next_items,
        "notes": notes,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a simple weekly MVP summary from Markdown sessions.",
    )
    parser.add_argument("input_folder", type=Path)
    parser.add_argument("output_file", type=Path)
    args = parser.parse_args()

    if not args.input_folder.exists() or not args.input_folder.is_dir():
        raise SystemExit(f"Input folder not found: {args.input_folder}")

    summary = generate_weekly_summary(args.input_folder)
    args.output_file.parent.mkdir(parents=True, exist_ok=True)
    args.output_file.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
