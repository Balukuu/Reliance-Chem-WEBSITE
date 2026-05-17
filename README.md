# Reliance Chemicals Ltd - Website Project

This is the fully custom, premium B2B website built for Reliance Chemicals Ltd, based in Kampala, Uganda. 

## Tech Stack
- HTML5
- CSS3 (Vanilla, custom properties, responsive design)
- JavaScript (Vanilla for interactions)
- Libraries:
  - AOS.js (Scroll animations)
  - CountUp.js (Number counters)
- Icons: FontAwesome 6 Free (CDN)
- Fonts: Google Fonts (Rajdhani, Inter)

## Directory Structure
```
/css
  styles.css    # Core design system and global styles
/js
  main.js       # Global scripts, animations, and functionality
/assets
  /images       # Images (add premium stock photos here)
index.html      # Homepage
about.html      # About page
products.html   # Full product portfolio with filterable table
industries.html # 9 Industries grid
contact.html    # Inquiry form and map
```

## Features
- **Mobile-first Design**: Fully responsive on all viewports, utilizing a 12-column CSS Grid/Flexbox approach.
- **Premium Aesthetics**: Dark navy dominant with white spaces designed for clean, uncluttered, B2B interaction. Hover states and transition animations are implemented.
- **Performance Optimized**: Uses system/Google fonts with `font-display: swap`, lightweight libraries, and semantic HTML structure.
- **SEO Ready**: Proper HTML5 tags, meta descriptions, and clean URL structure planned.

## Local Development
To run this project locally, simply open `index.html` in your browser. For advanced feature testing (like checking certain browser permissions or CORS), run a local server:
```bash
npx serve .
```

*Note: All placeholder images in HTML files should be replaced with optimized WebP images before deploying to production.*
