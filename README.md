# Milo’s Primate ID Lab

A live, classroom-friendly classification game built around a crocheted monkey named Milo. One host reveals evidence while players join from their phones and classify Milo through five checkpoints.

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`. The host creates a room and players join through the QR code or five-character room code.

## Game path

Primate → Haplorrhine → Anthropoid → Platyrrhine → Spider monkey

Each correct checkpoint is worth 100 points. There is no speed bonus and the leaderboard appears only at the end.

## Notes

- Rooms and nicknames are held only in server memory and expire after six hours.
- A server restart ends active rooms.
- Content is editable in `public/content.js`.
- The mascot is based on Isabella’s handmade crochet monkey. Milo is a stylized teaching model; evidence cards provide anatomy that cannot be shown precisely in crochet.
