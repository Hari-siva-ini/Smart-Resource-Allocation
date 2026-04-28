import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from report_pipeline import analyze_report, store_report
from match import run_matching_pipeline

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/api/analyze-report", methods=["POST"])
def analyze():
    body = request.get_json()
    text = body.get("description", "")
    if not text:
        return jsonify({"error": "description is required"}), 400

    try:
        data = analyze_report(text)
        # Override category if provided from frontend
        if body.get("category"):
            data["category"] = body["category"].strip().capitalize()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/store-report", methods=["POST"])
def store():
    body = request.get_json()
    if not body:
        return jsonify({"error": "body is required"}), 400
    try:
        store_report(body)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/match-volunteers", methods=["POST"])
def match():
    body = request.get_json()
    report_data = {
        "category": body.get("category", ""),
        "location": body.get("location", ""),
        "issue": body.get("issue", ""),
        "description": body.get("description", ""),
    }
    try:
        from google.cloud import firestore
        db = firestore.Client()

        category = report_data["category"].strip().capitalize()
        location = report_data["location"].lower()
        issue = report_data["issue"].lower()
        description = report_data["description"].lower()

        volunteers = db.collection("volunteers").stream()
        matches = []

        for doc in volunteers:
            v = doc.to_dict()
            if category not in v.get("categories", []):
                continue
            count = 0
            if v.get("location", "").lower() == location:
                count += 1
            for skill in v.get("skills", []):
                if skill.lower() in issue or skill.lower() in description:
                    count += 1
            profession = v.get("profession", "").lower()
            if profession and (profession in issue or profession in description):
                count += 1
            if v.get("availability", "").lower() == "available":
                count += 1
            matches.append({
                "id": doc.id,
                "name": v.get("name"),
                "contact": v.get("contact"),
                "skill": v.get("profession", "General"),
                "location": v.get("location", ""),
                "availability": v.get("availability", ""),
                "score": min(50 + count * 12, 99),
                "match_count": count,
            })

        matches.sort(key=lambda x: x["match_count"], reverse=True)
        return jsonify({"matches": matches[:3]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(port=port, debug=False)
