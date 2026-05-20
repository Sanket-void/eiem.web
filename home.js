    /* ── VIDEO HERO — no JS needed, autoplay handles it ── */

    /* ── STATS COUNT-UP ── */
    (function () {
      var statsBar = document.getElementById('statsBar');
      var animated = false;
      function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function animateStat(el, target, suffix, duration) {
        var start = null;
        function step(ts) { if (!start) start = ts; var progress = Math.min((ts - start) / duration, 1); var eased = easeOutExpo(progress); var current = Math.round(eased * target); el.textContent = current.toLocaleString() + suffix; if (progress < 1) { requestAnimationFrame(step); } else { el.textContent = target.toLocaleString() + suffix; el.classList.add('pop'); el.addEventListener('animationend', function () { el.classList.remove('pop'); }, { once: true }); } }
        requestAnimationFrame(step);
      }
      function runAll() {
        if (animated) return; animated = true;
        var items = [{ id: 'stat0', target: 25, suffix: '+', delay: 0, dur: 3000 }, { id: 'stat1', target: 5000, suffix: '+', delay: 300, dur: 4500 }, { id: 'stat2', target: 95, suffix: '%', delay: 600, dur: 3200 }, { id: 'stat3', target: 200, suffix: '+', delay: 900, dur: 4000 }, { id: 'stat4', target: 15, suffix: '+', delay: 1200, dur: 3000 }];
        items.forEach(function (it) { setTimeout(function () { animateStat(document.getElementById(it.id), it.target, it.suffix, it.dur); }, it.delay); });
      }
      if ('IntersectionObserver' in window) { var obs = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { runAll(); obs.disconnect(); } }); }, { threshold: 0.3 }); obs.observe(statsBar); } else { runAll(); }
    })();

    /* ── STUDENTS COUNTER ── */
    (function () {
      var wrap = document.getElementById('studentsCounterWrap');
      var el = document.getElementById('studentsNum');
      var done = false;
      function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function runCount() {
        if (done) return; done = true;
        var target = 3000, duration = 4000, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var v = Math.round(easeOutExpo(p) * target);
          el.textContent = v.toLocaleString() + '+';
          if (p < 1) { requestAnimationFrame(step); }
          else { el.textContent = '3,000+'; }
        }
        requestAnimationFrame(step);
      }
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { runCount(); obs.disconnect(); } });
        }, { threshold: 0.4 });
        obs.observe(wrap);
      } else { runCount(); }
    })();

    /* ── APPLY NOW MODAL ── */
    (function () {
      var modal = document.getElementById('applyModal');
      var closeBtn = document.getElementById('modalClose');

      function openModal(e) { if (e) { e.preventDefault(); e.stopPropagation(); } modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
      function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }

      // Nav "Apply Now" — opens modal
      var navApply = document.getElementById('navApplyNow');
      if (navApply) navApply.addEventListener('click', openModal);

      // Hero "Apply Now" — opens modal
      var heroBtn = document.getElementById('heroApplyBtn');
      if (heroBtn) heroBtn.addEventListener('click', openModal);

      // "Learn More" in about section
      var learnMore = document.getElementById('learnMoreBtn');
      if (learnMore) learnMore.addEventListener('click', openModal);

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    })();

    /* ── NAVBAR DROPDOWNS ── */
    (function () {
      var ham = document.getElementById('ham');
      var menu = document.getElementById('navMenu');
      var isMobile = function () { return window.innerWidth <= 900; };
      ham.addEventListener('click', function () { ham.classList.toggle('open'); menu.classList.toggle('open'); });
      var topLis = Array.from(menu.querySelectorAll(':scope > li'));
      function closeAllTop(except) { topLis.forEach(function (li) { if (li === except) return; li.classList.remove('open'); closeAllSub(li); }); }
      function closeAllSub(parentLi) { Array.from(parentLi.querySelectorAll('.drop1 > li')).forEach(function (li) { li.classList.remove('open'); }); }
      topLis.forEach(function (li) {
        var drop1 = li.querySelector(':scope > .drop1');
        if (!drop1) return;
        var link = li.querySelector(':scope > a');
        var closeTimer;
        function openLi() { clearTimeout(closeTimer); closeAllTop(li); li.classList.add('open'); }
        function scheduleLiClose() { closeTimer = setTimeout(function () { li.classList.remove('open'); closeAllSub(li); }, 150); }
        li.addEventListener('mouseenter', function () { if (!isMobile()) openLi(); });
        li.addEventListener('mouseleave', function () { if (!isMobile()) scheduleLiClose(); });
        drop1.addEventListener('mouseenter', function () { if (!isMobile()) clearTimeout(closeTimer); });
        drop1.addEventListener('mouseleave', function () { if (!isMobile()) scheduleLiClose(); });
        link.addEventListener('click', function (e) { if (isMobile()) { e.preventDefault(); var wasOpen = li.classList.contains('open'); closeAllTop(null); if (!wasOpen) li.classList.add('open'); } });
        var subLis = Array.from(drop1.querySelectorAll(':scope > li.has-sub2'));
        subLis.forEach(function (subLi) {
          var drop2 = subLi.querySelector(':scope > .drop2');
          if (!drop2) return;
          var subLink = subLi.querySelector(':scope > a');
          var subTimer;
          subLi.addEventListener('mouseenter', function () { if (isMobile()) return; clearTimeout(subTimer); subLis.forEach(function (x) { if (x !== subLi) x.classList.remove('open'); }); subLi.classList.add('open'); });
          subLi.addEventListener('mouseleave', function () { if (isMobile()) return; subTimer = setTimeout(function () { subLi.classList.remove('open'); }, 150); });
          drop2.addEventListener('mouseenter', function () { if (!isMobile()) clearTimeout(subTimer); });
          drop2.addEventListener('mouseleave', function () { if (!isMobile()) subTimer = setTimeout(function () { subLi.classList.remove('open'); }, 150); });
          subLink.addEventListener('click', function (e) { if (isMobile()) { e.preventDefault(); subLi.classList.toggle('open'); } });
        });
      });
      document.addEventListener('click', function (e) { if (!menu.contains(e.target) && !ham.contains(e.target)) { closeAllTop(null); menu.classList.remove('open'); ham.classList.remove('open'); } });
      window.addEventListener('resize', function () { closeAllTop(null); menu.classList.remove('open'); ham.classList.remove('open'); });
    })();

    

    /* ── SUPABASE DYNAMIC CONTENT ── */
    (async function() {
      // Initialize Supabase
      if (typeof window.supabase === 'undefined') {
        console.error('Supabase SDK not loaded.');
        return;
      }
      const SUPABASE_URL = "https://zmrowyxzpygrvwnqvucy.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm93eXh6cHlncnZ3bnF2dWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTQyNjUsImV4cCI6MjA5NDY5MDI2NX0.6nXMU-d-11e1etRQgOOIdGxHB5FiNWZMyxBvZQknqz8";
      const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      // Fetch & Render Notices
      const noticeContainer = document.getElementById('noticeContainer');
      if (noticeContainer) {
        const { data: notices, error: noticeErr } = await sb.from('notices').select('*').order('created_at', { ascending: false }).limit(10);
        
        if (noticeErr) {
          console.error("Error fetching notices:", noticeErr);
          noticeContainer.innerHTML = `<div style="padding:1rem; color:red; font-size:0.9rem;">Failed to load notices.</div>`;
        } else if (!notices || notices.length === 0) {
          noticeContainer.innerHTML = `<div style="padding:1rem; color:#64748b; font-size:0.9rem;">No notices available.</div>`;
        } else {
         const noticeHTML = notices.map(n => {
  let badgeClass = 'info';
  if (n.category && n.category.toLowerCase() === 'urgent') badgeClass = 'urgent';
  else if (n.category && n.category.toLowerCase() === 'new') badgeClass = 'new';
  const dateStr = new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  let linkHtml = '';
  if (n.link && n.link.trim() !== '') {
    linkHtml = `<a href="${n.link}" target="_blank" class="n-link">🔗 Open →</a>`;
  }
  return `
    <div class="n-item">
      <div class="n-badge ${badgeClass}">${n.category || 'General'}</div>
      <h4>${n.title}</h4>
      <p style="margin:0 0 4px 0;font-size:0.83rem;color:#334155;">${n.content || ''}</p>
      <p>${dateStr}</p>
      ${linkHtml}
    </div>
  `;
}).join('');

// Use ticker-track with duplicate for seamless infinite scroll
// CSS already has the tickUp animation and hover-to-pause on .notice-ticker
noticeContainer.innerHTML = `
  <div class="notice-ticker">
    <div class="ticker-track">
      ${noticeHTML}
      ${noticeHTML}
    </div>
  </div>
`;
      }
      }

      // Fetch & Render Events — prepend DB events before hardcoded ones
      const evTrack = document.getElementById('evTrack');
      if (evTrack) {
        const { data: events, error: eventErr } = await sb
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('event_date', { ascending: false })
          .limit(12);

        if (!eventErr && events && events.length > 0) {
          const newCards = events.map(ev => {
            const dateStr = ev.event_date
              ? new Date(ev.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : '';
            const imgHtml = ev.image_url
              ? `<img class="ev-img" src="${ev.image_url}" alt="${ev.title}">`
              : `<div class="ev-img" style="background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:2.5rem;">📅</div>`;

            return `
              <div class="ev-card">
                <div class="ev-img-wrap">${imgHtml}</div>
                <div class="ev-body">
                  <div class="ev-cat">${ev.category || 'Event'}</div>
                  <h4>${ev.title}</h4>
                  ${ev.description ? `<p style="font-size:0.78rem;color:#64748b;margin:4px 0 0 0;line-height:1.4">${ev.description.substring(0,80)}${ev.description.length>80?'…':''}</p>` : ''}
                  <div class="ev-date">${dateStr}</div>
                  ${ev.link ? `<a href="${ev.link}" target="_blank" style="display:inline-block;margin-top:6px;font-size:0.75rem;font-weight:700;color:#2563eb;text-decoration:none;background:#eff6ff;padding:3px 8px;border-radius:4px;border:1px solid #bfdbfe;">Learn More →</a>` : ''}
                  
                </div>
              </div>
            `;
          }).join('');

          // Prepend DB events before hardcoded ones
          evTrack.innerHTML = newCards;

          // Reinitialise carousel with updated card count
          const dotsEl = document.getElementById('evDots');
          const GAP_REM = 1.4;
          let perView, totalPages, curPage = 0, autoTimer;

          function getPerView() { const w = window.innerWidth; if (w<=600) return 1; if (w<=1024) return 2; return 4; }
          function buildDots() {
            dotsEl.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
              const b = document.createElement('button');
              b.className = 'ev-dot' + (i===0?' active':'');
              b.setAttribute('aria-label','Slide '+(i+1));
              b.onclick = () => { goTo(i); startAuto(); };
              dotsEl.appendChild(b);
            }
          }
          function updateDots() { dotsEl.querySelectorAll('.ev-dot').forEach((d,i) => d.classList.toggle('active', i===curPage)); }
          function goTo(page) {
            const cards = evTrack.querySelectorAll('.ev-card').length;
            totalPages = Math.ceil(cards / perView);
            curPage = ((page % totalPages) + totalPages) % totalPages;
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const gapPx = GAP_REM * rootFontSize;
            const vpW = evTrack.parentElement.clientWidth;
            const cardPx = (vpW - gapPx * (perView-1)) / perView;
            const stepPx = (cardPx + gapPx) * perView;
            evTrack.style.transform = `translateX(-${curPage * stepPx}px)`;
            updateDots();
          }
          function startAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(curPage+1), 4500); }
          function init() {
            perView = getPerView();
            totalPages = Math.ceil(evTrack.querySelectorAll('.ev-card').length / perView);
            curPage = 0;
            buildDots();
            goTo(0);
            startAuto();
          }
          document.getElementById('evPrev').onclick = () => { goTo(curPage-1); startAuto(); };
          document.getElementById('evNext').onclick = () => { goTo(curPage+1); startAuto(); };
          const evViewport = document.querySelector('.ev-viewport');
          if (evViewport) {
            evViewport.addEventListener('mouseenter', () => clearInterval(autoTimer));
            evViewport.addEventListener('mouseleave', startAuto);
          }
          window.addEventListener('resize', init);
          init();
        }
      }
    // Handle Enquiry Form Submissions
      const submitButtons = document.querySelectorAll('.btn-sub');
      submitButtons.forEach(btn => {
        btn.addEventListener('click', async function(e) {
          e.preventDefault();
          const card = this.closest('.enq-card, .modal-box');
          if(!card) return;

          const nameInput = card.querySelector('input[type="text"]');
          const emailInput = card.querySelector('input[type="email"]');
          const phoneInput = card.querySelector('input[type="tel"]');
          const courseSelect = card.querySelector('select');
          const messageInput = card.querySelector('textarea');

          const name = nameInput ? nameInput.value.trim() : '';
          const email = emailInput ? emailInput.value.trim() : '';
          const phone = phoneInput ? phoneInput.value.trim() : '';
          const course = courseSelect ? courseSelect.value : '';
          const message = messageInput ? messageInput.value.trim() : '';

          if (!name || !email || !phone) {
            alert('Please fill in your Name, Email, and Phone number.');
            return;
          }

          const originalText = btn.innerText;
          btn.innerText = 'Submitting...';
          btn.disabled = true;

          try {
            const { error } = await sb.from('queries').insert([{ name, email, phone, course, message }]);
            if (error) throw error;
            
            alert('Thank you! Your enquiry has been submitted successfully.');
            // Clear form
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (phoneInput) phoneInput.value = '';
            if (courseSelect) courseSelect.value = '';
            if (messageInput) messageInput.value = '';
          } catch (err) {
            console.error('Form submission error:', err);
            alert('Something went wrong. Please try again.');
          } finally {
            btn.innerText = originalText;
            btn.disabled = false;
          }
        });
      });
    })();
