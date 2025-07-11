import re
import json

# Load canonical chapter counts
with open("plans/ot_books_and_chapters.json", encoding="utf-8") as f:
    ot_books = json.load(f)
with open("plans/nt_books_and_chapters.json", encoding="utf-8") as f:
    nt_books = json.load(f)

chapter_counts = {b["book"]: b["chapters"] for b in ot_books + nt_books}

# Helper to expand chapter ranges (e.g., Genesis 1-6, Psalm 119:1-48)
def expand_range(book, start, end):
    return list(range(int(start), int(end) + 1))

def parse_assignment(line):
    assignments = []
    # Find all ranges like Genesis 1-6, Psalm 119:1-48, Mark 16, Luke 1
    for match in re.finditer(r'([1-3]?\s?\w+)\s(\d+)(?::\d+)?(?:-(?:([1-3]?\s?\w+)\s)?(\d+)(?::\d+)?)?', line):
        book1, start, book2, end = match.groups()
        # Handle common book name variations for lookup
        lookup1 = book1.strip()
        lookup2 = book2.strip() if book2 else None
        if lookup1 == "Psalm":
            lookup1 = "Psalms"
        if lookup1 == "Solomon":
            lookup1 = "Song of Solomon"
        if lookup2 == "Psalm":
            lookup2 = "Psalms"
        if lookup2 == "Solomon":
            lookup2 = "Song of Solomon"
        if book2:  # Range spans books
            assignments.append((lookup1, int(start), chapter_counts[lookup1]))
            assignments.append((lookup2, 1, int(end)))
        elif end:
            assignments.append((lookup1, int(start), int(end)))
        else:
            assignments.append((lookup1, int(start), int(start)))
    return assignments

# Parse the plan file
assigned_chapters = {book: set() for book in chapter_counts}
with open("plans/bible_156_week_plan.md", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if line.startswith("- OT:") or line.startswith("- NT:"):
            for book, start, end in parse_assignment(line):
                assigned_chapters[book].update(range(start, end + 1))

# Check for missing chapters
missing = {}
for book, total in chapter_counts.items():
    assigned = assigned_chapters.get(book, set())
    missing_chaps = set(range(1, total + 1)) - assigned
    if missing_chaps:
        missing[book] = sorted(missing_chaps)

if not missing:
    print("All chapters of the Bible are covered in the plan!")
else:
    print("Missing chapters found:")
    for book, chaps in missing.items():
        print(f"{book}: {chaps}")

print("Script finished.")  # Add this line to confirm the script ran