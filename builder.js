/**
 * NEURAL CONSTRUCTOR v7.0 (OMNI-PHYSICS)
 * ARCHITECT: MAGNUS OPUS
 * PROTOCOLS: INFINITE MEDIA, VIDEO, TOUCH & MOUSE SUPPORT
 */

let selectedElement = null;
let uploadedMedia = []; 
let zIndexCounter = 100;

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// NEURAL PHYSICS: OMNI-DEVICE ACTIVE ///", "color:#00f3ff; background:#000; padding:5px;");
    
    // Listeners
    const mediaInput = document.getElementById('media-upload-input');
    if(mediaInput) mediaInput.addEventListener('change', handleMediaUpload);
    
    document.getElementById('prop-text').addEventListener('input', updateProps);
    document.getElementById('prop-color').addEventListener('input', updateProps);
    document.getElementById('prop-z').addEventListener('input', updateProps);
    
    // Global deselect (Touch & Click)
    const ws = document.getElementById('workspace');
    ws.addEventListener('click', (e) => { if(e.target.id === 'workspace') deselectAll(); });
    ws.addEventListener('touchstart', (e) => { if(e.target.id === 'workspace') deselectAll(); }, {passive: true});
});

// /// 1. INFINITE MEDIA DOCK ///

window.triggerMediaUpload = function() {
    document.getElementById('media-upload-input').click();
};

function handleMediaUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const src = evt.target.result;
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            uploadedMedia.push({ src, type });
            renderThumbnail(src, type);
        };
        reader.readAsDataURL(file);
    });
}

function renderThumbnail(src, type) {
    const grid = document.getElementById('media-grid');
    const thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    
    if(type === 'video') {
        thumb.innerHTML = '<i data-lucide="video" style="color:#fff;"></i>';
        thumb.style.display = 'flex'; thumb.style.alignItems = 'center'; thumb.style.justifyContent = 'center';
    } else {
        thumb.style.backgroundImage = `url(${src})`;
    }
    
    thumb.onclick = () => spawnMedia(src, type);
    grid.insertBefore(thumb, grid.firstElementChild);
    if(window.lucide) lucide.createIcons();
}

// /// 2. SPAWN LOGIC ///

window.spawnMedia = function(src, type) {
    const el = createBaseElement();
    if(type === 'video') {
        el.innerHTML = `<video src="${src}" controls style="width:100%; height:100%; object-fit:cover; pointer-events:auto;"></video>`;
        el.style.width = '300px'; el.style.height = '200px';
    } else {
        el.innerHTML = `<img src="${src}" style="width:100%; height:100%; -webkit-user-drag: none; pointer-events:none;">`;
        el.style.width = '200px'; el.style.height = '200px';
    }
    addToWorkspace(el);
    // Auto-close sidebar on mobile
    if(window.innerWidth <= 768) toggleSidebar('left');
};

window.spawnBlock = function(type) {
    const el = createBaseElement();
    switch(type) {
        case 'text':
            el.innerText = 'TAP TO EDIT';
            el.style.color = '#fff'; el.style.fontSize = '1.2rem'; el.style.padding = '10px';
            break;
        case 'box':
            el.style.backgroundColor = '#111'; el.style.border = '1px solid #333';
            el.style.width = '200px'; el.style.height = '200px';
            break;
        case 'button':
            el.innerHTML = '<button style="pointer-events:none; background:#00f3ff; border:none; padding:10px 20px; font-weight:bold;">ACTION</button>';
            break;
        case 'hero':
            el.innerHTML = '<h1 style="font-size:2rem; margin:0;">HERO</h1><p>Subtitle</p>';
            el.style.textAlign = 'center'; el.style.padding = '30px'; el.style.border = '1px dashed #444';
            el.style.width = '300px';
            break;
    }
    addToWorkspace(el);
    if(window.innerWidth <= 768) toggleSidebar('left');
};

function createBaseElement() {
    const el = document.createElement('div');
    el.className = 'element';
    // Adaptive Spawn Position (Center of current view)
    el.style.left = (window.innerWidth <= 768) ? '50px' : '200px';
    el.style.top = '100px';
    el.style.zIndex = zIndexCounter++;
    
    initDragPhysics(el);
    
    // Selection (Mouse & Touch)
    const handleSelect = (e) => { e.stopPropagation(); selectComponent(el); };
    el.addEventListener('mousedown', handleSelect);
    el.addEventListener('touchstart', handleSelect, {passive: true});

    return el;
}

function addToWorkspace(el) {
    const ws = document.getElementById('workspace');
    const ph = ws.querySelector('.placeholder-msg');
    if(ph) ph.remove();
    
    // Inject Resizer
    const r = document.createElement('div');
    r.className = 'resizer se';
    el.appendChild(r);
    initResizePhysics(el, r);

    ws.appendChild(el);
    selectComponent(el);
}

// /// 3. PHYSICS ENGINE (OMNI-DEVICE) ///

// Helper to get coordinates regardless of input type
function getPointerPos(e) {
    if(e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function initDragPhysics(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const startDrag = (e) => {
        if(e.target.classList.contains('resizer')) return;
        // On mobile, prevent scrolling while dragging
        if(e.type === 'touchstart') document.body.style.overflow = 'hidden';
        
        isDragging = true;
        const pos = getPointerPos(e);
        startX = pos.x;
        startY = pos.y;
        initialLeft = el.offsetLeft;
        initialTop = el.offsetTop;
        el.style.cursor = 'grabbing';
        
        if(e.type === 'touchstart') {
            window.addEventListener('touchmove', onDrag, {passive: false});
            window.addEventListener('touchend', stopDrag);
        } else {
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', stopDrag);
        }
    };

    const onDrag = (e) => {
        if(!isDragging) return;
        if(e.cancelable) e.preventDefault(); // Stop scroll
        
        const pos = getPointerPos(e);
        const dx = pos.x - startX;
        const dy = pos.y - startY;
        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
    };

    const stopDrag = () => {
        isDragging = false;
        el.style.cursor = 'grab';
        document.body.style.overflow = ''; // Restore scroll
        
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('touchmove', onDrag);
        window.removeEventListener('touchend', stopDrag);
    };

    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, {passive: false});
}

function initResizePhysics(el, resizer) {
    const startResize = (e) => {
        e.stopPropagation();
        if(e.type === 'touchstart') document.body.style.overflow = 'hidden';
        
        const pos = getPointerPos(e);
        const startX = pos.x;
        const startY = pos.y;
        const startW = parseInt(document.defaultView.getComputedStyle(el).width, 10);
        const startH = parseInt(document.defaultView.getComputedStyle(el).height, 10);

        const doResize = (evt) => {
            if(evt.cancelable) evt.preventDefault();
            const curr = getPointerPos(evt);
            el.style.width = (startW + (curr.x - startX)) + 'px';
            el.style.height = (startH + (curr.y - startY)) + 'px';
        };

        const stopResize = () => {
            document.body.style.overflow = '';
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
            window.removeEventListener('touchmove', doResize);
            window.removeEventListener('touchend', stopResize);
        };

        if(e.type === 'touchstart') {
            window.addEventListener('touchmove', doResize, {passive: false});
            window.addEventListener('touchend', stopResize);
        } else {
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }
    };

    resizer.addEventListener('mousedown', startResize);
    resizer.addEventListener('touchstart', startResize, {passive: false});
}

// /// 4. UTILITIES ///

function selectComponent(el) {
    if(selectedElement) selectedElement.classList.remove('selected');
    selectedElement = el;
    el.classList.add('selected');
    el.style.zIndex = zIndexCounter++;

    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('editor-controls').style.display = 'block';
    
    // Populate props
    if(el.childNodes[0] && el.childNodes[0].nodeType === 3) {
         document.getElementById('prop-text').value = el.innerText;
    } else {
         document.getElementById('prop-text').value = "";
    }
    document.getElementById('prop-z').value = el.style.zIndex;

    // Mobile UX: Show properties, close tools
    if(window.innerWidth <= 768) {
        document.getElementById('sidebar-left').classList.remove('mobile-open');
        document.getElementById('sidebar-right').classList.add('mobile-open');
    }
}

function deselectAll() {
    if(selectedElement) selectedElement.classList.remove('selected');
    selectedElement = null;
    document.getElementById('editor-controls').style.display = 'none';
    document.getElementById('no-selection').style.display = 'block';
}

function updateProps(e) {
    if(!selectedElement) return;
    const val = e.target.value;
    const id = e.target.id;

    if(id === 'prop-text') {
        if(!selectedElement.querySelector('img') && !selectedElement.querySelector('video')) {
           // Basic text update
           selectedElement.innerText = val;
           // Re-inject resizer after text wipe
           const r = document.createElement('div');
           r.className = 'resizer se';
           selectedElement.appendChild(r);
           initResizePhysics(selectedElement, r);
        }
    } else if(id === 'prop-color') {
        selectedElement.style.backgroundColor = val;
    } else if(id === 'prop-z') {
        selectedElement.style.zIndex = val;
    }
}

function deleteSelected() {
    if(selectedElement) {
        selectedElement.remove();
        deselectAll();
    }
}

// /// 5. DEPLOYMENT & PAYMENT ///

window.deploySequence = function() {
    const build = document.getElementById('workspace').innerHTML;
    if(!build || build.includes('SPAWN')) {
        alert("VOID DETECTED. SPAWN ARTIFACTS.");
        return;
    }
    localStorage.setItem('nmv_pending_build', build);
    document.getElementById('payment-modal').style.display = 'flex';
};

window.closePayment = () => document.getElementById('payment-modal').style.display = 'none';
window.processLicense = (code, url) => {
    localStorage.setItem('nmv_active_license', code);
    window.location.href = url;
};

window.togglePreview = () => {
    // Basic preview toggle
    document.body.classList.toggle('preview-active');
    alert("PREVIEW MODE. CLICK AGAIN TO EDIT.");
};

window.toggleSidebar = (side) => {
    document.getElementById(`sidebar-${side}`).classList.toggle('mobile-open');
};
