from typing import List, Dict, Any, Optional
from .llm_service import LLMProvider, OllamaProvider, OpenAICompatibleProvider
from .parser_service import DocumentParserService
import json

class ExtractionService:
    @staticmethod
    def construct_prompt(fields: List[str], context: str) -> str:
        fields_str = "\n".join([f"- {field}" for field in fields])
        return f"""
You are an expert data extraction system specialized in automotive dealer documents.
Analyze the following document context extracted from a PDF and a Word file.
Extract the following fields accurately.

FIELDS TO EXTRACT:
{fields_str}

RULES:
1. Return ONLY a valid JSON object.
2. Do NOT guess or hallucinate. Use null if a field is not found.
3. Keep results concise.
4. If a field has multiple possible values, choose the most probable one from the combined context.

DOCUMENT CONTEXT:
--- START CONTEXT ---
{context}
--- END CONTEXT ---
"""

    @classmethod
    async def process_subfolder(
        cls,
        folder_path: str,
        fields: List[str],
        provider: LLMProvider
    ) -> Dict[str, Any]:
        context = DocumentParserService.get_context_from_folder(folder_path)
        if not context.strip():
            return {"error": "No readable document found in folder."}

        prompt = cls.construct_prompt(fields, context)
        try:
            result = await provider.generate_json(prompt, fields)
            # Ensure all requested fields exist in output, even if null
            for field in fields:
                if field not in result:
                    result[field] = None
            return result
        except Exception as e:
            return {"error": str(e)}
