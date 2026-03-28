from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import shutil

from app.parser import extract_resume_text
from app.utils import clean_text
from app.skills import extract_skills, calculate_match
from app.embedding import calculate_semantic_similarity
from app.explanation import generate_explanation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {"message": "Resume NLP Service Running "}

@app.post("/analyze-resume/")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    raw_text = extract_resume_text(file_path)
    cleaned_resume = clean_text(raw_text)
    resume_skills = extract_skills(cleaned_resume)

    cleaned_jd = clean_text(job_description)
    jd_skills = extract_skills(cleaned_jd)

    match_result = calculate_match(resume_skills, jd_skills)
    skill_match_score = match_result["match_score"]
    semantic_score = calculate_semantic_similarity(cleaned_resume, cleaned_jd)
    final_score = round((skill_match_score * 0.6) + (semantic_score * 0.4), 2)

    explanation = generate_explanation(
        file.filename,
        match_result["matched_skills"],
        match_result["missing_skills"],
        final_score
    )

    return {
        "filename": file.filename,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": match_result["matched_skills"],
        "missing_skills": match_result["missing_skills"],
        "skill_match_score": skill_match_score,
        "semantic_score": semantic_score,
        "final_score": final_score,
        "explanation": explanation
    }

@app.post("/analyze-multiple-resumes/")
async def analyze_multiple_resumes(
    files: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    results = []

    cleaned_jd = clean_text(job_description)
    jd_skills = extract_skills(cleaned_jd)

    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        raw_text = extract_resume_text(file_path)
        cleaned_resume = clean_text(raw_text)
        resume_skills = extract_skills(cleaned_resume)

        match_result = calculate_match(resume_skills, jd_skills)
        skill_match_score = match_result["match_score"]
        semantic_score = calculate_semantic_similarity(cleaned_resume, cleaned_jd)
        final_score = round((skill_match_score * 0.6) + (semantic_score * 0.4), 2)

        explanation = generate_explanation(
            file.filename,
            match_result["matched_skills"],
            match_result["missing_skills"],
            final_score
        )

        results.append({
            "filename": file.filename,
            "resume_skills": resume_skills,
            "matched_skills": match_result["matched_skills"],
            "missing_skills": match_result["missing_skills"],
            "skill_match_score": skill_match_score,
            "semantic_score": semantic_score,
            "final_score": final_score,
            "explanation": explanation
        })

    ranked_results = sorted(results, key=lambda x: x["final_score"], reverse=True)

    return {
        "jd_skills": jd_skills,
        "ranked_candidates": ranked_results
    }