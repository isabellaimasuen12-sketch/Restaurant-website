/* ══════════════════════════════════════════════
   FoodieHub — Universal Search
   Works on all pages.
   • Dropdown with categorised results on every page
   • Live menu-grid filtering on foodmenu.html
   ══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── STATIC DATA ────────────────────────────── */

  const PAGES = [
    { name: 'Home',       url: 'index.html',    icon: 'fa-house-chimney',  desc: 'Back to the homepage' },
    { name: 'About Us',   url: 'about.html',    icon: 'fa-circle-info',    desc: 'Our story and team' },
    { name: 'Food Menu',  url: 'foodmenu.html', icon: 'fa-utensils',       desc: 'Browse all dishes' },
    { name: 'Book a Table', url: 'Booking.html',icon: 'fa-calendar-check', desc: 'Reserve your spot' },
  ];

  const CHEFS = [
    { name: 'Chef Susan Leonard',  desc: 'Pastries & desserts specialist',        page: 'about.html' },
    { name: 'Chef Fatima Habib',   desc: 'Contemporary Nigerian cuisine',          page: 'about.html' },
    { name: 'Chef Ashley Cromwell',desc: 'Authentic local spices & recipes',       page: 'about.html' },
    { name: 'Chef Kate Samuel',    desc: 'Traditional Nigerian with modern twist', page: 'about.html' },
  ];

  /* Food items scraped from the menu (used for the dropdown on non-menu pages) */
  const FOOD_ITEMS = [
    { name: 'Amala & Ewedu Soup',               category: 'Soups',       price: '₦2,500', img: 'images/amala.jpg' },
    { name: 'Nkwobi',                            category: 'Soups',       price: '₦2,500', img: 'images/NKWOBI.jpg' },
    { name: 'Egusi Soup & Eba',                  category: 'Soups',       price: '₦2,200', img: 'images/istockphoto-1327486548-612x612.jpg' },
    { name: 'Banga and Starch',                  category: 'Soups',       price: '₦5,500', img: 'images/banga.jpg' },
    { name: 'Black Soup & Starch',               category: 'Soups',       price: '₦2,500', img: 'images/bllack soup.jpg' },
    { name: 'Jollof Rice & Chicken',             category: 'Rice Dishes', price: '₦3,000', img: 'images/istockphoto-1448028228-612x612.jpg' },
    { name: 'Fried Rice & Plantain',             category: 'Rice Dishes', price: '₦2,800', img: 'images/plantain.jpg' },
    { name: 'Jollof Rice with Beef Skewers & Salad', category: 'Grills', price: '₦12,500',img: 'images/download.jpg' },
    { name: 'Suya Platter',                      category: 'Grills',      price: '₦3,500', img: 'images/suya.jpg' },
    { name: 'Grilled Tilapia',                   category: 'Grills',      price: '₦4,000', img: 'images/tilapia.jpg' },
    { name: 'Tea and Sandwich',                  category: 'Breakfast',   price: '₦2,500', img: 'images/breakfast.jpg' },
    { name: 'Akara and Pap',                     category: 'Breakfast',   price: '₦2,500', img: 'images/breakf.jpg' },
    { name: 'Fried Potato and Ketchup',          category: 'Breakfast',   price: '₦6,500', img: 'images/potato.jpg' },
    { name: 'Strawberry Ice Cream',              category: 'Snacks',      price: '₦2,500', img: 'images/strawberry.jpg' },
    { name: 'Crispy Chin Chin',                  category: 'Snacks',      price: '₦2,500', img: 'images/chinchin.jpg' },
    { name: 'Crispy Plantain Chips',             category: 'Snacks',      price: '₦2,500', img: 'images/chips.jpg' },
    { name: 'Roasted Plantain and Vegetables',   category: 'Snacks',      price: '₦2,500', img: 'images/bole.jpg' },
    { name: 'Puff-Puff',                         category: 'Snacks',      price: '₦800',   img: 'images/puff puff.jpg' },
    { name: 'Doughnut',                          category: 'Snacks',      price: '₦2,500', img: 'images/doughnut.jpg' },
    { name: 'Meatpie and Suya',                  category: 'Snacks',      price: '₦2,500', img: 'images/meatpie.jpg' },
    { name: 'Local Okpa',                        category: 'Snacks',      price: '₦2,500', img: 'images/OKPA.jpg' },
    { name: 'Celebration Cake',                  category: 'Celebration', price: '₦45,000',img: 'images/cake.jpg' },
    { name: 'Gift Box',                          category: 'Gift',        price: '₦2,500', img: 'images/gift.jpg' },
    { name: 'Chapman Cocktail',                  category: 'Drinks',      price: '₦1,200', img: 'images/chapman.jpg' },
  ];

  /* ── HELPERS ────────────────────────────────── */

  function isMenuPage() {
    return !!document.querySelector('.food_grid');
  }

  function esc(str) {
    return str.replace(/[&<>"']/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
    );
  }

  function highlight(text, query) {
    if (!query) return esc(text);
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return esc(text).replace(re, '<mark>$1</mark>');
  }

  function match(text, q) {
    return text.toLowerCase().includes(q.toLowerCase());
  }

  /* ── DROPDOWN ───────────────────────────────── */

  const DROPDOWN_CSS = `
    .fh-search-wrap { position: relative; }

    .fh-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      width: clamp(280px, 90vw, 420px);
      background: #fff;
      border: 1px solid #e5e0d8;
      border-radius: 14px;
      box-shadow: 0 16px 48px rgba(0,0,0,.18);
      z-index: 99999;
      overflow: hidden;
      animation: fhDropIn .18s cubic-bezier(.4,0,.2,1);
    }
    @keyframes fhDropIn {
      from { opacity:0; transform:translateY(-6px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .fh-drop-section-label {
      padding: .45rem 1rem .3rem;
      font-size: .62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: #c8602a;
      background: #fdf3ec;
      border-top: 1px solid #f0ebe4;
    }
    .fh-drop-section-label:first-child { border-top: none; }

    .fh-drop-item {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: .65rem 1rem;
      cursor: pointer;
      text-decoration: none;
      transition: background .15s;
      border-bottom: 1px solid #f5f2ee;
    }
    .fh-drop-item:last-child { border-bottom: none; }
    .fh-drop-item:hover, .fh-drop-item.fh-focused {
      background: #fdf3ec;
    }

    .fh-drop-thumb {
      width: 40px; height: 40px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
      background: #f0ede8;
    }
    .fh-drop-icon {
      width: 40px; height: 40px;
      border-radius: 8px;
      background: #f0ede8;
      display: flex; align-items: center; justify-content: center;
      color: #c8602a; font-size: .9rem; flex-shrink: 0;
    }

    .fh-drop-text { flex: 1; min-width: 0; }
    .fh-drop-name {
      font-family: 'DM Serif Display', 'Cormorant Garamond', serif;
      font-size: .9rem;
      color: #1a1a18;
      line-height: 1.2;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .fh-drop-name mark {
      background: none;
      color: #c8602a;
      font-style: italic;
    }
    .fh-drop-sub {
      font-family: 'DM Sans', 'Montserrat', sans-serif;
      font-size: .72rem;
      color: #7a7870;
      margin-top: 1px;
    }
    .fh-drop-price {
      font-family: 'DM Serif Display', 'Cormorant Garamond', serif;
      font-size: .88rem;
      color: #c8602a;
      white-space: nowrap;
    }

    .fh-drop-empty {
      padding: 1.1rem 1rem;
      text-align: center;
      font-family: 'DM Sans', 'Montserrat', sans-serif;
      font-size: .85rem;
      color: #a0998f;
    }
    .fh-drop-footer {
      padding: .55rem 1rem;
      border-top: 1px solid #f0ebe4;
      background: #faf8f5;
      text-align: center;
      font-family: 'DM Sans', 'Montserrat', sans-serif;
      font-size: .75rem;
      color: #7a7870;
    }
    .fh-drop-footer a {
      color: #c8602a;
      text-decoration: none;
      font-weight: 600;
    }
    .fh-drop-footer a:hover { text-decoration: underline; }
  `;

  function injectStyles(css, id) {
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildDropdown(query, anchor) {
    const q = query.trim();
    let html = '';
    let total = 0;

    /* Foods */
    const foods = FOOD_ITEMS.filter(f =>
      match(f.name, q) || match(f.category, q)
    ).slice(0, 5);

    if (foods.length) {
      html += `<div class="fh-drop-section-label"><i class="fa-solid fa-utensils"></i> Food & Drinks</div>`;
      foods.forEach(f => {
        const url = `foodmenu.html?q=${encodeURIComponent(f.name)}`;
        html += `
          <a class="fh-drop-item" href="${url}">
            <img class="fh-drop-thumb" src="${esc(f.img)}" alt="${esc(f.name)}" onerror="this.style.display='none'">
            <div class="fh-drop-text">
              <div class="fh-drop-name">${highlight(f.name, q)}</div>
              <div class="fh-drop-sub">${esc(f.category)}</div>
            </div>
            <span class="fh-drop-price">${esc(f.price)}</span>
          </a>`;
      });
      total += foods.length;
    }

    /* Pages */
    const pages = PAGES.filter(p => match(p.name, q) || match(p.desc, q));
    if (pages.length) {
      html += `<div class="fh-drop-section-label"><i class="fa-solid fa-file-lines"></i> Pages</div>`;
      pages.forEach(p => {
        html += `
          <a class="fh-drop-item" href="${p.url}">
            <div class="fh-drop-icon"><i class="fa-solid ${esc(p.icon)}"></i></div>
            <div class="fh-drop-text">
              <div class="fh-drop-name">${highlight(p.name, q)}</div>
              <div class="fh-drop-sub">${esc(p.desc)}</div>
            </div>
          </a>`;
      });
      total += pages.length;
    }

    /* Chefs */
    const chefs = CHEFS.filter(c => match(c.name, q) || match(c.desc, q));
    if (chefs.length) {
      html += `<div class="fh-drop-section-label"><i class="fa-solid fa-hat-chef"></i> Chefs</div>`;
      chefs.forEach(c => {
        html += `
          <a class="fh-drop-item" href="${c.page}">
            <div class="fh-drop-icon"><i class="fa-solid fa-user-tie"></i></div>
            <div class="fh-drop-text">
              <div class="fh-drop-name">${highlight(c.name, q)}</div>
              <div class="fh-drop-sub">${esc(c.desc)}</div>
            </div>
          </a>`;
      });
      total += chefs.length;
    }

    if (total === 0) {
      html = `<div class="fh-drop-empty">No results for "<strong>${esc(q)}</strong>"</div>`;
    }

    const menuLink = isMenuPage()
      ? ''
      : `<div class="fh-drop-footer">Browsing food? <a href="foodmenu.html">See full menu →</a></div>`;

    const drop = document.createElement('div');
    drop.className = 'fh-dropdown';
    drop.innerHTML = html + menuLink;
    return drop;
  }

  /* ── MENU GRID FILTER ───────────────────────── */

  function filterMenuGrid(query) {
    const cards = document.querySelectorAll('.food_grid .food');
    const q = query.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const cat  = (card.dataset.category || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const show = !q || name.includes(q) || cat.includes(q) || desc.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    /* Show/hide empty state */
    let emptyEl = document.getElementById('fh-menu-empty');
    if (!emptyEl) {
      emptyEl = document.createElement('p');
      emptyEl.id = 'fh-menu-empty';
      emptyEl.style.cssText =
        'grid-column:1/-1;text-align:center;padding:3rem 1rem;font-family:"DM Sans","Montserrat",sans-serif;color:#7a7870;font-size:.95rem;';
      document.querySelector('.food_grid').appendChild(emptyEl);
    }
    emptyEl.style.display = (q && visible === 0) ? 'block' : 'none';
    emptyEl.textContent   = `No dishes found for "${query}". Try a different keyword.`;
  }

  /* ── URL PARAM AUTO-FILTER ──────────────────── */

  function applyUrlFilter() {
    if (!isMenuPage()) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (!q) return;
    filterMenuGrid(q);
    /* Pre-fill all search inputs */
    document.querySelectorAll('.search input[type="search"]').forEach(inp => inp.value = q);
  }

  /* ── BIND SEARCH INPUTS ─────────────────────── */

  function bindInput(input) {
    /* Wrap in relative container for dropdown positioning */
    const parent = input.closest('.search');
    if (parent && !parent.classList.contains('fh-search-wrap')) {
      parent.classList.add('fh-search-wrap');
      parent.style.position = 'relative';
    }

    let dropdown = null;
    let debounceTimer = null;

    function removeDropdown() {
      if (dropdown && dropdown.parentNode) dropdown.remove();
      dropdown = null;
    }

    function showDropdown(q) {
      removeDropdown();
      if (!q.trim()) return;
      const container = parent || input.parentElement;
      dropdown = buildDropdown(q, input);
      container.appendChild(dropdown);

      /* Keyboard nav inside dropdown */
      const items = () => dropdown ? [...dropdown.querySelectorAll('.fh-drop-item')] : [];
      let focusIdx = -1;

      input.addEventListener('keydown', function onKey(e) {
        const list = items();
        if (!dropdown) { input.removeEventListener('keydown', onKey); return; }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          focusIdx = Math.min(focusIdx + 1, list.length - 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          focusIdx = Math.max(focusIdx - 1, -1);
        } else if (e.key === 'Enter' && focusIdx >= 0) {
          e.preventDefault();
          list[focusIdx]?.click();
        } else if (e.key === 'Escape') {
          removeDropdown();
          input.removeEventListener('keydown', onKey);
        }
        list.forEach((el, i) => el.classList.toggle('fh-focused', i === focusIdx));
      }, { once: false });
    }

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const q = this.value;

      if (isMenuPage()) filterMenuGrid(q);

      debounceTimer = setTimeout(() => showDropdown(q), 180);
    });

    /* Submit = navigate to menu with query */
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        if (isMenuPage()) { filterMenuGrid(q); return; }
        window.location.href = `foodmenu.html?q=${encodeURIComponent(q)}`;
      });
    } else {
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        const q = input.value.trim();
        if (!q) return;
        if (isMenuPage()) { filterMenuGrid(q); removeDropdown(); return; }
        window.location.href = `foodmenu.html?q=${encodeURIComponent(q)}`;
      });
    }

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!dropdown) return;
      if (!dropdown.contains(e.target) && e.target !== input) removeDropdown();
    });

    /* Clear filter when input is emptied */
    input.addEventListener('input', function () {
      if (!this.value && isMenuPage()) filterMenuGrid('');
    });
  }

  /* ── INIT ───────────────────────────────────── */

  function init() {
    injectStyles(DROPDOWN_CSS, 'fh-search-styles');

    document.querySelectorAll('.search input[type="search"]').forEach(bindInput);

    /* Apply ?q= param on page load */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyUrlFilter);
    } else {
      applyUrlFilter();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();