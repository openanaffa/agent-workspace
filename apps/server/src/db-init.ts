import { loadConfig } from "./config";
import { openDatabase, migrate } from "./db";

const config = loadConfig();
const db = openDatabase(config.databasePath);
migrate(db);
db.close();

console.log(`database initialized: ${config.databasePath}`);
