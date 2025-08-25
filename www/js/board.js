class GameBoard {
  constructor(canvas, container, wrapper, getObjectAt, attemptMoveBoardObject) {
    this.canvas = canvas;
    this.container = container;
    this.wrapper = wrapper;
    
    this.MAX_SCALE = 1;
    this.scale = 1;
    this.minScale = 1;
    this.originX = 0;
    this.originY = 0;
    
    // états gestes
    this.gestureActive = false;
    this.pinch = null;
    this.dragObject = null; // "player" ou "board"
    this.dragStart = null;
    
    this.attachEvents();
    this.updateMinScale();
    this.getObjectAt = getObjectAt
    this.attemptMoveBoardObject = attemptMoveBoardObject
  }
  
  /* === Utilitaires internes === */
  clampScale(s) {
    return Math.max(this.minScale, Math.min(this.MAX_SCALE, s));
  }
  
  getContainerRect() {
    return this.container.getBoundingClientRect();
  }
  
  updateMinScale() {
    const r = this.getContainerRect();
    this.minScale = Math.min(r.width / this.canvas.width, r.height / this.canvas.height);
    if (!isFinite(this.minScale) || this.minScale <= 0) this.minScale = 1;
    if (this.scale < this.minScale) this.scale = this.minScale;
    this.clampPan();
    this.applyTransform();
  }
  
  clampPan() {
    const r = this.getContainerRect();
    const scaledW = this.canvas.width * this.scale;
    const scaledH = this.canvas.height * this.scale;
    
    const canCenterX = scaledW <= r.width;
    const canCenterY = scaledH <= r.height;
    
    const maxX = canCenterX ? (r.width - scaledW) / 2 : 0;
    const minX = canCenterX ? maxX : (r.width - scaledW);
    
    const maxY = canCenterY ? (r.height - scaledH) / 2 : 0;
    const minY = canCenterY ? maxY : (r.height - scaledH);
    
    this.originX = Math.max(minX, Math.min(maxX, this.originX));
    this.originY = Math.max(minY, Math.min(maxY, this.originY));
  }
  
  applyTransform() {
    this.wrapper.style.transform = `translate(${this.originX}px, ${this.originY}px) scale(${this.scale})`;
  }
  
  /* === Coordonnées === */
  getCanvasCoords(clientX, clientY) {
    const r = this.getContainerRect();
    return {
      x: (clientX - r.left - this.originX) / this.scale,
      y: (clientY - r.top - this.originY) / this.scale
    };
  }
  
  /* === Zoom / Pan === */
  setScaleAt(newScale, cx, cy) {
    const r = this.getContainerRect();
    const prev = this.scale;
    this.scale = this.clampScale(newScale);
    
    // garder (cx,cy) stable
    const sx = (cx - r.left - this.originX);
    const sy = (cy - r.top - this.originY);
    const k = this.scale / prev;
    this.originX = cx - r.left - sx * k;
    this.originY = cy - r.top - sy * k;
    
    this.clampPan();
    this.applyTransform();
  }
  
  panBy(dx, dy) {
    this.originX += dx;
    this.originY += dy;
    this.clampPan();
    this.applyTransform();
  }
  
  resetZoom() {
    this.updateMinScale();
    this.scale = this.minScale;
    const r = this.getContainerRect();
    this.originX = (r.width - this.canvas.width * this.scale) / 2;
    this.originY = (r.height - this.canvas.height * this.scale) / 2;
    this.applyTransform();
  }
  
  // Gestes 
  midPoint(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }
  
  dist2(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }
  
  startDrag(clientX, clientY, touchCount = 1) {
    if (touchCount > 1) return;
    const { x, y } = this.getCanvasCoords(clientX, clientY);
    this.dragStart = { x: clientX, y: clientY };
    this.dragObject = this.getObjectAt(x, y)
  }
  
  moveDrag(clientX, clientY, touchCount = 1) {
    if (touchCount > 1 || !this.dragObject) return;
    const { x, y } = this.getCanvasCoords(clientX, clientY);
    
    if (this.dragObject === "board") {
      const dx = clientX - this.dragStart.x;
      const dy = clientY - this.dragStart.y;
      this.panBy(dx, dy);
      this.dragStart = { x: clientX, y: clientY };
    }
    else
      this.attemptMoveBoardObject(this.dragObject, x, y)
  }
  
  endDrag() {
    this.dragObject = null;
    this.dragStart = null;
  }
  
  // Événements
  attachEvents() {
    // Touch
    this.canvas.addEventListener("touchstart", e => {
      if (e.touches.length === 2) {
        this.gestureActive = true;
        this.pinch = {
          baseScale: this.scale,
          baseDist: this.dist2(e.touches),
          prevCenter: this.midPoint(e.touches)
        };
      }
      if (e.touches.length === 1) {
        this.startDrag(e.touches[0].clientX, e.touches[0].clientY, 1);
      }
    }, { passive: false });
    
    this.canvas.addEventListener("touchmove", e => {
      if (e.touches.length === 2 && this.pinch) {
        e.preventDefault();
        const c = this.midPoint(e.touches);
        const k = this.dist2(e.touches) / this.pinch.baseDist;
        const target = this.clampScale(this.pinch.baseScale * k);
        this.setScaleAt(target, c.x, c.y);
      }
      if (e.touches.length === 1) {
        e.preventDefault();
        this.moveDrag(e.touches[0].clientX, e.touches[0].clientY, 1);
      }
    }, { passive: false });
    
    this.canvas.addEventListener("touchend", e => {
      if (this.gestureActive && e.touches.length < 2) {
        this.gestureActive = false;
        this.pinch = null;
      }
      if (e.touches.length < 1) this.endDrag();
    }, { passive: false });
    
    // Souris
    this.canvas.addEventListener("mousedown", e => {
      if (e.button === 0) this.startDrag(e.clientX, e.clientY);
    });
    this.canvas.addEventListener("mousemove", e => {
      if (e.buttons === 1) this.moveDrag(e.clientX, e.clientY);
    });
    this.canvas.addEventListener("mouseup", e => {
      if (e.button === 0) this.endDrag();
    });
  }
}