from flask import Flask, request, render_template, Response
import requests
import os

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/fetch")
def fetch():
    url = request.args.get("url")
    if not url:
        return "No URL provided", 400

    try:
        r = requests.get(url, stream=True, timeout=10)

        def generate():
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    yield chunk

        return Response(
            generate(),
            content_type=r.headers.get("Content-Type", "application/octet-stream"),
            headers={
                "Content-Disposition": "inline"
            }
        )
    except Exception as e:
        return f"Error fetching URL: {str(e)}", 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
