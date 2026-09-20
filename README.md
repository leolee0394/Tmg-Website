# The March Group website (flat layout)

All files sit in one folder so they can be uploaded with GitHub's normal "Upload files" button.

- `index.html`, `people.html`, `portfolio.html`, `ecosystem.html`: the pages
- `site.json`: ALL text, links, numbers, people, portfolio and news. Edit this file to change content.
- `style.css`, `render.js`, `motion.js`: design and animation (developers only)
- Photos and videos: upload them to the same folder, using the file names in `PHOTO-NAMES.txt` (or change the name in `site.json`). `.mp4` / `.webm` play as looping muted video.

Until a photo exists, its slot shows a labelled placeholder.

To test locally, serve the folder: `python3 -m http.server 8000`, then open http://localhost:8000
The mailing-list form does nothing until `formAction` in `site.json` is set to a form service URL.
