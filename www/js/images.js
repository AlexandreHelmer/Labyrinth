const imageCache = {};

/* Precharger les images */
function preloadAllSkins(callback) {
  const files = [];
  for (let key in SKINS) {
    files.push(SKINS[key].player, SKINS[key].goal);
  }
  let loaded = 0;
  files.forEach(src => {
    const img = new Image();
    img.onload = () => {
      imageCache[src]=img;
      if (++loaded === files.length && callback) callback(); };
    img.src = "images/"+src;
  });
}

function storeImage(src, img) {
    imageCache[src] = img
}

function getImageSync(src) {
  return imageCache[src]; 
}

async function getImage(src) {
  // déjà en cache et chargée
  if (imageCache[src]?.complete) {
    return imageCache[src];
  }

  // pas encore en cache → créer et attendre le chargement
  if (!imageCache[src]) {
    imageCache[src] = new Image();
    imageCache[src].src = "images/"+src;
  }

  // attendre le onload si pas encore chargé
  if (!imageCache[src].complete) {
    await new Promise(resolve => {
      imageCache[src].onload = () => resolve();
      imageCache[src].onerror = () => resolve(); // éviter blocage en cas d'erreur
    });
  }

  return imageCache[src];
}

function listCacheKeys(prefix) {
  return Object.keys(imageCache).filter(key => key.startsWith(prefix));
}



// Utilitaire pour télécharger les images
// permet de transformer en png mes SVG générés 
function showImages(prefix="") {
  // conteneur
  let container = document.getElementById("image-gallery");
  if (!container) {
    container = document.createElement("div");
    container.id = "image-gallery";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.gap = "10px";
    container.style.background = "#eee";
    container.style.padding = "10px";
    document.body.appendChild(container);
  }

  // vider avant réinjection
  container.innerHTML = "";

  // ajouter chaque image du cache
  Object.keys(imageCache)
    .filter(k => k.startsWith(prefix))
    .forEach(k => {
      const img = document.createElement("img");
      img.src = imageCache[k].src;
      img.title = k;
      img.style.width = "100px";
      img.style.height = "100px";
      img.style.objectFit = "contain";
      img.style.cursor = "pointer";

      // clic → télécharger
      img.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = k.split("/").pop();
        a.click();
      });

      container.appendChild(img);
    });
}

function showImagesAsPNG(prefix="") {
  let container = document.getElementById("image-gallery");
  if (!container) {
    container = document.createElement("div");
    container.id = "image-gallery";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.gap = "10px";
    container.style.background = "#eee";
    container.style.padding = "10px";
    document.body.appendChild(container);
  }
  container.innerHTML = "";

  Object.keys(imageCache)
    .filter(k => k.startsWith(prefix))
    .forEach(k => {
      const srcImg = imageCache[k];
      if (!srcImg) return;
      
      // convertir en PNG 64x64
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(srcImg, 0, 0, 64, 64);
      const pngUrl = canvas.toDataURL("image/png");

      const img = document.createElement("img");
      img.src = pngUrl;
      img.title = k;
      img.style.width = "64px";
      img.style.height = "64px";
      img.style.objectFit = "contain";
      img.style.cursor = "pointer";
      // clic → télécharger
      img.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = (k.split("/").pop() || "texture") + ".png";
        a.click();
      });

      container.appendChild(img);
    });
}