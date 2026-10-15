/**
 * ====================================================================
 * SACHIN KAUSHIK - PROFESSIONAL PORTFOLIO MAIN JAVASCRIPT
 * Dynamic renderer, project filter engine, and interactive features
 * ====================================================================
 */

// Retrieve active portfolio configuration
function getPortfolioData() {
  const savedData = localStorage.getItem('sachin_portfolio_data');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      // Migration check to ensure new formal schema is loaded
      if (!parsed.skillCategories || !parsed.security) {
        localStorage.removeItem('sachin_portfolio_data');
        return window.PORTFOLIO_DATA;
      }
      return parsed;
    } catch (e) {
      console.warn("Could not parse stored data, using base configuration.", e);
    }
  }
  return window.PORTFOLIO_DATA;
}

// Clean Toast Notification
function showToast(message, duration = 3000) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--accent-emerald)"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Copy to Clipboard
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label} to clipboard`);
  }).catch(() => {
    showToast(`Failed to copy to clipboard`);
  });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  const data = getPortfolioData();
  renderPortfolio(data);
  initNightSkyCanvas();
  initScrollEffects();
  initContactForm();
});

// Main Rendering Function
function renderPortfolio(data) {
  renderHero(data);
  renderAbout(data);
  renderEducation(data);
  renderSkills(data);
  renderProjects(data);
  renderAchievements(data);
  renderContact(data);
}

// 1. Hero Section
function renderHero(data) {
  const { personal, contact } = data;

  // Status Badge
  const statusEl = document.getElementById('heroStatusBadge');
  if (statusEl) {
    statusEl.innerHTML = `<span class="pulse-dot"></span> ${personal.statusBadge || 'Available for Projects & Research'}`;
  }

  // Name & Title
  const nameEl = document.getElementById('heroName');
  if (nameEl) nameEl.textContent = personal.fullName;

  const titleEl = document.getElementById('heroTitle');
  if (titleEl) titleEl.textContent = personal.title;

  const bioEl = document.getElementById('heroBio');
  if (bioEl) bioEl.textContent = personal.bio || personal.tagline;

  // Engineer Summary Card Specs
  const specDegree = document.getElementById('specDegree');
  if (specDegree) specDegree.textContent = "B.Tech in ECE (2026 — 2030)";

  const specCollege = document.getElementById('specCollege');
  if (specCollege) specCollege.textContent = personal.institution || "JECRC University";

  const specLocation = document.getElementById('specLocation');
  if (specLocation) specLocation.textContent = personal.location || "Jaipur, Rajasthan";

  const specScores = document.getElementById('specScores');
  if (specScores) specScores.textContent = "Class X: 92.17% | Class XII: 90.4%";

  // Resume Button
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.href = personal.resumeUrl || "#";
    if (personal.resumeUrl === "#") {
      resumeBtn.setAttribute('title', 'Add resume.pdf to your folder to activate');
    }
  }

  // Social Links
  const ghLinks = document.querySelectorAll('.link-github');
  ghLinks.forEach(link => link.href = contact.github);

  const liLinks = document.querySelectorAll('.link-linkedin');
  liLinks.forEach(link => link.href = contact.linkedin);
}

// 2. About Section
function renderAbout(data) {
  const { personal, focusAreas } = data;

  const storyContainer = document.getElementById('aboutStory');
  if (storyContainer && personal.aboutDetailed) {
    storyContainer.innerHTML = personal.aboutDetailed
      .map(para => `<p>${para}</p>`)
      .join('');
  }

  // Focus Domains Grid
  const focusContainer = document.getElementById('focusAreasGrid');
  if (focusContainer && focusAreas) {
    const iconMap = {
      microchip: 'fa-microchip',
      wifi: 'fa-wifi',
      brain: 'fa-brain',
      robot: 'fa-robot'
    };

    focusContainer.innerHTML = focusAreas.map(item => `
      <div class="focus-card">
        <div class="focus-icon">
          <i class="fas ${iconMap[item.icon] || 'fa-microchip'}"></i>
        </div>
        <h4 class="focus-title">${item.title}</h4>
        <p class="focus-desc">${item.description}</p>
      </div>
    `).join('');
  }
}

// 3. Education Timeline / Cards
function renderEducation(data) {
  const container = document.getElementById('educationCardsList');
  if (!container || !data.education) return;

  container.innerHTML = data.education.map(item => `
    <div class="edu-card">
      <div class="edu-card-top">
        <div>
          <h3 class="edu-degree">${item.degree}</h3>
          <div class="edu-institution">${item.institution}</div>
        </div>
        <span class="edu-score-pill">${item.score}</span>
      </div>
      <div class="edu-period"><i class="far fa-calendar-alt"></i> ${item.period} &nbsp;&bull;&nbsp; ${item.badge}</div>
      <p class="edu-desc">${item.description}</p>
    </div>
  `).join('');
}

// 4. Technical Skills (Categorized Chips with authentic hardware backdrop)
function renderSkills(data) {
  const container = document.getElementById('skillsCategoriesGrid');
  if (!container || !data.skillCategories) return;

  const categoryIcons = {
    'Microcontrollers & Hardware': 'fa-microchip',
    'Firmware & Programming': 'fa-code',
    'Protocols & IoT': 'fa-network-wired',
    'Tools & Software': 'fa-tools'
  };

  container.innerHTML = data.skillCategories.map(cat => `
    <div class="skill-cat-card card-with-bg" style="background-image: url('${cat.image || ''}');">
      <h3 class="skill-cat-title">
        <i class="fas ${categoryIcons[cat.category] || 'fa-check'}"></i>
        ${cat.category}
      </h3>
      <div class="skill-chips-wrap">
        ${cat.skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// 5. Engineering Projects
let currentProjects = [];
function renderProjects(data) {
  currentProjects = data.projects || [];
  renderFilteredProjects('all');
  initProjectFilterButtons();
}

function renderFilteredProjects(filterCategory) {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  const filtered = filterCategory === 'all'
    ? currentProjects
    : currentProjects.filter(p => p.category === filterCategory || (filterCategory === 'embedded' && (p.category === 'embedded' || p.category === 'iot')));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>No projects in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(proj => `
    <div class="project-item-card card-with-bg" style="background-image: url('${proj.image || ''}');">
      <div>
        <span class="project-category-tag">${proj.category}</span>
        <h3 class="project-item-title">${proj.title}</h3>
        <p class="project-item-desc">${proj.description}</p>
        
        ${proj.hardware && proj.hardware.length ? `
          <div class="project-hardware-row">
            <div class="project-hardware-label">Hardware &amp; Modules</div>
            <div class="project-hardware-chips">
              ${proj.hardware.map(hw => `<span class="hw-chip">${hw}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="project-tags-row">
          ${(proj.tags || []).map(t => `<span class="p-tag">#${t}</span>`).join(' ')}
        </div>
      </div>

      <div class="project-action-links">
        ${proj.github ? `
          <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="p-link-btn">
            <i class="fab fa-github"></i> Repository
          </a>
        ` : ''}
        ${proj.liveDemo && proj.liveDemo !== '#' ? `
          <a href="${proj.liveDemo}" target="_blank" rel="noopener noreferrer" class="p-link-btn" style="color:var(--accent-blue)">
            <i class="fas fa-external-link-alt"></i> Live Demo
          </a>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function initProjectFilterButtons() {
  const filterBtns = document.querySelectorAll('.p-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderFilteredProjects(cat);
    });
  });
}

// 6. Achievements & Distinctions
function renderAchievements(data) {
  const container = document.getElementById('achievementsCardsGrid');
  if (!container || !data.achievements) return;

  container.innerHTML = data.achievements.map(ach => `
    <div class="achievement-item-card card-with-bg" style="background-image: url('${ach.image || ''}');">
      <div class="ach-icon-wrap">
        <i class="fas fa-award"></i>
      </div>
      <div class="ach-content">
        <span class="ach-badge-tag">${ach.badge}</span>
        <h4 class="ach-title">${ach.title}</h4>
        <div class="ach-issuer">${ach.issuer} &bull; ${ach.date}</div>
        <p class="ach-desc">${ach.description}</p>
      </div>
    </div>
  `).join('');
}

// 7. Contact Section
function renderContact(data) {
  const { contact } = data;

  const phoneEl = document.getElementById('contactPhone');
  if (phoneEl) {
    phoneEl.textContent = contact.phone;
    phoneEl.href = `tel:${contact.phoneRaw || '9950436998'}`;
  }

  const emailEl = document.getElementById('contactEmail');
  if (emailEl) {
    emailEl.textContent = contact.email;
    emailEl.href = `mailto:${contact.email}`;
  }

  const locEl = document.getElementById('contactLocation');
  if (locEl) locEl.textContent = contact.location || "Jaipur, Rajasthan, India";

  // Copy Buttons
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.onclick = () => copyToClipboard(contact.phoneRaw || contact.phone, "phone number");
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.onclick = () => copyToClipboard(contact.email, "email address");
  }

  // Social Links
  const githubBtn = document.getElementById('githubProfileBtn');
  if (githubBtn) githubBtn.href = contact.github;

  const linkedinBtn = document.getElementById('linkedinProfileBtn');
  if (linkedinBtn) linkedinBtn.href = contact.linkedin;
}

// 8. Contact Form
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const subject = document.getElementById('formSubject').value;
    const message = document.getElementById('formMessage').value;

    const data = getPortfolioData();
    const toEmail = data.contact.email;
    const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject || 'Inquiry from Portfolio')}&body=${encodeURIComponent(`Hi Sachin,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.open(mailtoUrl, '_blank');
    showToast("Opening email client to send your message");
    form.reset();
  });
}

// 9. Navbar & Scrollspy
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }
}

// ====================================================================
// 10. DEEP MIDNIGHT STARRY SKY & GENTLE SHOOTING STARS ENGINE
// ====================================================================
function initNightSkyCanvas() {
  const canvas = document.getElementById('nightSkyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateStars();
  });

  // Star generation with 3 organic depth tiers
  let stars = [];
  function generateStars() {
    stars = [];
    const starCount = Math.min(Math.floor((width * height) / 6000), 190);

    for (let i = 0; i < starCount; i++) {
      const rand = Math.random();
      let radius, baseAlpha, twinkleSpeed, isBright;

      if (rand < 0.65) {
        radius = Math.random() * 0.7 + 0.3;
        baseAlpha = Math.random() * 0.45 + 0.25;
        twinkleSpeed = Math.random() * 0.015 + 0.005;
        isBright = false;
      } else if (rand < 0.90) {
        radius = Math.random() * 0.6 + 0.9;
        baseAlpha = Math.random() * 0.45 + 0.45;
        twinkleSpeed = Math.random() * 0.02 + 0.008;
        isBright = false;
      } else {
        radius = Math.random() * 0.7 + 1.4;
        baseAlpha = Math.random() * 0.35 + 0.65;
        twinkleSpeed = Math.random() * 0.025 + 0.012;
        isBright = true;
      }

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseAlpha,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed,
        isBright,
        hueTint: Math.random() > 0.8 ? '215, 235, 255' : '255, 255, 255'
      });
    }
  }

  generateStars();

  // Occasional Gentle Shooting Star System
  let shootingStar = null;
  let nextShootingStarTime = Date.now() + 4000; // First meteor in 4 seconds

  function spawnShootingStar() {
    const startX = Math.random() * (width * 0.75) + (width * 0.1);
    const startY = Math.random() * (height * 0.35);
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25; // ~45 deg downward streak
    const speed = Math.random() * 7 + 11;

    shootingStar = {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: Math.random() * 60 + 85,
      opacity: 1,
      fadeRate: 0.018,
      active: true
    };
  }

  function renderNightSky() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Deep Midnight Sky Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#040713');
    bgGrad.addColorStop(0.5, '#070b1c');
    bgGrad.addColorStop(1, '#090e24');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Twinkling Night Stars
    stars.forEach(star => {
      star.phase += star.twinkleSpeed;
      const twinkle = Math.sin(star.phase);
      const currentAlpha = Math.max(0.12, Math.min(1, star.baseAlpha + twinkle * 0.35));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.hueTint}, ${currentAlpha})`;

      if (star.isBright) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(220, 240, 255, ${currentAlpha * 0.8})`;
      }

      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 3. Render Shooting Star if Active
    const now = Date.now();
    if (!shootingStar && now > nextShootingStarTime) {
      spawnShootingStar();
      // Schedule next meteor in 10 to 15 seconds
      nextShootingStarTime = now + (Math.random() * 5000 + 10000);
    }

    if (shootingStar && shootingStar.active) {
      const tailX = shootingStar.x - (shootingStar.vx / 13) * shootingStar.length;
      const tailY = shootingStar.y - (shootingStar.vy / 13) * shootingStar.length;

      const streakGrad = ctx.createLinearGradient(
        shootingStar.x, shootingStar.y, tailX, tailY
      );
      streakGrad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
      streakGrad.addColorStop(0.35, `rgba(56, 189, 248, ${shootingStar.opacity * 0.8})`);
      streakGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = streakGrad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      shootingStar.opacity -= shootingStar.fadeRate;

      if (shootingStar.opacity <= 0 || shootingStar.x > width + 100 || shootingStar.y > height + 100) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(renderNightSky);
  }

  renderNightSky();
}

