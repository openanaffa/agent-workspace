export type AgentPmClientOptions = {
  baseUrl: string;
};

export function createClient(options: AgentPmClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/+$/, "");

  return {
    async health(): Promise<{ ok: boolean }> {
      const response = await fetch(`${baseUrl}/health`);
      return response.json();
    },

    async listProjects(): Promise<unknown[]> {
      const response = await fetch(`${baseUrl}/api/projects`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },

    async createProject(input: { name: string; description?: string }) {
      const response = await fetch(`${baseUrl}/api/projects`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },

    websocket() {
      const wsUrl = baseUrl.replace(/^http/, "ws") + "/ws";
      return new WebSocket(wsUrl);
    },
  };
}
