/**
 * VELORA — PURE INDULGENCE
 * High-Definition Razor-Sharp Canvas Scroll Engine
 */

const TOTAL_FRAMES = 240;

const getFrameSrc = (index) => {
  const padded = String(index).padStart(3, '0');
  return `/frames/frame-${padded}.jpg`;
};

// 11 Storytelling Chapters mapped cleanly to the 240 video frames
const CHAPTERS = [
  { id: 'hero', title: 'HERO INTRODUCTION', frameStart: 1, frameEnd: 24 },
  { id: 'origin', title: 'THE ORIGIN', frameStart: 25, frameEnd: 48 },
  { id: 'harvest', title: 'HANDPICKED HARVESTING', frameStart: 49, frameEnd: 68 },
  { id: 'fermentation', title: 'FERMENTATION & DRYING', frameStart: 69, frameEnd: 88 },
  { id: 'roasting', title: 'ROASTING & GRINDING', frameStart: 89, frameEnd: 108 },
  { id: 'crafting', title: 'CHOCOLATE CRAFTING', frameStart: 109, frameEnd: 132 },
  { id: 'moulding', title: 'MOULDING & COOLING', frameStart: 133, frameEnd: 154 },
  { id: 'quality', title: 'QUALITY CONTROL', frameStart: 155, frameEnd: 179 },
  { id: 'materials', title: 'PACKAGING MATERIALS', frameStart: 180, frameEnd: 200 },
  { id: 'packaging', title: 'THE FINAL PACKAGING', frameStart: 201, frameEnd: 220 },
  { id: 'reveal', title: 'VELORA REVEAL', frameStart: 221, frameEnd: 240 },
];

class VeloraCinematicEngine {
  constructor() {
    this.canvas = document.getElementById('chocolateCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.particleCanvas = document.getElementById('particleCanvas');
    this.particleCtx = this.particleCanvas.getContext('2d');
    
    this.scrollTrack = document.getElementById('scrollTrack');
    this.topProgressBar = document.getElementById('topProgressBar');
    this.hudPhase = document.getElementById('hudPhase');
    this.hudTitle = document.getElementById('hudTitle');
    this.ambientGlow = document.getElementById('canvasAmbientGlow');
    this.sections = document.querySelectorAll('.story-section');

    this.frames = [];
    this.loadedCount = 0;
    
    // Physics & Interpolation
    this.targetFrame = 1.0;
    this.currentFrame = 1.0;
    this.lerpSpeed = 0.088; // Cinema-grade fluid response
    this.lastDrawnFrame = -1;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Subtle atmospheric gold particles
    this.particles = [];
    this.maxParticles = 30;

    this.init();
  }

  init() {
    this.handleResize();
    this.initParticles();
    this.bindEvents();
    this.loadFirstFrameImmediate();
    this.preloadAllFrames();
    this.setupRenderLoop();
  }

  // Handle Retina & High-DPI screens without stretching or blur
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Full device physical pixel allocation
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.particleCanvas.width = width;
    this.particleCanvas.height = height;

    this.lastDrawnFrame = -1;
    this.drawCrispFrame(Math.round(this.currentFrame));
  }

  // Load Frame 1 immediately so screen is vibrant on initial visit
  loadFirstFrameImmediate() {
    const img1 = new Image();
    img1.src = getFrameSrc(1);
    img1.onload = () => {
      this.frames[1] = img1;
      this.drawCrispFrame(1);
    };
    img1.onerror = () => {
      img1.src = `./frames/frame-001.jpg`;
    };
  }

  // Progressive Two-Stage Preloader: keyframes first for instant scrolling, then full 240 frames
  preloadAllFrames() {
    const keyframes = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 4) {
      keyframes.push(i);
    }
    const inBetweenFrames = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (i % 4 !== 1) {
        inBetweenFrames.push(i);
      }
    }

    const loadFrame = (index) => {
      if (this.frames[index]) return;
      const img = new Image();
      img.src = getFrameSrc(index);

      img.onload = () => {
        this.frames[index] = img;
        this.loadedCount++;
        const pct = Math.round((this.loadedCount / TOTAL_FRAMES) * 100);
        if (this.topProgressBar) {
          this.topProgressBar.style.width = `${pct}%`;
          if (this.loadedCount >= TOTAL_FRAMES) {
            setTimeout(() => {
              this.topProgressBar.style.opacity = '0';
            }, 600);
          }
        }
        if (this.lastDrawnFrame === -1 && index === 1) {
          this.drawCrispFrame(1);
        }
      };

      img.onerror = () => {
        img.src = `./frames/frame-${String(index).padStart(3, '0')}.jpg`;
      };
    };

    // Stage 1: Load 60 keyframes immediately
    keyframes.forEach(k => loadFrame(k));

    // Stage 2: Queue all remaining frames smoothly
    setTimeout(() => {
      inBetweenFrames.forEach(f => loadFrame(f));
    }, 150);
  }

  getValidImage(index) {
    const safeIdx = Math.max(1, Math.min(TOTAL_FRAMES, index));
    if (this.frames[safeIdx]?.complete && this.frames[safeIdx].naturalWidth > 0) {
      return this.frames[safeIdx];
    }
    for (let offset = 1; offset <= TOTAL_FRAMES; offset++) {
      const prev = safeIdx - offset;
      if (prev >= 1 && this.frames[prev]?.complete && this.frames[prev].naturalWidth > 0) {
        return this.frames[prev];
      }
      const next = safeIdx + offset;
      if (next <= TOTAL_FRAMES && this.frames[next]?.complete && this.frames[next].naturalWidth > 0) {
        return this.frames[next];
      }
    }
    return null;
  }

  /**
   * Razor-Sharp High-DPI Cover Rendering with Camera Parallax:
   * High-definition uncompressed rendering + dynamic cinematic camera breathing.
   */
  drawCrispFrame(frameIndex) {
    const safeIdx = Math.max(1, Math.min(TOTAL_FRAMES, frameIndex));
    const img = this.getValidImage(safeIdx);
    if (!img) return;

    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    const imgW = img.naturalWidth || 1280;
    const imgH = img.naturalHeight || 720;

    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let dw, dh, ox, oy;
    if (canvasRatio > imgRatio) {
      dw = canvasW;
      dh = canvasW / imgRatio;
      ox = 0;
      oy = (canvasH - dh) / 2;
    } else {
      dh = canvasH;
      dw = canvasH * imgRatio;
      ox = (canvasW - dw) / 2;
      oy = 0;
    }

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.clearRect(0, 0, canvasW, canvasH);
    this.ctx.drawImage(img, ox, oy, dw, dh);

    // Subtle IMAX-style camera breathing drift (adds natural depth)
    const normalizedProgress = (safeIdx - 1) / (TOTAL_FRAMES - 1);
    const cameraZoom = 1.0 + Math.sin(normalizedProgress * Math.PI) * 0.024;
    this.canvas.style.transform = `scale(${cameraZoom.toFixed(4)})`;

    this.lastDrawnFrame = safeIdx;
  }

  // Multi-depth glowing golden motes & ambient bokeh
  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const depth = Math.random();
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: depth > 0.85 ? Math.random() * 2.8 + 2 : (depth > 0.4 ? Math.random() * 1.4 + 0.9 : Math.random() * 0.8 + 0.4),
        alpha: depth > 0.85 ? 0.35 : (depth > 0.4 ? 0.25 : 0.15),
        isGold: depth > 0.5,
        isBokeh: depth > 0.85,
        vx: (Math.random() - 0.5) * (0.18 + depth * 0.15),
        vy: -Math.random() * (0.25 + depth * 0.25) - 0.08,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02
      });
    }
  }

  renderParticles() {
    const w = this.particleCanvas.width;
    const h = this.particleCanvas.height;
    this.particleCtx.clearRect(0, 0, w, h);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.y < -20) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      const alpha = p.alpha * (0.65 + 0.35 * Math.sin(p.pulse));

      this.particleCtx.beginPath();
      this.particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      if (p.isBokeh) {
        const grad = this.particleCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grad.addColorStop(0, `rgba(214, 173, 101, ${alpha})`);
        grad.addColorStop(1, 'rgba(214, 173, 101, 0)');
        this.particleCtx.fillStyle = grad;
        this.particleCtx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      } else {
        this.particleCtx.fillStyle = p.isGold
          ? `rgba(214, 173, 101, ${alpha})`
          : `rgba(247, 231, 196, ${alpha})`;
      }
      this.particleCtx.fill();
    }
  }

  // Smooth 60fps/120fps render loop with continuous fluid LERP physics
  setupRenderLoop() {
    const loop = () => {
      const diff = this.targetFrame - this.currentFrame;

      if (Math.abs(diff) > 0.001) {
        this.currentFrame += diff * this.lerpSpeed;
        const frameIndex = Math.round(this.currentFrame);
        if (frameIndex !== this.lastDrawnFrame) {
          this.drawCrispFrame(frameIndex);
          this.updateChapterHUD(frameIndex);
        }
      } else if (this.currentFrame !== this.targetFrame) {
        this.currentFrame = this.targetFrame;
        const frameIndex = Math.round(this.currentFrame);
        if (frameIndex !== this.lastDrawnFrame) {
          this.drawCrispFrame(frameIndex);
          this.updateChapterHUD(frameIndex);
        }
      }

      this.renderParticles();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  // Smooth scroll progress mapped continuously to frames 1.0 -> 50.0
  handleScroll() {
    if (!this.scrollTrack) return;

    const trackRect = this.scrollTrack.getBoundingClientRect();
    const trackHeight = trackRect.height;
    const windowHeight = window.innerHeight;

    const totalScrollable = Math.max(1, trackHeight - windowHeight);
    const scrolled = Math.max(0, -trackRect.top);

    // Continuous normalized progress [0.0, 1.0]
    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

    // Map smoothly across all 50 frames
    this.targetFrame = 1.0 + progress * (TOTAL_FRAMES - 1);

    // Header background blur
    const header = document.getElementById('siteHeader');
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Story Card visibility
    this.sections.forEach((sec) => {
      const card = sec.querySelector('.story-card');
      if (!card) return;

      const rect = sec.getBoundingClientRect();
      const inView = rect.top < windowHeight * 0.72 && rect.bottom > windowHeight * 0.28;

      if (inView) {
        card.classList.add('in-view');
      } else {
        card.classList.remove('in-view');
      }
    });

    this.updateMainNav();
  }

  updateChapterHUD(frame) {
    let activeIdx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (frame >= CHAPTERS[i].frameStart && frame <= CHAPTERS[i].frameEnd) {
        activeIdx = i;
        break;
      }
    }
    if (frame > CHAPTERS[CHAPTERS.length - 1].frameEnd) {
      activeIdx = CHAPTERS.length - 1;
    }

    const chap = CHAPTERS[activeIdx];
    if (this.hudPhase) {
      const paddedNum = String(activeIdx + 1).padStart(2, '0');
      this.hudPhase.textContent = `CHAPTER ${paddedNum} / 11`;
    }
    if (this.hudTitle) {
      this.hudTitle.textContent = chap.title;
    }

    // Dynamic scene lighting transitions
    if (this.ambientGlow) {
      if (activeIdx <= 2) {
        // Nature & Pods: Warm amber sunlight
        this.ambientGlow.style.background = 'radial-gradient(circle at 60% 35%, rgba(214, 160, 60, 0.16) 0%, transparent 70%)';
      } else if (activeIdx <= 5) {
        // Roasting & Conching: Rich chocolate caramel radiance
        this.ambientGlow.style.background = 'radial-gradient(circle at 50% 50%, rgba(180, 95, 35, 0.18) 0%, transparent 68%)';
      } else if (activeIdx <= 9) {
        // Royal Purple Box & Gold Foiling
        this.ambientGlow.style.background = 'radial-gradient(circle at 55% 45%, rgba(95, 25, 140, 0.22) 0%, rgba(214, 173, 101, 0.1) 50%, transparent 75%)';
      } else {
        // Final Product Reveal on Dark Marble: Champagne gold highlights
        this.ambientGlow.style.background = 'radial-gradient(circle at 50% 50%, rgba(214, 173, 101, 0.26) 0%, rgba(53, 16, 78, 0.2) 50%, transparent 75%)';
      }
    }
  }

  updateMainNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    let currentSectionId = 'hero';
    this.sections.forEach(sec => {
      const top = sec.offsetTop;
      if (scrollY >= top - windowH * 0.4) {
        currentSectionId = sec.id;
      }
    });

    const collectionSec = document.getElementById('collection');
    if (collectionSec && scrollY >= collectionSec.offsetTop - windowH * 0.4) {
      currentSectionId = 'collection';
    }

    navLinks.forEach(link => {
      const target = link.getAttribute('data-target');
      if (target === currentSectionId) {
        link.classList.add('active');
      } else if (target === 'origin' && ['origin', 'harvest', 'fermentation'].includes(currentSectionId)) {
        link.classList.add('active');
      } else if (target === 'crafting' && ['roasting', 'crafting', 'moulding', 'quality'].includes(currentSectionId)) {
        link.classList.add('active');
      } else if (target === 'reveal' && ['materials', 'packaging', 'reveal'].includes(currentSectionId)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 150);
    });
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    mobileToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav?.classList.toggle('mobile-open');
      mobileToggle.classList.toggle('is-active', isOpen);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav?.classList.remove('mobile-open');
        mobileToggle?.classList.remove('is-active');
      });
    });

    // Close mobile drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav?.classList.contains('mobile-open') && !mainNav.contains(e.target) && !mobileToggle?.contains(e.target)) {
        mainNav.classList.remove('mobile-open');
        mobileToggle?.classList.remove('is-active');
      }
    });

    this.setupModal();
    this.setupCinemaFeatures();

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMsg = document.getElementById('newsletterMsg');
    newsletterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterMsg?.classList.remove('hidden');
      newsletterForm.reset();
    });
  }

  setupModal() {
    const modal = document.getElementById('experienceModal');
    const openBtns = [
      document.getElementById('reserveBtn'),
      document.getElementById('openExperienceModalBtn'),
      ...document.querySelectorAll('.order-single-btn')
    ];
    const closeBtn = document.getElementById('closeModalBtn');
    const chips = document.querySelectorAll('#assortmentChips .chip');
    const monogramInput = document.getElementById('customMonogramInput');
    const monogramPreview = document.getElementById('mockupMonogram');
    const confirmBtn = document.getElementById('confirmReservationBtn');
    const successMsg = document.getElementById('reservationSuccess');
    const casketPrice = document.getElementById('casketPrice');
    const casketTotalPrice = document.getElementById('casketTotalPrice');

    const openModal = (productName = '') => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (productName && monogramPreview) {
        monogramPreview.textContent = `FOR ${productName.toUpperCase()}`;
      }
    };

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (successMsg) successMsg.classList.add('hidden');
    };

    openBtns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pName = btn.getAttribute('data-product') || '';
        openModal(pName);
      });
    });

    closeBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    const priceMap = {
      trio: '$120.00',
      noir: '$114.00',
      amande: '$126.00'
    };

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.getAttribute('data-value');
        if (priceMap[val]) {
          casketPrice.textContent = priceMap[val];
          casketTotalPrice.textContent = priceMap[val];
        }
      });
    });

    monogramInput?.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase();
      monogramPreview.textContent = val ? `FOR ${val}` : 'FOR A CONNOISSEUR';
    });

    confirmBtn?.addEventListener('click', () => {
      const emailInput = document.getElementById('guestEmailInput');
      if (emailInput && !emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }
      confirmBtn.style.opacity = '0.5';
      confirmBtn.textContent = 'ALLOCATING BATCH...';
      setTimeout(() => {
        confirmBtn.style.opacity = '1';
        confirmBtn.textContent = 'CONFIRM ALLOCATION RESERVATION';
        successMsg?.classList.remove('hidden');
      }, 700);
    });
  }

  setupCinemaFeatures() {
    const cinemaModal = document.getElementById('cinemaModal');
    const modalVideo = document.getElementById('modalCommercialVideo');
    const inlineVideo = document.getElementById('inlineCommercialVideo');
    const openFilmBtns = [
      document.getElementById('watchFilmHeaderBtn'),
      document.getElementById('watchFilmHeroBtn'),
      document.getElementById('expandCinemaBtn'),
    ];
    const closeFilmBtn = document.getElementById('closeCinemaModalBtn');
    const togglePlayBtn = document.getElementById('togglePlayBtn');
    const toggleSoundBtn = document.getElementById('toggleSoundBtn');

    const openCinema = () => {
      if (!cinemaModal) return;
      cinemaModal.classList.add('active');
      cinemaModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (inlineVideo && !inlineVideo.paused) {
        inlineVideo.pause();
      }
      if (modalVideo) {
        modalVideo.currentTime = inlineVideo ? inlineVideo.currentTime : 0;
        modalVideo.play().catch(() => {});
      }
    };

    const closeCinema = () => {
      if (!cinemaModal) return;
      cinemaModal.classList.remove('active');
      cinemaModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (modalVideo) {
        modalVideo.pause();
      }
    };

    openFilmBtns.forEach(btn => {
      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        openCinema();
      });
    });

    closeFilmBtn?.addEventListener('click', closeCinema);

    cinemaModal?.addEventListener('click', (e) => {
      if (e.target === cinemaModal) closeCinema();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cinemaModal?.classList.contains('active')) {
        closeCinema();
      }
    });

    // Inline video frame controls
    if (togglePlayBtn && inlineVideo) {
      togglePlayBtn.addEventListener('click', () => {
        if (inlineVideo.paused) {
          inlineVideo.play();
          togglePlayBtn.innerHTML = '<span class="ctrl-icon-play">❚❚</span><span>PAUSE</span>';
        } else {
          inlineVideo.pause();
          togglePlayBtn.innerHTML = '<span class="ctrl-icon-play">▶</span><span>PLAY</span>';
        }
      });
    }

    if (toggleSoundBtn && inlineVideo) {
      toggleSoundBtn.addEventListener('click', () => {
        inlineVideo.muted = !inlineVideo.muted;
        if (inlineVideo.muted) {
          toggleSoundBtn.innerHTML = '<span class="ctrl-icon-sound">🔇</span><span>MUTED</span>';
          toggleSoundBtn.classList.remove('active');
        } else {
          toggleSoundBtn.innerHTML = '<span class="ctrl-icon-sound">🔊</span><span>SOUND ON</span>';
          toggleSoundBtn.classList.add('active');
        }
      });
    }
  }
}

// Initialize when ready
window.addEventListener('DOMContentLoaded', () => {
  new VeloraCinematicEngine();
});
