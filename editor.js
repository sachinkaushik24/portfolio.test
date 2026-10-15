/**
 * ====================================================================
 * SACHIN KAUSHIK - PRIVATE IN-BROWSER PORTFOLIO EDITOR
 * Restricted strictly to Sachin Kaushik via Secret PIN Authentication.
 * Never exposed or visible to external visitors.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initSecurityAndEditor();
});

let workingData = null;

function initSecurityAndEditor() {
  const pinModal = document.getElementById('adminPinModal');
  const pinForm = document.getElementById('adminPinForm');
  const pinInput = document.getElementById('adminPinInput');
  const pinErrorMsg = document.getElementById('pinErrorMsg');
  const cancelPinBtn = document.getElementById('cancelPinBtn');

  const editorModal = document.getElementById('editorModal');
  const closeEditorBtn = document.getElementById('closeEditorBtn');
  const tabBtns = document.querySelectorAll('.modal-tab-btn');
  const tabPanes = document.querySelectorAll('.editor-tab-pane');

  const applyBtn = document.getElementById('applyEditorChangesBtn');
  const exportBtn = document.getElementById('exportEditorFileBtn');
  const resetBtn = document.getElementById('resetEditorDefaultsBtn');

  const lockAdminBtn = document.getElementById('lockAdminBtn');
  const reopenEditorBtn = document.getElementById('reopenEditorBtn');

  // Check if owner is already authenticated in this browser session
  const isSessionAuth = sessionStorage.getItem('sachin_admin_authenticated') === 'true';
  if (isSessionAuth) {
    document.body.classList.add('is-admin');
  }

  // Helper to open PIN prompt
  function requestAdminAccess() {
    if (sessionStorage.getItem('sachin_admin_authenticated') === 'true') {
      openEditor();
      return;
    }
    pinModal.classList.add('open');
    pinInput.value = '';
    pinErrorMsg.textContent = '';
    pinInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closePinModal() {
    pinModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cancelPinBtn) cancelPinBtn.addEventListener('click', closePinModal);
  pinModal?.addEventListener('click', (e) => {
    if (e.target === pinModal) closePinModal();
  });

  // Verify Security PIN
  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();
      const currentData = getPortfolioData();
      const validPin = (currentData.security && currentData.security.adminPin) ? String(currentData.security.adminPin) : "2404";

      if (enteredPin === validPin) {
        sessionStorage.setItem('sachin_admin_authenticated', 'true');
        document.body.classList.add('is-admin');
        closePinModal();
        openEditor();
        showToast("Owner authenticated. Welcome Sachin!");
      } else {
        pinErrorMsg.textContent = "Access Denied: Invalid Security PIN";
        pinInput.classList.remove('shake');
        void pinInput.offsetWidth; // trigger reflow
        pinInput.classList.add('shake');
        pinInput.select();
      }
    });
  }

  // Open full Editor
  function openEditor() {
    workingData = JSON.parse(JSON.stringify(getPortfolioData()));
    populateEditorFields(workingData);
    editorModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeEditor() {
    editorModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeEditorBtn) closeEditorBtn.addEventListener('click', closeEditor);
  editorModal?.addEventListener('click', (e) => {
    if (e.target === editorModal) closeEditor();
  });

  // Reopen editor button on the authenticated owner bar
  if (reopenEditorBtn) reopenEditorBtn.addEventListener('click', openEditor);

  // Lock and exit owner mode
  if (lockAdminBtn) {
    lockAdminBtn.addEventListener('click', () => {
      sessionStorage.removeItem('sachin_admin_authenticated');
      document.body.classList.remove('is-admin');
      closeEditor();
      showToast("Owner mode locked.");
    });
  }

  // ----------------------------------------------------
  // SECRET TRIGGERS (Restricted to Sachin only)
  // ----------------------------------------------------

  // Trigger 1: Secret keyboard shortcut: Ctrl + Shift + E (or Cmd + Shift + E)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      requestAdminAccess();
    }
  });

  // Trigger 2: Secret triple-click on the "SK" logo within 1.2 seconds
  const skLogo = document.getElementById('skLogoTrigger');
  if (skLogo) {
    let clickCount = 0;
    let clickTimer = null;
    skLogo.addEventListener('click', (e) => {
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 1200);
      } else if (clickCount >= 3) {
        e.preventDefault();
        clearTimeout(clickTimer);
        clickCount = 0;
        requestAdminAccess();
      }
    });
  }

  // Trigger 3: URL Query parameter (?admin=true, ?edit=true, or #admin)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('admin') || urlParams.has('edit') || window.location.hash === '#admin') {
    requestAdminAccess();
  }

  // ----------------------------------------------------
  // Editor Tabs & Actions
  // ----------------------------------------------------
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(`tabPane-${targetTab}`);
      if (pane) pane.classList.add('active');
    });
  });

  // Apply Changes Live
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      syncFormDataToWorkingData();
      localStorage.setItem('sachin_portfolio_data', JSON.stringify(workingData));
      renderPortfolio(workingData);
      initTypingEffect(workingData.personal.roles);
      closeEditor();
      showToast("Portfolio updated successfully!");
    });
  }

  // Export updated profile-data.js
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      syncFormDataToWorkingData();
      const codeString = `/**
 * ====================================================================
 * SACHIN KAUSHIK - PORTFOLIO CONFIGURATION DATA
 * Generated from In-Browser Editor
 * ====================================================================
 */

const PORTFOLIO_DATA = ${JSON.stringify(workingData, null, 2)};

if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
`;
      const blob = new Blob([codeString], { type: 'application/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profile-data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Downloaded profile-data.js! Overwrite your folder file with this.");
    });
  }

  // Reset to original defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset all changes to initial default data?")) {
        localStorage.removeItem('sachin_portfolio_data');
        workingData = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA));
        renderPortfolio(workingData);
        initTypingEffect(workingData.personal.roles);
        populateEditorFields(workingData);
        closeEditor();
        showToast("Reset to default configuration.");
      }
    });
  }

  // Add Item Buttons
  document.getElementById('addEducationItemBtn')?.addEventListener('click', addEducationRow);
  document.getElementById('addProjectItemBtn')?.addEventListener('click', addProjectRow);
  document.getElementById('addAchievementItemBtn')?.addEventListener('click', addAchievementRow);
}

// ----------------------------------------------------
// Form Population & Syncing
// ----------------------------------------------------
function populateEditorFields(data) {
  const p = data.personal;
  const c = data.contact;
  const sec = data.security || {};

  setVal('editFullName', p.fullName);
  setVal('editTitle', p.title);
  setVal('editStatusBadge', p.statusBadge);
  setVal('editInstitution', p.institution);
  setVal('editShortBio', p.bio || p.tagline);
  setVal('editAboutDetailed', (p.aboutDetailed || []).join('\n\n'));
  setVal('editResumeUrl', p.resumeUrl);

  setVal('editPhone', c.phone);
  setVal('editPhoneRaw', c.phoneRaw);
  setVal('editEmail', c.email);
  setVal('editLocation', c.location);
  setVal('editGithub', c.github);
  setVal('editLinkedin', c.linkedin);

  // Security PIN
  setVal('editAdminPin', sec.adminPin || '2404');

  // Rows
  renderEditorEducationRows(data.education || []);
  renderEditorProjectRows(data.projects || []);
  renderEditorAchievementRows(data.achievements || []);
}

function syncFormDataToWorkingData() {
  if (!workingData) return;

  // Personal
  workingData.personal.fullName = getVal('editFullName') || workingData.personal.fullName;
  workingData.personal.title = getVal('editTitle') || workingData.personal.title;
  workingData.personal.statusBadge = getVal('editStatusBadge') || workingData.personal.statusBadge;
  workingData.personal.institution = getVal('editInstitution') || workingData.personal.institution;
  workingData.personal.bio = getVal('editShortBio') || workingData.personal.bio;
  workingData.personal.tagline = getVal('editShortBio') || workingData.personal.tagline;
  workingData.personal.resumeUrl = getVal('editResumeUrl') || workingData.personal.resumeUrl;

  const aboutText = getVal('editAboutDetailed');
  if (aboutText) {
    workingData.personal.aboutDetailed = aboutText.split('\n\n').map(p => p.trim()).filter(Boolean);
  }

  // Contact
  workingData.contact.phone = getVal('editPhone');
  workingData.contact.phoneRaw = getVal('editPhoneRaw');
  workingData.contact.email = getVal('editEmail');
  workingData.contact.location = getVal('editLocation');
  workingData.contact.github = getVal('editGithub');
  workingData.contact.linkedin = getVal('editLinkedin');

  // Security
  if (!workingData.security) workingData.security = {};
  const newPin = getVal('editAdminPin');
  if (newPin) workingData.security.adminPin = newPin;

  // Education list
  const eduCards = document.querySelectorAll('#editorEducationList .editor-item-card');
  const newEducation = [];
  eduCards.forEach(card => {
    newEducation.push({
      degree: card.querySelector('.edu-degree')?.value || '',
      institution: card.querySelector('.edu-institution')?.value || '',
      period: card.querySelector('.edu-period')?.value || '',
      score: card.querySelector('.edu-score')?.value || '',
      badge: card.querySelector('.edu-badge')?.value || '',
      description: card.querySelector('.edu-desc')?.value || ''
    });
  });
  if (newEducation.length > 0) workingData.education = newEducation;

  // Projects list
  const projCards = document.querySelectorAll('#editorProjectsList .editor-item-card');
  const newProjects = [];
  projCards.forEach(card => {
    const rawTags = card.querySelector('.proj-tags')?.value || '';
    const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);
    newProjects.push({
      title: card.querySelector('.proj-title')?.value || '',
      category: card.querySelector('.proj-category')?.value || 'embedded',
      image: card.querySelector('.proj-image')?.value || '',
      description: card.querySelector('.proj-desc')?.value || '',
      tags: tags,
      github: card.querySelector('.proj-github')?.value || 'https://github.com/sachinkaushik24',
      liveDemo: '#'
    });
  });
  if (newProjects.length > 0) workingData.projects = newProjects;

  // Achievements list
  const achCards = document.querySelectorAll('#editorAchievementsList .editor-item-card');
  const newAchievements = [];
  achCards.forEach(card => {
    newAchievements.push({
      title: card.querySelector('.ach-title')?.value || '',
      issuer: card.querySelector('.ach-issuer')?.value || '',
      image: card.querySelector('.ach-image')?.value || '',
      date: card.querySelector('.ach-date')?.value || '',
      badge: card.querySelector('.ach-badge')?.value || '',
      description: card.querySelector('.ach-desc')?.value || ''
    });
  });
  if (newAchievements.length > 0) workingData.achievements = newAchievements;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ----------------------------------------------------
// Dynamic Card Builders (Education, Projects, Achievements)
// ----------------------------------------------------
function renderEditorEducationRows(items) {
  const list = document.getElementById('editorEducationList');
  if (!list) return;
  list.innerHTML = '';
  items.forEach((item, idx) => {
    list.appendChild(createEducationCard(item, idx));
  });
}

function createEducationCard(item, idx) {
  const div = document.createElement('div');
  div.className = 'editor-item-card';
  div.dataset.index = idx;
  div.innerHTML = `
    <button type="button" class="remove-item-btn remove-edu"><i class="fas fa-trash"></i> Delete</button>
    <div class="editor-grid-2">
      <div class="editor-field">
        <label>Degree / Qualification</label>
        <input type="text" class="edu-degree" value="${escapeHtml(item.degree || '')}" />
      </div>
      <div class="editor-field">
        <label>Institution / School</label>
        <input type="text" class="edu-institution" value="${escapeHtml(item.institution || '')}" />
      </div>
    </div>
    <div class="editor-grid-2">
      <div class="editor-field">
        <label>Period (e.g. 2026 - 2030)</label>
        <input type="text" class="edu-period" value="${escapeHtml(item.period || '')}" />
      </div>
      <div class="editor-field">
        <label>Score / Percentage (e.g. 90.4%)</label>
        <input type="text" class="edu-score" value="${escapeHtml(item.score || '')}" />
      </div>
    </div>
    <div class="editor-field">
      <label>Badge / Tag (e.g. Academic Distinction)</label>
      <input type="text" class="edu-badge" value="${escapeHtml(item.badge || '')}" />
    </div>
    <div class="editor-field">
      <label>Description / Details</label>
      <textarea class="edu-desc" rows="2">${escapeHtml(item.description || '')}</textarea>
    </div>
  `;

  div.querySelector('.remove-edu').addEventListener('click', () => div.remove());
  return div;
}

function addEducationRow() {
  const list = document.getElementById('editorEducationList');
  if (!list) return;
  const newItem = {
    degree: "Degree Name",
    institution: "Institution Name",
    period: "Year - Year",
    score: "Score %",
    badge: "Achievement",
    description: "Details..."
  };
  list.appendChild(createEducationCard(newItem, list.children.length));
}

function renderEditorProjectRows(items) {
  const list = document.getElementById('editorProjectsList');
  if (!list) return;
  list.innerHTML = '';
  items.forEach((item, idx) => {
    list.appendChild(createProjectCard(item, idx));
  });
}

function createProjectCard(item, idx) {
  const div = document.createElement('div');
  div.className = 'editor-item-card';
  div.dataset.index = idx;
  div.innerHTML = `
    <button type="button" class="remove-item-btn remove-proj"><i class="fas fa-trash"></i> Delete</button>
    <div class="editor-grid-2">
      <div class="editor-field">
        <label>Project Title</label>
        <input type="text" class="proj-title" value="${escapeHtml(item.title || '')}" />
      </div>
      <div class="editor-field">
        <label>Category</label>
        <select class="proj-category" style="background:#080c16;border:1px solid var(--border-subtle);color:#fff;padding:0.75rem;border-radius:4px;">
          <option value="iot" ${item.category === 'iot' ? 'selected' : ''}>IoT</option>
          <option value="embedded" ${item.category === 'embedded' ? 'selected' : ''}>Embedded</option>
          <option value="edge-ai" ${item.category === 'edge-ai' ? 'selected' : ''}>Edge AI</option>
          <option value="robotics" ${item.category === 'robotics' ? 'selected' : ''}>Robotics</option>
        </select>
      </div>
    </div>
    <div class="editor-field">
      <label>Description</label>
      <textarea class="proj-desc" rows="2">${escapeHtml(item.description || '')}</textarea>
    </div>
    <div class="editor-grid-2">
      <div class="editor-field">
        <label>Tags (Comma separated)</label>
        <input type="text" class="proj-tags" value="${escapeHtml((item.tags || []).join(', '))}" />
      </div>
      <div class="editor-field">
        <label>GitHub Repository URL</label>
        <input type="text" class="proj-github" value="${escapeHtml(item.github || '')}" />
      </div>
    </div>
    <div class="editor-field">
      <label>Card Background Image URL</label>
      <input type="text" class="proj-image" value="${escapeHtml(item.image || '')}" placeholder="https://..." />
    </div>
  `;

  div.querySelector('.remove-proj').addEventListener('click', () => div.remove());
  return div;
}

function addProjectRow() {
  const list = document.getElementById('editorProjectsList');
  if (!list) return;
  const newItem = {
    title: "New Project",
    category: "embedded",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    description: "Project description...",
    tags: ["ESP32", "C++"],
    github: "https://github.com/sachinkaushik24"
  };
  list.appendChild(createProjectCard(newItem, list.children.length));
}

function renderEditorAchievementRows(items) {
  const list = document.getElementById('editorAchievementsList');
  if (!list) return;
  list.innerHTML = '';
  items.forEach((item, idx) => {
    list.appendChild(createAchievementCard(item, idx));
  });
}

function createAchievementCard(item, idx) {
  const div = document.createElement('div');
  div.className = 'editor-item-card';
  div.dataset.index = idx;
  div.innerHTML = `
    <button type="button" class="remove-item-btn remove-ach"><i class="fas fa-trash"></i> Delete</button>
    <div class="editor-grid-2">
      <div class="editor-field">
        <label>Achievement Title</label>
        <input type="text" class="ach-title" value="${escapeHtml(item.title || '')}" />
      </div>
      <div class="editor-field">
        <label>Issuer / Organization</label>
        <input type="text" class="ach-issuer" value="${escapeHtml(item.issuer || '')}" />
      </div>
    </div>
    <div class="editor-grid-2">
      <div class="editor-field">
        <label>Year / Date</label>
        <input type="text" class="ach-date" value="${escapeHtml(item.date || '')}" />
      </div>
      <div class="editor-field">
        <label>Badge Label</label>
        <input type="text" class="ach-badge" value="${escapeHtml(item.badge || '')}" />
      </div>
    </div>
    <div class="editor-field">
      <label>Description</label>
      <textarea class="ach-desc" rows="2">${escapeHtml(item.description || '')}</textarea>
    </div>
    <div class="editor-field">
      <label>Card Background Image URL</label>
      <input type="text" class="ach-image" value="${escapeHtml(item.image || '')}" placeholder="https://..." />
    </div>
  `;

  div.querySelector('.remove-ach').addEventListener('click', () => div.remove());
  return div;
}

function addAchievementRow() {
  const list = document.getElementById('editorAchievementsList');
  if (!list) return;
  const newItem = {
    title: "New Achievement",
    issuer: "Organization Name",
    date: "2026",
    badge: "Milestone",
    description: "Achievement details..."
  };
  list.appendChild(createAchievementCard(newItem, list.children.length));
}
