/**
 * Código JavaScript de Lógica Operativa y Validación de Formulario
 * Proyecto: Clínica Veterinaria VetCare
 */

document.addEventListener("DOMContentLoaded", function () {
    // Captura de los elementos clave del DOM
    const contactForm = document.getElementById("contactForm");
    const confirmModalElement = document.getElementById("confirmModal");
    
    // Inicialización explícita del componente Modal de Bootstrap 5
    const confirmModal = new bootstrap.Modal(confirmModalElement);

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            // Evaluación del estado de validación HTML5 nativo del formulario
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                contactForm.classList.add("was-validated");
                return;
            }

            // Flag lógico de detección de cambio de foco/apertura de cliente externo
            let mailActionTriggered = false;

            /**
             * Manejador de evento para la pérdida de foco de la pestaña activa (Blur).
             * Se dispara de forma inmediata cuando el sistema operativo invoca el cliente
             * nativo de correos (Mail de Windows, Outlook, Mail de Mac, o redirige a una app externa).
             */
            const handleWindowBlur = function () {
                mailActionTriggered = true;
                // Despliegue inmediato de la ventana modal simulada de confirmación
                confirmModal.show();
                // Limpieza de listener para mitigar ejecuciones en bucle
                window.removeEventListener("blur", handleWindowBlur);
            };

            // Inyección del listener en el objeto global justo antes de procesar el protocolo mailto:
            window.addEventListener("blur", handleWindowBlur);

            // Resguardo de contingencia asíncrono para navegadores específicos sin aislamiento estricto
            setTimeout(function () {
                if (!mailActionTriggered) {
                    confirmModal.show();
                    window.removeEventListener("blur", handleWindowBlur);
                }
            }, 1200);

            // Blanqueamiento controlado del formulario post-envío para optimizar UX
            setTimeout(function() {
                contactForm.reset();
                contactForm.classList.remove("was-validated");
            }, 600);
        });
    }

    // Lógica complementaria de usabilidad responsive para el menú superior fijo
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Contracción automática del menú hamburguesa al clicar en entornos móviles
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
});