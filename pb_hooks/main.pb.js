/// <reference path="../pb_data/types.d.ts" />
// main.pb.js — the game's three routes. THIS FILE RUNS ON THE SERVER.
//
// The answers and scores collections are locked (no API rules), so these routes are the
// only way in: they decide what counts as an answer and what a player sees back.
// PocketBase runs each handler in its own context, so shared code comes in through
// require() inside the handler, never from this file's top level.

// GET /api/ubiq/prompts → { prompts: [{id, text}], games }
routerAdd("GET", "/api/ubiq/prompts", (e) => {
  const u = require(`${__hooks}/ubiq.js`);
  return e.json(200, {
    prompts: u.PROMPTS,
    games: u.count($app, "SELECT COUNT(*) AS n FROM scores"),
  });
});

// POST /api/ubiq/answer {prompt, answer} → how ubiquitous that answer is, counting it
routerAdd("POST", "/api/ubiq/answer", (e) => {
  const u = require(`${__hooks}/ubiq.js`);
  const body = e.requestInfo().body || {};
  const prompt = u.PROMPTS.find((p) => p.id === body.prompt);
  if (!prompt) throw new BadRequestError("Unknown prompt.");
  const base = u.normalize(body.answer);
  if (!/[a-z0-9à-ÿ]/.test(base)) throw new BadRequestError("Say something first.");

  const answer = u.crowdForm($app, prompt.id, base);
  const record = new Record($app.findCollectionByNameOrId("answers"));
  record.set("prompt", prompt.id);
  record.set("answer", answer);
  $app.save(record);
  return e.json(200, u.stats($app, prompt.id, answer));
});

// POST /api/ubiq/finish {score: 0-100} → { betterThan: % of earlier games, games }
routerAdd("POST", "/api/ubiq/finish", (e) => {
  const u = require(`${__hooks}/ubiq.js`);
  const body = e.requestInfo().body || {};
  const score = Number(body.score);
  if (!Number.isInteger(score) || score < 0 || score > 100) throw new BadRequestError("Bad score.");

  const earlier = u.count($app, "SELECT COUNT(*) AS n FROM scores");
  const lower = u.count($app, "SELECT COUNT(*) AS n FROM scores WHERE score < {:s}", { s: score });
  const record = new Record($app.findCollectionByNameOrId("scores"));
  record.set("score", score);
  $app.save(record);
  return e.json(200, {
    betterThan: earlier ? Math.round((100 * lower) / earlier) : 100,
    games: earlier + 1,
  });
});
