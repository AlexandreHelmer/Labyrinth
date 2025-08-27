const Tangram = (() => {
  let ctx = null;
  let WIDTH = 0, HEIGHT = 0;
  let pieces = [];
  const drawOrder = [];
  let selectedPiece = null;


const FIGURES={
  square: {
    label: "Carré",
    pieces: [{"name":"bigA","x":375,"y":500,"rot":0,"scaleX":1,"scaleY":1,"color":"#ff3838"},{"name":"bigB","x":500,"y":375,"rot":1.5707963267948966,"scaleX":1,"scaleY":1,"color":"#ff9f1a"},{"name":"mid","x":687.5,"y":687.5,"rot":0.7853981633974483,"scaleX":1,"scaleY":1,"color":"#fffa65"},{"name":"smallA","x":375,"y":687.5,"rot":-1.5707963267948966,"scaleX":1,"scaleY":1,"color":"#32ff7e"},{"name":"smallB","x":562.5,"y":500,"rot":3.141592653589793,"scaleX":1,"scaleY":1,"color":"#18dcff"},{"name":"square","x":500,"y":625,"rot":0.7853981633974483,"scaleX":1,"scaleY":1,"color":"#7d5fff"},{"name":"para","x":687.5,"y":437.5,"rot":1.5707963267948966,"scaleX":1,"scaleY":1,"color":"#e84393"}]
  },
  flower: {
    label: "Fleur",
    icon: "icons/miniature-flower.png",
    pieces: [{"name":"bigA","x":603.1983241894131,"y":697.6427703606753,"rot":3.9269908169872414,"scaleX":1,"scaleY":1},{"name":"bigB","x":426.4216288927763,"y":697.6427703606753,"rot":-0.7853981633974483,"scaleX":1,"scaleY":1},{"name":"mid","x":578.0350830217222,"y":421.7544227123568,"rot":0.7853981633974483,"scaleX":-1,"scaleY":-1},{"name":"smallA","x":327.67252978140846,"y":358.4400470595076,"rot":0,"scaleX":-1,"scaleY":1},{"name":"smallB","x":639.4126290499587,"y":297.16638277414773,"rot":4.71238898038469,"scaleX":1,"scaleY":1},{"name":"square","x":514.8485100132776,"y":233.16719637431248,"rot":0.7853981633974483,"scaleX":1,"scaleY":1},{"name":"para","x":452.67252978140846,"y":421.7544227123568,"rot":4.71238898038469,"scaleX":-1,"scaleY":1}]
  },
  shirt: {
    label: "T-shirt",
    pieces: [{"name":"bigA","x":603.7037543570198,"y":812.8047271838872,"rot":0.7853981633974483,"scaleX":1,"scaleY":1},{"name":"bigB","x":425.15680606727267,"y":637.7982848803605,"rot":3.926990816987241,"scaleX":1,"scaleY":1},{"name":"mid","x":688.7298209406435,"y":461.84285909446515,"rot":-1.5707963267948966,"scaleX":-1,"scaleY":1},{"name":"smallA","x":822.5830966586492,"y":593.2245176632538,"rot":-0.7853981633974483,"scaleX":1,"scaleY":1},{"name":"smallB","x":555.1777450126175,"y":418.196198277467,"rot":5.497787143782139,"scaleX":-1,"scaleY":1},{"name":"square","x":422.86749094495457,"y":461.02158958372365,"rot":1.5707963267948966,"scaleX":1,"scaleY":1},{"name":"para","x":247.0065216972449,"y":549.4099372320421,"rot":0.7853981633974483,"scaleX":1,"scaleY":-1}]
  },
  fir: {
    label: "Sapin",
    pieces: [{"name":"bigA","x":486.96278199058713,"y":733.1798964497282,"rot":0.7853981633974483,"scaleX":1,"scaleY":1},{"name":"bigB","x":505.71236766668983,"y":348.90953241006156,"rot":4.71238898038469,"scaleX":1,"scaleY":1},{"name":"mid","x":502.37050496324235,"y":133.6815355828985,"rot":-1.5707963267948966,"scaleX":-1,"scaleY":1},{"name":"smallA","x":619.5453034630647,"y":601.7500434766415,"rot":-0.7853981633974483,"scaleX":-1,"scaleY":-1},{"name":"smallB","x":619.5453034630648,"y":778.586098609851,"rot":7.068583470577037,"scaleX":-1,"scaleY":1},{"name":"square","x":486.9627819905872,"y":908.7135730059487,"rot":1.5707963267948966,"scaleX":1,"scaleY":1},{"name":"para","x":398.5616660415809,"y":556.7041365786268,"rot":2.356194490192345,"scaleX":-1,"scaleY":-1}]
  },
  heart: {
    label: "Coeur",
    pieces: [{"name":"bigA","x":609.1518412751135,"y":551.1664749331123,"rot":4.71238898038469,"scaleX":1,"scaleY":-1},{"name":"bigB","x":355.71230550125637,"y":299.83520679622455,"rot":4.71238898038469,"scaleX":1,"scaleY":1},{"name":"mid","x":297.38650487849185,"y":488.0008408646685,"rot":-2.356194490192345,"scaleX":-1,"scaleY":1},{"name":"smallA","x":422.3229481615893,"y":551.0258635445948,"rot":-3.141592653589793,"scaleX":-1,"scaleY":1},{"name":"smallB","x":605.7838504462874,"y":239.63319778083547,"rot":4.71238898038469,"scaleX":-1,"scaleY":1},{"name":"square","x":484.8206495919233,"y":676.2032786936892,"rot":2.356194490192345,"scaleX":1,"scaleY":1},{"name":"para","x":670.2092077065881,"y":364.33210900155626,"rot":0,"scaleX":1,"scaleY":1}]
  }
}

  let PIECES = []
  let COLORS = []



function initTangram(canvasOrCtx, width, height) {
  // -- reset complet --
  pieces.length = 0;
  drawOrder.length = 0;
  selectedPiece = null;


  if (canvasOrCtx.getContext) {
    ctx = canvasOrCtx.getContext("2d");
    WIDTH = canvasOrCtx.width;
    HEIGHT = canvasOrCtx.height;
  } else {
    ctx = canvasOrCtx;
    WIDTH = width;
    HEIGHT = height;
  }

  // On définit la taille de base du carré tangram
  const S = Math.min(WIDTH, HEIGHT) * 0.5
  const cx = WIDTH/2, cy = HEIGHT/2;       // centre plateau
  const sq2 = Math.sqrt(2)
  
  /*
  
  TODO:
  - palette et themes custom, choisi au début
  - petite image cible téléchargeable 
  - separer du labyrinthe 
  */
  
  // Palette vive
  const palette = ["#ff3838","#ff9f1a","#fffa65","#32ff7e", "#18dcff","#7d5fff","#e84393"];
                  
//  const colors = ["red","green","blue","orange","pink","purple","black"]
  const triIsoRight = (a) => ([
    {x:-a/4, y:-a/2}, {x:-a/4, y:a/2}, {x:a/4, y:0}
  ]);
  const square = (a) => ([
    {x:-a/2,y:-a/2}, {x:a/2,y:-a/2}, {x:a/2,y:a/2}, {x:-a/2,y:a/2}
  ]);
  const parallelogram = (a,h) => ([
    {x:-(a+h)/2,y:-h/2}, {x:(a-h)/2,y:-h/2}, {x:(a+h)/2,y:h/2}, {x:-(a-h)/2,y:h/2}
  ]);
  
  PIECES = {
    bigA: triIsoRight(S),
    bigB: triIsoRight(S),
    mid: triIsoRight(S / sq2),
    smallA: triIsoRight(S / 2),
    smallB: triIsoRight(S / 2),
    square: square(S * sq2 / 4),
    para: parallelogram(S / 2, S / 4)
  }
  
  
  COLORS = {}
  Object.keys(PIECES).forEach((k, i) => {
    COLORS[k] = palette[i%(palette.length)]
  })
  /*
  function add(name, pts, ox, oy, rot, col) {
    pieces.push({name, pts, x: ox, y: oy, rot: rot||0, scaleX:1, scaleY:1, color:col});
    drawOrder.push(name);
  }

  // --- Placement en carré (tangram classique) ---
  add("bigA", triIsoRight(S), cx-S/4, cy, 0, colors[0]);
  add("bigB", triIsoRight(S), cx, cy-S/4, Math.PI/2, colors[1]);
  add("mid", triIsoRight(S/sq2), cx+S*3/8, cy+S*3/8, Math.PI/4, colors[2]);
  add("smallA", triIsoRight(S/2), cx-S/4, cy+3/8*S, -Math.PI/2, colors[3]);
  add("smallB", triIsoRight(S/2), cx+S/8, cy, Math.PI, colors[4]);
  add("square", square(S*sq2/4), cx, cy+S/4, Math.PI/4, colors[5]);
  add("para", parallelogram(S/2,S/4), cx+3/8*S, cy-S/8, Math.PI/2, colors[6]);
  */
  importFigure(FIGURES["square"].pieces)
//  redrawScene();
  
}
  function makePiecesArray(fig) {
    return fig.map(p => ({
      name:p.name,
      pts:PIECES[p.name],
      x:p.x,
      y:p.y,
      rot:p.rot,
      scaleX:p.scaleX,
      scaleY:p.scaleY,
      color:COLORS[p.name]
    }))
  }
  
  function exportFigure() {
    // TODO KEEP DRAW ORDER
    return pieces.map(p => ({
      name: p.name,
      x: p.x,
      y: p.y,
      rot: p.rot,
      scaleX: p.scaleX,
      scaleY: p.scaleY,
    }));
  }
  
  function importFigure(fig) {
    drawOrder.length = 0;
    pieces = makePiecesArray(fig)
    
    for (const p of fig) {
      drawOrder.push(p.name);
    }
    redrawScene();
  }

  function getPieceByName(name) {
    return pieces.find(p => p.name === name) || null;
  }

  function move(name, X, Y) {
    const p = getPieceByName(name);
    if (p) {
      p.x = X;
      p.y = Y;
      snapPiece(name)
    }
  }

  function rotate(name, radians) {
    const p = getPieceByName(name);
    
    if (p) {
      let sign = (p.scaleX*p.scaleY > 0? 1:-1) 
      p.rot += sign*radians;
    }
  }

  function mirrorH(name) {
    const p = getPieceByName(name);
    if (!p) return;
    p.scaleX = (p.scaleX || 1) * -1;
  }
  
  function mirrorV(name) {
    const p = getPieceByName(name);
    if (!p) return;
    p.scaleY = (p.scaleY || 1) * -1;
  }
 
  // selection
  function bringToFront(name) {
    const idx = drawOrder.indexOf(name);
    if (idx >= 0) {
      drawOrder.splice(idx,1);
      drawOrder.push(name);
    }
  }

  function getObjectAt(X, Y) {
    for (let i = drawOrder.length - 1; i >= 0; i--) {
      const name = drawOrder[i];
      const p = getPieceByName(name);
      if (!p) continue;
      if (pointInPiece(p, X, Y)) {
        bringToFront(name);
        return {name, x: p.x, y:p.y};
      }
    }
    return null;
  }

  function selectObjectAt(X,Y) {
    const hit = getObjectAt(X,Y);
    if (hit) selectedPiece = hit.name;
    else selectedPiece = null;
    return hit;
  }
  
  function matchCurrentFigureWith(figname, tol=0.05) {
    return compareFigures(makePiecesArray(FIGURES[figname].pieces), pieces, 128, tol)
  }

  function getSelectedObject() {
    return selectedPiece ? getPieceByName(selectedPiece) : null;
  }
  
  // Dessin
  function redrawScene() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);

    ctx.fillStyle = "#333";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    for (const name of drawOrder) {
      const p = getPieceByName(name);
      if (!p) continue;
      drawPiece(p, p.name === selectedPiece);
    }
  }

  function drawPiece(p, highlight=false) {
    ctx.beginPath();
    
    let p0 = localToWorld(p.pts[0], p)
    ctx.moveTo(p0.x,p0.y);
    for (let i=1;i<p.pts.length;i++) {
      let pi = localToWorld(p.pts[i], p)
      ctx.lineTo(pi.x,pi.y);
    }
    
    ctx.closePath();

    ctx.fillStyle = p.color;
    ctx.strokeStyle = highlight ? "white" : "white";
    ctx.lineWidth = highlight ? 20 : 6;

    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.shadowBlur = highlight ?80:0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fill();
    ctx.shadowColor = "transparent";
    
    ctx.save()
    ctx.clip()
    ctx.stroke()
    ctx.restore()
    

  }

  // === Near-vertex ===
  function nearestVertex(name, X, Y, tolerance=12) {
    const p = getPieceByName(name);
    if (!p) return null;
    const verts = transformedVertices(p);
    for (const v of verts) {
      const dx = X - v.x, dy = Y - v.y;
      if (dx*dx+dy*dy <= tolerance*tolerance) {
        return v; // retourne coordonnées du sommet
      }
    }
    return null;
  }

  // transforme un point local (px,py) en coordonnées monde selon p.scaleX, p.scaleY, p.rot, p.x, p.y
  function localToWorld(pt, p) {
    const c = Math.cos(p.rot);
    const s = Math.sin(p.rot);
    let x = pt.x * c - pt.y * s;
    let y = pt.x * s + pt.y * c;
    x *= p.scaleX;
    y *= p.scaleY;
  
    return { x: x + p.x, y: y + p.y };
  }
  
  // retourne la liste des vertices en coordonnées monde
  function transformedVertices(p) {
    return p.pts.map(pt => localToWorld(pt, p));
  }

  function pointInPiece(p, X, Y) {
    ctx.beginPath();
    let p0 = localToWorld(p.pts[0], p)
    ctx.moveTo(p0.x,p0.y);
    for (let i=1;i<p.pts.length;i++) {
      let pi = localToWorld(p.pts[i], p)
      ctx.lineTo(pi.x,pi.y);
    }
    ctx.closePath();
    const hit = ctx.isPointInPath(X,Y);
    return hit;
  }


// === Ajout Snap (sommet + arête) ===

function nearestEdge(targetName, X, Y, tolerance=12) {
  for (const p of pieces) {
    if (p.name === targetName) continue;
    const verts = transformedVertices(p);
    for (let i=0;i<verts.length;i++){
      const a = verts[i];
      const b = verts[(i+1)%verts.length];
      const dist = pointSegmentDistance({x:X,y:Y}, a, b);
      if (dist <= tolerance) {
        return {a,b,dist, piece:p.name};
      }
    }
  }
  return null;
}

function pointSegmentDistance(p, a, b) {
  const vx = b.x - a.x, vy = b.y - a.y;
  const wx = p.x - a.x, wy = p.y - a.y;
  const c1 = vx*wx + vy*wy;
  if (c1 <= 0) return Math.hypot(p.x-a.x, p.y-a.y);
  const c2 = vx*vx + vy*vy;
  if (c2 <= c1) return Math.hypot(p.x-b.x, p.y-b.y);
  const t = c1/c2;
  const projx = a.x + t*vx, projy = a.y + t*vy;
  return Math.hypot(p.x-projx, p.y-projy);
}

function snapPiece(name, tolerance=15) {
  const p = getPieceByName(name);
  if (!p) return;

  const verts = transformedVertices(p);
  let moves = [];

  // 1. Snap sommet-sommet
  for (const v of verts) {
    for (const q of pieces) {
      if (q.name === name) continue;
      const qverts = transformedVertices(q);
      for (const qv of qverts) {
        const dx = qv.x - v.x, dy = qv.y - v.y;
        if (dx*dx + dy*dy <= tolerance*tolerance) {
          moves.push({dx, dy});
        }
      }
    }
  }

  // 2. Snap sommet-arête
  for (const v of verts) {
    const e = nearestEdge(name, v.x, v.y, tolerance);
    if (e) {
      const proj = projectPointOnSegment(v, e.a, e.b);
      const dx = proj.x - v.x, dy = proj.y - v.y;
      moves.push({dx, dy});
    }
  }

  // Appliquer déplacement global (moyenne des snaps)
  if (moves.length > 0) {
    const dx = moves.reduce((s,m)=>s+m.dx,0) / moves.length;
    const dy = moves.reduce((s,m)=>s+m.dy,0) / moves.length;
    p.x += dx;
    p.y += dy;
  }
}


function projectPointOnSegment(p, a, b) {
  const vx = b.x - a.x, vy = b.y - a.y;
  const wx = p.x - a.x, wy = p.y - a.y;
  const c1 = vx*wx + vy*wy;
  const c2 = vx*vx + vy*vy;
  let t = 0;
  if (c2>0) t = Math.max(0, Math.min(1, c1/c2));
  return {x: a.x + t*vx, y: a.y + t*vy};
}

function renderFigureToImage(fig, size=128, margin=10, useColors=false) {

  const cvs = document.createElement("canvas");
  cvs.width = size;
  cvs.height = size;
  const ctx = cvs.getContext("2d");

  // calcul bounding box
  let allPts = [];
  for (const p of fig) {
    const verts = transformedVertices(p);
    allPts.push(...verts);
  }
  const minX = Math.min(...allPts.map(v=>v.x));
  const maxX = Math.max(...allPts.map(v=>v.x));
  const minY = Math.min(...allPts.map(v=>v.y));
  const maxY = Math.max(...allPts.map(v=>v.y));
  const w = maxX - minX, h = maxY - minY;
  const scale = (size - 2*margin) / Math.max(w,h);

  // dessiner en noir
  ctx.fillStyle = "black"
  ctx.fillRect(0,0,size,size)
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  for (const p of fig) {
    if (useColors) {
      ctx.fillStyle = p.color
      ctx.strokeStyle = "white"
    }
    const verts = transformedVertices(p);
    ctx.beginPath();
    verts.forEach((v,i) => {
      const x = (v.x - minX - w/2) * scale + size/2;
      const y = (v.y - minY - h/2) * scale + size/2;
      if (i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  return ctx.getImageData(0,0,size,size);
}

function compareFigures(figA, figB, size=128, tol=0.05) {
  const imgA = renderFigureToImage(figA, size);
  const imgB = renderFigureToImage(figB, size);

  let diff = 0, total = imgA.data.length/4;
  for (let i=0;i<imgA.data.length;i+=4) {
    const a = imgA.data[i]; // R
    const b = imgB.data[i];
    if ((a>128)!==(b>128)) diff++;
  }

  const ratio = diff/total;
  return { match: ratio <= tol, ratio, diff, total};
}
return {
  initTangram,
  move,
  rotate,
  mirrorH,
  mirrorV,
  getObjectAt,
  selectObjectAt,
  getSelectedObject,
  redrawScene,
  nearestVertex,
  nearestEdge,
  snapPiece,
  
  FIGURES,
  exportFigure,
  makePiecesArray,
  matchCurrentFigureWith,
  renderFigureToImage
};
})();