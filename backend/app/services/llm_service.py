from abc import ABC, abstractmethod
from typing import Dict, Any, List
import httpx
import json

class LLMProvider(ABC):
    @abstractmethod
    async def generate_json(self, prompt: str, schema: List[str]) -> Dict[str, Any]:
        pass

class OllamaProvider(LLMProvider):
    def __init__(self, base_url: str, model: str):
        self.base_url = base_url
        self.model = model

    async def generate_json(self, prompt: str, schema: List[str]) -> Dict[str, Any]:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "format": "json",
            "stream": False
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            result = response.json()
            try:
                # Some Ollama model outputs need manual JSON parsing if they wrap it
                raw_response = result.get("response", "")
                return json.loads(raw_response)
            except (ValueError, json.JSONDecodeError):
                # Fallback extraction in case JSON wasn't returned cleanly
                return {"error": "Invalid LLM output", "raw": raw_response}

class OpenAICompatibleProvider(LLMProvider):
    def __init__(self, api_key: str, model: str, base_url: str = "https://api.openai.com/v1"):
        self.api_key = api_key
        self.model = model
        self.base_url = base_url

    async def generate_json(self, prompt: str, schema: List[str]) -> Dict[str, Any]:
        url = f"{self.base_url}/chat/completions"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a data extraction system. ALWAYS respond in valid JSON format only."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            raw_response = result["choices"][0]["message"]["content"]
            return json.loads(raw_response)
