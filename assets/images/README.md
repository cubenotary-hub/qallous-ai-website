# Logo Assets Directory

This directory contains QALLOUS.AI logo assets and specifications.

## Official Logo Assets Document

📄 **See:** `/assets/QALLOUS-AI-Logo-Assets.html` for the complete official logo assets documentation.

## Logo Implementation

The website currently uses **CSS-based animated logos** that match the official brand specifications:

### Logo Variants

1. **Blue Logo (Primary)** - Used in headers
   - Color: #00d4ff (Neon Blue)
   - Size: Medium (80px) for headers
   - Background: Dark

2. **Purple Logo (Secondary)** - Used in footers  
   - Color: #8b5cf6 (Neon Purple)
   - Size: Medium (80px) for footers
   - Background: Dark

### Logo Specifications (from Official Assets)

- **Small**: 40x40px - Icons, favicons, small UI elements
- **Medium**: 80x80px - Standard website use, headers, footers
- **Large**: 160x160px - Presentations, hero sections, print materials

### Brand Colors

- **Primary Blue**: #00d4ff (Neon Blue)
- **Secondary Purple**: #8b5cf6 (Neon Purple)
- **Accent Colors**: #ff6b6b (Neon Pink), #00ff88 (Neon Green)

## Image Logo Files (Optional)

If you want to use static image logos instead of CSS animations, add:

1. **qallous-logo.png** - Main logo for header
   - Size: 200x50px or similar aspect ratio
   - Format: PNG with transparent background
   - Colors: Blue theme (#00d4ff)

2. **qallous-logo-white.png** - White/light version for footer
   - Size: 200x50px or similar aspect ratio
   - Format: PNG with transparent background
   - Colors: Purple theme (#8b5cf6)

## Fallback Behavior

- If logo images are not found, the site automatically uses the CSS-based animated logo
- The CSS logo matches the official brand specifications from the logo assets document

## Technical Details

- **Animation**: Y-axis rotation (6 seconds loop)
- **Effects**: Glow, pulse, backdrop blur, staggered lobe animations
- **Responsive**: Works on all screen sizes
- **Format**: CSS/HTML (current), PNG/SVG (optional static export)

