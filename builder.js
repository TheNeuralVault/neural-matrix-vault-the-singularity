/**
 * NEURAL CONSTRUCTOR v5.0 (TITANIUM EDITION)
 * ARCHITECT: MAGNUS OPUS
 * PROTOCOLS: TOUCH PHYSICS, MULTIVERSE PAGES, PAYMENT INTERCEPT
 */

// /// STATE MANAGEMENT ///
let selectedElement = null;
let currentPage = 'home';
let pageStates = {
    home: '<div class="placeholder-msg">/// TAP TOOLS TO DEPLOY ///</div>',
    about: '',
    services: '',
    contact: ''
};
let uploadedImages = []; // Stores Base64 strings
const MAX_IMAGES = 10;
let analyticsChart = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// NEURAL PHYSICS: TOUCH ENABLED ///", "color:#00f3ff; background:#000; padding:5px;");
    
    // Load initial page state
    restorePageState('home');
    
    // Listeners
    const mediaInput = document.getElementById('media-upload-input');
    if(mediaInput) mediaInput.addEventListener('change', handleMediaUpload);
    
    document.getElementById('prop-text').addEventListener('input', updateText);
    document.getElementById('prop-color').addEventListener('input', updateColor);
    document.getElementById('prop-padding').addEventListener('input', updatePadding);
    
    initAnalytics();
});

// /// 1. MULTIVERSE PAGE SYSTEM (SWITCHING) ///

window.switchPage = function(newPage) {
    if (currentPage === newPage) return;

    // 1. SAVE Current State
    const workspace = document.getElementById('workspace');
    pageStates[currentPage] = workspace.innerHTML;

    // 2. UPDATE UI
    document.querySelectorAll('.page-item').forEach(p => p.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById('current-page-label').innerText = newPage.toUpperCase();

    // 3. LOAD New State
    currentPage = newPage;
    if (!pageStates[newPage] || pageStates[newPage].trim() === '') {
        workspace.innerHTML = '<div class="placeholder-msg">/// EMPTY SECTOR ///</div>';
    } else {
        workspace.innerHTML = pageStates[newPage];
    }

    // 4. RE-INITIALIZE PHYSICS
    rebindPhysics();
    
    // Close sidebar on mobile for better UX
    if(window.innerWidth <= 768) toggleSidebar('left');
};

function rebindPhysics() {
    const elements = document.querySelectorAll('.element');
    elements.forEach(el => {
        el.addEventListener('click', (e) => { e.stopPropagation(); selectComponent(el); });
        if(!el.querySelector('.resizer')) injectResizers(el);
        initResizeLogic(el);
    });
}

function restorePageState(page) {
    pageStates[page] = document.getElementById('workspace').innerHTML;
}

// /// 2. MEDIA DOCK PROTOCOL (UPLOAD LIMIT 10) ///

window.triggerMediaUpload = function() {
    if (uploadedImages.length >= MAX_IMAGES) {
        alert("MEMORY FULL: MAX 10 ARTIFACTS ALLOWED.");
        return;
    }
    document.getElementById('media-upload-input').click();
};

function handleMediaUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64 = evt.target.result;
        uploadedImages.push(base64);
        renderThumbnail(base64, uploadedImages.length - 1);
        document.getElementById('media-count').innerText = uploadedImages.length;
    };
    reader.readAsDataURL(file);
}

function renderThumbnail(src, index) {
    const grid = document.getElementById('media-grid');
    const thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    thumb.style.backgroundImage = `url(${src})`;
    thumb.onclick = () => addImageToCanvas(src);
    grid.insertBefore(thumb, grid.lastElementChild);
}

function addImageToCanvas(src) {
    const workspace = document.getElementById('workspace');
    const ph = workspace.querySelector('.placeholder-msg');
    if(ph) ph.remove();

    const el = document.createElement('div');
    el.className = 'element';
    el.style.width = '100%'; 
    el.style.marginBottom = '10px';
    el.innerHTML = `<img src="${src}" style="width:100%; pointer-events:none;">`;
    
    injectResizers(el);
    el.addEventListener('click', (e) => { e.stopPropagation(); selectComponent(el); });
    initResizeLogic(el);
    workspace.appendChild(el);
    selectComponent(el);
    
    if(window.innerWidth <= 768) toggleSidebar('left');
}

// /// 3. COMPONENT FACTORY ///

window.addBlock = function(type) {
    const workspace = document.getElementById('workspace');
    const ph = workspace.querySelector('.placeholder-msg');
    if(ph) ph.remove();

    const el = document.createElement('div');
    el.className = 'element';
    
    let html = '';
    switch(type) {
        case 'header-minimal': html = `<div style="padding:20px; background:#fff; color:#000; font-weight:bold; display:flex; justify-content:space-between;"><span>BRAND</span><span>MENU</span></div>`; break;
        case 'hero-matrix': html = `<div style="padding:50px 20px; background:#000; color:#00f3ff; text-align:center; border:1px solid #00f3ff;"><h1>WAKE UP</h1><p>The Matrix has you.</p></div>`; break;
        case 'text-split': html = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:20px; background:#111; color:#fff;"><div><h3>TITLE</h3><p>Text here.</p></div><div style="background:#222;"></div></div>`; break;
        case 'image': html = `<img src="https://via.placeholder.com/600x300" style="width:100%; display:block;">`; break;
        case 'button-neon': html = `<div style="text-align:center; padding:20px;"><button style="background:transparent; border:1px solid #00f3ff; color:#00f3ff; padding:10px 20px; box-shadow:0 0 10px #00f3ff;">ACTIVATE</button></div>`; break;
    }

    el.innerHTML = html;
    injectResizers(el);
    el.addEventListener('click', (e) => { e.stopPropagation(); selectComponent(el); });
    initResizeLogic(el);
    workspace.appendChild(el);
    selectComponent(el);

    if(window.innerWidth <= 768) toggleSidebar('left');
};

function injectResizers(el) {
    const corners = ['nw', 'ne', 'sw', 'se'];
    corners.forEach(c => {
        const r = document.createElement('div');
        r.className = `resizer ${c}`;
        el.appendChild(r);
    });
}

// /// 4. RESIZE PHYSICS (TOUCH & MOUSE) ///

function initResizeLogic(el) {
    const resizers = el.querySelectorAll('.resizer');
    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', (e) => startResize(e, el, resizer, false));
        resizer.addEventListener('touchstart', (e) => startResize(e, el, resizer, true), {passive: false});
    });
}

function startResize(e, el, resizer, isTouch) {
    e.preventDefault();
    e.stopPropagation();

    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    
    const startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
    const startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);

    function doResize(evt) {
        const clientX = isTouch ? evt.touches[0].clientX : evt.clientX;
        const clientY = isTouch ? evt.touches[0].clientY : evt.clientY;

        if (resizer.classList.contains('se')) {
            el.style.width = (startWidth + (clientX - startX)) + 'px';
            el.style.height = (startHeight + (clientY - startY)) + 'px';
        }
    }

    function stopResize() {
        if(isTouch) {
            window.removeEventListener('touchmove', doResize);
            window.removeEventListener('touchend', stopResize);
        } else {
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
        }
    }

    if(isTouch) {
        window.addEventListener('touchmove', doResize, {passive: false});
        window.addEventListener('touchend', stopResize);
    } else {
        window.addEventListener('mousemove', doResize);
        window.addEventListener('mouseup', stopResize);
    }
}

// /// 5. UTILS & UI ///

function selectComponent(el) {
    if(selectedElement) selectedElement.classList.remove('selected');
    selectedElement = el;
    el.classList.add('selected');
    
    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('editor-controls').style.display = 'block';
    
    const txt = el.innerText;
    document.getElementById('prop-text').value = txt;

    if(window.innerWidth <= 768) toggleSidebar('right');
}

function updateText(e) {
    if(!selectedElement) return;
    const target = selectedElement.querySelector('h1, h2, p, span, button');
    if(target) target.innerText = e.target.value;
}
function updateColor(e) { if(selectedElement) selectedElement.style.backgroundColor = e.target.value; }
function updatePadding(e) { if(selectedElement) selectedElement.style.padding = e.target.value + 'px'; }

function deleteSelected() {
    if(selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        document.getElementById('editor-controls').style.display = 'none';
        document.getElementById('no-selection').style.display = 'block';
    }
}

window.toggleSidebar = function(side) {
    document.getElementById(`sidebar-${side}`).classList.toggle('mobile-open');
};
window.switchLeftTab = function(tab) {
    document.querySelectorAll('.left-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tab}`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};
window.setDevice = function(mode) {
    const ws = document.getElementById('workspace');
    if(mode === 'mobile') {
        ws.classList.add('mobile-mode');
    } else {
        ws.classList.remove('mobile-mode');
    }
};

// /// 6. ANALYTICS ///

function initAnalytics() {
    const ctx = document.getElementById('trafficChart');
    if(!ctx) return;
    if(analyticsChart) analyticsChart.destroy();
    analyticsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                label: 'VISITORS',
                data: [12, 19, 3, 5, 2, 3, 10],
                borderColor: '#00f3ff',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: { x: { ticks: { color: '#666' } }, y: { ticks: { color: '#666' } } }
        }
    });
}
window.openAnalytics = () => document.getElementById('modal-analytics').style.display = 'flex';
window.closeModal = (id) => document.getElementById(id).style.display = 'none';

// /// 7. DEPLOYMENT & PAYMENT PROTOCOL ///

window.deploySequence = function() {
    // 1. Snapshot the Build
    const currentBuild = document.getElementById('workspace').innerHTML;
    if(!currentBuild || currentBuild.includes('TAP TOOLS')) {
        alert("ERROR: WORKSPACE EMPTY. CONSTRUCT ARTIFACTS BEFORE DEPLOYMENT.");
        return;
    }

    // 2. Save Telepathy Data
    localStorage.setItem('nmv_pending_build', currentBuild);

    // 3. Trigger Payment Interceptor
    document.getElementById('payment-modal').style.display = 'flex';
};

window.closePayment = function() {
    document.getElementById('payment-modal').style.display = 'none';
};

window.processLicense = function(productCode, stripeUrl) {
    // Tag the browser for the Success Page
    localStorage.setItem('nmv_active_license', productCode);
    
    // Animate Selection
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(c => c.style.opacity = '0.3');
    
    // Redirect to Payment
    setTimeout(() => {
        window.location.href = stripeUrl;
    }, 500);
};
