"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const sqlite3 = require("sqlite3");

const PORT = Number(process.env.PORT) || 8787;
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "nasa.db");
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      crew_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      color TEXT NOT NULL,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS plans (
      crew_id TEXT PRIMARY KEY REFERENCES users(crew_id) ON DELETE CASCADE,
      plan_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crew_id TEXT NOT NULL REFERENCES users(crew_id) ON DELETE CASCADE,
      feedback_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
});

function send(response, status, body, contentType = "application/json") {
  response.writeHead(status, {
    "Content-Type": `${contentType}; charset=utf-8`,
    "Cache-Control": "no-store"
  });
  response.end(contentType === "application/json" ? JSON.stringify(body) : body);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) reject(new Error("Request is too large."));
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function run(sql, parameters) {
  return new Promise((resolve, reject) => {
    db.run(sql, parameters, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function all(sql, parameters) {
  return new Promise((resolve, reject) => {
    db.all(sql, parameters, (error, rows) => error ? reject(error) : resolve(rows));
  });
}

async function saveCrewData(crewId, plan, feedback) {
  const now = new Date().toISOString();
  await run("PRAGMA foreign_keys = ON");
  await run(
    `INSERT INTO plans (crew_id, plan_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(crew_id) DO UPDATE SET plan_json = excluded.plan_json, updated_at = excluded.updated_at`,
    [crewId, JSON.stringify(plan), now]
  );
  await run("DELETE FROM feedback WHERE crew_id = ?", [crewId]);
  for (const entry of feedback) {
    await run(
      "INSERT INTO feedback (crew_id, feedback_json, created_at) VALUES (?, ?, ?)",
      [crewId, JSON.stringify(entry), now]
    );
  }
}

async function handleApi(request, response, pathname) {
  if (request.method === "POST" && pathname === "/api/users") {
    const user = await readJson(request);
    if (!user.id || !user.name || !user.salt || !user.passwordHash) {
      return send(response, 400, { error: "Incomplete user record." });
    }
    await run(
      `INSERT INTO users (crew_id, name, role, color, salt, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(crew_id) DO UPDATE SET name = excluded.name, role = excluded.role,
         color = excluded.color, salt = excluded.salt, password_hash = excluded.password_hash`,
      [user.id, user.name, user.role || "crew", user.color || "", user.salt, user.passwordHash, new Date().toISOString()]
    );
    return send(response, 201, { saved: true });
  }

  const crewMatch = pathname.match(/^\/api\/crew\/([a-z0-9_-]+)$/);
  if (crewMatch && request.method === "POST") {
    const crewId = crewMatch[1];
    const data = await readJson(request);
    await saveCrewData(crewId, data.plan || null, Array.isArray(data.feedback) ? data.feedback : []);
    return send(response, 200, { saved: true });
  }

  if (crewMatch && request.method === "GET") {
    const crewId = crewMatch[1];
    const planRows = await all("SELECT plan_json FROM plans WHERE crew_id = ?", [crewId]);
    const feedbackRows = await all("SELECT feedback_json FROM feedback WHERE crew_id = ? ORDER BY id", [crewId]);
    return send(response, 200, {
      plan: planRows[0] ? JSON.parse(planRows[0].plan_json) : null,
      feedback: feedbackRows.map((row) => JSON.parse(row.feedback_json))
    });
  }

  return send(response, 404, { error: "API route not found." });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  try {
    if (requestUrl.pathname.startsWith("/api/")) {
      await handleApi(request, response, requestUrl.pathname);
      return;
    }
    const requested = requestUrl.pathname === "/" ? "/nasa.html" : requestUrl.pathname;
    const filePath = path.resolve(ROOT, `.${requested}`);
    if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
      send(response, 403, { error: "Forbidden." });
      return;
    }
    const content = fs.readFileSync(filePath);
    const extension = path.extname(filePath);
    const contentType = extension === ".html" ? "text/html" : extension === ".js" ? "text/javascript" : "text/css";
    send(response, 200, content, contentType);
  } catch (error) {
    send(response, 500, { error: error instanceof Error ? error.message : "Server error." });
  }
});

server.listen(PORT, () => {
  console.log(`SSRS running at http://localhost:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
});
