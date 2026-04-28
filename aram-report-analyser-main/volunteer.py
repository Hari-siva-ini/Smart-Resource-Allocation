from google.cloud import firestore

db = firestore.Client()

def add_volunteer(name, contact, location, skills, categories, profession, availability):
    data = {
        "name": name,
        "contact": contact,
        "location": location,
        "skills": skills,
        "categories": [c.strip().capitalize() for c in categories],
        "profession": profession,
        "availability": availability
    }

    db.collection("volunteers").add(data)
    print("Volunteer added")


# Sample volunteers

add_volunteer(
    name="Arun",
    contact="9000000001",
    location="Salem",
    skills=["first aid", "medical support"],
    categories=["Health"],
    profession="Nurse",
    availability="available"
)

add_volunteer(
    name="Priya",
    contact="9000000002",
    location="Chennai",
    skills=["teaching", "child care"],
    categories=["Education"],
    profession="Teacher",
    availability="available"
)

add_volunteer(
    name="Ravi",
    contact="9000000003",
    location="Madurai",
    skills=["water supply", "logistics"],
    categories=["Infrastructure"],
    profession="Engineer",
    availability="available"
)

add_volunteer(
    name="Karthik",
    contact="9000000004",
    location="Thanjavur",
    skills=["farming", "crop management"],
    categories=["Agriculture"],
    profession="Farmer",
    availability="available"
)

add_volunteer(
    name="Divya",
    contact="9000000005",
    location="Coimbatore",
    skills=["legal advice", "documentation"],
    categories=["Law"],
    profession="Lawyer",
    availability="available"
)