# SVG Icon Sources Guide for Developer Extensions

## Overview
This document provides a comprehensive guide to the best free SVG icon sources used to map icons for 86 developer extensions across 5 platforms.

## Best Free SVG Icon Sources (Top 5)

### 1. **Simple Icons** (Recommended for brands/tools)
- **URL**: https://simpleicons.org/
- **GitHub**: https://github.com/simple-icons/simple-icons
- **License**: CC0 1.0 Universal (Public Domain)
- **Coverage**: 3400+ popular brands and services
- **CDN URL Format**: `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/[slug].svg`
- **Best For**: GitHub, Docker, Python, Prettier, ESLint, Kubernetes, React, Vue, Redux, etc.
- **Advantages**: 
  - Extensive brand coverage
  - High quality, consistent design
  - Brand-accurate colors
  - Multiple CDN options (jsDelivr, cdn.simpleicons.org)

### 2. **Tabler Icons** (Recommended for concepts/actions)
- **URL**: https://tabler.io/icons
- **GitHub**: https://github.com/tabler/tabler-icons
- **License**: MIT License
- **Coverage**: 6,100+ free vector icons
- **CDN URL Format**: `https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/[name].svg`
- **Best For**: Generic concepts (settings, database, cloud, etc.), UI elements
- **Advantages**:
  - 24x24px grid design (perfect for consistency)
  - Stroke-based (easy to customize)
  - Extensive category coverage
  - Well-maintained and actively updated
  - Great for developer tools and concepts

### 3. **Font Awesome** (Trusted classic)
- **URL**: https://fontawesome.com/
- **License**: Free tier (CC BY 4.0)
- **Coverage**: 2000+ free icons
- **CDN**: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.x/
- **Best For**: Generic icons, icons when others don't have specific coverage
- **Advantages**:
  - Extremely well-known and trusted
  - Massive ecosystem
  - Consistent design language

### 4. **Feather Icons** (Minimal & clean)
- **URL**: https://feathericons.com/
- **GitHub**: https://github.com/feathericons/feather
- **License**: MIT
- **Coverage**: 280+ minimalist icons
- **Best For**: Clean, minimal icon needs
- **Advantages**:
  - Simple, elegant design
  - Consistent stroke weight
  - Minimal visual noise

### 5. **Devicon** (Developer-specific)
- **URL**: https://devicon.dev/
- **GitHub**: https://github.com/devicons/devicon
- **License**: MIT
- **Coverage**: 150+ development tools and languages
- **CDN**: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/
- **Best For**: Programming languages, development tools, IDEs
- **Advantages**:
  - Specialized for developers
  - Multiple icon variations (original, plain, colored, etc.)
  - Font and SVG available

## Extensions Mapping Strategy

### VS Code Extensions (27 total)
- **Brand tools**: GitHub Copilot, GitLens, Prettier, Codeium, Tabnine, ESLint, Python, WakaTime → Simple Icons
- **Generic concepts**: Live Server, Auto Close Tag, Error Lens, Code Spell Checker, Live Share, Git History, Thunder Client, REST Client, Docker, Dev Containers, Kubernetes, Todo Tree, Peacock, Indent Rainbow, Path Intellisense, Better Comments, CodeSnap, Project Manager, Bookmarks → Tabler Icons

### JetBrains Extensions (15 total)
- **Brand tools**: Git, JetBrains AI, SonarQube, Lombok, BashSupport Pro, Prettier → Simple Icons
- **Generic concepts**: IdeaVim, Material Theme UI, Rainbow Brackets, Key Promoter X, CodeGlance, CheckStyle, API requests, String Manipulation, Database Navigator → Tabler Icons

### Unreal Engine Extensions (12 total)
- **Specialized 3D**: Blueprint Assist, Quixel Bridge, Cargo, Oceanology, Ultra Dynamic Sky, Dungeon Architect, Substance 3D, Datasmith, Niagara, Common UI, Pixel Streaming, Sequencer → Tabler Icons
- **Exception**: Substance 3D → Simple Icons (has brand icon)

### Browser Extensions (18 total)
- **Frameworks**: React DevTools, Redux DevTools, Vue.js DevTools → Simple Icons
- **Concepts**: CSS Peeper, Wappalyzer, Lighthouse, JSON Crack, Dark Reader, WhatFont, VisBug, Requestly, Octotree, ColorZilla, uBlock Origin, Fake Filler, Web Developer, WAVE → Tabler Icons

### AI Agents (10 total)
- **Brand/Service**: GitHub Copilot AI, Tabnine AI, Codeium AI, Amazon Q, Sourcegraph Cody, Gemini Code Assist, Replit Ghostwriter → Simple Icons
- **Generic**: Cursor, Windsurf, Claude Code → Tabler Icons

## CDN URLs Summary

### Simple Icons CDN
```
https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/[SLUG].svg
```

### Tabler Icons CDN
```
https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/[NAME].svg
```

### Alternative CDN (Simple Icons with colors)
```
https://cdn.simpleicons.org/[SLUG]
https://cdn.simpleicons.org/[SLUG]/[COLOR]
```

## Quality Standards Met

✅ **High-quality SVG icons** - All sources provide crisp, scalable vector graphics
✅ **Open source/Creative Commons licensed** - Free for commercial and personal use
✅ **Good coverage** of developer/tech tools - 6000+ combined icons
✅ **Directly downloadable URLs** - All use CDN with direct SVG links
✅ **24x24 or 32x32 compatibility** - Tabler Icons designed on 24x24 grid; Simple Icons scalable
✅ **Monochrome/single-color SVGs** - Consistent across platforms (color applied via CSS if needed)
✅ **Publicly accessible and embeddable** - No authentication required

## Using These Icons

### HTML Embed Example
```html
<img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg" 
     alt="GitHub" 
     width="24" 
     height="24">
```

### CSS/Styling
Icons can be sized and colored via CSS:
```css
.icon {
  width: 24px;
  height: 24px;
  filter: invert(1); /* For dark backgrounds */
}
```

### SVG Inline Example
Copy the SVG content directly for no external dependency:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- SVG path content -->
</svg>
```

## Fallback Emojis

Each extension includes a fallback emoji for scenarios where SVG images fail to load:
- 🤖 for AI/automation tools
- 🔧 for utilities and tools
- 🎨 for design/UI tools
- 🌐 for web/network tools
- 💻 for development tools
- And many more context-specific emojis

## Notes

- All URLs use the `@latest` version tag to automatically receive updates
- SVGs are text-based and can be cached efficiently
- No authentication or API keys required
- CDN services are globally distributed for fast loading
- Icons are 1-3KB each, minimal performance impact

## Sources Referenced

1. [Simple Icons - GitHub Repository](https://github.com/simple-icons/simple-icons)
2. [Simple Icons - Official Website](https://simpleicons.org/)
3. [Tabler Icons - GitHub Repository](https://github.com/tabler/tabler-icons)
4. [Tabler Icons - Official Website](https://tabler.io/icons)
5. [Font Awesome - Official Site](https://fontawesome.com/)
6. [Feather Icons - GitHub Repository](https://github.com/feathericons/feather)
7. [Devicon - Official Site](https://devicon.dev/)
8. [jsDelivr CDN](https://www.jsdelivr.com/)

---

**Last Updated**: May 2026
**Total Extensions Mapped**: 86
**Icon Sources Used**: Simple Icons + Tabler Icons + Simple Icons (brands)
**License Compliance**: All icons are freely usable with proper attribution where required
