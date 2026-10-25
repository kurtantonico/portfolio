# Kurt Antonico — Portfolio

Plain HTML/CSS/JS, no build step. Open `index.html` in a browser, or deploy the folder.

## Files
- `index.html` — page structure and meta/Open Graph tags
- `styles.css` — all styling (colors are CSS variables at the top)
- `data.js` — ALL editable content (bio, links, projects, stack, certs, posts)
- `main.js` — rendering and interactions (theme, command palette, scroll effects)

## Swap your photo
Hero: transparent-background PNG cut-out. About: square crop. Put them in this folder
and set `photoHero: "hero.png"` and `photoSquare: "square.jpg"` in `data.js`.

## Add project screenshots / tags / links
Edit the `projects` array in `data.js`. Replace the lorem ipsum, fill `tags`, and set `url`.

## Certifications
Replace the 3 placeholder rows in `certs` (`url: "#"` is a no-op link until you add one).

## Deploy
- Vercel: `vercel` in this folder, or import the repo (framework: Other, no build command).
- Netlify: drag the folder into app.netlify.com/drop, or connect the repo (publish dir `.`).
# portfolio
