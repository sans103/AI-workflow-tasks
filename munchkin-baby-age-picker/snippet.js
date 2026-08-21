/* ============================================================
   MUNCHKIN FORMULA V2 :: Baby's age month picker
   - Born mode: selectable window = last 12 months (0 to 11 months old),
     so every pick maps to an existing option value on the native select.
   - Expecting mode: selectable window = this month through +9 months.
     Native select value becomes "Expecting"; the exact due month rides
     along on #mkap[data-month] and the mkap:change event.
   - Writes to the original <select> with the native value setter and
     dispatches input + change, so React state and the cart attribute
     update exactly as they do today.
   ============================================================ */
(function () {
  'use strict';

  var root = document.getElementById('mkap');
  if (!root) return;

  var ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var PLACEHOLDER = 'Select birth month or due date';
  var IDLE_CTA = "Select Baby's Age";
  var CTA_LABELS = { 'formula-v2-buybox-cta': 'Start with the trial · $0' };

  var trigger = document.getElementById('mkap-trigger');
  var valEl = document.getElementById('mkap-val');
  var panel = document.getElementById('mkap-panel');
  var grid = document.getElementById('mkap-grid');
  var yrEl = document.getElementById('mkap-yr');
  var hint = document.getElementById('mkap-hint');
  var modeHelp = document.getElementById('mkap-mode-help');
  var native = document.getElementById('mkap-native');
  var prevBtn = root.querySelector('[data-nav="prev"]');
  var nextBtn = root.querySelector('[data-nav="next"]');
  var thisBtn = root.querySelector('[data-act="this"]');
  var clearBtn = root.querySelector('[data-act="clear"]');
  var modeBtns = root.querySelectorAll('.mkap-mode');

  var now = new Date();
  var NOW = now.getFullYear() * 12 + now.getMonth();
  var mode = 'born';
  var view = now.getFullYear();
  var picked = null;
  var focusIdx = now.getMonth();

  function limits() { return mode === 'born' ? [NOW - 11, NOW] : [NOW, NOW + 9]; }
  function abs(y, m) { return y * 12 + m; }
  function yOf(i) { return Math.floor(i / 12); }
  function mOf(i) { return i - yOf(i) * 12; }

  /* ---------- render ---------- */
  function render() {
    var lo = limits()[0], hi = limits()[1];
    yrEl.textContent = String(view);
    prevBtn.disabled = abs(view - 1, 11) < lo;
    nextBtn.disabled = abs(view + 1, 0) > hi;

    grid.innerHTML = '';
    for (var m = 0; m < 12; m++) {
      var i = abs(view, m);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mkap-m';
      b.textContent = ABBR[m];
      b.setAttribute('data-i', String(i));
      b.setAttribute('aria-label', FULL[m] + ' ' + view);
      b.setAttribute('aria-selected', picked === i ? 'true' : 'false');
      b.disabled = i < lo || i > hi;
      b.tabIndex = (m === focusIdx && !b.disabled) ? 0 : -1;
      grid.appendChild(b);
    }
    if (!grid.querySelector('[tabindex="0"]')) {
      var first = grid.querySelector('.mkap-m:not(:disabled)');
      if (first) { first.tabIndex = 0; focusIdx = mOf(parseInt(first.getAttribute('data-i'), 10)); }
    }
  }

  /* ---------- value plumbing ---------- */
  function ageValue(i) {
    var d = Math.max(0, Math.min(11, NOW - i));
    return d === 1 ? '1 month' : d + ' months';
  }
  function ageWords(i) {
    var d = NOW - i;
    if (d <= 0) return 'Newborn, under 1 month old';
    return d === 1 ? '1 month old' : d + ' months old';
  }
  function setNative(v) {
    var desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (desc && desc.set) { desc.set.call(native, v); } else { native.value = v; }
    native.dispatchEvent(new Event('input', { bubbles: true }));
    native.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function apply(silent) {
    if (picked === null) {
      valEl.textContent = PLACEHOLDER;
      valEl.classList.add('mkap-ph');
      hint.hidden = true;
      hint.textContent = '';
      root.removeAttribute('data-value');
      root.removeAttribute('data-month');
      root.setAttribute('data-mode', mode);
      if (!silent) { setNative(''); syncCta(false); }
      return;
    }

    var y = yOf(picked), m = mOf(picked);
    var iso = y + '-' + ('0' + (m + 1)).slice(-2);
    var value;

    valEl.classList.remove('mkap-ph');
    if (mode === 'born') {
      value = ageValue(picked);
      valEl.textContent = 'Born ' + FULL[m] + ' ' + y;
      hint.textContent = ageWords(picked) + '. Your Surprise Box is matched to this stage.';
    } else {
      var away = picked - NOW;
      value = 'Expecting';
      valEl.textContent = 'Due ' + FULL[m] + ' ' + y;
      hint.textContent = (away === 0 ? 'Expecting, due this month' : 'Expecting, due in ' + away + (away === 1 ? ' month' : ' months'))
        + '. Your Surprise Box is matched to the newborn stage.';
    }
    hint.hidden = false;
    root.setAttribute('data-value', value);
    root.setAttribute('data-month', iso);
    root.setAttribute('data-mode', mode);

    if (!silent) {
      setNative(value);
      syncCta(true);
      root.dispatchEvent(new CustomEvent('mkap:change', {
        bubbles: true,
        detail: { mode: mode, month: iso, year: y, monthIndex: m, value: value }
      }));
    }
  }

  /* ---------- CTA fallback ----------
     On the live site the app already reacts to the native select change.
     This only fires if the button is still stuck after that, so the same
     snippet also works in a static preview of the page. */
  var ctaCache = null;
  function ctas() {
    if (ctaCache) return ctaCache;
    ctaCache = [];
    var all = document.querySelectorAll('form[action="/cart"] button[type="submit"]');
    Array.prototype.forEach.call(all, function (b) {
      if ((b.textContent || '').trim() === IDLE_CTA) {
        b.setAttribute('data-mkap-idle', IDLE_CTA);
        ctaCache.push(b);
      }
    });
    return ctaCache;
  }
  function syncCta(valid) {
    window.setTimeout(function () {
      ctas().forEach(function (b) {
        var slot = b.querySelector('span') || b;
        if (valid && b.disabled) {
          b.disabled = false;
          slot.textContent = CTA_LABELS[b.id] || 'Subscribe';
        } else if (!valid && !b.disabled) {
          b.disabled = true;
          slot.textContent = b.getAttribute('data-mkap-idle') || IDLE_CTA;
        }
      });
    }, 150);
  }

  /* ---------- open / close ---------- */
  function onOutside(e) { if (!root.contains(e.target)) close(false); }
  function onEsc(e) { if (e.key === 'Escape') { e.stopPropagation(); close(true); } }

  function open() {
    if (picked !== null) { view = yOf(picked); focusIdx = mOf(picked); }
    else {
      var lo = limits()[0];
      view = (now.getFullYear() * 12 + now.getMonth() >= lo) ? now.getFullYear() : yOf(lo);
      focusIdx = now.getMonth();
    }
    render();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    flip();
    var f = grid.querySelector('[tabindex="0"]');
    if (f) f.focus();
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('keydown', onEsc, true);
  }
  function close(focusBack) {
    panel.hidden = true;
    panel.classList.remove('mkap-above');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onEsc, true);
    if (focusBack) trigger.focus();
  }
  function flip() {
    panel.classList.remove('mkap-above');
    var pr = panel.getBoundingClientRect();
    var tr = trigger.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (pr.bottom > vh - 8 && tr.top > pr.height + 16) panel.classList.add('mkap-above');
  }

  /* ---------- events ---------- */
  root.addEventListener('click', function (e) { e.stopPropagation(); });
  root.addEventListener('mousedown', function (e) { e.stopPropagation(); });

  trigger.addEventListener('click', function () {
    if (panel.hidden) open(); else close(true);
  });

  grid.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.mkap-m') : null;
    if (!b || b.disabled) return;
    picked = parseInt(b.getAttribute('data-i'), 10);
    view = yOf(picked);
    focusIdx = mOf(picked);
    render();
    apply(false);
    close(true);
  });

  grid.addEventListener('keydown', function (e) {
    var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 }[e.key];
    if (step) {
      var n = focusIdx + step;
      if (n < 0 || n > 11) return;
      e.preventDefault();
      focusIdx = n;
      render();
      var t = grid.children[focusIdx];
      if (t) { t.tabIndex = 0; t.focus(); }
      return;
    }
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      var btn = e.key === 'PageUp' ? prevBtn : nextBtn;
      if (!btn.disabled) btn.click();
    }
  });

  prevBtn.addEventListener('click', function () { view -= 1; render(); focusFirst(); });
  nextBtn.addEventListener('click', function () { view += 1; render(); focusFirst(); });
  function focusFirst() {
    var f = grid.querySelector('[tabindex="0"]');
    if (f) f.focus();
  }

  Array.prototype.forEach.call(modeBtns, function (b) {
    b.addEventListener('click', function () {
      var next = b.getAttribute('data-mode');
      if (next === mode) return;
      mode = next;
      picked = null;
      Array.prototype.forEach.call(modeBtns, function (x) {
        x.setAttribute('aria-pressed', x.getAttribute('data-mode') === mode ? 'true' : 'false');
      });
      modeHelp.textContent = mode === 'born'
        ? 'Pick the month your baby was born.'
        : 'Pick the month your baby is due.';
      thisBtn.textContent = mode === 'born' ? 'This month' : 'Due this month';
      view = now.getFullYear();
      focusIdx = now.getMonth();
      render();
      apply(false);
      focusFirst();
    });
  });

  thisBtn.addEventListener('click', function () {
    picked = NOW;
    view = yOf(NOW);
    focusIdx = mOf(NOW);
    render();
    apply(false);
    close(true);
  });

  clearBtn.addEventListener('click', function () {
    picked = null;
    render();
    apply(false);
    focusFirst();
  });

  /* ---------- init ---------- */
  render();
  apply(true);
})();
