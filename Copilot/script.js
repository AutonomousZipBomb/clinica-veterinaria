/* script.js
   Validaciones, carrusel de testimonios, manejo de formulario y modal,
   registro de service worker (intento seguro), y mejoras de accesibilidad.
*/

/* ---------- Datos de testimonios (10) ---------- */
const testimonials = [
  {name:"María R.", text:"¡Excelente atención! Mi perro está como nuevo 🐶❤️", emoji:"🐾", img:"https://randomuser.me/api/portraits/women/21.jpg"},
  {name:"Juan P.", text:"Profesionales y muy amables. Recomendados 👍", emoji:"✨", img:"https://randomuser.me/api/portraits/men/32.jpg"},
  {name:"Carla S.", text:"La cirugía fue un éxito. Gracias por todo 🙏", emoji:"🩺", img:"https://randomuser.me/api/portraits/women/12.jpg"},
  {name:"Luis M.", text:"Servicio rápido y precios justos. 🐕‍🦺", emoji:"💚", img:"https://randomuser.me/api/portraits/men/44.jpg"},
  {name:"Ana G.", text:"La peluquería dejó a mi gato hermoso 😻", emoji:"✂️", img:"https://randomuser.me/api/portraits/women/34.jpg"},
  {name:"Pedro L.", text:"Atención 24/7 en emergencias. Muy agradecido 🙌", emoji:"🚑", img:"https://randomuser.me/api/portraits/men/55.jpg"},
  {name:"Sofía T.", text:"Explican todo con detalle y paciencia. Excelente 👩‍⚕️", emoji:"📋", img:"https://randomuser.me/api/portraits/women/56.jpg"},
  {name:"Miguel R.", text:"Mi mascota superó su enfermedad gracias al equipo 🐾", emoji:"🌟", img:"https://randomuser.me/api/portraits/men/66.jpg"},
  {name:"Laura F.", text:"Instalaciones limpias y modernas. Muy contenta 😊", emoji:"🏥", img:"https://randomuser.me/api/portraits/women/78.jpg"},
  {name:"Roberto C.", text:"Atención humana y profesional. Volveré sin duda 👍", emoji:"💯", img:"https://randomuser.me/api/portraits/men/88.jpg"}
];

/* ---------- Renderizar testimonios en carrusel (4 por vista) ---------- */
const track = document.getElementById('testimonialTrack');
const indicator = document.getElementById('testIndicator');

function createTestimonialCard(item, idx){
  const card = document.createElement('article');
  card.className = 'testimonial rainbow';
  card.setAttribute('role','article');
  card.setAttribute('aria-label', `Testimonio de ${item.name}`);
  card.innerHTML = `
    <div class="meta">
      <img class="avatar beat" src="${item.img}" alt="Foto de ${item.name}">
    </div>
    <div class="content">
      <div class="name">${item.name} <span class="small text-muted">· Cliente</span></div>
      <p class="text">${item.text} <span aria-hidden="true">${item.emoji}</span></p>
      <div class="small text-muted"><i class="fa-solid fa-star text-warning"></i> Recomendado</div>
    </div>
  `;
  return card;
}

/* Insert cards */
testimonials.forEach((t, i) => {
  track.appendChild(createTestimonialCard(t, i));
});

/* Carousel logic */
let currentIndex = 0;
const total = testimonials.length;
const perView = 4;

function updateCarousel(){
  const containerWidth = track.parentElement.clientWidth;
  const card = track.querySelector('.testimonial');
  if(!card) return;
  const cardStyle = getComputedStyle(card);
  const gap = parseFloat(cardStyle.marginRight || 12) || 12;
  const cardWidth = card.getBoundingClientRect().width + gap;
  const visible = Math.max(1, Math.floor(containerWidth / cardWidth));
  // Use fixed perView but responsive fallback
  const show = Math.min(perView, visible);
  const maxIndex = Math.max(0, Math.ceil(total / show) - 1);
  if(currentIndex > maxIndex) currentIndex = maxIndex;
  const translateX = -(currentIndex * (cardWidth * show));
  track.style.transform = `translateX(${translateX}px)`;
  indicator.textContent = `Página ${currentIndex + 1} de ${maxIndex + 1}`;
}

/* Prev/Next buttons */
document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = Math.max(0, currentIndex - 1);
  updateCarousel();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  const containerWidth = track.parentElement.clientWidth;
  const card = track.querySelector('.testimonial');
  const gap = card ? parseFloat(getComputedStyle(card).marginRight || 12) : 12;
  const cardWidth = card ? card.getBoundingClientRect().width + gap : 300;
  const visible = Math.max(1, Math.floor(containerWidth / cardWidth));
  const show = Math.min(perView, visible);
  const maxIndex = Math.max(0, Math.ceil(total / show) - 1);
  currentIndex = Math.min(maxIndex, currentIndex + 1);
  updateCarousel();
});

/* Resize observer for responsiveness */
window.addEventListener('resize', () => {
  updateCarousel();
});
window.addEventListener('load', () => {
  updateCarousel();
});

/* ---------- Form validation y envío (simulado con mailto) ---------- */
const form = document.getElementById('contactForm');
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'), {keyboard:true});
const modalCopyBtn = document.getElementById('modalCopy');

function validateEmail(email){
  // Validación básica y segura
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Validación manual
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let valid = true;

  if(!name){ form.name.classList.add('is-invalid'); valid = false; } else { form.name.classList.remove('is-invalid'); }
  if(!validateEmail(email)){ form.email.classList.add('is-invalid'); valid = false; } else { form.email.classList.remove('is-invalid'); }
  if(!message){ form.message.classList.add('is-invalid'); valid = false; } else { form.message.classList.remove('is-invalid'); }

  if(!valid) return;

  // Preparar mailto
  const subject = encodeURIComponent(`Contacto desde sitio - ${name}`);
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
  const mailto = `mailto:contacto@vidaanimal.do?subject=${subject}&body=${body}`;

  // Intentar abrir cliente de correo
  window.location.href = mailto;

  // Mostrar modal de confirmación simulada
  confirmModal.show();
});

/* Botón "Abrir correo" que también abre mail client y muestra modal */
document.getElementById('mailtoBtn').addEventListener('click', () => {
  const name = form.name.value.trim() || 'Nombre';
  const email = form.email.value.trim() || 'correo@ejemplo.com';
  const message = form.message.value.trim() || 'Mensaje de prueba';
  const subject = encodeURIComponent(`Contacto desde sitio - ${name}`);
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
  const mailto = `mailto:contacto@vidaanimal.do?subject=${subject}&body=${body}`;
  window.location.href = mailto;
  confirmModal.show();
});

/* Copiar contenido del correo al portapapeles */
modalCopyBtn.addEventListener('click', async () => {
  const name = form.name.value.trim() || 'Nombre';
  const email = form.email.value.trim() || 'correo@ejemplo.com';
  const message = form.message.value.trim() || 'Mensaje de prueba';
  const content = `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`;
  try{
    await navigator.clipboard.writeText(content);
    modalCopyBtn.textContent = 'Copiado ✓';
    setTimeout(()=> modalCopyBtn.textContent = 'Copiar contenido', 2000);
  }catch(err){
    modalCopyBtn.textContent = 'No se pudo copiar';
    setTimeout(()=> modalCopyBtn.textContent = 'Copiar contenido', 2000);
  }
});

/* Detectar apertura del navegador o intento de abrir app de correo:
   - Mostramos modal al cargar la página (simulacro) y cuando el usuario intenta abrir mailto.
   - También detectamos visibilidad de la página para mostrar un recordatorio.
*/
window.addEventListener('load', () => {
  // Mostrar modal suave al cargar para simular detección de app de correo
  setTimeout(()=> {
    // Solo mostrar si no hay interacción previa
    if(document.visibilityState === 'visible'){
      // No forzamos si el usuario ya cerró la modal en esta sesión
      if(!sessionStorage.getItem('modalShown')){
        confirmModal.show();
        sessionStorage.setItem('modalShown','1');
      }
    }
  }, 900);
});

document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'hidden'){
    // El usuario cambió de pestaña o abrió otra app; mostramos modal al volver
    sessionStorage.setItem('leftPage','1');
  } else {
    if(sessionStorage.getItem('leftPage')){
      confirmModal.show();
      sessionStorage.removeItem('leftPage');
    }
  }
});

/* ---------- Mejoras de accesibilidad y enlaces telefónicos ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    // Smooth scroll handled by CSS scroll-behavior; ensure focus for a11y
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    }
  });
});

/* Teléfono: enlace click-to-call (compatible con móviles) */
const phoneEls = document.querySelectorAll('.phone-number');
phoneEls.forEach(el => {
  const tel = '+18095550123';
  const link = document.createElement('a');
  link.href = `tel:${tel}`;
  link.className = 'stretched-link text-decoration-none text-reset';
  link.setAttribute('aria-label','Llamar a la clínica');
  el.parentElement.style.position = 'relative';
  el.parentElement.appendChild(link);
});

/* ---------- Service Worker: registro seguro (intento) ---------- */
if('serviceWorker' in navigator){
  // Intentamos registrar un service worker si existe; no es obligatorio para el funcionamiento.
  navigator.serviceWorker.register('/sw.js').catch(err => {
    // Registro fallido: no hacemos nada, solo log para desarrolladores.
    console.debug('ServiceWorker no registrado (esperado si no existe sw.js):', err);
  });
}

/* ---------- Analytics (simulado): evento simple para monitoreo ---------- */
function trackEvent(action, label){
  // Simulación de analítica: en producción reemplazar por Google Analytics, Plausible, etc.
  console.debug('trackEvent', action, label);
}

/* ---------- Fin de script ---------- */
