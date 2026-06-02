/**
 * Reliance Chemicals Ltd - Main JavaScript
 */

// --- Hero Particle Canvas Animation ---
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const colors = ['rgba(0,212,240,', 'rgba(26,107,245,', 'rgba(160,100,255,', 'rgba(100,220,180,'];
  const NUM = 55;
  const MAX_DIST = 160;

  const particles = Array.from({ length: NUM }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 2.2 + 0.8,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let animFrameId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.75)';
      ctx.fill();
    });
    animFrameId = requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      draw();
    }
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Sticky Navbar & Scroll-to-Top ---
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. Mobile Menu Drawer & Backdrop Overlay ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (mobileDrawerClose) mobileDrawerClose.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (mobileMenuBtn) mobileMenuBtn.focus();
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  if (mobileDrawer) {
    mobileDrawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = mobileDrawer.querySelectorAll('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Close drawer on link click
  const mobileLinks = document.querySelectorAll('.mobile-drawer .nav-links a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --- 3. Initialize AOS Animations ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      offset: 80,
      easing: 'ease',
      once: true
    });
  }

  // --- 4. CountUp.js logic for stats ---
  // Trigger when elements enter viewport
  const statsElements = document.querySelectorAll('[data-count]');
  if (statsElements.length > 0 && typeof countUp !== 'undefined') {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endVal = parseInt(target.getAttribute('data-count'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          const counter = new countUp.CountUp(target, endVal, { 
            duration: 2, 
            suffix: suffix,
            useEasing: true
          });
          if (!counter.error) {
            counter.start();
          }
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statsElements.forEach(el => observer.observe(el));
  }

  // --- 5. Product Filtering (Products Page) ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productRows = document.querySelectorAll('.product-table tbody tr');

  if (filterTabs.length > 0 && productRows.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const filterValue = tab.getAttribute('data-filter');

        productRows.forEach(row => {
          if (filterValue === 'all') {
            row.style.display = '';
          } else {
            if (row.getAttribute('data-category') === filterValue) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // --- 5b. Interactive Industry Category Switching (Industries Page) ---
  const sectorTabs = document.querySelectorAll('.sector-tab');
  const sectorPanels = document.querySelectorAll('.sector-panel');

  if (sectorTabs.length > 0 && sectorPanels.length > 0) {
    sectorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        sectorTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const selectedSector = tab.getAttribute('data-sector');

        // Hide all panels, show the selected one
        sectorPanels.forEach(panel => {
          if (panel.id === selectedSector) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // --- 5c. Advanced Chemical Real-Time Search (Industries Page) ---
  const industrySearch = document.getElementById('industrySearch');
  const allProductTags = document.querySelectorAll('.sector-prod-tag');
  const searchResultCount = document.getElementById('searchResultCount');
  const sectorTabsList = document.querySelectorAll('.sector-tab');

  if (industrySearch && allProductTags.length > 0) {
    industrySearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Reset all highlights, active filters, and styling
      allProductTags.forEach(tag => tag.classList.remove('highlight-match'));
      sectorTabsList.forEach(tab => {
        tab.style.display = '';
        tab.style.opacity = '';
      });

      if (query.length < 2) {
        if (searchResultCount) {
          searchResultCount.style.display = 'none';
          searchResultCount.textContent = '';
        }
        return;
      }

      let totalMatches = 0;
      let firstMatchSector = null;
      const matchingSectors = new Set();

      // Check product tags
      allProductTags.forEach(tag => {
        const text = tag.textContent.toLowerCase();
        if (text.includes(query)) {
          tag.classList.add('highlight-match');
          totalMatches++;

          // Track matching sector
          const parentPanel = tag.closest('.sector-panel');
          if (parentPanel) {
            matchingSectors.add(parentPanel.id);
          }
        }
      });

      // Check sector names in tabs
      sectorTabsList.forEach(tab => {
        const sectorId = tab.getAttribute('data-sector');
        const tabText = tab.textContent.toLowerCase();
        if (tabText.includes(query)) {
          matchingSectors.add(sectorId);
        }
      });

      // Update tabs display based on matches
      if (matchingSectors.size > 0) {
        sectorTabsList.forEach(tab => {
          const sectorId = tab.getAttribute('data-sector');
          if (matchingSectors.has(sectorId)) {
            tab.style.opacity = '1';
            if (!firstMatchSector) {
              firstMatchSector = sectorId;
            }
          } else {
            tab.style.opacity = '0.35'; // Fade out non-matching categories
          }
        });

        // Switch to the first sector tab that matches the query!
        if (firstMatchSector) {
          const matchingTab = document.querySelector(`.sector-tab[data-sector="${firstMatchSector}"]`);
          if (matchingTab && !matchingTab.classList.contains('active')) {
            matchingTab.click();
          }
        }
      } else {
        // Fade all tabs if absolutely no match is found
        sectorTabsList.forEach(tab => {
          tab.style.opacity = '0.35';
        });
      }

      // Display real-time result count badge
      if (searchResultCount) {
        searchResultCount.style.display = 'inline-block';
        if (totalMatches === 0 && matchingSectors.size === 0) {
          searchResultCount.innerHTML = `<i class="fa-solid fa-circle-info" style="margin-right: 6px;"></i> No matching chemicals found`;
        } else if (totalMatches === 1) {
          searchResultCount.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 6px; color: var(--blue);"></i> 1 chemical match found`;
        } else {
          searchResultCount.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right: 6px; color: var(--blue);"></i> ${totalMatches} chemical matches found`;
        }
      }
    });
  }

  // --- 5d. Interactive Contact Category Choice Chips (Contact Page) ---
  const contactChips = document.querySelectorAll('.contact-chip');
  const hiddenCategorySelect = document.getElementById('category');

  if (contactChips.length > 0 && hiddenCategorySelect) {
    contactChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Remove active class from all chips
        contactChips.forEach(c => c.classList.remove('active'));
        // Add active class to clicked chip
        chip.classList.add('active');

        // Set select value
        const val = chip.getAttribute('data-value');
        hiddenCategorySelect.value = val;

        // Clear any chip validation errors
        const chipGroup = document.querySelector('.contact-chip-group');
        const chipError = document.getElementById('chipError');
        if (chipGroup && chipError) {
          chipGroup.classList.remove('error');
          chipError.style.display = 'none';
        }
      });
    });
  }

  // --- 6. Form Validation (Contact Page) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Basic client side check
      const inputs = contactForm.querySelectorAll('[required]');
      const chipGroup = document.querySelector('.contact-chip-group');
      const chipError = document.getElementById('chipError');
      let isValid = true;

      inputs.forEach(input => {
        if (input.id === 'category') {
          if (!input.value) {
            isValid = false;
            if (chipGroup && chipError) {
              chipGroup.classList.add('error');
              chipError.style.display = 'block';
            }
          } else {
            if (chipGroup && chipError) {
              chipGroup.classList.remove('error');
              chipError.style.display = 'none';
            }
          }
        } else {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderBottomColor = 'red';
          } else {
            input.style.borderBottomColor = 'var(--border-light)';
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const successBanner = document.getElementById('formSuccessBanner');
      if (successBanner) {
        successBanner.style.display = 'block';
      }
      contactForm.reset();
      
      // Reset selected chips
      if (contactChips.length > 0) {
        contactChips.forEach(c => c.classList.remove('active'));
      }
      
      setTimeout(() => {
        if (successBanner) successBanner.style.display = 'none';
      }, 5000);
    });
  }

});
