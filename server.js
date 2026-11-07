"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const rooms = new Map();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code;
  do {
    code = Array.from({ length: 5 }, () => chars[crypto.randomInt(chars.length)]).join("");
  } while (rooms.has(code));
  return code;
}

function token() {
  return crypto.randomBytes(20).toString("hex");
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 200000) reject(new Error("Request too large"));
    });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function cleanName(value) {
  return String(value || "").replace(/[^\p{L}\p{N} ._'!-]/gu, "").trim().slice(0, 22);
}

function roomState(room, viewer, viewerId) {
  const now = Date.now();
  for (const p of room.players.values()) p.online = now - p.lastSeen < 7000;
  const base = {
    code: room.code,
    phase: room.phase,
    checkpoint: room.checkpoint,
    evidenceShown: room.evidenceShown,
    answerOpen: room.answerOpen,
    answerRevealed: room.answerRevealed,
    revealedNodes: room.revealedNodes,
    playerCount: [...room.players.values()].filter(p => p.online).length,
    totalPlayers: room.players.size,
    version: room.version
  };

  if (viewer === "host") {
    base.players = [...room.players.values()].map(p => ({
      id: p.id, name: p.name, score: p.score, online: p.online,
      answered: p.answers.has(room.checkpoint)
    }));
    base.responses = responseCounts(room);
    return base;
  }

  const player = room.players.get(viewerId);
  base.me = player ? {
    id: player.id,
    name: player.name,
    score: player.score,
    answer: player.answers.get(room.checkpoint) ?? null,
    awarded: player.awarded.has(room.checkpoint)
  } : null;
  if (room.answerRevealed && room.checkpoint >= 0) {
    base.responses = responseCounts(room);
  }
  if (room.phase === "final") {
    base.leaderboard = leaderboard(room);
  }
  return base;
}

function responseCounts(room) {
  if (room.checkpoint < 0) return [];
  const counts = [0, 0, 0, 0];
  for (const player of room.players.values()) {
    const answer = player.answers.get(room.checkpoint);
    if (Number.isInteger(answer)) counts[answer] += 1;
  }
  return counts;
}

function leaderboard(room) {
  return [...room.players.values()]
    .map(p => ({ id: p.id, name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function freshRoom(code, hostToken) {
  return {
    code,
    hostToken,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
    phase: "lobby",
    checkpoint: -1,
    evidenceShown: 0,
    answerOpen: false,
    answerRevealed: false,
    revealedNodes: [],
    players: new Map()
  };
}

function bump(room) {
  room.updatedAt = Date.now();
  room.version += 1;
}

function requireRoom(code, res) {
  const room = rooms.get(code);
  if (!room) json(res, 404, { error: "Room not found or expired." });
  return room;
}

async function handleApi(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/rooms") {
    const code = randomCode();
    const hostToken = token();
    rooms.set(code, freshRoom(code, hostToken));
    return json(res, 201, { code, hostToken });
  }

  const match = url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{5})(?:\/(join|state|answer|host))?$/);
  if (!match) return json(res, 404, { error: "Unknown endpoint." });
  const code = match[1];
  const action = match[2] || "state";
  const room = requireRoom(code, res);
  if (!room) return;

  if (req.method === "POST" && action === "join") {
    const body = await readBody(req);
    const name = cleanName(body.name);
    if (!name) return json(res, 400, { error: "Enter a nickname." });
    let player = body.playerId ? room.players.get(String(body.playerId)) : null;
    if (player) {
      player.name = name;
      player.lastSeen = Date.now();
      player.online = true;
    } else {
      const id = token();
      player = { id, name, score: 0, answers: new Map(), awarded: new Set(), lastSeen: Date.now(), online: true };
      room.players.set(id, player);
    }
    bump(room);
    return json(res, 200, { playerId: player.id, state: roomState(room, "player", player.id) });
  }

  if (req.method === "GET" && action === "state") {
    const hostToken = url.searchParams.get("hostToken");
    const playerId = url.searchParams.get("playerId");
    if (hostToken && hostToken === room.hostToken) return json(res, 200, roomState(room, "host"));
    const player = room.players.get(playerId);
    if (!player) return json(res, 401, { error: "Join the room again." });
    player.lastSeen = Date.now();
    player.online = true;
    return json(res, 200, roomState(room, "player", playerId));
  }

  if (req.method === "POST" && action === "answer") {
    const body = await readBody(req);
    const player = room.players.get(String(body.playerId || ""));
    if (!player) return json(res, 401, { error: "Player not found." });
    if (!room.answerOpen || room.answerRevealed || room.checkpoint < 0) {
      return json(res, 409, { error: "Answering is not open." });
    }
    const answer = Number(body.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer > 3) return json(res, 400, { error: "Invalid answer." });
    if (player.answers.has(room.checkpoint)) return json(res, 409, { error: "Your answer is already locked." });
    player.answers.set(room.checkpoint, answer);
    player.lastSeen = Date.now();
    bump(room);
    return json(res, 200, { accepted: true });
  }

  if (req.method === "POST" && action === "host") {
    const body = await readBody(req);
    if (body.hostToken !== room.hostToken) return json(res, 403, { error: "Host access denied." });
    const command = body.command;
    switch (command) {
      case "start":
        if (room.phase !== "lobby") return json(res, 409, { error: "Game already started." });
        room.phase = "checkpoint";
        room.checkpoint = 0;
        room.evidenceShown = 0;
        break;
      case "revealEvidence":
        if (room.phase !== "checkpoint" || room.answerOpen) return json(res, 409, { error: "Cannot reveal evidence now." });
        room.evidenceShown = Math.min(4, room.evidenceShown + 1);
        break;
      case "openAnswers":
        if (room.phase !== "checkpoint" || room.evidenceShown < 4) return json(res, 409, { error: "Reveal all evidence first." });
        room.answerOpen = true;
        break;
      case "closeAnswers":
        room.answerOpen = false;
        break;
      case "revealAnswer":
        room.answerOpen = false;
        room.answerRevealed = true;
        for (const p of room.players.values()) {
          if (p.awarded.has(room.checkpoint)) continue;
          const correct = Number(body.correctAnswer);
          if (p.answers.get(room.checkpoint) === correct) p.score += 100;
          p.awarded.add(room.checkpoint);
        }
        if (!room.revealedNodes.includes(room.checkpoint)) room.revealedNodes.push(room.checkpoint);
        break;
      case "next":
        if (!room.answerRevealed) return json(res, 409, { error: "Reveal the answer first." });
        if (room.checkpoint >= 4) {
          room.phase = "final";
        } else {
          room.checkpoint += 1;
          room.phase = "checkpoint";
          room.evidenceShown = 0;
          room.answerOpen = false;
          room.answerRevealed = false;
        }
        break;
      case "reset":
        room.phase = "lobby";
        room.checkpoint = -1;
        room.evidenceShown = 0;
        room.answerOpen = false;
        room.answerRevealed = false;
        room.revealedNodes = [];
        for (const p of room.players.values()) {
          p.score = 0;
          p.answers.clear();
          p.awarded.clear();
        }
        break;
      default:
        return json(res, 400, { error: "Unknown host command." });
    }
    bump(room);
    return json(res, 200, roomState(room, "host"));
  }

  return json(res, 405, { error: "Method not allowed." });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/" || pathname.startsWith("/host") || pathname.startsWith("/play")) pathname = "/index.html";
  const full = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!full.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(full)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(req, res, url);
    else serveStatic(req, res, url);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) json(res, 500, { error: "Something went wrong." });
    else res.end();
  }
});

setInterval(() => {
  const cutoff = Date.now() - 6 * 60 * 60 * 1000;
  for (const [code, room] of rooms) if (room.updatedAt < cutoff) rooms.delete(code);
}, 10 * 60 * 1000).unref();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Milo's Primate ID Lab running on http://0.0.0.0:${PORT}`);
});
