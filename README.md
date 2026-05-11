# Operation Prime

A pure HTML/CSS/JavaScript GitHub Pages site for Joseph's 12-month transformation system.

## Included

- Dashboard: `index.html`
- Training phases: `pages/phase1.html` → `pages/phase4.html`
- Nutrition system: `pages/nutrition.html`
- Rehab + mobility: `pages/rehab.html`, `pages/mobility.html`
- Daily operations: `pages/daily.html`, `pages/weekly.html`
- Tracking: `pages/habits.html`, `pages/tracker.html`, `pages/calendar.html`
- Equipment guide: `pages/equipment.html`

## Local use

Open `index.html` directly in a browser, or run any simple static server.

Example:

```bash
cd /Users/joey/Documents/Workout
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Push the contents of this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the main branch and the `/ (root)` folder.
6. Save. GitHub will publish the site in about 1–2 minutes.

## Notes

- No build step required.
- Data is stored in browser `localStorage`, so each browser/device keeps its own tracking data.
- Best experience is modern desktop/mobile browsers with JavaScript enabled.
