import sqlite3
import subprocess
import os

DB_PATH = "/home/claude/edu_dataset.db"

BOOKS = [
    {
        "file": "/mnt/user-data/uploads/1001030024.pdf",
        "title": "Kumarbharati - Marathi",
        "language": "Marathi",
        "standard": "10",
        "subject": "Marathi (First Language)",
        "board": "Maharashtra State Board",
    },
    {
        "file": "/mnt/user-data/uploads/1002030024.pdf",
        "title": "Kumarbharati - Hindi",
        "language": "Hindi",
        "standard": "10",
        "subject": "Hindi",
        "board": "Maharashtra State Board",
    },
    {
        "file": "/mnt/user-data/uploads/1003030024.pdf",
        "title": "Kumarbharati - English",
        "language": "English",
        "standard": "10",
        "subject": "English",
        "board": "Maharashtra State Board",
    },
]

def main():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.executescript("""
    CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        language TEXT NOT NULL,
        standard TEXT NOT NULL,
        subject TEXT NOT NULL,
        board TEXT NOT NULL,
        source_file TEXT NOT NULL
    );

    CREATE TABLE pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        page_number INTEGER NOT NULL,
        content TEXT,
        FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE VIRTUAL TABLE pages_fts USING fts4(content, content_book_id, content_page_number);
    """)

    for book in BOOKS:
        if not os.path.exists(book["file"]):
            print(f"Skipping {book['title']}: File not found at {book['file']}")
            continue

        cur.execute(
            "INSERT INTO books (title, language, standard, subject, board, source_file) VALUES (?, ?, ?, ?, ?, ?)",
            (book["title"], book["language"], book["standard"], book["subject"], book["board"], os.path.basename(book["file"])),
        )
        book_id = cur.lastrowid

        # Get page count
        info = subprocess.run(["pdfinfo", book["file"]], capture_output=True, text=True).stdout
        pages = 0
        for line in info.splitlines():
            if line.startswith("Pages:"):
                pages = int(line.split(":")[1].strip())

        for p in range(1, pages + 1):
            result = subprocess.run(
                ["pdftotext", "-f", str(p), "-l", str(p), "-layout", book["file"], "-"],
                capture_output=True, text=True
            )
            text = result.stdout.strip()
            cur.execute(
                "INSERT INTO pages (book_id, page_number, content) VALUES (?, ?, ?)",
                (book_id, p, text),
            )
            cur.execute(
                "INSERT INTO pages_fts (content, content_book_id, content_page_number) VALUES (?, ?, ?)",
                (text, book_id, p),
            )

        print(f"Done: {book['title']} -> {pages} pages")

    conn.commit()
    conn.close()
    print("Database built at", DB_PATH)

if __name__ == "__main__":
    main()
