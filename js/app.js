// app.js - Fixed Version

// Make showToast function globally accessible
let toastTimer = null;
function showToast(msg, duration=3000){
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

// Make updatePreview function globally accessible
let previewState = {};
function updatePreview(customState = {}) {
  const previewArea = document.getElementById('previewArea');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  
  if (!previewArea) return;
  
  // merge state
  previewState = Object.assign({}, previewState, customState);
  const data = collectFormData();
  const html = renderPreviewHtml(data);
  previewArea.innerHTML = html;
  
  applyTemplateBackground();

  if (downloadPdfBtn) downloadPdfBtn.disabled = false;
  if (sendEmailBtn) sendEmailBtn.disabled = false;
}
// currently selected template background image
let currentTemplateBg = '';

function applyTemplateBackground() {
  if (!currentTemplateBg) return;

  const card = document.querySelector('.biodata-template .bio-border');
  if (!card) return;

  card.style.backgroundImage = `url('${currentTemplateBg}')`;
  card.style.backgroundSize = 'cover';
  card.style.backgroundPosition = 'center top';
  card.style.backgroundRepeat = 'no-repeat';
}

/* ============================
   MUSLIM FIELD HIDE/SHOW HELPER
   ============================ */
const MUSLIM_FIELD_IDS = [
  'rashi',
  'nakshatra',
  'religion',
  'caste',
  'subcaste',
  'gotra',
  'manglik'
];

function setMuslimFieldsHidden(isHidden) {
  MUSLIM_FIELD_IDS.forEach(id => {
    const row = document.querySelector(`.form-row[data-field-id="${id}"]`);
    if (row) {
      row.style.display = isHidden ? 'none' : '';
    }
  });
}


// Function to collect form data (Moved outside to be accessible)
function collectFormData(){
  const fd = {};
  const form = document.getElementById('biodataForm');
  if (!form) return fd;
  
  // Check if elements exist before accessing
  const getValue = (id) => {
    const el = form.querySelector(`#${id}`);
    return el ? el.value : '';
  };
  
  fd.name = getValue('name').trim();
  fd.gender = getValue('gender');
  fd.dob = getValue('dob');
  fd.place = getValue('place');
  fd.rashi = getValue('rashi');
  fd.nakshatra = getValue('nakshatra');
  fd.height = getValue('height');
  fd.mstatus = getValue('mstatus');
  fd.religion = getValue('religion');
  fd.motherTongue = getValue('motherTongue');
  fd.caste = getValue('caste');
  fd.subcaste = getValue('subcaste');
  fd.gotra = getValue('gotra');
  fd.manglik = getValue('manglik');
  fd.complexion = getValue('complexion');
  fd.education = getValue('education');
  fd.college = getValue('college');
  fd.job = getValue('job');
  fd.organization = getValue('organization');
  fd.income = getValue('income');
  fd.about = getValue('about');
  
  // Additional fields
  fd.father = getValue('father');
  fd.fatherOcc = getValue('fatherOcc');
  fd.mother = getValue('mother');
  fd.motherOcc = getValue('motherOcc');
  fd.brothers = getValue('brothers');
  fd.sisters = getValue('sisters');
  fd.mBrothers = getValue('mBrothers');
  fd.mSisters = getValue('mSisters');
  fd.contact = getValue('contact');
  fd.fcontact = getValue('fcontact');
  fd.mcontact = getValue('mcontact');
  fd.address = getValue('address');
  fd.email = getValue('email');
  
  fd.photo = window.uploadedPhotoDataUrl || null;
  fd.templateName = previewState.templateName || 'Selected Template';
  fd.templateId = previewState.templateId || '1'; 
  return fd;
}

// Global variable for photo
window.uploadedPhotoDataUrl = null;

document.addEventListener('DOMContentLoaded', () => {
  // --- elements ---
  const templatesGrid = document.getElementById('templatesGrid');
  const religionBtns = document.querySelectorAll('.religion');
  const scrollToTemplatesBtn = document.getElementById('scrollToTemplates');
  const scrollToFormBtn = document.getElementById('scrollToForm');
  const createBtn = document.getElementById('createBtn');
  const showPreviewBtn = document.getElementById('showPreviewBtn');
  const payDownloadBtn = document.getElementById('payDownloadBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  const previewArea = document.getElementById('previewArea');
  const editBiodataBtn = document.getElementById('editBiodataBtn');
  const changeFormatBtn = document.getElementById('changeFormatBtn');
  const biodataForm = document.getElementById('biodataForm');
  const paymentModal = document.getElementById('paymentModal');
  const closeModal = document.getElementById('closeModal');
  const cancelPayment = document.getElementById('cancelPayment');
  const simulatePayBtn = document.getElementById('simulatePayBtn');
  const paymentStatus = document.getElementById('paymentStatus');
  const clearFormBtn = document.getElementById('clearFormBtn');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  const themeSwitch = document.getElementById('themeSwitch');

  // --- 1. DATA DEFINITION (Moved to Top to fix crash) ---
    const templates = [
    { id:'t1', title:'Classic Clean',  desc:'Simple, formal layout with clear sections',          rel:'all',     img:'images/format1.jpg', cssId:'21' },
    { id:'t2', title:'Modern Pink',    desc:'Modern boxed style with accent color',               rel:'hindu',   img:'images/hindu-temp1.jpg', cssId:'22' },
    { id:'t3', title:'Modern Pink',    desc:'Modern boxed style with accent color',               rel:'hindu',   img:'images/hindu-temp2.jpg', cssId:'23' },
    { id:'t4', title:'Modern Pink',    desc:'Modern boxed style with accent color',               rel:'hindu',   img:'images/hindu-temp3.jpg', cssId:'24' },
    { id:'t5', title:'Modern Pink',    desc:'Modern boxed style with accent color',               rel:'hindu',   img:'images/hindu-temp4.jpg', cssId:'25' },
    { id:'t6', title:'Modern Pink',    desc:'Modern boxed style with accent color',               rel:'hindu',   img:'images/hindu-temp5.jpg', cssId:'26' },
    { id:'t7', title:'Elegant Minimal',desc:'Minimal two-column design',                          rel:'muslim',  img:'images/muslim-temp1.jpg', cssId:'27' },
    { id:'t8', title:'Elegant Minimal',desc:'Minimal two-column design',                          rel:'muslim',  img:'images/muslim-temp2.jpg', cssId:'28' },
    { id:'t9', title:'Elegant Minimal',desc:'Minimal two-column design',                          rel:'muslim',  img:'images/muslim-temp3.jpg', cssId:'29' },
    { id:'t10', title:'Elegant Minimal',desc:'Minimal two-column design',                          rel:'muslim',  img:'images/muslim-temp4.jpg', cssId:'30' },
    { id:'t11', title:'Elegant Minimal',desc:'Minimal two-column design',                          rel:'muslim',  img:'images/muslim-temp5.jpg', cssId:'31' },
    { id:'t12', title:'Light & Airy',   desc:'Spacious layout and modern fonts',                   rel:'buddhist',img:'images/buddhist-temp1.jpg', cssId:'32' },
    { id:'t13', title:'Light & Airy',   desc:'Spacious layout and modern fonts',                   rel:'buddhist',img:'images/buddhist-temp2.jpg', cssId:'33' },
    { id:'t14', title:'Light & Airy',   desc:'Spacious layout and modern fonts',                   rel:'buddhist',img:'images/buddhist-temp3.jpg', cssId:'34' },
    { id:'t15', title:'Light & Airy',   desc:'Spacious layout and modern fonts',                   rel:'buddhist',img:'images/buddhist-temp4.jpg', cssId:'35' },
    { id:'t16', title:'Light & Airy',   desc:'Spacious layout and modern fonts',                   rel:'buddhist',img:'images/buddhist-temp5.jpg', cssId:'36' },
    { id:'t17', title:'Classic Mono',   desc:'Monochrome professional style',                      rel:'other',   img:'template8.jpg', cssId:'37' }
  ];

  // --- 2. INITIALIZATION ---
  initTheme();
  initializeForm();
   setMuslimFieldsHidden(false);
  setupAccordions();
  setupFieldManagement();
  setupFormActions();
  renderPhotoFormats(12);
  renderTemplates(); // Now safe to call
  
  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      mobileMenuBtn.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
    });
  });

  // render templates grid
  // ------------------ TEMPLATES PAGING: place near top of app.js ------------------
// Put these declarations BEFORE any function that uses them or any initial render call.
var templatesVisibleCount = 8; // use var to avoid TDZ issues if some other code runs earlier
var TEMPLATES_INCREMENT = 8;

// helper to ensure templatesGrid exists; adapt the selector if yours is different


// ---- renderTemplates (safe: uses templatesVisibleCount declared above) ----
function renderTemplates(filter = 'all') {
  if (!templatesGrid) return;
  templatesGrid.innerHTML = '';

  // choose list according to filter (ensure you have `templates` array defined elsewhere)
  var list = (typeof templates !== 'undefined' && Array.isArray(templates))
    ? templates.filter(function(t) { return filter === 'all' ? true : t.rel === filter; })
    : [];

  var items = list.length ? list : (typeof templates !== 'undefined' ? templates : []);

  var visible = Math.min(templatesVisibleCount, items.length);
  var visibleItems = items.slice(0, visible);

  visibleItems.forEach(function(t) {
    var card = document.createElement('div');
    card.className = 'template-card';
    card.dataset.templateId = t.id || '';

    card.innerHTML = ''
      + '<div class="template-thumb">'
      +   '<img class="template-photo-img" src="' + (t.img || '') + '" alt="' + (t.title || '') + ' preview" loading="lazy" onerror="this.src=\'https://via.placeholder.com/420x320/f7f3f5/eee?text=No+Image\'">'
      +   '<div class="template-photo-overlay" aria-hidden="false">'
      +     '<div class="overlay-content" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px;">'
      +       '<div class="overlay-title" style="display:block;color:white;font-weight:700;background:rgba(0,0,0,0.45);padding:6px 10px;border-radius:8px;">'
      +         'Use this template'
      +       '</div>'
      +       '<button class="select-template-btn" data-id="' + (t.id || '') + '" title="Use this template" style="padding:8px 12px;border-radius:8px;border:none;background:#ff5a8f;color:white;font-weight:700;cursor:pointer;">'
      +         'Select'
      +       '</button>'
      +     '</div>'
      +   '</div>'
      + '</div>';

    templatesGrid.appendChild(card);
  });

  // create/load the Load More button if it doesn't exist
  var loadBtn = document.getElementById('loadMoreTemplatesBtn');
  if (!loadBtn) {
    loadBtn = document.createElement('button');
    loadBtn.id = 'loadMoreTemplatesBtn';
    loadBtn.className = 'btn outline';
    loadBtn.style.margin = '18px auto 0';
    loadBtn.style.display = 'block';
    loadBtn.textContent = 'Load Templates';
    // insert after templatesGrid
    if (templatesGrid.parentNode) templatesGrid.parentNode.insertBefore(loadBtn, templatesGrid.nextSibling);

    loadBtn.addEventListener('click', function() {
      loadMoreTemplates(filter);
    });
  }

  // hide or show the button depending on items left
  if (visible >= items.length) {
    loadBtn.style.display = 'none';
  } else {
    loadBtn.style.display = 'block';
  }
}

// ---- loadMoreTemplates ----
function loadMoreTemplates(currentFilter) {
  // Increase visible count, but don't exceed overall templates length (if defined)
  var total = (typeof templates !== 'undefined' && Array.isArray(templates)) ? templates.length : Infinity;
  templatesVisibleCount = Math.min(templatesVisibleCount + TEMPLATES_INCREMENT, total);
  renderTemplates(currentFilter || 'all');
  // optional: small toast / console
  if (typeof showToast === 'function') showToast('Loaded  templates');
  else console.log('Loaded templates');
}

// ----------------------------------------------------------------------------
// IMPORTANT: Ensure any other code that calls renderTemplates() runs AFTER the above declarations.
// If you have a DOMContentLoaded or immediate call earlier in file, move that call BELOW this block.
// ----------------------------------------------------------------------------

// Example: safe DOMContentLoaded initial call (place this near bottom of your script or after other initializers)
document.addEventListener('DOMContentLoaded', function () {
  // If you have filters default value, pass it here: renderTemplates('all')
  renderTemplates('all');

  // delegate click for select buttons (works after render)
  document.body.addEventListener('click', function(e) {
    var el = e.target;
    if (el && el.classList && el.classList.contains('select-template-btn')) {
      var id = el.getAttribute('data-id');
      // call your existing template selection function here
      if (typeof onTemplateSelect === 'function') onTemplateSelect(id);
      else console.log('selected template id:', id);
    }
  });
});



  // religion filter events
  religionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      religionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rel = btn.dataset.rel;
      renderTemplates(rel);
      showToast(`Showing templates: ${rel}`);
    });
  });

  // smooth scroll handlers
  if (scrollToTemplatesBtn) {
    scrollToTemplatesBtn.addEventListener('click', () => {
      const templatesSection = document.getElementById('templates');
      if (templatesSection) templatesSection.scrollIntoView({behavior:'smooth'});
    });
  }
  
  if (scrollToFormBtn) {
    scrollToFormBtn.addEventListener('click', () => {
      const formSection = document.getElementById('form');
      if (formSection) formSection.scrollIntoView({behavior:'smooth'});
    });
  }
  
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const formSection = document.getElementById('form');
      if (formSection) formSection.scrollIntoView({behavior:'smooth'});
    });
  }

  // select template (delegation)
      // select template (delegation)
  if (templatesGrid) {
     // delegated click for select button and whole card click
templatesGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.select-template-btn');
  const card = e.target.closest('.template-card');

  // if user clicked card (not button) allow selecting by clicking image area
  if (card && !btn) {
    const id = card.dataset.templateId;
    // trigger same flow as button
    const fakeBtn = card.querySelector('.select-template-btn');
    if (fakeBtn) fakeBtn.click();
    return;
  }

  if (!btn) return;

  const templateId = btn.dataset.id;
  if (!templateId) return;

  // visual highlight
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  if (card) card.classList.add('selected');

  // find template data
  const t = templates.find(x => x.id === templateId);

  // set preview background image (if you use it)
  if (card) {
    const imgEl = card.querySelector('.template-photo-img');
    if (imgEl) {
      currentTemplateBg = imgEl.src || '';
      applyTemplateBackground();
    }
  }

  // hide/show muslim fields
  const isMuslimTemplate = !!(t && t.rel === 'muslim');
  setMuslimFieldsHidden(isMuslimTemplate);

  // apply template css id to preview (if you do)
  const templateCssId = t && t.cssId ? t.cssId : '21';
  updatePreview({
    templateName: t ? t.title : 'Selected Template',
    templateId: templateCssId,
  });

  // scroll to form
  const formSection = document.getElementById('form');
  if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
 });

}



  // Initialize photo upload functionality
  function initializePhotoUpload() {
    const photoInput = document.getElementById('photo');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const photoUploadArea = document.getElementById('photoUploadArea');

    if (!photoInput) return;

    photoInput.addEventListener('change', handlePhotoUpload);
    if(changePhotoBtn) changePhotoBtn.addEventListener('click', () => photoInput.click());
    if(removePhotoBtn) removePhotoBtn.addEventListener('click', removePhoto);

    // Drag and drop functionality
    if (photoUploadArea) {
      photoUploadArea.addEventListener('click', () => photoInput.click());
      
      photoUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#ff5a8f';
        photoUploadArea.style.background = '#fff5f7';
      });

      photoUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#e2e8f0';
        photoUploadArea.style.background = '#fafafa';
      });

      photoUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#e2e8f0';
        photoUploadArea.style.background = '#fafafa';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          photoInput.files = files;
          handlePhotoUpload({ target: photoInput });
        }
      });
    }
  }

  function handlePhotoUpload(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      window.uploadedPhotoDataUrl = e.target.result;
      showPhotoPreview(window.uploadedPhotoDataUrl);
      updatePreview();
      showToast('Photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  }

  function showPhotoPreview(dataUrl) {
    const photoPreview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    const photoUploadArea = document.getElementById('photoUploadArea');

    if (!photoPreview || !previewImage || !photoUploadArea) return;

    previewImage.src = dataUrl;
    photoPreview.style.display = 'block';
    photoUploadArea.style.display = 'none';
  }

  function removePhoto() {
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    const photoUploadArea = document.getElementById('photoUploadArea');

    if (!photoInput || !photoPreview || !photoUploadArea) return;

    photoInput.value = '';
    window.uploadedPhotoDataUrl = null;
    photoPreview.style.display = 'none';
    photoUploadArea.style.display = 'block';
    updatePreview();
    showToast('Photo removed');
  }

  // Initialize photo upload
  initializePhotoUpload();

  // form -> update preview
  const inputsToWatch = Array.from(document.querySelectorAll('#biodataForm input, #biodataForm textarea, #biodataForm select'));
  inputsToWatch.forEach(inp => inp.addEventListener('input', () => {
    debounceUpdatePreview();
  }));

  // debounce
  let debounceTimer = null;
  function debounceUpdatePreview(){
    if(debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => updatePreview(), 300);
  }

  // Show preview button --> full preview mode
  // Show preview button --> full preview mode
if (showPreviewBtn) {
  showPreviewBtn.addEventListener('click', () => {
    if (!validateRequired()) return;

    // latest data ke sath preview banao
    updatePreview();

    // ✅ preview mode on (ye CSS se form hide aur preview show karega)
    document.body.classList.add('preview-mode');

    // ✅ previewArea tak scroll karo
    const previewArea = document.getElementById('previewArea');
    if (previewArea) {
      previewArea.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }

    // ✅ preview buttons enable karo
    if (downloadPdfBtn) downloadPdfBtn.disabled = false;
    if (sendEmailBtn) sendEmailBtn.disabled = false;

    showToast('Preview ready - Full screen preview mode activated');
  });
}



  // Clear form
  if (clearFormBtn) {
    clearFormBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the form? All data will be lost.')) {
        biodataForm.reset();
        setMuslimFieldsHidden(false);
        window.uploadedPhotoDataUrl = null;
        
        const photoPreview = document.getElementById('photoPreview');
        const photoUploadArea = document.getElementById('photoUploadArea');
        if (photoPreview && photoUploadArea) {
          photoPreview.style.display = 'none';
          photoUploadArea.style.display = 'block';
        }
        
        updatePreview();
        showToast('Form cleared');
      }
    });
  }

  // Edit Biodata -> form wapas dikhao
if (editBiodataBtn) {
  editBiodataBtn.addEventListener('click', () => {
    document.body.classList.remove('preview-mode');
    const formSection = document.getElementById('form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast('You can edit your biodata now');
  });
}

// Change Format -> formats section par scroll
if (changeFormatBtn) {
  changeFormatBtn.addEventListener('click', () => {
    document.body.classList.remove('preview-mode');
    const formatsSection = document.getElementById('formats');
    if (formatsSection) {
      formatsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast('Choose a new format');
  });
}


  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const isOpen = q.classList.contains('open');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-q').forEach(otherQ => {
        if (otherQ !== q) {
          otherQ.classList.remove('open');
          otherQ.nextElementSibling.style.display = 'none';
        }
      });
      
      // Toggle current FAQ
      q.classList.toggle('open');
      const a = q.nextElementSibling;
      if (isOpen) {
        a.style.display = 'none';
      } else {
        a.style.display = 'block';
      }
    });
  });

  // Set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // quick: update stat animate
  (function animateStat(){
    const el = document.getElementById('todayCount');
    if (!el) return;
    const target = parseInt(el.textContent) || 443;
    let v = 0;
    const t = setInterval(()=> {
      v += Math.ceil(target/20);
      if(v >= target){ v = target; clearInterval(t); }
      el.textContent = v.toLocaleString();
    }, 40);
  })();

  // small accessibility: enable keyboard "Enter" to open create
  document.addEventListener('keydown', (e) => {
    if(e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.getElementById('form').scrollIntoView({behavior:'smooth'});
      showToast('Quick: opened form (Ctrl/Cmd + C)');
    }
  });

  // initial preview disabled
  if (downloadPdfBtn) downloadPdfBtn.disabled = true;
  if (sendEmailBtn) sendEmailBtn.disabled = true;

  // small helper: updatePreview with templateName initial
  previewState.templateName = 'Classic Clean';
  previewState.templateId = '1';  

  // Theme toggle event
  if (themeSwitch) {
    themeSwitch.addEventListener('change', (e) => {
      setTheme(e.target.checked);
    });
  }

  // Initialize theme
  function initTheme() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (themeSwitch) {
      themeSwitch.checked = darkMode;
      setTheme(darkMode);
    }
  }

  // Set theme
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('darkMode', 'false');
    }
  }
});

// Photo formats rendering function
function renderPhotoFormats(count = 12) {
  const formatsGrid = document.getElementById('formatsPhotoGrid');
  if (!formatsGrid) return;

  formatsGrid.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const imgSrc = `images/format${i}.jpg`;   // format1.jpg, format2.jpg ...

    const card = document.createElement('div');
    card.className = 'format-photo-card';
    card.dataset.formatId = `format-${i}`;

    card.innerHTML = `
      <img src="${imgSrc}"
           alt="Biodata Format ${i}"
           class="format-photo-img"
           loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x400/f0f0f0/cccccc?text=Image+Missing'">
      <div class="format-photo-overlay">
        <button class="select-format-btn" data-format="${i}">
          <span>✓</span> Select Format
        </button>
      </div>
    `;

    formatsGrid.appendChild(card);
  }

  // ✅ CLICK EVENT – YAHAN CHANGE HAI
  formatsGrid.addEventListener('click', function (e) {
    const selectBtn = e.target.closest('.select-format-btn');
    if (!selectBtn) return;

    const formatId = selectBtn.dataset.format; // "1", "2", ...

    // card select highlight
    document.querySelectorAll('.format-photo-card').forEach(card =>
      card.classList.remove('selected')
    );
    const card = selectBtn.closest('.format-photo-card');
    if (card) card.classList.add('selected');

    // 👉 yahi se image uthao
    const imgEl = card ? card.querySelector('.format-photo-img') : null;
    const imgSrc = imgEl ? imgEl.getAttribute('src') : '';

    if (imgSrc) {
      currentTemplateBg = imgSrc;   // global me store
      applyTemplateBackground();    // turant card pe laga do
    }
        // 👉 Hindu/Other format select pe sab fields wapas dikhana
    setMuslimFieldsHidden(false);

    // 👉 preview me template name + id dono bhejo
    updatePreview({
      templateName: `FORMAT ${formatId}`,
      templateId: formatId
    });

    // form pe scroll
    const formSection = document.getElementById('form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}



function loadMoreFormats() {
  const currentCards = document.querySelectorAll('.format-photo-card').length;
  renderPhotoFormats(currentCards + 8);
  showToast('More formats loaded');
}

function initializeForm() {
  // Define default fields for each section
  const defaultFields = {
    personal: [
      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter Your Name', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['', 'Male', 'Female', 'Other'] },
      { id: 'dob', label: 'Date of Birth', type: 'date' },
      { id: 'place', label: 'Place Of Birth', type: 'text', placeholder: 'Enter Your Place Of Birth' },
      { id: 'rashi', label: 'Rashi', type: 'text', placeholder: 'Rashi' },
      { id: 'nakshatra', label: 'Nakshatra', type: 'text', placeholder: 'Nakshatra' },

      // ✅ HEIGHT FIELD
      {
        id: 'height',
        label: 'Height',
        type: 'select',
        options: [
          "",
          "4 feet 0 inches (122 cm)", "4 feet 1 inches (124 cm)", "4 feet 2 inches (127 cm)",
          "4 feet 3 inches (130 cm)", "4 feet 4 inches (132 cm)", "4 feet 5 inches (135 cm)",
          "4 feet 6 inches (137 cm)", "4 feet 7 inches (140 cm)", "4 feet 8 inches (142 cm)",
          "4 feet 9 inches (145 cm)", "4 feet 10 inches (147 cm)", "4 feet 11 inches (150 cm)",
          "5 feet 0 inches (152 cm)", "5 feet 1 inches (155 cm)", "5 feet 2 inches (157 cm)",
          "5 feet 3 inches (160 cm)", "5 feet 4 inches (163 cm)", "5 feet 5 inches (165 cm)",
          "5 feet 6 inches (168 cm)", "5 feet 7 inches (170 cm)", "5 feet 8 inches (173 cm)",
          "5 feet 9 inches (175 cm)", "5 feet 10 inches (178 cm)", "5 feet 11 inches (180 cm)",
          "6 feet 0 inches (183 cm)", "6 feet 1 inches (185 cm)", "6 feet 2 inches (188 cm)",
          "6 feet 3 inches (191 cm)", "6 feet 4 inches (193 cm)", "6 feet 5 inches (196 cm)",
          "6 feet 6 inches (198 cm)", "6 feet 7 inches (201 cm)", "6 feet 8 inches (203 cm)",
          "6 feet 9 inches (206 cm)", "6 feet 10 inches (208 cm)", "6 feet 11 inches (211 cm)",
          "7 feet 0 inches (213 cm)", "7 feet 1 inches (216 cm)", "7 feet 2 inches (218 cm)",
          "7 feet 3 inches (221 cm)", "7 feet 4 inches (224 cm)", "7 feet 5 inches (226 cm)",
          "7 feet 6 inches (229 cm)", "7 feet 7 inches (231 cm)", "7 feet 8 inches (234 cm)",
          "7 feet 9 inches (236 cm)", "7 feet 10 inches (239 cm)", "7 feet 11 inches (241 cm)",
          "8 feet 0 inches (244 cm)", "8 feet 1 inches (246 cm)", "8 feet 2 inches (249 cm)",
          "8 feet 3 inches (251 cm)", "8 feet 4 inches (254 cm)", "8 feet 5 inches (257 cm)",
          "8 feet 6 inches (259 cm)", "8 feet 7 inches (262 cm)", "8 feet 8 inches (264 cm)",
          "8 feet 9 inches (267 cm)", "8 feet 10 inches (269 cm)", "8 feet 11 inches (272 cm)"
        ]
      },

      { id: 'mstatus', label: 'Marital Status', type: 'select', options: ['', 'Unmarried', 'Divorced', 'Widowed'] },
      { id: 'religion', label: 'Religion', type: 'text', placeholder: 'Enter Your Religion' },
      { id: 'motherTongue', label: 'Mother Tongue', type: 'text', placeholder: 'Enter Mother Tongue' },
      { id: 'caste', label: 'Caste', type: 'text', placeholder: 'Enter Caste' },
      { id: 'subcaste', label: 'Sub Caste', type: 'text', placeholder: 'Enter Sub Caste' },
      { id: 'gotra', label: 'Gotra', type: 'text', placeholder: 'Enter Gotra' },
      { id: 'manglik', label: 'Manglik', type: 'select', options: ['', 'Yes', 'No', "Don't Know"] },

      // ✅ UPDATED COMPLEXION DROPDOWN
      {
        id: 'complexion',
        label: 'Complexion',
        type: 'select',
        options: ["", "Very Fair", "Fair", "Wheatish", "Brown", "Dark"]
      },

      { id: 'education', label: 'Highest Education', type: 'text', placeholder: 'Enter Highest Education' },
      { id: 'college', label: 'College Name', type: 'text', placeholder: 'Enter College Name' },
      { id: 'job', label: 'Job / Occupation', type: 'text', placeholder: 'Enter Job / Occupation' },
      { id: 'organization', label: 'Organization Name', type: 'text', placeholder: 'Enter Organization Name' },

      // ✅ UPDATED INCOME DROPDOWN
      {
        id: 'income',
        label: 'Annual Income',
        type: 'select',
        options: [
          "",
          "0 - 5 Lpa",
          "5 - 10 Lpa",
          "10 - 15 Lpa",
          "15 - 20 Lpa",
          "20 - 25 Lpa",
          "25 - 30 Lpa",
          "30 - 35 Lpa",
          "35 - 40 Lpa",
          "40 - 45 Lpa",
          "45 - 50 Lpa",
          "50+ Lpa"
        ]
      },

      { id: 'about', label: 'About / Objective', type: 'textarea', placeholder: 'Write a short objective or about yourself' }
    ],

    family: [
      { id: 'father', label: 'Father\'s Name', type: 'text', placeholder: 'Enter Father\'s Name' },
      { id: 'fatherOcc', label: 'Father\'s Occupation', type: 'text', placeholder: 'Enter Father\'s Occupation' },
      { id: 'mother', label: 'Mother\'s Name', type: 'text', placeholder: 'Enter Mother\'s Name' },
      { id: 'motherOcc', label: 'Mother\'s Occupation', type: 'text', placeholder: 'Enter Mother\'s Occupation' },
      { id: 'brothers', label: 'Total Brothers', type: 'number', min: 0 },
      { id: 'sisters', label: 'Total Sisters', type: 'number', min: 0 },
      { id: 'mBrothers', label: 'Married Brothers', type: 'number', min: 0 },
      { id: 'mSisters', label: 'Married Sisters', type: 'number', min: 0 }
    ],

    contact: [
      { id: 'contact', label: 'Contact No', type: 'tel', placeholder: 'Enter Contact Number', required: true },
      { id: 'fcontact', label: 'Father\'s Contact No', type: 'tel', placeholder: 'Father\'s Contact Number' },
      { id: 'mcontact', label: 'Mother\'s Contact No', type: 'tel', placeholder: 'Mother\'s Contact Number' },
      { id: 'address', label: 'Address', type: 'textarea', placeholder: 'Enter Your Address' },
      { id: 'email', label: 'Email ID', type: 'email', placeholder: 'Enter Your Email ID' }
    ]
  };

  // Create default fields for each section
  for (const section in defaultFields) {
    const container = document.getElementById(`${section}-fields`);
    if (container) {
      container.innerHTML = '';
      defaultFields[section].forEach(field => {
        addFieldToSection(section, field, container);
      });
    }
  }
}

function setupAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    // Remove old listeners by cloning
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);
    
    newHeader.addEventListener('click', function() {
      const accordionGroup = this.parentElement;
      const content = this.nextElementSibling;
      
      // Toggle the open class
      accordionGroup.classList.toggle('open');
      
      // Toggle content visibility
      if (accordionGroup.classList.contains('open')) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  });
}

function setupFieldManagement() {
  const addFieldButtons = document.querySelectorAll('.add-field-btn');
  
  addFieldButtons.forEach(button => {
    const newBtn = button.cloneNode(true);
    button.parentNode.replaceChild(newBtn, button);

    newBtn.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      const container = document.getElementById(`${section}-fields`);
      
      if (!container) return;
      
      const newField = {
        id: `custom_${Date.now()}`,
        label: 'New Field',
        type: 'text',
        placeholder: 'Enter value'
      };
      
      addFieldToSection(section, newField, container);
    });
  });
}

function addFieldToSection(section, field, container) {
  const fieldId = field.id;
  const fieldRow = document.createElement('div');
  fieldRow.className = 'form-row';
  fieldRow.setAttribute('data-field-id', fieldId);
  
  let inputHtml = '';
  const labelHtml = `<label for="${fieldId}" class="field-label">${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>`;
  
  if (field.type === 'select') {
    inputHtml = `
      <select id="${fieldId}" class="form-input" ${field.required ? 'required' : ''}>
        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
      </select>
    `;
  } else if (field.type === 'textarea') {
    inputHtml = `
      <textarea id="${fieldId}" rows="3" class="form-input" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
    `;
  } else {
    const inputType = field.type || 'text';
    const minAttr = field.min !== undefined ? `min="${field.min}"` : '';
    inputHtml = `
      <input type="${inputType}" id="${fieldId}" class="form-input" placeholder="${field.placeholder || ''}" ${minAttr} ${field.required ? 'required' : ''}>
    `;
  }
  
  const fieldActions = document.createElement('div');
  fieldActions.className = 'field-actions';
  fieldActions.innerHTML = `
    <button type="button" class="delete-field" aria-label="Delete" title="Delete">
      ✕
    </button>
  `;
  
  fieldRow.innerHTML = `
    <div class="field-wrapper">
      ${labelHtml}
      <div class="input-container">
        ${inputHtml}
      </div>
    </div>
  `;
  
  const inputContainer = fieldRow.querySelector('.input-container');
  if (inputContainer) {
    inputContainer.appendChild(fieldActions);
  }
  
  container.appendChild(fieldRow);
  setupFieldActions(fieldRow, container);
  setupInputListeners(fieldId);
}

function setupFieldActions(fieldRow, container) {
  const deleteBtn = fieldRow.querySelector('.delete-field');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      if (confirm('Delete this field?')) {
        fieldRow.remove();
        updatePreview();
      }
    });
  }
}

function setupInputListeners(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('input', () => {
      // access debounce from closure or global if needed, 
      // or simply call updatePreview directly for custom fields
      updatePreview();
    });
  }
}

function setupFormActions() {
  // Clear Form Button
  const clearFormBtn = document.getElementById('clearFormBtn');
  // Logic handled in DOMContentLoaded
}

// Helper: render preview html (kept same as before)
function renderPreviewHtml(data) {
  const name   = data.name || 'Full Name';
  const contact = data.contact || 'Mobile';
  const email   = data.email || '';
  const edu     = data.education || '';
  const about   = data.about || '';
  const templateName = data.templateName || 'Format 1';

  // templateId -> sirf number use karenge (1–20)
  const rawId = data.templateId || '1';
  const match = String(rawId).match(/\d+/);
  const themeId = match ? match[0] : '1';      // "1", "2", ...
  const wrapperClass = `biodata-template template-${themeId}`;

  const photoHtml = data.photo
    ? `<img src="${data.photo}" alt="Photo" class="bio-photo">`
   : ''; 
  const row = (label, value) => {
    if (!value) return '';
    return `
      <div class="bio-row">
        <div class="bio-label">${label}</div>
        <div class="bio-value">${escapeHtml(value)}</div>
      </div>
    `;
  };

  // ---------- Sections ----------

  const personalRows = `
    ${row('Name', name)}
    ${row('Gender', data.gender)}
    ${row('Date of Birth', data.dob ? formatDate(data.dob) : '')}
    ${row('Place of Birth', data.place)}
    ${row('Height', data.height)}
    ${row('Marital Status', data.mstatus)}
    ${row('Religion', data.religion)}
    ${row('Mother Tongue', data.motherTongue)}
    ${row('Caste', data.caste)}
    ${row('Sub Caste', data.subcaste)}
    ${row('Gotra', data.gotra)}
    ${row('Manglik', data.manglik)}
    ${row('Complexion', data.complexion)}
    ${row('Highest Education', data.education)}
    ${row('College / Institute', data.college)}
    ${row('Job / Occupation', data.job)}
    ${row('Organization', data.organization)}
    ${row('Annual Income', data.income)}
  `;

  const familyRows = `
    ${row("Father's Name", data.father)}
    ${row("Father's Occupation", data.fatherOcc)}
    ${row("Mother's Name", data.mother)}
    ${row("Mother's Occupation", data.motherOcc)}
    ${row('Total Brothers', data.brothers)}
    ${row('Married Brothers', data.mBrothers)}
    ${row('Total Sisters', data.sisters)}
    ${row('Married Sisters', data.mSisters)}
  `;

  const contactRows = `
    ${row('Mobile', contact)}
    ${row("Father's Contact", data.fcontact)}
    ${row("Mother's Contact", data.mcontact)}
    ${row('Email', email)}
    ${row('Address', data.address)}
  `;

  const aboutSection = about
    ? `
      <section class="bio-section">
        <h3 class="bio-section-title">About Me</h3>
        <div class="bio-section-body">
          <p class="bio-about">
            ${escapeHtml(about)}
          </p>
        </div>
      </section>
    `
    : '';

  // ---------- Final Markup (yahan .bio-inner add kiya) ----------

  return `
    <div class="${wrapperClass}">
      <div class="bio-border">
        <div class="bio-inner">
          <header class="bio-header">
            <div class="bio-template-chip">${escapeHtml(templateName)}</div>
            <h2 class="bio-name">${escapeHtml(name)}</h2>
            ${edu ? `<p class="bio-sub">${escapeHtml(edu)}</p>` : ''}
          </header>

          <div class="bio-main">
            <div class="bio-main-left">
              <section class="bio-section">
                <h3 class="bio-section-title">Personal Details</h3>
                <div class="bio-section-body">
                  ${personalRows}
                </div>
              </section>

              <section class="bio-section">
                <h3 class="bio-section-title">Family Details</h3>
                <div class="bio-section-body">
                  ${familyRows}
                </div>
              </section>

              <section class="bio-section">
                <h3 class="bio-section-title">Contact Details</h3>
                <div class="bio-section-body">
                  ${contactRows}
                </div>
              </section>

              ${aboutSection}
            </div>

            <div class="bio-main-right">
              ${photoHtml}
            </div>
          </div>

          <footer class="bio-footer">
            Generated on ${new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })} via BiodataMaker.in
          </footer>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str='') {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// XSS Protection
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// File upload validation improvement
function validateFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }
  
  // Check for malicious file names
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  
  return {
    safe: true,
    sanitizedName: safeName,
    type: file.type,
    size: file.size
  };
}

// Basic validation – common jagah use ho sakta hai (preview + pdf)
function validateRequired() {
  const nameEl    = document.getElementById('name');
  const contactEl = document.getElementById('contact');

  const name    = nameEl    ? nameEl.value.trim()    : '';
  const contact = contactEl ? contactEl.value.trim() : '';

  if (!name) {
    showToast('Please enter your name');
    if (nameEl) nameEl.focus();
    return false;
  }

  if (!contact) {
    showToast('Please enter contact number');
    if (contactEl) contactEl.focus();
    return false;
  }

  // ✅ Email bilkul optional, koi check nahi
  return true;
}


// Add this to app.js (anywhere before the closing braces)

// Helper to prepare element for PDF
function prepareForPdf(element) {
  if (!element) return element;
  
  // Clone the element
  const clone = element.cloneNode(true);
  
  // Add print styles
  clone.style.cssText += `
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    background: #ffffff !important;
  `;
  
  // Fix template 1 specifically
  if (clone.classList.contains('template-1')) {
    const border = clone.querySelector('.bio-border');
    if (border) {
      border.style.cssText += `
        background-color: #fffbeb !important;
        border: 4px solid #d4af37 !important;
        background-image: none !important;
      `;
    }
  }
  
  return clone;
}