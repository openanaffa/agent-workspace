from agent_pm.client import AgentPmClient


def test_client_default_url():
    client = AgentPmClient()
    assert client.base_url == "http://127.0.0.1:3000"
