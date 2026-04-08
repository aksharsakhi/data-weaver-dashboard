import fitz  # PyMuPDF
import docx
import os
from typing import Optional

class DocumentParserService:
    @staticmethod
    def parse_pdf(file_path: str) -> str:
        text = ""
        try:
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
        except Exception as e:
            print(f"Error parsing PDF {file_path}: {e}")
        return text

    @staticmethod
    def parse_docx(file_path: str) -> str:
        text = ""
        try:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error parsing Word {file_path}: {e}")
        return text

    @classmethod
    def get_context_from_folder(cls, folder_path: str) -> str:
        context = ""
        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)
            if file.endswith(".pdf"):
                context += f"--- PDF CONTENT: {file} ---\n"
                context += cls.parse_pdf(file_path) + "\n\n"
            elif file.endswith((".docx", ".doc")):
                context += f"--- WORD CONTENT: {file} ---\n"
                context += cls.parse_docx(file_path) + "\n\n"
        return context
