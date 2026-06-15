import socket
import sys
import threading
import time
import webbrowser

from server import create_app, run_server


def find_free_port(start: int = 8765) -> int:
    for port in range(start, start + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No free port found")


class ProAPI:
    """API Bridge to handle native system operations like file saving."""
    def save_file(self, content, filename):
        import webview
        window = webview.active_window()
        if not window:
            return
        # Opens the native OS Save File dialog
        result = window.create_file_dialog(webview.SAVE_DIALOG, save_filename=filename)
        if result:
            file_path = result[0] if isinstance(result, (list, tuple)) else result
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            except Exception as e:
                print(f"Error saving file: {e}")


def open_desktop_window(url: str) -> None:
    try:
        import webview
        api = ProAPI()
        webview.create_window("Cubicle Partition", url, width=1400, height=900, min_size=(1024, 700), js_api=api)
        webview.start(debug=True)
    except Exception:
        webbrowser.open(url)
        while True:
            time.sleep(1)


def main() -> int:
    create_app()
    port = find_free_port()
    url = f"http://127.0.0.1:{port}/"

    server_thread = threading.Thread(target=run_server, kwargs={"host": "127.0.0.1", "port": port}, daemon=True)
    server_thread.start()
    time.sleep(0.6)
    open_desktop_window(url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
