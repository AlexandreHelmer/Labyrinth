
/* === TEXTURES === */
function makeWallSVG(color1, color2, brickH) {
  return "data:image/svg+xml;base64," + btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="${color1}"/>
      <g stroke="${color2}" stroke-width="4">
        ${Array.from({length:Math.floor(100/brickH)},(_,i)=>`<line x1="0" y1="${i*brickH}" x2="100" y2="${i*brickH}"/>`).join("")}
        ${brickH<40?`<line x1="50" y1="0" x2="50" y2="100"/>`:``}
      </g>
    </svg>`
  );
}

function makeFloorSVG(tile) {
  const palette = ["#d9c6a5","#cbb891","#bfa76f","#d2b48c","#c9ad7f"];
  let rects="";
  for(let y=0;y<100;y+=tile){
    for(let x=0;x<100;x+=tile){
      let color = palette[Math.floor(Math.random()*palette.length)];
      rects+=`<rect x="${x}" y="${y}" width="${tile}" height="${tile}" fill="${color}" />`;
    }
  }
  return "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">${rects}</svg>
  `);
}

/*
const wallTextures=[], floorTileTextures=[];
const brickSizes=[20,33,50], tileSizes=[20,25,40];
const wallColors=[["#b55239","#8b3a2b"],["#c0603f","#94402a"],["#a94436","#702c21"]];

for (let [c1,c2] of wallColors) for (let h of brickSizes){ let img=new Image(); img.src=makeWallSVG(c1,c2,h); wallTextures.push(img); }

for (let t of tileSizes){
  let img=new Image();
  let name = "tilesets/floor_tile/"+t
  
  img.src=makeFloorSVG(t);
  storeImage(name, img)
 // floorTileTextures.push(name);
}
*/

  
function makeMinimalWallTileFromBase(baseImgSrc, mask, margin = 0) {
  const size = 100;
  let cuts = "";

  // côtés ouverts → on perce une bande
  if (!(mask & 1)) cuts += `<rect x="0" y="0" width="${size}" height="${margin}" fill="black"/>`;              // haut
  if (!(mask & 2)) cuts += `<rect x="${size-margin}" y="0" width="${margin}" height="${size}" fill="black"/>`; // droite
  if (!(mask & 4)) cuts += `<rect x="0" y="${size-margin}" width="${size}" height="${margin}" fill="black"/>`; // bas
  if (!(mask & 8)) cuts += `<rect x="0" y="0" width="${margin}" height="${size}" fill="black"/>`;              // gauche

  // coins intérieurs → on perce un petit carré
  if ((mask & 1) && (mask & 8)) cuts += `<rect x="0" y="0" width="${margin}" height="${margin}" fill="black"/>`; // coin TL
  if ((mask & 1) && (mask & 2)) cuts += `<rect x="${size-margin}" y="0" width="${margin}" height="${margin}" fill="black"/>`; // coin TR
  if ((mask & 4) && (mask & 8)) cuts += `<rect x="0" y="${size-margin}" width="${margin}" height="${margin}" fill="black"/>`; // coin BL
  if ((mask & 4) && (mask & 2)) cuts += `<rect x="${size-margin}" y="${size-margin}" width="${margin}" height="${margin}" fill="black"/>`; // coin BR

  return "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        <mask id="cutmask">
          <rect width="${size}" height="${size}" fill="white"/>
          ${cuts}
        </mask>
      </defs>
      <image href="${baseImgSrc}" width="${size}" height="${size}" mask="url(#cutmask)"/>
    </svg>
  `);
}

function buildWallTiles() {
  const tileset = [];
  const baseSrc = wallTextures[0].src;
  for (let mask = 0; mask < 16; mask++) {
    let img = new Image();
    img.src = makeMinimalWallTileFromBase(baseSrc, mask, 20);
    
    let name = "tilesets/brick_wall/"+mask
    storeImage(name, img)
  }
}
//buildWallTiles();
//