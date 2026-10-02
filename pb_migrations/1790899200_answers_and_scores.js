/// <reference path="../pb_data/types.d.ts" />
// The game's data. Both collections are locked (every rule null): only the routes in
// pb_hooks/main.pb.js read or write them, and the owner can browse them at /_/.
migrate((app) => {
  const locked = { listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null };
  app.save(new Collection(Object.assign({
    type: "base",
    name: "answers",
    fields: [
      { name: "prompt", type: "text", required: true, max: 32 },
      { name: "answer", type: "text", required: true, max: 40 },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
    indexes: ["CREATE INDEX `idx_answers_prompt_answer` ON `answers` (`prompt`, `answer`)"],
  }, locked)));
  app.save(new Collection(Object.assign({
    type: "base",
    name: "scores",
    fields: [
      { name: "score", type: "number", min: 0, max: 100, onlyInt: true },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
    indexes: ["CREATE INDEX `idx_scores_score` ON `scores` (`score`)"],
  }, locked)));
}, (app) => {
  app.delete(app.findCollectionByNameOrId("scores"));
  app.delete(app.findCollectionByNameOrId("answers"));
});
