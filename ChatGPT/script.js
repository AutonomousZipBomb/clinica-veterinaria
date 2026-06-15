/* =======================================================
   CLÍNICA VETERINARIA PATITAS FELICES
   script.js
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    iniciarFormulario();
    iniciarCarrusel();
    restaurarFormulario();
    iniciarScrollSuave();
    registrarServiceWorker();

});

/* =======================================================
   FORMULARIO DE CONTACTO
======================================================= */

function iniciarFormulario() {

    const formulario = document.getElementById("contactForm");

    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        if (nombre === "") {
            alert("Por favor ingrese su nombre.");
            return;
        }

        if (!validarEmail(email)) {
            alert("Ingrese un correo electrónico válido.");
            return;
        }

        if (mensaje === "") {
            alert("Ingrese un mensaje.");
            return;
        }

        guardarFormulario(nombre, email, mensaje);

        const asunto =
            encodeURIComponent("Consulta desde Clínica Veterinaria");

        const cuerpo =
            encodeURIComponent(
                "Nombre: " + nombre +
                "\nCorreo: " + email +
                "\n\nMensaje:\n" + mensaje
            );

        const mailto =
            `mailto:contacto@patitasfelices.com?subject=${asunto}&body=${cuerpo}`;

        window.location.href = mailto;

        setTimeout(() => {

            const modalElement =
                document.getElementById("successModal");

            if (modalElement) {

                const modal =
                    new bootstrap.Modal(modalElement);

                modal.show();
            }

        }, 1000);

        formulario.reset();

        localStorage.removeItem("nombreMascotaForm");
        localStorage.removeItem("emailMascotaForm");
        localStorage.removeItem("mensajeMascotaForm");

    });

}

/* =======================================================
   VALIDACIÓN EMAIL
======================================================= */

function validarEmail(email) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(email);

}

/* =======================================================
   LOCAL STORAGE
======================================================= */

function guardarFormulario(nombre, email, mensaje) {

    localStorage.setItem(
        "nombreMascotaForm",
        nombre
    );

    localStorage.setItem(
        "emailMascotaForm",
        email
    );

    localStorage.setItem(
        "mensajeMascotaForm",
        mensaje
    );

}

function restaurarFormulario() {

    const nombreGuardado =
        localStorage.getItem("nombreMascotaForm");

    const emailGuardado =
        localStorage.getItem("emailMascotaForm");

    const mensajeGuardado =
        localStorage.getItem("mensajeMascotaForm");

    const nombre =
        document.getElementById("nombre");

    const email =
        document.getElementById("email");

    const mensaje =
        document.getElementById("mensaje");

    if (nombre && nombreGuardado) {
        nombre.value = nombreGuardado;
    }

    if (email && emailGuardado) {
        email.value = emailGuardado;
    }

    if (mensaje && mensajeGuardado) {
        mensaje.value = mensajeGuardado;
    }

    if (nombre) {
        nombre.addEventListener("input", () => {
            localStorage.setItem(
                "nombreMascotaForm",
                nombre.value
            );
        });
    }

    if (email) {
        email.addEventListener("input", () => {
            localStorage.setItem(
                "emailMascotaForm",
                email.value
            );
        });
    }

    if (mensaje) {
        mensaje.addEventListener("input", () => {
            localStorage.setItem(
                "mensajeMascotaForm",
                mensaje.value
            );
        });
    }

}

/* =======================================================
   CARRUSEL TESTIMONIOS
======================================================= */

function iniciarCarrusel() {

    const track =
        document.getElementById("testimonialTrack");

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    if (!track || !prevBtn || !nextBtn) return;

    let posicionActual = 0;

    function obtenerCardsVisibles() {

        if (window.innerWidth < 768) {
            return 1;
        }

        if (window.innerWidth < 992) {
            return 2;
        }

        if (window.innerWidth < 1200) {
            return 3;
        }

        return 4;
    }

    function moverCarrusel() {

        const tarjeta =
            track.querySelector(".testimonial-card");

        if (!tarjeta) return;

        const anchoTarjeta =
            tarjeta.offsetWidth + 20;

        track.scrollTo({
            left: posicionActual * anchoTarjeta,
            behavior: "smooth"
        });

    }

    nextBtn.addEventListener("click", () => {

        const totalCards =
            track.querySelectorAll(".testimonial-card").length;

        const visibles =
            obtenerCardsVisibles();

        const maximo =
            totalCards - visibles;

        if (posicionActual < maximo) {
            posicionActual++;
        } else {
            posicionActual = 0;
        }

        moverCarrusel();

    });

    prevBtn.addEventListener("click", () => {

        const totalCards =
            track.querySelectorAll(".testimonial-card").length;

        const visibles =
            obtenerCardsVisibles();

        const maximo =
            totalCards - visibles;

        if (posicionActual > 0) {
            posicionActual--;
        } else {
            posicionActual = maximo;
        }

        moverCarrusel();

    });

    window.addEventListener("resize", moverCarrusel);

    setInterval(() => {

        nextBtn.click();

    }, 6000);

}

/* =======================================================
   SCROLL SUAVE MENÚ
======================================================= */

function iniciarScrollSuave() {

    const enlaces =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    enlaces.forEach(enlace => {

        enlace.addEventListener(
            "click",
            function (e) {

                const destino =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (!destino) return;

                e.preventDefault();

                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}

/* =======================================================
   SERVICE WORKER
======================================================= */

function registrarServiceWorker() {

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker
            .register("sw.js")
            .then(() => {

                console.log(
                    "Service Worker registrado correctamente."
                );

            })
            .catch(error => {

                console.warn(
                    "No fue posible registrar el Service Worker.",
                    error
                );

            });

    }

}

/* =======================================================
   ANALÍTICA BÁSICA DEMO
======================================================= */

window.addEventListener("load", () => {

    console.log(
        "Página cargada correctamente."
    );

    console.log(
        "Resolución:",
        window.innerWidth + "x" + window.innerHeight
    );

});

/* =======================================================
   EFECTO VISIBILIDAD
======================================================= */

const observador = new IntersectionObserver(
    (entradas) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add(
                    "visible"
                );

            }

        });

    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll(
    ".service-card, .team-card, .contact-card"
).forEach((elemento) => {

    observador.observe(elemento);

});

/* =======================================================
   MANEJO GLOBAL DE ERRORES
======================================================= */

window.addEventListener("error", (error) => {

    console.error(
        "Error detectado:",
        error.message
    );

});

/* =======================================================
   INFORMACIÓN SEO / UX
======================================================= */

console.log(
`
=========================================
CLÍNICA VETERINARIA PATITAS FELICES
=========================================

Sitio optimizado para:

✓ Bootstrap 5.3
✓ Diseño Responsive
✓ SEO básico
✓ Accesibilidad
✓ Validación de Formularios
✓ LocalStorage
✓ Scroll Suave
✓ UX moderna
✓ Preparado para PWA

=========================================
`
);