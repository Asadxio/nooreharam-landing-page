// FAQ Accordion UI Controller & Live Search
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function initFaqSearch() {
  const searchInput = document.getElementById('faqSearchInput');
  const categoryPills = document.querySelectorAll('.faq-cat-pill');
  const items = document.querySelectorAll('.faq-item');
  const countEl = document.getElementById('faqMatchCount');

  if (!searchInput || !items.length) return;

  let activeCategory = 'all';

  function applyFilter() {
    const query = (searchInput.value || '').trim().toLowerCase();
    let matchCount = 0;

    items.forEach(item => {
      const qText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
      const aText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
      const category = item.dataset.category || 'general';

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !query || qText.includes(query) || aText.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (countEl) {
      if (query || activeCategory !== 'all') {
        countEl.textContent = `Showing ${matchCount} matching question${matchCount === 1 ? '' : 's'}`;
        countEl.style.display = 'block';
      } else {
        countEl.style.display = 'none';
      }
    }
  }

  searchInput.addEventListener('input', applyFilter);

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      applyFilter();
    });
  });
}

// Global hook
if (typeof window !== 'undefined') {
  window.toggleFaq = toggleFaq;
}

export { toggleFaq, initFaqSearch };
