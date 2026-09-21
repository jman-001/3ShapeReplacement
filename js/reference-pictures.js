const referencePictures = [
  { 
    product: "TRIOS 6", title: "Scanner - Front", 
    image: "../assets/images/reference/trios6/scanner-front.jpg", description: "Front view of the TRIOS 6 scanner." 
  },
  { 
    product: "TRIOS 6", title: "Scanner - Back", 
    image: "../assets/images/reference/trios6/scanner-back.jpg", description: "Rear view of the TRIOS 6 scanner." 
  },
  { 
    product: "TRIOS 6", title: "Scanner - Bottom",
     image: "../assets/images/reference/trios6/scanner-bottom.jpg", description: "Bottom view and connection reference." 
  },
//--------------
// TRIOS 5
//-------------
  {
    product: "TRIOS 5", title: "Scanner - Front", 
    image: "../assets/images/reference/trios5/Front.jpg", description: "Front view of the TRIOS 5 scanner." 
  },
//--------------
// TRIOS 4
//--------------
  { 
    product: "TRIOS 4", title: "Scanner - Front", 
    image: "../assets/images/reference/trios4/Front.jpg", description: "Front view of the TRIOS 4 scanner."
  },
    { 
    product: "TRIOS 4", title: "Scanner - Tips bottom", 
    image: "../assets/images/reference/trios4/Tips.jpg", description: "View of the serial number and golden connectors."
  },
    { 
    product: "TRIOS 4", title: "Scanner - Back", 
    image: "../assets/images/reference/trios4/Back.jpg", description: "Back view of the TRIOS 4 scanner."
  },
    { 
    product: "TRIOS 4", title: "Scanner - Side", 
    image: "../assets/images/reference/trios4/Side with TIP.jpg", description: "Side view of the TRIOS 4 scanner."
  },
//--------------
// TRIOS 3
//--------------
  { product: "TRIOS 3", title: "Scanner - Front",
     image: "../assets/images/reference/trios3/scanner-front.jpg", description: "Front view of the TRIOS 3 scanner." 
  },
  { product: "TRIOS 3", title: "Scanner - Front", 
    image: "../assets/images/reference/trios3/scanner-front.jpg",
    description: "Front view of the TRIOS Core scanner." }
];
const categories=["ALL","TRIOS 6","TRIOS 5","TRIOS 4","TRIOS 3"];let activeCategory="ALL", visible=[], currentIndex=0;
const gallery=document.querySelector("#gallery"),filters=document.querySelector("#filters"),search=document.querySelector("#searchInput"),empty=document.querySelector("#empty"),lightbox=document.querySelector("#lightbox");
function renderFilters(){filters.innerHTML=categories.map(c=>`<button class="filter ${c===activeCategory?'active':''}" data-category="${c}">${c}</button>`).join('');}
function renderGallery(){const q=search.value.trim().toLowerCase();visible=referencePictures.filter(p=>(activeCategory==='ALL'||p.product===activeCategory)&&(`${p.product} ${p.title} ${p.description}`).toLowerCase().includes(q));gallery.innerHTML=visible.map((p,i)=>`<article class="card" data-index="${i}" tabindex="0"><div class="image-wrap"><img src="${p.image}" alt="${p.title}, ${p.product}" loading="lazy"></div><h2>${p.title}</h2><div class="meta">${p.product}</div><p class="description">${p.description}</p></article>`).join('');empty.hidden=visible.length>0;}
function openPicture(i){currentIndex=i;const p=visible[i];if(!p)return;document.querySelector('#lightboxImage').src=p.image;document.querySelector('#lightboxImage').alt=`${p.title}, ${p.product}`;document.querySelector('#lightboxModel').textContent=p.product;document.querySelector('#lightboxTitle').textContent=p.title;document.querySelector('#lightboxDescription').textContent=p.description;if(!lightbox.open)lightbox.showModal();}
filters.addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;activeCategory=b.dataset.category;renderFilters();renderGallery();});search.addEventListener('input',renderGallery);gallery.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openPicture(+c.dataset.index)});gallery.addEventListener('keydown',e=>{const c=e.target.closest('.card');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openPicture(+c.dataset.index)}});document.querySelector('#closeLightbox').onclick=()=>lightbox.close();document.querySelector('#prevPicture').onclick=()=>openPicture((currentIndex-1+visible.length)%visible.length);document.querySelector('#nextPicture').onclick=()=>openPicture((currentIndex+1)%visible.length);document.addEventListener('keydown',e=>{if(!lightbox.open)return;if(e.key==='ArrowLeft')document.querySelector('#prevPicture').click();if(e.key==='ArrowRight')document.querySelector('#nextPicture').click();});lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});renderFilters();renderGallery();