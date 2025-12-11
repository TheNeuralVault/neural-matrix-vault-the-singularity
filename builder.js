/**
 * NEURAL CONSTRUCTOR ENGINE v2.5 (TITANIUM)
 * ARCHITECT: MAGNUS OPUS
 */

let selectedElement = null;
let currentPage = 'home';

document.addEventListener('DOMContentLoaded', () => {
    console.log("/// NEURAL BUILDER: ONLINE ///");
    initDragAndDrop();
    initPropertiesListeners();
    initAnalytics();
    
    // Global File Listener
    document.getElementById('global-upload').addEventListener('change', handleFileUpload);
});

// --- 1. CORE LOGIC ---

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const zone = document.getElementById('workspace');

    draggables.forEach(item => {
        // Desktop Drag
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', item.getAttribute('data-type'));
        });
        
        // Mobile Tap-to-Add
        item.addEventListener('click', (e) => {
            if(window.innerWidth <= 768) {
                createComponent(item.getAttribute('data-type'), zone);
                toggleSidebar('left'); // Close menu on add
            }
        });
    });

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const type = e.dataTransfer.getData('type');
        if(type) createComponent(type, zone);
    });
}

function createComponent(type, zone) {
    // Remove placeholder
    const ph = document.querySelector('.placeholder-msg');
    if(ph) ph.remove();

    const el = document.createElement('div');
    el.classList.add('element');
    el.setAttribute('data-id', Date.now());
    
    // VARIANT LOGIC
    let html = '';
    switch(type) {
        // HEADERS
        case 'header-minimal':
            html = `<nav style="padding:20px; display:flex; justify-content:space-between; background:#fff; color:#000; border-bottom:1px solid #eee;">
                <b>BRAND</b> <div>Link 1 &nbsp; Link 2</div></nav>`;
            break;
        case 'header-cyber':
            html = `<nav style="padding:20px; display:flex; justify-content:space-between; background:#000; color:#00f3ff; border-bottom:1px solid #00f3ff;">
                <b style="letter-spacing:2px;">NEURAL_SYS</b> <div style="font-family:monospace;">[LOGIN]</div></nav>`;
            break;

        // HEROES
        case 'hero-clean':
            html = `<div style="padding:100px 20px; text-align:center; background:#f8f9fa; color:#333;">
                <h1 style="font-size:3rem; margin:0;">The Future is Here</h1>
                <p>Minimalist design for maximum impact.</p>
                <button style="padding:10px 20px; background:#333; color:#fff; border:none; margin-top:20px;">GET STARTED</button></div>`;
            break;
        case 'hero-matrix':
            html = `<div style="padding:100px 20px; text-align:center; background:#000; color:#00f3ff; border-bottom:1px solid #333;">
                <h1 style="font-size:3rem; margin:0; text-shadow:0 0 10px #00f3ff;">WAKE_UP_NEO</h1>
                <p style="font-family:monospace;">The Matrix has you...</p>
                <button style="padding:10px 20px; background:transparent; color:#00f3ff; border:1px solid #00f3ff; margin-top:20px;">ENTER</button></div>`;
            break;

        // CONTENT
        case 'text-split':
            html = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; padding:60px 20px; max-width:1200px; margin:0 auto;">
                <div><h2>Left Side</h2><p>Content goes here.</p></div>
                <div style="background:#eee; height:200px;"></div></div>`;
            break;
        case 'features-grid':
            html = `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:60px 20px;">
                <div style="padding:20px; border:1px solid #ddd;"><h3>Feature 1</h3></div>
                <div style="padding:20px; border:1px solid #ddd;"><h3>Feature 2</h3></div>
                <div style="padding:20px; border:1px solid #ddd;"><h3>Feature 3</h3></div></div>`;
            break;

        // MEDIA
        case 'image':
            html = `<img src="https://via.placeholder.com/1200x600" style="width:100%; height:auto; display:block;">`;
            break;
        case 'video':
            html = `<div style="width:100%; height:400px; background:#000; color:#fff; display:flex; justify-content:center; align-items:center;">[VIDEO_EMBED_PLACEHOLDER]</div>`;
            break;
        case 'button-primary':
            html = `<div style="text-align:center; padding:20px;"><button style="background:#007bff; color:#fff; border:none; padding:15px 30px; font-size:1rem; border-radius:4px;">CLICK ME</button></div>`;
            break;
        case 'button-neon':
            html = `<div style="text-align:center; padding:20px;"><button style="background:transparent; color:#00f3ff; border:1px solid #00f3ff; padding:15px 30px; font-size:1rem; box-shadow:0 0 15px #00f3ff;">ACTIVATE</button></div>`;
            break;
    }

    el.innerHTML = html;
    
    // Select on click
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectComponent(el);
        if(window.innerWidth <= 768) toggleSidebar('right'); // Auto open props on mobile
    });

    zone.appendChild(el);
    selectComponent(el);
}

// --- 2. SELECTION & EDITING ---

function selectComponent(el) {
    // Clear prev selection
    document.querySelectorAll('.element').forEach(e => e.classList.remove('selected'));
    
    selectedElement = el;
    el.classList.add('selected');

    // Show UI
    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('editor-controls').style.display = 'block';

    // Toggle Input Types
    const isImage = el.querySelector('img');
    const isVideo = el.innerHTML.includes('VIDEO');
    
    if(isImage || isVideo) {
        document.getElementById('ctrl-text').style.display = 'none';
        document.getElementById('ctrl-upload').style.display = 'block';
    } else {
        document.getElementById('ctrl-text').style.display = 'block';
        document.getElementById('ctrl-upload').style.display = 'none';
        document.getElementById('prop-text').value = el.innerText;
    }
}

function initPropertiesListeners() {
    // TEXT UPDATE
    document.getElementById('prop-text').addEventListener('input', (e) => {
        if(!selectedElement) return;
        // Basic implementation: update all text nodes safely
        // In full prod, we would target specific child nodes
        if(!selectedElement.querySelector('img')) {
             selectedElement.innerText = e.target.value; 
        }
    });

    // BG COLOR
    document.getElementById('prop-color').addEventListener('input', (e) => {
        if(!selectedElement) return;
        const child = selectedElement.firstElementChild;
        if(child) child.style.background = e.target.value;
    });

    // PADDING
    document.getElementById('prop-padding').addEventListener('input', (e) => {
        if(!selectedElement) return;
        const child = selectedElement.firstElementChild;
        if(child) child.style.padding = `${e.target.value}px 20px`;
    });
}

// --- 3. FILE UPLOAD ENGINE ---

window.triggerUpload = function() {
    document.getElementById('global-upload').click();
};

function handleFileUpload(e) {
    const file = e.target.files[0];
    if(!file || !selectedElement) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const result = evt.target.result;
        
        // If Image Element
        const img = selectedElement.querySelector('img');
        if(img) {
            img.src = result;
        } 
        // If Video or Background (Generic Handler)
        else {
            selectedElement.innerHTML = `<img src="${result}" style="width:100%; display:block;">`;
        }
        
        document.getElementById('prop-src').value = file.name;
    };
    reader.readAsDataURL(file);
}

// --- 4. NAVIGATION & MOBILE ---

window.switchLeftTab = function(tabName) {
    // 1. Hide all panels
    document.querySelectorAll('.left-panel').forEach(p => {
        p.style.display = 'none';
        p.classList.remove('active');
    });
    
    // 2. Show target panel
    const target = document.getElementById(`panel-${tabName}`);
    if(target) {
        target.style.display = 'block';
        target.classList.add('active');
    }

    // 3. Update Buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

window.loadPage = function(pageName) {
    document.getElementById('current-page-label').innerText = pageName.toUpperCase();
    document.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    // Simulation: Flash the workspace
    const ws = document.getElementById('workspace');
    ws.style.opacity = 0.5;
    setTimeout(() => ws.style.opacity = 1, 300);
};

window.toggleSidebar = function(side) {
    const el = document.getElementById(`sidebar-${side}`);
    el.classList.toggle('mobile-open');
};

window.setDevice = function(mode) {
    const ws = document.getElementById('workspace');
    if(mode === 'mobile') {
        ws.style.maxWidth = '375px';
        ws.style.border = '10px solid #333';
        ws.style.borderRadius = '20px';
    } else {
        ws.style.maxWidth = '100%';
        ws.style.border = 'none';
        ws.style.borderRadius = '0';
    }
    
    document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

window.deleteSelected = function() {
    if(selectedElement && confirm("DELETE BLOCK?")) {
        selectedElement.remove();
        selectedElement = null;
        document.getElementById('editor-controls').style.display = 'none';
        document.getElementById('no-selection').style.display = 'block';
    }
};

window.togglePreview = function() {
    document.body.classList.toggle('preview-active');
    alert("PREVIEW MODE: UI HIDDEN. REFRESH TO RESET.");
};

window.openSettings = function() { document.getElementById('modal-settings').style.display = 'flex'; }
window.openAnalytics = function() { document.getElementById('modal-analytics').style.display = 'flex'; }
window.closeModal = function(id) { document.getElementById(id).style.display = 'none'; }
