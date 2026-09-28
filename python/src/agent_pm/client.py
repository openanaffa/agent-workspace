from dataclasses import dataclass
from urllib.request import Request, urlopen
import json


@dataclass(slots=True)
class AgentPmClient:
    base_url: str = "http://127.0.0.1:3000"

    def _request(self, method: str, path: str, payload: dict | None = None) -> dict | list:
        body = None
        headers = {}
        if payload is not None:
            body = json.dumps(payload).encode()
            headers["Content-Type"] = "application/json"

        request = Request(
            f"{self.base_url.rstrip('/')}{path}",
            method=method,
            data=body,
            headers=headers,
        )

        with urlopen(request, timeout=10) as response:
            return json.loads(response.read())

    def health(self) -> dict:
        return self._request("GET", "/health")

    def list_projects(self) -> list:
        return self._request("GET", "/api/projects")

    def create_project(self, name: str, description: str = "") -> dict:
        return self._request(
            "POST",
            "/api/projects",
            {"name": name, "description": description},
        )
