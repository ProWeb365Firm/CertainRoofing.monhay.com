/*
 * Table of Contents + Reading Progress for the blog articles.
 * Replaces Elementor Pro's on-demand scripts, which aren't part of the static
 * site. Fills the existing widgets, so their theme styles still apply.
 */
(function () {
  'use strict';

  function settingsOf(el) {
    try { return JSON.parse(el.getAttribute('data-settings') || '{}'); } catch (e) { return {}; }
  }

  function slugify(text, used) {
    var base = text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
    var id = base, n = 2;
    while (used[id] || document.getElementById(id)) { id = base + '-' + n++; }
    used[id] = true;
    return id;
  }

  /* ---------- Table of Contents ---------- */
  function buildToc(widget) {
    var s = settingsOf(widget);
    var body = widget.querySelector('.elementor-toc__body');
    if (!body) return;
    var container = document.querySelector('.elementor-widget-theme-post-content') ||
                    document.querySelector(s.container || '.single-posts-container');
    var tags = (s.headings_by_tags && s.headings_by_tags.length ? s.headings_by_tags : ['h2', 'h3']);
    var exclude = s.exclude_headings_by_selector || '.exclude';
    var headings = container ? Array.prototype.filter.call(
      container.querySelectorAll(tags.join(',')),
      function (h) {
        return h.textContent.trim() !== '' && !h.closest(exclude) &&
               !h.closest('.elementor-widget-table-of-contents') && !h.closest('.cr-author-box');
      }) : [];

    if (!headings.length) {
      body.innerHTML = '<div class="elementor-toc__no-headings">' +
        (s.no_headings_message || 'No headings were found on this page.') + '</div>';
      return;
    }

    var used = {};
    var levels = tags.map(function (t) { return parseInt(t.replace('h', ''), 10); }).sort();
    var hierarchical = s.hierarchical_view === 'yes';
    var root = document.createElement('ul');
    root.className = 'elementor-toc__list-wrapper';
    var stack = [{ level: levels[0], list: root, lastItem: null }];

    headings.forEach(function (h) {
      if (!h.id) { h.id = slugify(h.textContent.trim(), used); }
      var level = parseInt(h.tagName.substring(1), 10);
      var top = stack[stack.length - 1];
      if (hierarchical) {
        while (stack.length > 1 && level < stack[stack.length - 1].level) { stack.pop(); }
        top = stack[stack.length - 1];
        if (level > top.level && top.lastItem) {
          var sub = document.createElement('ul');
          sub.className = 'elementor-toc__list-wrapper';
          top.lastItem.appendChild(sub);
          stack.push({ level: level, list: sub, lastItem: null });
          top = stack[stack.length - 1];
        }
      }
      var li = document.createElement('li');
      li.className = 'elementor-toc__list-item';
      var wrap = document.createElement('div');
      wrap.className = 'elementor-toc__list-item-text-wrapper';
      var a = document.createElement('a');
      a.className = 'elementor-toc__list-item-text' + (stack.length === 1 ? ' elementor-toc__top-level' : '');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var y = h.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        if (history.replaceState) { history.replaceState(null, '', '#' + h.id); }
      });
      wrap.appendChild(a);
      li.appendChild(wrap);
      top.list.appendChild(li);
      top.lastItem = li;
    });

    body.innerHTML = '';
    body.appendChild(root);

    // Highlight the section being read.
    var links = body.querySelectorAll('.elementor-toc__list-item-text');
    function markActive() {
      var current = null;
      headings.forEach(function (h, i) { if (h.getBoundingClientRect().top < 140) { current = i; } });
      links.forEach(function (l, i) {
        var on = i === current;
        l.classList.toggle('elementor-item-active', on);
        l.closest('.elementor-toc__list-item').classList.toggle('elementor-item-active', on);
      });
    }
    window.addEventListener('scroll', markActive, { passive: true });
    markActive();
  }

  /* ---------- Reading Progress ---------- */
  function buildProgress(widget) {
    var s = settingsOf(widget);
    var bar = widget.querySelector('.current-progress');
    var label = widget.querySelector('.current-progress-percentage');
    if (!bar) return;
    var target = s.relative_to === 'post_content'
      ? (document.querySelector('.elementor-widget-theme-post-content') || document.body)
      : document.documentElement;

    function update() {
      var rect = target.getBoundingClientRect();
      var start = rect.top + window.pageYOffset;
      var total = Math.max(1, target.offsetHeight - window.innerHeight);
      if (target === document.documentElement) { start = 0; total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
      var pct = Math.round(Math.min(100, Math.max(0, (window.pageYOffset - start) / total * 100)));
      bar.style.display = pct > 0 ? 'flex' : 'none';
      bar.style.width = pct + '%';
      if (label && s.percentage === 'yes') { label.textContent = pct + '%'; }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function init() {
    document.querySelectorAll('.elementor-widget-table-of-contents').forEach(buildToc);
    document.querySelectorAll('.elementor-widget-progress-tracker').forEach(buildProgress);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
