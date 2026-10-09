from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/detect", methods=["POST"])
def detect():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image uploaded"
        })

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "success": False,
            "message": "Please select an image"
        })

    filepath = os.path.join(
        UPLOAD_FOLDER,
        image.filename
    )

    image.save(filepath)

    # For now, this is a simulated AI result.
    # Later we will replace this with YOLO.

    return jsonify({
        "success": True,
        "detected": True,
        "message": "Pothole detected!",
        "severity": "High"
    })


if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/detect", methods=["POST"])
def detect():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image uploaded"
        })

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "success": False,
            "message": "Please select an image"
        })

    filepath = os.path.join(
        UPLOAD_FOLDER,
        image.filename
    )

    image.save(filepath)

    # For now, this is a simulated AI result.
    # Later we will replace this with YOLO.

    return jsonify({
        "success": True,
        "detected": True,
        "message": "Pothole detected!",
        "severity": "High"
    })


if __name__ == "__main__":
    app.run(debug=True)