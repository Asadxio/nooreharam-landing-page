const fs = require('fs');

let code = fs.readFileSync('scripts/build_departures_page.js', 'utf8');

// 1. Add data-start-date attribute to departure-card
if (!code.includes('data-start-date=')) {
  code = code.replace(
    `<article class="departure-card \${isPast ? 'departure-card--past' : ''}"`,
    `<article class="departure-card \${isPast ? 'departure-card--past' : ''}" \n               data-start-date="\${d.startDate}"`
  );
}

// 2. Add browser-side dynamic date expiry check to the client JS engine
const oldInit = `      var cards = document.querySelectorAll('.departure-card');`;
const newInit = `      var cards = document.querySelectorAll('.departure-card');
      
      // Dynamic browser-side expiry check against visitor's local date
      var todayStr = new Date().toISOString().split('T')[0];
      cards.forEach(function(card) {
        var sDate = card.getAttribute('data-start-date');
        if (sDate && sDate < todayStr) {
          card.classList.add('departure-card--past');
          card.setAttribute('data-status', 'departed');
          var tag = card.querySelector('.dep-urgency-tag');
          if (tag) {
            tag.textContent = 'Departed / Closed';
            tag.style.background = '#e2e8f0';
            tag.style.color = '#64748b';
            tag.style.borderColor = '#cbd5e1';
          }
          var bookBtn = card.querySelector('.dep-book-btn');
          if (bookBtn) {
            bookBtn.textContent = 'Departure Closed';
            bookBtn.style.background = '#94a3b8';
            bookBtn.style.pointerEvents = 'none';
            bookBtn.removeAttribute('href');
          }
        }
      });`;

if (!code.includes('Dynamic browser-side expiry check')) {
  code = code.replace(oldInit, newInit);
}

fs.writeFileSync('scripts/build_departures_page.js', code, 'utf8');
console.log('✅ Updated scripts/build_departures_page.js with data-start-date and browser-side expiry engine');
