/* ============================================================= */
/* CLÍNICA VETERINARIA PATITASFELICES - SCRIPT PRINCIPAL          */
/* ============================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =========================================================== */
  /* 1. DATOS DE TESTIMONIOS (10 CLIENTES FICTICIOS)             */
  /* =========================================================== */
  const testimonios = [
    { nombre: "María Pérez", img: "https://randomuser.me/api/portraits/women/12.jpg", texto: "Atendieron a mi gato con mucho cariño. ¡Excelente! 🐱❤️", estrellas: 5 },
    { nombre: "Juan Rodríguez", img: "https://randomuser.me/api/portraits/men/22.jpg", texto: "Mi perro salió feliz de la peluquería. Súper recomendados 🐶✂️", estrellas: 5 },
    { nombre: "Carla Fernández", img: "https://randomuser.me/api/portraits/women/33.jpg", texto: "La cirugía fue un éxito. Profesionales de verdad 🩺👏", estrellas: 5 },
    { nombre: "Pedro Gómez", img: "https://randomuser.me/api/portraits/men/41.jpg", texto: "Atención rápida y precios justos. Volveré seguro 💚", estrellas: 4 },
    { nombre: "Lucía Martínez", img: "https://randomuser.me/api/portraits/women/52.jpg", texto: "Me explicaron todo con paciencia. Gracias equipo 🙏🐾", estrellas: 5 },
    { nombre: "Andrés Castillo", img: "https://randomuser.me/api/portraits/men/63.jpg", texto: "El mejor trato para mi cachorro. ¡Cinco estrellas! ⭐🐕", estrellas: 5 },
    { nombre: "Sofía Ramírez", img: "https://randomuser.me/api/portraits/women/71.jpg", texto: "Instalaciones limpias y modernas. Muy confiables ✨", estrellas: 4 },
    { nombre: "Diego Herrera", img: "https://randomuser.me/api/portraits/men/85.jpg", texto: "Salvaron a mi gata de una infección. Eternamente agradecido 😻", estrellas: 5 },
    { nombre: "Valentina Cruz", img: "https://randomuser.me/api/portraits/women/90.jpg", texto: "Los veterinarios son amorosos con los animales 🐾❤️", estrellas: 5 },
    { nombre: "Roberto Díaz", img: "https://randomuser.me/api/portraits/men/15.jpg", texto: "Servicio de emergencia impecable. ¡Gracias totales! 🚑🐶", estrellas: 5 },
  ];

  /* =========================================================== */
  /* 2. GENERAR CARRUSEL (4 CARDS POR VISTA)                     */
  /* =========================================================== */
  const inner = document.getElementById("testimonialInner");
  const porVista = 4;

  // Construye una estrella en HTML según la cantidad
  function generarEstrellas(cantidad) {
    let html = "";
    for (let i = 0; i < 5; i++) {
      html += i < cantidad ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return html;
  }

  // Agrupa los testimonios en bloques de 4 (slides del carrusel)
  for (let i = 0; i < testimonios.length; i += porVista) {
    const grupo = testimonios.slice(i, i + porVista);

    const item = document.createElement("div");
    item.className = "carousel-item" + (i === 0 ? " active" : "");

    const grid = document.createElement("div");
    grid.className = "testimonial-grid";

    grupo.forEach(function (cliente) {
      const card = document.createElement("div");
      card.className = "testimonial-card";
      card.innerHTML = `
        <img src="${cliente.img}" alt="Foto de ${cliente.nombre}" class="testimonial-img" />
        <p class="testimonial-name">${cliente.nombre}</p>
        <div class="testimonial-stars">${generarEstrellas(cliente.estrellas)}</div>
        <p class="testimonial-text">"${cliente.texto}"</p>
      `;
      grid.appendChild(card);
    });

    item.appendChild(grid);
    inner.appendChild(item);
  }

  /* =========================================================== */
  /* 3. CONTROL MANUAL DEL CARRUSEL (BOTONES EXTERNOS)           */
  /* =========================================================== */
  const carouselEl = document.getElementById("testimonialCarousel");
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);

  document.getElementById("testPrev").addEventListener("click", function () {
    carousel.prev();
  });
  document.getElementById("testNext").addEventListener("click", function () {
    carousel.next();
  });

  /* =========================================================== */
  /* 4. VALIDACIÓN DEL FORMULARIO + ENVÍO POR CORREO            */
  /* =========================================================== */
  const form = document.getElementById("contactForm");
  const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));

  // Expresión regular para validar el formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    let valido = true;

    // Validar nombre
    if (nombre.value.trim().length < 3) {
      nombre.classList.add("is-invalid");
      valido = false;
    } else {
      nombre.classList.remove("is-invalid");
    }

    // Validar email con regex
    if (!emailRegex.test(email.value.trim())) {
      email.classList.add("is-invalid");
      valido = false;
    } else {
      email.classList.remove("is-invalid");
    }

    // Validar mensaje
    if (mensaje.value.trim().length < 10) {
      mensaje.classList.add("is-invalid");
      valido = false;
    } else {
      mensaje.classList.remove("is-invalid");
    }

    // Si todo es válido, abrir cliente de correo y mostrar modal
    if (valido) {
      const destino = "info@patitasfelices.com.do";
      const asunto = encodeURIComponent("Nueva consulta de " + nombre.value.trim());
      const cuerpo = encodeURIComponent(
        "Nombre: " + nombre.value.trim() +
        "\nCorreo: " + email.value.trim() +
        "\n\nMensaje:\n" + mensaje.value.trim()
      );
      const mailtoLink = `mailto:${destino}?subject=${asunto}&body=${cuerpo}`;

      // Mostrar el modal de confirmación (simulacro de envío)
      confirmModal.show();

      // Detectar la apertura del cliente de correo y lanzar el modal asociado.
      // Se abre la app de correo poco después para que el usuario vea la confirmación.
      setTimeout(function () {
        window.location.href = mailtoLink;
      }, 1200);

      form.reset();
    }
  });

  // Quitar el estado inválido mientras el usuario corrige los campos
  ["nombre", "email", "mensaje"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      this.classList.remove("is-invalid");
    });
  });

  /* =========================================================== */
  /* 5. SCROLL SUAVE ENTRE SECCIONES                            */
  /* =========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
    enlace.addEventListener("click", function (e) {
      const destino = document.querySelector(this.getAttribute("href"));
      if (destino) {
        e.preventDefault();
        const offset = 70; // altura del navbar fijo
        const posicion = destino.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: posicion, behavior: "smooth" });

        // Cerrar el menú colapsado en móvil tras hacer clic
        const navMenu = document.getElementById("navMenu");
        if (navMenu.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
      }
    });
  });
});
