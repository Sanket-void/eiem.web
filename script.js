/* ═══════════════════════════════════════════════════════════════
   EIEM — Home Page Script  (merged home.js + script.js)
   Sections:
     1. Supabase config
     2. Stats count-up
     3. Students counter
     4. Apply-now modal
     5. Navbar dropdowns
     6. Events carousel  (shared helper)
     7. Recruiter strip  (auto-scroll)
     8. Announce bar     (clone for seamless marquee fallback)
     9. Dynamic content  (notices + events from Supabase)
    10. Enquiry form      (Supabase insert)
    11. DOMContentLoaded init
═══════════════════════════════════════════════════════════════ */

/* ── 1. SUPABASE CONFIG ─────────────────────────────────────── */
const SUPABASE_URL = "https://zmrowyxzpygrvwnqvucy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm93eXh6cHlncnZ3bnF2dWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTQyNjUsImV4cCI6MjA5NDY5MDI2NX0.6nXMU-d-11e1etRQgOOIdGxHB5FiNWZMyxBvZQknqz8";

/* ── UTILITY ────────────────────────────────────────────────── */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── 2. STATS COUNT-UP ──────────────────────────────────────── */
(function () {
  var statsBar = document.getElementById('statsBar');
  if (!statsBar) return;
  var animated = false;

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function animateStat(el, target, suffix, duration) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = easeOutExpo(progress);
      var current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
        el.classList.add('pop');
        el.addEventListener('animationend', function () { el.classList.remove('pop'); }, { once: true });
      }
    }
    requestAnimationFrame(step);
  }

  function runAll() {
    if (animated) return;
    animated = true;
    var items = [
      { id: 'stat0', target: 25, suffix: '+', delay: 0, dur: 3000 },
      { id: 'stat1', target: 5000, suffix: '+', delay: 300, dur: 4500 },
      { id: 'stat2', target: 95, suffix: '%', delay: 600, dur: 3200 },
      { id: 'stat3', target: 200, suffix: '+', delay: 900, dur: 4000 },
      { id: 'stat4', target: 15, suffix: '+', delay: 1200, dur: 3000 }
    ];
    items.forEach(function (it) {
      setTimeout(function () {
        var el = document.getElementById(it.id);
        if (el) animateStat(el, it.target, it.suffix, it.dur);
      }, it.delay);
    });
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runAll(); obs.disconnect(); } });
    }, { threshold: 0.3 });
    obs.observe(statsBar);
  } else {
    runAll();
  }
})();

/* ── 3. STUDENTS COUNTER ────────────────────────────────────── */
(function () {
  var wrap = document.getElementById('studentsCounterWrap');
  var el = document.getElementById('studentsNum');
  if (!wrap || !el) return;
  var done = false;

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function runCount() {
    if (done) return;
    done = true;
    var target = 3000, duration = 4000, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var v = Math.round(easeOutExpo(p) * target);
      el.textContent = v.toLocaleString() + '+';
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = '3,000+';
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCount(); obs.disconnect(); } });
    }, { threshold: 0.4 });
    obs.observe(wrap);
  } else {
    runCount();
  }
})();

/* ── 4. APPLY-NOW MODAL ─────────────────────────────────────── */
(function () {
  var modal = document.getElementById('applyModal');
  var closeBtn = document.getElementById('modalClose');
  if (!modal) return;

  function openModal(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  var navApply = document.getElementById('navApplyNow');
  if (navApply) navApply.addEventListener('click', openModal);

  var heroBtn = document.getElementById('heroApplyBtn');
  if (heroBtn) heroBtn.addEventListener('click', openModal);

  var learnMore = document.getElementById('learnMoreBtn');
  if (learnMore) learnMore.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
})();

/* ── 5. NAVBAR DROPDOWNS ────────────────────────────────────── */
(function () {
  var ham = document.getElementById('ham');
  var menu = document.getElementById('navMenu');
  if (!ham || !menu) return;

  var isMobile = function () { return window.innerWidth <= 900; };

  ham.addEventListener('click', function () {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
  });

  var topLis = Array.from(menu.querySelectorAll(':scope > li'));

  function closeAllTop(except) {
    topLis.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      closeAllSub(li);
    });
  }
  function closeAllSub(parentLi) {
    Array.from(parentLi.querySelectorAll('.drop1 > li')).forEach(function (li) {
      li.classList.remove('open');
    });
  }

  topLis.forEach(function (li) {
    var drop1 = li.querySelector(':scope > .drop1');
    if (!drop1) return;
    var link = li.querySelector(':scope > a');
    var closeTimer;

    function openLi() { clearTimeout(closeTimer); closeAllTop(li); li.classList.add('open'); }
    function scheduleLiClose() {
      closeTimer = setTimeout(function () { li.classList.remove('open'); closeAllSub(li); }, 150);
    }

    li.addEventListener('mouseenter', function () { if (!isMobile()) openLi(); });
    li.addEventListener('mouseleave', function () { if (!isMobile()) scheduleLiClose(); });
    drop1.addEventListener('mouseenter', function () { if (!isMobile()) clearTimeout(closeTimer); });
    drop1.addEventListener('mouseleave', function () { if (!isMobile()) scheduleLiClose(); });
    link.addEventListener('click', function (e) {
      if (isMobile()) {
        e.preventDefault();
        var wasOpen = li.classList.contains('open');
        closeAllTop(null);
        if (!wasOpen) li.classList.add('open');
      }
    });

    var subLis = Array.from(drop1.querySelectorAll(':scope > li.has-sub2'));
    subLis.forEach(function (subLi) {
      var drop2 = subLi.querySelector(':scope > .drop2');
      if (!drop2) return;
      var subLink = subLi.querySelector(':scope > a');
      var subTimer;

      subLi.addEventListener('mouseenter', function () {
        if (isMobile()) return;
        clearTimeout(subTimer);
        subLis.forEach(function (x) { if (x !== subLi) x.classList.remove('open'); });
        subLi.classList.add('open');
      });
      subLi.addEventListener('mouseleave', function () {
        if (isMobile()) return;
        subTimer = setTimeout(function () { subLi.classList.remove('open'); }, 150);
      });
      drop2.addEventListener('mouseenter', function () { if (!isMobile()) clearTimeout(subTimer); });
      drop2.addEventListener('mouseleave', function () {
        if (!isMobile()) subTimer = setTimeout(function () { subLi.classList.remove('open'); }, 150);
      });
      subLink.addEventListener('click', function (e) {
        if (isMobile()) { e.preventDefault(); subLi.classList.toggle('open'); }
      });
    });
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !ham.contains(e.target)) {
      closeAllTop(null);
      menu.classList.remove('open');
      ham.classList.remove('open');
    }
  });
  window.addEventListener('resize', function () {
    closeAllTop(null);
    menu.classList.remove('open');
    ham.classList.remove('open');
  });
})();

/* ── 6. EVENTS CAROUSEL ─────────────────────────────────────── */
function initEventsCarousel() {
  var track = document.getElementById('evTrack');
  var dotsEl = document.getElementById('evDots');
  var prevBtn = document.getElementById('evPrev');
  var nextBtn = document.getElementById('evNext');
  if (!track) return;

  var GAP_REM = 1.4;
  var curPage = 0, autoTimer;

  if (track._evResizeHandler) window.removeEventListener('resize', track._evResizeHandler);

  function getPerView() {
    var w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 1024) return 2;
    return 4;
  }

  function getTotalPages() { return Math.ceil(track.children.length / getPerView()); }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    var total = getTotalPages();
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var d = document.createElement('button');
        d.className = 'ev-dot' + (idx === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to page ' + (idx + 1));
        d.onclick = function () { clearInterval(autoTimer); goTo(idx); startAuto(); };
        dotsEl.appendChild(d);
      })(i);
    }
  }

  function goTo(page) {
    var totalPages = getTotalPages();
    curPage = ((page % totalPages) + totalPages) % totalPages;
    var rootFS = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var gapPx = GAP_REM * rootFS;
    var vpW = track.parentElement.clientWidth;
    var perView = getPerView();
    var cardW = (vpW - gapPx * (perView - 1)) / perView;
    var step = (cardW + gapPx) * perView;
    track.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
    track.style.transform = 'translateX(-' + (curPage * step) + 'px)';
    if (dotsEl) {
      Array.from(dotsEl.children).forEach(function (d, i) { d.classList.toggle('active', i === curPage); });
    }
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(curPage + 1); }, 4500);
  }

  function init() { buildDots(); goTo(0); startAuto(); }

  if (prevBtn) prevBtn.onclick = function () { clearInterval(autoTimer); goTo(curPage - 1); startAuto(); };
  if (nextBtn) nextBtn.onclick = function () { clearInterval(autoTimer); goTo(curPage + 1); startAuto(); };

  var viewport = track.parentElement;
  if (viewport) {
    viewport.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    viewport.addEventListener('mouseleave', startAuto);
  }

  track._evResizeHandler = init;
  window.addEventListener('resize', track._evResizeHandler);
  init();
}

/* ── 7. RECRUITER STRIP ─────────────────────────────────────── */
(function () {
  var track = document.getElementById('recTrack');
  if (!track) return;
  track.parentElement.addEventListener('mouseenter', function () { track.style.animationPlayState = 'paused'; });
  track.parentElement.addEventListener('mouseleave', function () { track.style.animationPlayState = 'running'; });
})();

/* ── 8. ANNOUNCE BAR ────────────────────────────────────────── */
function initAnnounceBar() {
  // Only used as a fallback if the marquee tag is replaced with a custom scroller.
  // When Supabase populates #announceInner, this clones items for seamless loop.
  var inner = document.getElementById('announceInner');
  if (!inner) return;
  Array.from(inner.querySelectorAll('[data-clone]')).forEach(function (el) { el.remove(); });
  Array.from(inner.children).forEach(function (item) {
    var clone = item.cloneNode(true);
    clone.setAttribute('data-clone', '1');
    inner.appendChild(clone);
  });
}

/* ── EVENT IMAGE MAP ────────────────────────────────────────── */
var EVENT_IMAGES = {
  innovation: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  workshop: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  alumni: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
  academic: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80',
  festival: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
  placement: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
  exhibition: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
  industry: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=600&q=80',
  cultural: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
  seminar: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
  technical: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80'
};

function getEventImage(category) {
  var key = (category || '').toLowerCase();
  for (var k in EVENT_IMAGES) {
    if (k !== 'default' && key.includes(k)) return EVENT_IMAGES[k];
  }
  return EVENT_IMAGES.default;
}

/* ── 9. DYNAMIC CONTENT (Supabase) ─────────────────────────── */
async function loadDynamicContent() {
  if (typeof window.supabase === 'undefined') {
    console.error('Supabase SDK not loaded.');
    initEventsCarousel(); // still run carousel on static fallback cards
    return;
  }

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  /* ─── NOTICES ─── */
  var noticeContainer = document.getElementById('noticeContainer');
  if (noticeContainer) {
    var _a = await sb.from('notices').select('*').order('created_at', { ascending: false }).limit(20);
    var notices = _a.data, noticeErr = _a.error;

    if (noticeErr) {
      console.error('Notices fetch failed:', noticeErr.message);
      noticeContainer.innerHTML = '<div style="padding:1rem;color:red;font-size:.9rem">Failed to load notices.</div>';
    } else if (!notices || notices.length === 0) {
      noticeContainer.innerHTML = '<div style="padding:1rem;color:#64748b;font-size:.9rem">No notices available.</div>';
    } else {
      /* De-duplicate by id before rendering */
      var seen = {};
      var uniqueNotices = notices.filter(function (n) {
        if (seen[n.id]) return false;
        seen[n.id] = true;
        return true;
      });

      function buildNoticeItem(n) {
        var cat = (n.category || '').toLowerCase();
        var badgeClass = cat === 'urgent' ? 'urgent' : (cat === 'new' || cat === 'admission' || cat === 'result') ? 'new' : 'info';
        var dateStr = new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        var linkHtml = '';
        if (n.link && n.link.trim() !== '') {
          linkHtml = '<a href="' + esc(n.link) + '" target="_blank" class="n-link">\uD83D\uDD17 Open \u2192</a>';
        }
        return '<div class="n-item">' +
          '<div class="n-badge ' + badgeClass + '">' + esc(n.category || 'General') + '</div>' +
          '<h4>' + esc(n.title) + '</h4>' +
          '<p>' + dateStr + '</p>' +
          linkHtml +
          '</div>';
      }

      var itemsHtml = uniqueNotices.map(buildNoticeItem).join('');

      /* For seamless CSS loop we clone the list once (not the DOM nodes,
         just the HTML string), so there are never duplicate IDs in the DOM
         and the visual content repeats exactly once for the infinite scroll. */
      noticeContainer.innerHTML =
        '<div class="notice-ticker">' +
        '<div class="ticker-track">' +
        itemsHtml +
        /* clone set — marked with data-clone so we can strip them on refresh */
        uniqueNotices.map(function (n) {
          return buildNoticeItem(n).replace('<div class="n-item">', '<div class="n-item" data-clone="1">');
        }).join('') +
        '</div>' +
        '</div>';

      /* Reset animation so duration scales with item count */
      var track = noticeContainer.querySelector('.ticker-track');
      if (track) {
        var duration = Math.max(15, uniqueNotices.length * 3); // ~3 s per notice
        track.style.animationDuration = duration + 's';
      }
    }
  }

  /* ─── MARQUEE / ANNOUNCE BAR (optional, if element exists) ─── */
  var announceInner = document.getElementById('announceInner');
  if (announceInner && notices && notices.length > 0) {
    announceInner.innerHTML = notices.map(function (n) {
      return '<span><i class="ab-dot"></i>' + esc(n.title) + (n.content ? ' \u2014 ' + esc(n.content) : '') + '</span>';
    }).join('');
    initAnnounceBar();
  }

  /* ─── EVENTS ─── */
  var _b = await sb.from('events').select('*').order('event_date', { ascending: true }).limit(8);
  var events = _b.data, eventsErr = _b.error;

  if (eventsErr) {
    console.error('Events fetch failed:', eventsErr.message);
    initEventsCarousel();
    return;
  }

  var evTrackEl = document.getElementById('evTrack');
  if (!evTrackEl) return;

  if (events && events.length > 0) {
    evTrackEl.innerHTML = events.map(function (ev) {
      var imgSrc = (ev.image_url && ev.image_url.trim() !== '') ? ev.image_url : getEventImage(ev.category);
      var date = ev.event_date
        ? new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'TBA';
      return '<div class="ev-card">' +
        '<div class="ev-img-wrap"><img class="ev-img" src="' + esc(imgSrc) + '" alt="' + esc(ev.title) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + getEventImage(ev.category) + '\'"/></div>' +
        '<div class="ev-body">' +
        '<div class="ev-cat">' + esc(ev.category || 'Event') + '</div>' +
        '<h4>' + esc(ev.title) + '</h4>' +
        '<div class="ev-date">' + date + '</div>' +
        '</div>' +
        '</div>';
    }).join('');
    setTimeout(initEventsCarousel, 100);
  } else {
    initEventsCarousel(); // no DB events — keep static fallback cards
  }
}

/* ── 10. ENQUIRY FORM ───────────────────────────────────────── */
function showEnqStatus(msg, type) {
  var el = document.getElementById('enqStatus');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.style.color = type === 'success' ? '#16a34a' : '#dc2626';
  clearTimeout(el._timer);
  el._timer = setTimeout(function () { el.style.display = 'none'; }, 6000);
}

async function submitEnquiry() {
  /* honeypot */
  var honeypot = document.getElementById('enqHoneypot');
  if (honeypot && honeypot.value) return;

  var nameEl = document.getElementById('enqName');
  var emailEl = document.getElementById('enqEmail');
  var phoneEl = document.getElementById('enqPhone');
  var courseEl = document.getElementById('enqCourse');
  var messageEl = document.getElementById('enqMessage');
  var btn = document.getElementById('enqSubmitBtn');

  var name = nameEl ? nameEl.value.trim() : '';
  var email = emailEl ? emailEl.value.trim() : '';
  var phone = phoneEl ? phoneEl.value.trim() : '';
  var course = courseEl ? courseEl.value : '';
  var message = messageEl ? messageEl.value.trim() : '';

  if (!name || !email || !phone || !course || !message) {
    showEnqStatus('Please fill in all required fields.', 'error'); return;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    showEnqStatus('Please enter a valid 10-digit phone number.', 'error'); return;
  }

  if (btn) { btn.disabled = true; btn.textContent = 'Submitting\u2026'; }

  try {
    if (typeof window.supabase === 'undefined') throw new Error('Supabase not loaded');
    var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    var res = await sb.from('queries').insert([{ name, email, phone, course, message }]);
    if (res.error) throw res.error;
    showEnqStatus('\u2705 Enquiry submitted! We\'ll get back to you within 24 hours.', 'success');
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (messageEl) messageEl.value = '';
    if (courseEl) courseEl.selectedIndex = 0;
  } catch (err) {
    console.error('Enquiry submission failed:', err);
    showEnqStatus('\u274C Submission failed. Please try again or call us directly.', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Submit Enquiry \u2192'; }
  }
}

/* Delegate submit for both the inline enquiry card and the modal.
   Both .btn-sub buttons will call this handler. */
function initEnquiryForms() {
  /* Named form (dedicated IDs: enqName, enqEmail, etc.) */
  var namedBtn = document.getElementById('enqSubmitBtn');
  if (namedBtn) namedBtn.addEventListener('click', submitEnquiry);

  /* Generic .btn-sub buttons inside .enq-card / .modal-box
     (these use unnamed inputs — kept for backward compat) */
  document.querySelectorAll('.btn-sub').forEach(function (btn) {
    if (btn === namedBtn) return; // already handled above
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      var card = btn.closest('.enq-card, .modal-box');
      if (!card) return;

      var nameInput = card.querySelector('input[type="text"]');
      var emailInput = card.querySelector('input[type="email"]');
      var phoneInput = card.querySelector('input[type="tel"]');
      var courseSelect = card.querySelector('select');
      var messageInput = card.querySelector('textarea');

      var n = nameInput ? nameInput.value.trim() : '';
      var em = emailInput ? emailInput.value.trim() : '';
      var ph = phoneInput ? phoneInput.value.trim() : '';
      var co = courseSelect ? courseSelect.value : '';
      var ms = messageInput ? messageInput.value.trim() : '';

      if (!n || !em || !ph) { alert('Please fill in Name, Email and Phone.'); return; }

      var orig = btn.textContent;
      btn.textContent = 'Submitting\u2026'; btn.disabled = true;

      try {
        if (typeof window.supabase === 'undefined') throw new Error('Supabase not loaded');
        var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        var res = await sb.from('queries').insert([{ name: n, email: em, phone: ph, course: co, message: ms }]);
        if (res.error) throw res.error;
        alert('Thank you! Your enquiry has been submitted.');
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (courseSelect) courseSelect.value = '';
        if (messageInput) messageInput.value = '';
      } catch (err) {
        console.error('Form error:', err);
        alert('Something went wrong. Please try again.');
      } finally {
        btn.textContent = orig; btn.disabled = false;
      }
    });
  });
}

/* ── 11. INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initAnnounceBar();
  initEventsCarousel();   // run on static cards immediately
  loadDynamicContent();   // then replace with DB data if available
  initEnquiryForms();
});