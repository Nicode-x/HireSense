SKILL_KEYWORDS = [
    "python", "java", "c++", "javascript", "typescript",
    "react", "node", "express", "mongodb", "mysql", "sql",
    "postgresql", "html", "css", "tailwind", "bootstrap",
    "machine learning", "deep learning", "nlp", "data science",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "fastapi", "flask", "django", "rest api", "git", "github",
    "docker", "kubernetes", "aws", "azure", "firebase",
    "redux", "next.js", "socket.io", "linux", "opencv"
]

def extract_skills(text):
    found_skills = []

    for skill in SKILL_KEYWORDS:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return list(set(found_skills))


def calculate_match(resume_skills, jd_skills):
    resume_set = set([skill.lower() for skill in resume_skills])
    jd_set = set([skill.lower() for skill in jd_skills])

    matched_skills = list(resume_set.intersection(jd_set))
    missing_skills = list(jd_set - resume_set)

    match_score = 0
    if len(jd_set) > 0:
        match_score = round((len(matched_skills) / len(jd_set)) * 100, 2)

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_score": match_score
    }