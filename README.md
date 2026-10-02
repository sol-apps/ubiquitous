---
solhann_app: true
slug: ubiquitous
title: Ubiquitous
description: Say what everyone says: a game about thinking like the crowd.
---

# Ubiquitous

Say what everyone says: a game about thinking like the crowd.

**Live:** https://ubiquitous.solhann.net
**Gallery:** https://create.solhann.net

## How it works

Five random prompts a game ("Name a fruit", "Something that is everywhere", …). Your
score for a round is the share of everyone's answers to that prompt that match yours, so
the most common answer wins. Answers are folded together lightly: case, punctuation, a
leading "a"/"the", and singular/plural ("Apples!" counts as `apple`).

The crowd lives in this app's PocketBase: `answers` and `scores`, both locked, reached
only through the routes in `pb_hooks/main.pb.js` (`/api/ubiq/prompts`, `/answer`,
`/finish`). The prompts and the scoring are in `pb_hooks/ubiq.js`. A migration seeds a
starting crowd of about 1,450 guessed answers so the first game has something to match.
Browse or tidy the data at https://ubiquitous.solhann.net/_/.
