# The March Group website (flat layout)

All files sit in one folder so they can be uploaded with GitHub's normal "Upload files" button.

Pages: `index.html` (home), `people.html`, `portfolio.html`, `ecosystem.html`, `news.html`, `contact.html`.

- `site.json`: ALL text, links, numbers, people, portfolio and news. Edit this file to change content.
- `style.css`, `render.js`, `motion.js`: design and animation (developers only). Brand colours are the variables at the top of `style.css`.
- Images: every slot shows generated artwork until a real image loads. To use your own, upload a file to this folder and put its name (or a full image address) in `site.json`.

To test locally: `python3 -m http.server 8000`, then open http://localhost:8000
