# The March Group website (flat layout)

All files sit in one folder so they can be uploaded with GitHub's normal "Upload files" button.

- `index.html`, `people.html`, `portfolio.html`, `ecosystem.html`: the pages
- `site.json`: ALL text, links, numbers, people, portfolio and news. Edit this file to change content.
- `style.css`, `render.js`, `motion.js`: design and animation (developers only). Brand colours are the variables at the top of `style.css`.
- Images: every slot shows generated artwork until a real image loads. Portraits load from the old site, logos from public icons. To replace any, upload a file to this folder and put its name in `site.json` (see `PHOTO-NAMES.txt`).

To test locally: `python3 -m http.server 8000`, then open http://localhost:8000
