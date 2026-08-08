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
    mapsHtml = `<a href="${branch.mapsLink}" class="branch-btn branch-btn-maps" target="_blank" rel="noopener noreferrer">🗺️ ${resolvedMapsBtn}</a>`;
  }
  
  resultBox.innerHTML = `
    <div class="branch-card head-office single-branch-card">
      <div class="branch-tag ${branch.tag === "Head Office" ? "ho" : "branch"}">${resolvedTag}</div>
      <div class="branch-city">${branch.city}</div>
      <div class="branch-state">${branch.state} ${branch.tag === "Head Office" ? "— Main Office" : ""}</div>
      <p class="branch-address-txt">${branch.address}</p>
      <div class="branch-manager-info">
        🧑‍💼 ${resolvedManagerLabel}: <span class="branch-manager-name">${branch.manager}</span>
      </div>
      <div class="branch-actions">
        <a href="tel:${branch.phone}" class="branch-btn branch-btn-call">📞 ${resolvedCallBtn}</a>
        <a href="${branch.waLink}" class="branch-btn branch-btn-wa" target="_blank" rel="noopener noreferrer">💬 ${resolvedWaBtn}</a>
        ${mapsHtml}
      </div>
    </div>
  `;
}


export { initBranchLocator, updateCityDropdown, filterBranches };
