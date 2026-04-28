import os
import json
import time
from google import genai
from dotenv import load_dotenv
from google.cloud import firestore
from match import run_matching_pipeline

# Load environment variables
load_dotenv()

# Initialize clients
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
db = firestore.Client()


# Analyze report using AI
def analyze_report(text):
    prompt = f"""
Extract the report details and return ONLY valid JSON.

Fields:
name, contact, issue, description, location, category

Categories:
Health, Education, Infrastructure, Food, Agriculture, Law, Others

Do NOT include markdown or extra text.

Report:
{text}
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            result = response.text.replace("```json", "").replace("```", "").strip()

            return json.loads(result)

        except Exception as e:
            print(f"Retry {attempt+1} due to error:", e)
            time.sleep(2)

    raise Exception("Failed to get response from Gemini")


# Store report in Firestore
def store_report(data):
    data["status"] = "new"

    # Normalize category
    category = data.get("category", "Others").strip().capitalize()
    data["category"] = category

    # Store in main collection
    db.collection("reports").add(data)

    # Store in category-specific collection
    db.collection(f"reports_{category.lower()}").add(data)

    print("Report stored in Firestore")

    # Trigger matching
    run_matching_pipeline(data)


# Main function (terminal input)
def main():
    print("Enter report in ONE line:")

    report = input()

    if not report.strip():
        print("No report entered")
        return

    print("Analyzing report...")

    data = analyze_report(report)

    print("Extracted Data:", data)

    store_report(data)


# Run
if __name__ == "__main__":
    main()