// ubiq.js — the game's server side, shared by the routes in main.pb.js.
// Not a hook file itself (no .pb.js), so PocketBase loads it only through require().
//
// Every answer anyone gives is kept, per prompt. Your score for a round is the share of
// all answers to that prompt that match yours: the more ubiquitous, the better.

// The prompts. Their ids are what the answers table stores, so keep ids stable.
const PROMPTS = [
  { id: "fruit", text: "Name a fruit" },
  { id: "colour", text: "Name a colour" },
  { id: "kitchen", text: "Something in every kitchen" },
  { id: "pocket", text: "Something in your pocket" },
  { id: "pet-name", text: "A name for a pet" },
  { id: "sunday", text: "Something people do on a Sunday" },
  { id: "everyday-word", text: "A word you say every day" },
  { id: "everywhere", text: "Something that is everywhere" },
  { id: "breakfast", text: "A breakfast food" },
  { id: "sport", text: "A sport" },
  { id: "zoo", text: "An animal at the zoo" },
  { id: "holiday", text: "Something you pack for a holiday" },
  { id: "instrument", text: "A musical instrument" },
  { id: "vegetable", text: "A vegetable" },
  { id: "sky", text: "Something in the sky" },
  { id: "late", text: "A reason to be late" },
  { id: "board-game", text: "A board game" },
  { id: "charge", text: "Something you charge" },
  { id: "classroom", text: "Something in a classroom" },
  { id: "topping", text: "A pizza topping" },
  { id: "round", text: "Something round" },
  { id: "drink", text: "A drink" },
  { id: "big", text: "A word that means big" },
  { id: "superpower", text: "A superpower" },
];

const MAX_LENGTH = 40;

// Lower case, plain characters, single spaces, no leading article: "  The Apples!" → "apples".
function normalize(raw) {
  let s = String(raw == null ? "" : raw).toLowerCase();
  s = s.replace(/[‘’]/g, "'");
  s = s.replace(/[^a-z0-9à-ÿ' -]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/^(a|an|the|my|some) /, "");
  if (s.length > MAX_LENGTH) s = s.slice(0, MAX_LENGTH).trim();
  return s;
}

// Spellings that should count as the same answer: singular and plural of the last word.
function variants(s) {
  const out = [s];
  const m = s.match(/^(.*?)([^ ]+)$/);
  if (!m) return out;
  const head = m[1];
  const w = m[2];
  const add = (x) => {
    const v = head + x;
    if (x && out.indexOf(v) === -1) out.push(v);
  };
  if (/ies$/.test(w) && w.length > 4) add(w.slice(0, -3) + "y");
  if (/(s|x|z|ch|sh)es$/.test(w)) add(w.slice(0, -2));
  if (/s$/.test(w) && !/ss$/.test(w) && w.length > 3) add(w.slice(0, -1));
  if (/[^aeiou]y$/.test(w)) add(w.slice(0, -1) + "ies");
  if (/(s|x|z|ch|sh)$/.test(w)) add(w + "es");
  if (!/s$/.test(w)) add(w + "s");
  return out;
}

function count(app, sql, params) {
  const row = new DynamicModel({ n: 0 });
  app.db().newQuery(sql).bind(params || {}).one(row);
  return row.n;
}

// The crowd's spelling of an answer: if someone already said "apple", "apples" joins it.
function crowdForm(app, prompt, base) {
  const forms = variants(base);
  const params = { p: prompt };
  const slots = forms.map((f, i) => {
    params["a" + i] = f;
    return "{:a" + i + "}";
  });
  const rows = arrayOf(new DynamicModel({ answer: "", n: 0 }));
  app.db()
    .newQuery(
      "SELECT answer, COUNT(*) AS n FROM answers WHERE prompt = {:p} AND answer IN (" +
        slots.join(",") + ") GROUP BY answer ORDER BY n DESC, answer ASC LIMIT 1")
    .bind(params)
    .all(rows);
  return rows.length ? rows[0].answer : base;
}

function stats(app, prompt, answer) {
  const total = count(app, "SELECT COUNT(*) AS n FROM answers WHERE prompt = {:p}", { p: prompt });
  const mine = count(app, "SELECT COUNT(*) AS n FROM answers WHERE prompt = {:p} AND answer = {:a}",
    { p: prompt, a: answer });
  const top = arrayOf(new DynamicModel({ answer: "", n: 0 }));
  app.db()
    .newQuery(
      "SELECT answer, COUNT(*) AS n FROM answers WHERE prompt = {:p} " +
        "GROUP BY answer ORDER BY n DESC, answer ASC LIMIT 5")
    .bind({ p: prompt })
    .all(top);
  return {
    answer: answer,
    mine: mine,
    total: total,
    share: total ? Math.round((100 * mine) / total) : 0,
    top: top.map((r) => ({ answer: r.answer, n: r.n })),
  };
}

module.exports = { PROMPTS, MAX_LENGTH, normalize, variants, count, crowdForm, stats };
