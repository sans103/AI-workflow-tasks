(function () {
  document.querySelectorAll('[data-mk-terms]').forEach(function (root) {
    var trigger = root.querySelector('[data-mk-terms-trigger]');
    var panel = root.querySelector('[data-mk-terms-panel]');
    var close = root.querySelector('[data-mk-terms-close]');
    if (!trigger || !panel) return;

    function setOpen(open) {
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) {
        var r = panel.getBoundingClientRect();
        panel.style.left = r.right > window.innerWidth - 16 ? 'auto' : '0';
        panel.style.right = r.right > window.innerWidth - 16 ? '0' : 'auto';
      }
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(panel.hidden);
    });
    if (close) close.addEventListener('click', function () { setOpen(false); trigger.focus(); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); trigger.focus(); } });
  });
})();
