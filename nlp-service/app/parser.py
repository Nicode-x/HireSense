from pdfminer.high_level import extract_text

def extract_resume_text(pdf_path):
    try:
        text = extract_text(pdf_path)
        return text
    except Exception as e:
        return f"Error extracting text: {str(e)}"