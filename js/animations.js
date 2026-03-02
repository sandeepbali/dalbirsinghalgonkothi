/* ===========================================================
   ANIMATIONS & INTERACTIONS — CINEMATIC ENGINE
   =========================================================== */
(function () {
    'use strict';

    /* ---- Custom Cursor ---- */
    function initCursor() {
        if (window.innerWidth < 769 || 'ontouchstart' in window) return;
        var dot = document.createElement('div');
        dot.className = 'cursor-dot';
        var ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mx = -100, my = -100, rx = -100, ry = -100;
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        });

        (function loop() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
            requestAnimationFrame(loop);
        })();

        var hovers = document.querySelectorAll('a, button, .btn, .gallery-item, .card-modern, .icon-block, .social-card');
        hovers.forEach(function (el) {
            el.addEventListener('mouseenter', function () { dot.classList.add('hovering'); ring.classList.add('hovering'); });
            el.addEventListener('mouseleave', function () { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
        });
    }

    /* ---- Scroll Reveal ---- */
    function initReveal() {
        var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
        if (!els.length) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        els.forEach(function (el) { obs.observe(el); });
    }

    /* ---- Animated Counters ---- */
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        var dur = 2200;
        (function update(now) {
            var p = Math.min((now - start) / dur, 1);
            var ease = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(target * ease).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(update);
        })(start);
    }
    function initCounters() {
        var els = document.querySelectorAll('[data-target]');
        if (!els.length) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
        }, { threshold: 0.5 });
        els.forEach(function (el) { obs.observe(el); });
    }

    /* ---- Particles ---- */
    function initParticles() {
        var c = document.querySelector('.hero-particles');
        if (!c) return;
        for (var i = 0; i < 20; i++) {
            var p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 20 + 's';
            p.style.animationDuration = (12 + Math.random() * 12) + 's';
            p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
            c.appendChild(p);
        }
    }

    /* ---- Navbar Scroll ---- */
    function initNavScroll() {
        var nav = document.querySelector('.navbar');
        if (!nav) return;
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    nav.classList.toggle('scrolled', window.pageYOffset > 60);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ---- Hamburger ---- */
    function initHamburger() {
        var h = document.querySelector('.hamburger');
        var n = document.querySelector('.nav-links');
        if (!h || !n) return;
        h.addEventListener('click', function () { h.classList.toggle('active'); n.classList.toggle('open'); });
        n.querySelectorAll('a:not(.lang-switch a)').forEach(function (a) {
            a.addEventListener('click', function () { h.classList.remove('active'); n.classList.remove('open'); });
        });
    }

    /* ---- Active Nav ---- */
    function initActiveNav() {
        var page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links > a').forEach(function (a) {
            var href = a.getAttribute('href');
            if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
        });
    }

    /* ---- Lightbox ---- */
    function initLightbox() {
        var lb = document.getElementById('lightbox');
        if (!lb) return;
        var img = lb.querySelector('img');
        document.querySelectorAll('.gallery-item').forEach(function (item) {
            item.addEventListener('click', function () {
                var src = this.querySelector('img');
                if (src) { img.src = src.src; img.alt = src.alt; lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
            });
        });
        lb.addEventListener('click', function (e) {
            if (e.target === lb || e.target.closest('.lightbox-close')) { lb.classList.remove('active'); document.body.style.overflow = ''; }
        });
    }

    /* ---- Gallery Filter ---- */
    function initFilter() {
        var btns = document.querySelectorAll('.filter-btn');
        var items = document.querySelectorAll('.gallery-item');
        if (!btns.length || !items.length) return;
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                btns.forEach(function (b) { b.classList.remove('active'); }); btn.classList.add('active');
                var cat = btn.getAttribute('data-filter');
                items.forEach(function (item) {
                    var show = cat === 'all' || item.getAttribute('data-category') === cat;
                    item.style.transition = 'opacity 0.4s, transform 0.4s';
                    item.style.opacity = show ? '1' : '0';
                    item.style.transform = show ? 'scale(1)' : 'scale(0.9)';
                    setTimeout(function () { item.style.display = show ? '' : 'none'; }, show ? 0 : 400);
                });
            });
        });
    }

    /* ---- Magnetic Buttons ---- */
    function initMagnetic() {
        if (window.innerWidth < 769) return;
        document.querySelectorAll('.btn').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var x = (e.clientX - r.left - r.width / 2) * 0.15;
                var y = (e.clientY - r.top - r.height / 2) * 0.15;
                btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    /* ---- Smooth Scroll for anchors ---- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var t = document.querySelector(this.getAttribute('href'));
                if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            });
        });
    }

    /* ---- Init ---- */
    function init() {
        initNavScroll();
        initHamburger();
        initActiveNav();
        initSmoothScroll();
        initReveal();
        initCounters();
        initParticles();
        initLightbox();
        initFilter();
        initCursor();
        initMagnetic();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
