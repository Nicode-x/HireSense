def generate_explanation(filename, matched_skills, missing_skills, final_score):
    if final_score >= 75:
        strength = "a strong match"
    elif final_score >= 50:
        strength = "a moderate match"
    else:
        strength = "a weak match"

    matched_text = ", ".join(matched_skills) if matched_skills else "no major matching skills"
    missing_text = ", ".join(missing_skills) if missing_skills else "no major missing skills"

    explanation = (
        f"{filename} is {strength} for this role. "
        f"The candidate matches key skills such as {matched_text}. "
        f"Missing or weaker areas include {missing_text}."
    )

    return explanation