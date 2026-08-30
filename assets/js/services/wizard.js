import { translations } from '../config/translations.js';

// Checklist Wizard Service
// ── DOCUMENT CHECKLIST WIZARD LOGIC ──
let wizardState = {
  journey: "umrah",
  residency: "indian",
  profile: "male"
};
let currentWizardStep = 1;

export function getCurrentWizardStep() {
  return currentWizardStep;
}

function selectWizardOption(category, value, el) {
  wizardState[category] = value;
  
  const cards = el.parentNode.querySelectorAll(".wizard-option-card");
  cards.forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
}

function navigateWizard(direction) {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  if (direction === 1 && currentWizardStep < 3) {
    document.getElementById(`wizContent${currentWizardStep}`).style.display = "none";
    document.getElementById(`wizStep${currentWizardStep}`).classList.remove("active");
    document.getElementById(`wizStep${currentWizardStep}`).classList.add("completed");
    
    currentWizardStep++;
    
    document.getElementById(`wizContent${currentWizardStep}`).style.display = "block";
    document.getElementById(`wizStep${currentWizardStep}`).classList.add("active");
    
    document.getElementById("wizBtnPrev").style.display = "inline-block";
    if (currentWizardStep === 3) {
      document.getElementById("wizBtnNext").textContent = translations[lang]["wizard.btn.generate"] || "Generate Checklist";
    }
  } else if (direction === 1 && currentWizardStep === 3) {
    document.getElementById("wizContent3").style.display = "none";
    document.getElementById("wizStep3").classList.remove("active");
    document.getElementById("wizStep3").classList.add("completed");
    
    currentWizardStep = 4;
    
    renderChecklist();
    document.getElementById("wizContentResult").style.display = "block";
    document.getElementById("wizBtnPrev").style.display = "none";
    document.getElementById("wizBtnNext").style.display = "none";
    document.getElementById("wizBtnReset").style.display = "inline-block";
  } else if (direction === -1 && currentWizardStep > 1) {
    document.getElementById(`wizContent${currentWizardStep}`).style.display = "none";
    document.getElementById(`wizStep${currentWizardStep}`).classList.remove("active");
    
    currentWizardStep--;
    
    document.getElementById(`wizContent${currentWizardStep}`).style.display = "block";
    document.getElementById(`wizStep${currentWizardStep}`).classList.remove("completed");
    document.getElementById(`wizStep${currentWizardStep}`).classList.add("active");
    
    if (currentWizardStep === 1) {
      document.getElementById("wizBtnPrev").style.display = "none";
    }
    document.getElementById("wizBtnNext").textContent = translations[lang]["wizard.btn.next"] || "Next Step";
  }
}

function resetWizard() {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  document.getElementById("wizContentResult").style.display = "none";
  document.getElementById("wizBtnReset").style.display = "none";
  
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`wizStep${i}`).classList.remove("active", "completed");
    document.getElementById(`wizContent${i}`).style.display = "none";
  }
  
  currentWizardStep = 1;
  
  document.getElementById("wizContent1").style.display = "block";
  document.getElementById("wizStep1").classList.add("active");
  
  document.getElementById("wizBtnPrev").style.display = "none";
  document.getElementById("wizBtnNext").style.display = "inline-block";
  document.getElementById("wizBtnNext").textContent = translations[lang]["wizard.btn.next"] || "Next Step";
  
  wizardState = { journey: "umrah", residency: "indian", profile: "male" };
  
  document.querySelectorAll(".wizard-content-step").forEach(step => {
    const cards = step.querySelectorAll(".wizard-option-card");
    if (cards.length > 0) {
      cards.forEach(c => c.classList.remove("selected"));
      cards[0].classList.add("selected");
    }
  });
}

function renderChecklist() {
  const listContainer = document.getElementById("wizardChecklistItems");
  if (!listContainer) return;
  
  const items = [];
  const isHajj = wizardState.journey === "hajj";
  const res = wizardState.residency;
  const prof = wizardState.profile;
  
  const t = translations[currentLang] || {};
  if (res === "indian") {
    items.push(t["wiz.checklist.passport.indian"] || "Valid Indian Passport with at least 6 months validity from the date of travel and 2 blank pages.");
  } else if (res === "nri") {
    items.push(t["wiz.checklist.passport.nri"] || "Valid Foreign Passport (6+ months validity) + OCI Card Copy or valid Indian Visa / Resident Permit.");
  } else {
    items.push(t["wiz.checklist.passport.foreign"] || "Valid Passport (6+ months validity) + Residency proof/Visa documents matching Saudi Ministry rules.");
  }
  
  if (isHajj) {
    items.push(t["wiz.checklist.photo.hajj"] || "10 Passport size photographs (4cm x 6cm) with a pure white background, 80% face coverage, no glasses/headgear (except hijab for women).");
  } else {
    items.push(t["wiz.checklist.photo.umrah"] || "4 Passport size photographs (4cm x 6cm) with a pure white background, 80% face coverage, ears visible, no shadows.");
  }
  
  items.push(t["wiz.checklist.vaccine.meningitis"] || "Meningitis ACWY Vaccination Certificate (mandatory, must be taken at least 10 days before travel).");
  items.push(t["wiz.checklist.vaccine.polio"] || "Polio Vaccination Certificate (mandatory for travelers coming from polio-endemic regions).");
  items.push(t["wiz.checklist.vaccine.covid"] || "COVID-19 vaccination per current Saudi Ministry guidelines (if applicable).");
  
  if (prof === "female_under45") {
    if (isHajj) {
      items.push(t["wiz.checklist.mahram.female.under45.hajj"] || "Mandatory Mahram (male guardian) passport, details, and proof of relationship. Under 45, ladies are required to travel with a Mahram for Hajj.");
    } else {
      items.push(t["wiz.checklist.mahram.female.under45.umrah"] || "Mahram is highly recommended. For Umrah groups, women under 45 can now travel in organized sister groups under specific Saudi Ministry guidelines (NOC required).");
    }
  } else if (prof === "female_over45") {
    items.push(t["wiz.checklist.mahram.female.over45"] || "No Objection Certificate (NOC) from Mahram or declaration if traveling alone in an organized group (Saudi Arabia permits females 45+ without Mahram in registered groups).");
  } else {
    if (isHajj) {
      items.push(t["wiz.checklist.mahram.male.hajj"] || "Hajj Committee/Private Tour authorization certificate. If traveling as a Mahram for female relatives, relationship proof is mandatory.");
    }
  }
  
  if (isHajj) {
    items.push(t["wiz.checklist.doc.hajj.extra1"] || "Medical Fitness Certificate signed by a registered government medical officer.");
    items.push(t["wiz.checklist.doc.hajj.extra2"] || "Proof of Hajj booking quota registration and payment receipt.");
  } else {
    items.push(t["wiz.checklist.doc.umrah.extra1"] || "Confirmed return flight tickets (airline booking copy).");
    items.push(t["wiz.checklist.doc.umrah.extra2"] || "Confirmed hotel voucher (accommodation details in Makkah & Madinah).");
  }
  
  listContainer.innerHTML = `
    <div class="checklist-progress-bar-wrap mb-16">
      <div class="u-flex u-justify-between text-xs font-medium mb-4">
        <span>Packing Progress: <strong id="checklistPercentText">0%</strong></span>
        <span id="checklistCountText">0 / ${items.length} Prepared</span>
      </div>
      <div class="checklist-progress-container">
        <div class="checklist-progress-fill" id="checklistProgressFill" style="width: 0%;"></div>
      </div>
    </div>
  `;

  const savedState = JSON.parse(localStorage.getItem('nh_checklist_state') || '{}');

  function updateProgress() {
    const checkboxes = listContainer.querySelectorAll('.checklist-checkbox');
    const checkedCount = listContainer.querySelectorAll('.checklist-checkbox:checked').length;
    const percent = Math.round((checkedCount / checkboxes.length) * 100) || 0;
    
    const fill = document.getElementById('checklistProgressFill');
    const percentTxt = document.getElementById('checklistPercentText');
    const countTxt = document.getElementById('checklistCountText');
    if (fill) fill.style.width = percent + '%';
    if (percentTxt) percentTxt.textContent = percent + '%';
    if (countTxt) countTxt.textContent = `${checkedCount} / ${checkboxes.length} Prepared`;
  }

  items.forEach((item, idx) => {
    const isChecked = savedState[idx] || false;
    const div = document.createElement("div");
    div.className = "checklist-item u-flex u-align-center u-gap-12 mb-8";
    div.innerHTML = `
      <input type="checkbox" class="checklist-checkbox" id="chk_${idx}" ${isChecked ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;accent-color:#0f6e56;">
      <label for="chk_${idx}" style="cursor:pointer;flex:1;margin:0;font-size:14px;color:#334155;">${item}</label>
    `;
    
    const chk = div.querySelector('.checklist-checkbox');
    chk.addEventListener('change', () => {
      const currentState = JSON.parse(localStorage.getItem('nh_checklist_state') || '{}');
      currentState[idx] = chk.checked;
      localStorage.setItem('nh_checklist_state', JSON.stringify(currentState));
      updateProgress();
    });

    listContainer.appendChild(div);
  });

  updateProgress();
}

function getChecklistText() {
  const listContainer = document.getElementById("wizardChecklistItems");
  if (!listContainer) return "";
  
  const items = listContainer.querySelectorAll(".checklist-item div");
  let text = `NOOR-E-HARAM - CUSTOM CHECKLIST\n`;
  text += `Journey: ${wizardState.journey.toUpperCase()} | Residency: ${wizardState.residency.toUpperCase()} | Traveler: ${wizardState.profile.toUpperCase()}\n\n`;
  
  items.forEach((item, idx) => {
    text += `${idx + 1}. [ ] ${item.textContent}\n`;
  });
  
  return text;
}

function copyWizardChecklist() {
  const text = getChecklistText().replace(/\\n/g, "\n").replace(/\n/g, "\n");
  const formattedText = text.replace(/\\n/g, "\n").replace(/\n/g, "\n").split("\n").join("\n");
  
  // A clean trick to resolve \n backslash escaping inside the string literals
  const realText = getChecklistText().replace(/\n/g, "\n").replace(/\\n/g, "\n");
  
  navigator.clipboard.writeText(realText.replace(/\n/g, "\n")).then(() => {
    const btn = document.getElementById("wizBtnCopy");
    const oldText = btn.textContent;
    btn.textContent = translations[currentLang]["wizard.copied"] || "Copied!";
    setTimeout(() => { btn.textContent = oldText; }, 2000);
  }).catch(err => {
    alert("Failed to copy text: " + err);
  });
}

function shareWizardWhatsApp() {
  const text = getChecklistText();
  const intro = `Assalamu Alaikum. I generated a travel checklist on your website for my ${wizardState.journey.toUpperCase()} trip. Details:\n`;
  const fullMsg = intro + text + `\nPlease assist me with visa processing and package guidance.`;
  const encoded = encodeURIComponent(fullMsg.replace(/\\n/g, "\n").replace(/\n/g, "\n"));
  const realEncoded = encodeURIComponent(fullMsg.split("\n").join("\n"));
  window.open(`https://wa.me/919986925592?text=${realEncoded}`, "_blank");
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initTheme === 'function') initTheme();
  if (typeof setLang === 'function') setLang(currentLang);
  if (typeof initBranchLocator === 'function') initBranchLocator();
  if (typeof resetWizard === 'function') resetWizard();
  if (typeof calculateCost === 'function') calculateCost();

  // Close lang dropdown on outside click
  document.addEventListener('click', e => {
    const switcher = document.querySelector('.lang-switcher');
    if (switcher && !switcher.contains(e.target)) switcher.classList.remove('open');
  });
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelector('.lang-switcher').classList.toggle('open');
  });

  // Toggle nav dropdown on click/tap
  const navItem = document.querySelector('.nav-item');
  if (navItem) {
    const navLink = navItem.querySelector('a');
    if (navLink) {
      navLink.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        navItem.classList.toggle('open');
      });
    }
    const ddItems = navItem.querySelectorAll('.nav-dd-item');
    ddItems.forEach(item => {
      item.addEventListener('click', () => {
        navItem.classList.remove('open');
      });
    });
  }

  // Close nav dropdown on outside click
  document.addEventListener('click', e => {
    const navItem = document.querySelector('.nav-item');
    if (navItem && !navItem.contains(e.target)) {
      navItem.classList.remove('open');
    }
  });
});



export { selectWizardOption, navigateWizard, resetWizard, renderChecklist, copyWizardChecklist, shareWizardWhatsApp };
