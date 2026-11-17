# SKYDROP ROYALE — Chapter 4 Season 1-inspired prototype

A Three.js battle-royale prototype with bots, building, edits, web swinging and mythic equipment, a code-based real-player online match playtest, and a separate real-player multiplayer 3D event. This is not Fortnite, an official product, or a 1:1 recreation. The Chapter 4 locations, player models, event and interface are independent procedural approximations of the supplied references.

## Play / deploy

The ready-to-host ZIP includes a built `dist/` and Node static server. Unzip and run `npm start` with Node.js 20+, then open `http://localhost:3000`; set `PORT` if needed. The Node server is required for the real-player multiplayer event; a static-only host can serve the game but the event will fall back to a clearly labeled offline version with bots. Everyone joining the event must use the same hosted Node server URL. The source ZIP can be changed and rebuilt using:

```sh
npm ci
npm run build
npm start
```

WebGL and a mouse/keyboard are recommended. The game uses local browser storage; switching browsers, sites or clearing storage can remove local progress. The hosted Render URL is a different browser origin from localhost, so progress will not automatically transfer. B-Bucks are simulated and free: no real payments, accounts or public matchmaking. Regular PLAY remains a local match with bots; FRIENDS opens the separate experimental real-player free-for-all described below.

## Deploy on Render

Use the **source ZIP**, not the prebuilt hosting ZIP, for this workflow. It contains `render.yaml` and all source and server files.

1. Extract the source ZIP, and upload its contents (not the ZIP itself) to the root of a GitHub repository. The root must contain `package.json`, `package-lock.json`, `render.yaml`, `src/` and `server/`. Do not upload private files from other folders.
2. In Render, create a **Web Service** connected to that repository. Alternatively, use **New → Blueprint** with the included `render.yaml`. For a manually created web service select Node, build command `npm ci --include=dev && npm run build`, start command `npm start`, and Node version 20 (the Blueprint sets it). The service must remain a **web service**, not a static site.
3. Wait for the build and deployment. Open the service's `https://...onrender.com` URL and give that exact URL to friends. The server binds `0.0.0.0` and reads Render's `PORT`; `/healthz` is its health check. No separate backend address is needed.
4. Open **FRIENDS**, enter a display name, and select **CREATE ROOM**. Share the six-character code. Friends open the same URL, choose FRIENDS, enter the code and JOIN ROOM. Once at least two are present, the host selects START MATCH. Click the game to capture the mouse. Return to the lobby to leave.
5. **JOIN LIVE EVENT** uses a different shared room; everyone joins the live event directly rather than using the match code. The event's eight bots are labeled. If it says OFFLINE, multiplayer is not connected.

The website and both APIs use same-origin relative `/api/match` and `/api/event` URLs. The one Node web service handles these routes; it is not an arbitrary web-browsing proxy. In local Vite dev/preview, the configured `/api` proxy forwards to the Node server on port 3000. A school network or browser policy can still block the hosted URL or WebGL.

On Render's free plan the service can spin down after inactivity and may take time to wake; check current limits at https://render.com/docs/free. Rooms are in memory and disappear on restart, redeploy, spin-down or crashes. Run **one instance**: separate instances have separate rooms, so autoscaling/multiple replicas will break matchmaking and event sharing. Do not use a static host for multiplayer.

## Online match playtest limitations

This is an **early experimental free-for-all** for 2–8 human players in one code-based room. Players appear on the same procedural terrain and share a bus route, position, basic held-weapon visuals, hits, room text chat, and player build placement/edits/destruction. The storm uses the same seeded layout, but timing is client-simulated. Live event multiplayer is separate. There are **no bots, squads or teammate revives in the online playtest**; those remain in the local bot match. Loot and pickups, player inventory, environmental destruction, vehicles, world events and other match systems are not fully synchronized. Physics, damage reports and other gameplay are client-trusted; no accounts, moderation, authoritative game server, anti-cheat, persistent online data or production security is provided. Chat is unmoderated. Simultaneous edits or disconnects can cause mismatches. Do not expose it as a production game or promise complete Fortnite-style multiplayer.

## Performance Mode

Settings → VIDEO → **Performance Mode (max 24 bots)** uses a fixed lower render scale (up to 70%), no shadows, bloom, ambient occlusion or post-processing, much less grass and decorative ambient effects, and nearest-filtered terrain for a slightly blockier look. The live event also uses lower resolution without antialiasing. Local bot matches cap at 24 bots while it is on; the saved bot preference remains unchanged and is restored when it is off. Lowering quality cannot guarantee a particular FPS; hardware acceleration and sufficient memory are still important. The default look returns when the toggle is off.

## Event timer troubleshooting

1. Download and extract the **updated** ready-to-host ZIP into a fresh folder. Open a terminal in that folder (it must contain `package.json`, `server/` and `dist/`). Install Node.js 20 or newer if needed.
2. Stop any old copy with Ctrl+C in its terminal. Run `npm start` and keep that terminal open. You should see `Skydrop Royale listening on 0.0.0.0:3000`.
3. Open `http://localhost:3000`, refresh the page (hard refresh if necessary), and choose Join Live Event. The number should count down from 25 without needing more players. `8 BOTS • OFFLINE` means the Node multiplayer server or event stream could not be reached; leave the event and rejoin after fixing the server.
4. If port 3000 is already in use, stop the other server, or use `PORT=3001 npm start` on macOS/Linux or `$env:PORT=3001; npm start` in PowerShell and open `http://localhost:3001`.
5. For real multiplayer, host the Node server where other players can reach it and have everyone open that same server URL. `localhost` only refers to each person's own computer. If deployed behind a proxy, allow unbuffered, long-lived Server-Sent Event connections to `/api/event/stream`. The offline event is not synchronized between players.

For source development, run `npm ci` and `npm run build` before `npm start`. If using `npm run dev` or `npm run preview`, also run `npm start` in a second terminal for the API; use port 5173 for the Vite page and keep the Node server on port 3000.

## Season 4 update

- Nine screenshot-inspired Chapter 4 districts now have distinct procedural layouts: Breakwater Bay's docks and boats, the Citadel's fortified keep, bridge and paired knight statues, Anvil Square's half-timbered village and tower, Brutal Bastion's snow fortress, Lonely Labs' orange research buildings with dark arched roofs, Slappy Shores' factory and smokestacks, Shattered Slabs' cut-stone blocks and painted quarry pool, Faulty Splits' commercial streets, and Frenzy Fields' farmhouse, barn and crop rows. They use build-piece structures, modeled props and loot, with several furnished interiors. The island and all models remain independently made, scaled-down interpretations rather than official assets or an exact copy; the quarry pool is painted terrain, not swimming water.
- The lobby's **Join Live Event** opens a synchronized 3D sequence for up to 24 people connected to the same Node server. Players begin together on an old-island recreation, can move around a bounded section with WASD/arrows and sprint with Shift, then are carried away as it fractures. The Chapter 4 island flips into view and pulls everyone back down. Once landed, you can move again; Escape or Leave Event returns to the lobby. The first arrival starts a 25-second countdown, followed by a 65-second event; late arrivals join the current phase. Leave and rejoin after the event finishes to replay.
- The event uses full gameplay terrain and the game's procedural building pieces, props, trees and rocks, rebuilt from the original gameplay plans with independent instance buffers. The new island is the Chapter 4-inspired gameplay island, not a set of generic placeholder boxes and cone trees. The old island has reconstructed Chapter 3-inspired buildings on the current terrain: the original old terrain and official Fortnite assets were not retained or provided. Neither is an exact official Fortnite map, and the sequence is separate from the match.
- Eight clearly labeled scripted bots walk around and fly in the event. On the Node server, their positions are sent to every connected player; they are not real people, don't fight, and don't count toward the 24-human cap. If connecting fails or times out, the event switches to **OFFLINE • BOTS ONLY**, and its countdown and sequence work locally; no real-player multiplayer is available in that mode. Leave and rejoin after starting the server to return online.
- Shop purchases automatically equip, and equipped locker pickaxes and gliders now appear on the player in matches, and equipped wraps tint held weapons. Cosmetic meshes and wrap effects are procedural approximations; rarity effects and every individual weapon are not separately skinned. Glider animation is attached to a stable player root, held weapons hide during flight, and the aerial camera avoids close-range collision flicker.
- Event connections use the same-origin Node server's HTTP endpoints and Server-Sent Events; the server maintains one active event per process and participants in memory. Leaving or disconnecting removes the participant, and a server restart resets the event. A server behind a reverse proxy must permit long-lived, unbuffered event streams. Open the same public hosted URL in separate browsers to play together; `localhost` is local to each machine, and a static file host is not enough. The event has no account, chat, moderation, persistence, anti-cheat or authoritative movement validation. Event rooms have a 24-player cap and are a small prototype, not production-scale multiplayer.
- The 100-tier pass has ten pages, selectable rewards, eight new procedural outfits, previously available outfits, a rotating Three.js character preview, and claimable simulated currency and cosmetics. Some cosmetic rewards repeat; non-outfit rewards preview a representative character rather than a 3D model of that item. The 900 B-Bucks pass price is simulated. Purchased/claimed cosmetics are saved locally and appear in the locker. Cosmetics do not represent official Fortnite skins; cosmetic visuals are procedural approximations.
- Existing saves migrate once: level and XP, quest and season-pass claims reset, while previously purchased cosmetics and claimed prior-pass cosmetics, the selected skin, balance and statistics remain. The prior pass itself is not carried into the new season. Progress is browser-local.
- Each player elimination grants enough XP for one level, each claimed daily quest grants one level, and each victory grants 100 simulated B-Bucks once. Levels cap at 100. Quests use cumulative player stats, not per-day tracking. Rewards are earned within this local prototype and have no real-world value.
- The item shop rotates on each UTC clock hour and displays a countdown; owned items and balances stay local. The shop's selection is deterministic, not a live service. The B-Bucks screen is a free demo.

## Controls and retained features

WASD moves, mouse aims and fires. Q places a wall, C a floor, F stairs and V a cone/roof. G edits a build piece and R resets the edit. E interacts; hold E for 5 seconds within 3 units of a downed allied bot to revive them. Releasing or moving away cancels progress. A rescuer has a 5-second cooldown after reviving; other nearby allied bots can also revive. Downed allied bots move slowly toward the player, bleed out after 25 seconds and can be finished by enemy damage. Pressing E in open water no longer generates random loot. The player cannot be downed/revived in this prototype. J activates a boss mythic, K pings, and 7/8/9 direct allied bots in team modes. Settings lists the other controls.

PLAY opens the pre-drop briefing, with daily quests and a selectable favorite landing spot. The game retains destructible builds and POIs, interiors/loot, bots and allied bot commands, vehicles, a moving train/vault, storm anomalies, web swinging, boss abilities, and the Observatory/Ironworks story prototype. The real-player 3D flip event and online free-for-all are separate from the bot-based match. Creative and Studio modes remain removed.

## Limitations and testing

Characters and environments are stylized procedural meshes, **not photorealistic models or exact reference assets**. The event animates cloned terrain and gameplay-model scenery; it does not physically destroy the full match map. Players can move only within a bounded event area, then follow a synchronized flight path. Gameplay systems and collision are prototypes, and not every build/edit, character, weapon, quest or Fortnite mechanic is reproduced. Bot teammates and event bots are not human players. Visual fidelity and performance vary by hardware; large scenes may be slow, especially on software rendering. The production build and browser-based progression, pass claim, shop, event and match-start logic were checked. Two render-disabled browser clients tested room creation, joining, starting, positions, the damage relay, player build placement/edit/destruction, chat and elimination; these are not proof of complete synchronization or a deployed Render test. Performance settings and their restoration were checked, including a 24-bot cap. The live event joined with its eight bots after the changes. The updated event was checked for online and offline countdown progress, a timed-out connection, visible rendered bots, bot and player server snapshots, and offline sequence phases. Two independent browser clients joined and saw synchronized movement; a separate rendered single-client test reached the flip, pull and landing. The updated map plan was checked for duplicate build-piece keys and invalid landmark props; browser logic tests checked knock, slow movement, canceled and completed revives, cooldown, downed damage and empty-water E, and a render-disabled event join/leave. A full rendered match screenshot of the new POIs timed out under headless software rendering, so their in-game visual quality and performance have not been fully verified. A simulated glider descent reached the ground without upward jumps, but a full hardware-rendered playthrough was not verified; headless software-rendered match screenshots timed out, so full rendered-match performance and visual correctness were not verified in that environment.

The workspace's `data/studio-maps.json` remains a private backup only and is not included in the distribution archives or served by the game.

## Main files

- `src/game.js` — game, UI, progression and world generation
- `src/chapter4.js` — Chapter 4-inspired POI placement
- `src/liveEvent.js` and `src/eventIsland.js` — synchronized 3D event, terrain and player controls
- `src/cosmetics.js` — procedural pickaxes, gliders and weapon wraps
- `src/chapter3.js`, `src/models/` — retained procedural layouts and models
- `src/styles/ui.css` — interface
- `server/index.js`, `server/matchService.js` and `server/eventBots.js` — same-origin web service, experimental online rooms and event bots
- `src/multiplayer.js` — code-based room UI and synchronization
- `render.yaml` — optional Render Blueprint

Check applicable rights and platform policies before distributing or deploying reference-inspired content.
