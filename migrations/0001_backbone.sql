-- Reference migration for the initial schema.
-- apps/server/src/db.ts currently applies this schema programmatically.
-- Move execution to numbered migrations when migration lifecycle becomes necessary.

CREATE TABLE IF NOT EXISTS projects (...);
CREATE TABLE IF NOT EXISTS agents (...);
CREATE TABLE IF NOT EXISTS tasks (...);
CREATE TABLE IF NOT EXISTS events (...);
