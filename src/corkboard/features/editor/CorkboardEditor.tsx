"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const PIN_STYLES = [
  'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)',
  'radial-gradient(circle at 30% 30%, #3b82f6, #1e3a8a)',
  'radial-gradient(circle at 30% 30%, #eab308, #a16207)',
  'radial-gradient(circle at 30% 30%, #22c55e, #14532d)',
  'radial-gradient(circle at 30% 30%, #a855f7, #581c87)',
  'transparent',
];

const FILTER_STYLES = [
  { name: 'Normal', filter: 'none' },
  { name: 'Vintage', filter: 'sepia(0.4) saturate(1.5) contrast(0.9) hue-rotate(-10deg)' },
  { name: 'Noir', filter: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'Faded', filter: 'brightness(1.1) contrast(0.85) sepia(0.3)' },
  { name: 'Cool', filter: 'saturate(0.8) hue-rotate(20deg) contrast(1.1) brightness(1.05)' },
  { name: 'Warm', filter: 'sepia(0.3) saturate(1.6) hue-rotate(-10deg)' },
  { name: 'Dramatic', filter: 'contrast(1.4) saturate(1.2) sepia(0.1)' },
];

export default function CorkboardEditor() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ---- State ----
    const board = document.getElementById('cb-board')!;
    let zIndexCounter = 100;
    let polaroidCount = 0;
    let globalPinIndex = 0;
    let confirmCallback: (() => void) | null = null;

    // ---- Confirm Modal ----
    const confirmModal = document.getElementById('cb-confirm-modal')!;
    const confirmTitle = document.getElementById('cb-confirm-title')!;
    const confirmText = document.getElementById('cb-confirm-text')!;
    const okConfirmBtn = document.getElementById('cb-ok-confirm')!;
    const cancelConfirmBtn = document.getElementById('cb-cancel-confirm')!;

    function showConfirm(title: string, text: string, cb: () => void) {
      confirmTitle.textContent = title;
      confirmText.textContent = text;
      confirmCallback = cb;
      confirmModal.classList.add('active');
    }

    function closeConfirm() {
      confirmModal.classList.remove('active');
      confirmCallback = null;
    }

    okConfirmBtn.onclick = () => { if (confirmCallback) confirmCallback(); closeConfirm(); };
    cancelConfirmBtn.onclick = closeConfirm;

    // ---- Drag & Drop ----
    const dropZone = document.getElementById('cb-drop-hint')!;
    const fileInput = document.getElementById('cb-file-input') as HTMLInputElement;

    ['dragenter','dragover','dragleave','drop'].forEach(eName => {
      document.body.addEventListener(eName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
    });

    document.body.addEventListener('dragenter', () => dropZone.classList.add('active'));
    document.body.addEventListener('dragleave', (e) => {
      if (!(e as DragEvent).relatedTarget) dropZone.classList.remove('active');
    });

    document.body.addEventListener('drop', (e) => {
      dropZone.classList.remove('active');
      const de = e as DragEvent;
      const files = [...(de.dataTransfer?.files ?? [])].filter(f => f.type.startsWith('image/'));
      handleFiles(files, de.clientX, de.clientY);
    });

    fileInput.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const files = [...input.files].filter(f => f.type.startsWith('image/'));
        handleFiles(files);
        urlModal.classList.remove('active');
        input.value = '';
      }
    });

    function handleFiles(files: File[], dropX?: number, dropY?: number) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const spreadRadius = 250;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (files.length > 1 ? spreadRadius : 0);
          const baseX = dropX || window.innerWidth / 2;
          const baseY = dropY || window.innerHeight / 2;
          createPolaroid(reader.result as string, baseX + Math.cos(angle) * distance, baseY + Math.sin(angle) * distance);
        };
        reader.readAsDataURL(file);
      });
    }

    // ---- Polaroid Factory ----
    function createPolaroid(
      imgSrc: string,
      x: number,
      y: number,
      captionText = '',
      isExport = false,
      existingState: Record<string, number> | null = null
    ): HTMLElement {
      const rotation = (Math.random() * 12) - 6;
      const safeX = Math.max(50, Math.min(window.innerWidth - 300, x - 130));
      const safeY = Math.max(50, Math.min(window.innerHeight - 300, y - 150));

      const el = document.createElement('div');
      el.classList.add('cb-polaroid');
      el.style.left = isExport ? x + 'px' : `${safeX}px`;
      el.style.top = isExport ? y + 'px' : `${safeY}px`;
      el.style.transform = `rotate(${rotation}deg)`;
      el.style.zIndex = String(++zIndexCounter);

      const editState: Record<string, number> = existingState ? { ...existingState } : {
        scale: 1, minScale: 1, x: 0, y: 0, pinIndex: 0, filterIndex: 0,
      };

      el.innerHTML = `
        <div class="cb-pin" title="Change Pin"></div>
        ${!isExport ? `
        <div class="cb-pol-btn cb-delete-btn" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <div class="cb-pol-btn cb-edit-btn" title="Crop/Zoom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2v14a2 2 0 0 0 2 2h14"></path><path d="M18 22V8a2 2 0 0 0-2-2H2"></path></svg>
        </div>
        <div class="cb-pol-btn cb-filter-btn" title="Change Filter">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 2 2 2-2 2-2-2 2-2Z"/><path d="m5 7 2 2-2 2-2-2 2-2Z"/><path d="m15 11 2 2-4 4-2-2 4-4Z"/><line x1="9" x2="15" y1="17" y2="11"/><line x1="12" x2="18" y1="20" y2="14"/></svg>
        </div>
        ` : ''}
        <div class="cb-img-container">
          <img src="${imgSrc}" draggable="false" alt="polaroid">
        </div>
        <input type="text" class="cb-caption" placeholder="${isExport ? '' : 'Write a caption...'}" value="${captionText}" spellcheck="false">
      `;

      if (isExport) {
        if (existingState) {
          const img = el.querySelector('img') as HTMLImageElement;
          img.style.transform = `translate(calc(-50% + ${existingState.x}px), calc(-50% + ${existingState.y}px)) scale(${existingState.scale})`;
          img.style.filter = FILTER_STYLES[existingState.filterIndex || 0].filter;
          img.classList.add('loaded');
          const pin = el.querySelector('.cb-pin') as HTMLElement;
          pin.style.background = PIN_STYLES[existingState.pinIndex || 0];
          if (existingState.pinIndex === 5) pin.style.boxShadow = 'none';
        }
        return el;
      }

      board.appendChild(el);
      polaroidCount++;

      const img = el.querySelector('img') as HTMLImageElement;
      const pin = el.querySelector('.cb-pin') as HTMLElement;
      const editBtn = el.querySelector('.cb-edit-btn') as HTMLElement;
      const filterBtn = el.querySelector('.cb-filter-btn') as HTMLElement;
      const delBtn = el.querySelector('.cb-delete-btn') as HTMLElement;
      const input = el.querySelector('input') as HTMLInputElement;

      function getPanBounds() {
        const w = img.naturalWidth * editState.scale;
        const h = img.naturalHeight * editState.scale;
        return { x: Math.max(0, (w - 236) / 2), y: Math.max(0, (h - 240) / 2) };
      }

      img.onload = () => {
        const wRatio = 236 / img.naturalWidth;
        const hRatio = 240 / img.naturalHeight;
        const coverScale = Math.max(wRatio, hRatio);
        if (!existingState) { editState.scale = coverScale; editState.minScale = coverScale; }
        else { editState.minScale = coverScale; }
        updateImg();
        img.classList.add('loaded');
        (el as HTMLElement).dataset.editState = JSON.stringify(editState);
      };

      function updateImg() {
        img.style.transform = `translate(calc(-50% + ${editState.x}px), calc(-50% + ${editState.y}px)) scale(${editState.scale})`;
        img.style.filter = FILTER_STYLES[editState.filterIndex || 0].filter;
        (el as HTMLElement).dataset.editState = JSON.stringify(editState);
      }

      [delBtn, editBtn, filterBtn].forEach(btn => {
        if (btn) btn.addEventListener('mousedown', (e) => e.stopPropagation());
      });

      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showConfirm("Discard Memory", "Remove this photo?", () => {
          el.style.transform = `scale(0.5) rotate(${rotation + 20}deg)`;
          (el as HTMLElement).style.opacity = '0';
          setTimeout(() => el.remove(), 250);
          polaroidCount--;
        });
      });

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        editState.pinIndex = (editState.pinIndex + 1) % PIN_STYLES.length;
        pin.style.background = PIN_STYLES[editState.pinIndex];
        pin.style.boxShadow = editState.pinIndex === 5 ? 'none' : '';
        (el as HTMLElement).dataset.editState = JSON.stringify(editState);
      });

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        el.classList.toggle('is-editing');
        editBtn.classList.toggle('active');
      });

      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editState.filterIndex = (editState.filterIndex + 1) % FILTER_STYLES.length;
        updateImg();
      });

      img.addEventListener('mousedown', (e) => {
        if (!el.classList.contains('is-editing')) return;
        e.preventDefault(); e.stopPropagation();
        const startX = e.clientX, startY = e.clientY;
        const origX = editState.x, origY = editState.y;
        function onMove(me: MouseEvent) {
          const bounds = getPanBounds();
          editState.x = Math.max(-bounds.x, Math.min(bounds.x, origX + (me.clientX - startX)));
          editState.y = Math.max(-bounds.y, Math.min(bounds.y, origY + (me.clientY - startY)));
          updateImg();
        }
        function onUp() { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });

      img.addEventListener('wheel', (e) => {
        if (!el.classList.contains('is-editing')) return;
        e.preventDefault();
        editState.scale = Math.min(Math.max(editState.minScale, editState.scale + e.deltaY * -0.001), 10);
        const bounds = getPanBounds();
        editState.x = Math.max(-bounds.x, Math.min(bounds.x, editState.x));
        editState.y = Math.max(-bounds.y, Math.min(bounds.y, editState.y));
        updateImg();
      });

      el.addEventListener('mousedown', (e) => {
        if (el.classList.contains('is-editing')) return;
        if (e.target === input || e.target === pin || (e.target as HTMLElement).closest('.cb-pol-btn')) return;
        el.style.zIndex = String(++zIndexCounter);
        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - rect.left, offsetY = e.clientY - rect.top;
        el.style.transition = 'none';
        function onMove(me: MouseEvent) {
          el.style.left = Math.max(-50, Math.min(window.innerWidth - 200, me.clientX - offsetX)) + 'px';
          el.style.top = Math.max(-50, Math.min(window.innerHeight - 200, me.clientY - offsetY)) + 'px';
        }
        function onUp() {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          el.style.transition = 'box-shadow 0.2s ease, transform 0.15s';
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });

      input.addEventListener('mousedown', (e) => e.stopPropagation());

      el.animate([
        { transform: `scale(0.8) rotate(${rotation}deg)`, opacity: '0' },
        { transform: `scale(1) rotate(${rotation}deg)`, opacity: '1' },
      ], { duration: 300, easing: 'ease-out' });

      return el;
    }

    // ---- Global Actions ----
    document.getElementById('cb-global-pin-btn')!.addEventListener('click', () => {
      globalPinIndex = (globalPinIndex + 1) % PIN_STYLES.length;
      document.querySelectorAll('.cb-polaroid').forEach(card => {
        const pin = card.querySelector('.cb-pin') as HTMLElement;
        pin.style.background = PIN_STYLES[globalPinIndex];
        pin.style.boxShadow = globalPinIndex === 5 ? 'none' : '';
        const state = JSON.parse((card as HTMLElement).dataset.editState || '{}');
        state.pinIndex = globalPinIndex;
        (card as HTMLElement).dataset.editState = JSON.stringify(state);
      });
    });

    document.getElementById('cb-scramble-btn')!.addEventListener('click', () => {
      const cards = Array.from(document.querySelectorAll('.cb-polaroid'));
      cards.sort(() => Math.random() - 0.5);
      const screenW = window.innerWidth, screenH = window.innerHeight;
      const cardW = 260, cardH = 320, margin = 50;
      const usableW = screenW - margin * 2, usableH = screenH - margin * 2;
      const n = cards.length;
      if (n === 0) return;
      const screenRatio = screenW / screenH;
      const cols = Math.ceil(Math.sqrt(n * screenRatio));
      let xSpace = cardW + 20, ySpace = cardH + 20;
      const rows = Math.ceil(n / cols);
      if (cols * xSpace > usableW) xSpace = (usableW - cardW) / Math.max(1, cols - 1);
      if (rows * ySpace > usableH) ySpace = (usableH - cardH) / Math.max(1, rows - 1);
      const totalGridW = (cols - 1) * xSpace + cardW;
      const totalGridH = (rows - 1) * ySpace + cardH;
      const startX = margin + (usableW - totalGridW) / 2;
      const startY = margin + (usableH - totalGridH) / 2;
      cards.forEach((card, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = Math.max(10, Math.min(screenW - cardW - 10, startX + col * xSpace + (Math.random() * 30 - 15)));
        const y = Math.max(10, Math.min(screenH - cardH - 10, startY + row * ySpace + (Math.random() * 30 - 15)));
        const rot = (Math.random() * 12) - 6;
        (card as HTMLElement).style.transition = "left 0.6s cubic-bezier(0.2,1,0.3,1), top 0.6s cubic-bezier(0.2,1,0.3,1), transform 0.6s cubic-bezier(0.2,1,0.3,1)";
        (card as HTMLElement).style.left = x + 'px';
        (card as HTMLElement).style.top = y + 'px';
        (card as HTMLElement).style.transform = `rotate(${rot}deg)`;
        (card as HTMLElement).style.zIndex = String(++zIndexCounter);
      });
    });

    document.getElementById('cb-export-btn')!.addEventListener('click', async () => {
      const cards = document.querySelectorAll('.cb-polaroid');
      if (cards.length === 0) { alert("Nothing to export!"); return; }
      const flash = document.getElementById('cb-flash')!;
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 800);

      const exportContainer = document.createElement('div');
      exportContainer.id = 'cb-export-container';
      const bgClone = document.getElementById('cb-cork-bg')!.cloneNode(true);
      exportContainer.appendChild(bgClone);
      document.body.appendChild(exportContainer);

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const cardWidth = 260, cardHeight = 297;
      cards.forEach(c => {
        const x = parseFloat((c as HTMLElement).style.left);
        const y = parseFloat((c as HTMLElement).style.top);
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + cardWidth); maxY = Math.max(maxY, y + cardHeight);
      });

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `position:absolute;left:50%;top:50%;width:${maxX-minX}px;height:${maxY-minY}px;transform-origin:center center;`;
      const TARGET_W = 3840, TARGET_H = 2160;
      const globalScale = Math.min((TARGET_W * 0.9) / (maxX - minX), (TARGET_H * 0.9) / (maxY - minY));
      wrapper.style.transform = `translate(-50%, -50%) scale(${globalScale})`;
      exportContainer.appendChild(wrapper);

      cards.forEach(card => {
        const img = (card.querySelector('img') as HTMLImageElement).src;
        const caption = (card.querySelector('input') as HTMLInputElement).value;
        const state = JSON.parse((card as HTMLElement).dataset.editState || '{}');
        const clone = createPolaroid(img, parseFloat((card as HTMLElement).style.left) - minX, parseFloat((card as HTMLElement).style.top) - minY, caption, true, state);
        clone.style.transform = (card as HTMLElement).style.transform;
        clone.style.zIndex = (card as HTMLElement).style.zIndex;
        clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
        clone.style.border = '1px solid rgba(0,0,0,0.15)';
        wrapper.appendChild(clone);
      });

      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(exportContainer, {
          width: TARGET_W, height: TARGET_H, scale: 1, useCORS: true,
          backgroundColor: '#8a6b4e', logging: false,
        });
        const link = document.createElement('a');
        link.download = `CorkboardWallpaper-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 0.9);
        link.click();
      } catch (err) {
        console.error(err);
        alert("Export failed. Note: CORS images may block high-res export.");
      } finally {
        document.body.removeChild(exportContainer);
      }
    });

    document.getElementById('cb-clear-btn')!.addEventListener('click', () => {
      showConfirm("Clear Board?", "This will remove every photo.", () => {
        document.querySelectorAll('.cb-polaroid').forEach((c, i) => {
          setTimeout(() => {
            (c as HTMLElement).style.transform = "scale(0) rotate(180deg)";
            (c as HTMLElement).style.opacity = '0';
            setTimeout(() => c.remove(), 300);
          }, i * 50);
        });
      });
    });

    // URL Modal
    const urlModal = document.getElementById('cb-url-modal')!;
    const urlInput = document.getElementById('cb-url-input') as HTMLInputElement;
    document.getElementById('cb-add-btn')!.onclick = () => { urlModal.classList.add('active'); urlInput.focus(); };
    document.getElementById('cb-local-upload-btn')!.onclick = () => fileInput.click();
    document.getElementById('cb-cancel-url-btn')!.onclick = () => urlModal.classList.remove('active');
    document.getElementById('cb-confirm-url-btn')!.onclick = () => {
      if (urlInput.value) {
        const rx = Math.random() * (window.innerWidth - 300) + 50;
        const ry = Math.random() * (window.innerHeight - 350) + 50;
        createPolaroid(urlInput.value, rx, ry);
        urlModal.classList.remove('active');
        urlInput.value = '';
      }
    };

    // Help Modal
    const helpModal = document.getElementById('cb-help-modal')!;
    document.getElementById('cb-info-btn')!.onclick = () => helpModal.classList.add('active');
    document.getElementById('cb-close-help-btn')!.onclick = () => helpModal.classList.remove('active');

    // Welcome polaroid
    const emojis = ['🍧', '🍦', '🍨', '🧁', '🎀', '✨', '🥰'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const randX = Math.random() * (window.innerWidth - 300) + 50;
    const randY = Math.random() * (window.innerHeight - 350) + 50;
    const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><text y='50%' x='50%' dy='0.35em' text-anchor='middle' font-size='60'>${randomEmoji}</text></svg>`;
    createPolaroid(svg, randX, randY, "Hey icecream 🍦");

  }, []);

  return (
    <div className="corkboard-editor-root">
      {/* Board */}
      <svg id="cb-cork-bg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id="cb-cork-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#dcb386" surfaceScale="1.5" result="litNoise">
              <feDistantLight azimuth="45" elevation="50" />
            </feDiffuseLighting>
            <feComponentTransfer in="litNoise" result="coloredCork">
              <feFuncR type="linear" slope="0.8" intercept="0.1" />
              <feFuncG type="linear" slope="0.7" intercept="0.05" />
              <feFuncB type="linear" slope="0.6" intercept="0.0" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#8a6b4e" />
        <rect width="100%" height="100%" filter="url(#cb-cork-texture)" opacity="0.85" />
      </svg>

      {/* Board */}
      <div id="cb-board">
        <div className="cb-drop-hint" id="cb-drop-hint">
          <span className="cb-drop-text">Drop Photos Here!</span>
        </div>
      </div>

      {/* Back Button */}
      <Link href="/corkboard" className="cb-back-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
        Corkboard
      </Link>

      {/* Bottom Toolbar */}
      <div className="cb-ui-overlay">
        <button className="cb-ui-btn" id="cb-add-btn" title="Add Image">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button className="cb-ui-btn" id="cb-scramble-btn" title="Organize Photos">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
        </button>
        <button className="cb-ui-btn" id="cb-global-pin-btn" title="Change All Pins">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" /></svg>
        </button>
        <button className="cb-ui-btn" id="cb-export-btn" title="Download 4K Wallpaper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        </button>
        <button className="cb-ui-btn" id="cb-clear-btn" title="Clear Board">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
        </button>
        <button className="cb-ui-btn" id="cb-info-btn" title="Help">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        </button>
      </div>

      {/* Hidden file input */}
      <input type="file" id="cb-file-input" accept="image/*" multiple style={{ display: 'none' }} />
      <div className="cb-flash" id="cb-flash" />

      {/* URL Modal */}
      <div className="cb-modal-overlay" id="cb-url-modal">
        <div className="cb-modal">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>Add a Memory</h2>
          <button id="cb-local-upload-btn" style={{
            width: '100%', padding: '1rem', border: '2px dashed #d1d5db', borderRadius: '0.75rem',
            color: '#6b7280', cursor: 'pointer', marginBottom: '1.5rem', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', fontWeight: 700,
            transition: 'all 0.2s', fontSize: '0.9rem'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Upload from Device
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>OR PASTE URL</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
          </div>
          <input type="text" id="cb-url-input" placeholder="https://..." style={{
            width: '100%', border: '2px solid #d1d5db', borderRadius: '0.5rem', padding: '0.75rem',
            marginBottom: '1rem', outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box',
          }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button id="cb-cancel-url-btn" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', color: '#374151', background: 'transparent' }}>Cancel</button>
            <button id="cb-confirm-url-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: '#f97316', color: '#fff', fontWeight: 700 }}>Add Photo</button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <div className="cb-modal-overlay" id="cb-confirm-modal">
        <div className="cb-modal">
          <h2 id="cb-confirm-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2937' }}>Are you sure?</h2>
          <p id="cb-confirm-text" style={{ color: '#4b5563', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button id="cb-cancel-confirm" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', color: '#374151', background: 'transparent' }}>Keep it</button>
            <button id="cb-ok-confirm" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: '#ef4444', color: '#fff', fontWeight: 700 }}>Delete</button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <div className="cb-modal-overlay" id="cb-help-modal">
        <div className="cb-modal">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937', textAlign: 'center' }}>
            🍦 Corkboard
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '🖼️', label: 'Add', desc: 'Drag & drop multiple files or paste URLs.' },
              { icon: '✏️', label: 'Caption', desc: 'Add a caption to your photo.' },
              { icon: '✂️', label: 'Crop Mode', desc: 'Click the blue crop icon to pan & zoom.' },
              { icon: '🎨', label: 'Filters', desc: 'Click the wand icon to cycle retro filters (Sepia, B&W, Vintage…).' },
              { icon: '📌', label: 'Pins', desc: 'Use the pin toolbar button to cycle ALL pins, or click individual pins.' },
              { icon: '🔀', label: 'Organize', desc: 'Click the Grid icon to randomly arrange photos on screen.' },
              { icon: '⬇️', label: 'Export', desc: 'Downloads a 4K wallpaper with your collage centered.' },
            ].map(item => (
              <li key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: '#374151', fontSize: '0.9rem' }}><strong>{item.label}:</strong> {item.desc}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button id="cb-close-help-btn" style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: '#1f2937', color: '#fff', fontWeight: 700 }}>
              Let&apos;s Create!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
