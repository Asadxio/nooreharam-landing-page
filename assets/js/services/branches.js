import { branchesData } from '../config/branches.data.js';
import { translations } from '../config/translations.js';

// Branch Locator Service
function initBranchLocator() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const stateSel = document.getElementById("stateFilter");
  const citySel = document.getElementById("cityFilter");
  if (!stateSel || !citySel) return;
  
  const states = ["all", ...new Set(branchesData.map(b => b.state))];
  
  stateSel.innerHTML = "";
  states.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s === "all" ? (translations[lang]["branches.all.states"] || "All States") : s;
    stateSel.appendChild(opt);
  });
  
  updateCityDropdown();
  filterBranches();
}

function updateCityDropdown() {
  const stateSel = document.getElementById("stateFilter");
  const citySel = document.getElementById("cityFilter");
  if (!stateSel || !citySel) return;
  
  const selectedState = stateSel.value;
  
  let cities = [];
  if (selectedState === "all") {
    cities = branchesData.map(b => b.city);
  } else {
    cities = branchesData.filter(b => b.state === selectedState).map(b => b.city);
  }
  
  citySel.innerHTML = "";
  cities.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    citySel.appendChild(opt);
  });
}

function filterBranches() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const citySel = document.getElementById("cityFilter");
  const resultBox = document.getElementById("branchLocatorResult");
  if (!citySel || !resultBox) return;
  
  const selectedCity = citySel.value;
  const branch = branchesData.find(b => b.city === selectedCity);
  
  if (!branch) {
    resultBox.innerHTML = "<p class='text-center'>No branch details found.</p>";
    return;
  }
  
  const t = translations[lang];
  const resolvedTag = t[branch.tagKey] || branch.tag;
  const resolvedCallBtn = t["branches.call"] || "Call Manager";
  const resolvedWaBtn = t["branches.wa"] || "Chat on WhatsApp";
  const resolvedMapsBtn = t["branches.directions"] || "Get Directions";
  const resolvedManagerLabel = t["branches.manager"] || "Branch Manager";
  
  let mapsHtml = "";
  if (branch.mapsLink) {
    mapsHtml = `<a href="${branch.mapsLink}" class="branch-btn branch-btn-maps" target="_blank" rel="noopener noreferrer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg> ${resolvedMapsBtn}</a>`;
  }
  
  resultBox.innerHTML = `
    <div class="branch-card head-office single-branch-card">
      <div class="branch-tag ${branch.tag === "Head Office" ? "ho" : "branch"}">${resolvedTag}</div>
      <div class="branch-city">${branch.city}</div>
      <div class="branch-state">${branch.state} ${branch.tag === "Head Office" ? "— Main Office" : ""}</div>
      <p class="branch-address-txt">${branch.address}</p>
      <div class="branch-manager-info">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${resolvedManagerLabel}: <span class="branch-manager-name">${branch.manager}</span>
      </div>
      <div class="branch-actions">
        <a href="tel:${branch.phone}" class="branch-btn branch-btn-call"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> ${resolvedCallBtn}</a>
        <a href="${branch.waLink}" class="branch-btn branch-btn-wa" target="_blank" rel="noopener noreferrer"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.43 0 .06 5.37.06 11.98c0 2.11.55 4.17 1.6 6L0 24l6.2-1.63a11.95 11.95 0 0 0 5.84 1.51h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-1.25-6.21-3.51-8.42zM12.05 21.88a9.92 9.92 0 0 1-5.06-1.39l-.36-.22-3.76.99 1-3.66-.24-.38a9.92 9.92 0 0 1-1.52-5.24c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 0 1 2.91 7.03c0 5.48-4.46 9.9-9.95 9.9zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51s1.07 2.92 1.22 3.12c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg> ${resolvedWaBtn}</a>
        ${mapsHtml}
      </div>
    </div>
  `;
}


export { initBranchLocator, updateCityDropdown, filterBranches };
