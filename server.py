import json
import os
import sys
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

import database

app = Flask(__name__, static_folder=None)


def app_base_dir() -> str:
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


def resource_dir() -> str:
    if hasattr(sys, "_MEIPASS"):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))


DB_PATH = database.get_db_path(app_base_dir())
STATIC_DIR = resource_dir()


@app.route("/")
def index():
    return send_from_directory(STATIC_DIR, "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(STATIC_DIR, filename)


@app.route("/api/download/<path:filename>")
def download_file(filename):
    return send_from_directory(STATIC_DIR, filename, as_attachment=True)


@app.post("/submit")
@app.post("/api/submit")
def submit():
    body = request.get_json(silent=True) or {}
    name = (body.get("userName") or body.get("name") or "").strip()
    email = (body.get("userEmail") or body.get("email") or "").strip()
    notes = (body.get("userNotes") or body.get("notes") or "").strip()

    if not name or not email:
        return jsonify({"success": False, "error": "Name and email are required."}), 400

    project_id = database.save_project(DB_PATH, name, email, notes, body)
    return jsonify({"success": True, "id": project_id})


@app.get("/api/search")
def search():
    query = request.args.get("q", "")
    results = database.search_projects(DB_PATH, query)
    return jsonify({"success": True, "results": results})


@app.get("/api/load/<int:project_id>")
def load(project_id: int):
    project = database.load_project(DB_PATH, project_id)
    if not project:
        return jsonify({"success": False, "error": "Project not found."}), 404
    return jsonify({"success": True, "project": project})


def create_app() -> Flask:
    database.init_db(DB_PATH)
    return app


def run_server(host: str = "127.0.0.1", port: int = 8765) -> None:
    create_app()
    app.run(host=host, port=port, debug=False, use_reloader=False, threaded=True)


if __name__ == "__main__":
    run_server()
