from google.cloud import firestore

db = firestore.Client()

def run_matching_pipeline(report_data):
    print("Matching volunteers for:", report_data)

    category = report_data.get("category", "").strip().capitalize()
    location = report_data.get("location", "").lower()
    issue = report_data.get("issue", "").lower()
    description = report_data.get("description", "").lower()

    volunteers = db.collection("volunteers").stream()

    matches = []

    for doc in volunteers:
        v = doc.to_dict()

        # 1. Category match (mandatory)
        if category not in v.get("categories", []):
            continue

        count = 0

        # 2. Location match
        if v.get("location", "").lower() == location:
            count += 1

        # 3. Skill match
        for skill in v.get("skills", []):
            skill_lower = skill.lower()
            if skill_lower in issue or skill_lower in description:
                count += 1

        # 4. Profession match
        profession = v.get("profession", "").lower()
        if profession and (profession in issue or profession in description):
            count += 1

        # 5. Availability match
        if v.get("availability", "").lower() == "available":
            count += 1

        matches.append({
            "id": doc.id,
            "name": v.get("name"),
            "contact": v.get("contact"),
            "match_count": count
        })

    # Sort by highest match count
    matches.sort(key=lambda x: x["match_count"], reverse=True)

    top_matches = matches[:3]

    print("Top Matches:", top_matches)

    # Store results
    db.collection("matches").add({
        "report": report_data,
        "matched_volunteers": top_matches
    })

    if category:
        db.collection(f"matches_{category.lower()}").add({
            "report": report_data,
            "matched_volunteers": top_matches
        })

    print("Matches stored")