export type Config = {
  host: string;
  port: number;
  databasePath: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    host: env.HOST ?? "127.0.0.1",
    port: Number(env.PORT ?? 3000),
    databasePath: env.DATABASE_PATH ?? "./data/agent-pm.sqlite",
  };
}
