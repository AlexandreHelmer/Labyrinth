// ==== Tangram minimal engine (Canvas 2D) ====
// Hypothèses : canvas de taille fixe WIDTH x HEIGHT, contexte 2D fourni à initTangram.
// Vous gérez l'UI (events). Ce moteur gère les pièces, le z-order, le dessin et le hit-test.

const Tangram = (() => {
  // --- State ---
  let ctx = null;
  let WIDTH = 0, HEIGHT = 0;

  // Chaque pièce : { name, type, pts:[{x,y}...], x, y, rot, scale, color }
  // Les points (pts) sont en coordonnées locales autour de (0,0).
  // Géométrie simple, proportions tangram usuelles (pas à l’échelle absolue du carré original).
  const pieces = [];
  const drawOrder = []; // contient les noms dans l'ordre de dessin (fin = top)

  // Couleurs lisibles (modifiable)
  const palette = ["#ff6b6b","#4ecdc4","#ffe66d","#5e60ce","#00b4d8","#e5989b","#2ec4b6"];

  function initTangram(canvasOrCtx, width, height) {
    if (canvasOrCtx.getContext) {
      ctx = canvasOrCtx.getContext("2d");
      WIDTH = canvasOrCtx.width;
      HEIGHT = canvasOrCtx.height;
    } else {
      ctx = canvasOrCtx;
      WIDTH = width;
      HEIGHT = height;
    }

    // Taille de base pour les pièces
    const S = Math.min(WIDTH, HEIGHT) * 0.22; // échelle raisonnable

    // Helpers pour créer des formes (coord. locales)
    const triIsoRight = (a) => ([
      {x:0, y:0}, {x:a, y:0}, {x:0, y:a}
    ]);
    const square = (a) => ([
      {x:-a/2, y:-a/2}, {x:a/2, y:-a/2}, {x:a/2, y:a/2}, {x:-a/2, y:a/2}
    ]);
    const parallelogram = (a) => ([
      {x:-a*0.6, y:-a*0.3}, {x:a*0.6, y:-a*0.3}, {x:a*0.4, y:a*0.3}, {x:-a*0.8, y:a*0.3}
    ]);
    const rot = (pts, ang) => pts.map(p=>({
      x: p.x*Math.cos(ang) - p.y*Math.sin(ang),
      y: p.x*Math.sin(ang) + p.y*Math.cos(ang)
    }));

    // Définition des 7 pièces (approx tangram, proportions crédibles)
    // 2 grands triangles
    addPiece("bigA", "triangle", triIsoRight(S), WIDTH*0.20, HEIGHT*0.25, Math.PI/4, 1, palette[0]);
    addPiece("bigB", "triangle", rot(triIsoRight(S), Math.PI/2), WIDTH*0.35, HEIGHT*0.40, 0, 1, palette[1]);

    // 1 triangle moyen
    addPiece("mid", "triangle", triIsoRight(S*0.7), WIDTH*0.52, HEIGHT*0.30, -Math.PI/4, 1, palette[2]);

    // 2 petits triangles
    addPiece("smallA", "triangle", triIsoRight(S*0.5), WIDTH*0.65, HEIGHT*0.50, Math.PI/6, 1, palette[3]);
    addPiece("smallB", "triangle", rot(triIsoRight(S*0.5), -Math.PI/2), WIDTH*0.48, HEIGHT*0.58, 0, 1, palette[4]);

    // 1 carré
    addPiece("square", "square", square(S*0.5), WIDTH*0.72, HEIGHT*0.32, Math.PI/4, 1, palette[5]);

    // 1 parallélogramme
    addPiece("para", "para", parallelogram(S*0.7), WIDTH*0.25, HEIGHT*0.65, 0, 1, palette[6]);

    redrawScene();
  }

  function addPiece(name, type, pts, x, y, rotRad, scale, color) {
    const piece = { name, type, pts, x, y, rot: rotRad||0, scale: scale||1, color: color||"#888" };
    pieces.push(piece);
    drawOrder.push(name);
  }

  function getPieceByName(name) {
    return pieces.find(p => p.name === name) || null;
  }

  // --- API demandée ---
  function move(object_name, x, y) {
    const p = getPieceByName(object_name);
    if (!p) return;
    // x = new pos
    // dx = delta
    // offset clic = (x-dx)-p.x
    p.x = x;
    p.y = y;
    // Option : vous pouvez décider ici de « snap » sur une grille si besoin.
  }

  function getObjectAt(X, Y) {
    // On teste dans l'ordre inverse du dessin (top-first)
    for (let i = drawOrder.length - 1; i >= 0; i--) {
      const name = drawOrder[i];
      const p = getPieceByName(name);
      if (!p) continue;
      if (pointInPiece(p, X, Y)) {
        // Gestion z-order : la pièce touchée passe au-dessus
        bringToFront(name);
        return {name, x: p.x, y:p.y};
      }
    }
    return null;
  }

  function redrawScene() {
    if (!ctx) return;
    // Efface
    ctx.clearRect(0,0,WIDTH,HEIGHT);

    // Plateau (fond)
    ctx.save();
    ctx.fillStyle = "#f7f7fb";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.restore();

    // Grille légère optionnelle
    drawGrid(20, "#eee");

    // Dessin des pièces selon drawOrder
    for (const name of drawOrder) {
      const p = getPieceByName(name);
      if (!p) continue;
      drawPiece(p);
    }
  }

  // --- Internals ---
  function drawGrid(step, color) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let x=0; x<=WIDTH; x+=step){ ctx.moveTo(x,0); ctx.lineTo(x,HEIGHT); }
    for (let y=0; y<=HEIGHT; y+=step){ ctx.moveTo(0,y); ctx.lineTo(WIDTH,y); }
    ctx.stroke();
    ctx.restore();
  }

  function bringToFront(name) {
    const idx = drawOrder.indexOf(name);
    if (idx >= 0) {
      drawOrder.splice(idx,1);
      drawOrder.push(name);
    }
  }

  function piecePath(p) {
    ctx.beginPath();
    // Applique transform
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(p.scale, p.scale);
    // Trace polygon local
    const pts = p.pts;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i=1;i<pts.length;i++){
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();
    // On ne fill/stroke pas ici (juste construit le path dans le CTM actuel)
  }

  function drawPiece(p) {
    piecePath(p);
    ctx.fillStyle = p.color;
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;

    // Ombre légère
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.stroke();
    ctx.restore(); // de piecePath
  }

  function pointInPiece(p, X, Y) {
    piecePath(p);
    const hit = ctx.isPointInPath(X, Y);
    ctx.restore(); // de piecePath
    return hit;
  }

  // --- Expose API requise + utilitaires utiles ---
  return {
    initTangram,
    move,
    getObjectAt,
    redrawScene,
    bringToFront,
    // Bonus : accès lecture seule aux pièces si besoin (ex: pour rotations futures)
    get pieces() { return pieces.map(p=>({...p})); }
  };
})();

// === Exemple d’intégration ===
// const canvas = document.getElementById("c");
// Tangram.initTangram(canvas);
// canvas.addEventListener("pointerdown", (e) => {
//   const rect = canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
//   const name = Tangram.getObjectAt(x, y);
//   // si name !== "board", commencez un drag etc.
// });