import json
import os
import sqlite3
from datetime import datetime, timezone


def get_db_path(base_dir: str) -> str:
    return os.path.join(base_dir, "cubicle_data.db")


def connect(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: str) -> None:
    os.makedirs(os.path.dirname(db_path) or ".", exist_ok=True)
    with connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                notes TEXT,
                project_data TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_projects_search ON projects(name, email, notes)"
        )
        conn.commit()


def save_project(db_path: str, name: str, email: str, notes: str, project_data: dict) -> int:
    now = datetime.now(timezone.utc).isoformat()
    payload = json.dumps(project_data)
    with connect(db_path) as conn:
        cur = conn.execute(
            """
            INSERT INTO projects (name, email, notes, project_data, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (name, email, notes or "", payload, now, now),
        )
        conn.commit()
        return int(cur.lastrowid)


def search_projects(db_path: str, query: str, limit: int = 50) -> list[dict]:
    q = (query or "").strip()
    with connect(db_path) as conn:
        if q:
            like = f"%{q}%"
            rows = conn.execute(
                """
                SELECT id, name, email, notes, created_at, updated_at
                FROM projects
                WHERE name LIKE ? OR email LIKE ? OR notes LIKE ?
                ORDER BY updated_at DESC
                LIMIT ?
                """,
                (like, like, like, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, name, email, notes, created_at, updated_at
                FROM projects
                ORDER BY updated_at DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
    return [dict(row) for row in rows]


def load_project(db_path: str, project_id: int) -> dict | None:
    with connect(db_path) as conn:
        row = conn.execute(
            """
            SELECT id, name, email, notes, project_data, created_at, updated_at
            FROM projects
            WHERE id = ?
            """,
            (project_id,),
        ).fetchone()
    if not row:
        return None
    data = dict(row)
    data["project_data"] = json.loads(data["project_data"])
    return data
