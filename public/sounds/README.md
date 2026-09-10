# Menu sounds

This folder is empty on purpose. The site synthesizes its menu sounds at
runtime with the Web Audio API, so it works with nothing here.

If you want to use real audio instead, drop files in with these exact names
and they are picked up automatically, no code changes needed:

| File | Plays when |
|---|---|
| `hover.mp3` | the pointer moves onto a channel |
| `select.mp3` | a channel is clicked |
| `boot.mp3` | a channel finishes opening |
| `back.mp3` | you return to the menu |
| `page.mp3` | the page is turned |
| `toggle.mp3` | sound is switched on or off |
| `menu-music.mp3` | loops in the background while sound is on |

Any file that is missing falls back to the synthesized version, so you can
supply just one or two.

Only add audio you have the right to distribute. Console rips are
copyrighted and should not be committed here or deployed.

Wiring lives in `components/wii/use-wii-sound.ts`.
