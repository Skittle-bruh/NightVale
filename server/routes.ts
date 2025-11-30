import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { changelogDataSchema, insertChangelogEntrySchema, type ChangelogEntry } from "@shared/schema";

const CHANGELOG_PATH = join(process.cwd(), "shared", "changelog.json");

function readChangelog() {
  try {
    const data = readFileSync(CHANGELOG_PATH, "utf-8");
    return changelogDataSchema.parse(JSON.parse(data));
  } catch {
    return { entries: [] };
  }
}

function writeChangelog(entries: ChangelogEntry[]) {
  writeFileSync(CHANGELOG_PATH, JSON.stringify({ entries }, null, 2));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/changelog", (_req, res) => {
    const data = readChangelog();
    res.json(data.entries);
  });

  app.post("/api/admin/changelog", (req, res) => {
    const adminKey = req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = insertChangelogEntrySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data", details: result.error.errors });
    }

    const data = readChangelog();
    data.entries.unshift(result.data);
    writeChangelog(data.entries);

    res.json({ success: true, entry: result.data });
  });

  app.put("/api/admin/changelog/:version", (req, res) => {
    const adminKey = req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = insertChangelogEntrySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data", details: result.error.errors });
    }

    const data = readChangelog();
    const index = data.entries.findIndex(e => e.version === req.params.version);
    
    if (index === -1) {
      return res.status(404).json({ error: "Entry not found" });
    }

    data.entries[index] = result.data;
    writeChangelog(data.entries);

    res.json({ success: true, entry: result.data });
  });

  app.delete("/api/admin/changelog/:version", (req, res) => {
    const adminKey = req.headers["x-admin-key"];
    const expectedKey = process.env.ADMIN_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = readChangelog();
    const index = data.entries.findIndex(e => e.version === req.params.version);
    
    if (index === -1) {
      return res.status(404).json({ error: "Entry not found" });
    }

    data.entries.splice(index, 1);
    writeChangelog(data.entries);

    res.json({ success: true });
  });

  return httpServer;
}
