/**
 * LÓGICA DE FUNCIONAMIENTO - CLÍNICA VETERINARIA HUELLITAS FELICES
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navegación fluida y cierre automático del menú móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const menuToggle = document.getElementById("navbarNav");
    
    // Inicializar el objeto collapse de Bootstrap si existe el menú
    let bsCollapse = null;
    if (menuToggle) {
        bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Eliminar clase active de todos
            navLinks.forEach(l => l.classList.remove("active"));
            // Agregar active al seleccionado
            link.classList.add("active");

            // Cerrar menú si está abierto en móviles
            if (menuToggle && menuToggle.classList.contains("show")) {
                bsCollapse.toggle();
            }
        });
    });

    // 2. Validación de Formulario y Simulación de Envío de Correo con Modal Informativo
    const contactForm = document.getElementById("contactForm");
    const confirmationModalElement = document.getElementById("confirmationModal");
    let confirmationModal = null;
    
    if (confirmationModalElement) {
        confirmationModal = new bootstrap.Modal(confirmationModalElement);
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            // Cancelar el comportamiento estándar del formulario
            event.preventDefault();
            
            // Validaciones nativas usando Bootstrap feedback
            if (!contactForm.checkValidity()) {
                event.stopPropagation();
                contactForm.classList.add("was-validated");
                return;
            }

            // Obtener valores de los campos
            const name = document.getElementById("formName").value.trim();
            const email = document.getElementById("formEmail").value.trim();
            const message = document.getElementById("formMessage").value.trim();

            // Construir parámetros de Mailto
            const targetEmail = "consultas@huellitasfelices.com.do";
            const emailSubject = encodeURIComponent(`Consulta Veterinaria - ${name}`);
            const emailBody = encodeURIComponent(
                `Hola, Huellitas Felices.\n\n` +
                `Mi nombre es: ${name}\n` +
                `Mi correo de contacto: ${email}\n\n` +
                `Detalle del Mensaje:\n${message}\n\n` +
                `--- Enviado desde el sitio web ---`
            );

            // Intentar abrir el gestor de correo local
            window.location.href = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

            // Lanzar ventana modal simulada que reacciona a la acción del sistema
            if (confirmationModal) {
                // Pequeño retardo de medio segundo para permitir que se intente levantar el gestor de correo antes de pintar el modal en pantalla.
                setTimeout(() => {
                    confirmationModal.show();
                }, 500);
            }

            // Limpiar campos y resetear validación tras el envío
            contactForm.reset();
            contactForm.classList.remove("was-validated");
        });
    }
});