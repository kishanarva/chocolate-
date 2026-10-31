# VELORA — Pure Indulgence

> *"Born from Nature. Crafted for You."*

An award-winning, cinematic interactive web experience crafted for **VELORA**, an international luxury dark chocolate brand.

---

## 📱 Cross-Device Optimization

### 1. Desktop & Ultrawide (1080p, 2K, 4K, 21:9)
* Full-screen fixed canvas with mathematical `object-fit: cover` and device pixel ratio (DPR) hardware scaling up to 2x.
* Clean editorial typography cards positioned along alternating sides, keeping the central chocolate product and liquid swirls in clear focus.
* Dynamic camera parallax breathing (`scale: 1.0 -> 1.024`) as you scroll through the story chapters.

### 2. Laptop Displays (1366x768, 1440x900, 1536x864)
* Dedicated `@media (max-height: 850px)` rules that scale down heading sizes, reduce card vertical padding, and fit the interactive atelier modal comfortably within 90vh without clipping.

### 3. Tablets & iPads (768px – 1024px)
* 2-column grid layout for the Velora Collection and Tasting Ritual cards.
* Proportional padding and touch-friendly navigation targets.

### 4. Smartphones & Mobile (iPhone, Samsung Galaxy, Pixel)
* **Bottom-Docked Story Cards**: Cards are docked towards the bottom 40% of the screen (`align-items: flex-end; padding: 0 16px 40px;`). This leaves the **top 60% of the screen completely unobstructed** so the cacao tree, liquid chocolate swirl, and luxury box animation are fully visible.
* **Luxury Slide-Out Drawer**: Animated hamburger icon (`X` transform) with a 280px frosted glass drawer (`backdrop-filter: blur(25px)`). Closes automatically when clicking links or tapping outside.
* **Orientation Change Handling**: Dynamic canvas resize on orientation change (portrait ↔ landscape).
* **Touch Optimization**: Smooth inertial scrolling with native `-webkit-overflow-scrolling: touch` and battery-efficient particle counts.
* **Compact Atelier Modal**: Customizer stacks vertically with responsive 3D box preview and touch-friendly option chips.

---

## 🌟 The Experience Architecture

### 1. Ultra High-Definition Cinema Engine
* **50 Sequential Ultra-HD Frames**: Sourced from `ezgif-frame-001.jpg` through `ezgif-frame-050.jpg`.
* **Zero-Latency First Frame**: Frame 1 (`ezgif-frame-001.jpg` — cacao plantation) renders instantly on page arrival. All 50 frames are preloaded in the background.
* **Fixed Background Stage**: Anchored with `position: fixed; inset: 0`, ensuring continuous visibility across the entire scroll track.
* **Scene-Adaptive Atmosphere Glow**: Dynamic ambient radial lighting shifts smoothly between story phases.
* **35mm Film Micro-Grain Layer**: Authentic analog 35mm film grain overlay adds texture and eliminates JPEG artifacts.
* **Multi-Depth Glowing Bokeh Particles**: 3-tiered ambient gold dust motes and soft glowing bokeh particles drifting with physical buoyancy.
* **Hardware-Accelerated Color Grading**: Studio-grade contrast, saturation, and brightness tuning (`contrast: 1.08, saturate: 1.12, brightness: 1.02`).

### 2. 11 Storytelling Sections Mapped to All 50 Frames
1. **Section 01: Hero Introduction** (Frames 1–6) — Lush cacao plantation establishing shot, Velora crest, and scroll indicator.
2. **Section 02: The Origin** (Frames 7–10) — Natural cacao sanctuary and single-estate agroforestry.
3. **Section 03: Harvesting** (Frames 11–13) — Handpicked pods selected at peak maturity.
4. **Section 04: Fermentation & Drying** (Frames 14–17) — Sun drying and aromatic flavor development.
5. **Section 05: Roasting & Grinding** (Frames 18–21) — Slow convection roasting and fine micron grinding.
6. **Section 06: Chocolate Crafting** (Frames 22–26) — Swirling conched chocolate, glossy tempering at 31.5°C.
7. **Section 07: Moulding & Cooling** (Frames 27–29) — Precision bars with mirror gloss and snap metrics.
8. **Section 08: Quality Control** (Frames 30–34) — Certified Velora Master Grade seal.
9. **Section 09: Packaging Materials** (Frames 35–39) — Imperial purple velvet box and hot-stamped gold foil.
10. **Section 10: The Final Packaging** (Frames 40–46) — Finished luxury box on dark marble.
11. **Section 11: Final Product Reveal** (Frames 47–50) — The grand reveal: opened purple box, chocolate bars, broken chunks, and falling cacao nibs.

---

## 🚀 Running the Project

```bash
# Start local development server
npm run dev

# Or build for production
npm run build
npm run preview
```

Server URL: **http://127.0.0.1:5173/**
