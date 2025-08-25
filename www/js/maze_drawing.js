/* === HELPERS === */
function randPick(arr){
  return arr[Math.floor(Math.random()*arr.length)];
  }

function getNeighborMask(grid, x, y, value) {
  let mask = 0;
  if (y > 0 && grid[y-1][x] === value) mask |= 1;       // haut = bit 1
  if (x < grid[0].length-1 && grid[y][x+1] === value) mask |= 2; // droite = bit 2
  if (y < grid.length-1 && grid[y+1][x] === value) mask |= 4;    // bas = bit 4
  if (x > 0 && grid[y][x-1] === value) mask |= 8;       // gauche = bit 8
  return mask; // entier 0–15
}

/* === DRAW MAZE LAYERS === */

function newLayer(grid) {
    const layer = document.createElement("canvas");
    layer.width = canvas.width;
    layer.height = canvas.height;
    return layer;
}

async function drawRoadLayer(grid, cellSize, offsetX, offsetY, tileset, filterValue=-1) {
  const layer = newLayer();
  const ctx = layer.getContext("2d");

  for (let y=0; y<grid.length; y++) {
    for (let x=0; x<grid[0].length; x++) {
      if (grid[y][x] !== filterValue) continue;

      const mask = getNeighborMask(grid, x, y, filterValue);
      
      const imgSrc = tileset[mask];
      if (!imgSrc) continue;

      const img = await getImage(imgSrc);
      ctx.drawImage(img, offsetX+x*cellSize, offsetY+y*cellSize, cellSize, cellSize);
    }
  }
  return layer;
}


async function drawObjectLayer(grid, cellSize, offsetX, offsetY, tileset, filterValue=-1) {
    const layer = newLayer();
    const ctx = layer.getContext("2d");
    
    for (let y=0; y<grid.length; y++) {
      for (let x=0; x<grid[0].length; x++) {
        const px = offsetX + x*cellSize;
        const py = offsetY + y*cellSize;

        if (grid[y][x] === filterValue || filterValue === -1) {
        
          const obj = await getImage(randPick(tileset));
          
          const scale = cellSize / obj.width;
          const w = obj.width * scale;
          const h = obj.height * scale;
          const dx = px + (cellSize - w)/2;
          const dy = py + (cellSize - h);
          ctx.drawImage(obj, dx, dy, w, h);
       }
     }
   }

   return layer;
}




const THEMES = {
  classic: {
     label: "Classique",
     icon: "tilesets/tile_floor/20.png",
     layers: [
    { z: -2, tileset: ["tilesets/tile_floor/20.png","tilesets/tile_floor/25.png","tilesets/tile_floor/40.png"]},
   // { z: -1, mode: "road", tileset: "tilesets/basic_road/", filter: 0},
    { z: -1, mode: "road", tileset: "tilesets/brick_wall2/", filter: 1},
    { z: +1, tileset: ["tilesets/misc_city/jardiniere_v_1.png","tilesets/misc_city/bush.png","tilesets/misc_city/flowers.png","tilesets/misc_city/clock_1.png","tilesets/misc_city/pool_1.png","tilesets/misc_city/pool_2.png","tree.png", "tree2.png", "tree3.png", "tree4.png"], filter: 2 }
  ]},
  
  forest: {
     label: "Forêt",
     icon: "tree.png",
     layers: [
      { z: -2, tileset: ["tilesets/grass.png"]},
   //   { z: -1, tileset: ["flower.png"], filter:0},
      { z: -1, mode: "road", tileset: "tilesets/forest_road_narrow/", filter: 0},
      { z: +2, tileset: ["tree.png", "tree2.png", "tree3.png"], filter: 1 },
  //    { z: +1, tileset: ["tree2.png"], filter: 2 }
  ]},
  
  river: {
     label: "Rivière",
     icon: "icons/river.png",
     layers: [
      { z: -2, tileset: ["tilesets/grass.png"]},
   //   { z: -1, tileset: ["flower.png"], filter:0},
      { z: -1, mode: "road", tileset: "tilesets/river/", filter: 1},
      { z: +2, tileset: ["tree.png", "tree2.png", "tree3.png"], filter: 2 },
    //  { z: +1, tileset: ["tree2.png"], filter: 2 }
  ]},
  
  beach: {
    label: "Plage",
    icon: "icons/beach.png",
    layers: [
      { z: -2, tileset: ["tilesets/tile-sable-64x64-ffd295.png"]},
   //   { z: -1, tileset: ["flower.png"], filter:0},
      { z: -1, mode: "road", tileset: "tilesets/river/", filter: 1},
     // { z: +2, tileset: ["tree.png", "tree2.png", "tree3.png", "tree4.png"], filter: 1 },
      { z: +1, tileset: ["tilesets/rock1.png"], filter: 2 }
  ]}
};


// preload
for (let th of Object.values(THEMES))
  for (let lay of th.layers)
    if (lay.mode === "road")
      for (let i=0;i<16;i++)
        getImage(lay.tileset+""+i+".png")
    else
      for (let src of lay.tileset)
        getImage(src)


async function drawMazeLayers(grid, cellSize, offsetX, offsetY, theme) {

  const layers = []
  
  for (let layerDesc of THEMES[theme].layers) {
      let layer = null
      if (layerDesc.mode === "road") {
          tileset = {}
          for (let i=0;i<16;i++)
            tileset[i] = layerDesc.tileset+""+i+".png"
            
          layer = await drawRoadLayer(grid, cellSize, offsetX, offsetY, tileset, layerDesc.filter)
      }
      else {
          layer = await drawObjectLayer(grid, cellSize, offsetX, offsetY, layerDesc.tileset, layerDesc.filter)
      }
      
      layers.push({z: layerDesc.z, layer:layer})
  }
  
  layers.sort((a,b)=> a.z - b.z)
  return layers;
}



/* === RENDU FINAL === */
// variables globales
let mazeLayers = null;

async function buildMazeLayers(grid, rows, cols, cellSize, offsetX, offsetY, theme="classic") {
   mazeLayers = await drawMazeLayers(grid, cellSize, offsetX, offsetY, theme);
}

function renderMazeFrame() {
  if (!mazeLayers) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  
  let middleLayerDrawn = false
  for (let L of mazeLayers) {
    if (!middleLayerDrawn && L.z > 0) {
      drawPlayerLayer()
      middleLayerDrawn = true
    }
   // zindex = theme[i].z
    
    ctx.drawImage(L.layer, 0,0);
  }
}
