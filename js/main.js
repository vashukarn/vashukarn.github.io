/* ============================================================
   Vashu Karn — Portfolio v2026
   Lightweight vanilla JS · no dependencies.
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Year stamp ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const progressEl = document.getElementById('preloaderProgress');

  if (preloader && progressEl) {
    let p = 0;
    const start = performance.now();
    const tick = (t) => {
      const elapsed = t - start;
      p = Math.min(100, Math.round((elapsed / 900) * 100));
      progressEl.textContent = p + '%';
      if (p < 100) requestAnimationFrame(tick);
      else {
        setTimeout(() => preloader.classList.add('is-hidden'), 150);
      }
    };
    window.addEventListener('load', () => requestAnimationFrame(tick));
    // Safety fallback if 'load' has already fired or assets are slow
    setTimeout(() => {
      if (!preloader.classList.contains('is-hidden')) {
        progressEl.textContent = '100%';
        preloader.classList.add('is-hidden');
      }
    }, 2200);
  }

  /* ---------- Sticky nav state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    if (scrollTopBtn) {
      if (window.scrollY > 400) scrollTopBtn.classList.add('is-visible');
      else scrollTopBtn.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        burger.classList.remove('is-open');
      })
    );
  }

  /* ---------- Smooth anchor scroll (with offset for nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll-to-top ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Counter animations ---------- */
  const counters = document.querySelectorAll('.stats__num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration);
      el.textContent = Math.round(ease(k) * target);
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countObserver.observe(c));

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section__head, .about__intro, .about__panel, .timeline__item, .service-card, .stack-cat, .project, .recog-card, .devpanel__cell, .stats__item, .swatch, .styleguide__type, .contact__primary, .contact__info'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Project filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('#projectsGrid .project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const f = btn.dataset.filter;
      projects.forEach(p => {
        if (f === '*' || p.matches(f)) p.classList.remove('is-hidden');
        else p.classList.add('is-hidden');
      });
    });
  });

  /* ---------- Service card spotlight (mouse follow) ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id], main[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');
  const linkMap = new Map();
  navAnchors.forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) linkMap.set(href.slice(1), a);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('is-active'));
        const link = linkMap.get(entry.target.id);
        if (link) link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Copy-to-clipboard for OSS install snippets ---------- */
  document.querySelectorAll('.oss-card__copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.copyTarget;
      const target   = targetId && document.getElementById(targetId);
      if (!target) return;
      const text = target.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers / non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
      }
      btn.classList.add('is-copied');
      const label = btn.querySelector('.oss-card__copy-label');
      const original = label && label.textContent;
      if (label) label.textContent = 'Cop';   // CSS appends "ied!" via .is-copied
      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label && original) label.textContent = original;
      }, 1600);
    });
  });

  /* ---------- Init ---------- */
  onScroll();
})();
