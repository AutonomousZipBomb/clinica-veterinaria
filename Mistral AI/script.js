/**
 * ============================================
 * JavaScript - Clínica Veterinaria
 * ============================================
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrusel de testimonios
    initTestimonialCarousel();
    
    // Validación del formulario de contacto
    initContactForm();
    
    // Scroll suave para enlaces internos
    initSmoothScroll();
    
    // Detección de apertura de correo
    initMailtoDetection();
});

/**
 * Inicializa el carrusel de testimonios
 */
function initTestimonialCarousel() {
    const carousel = new bootstrap.Carousel(document.getElementById('testimonialCarousel'), {
        interval: 5000,
        wrap: true,
        pause: 'hover'
    });
    
    // Asegurar que el carrusel se ajuste correctamente al cambiar de tamaño
    window.addEventListener('resize', function() {
        carousel.dispose();
        setTimeout(() => {
            new bootstrap.Carousel(document.getElementById('testimonialCarousel'), {
                interval: 5000,
                wrap: true,
                pause: 'hover'
            });
        }, 100);
    });
}

/**
 * Inicializa la validación del formulario de contacto
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar el formulario
            if (validateForm()) {
                // Simular el envío del formulario
                simulateFormSubmission(form);
            }
        });
        
        // Validación en tiempo real para el email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                validateEmail(this);
            });
        }
    }
}

/**
 * Valida todo el formulario
 * @returns {boolean} - True si el formulario es válido
 */
function validateForm() {
    let isValid = true;
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    
    // Validar nombre
    if (!nombre.value.trim()) {
        setInvalid(nombre, 'Por favor, ingresa tu nombre.');
        isValid = false;
    } else {
        setValid(nombre);
    }
    
    // Validar email
    if (!validateEmail(email)) {
        isValid = false;
    }
    
    // Validar mensaje
    if (!mensaje.value.trim()) {
        setInvalid(mensaje, 'Por favor, ingresa tu mensaje.');
        isValid = false;
    } else {
        setValid(mensaje);
    }
    
    return isValid;
}

/**
 * Valida el campo de email
 * @param {HTMLElement} input - Campo de email
 * @returns {boolean} - True si el email es válido
 */
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        setInvalid(input, 'Por favor, ingresa tu correo electrónico.');
        return false;
    } else if (!emailRegex.test(email)) {
        setInvalid(input, 'Por favor, ingresa un correo electrónico válido.');
        return false;
    } else {
        setValid(input);
        return true;
    }
}

/**
 * Marca un campo como inválido
 * @param {HTMLElement} input - Campo a marcar
 * @param {string} message - Mensaje de error
 */
function setInvalid(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    // Buscar o crear el elemento de feedback
    let feedback = input.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.insertBefore(feedback, input.nextSibling);
    }
    feedback.textContent = message;
}

/**
 * Marca un campo como válido
 * @param {HTMLElement} input - Campo a marcar
 */
function setValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    
    // Eliminar el feedback de error si existe
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.remove();
    }
}

/**
 * Simula el envío del formulario
 * @param {HTMLElement} form - Formulario a enviar
 */
function simulateFormSubmission(form) {
    // Crear el mensaje para el correo
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    const subject = encodeURIComponent(`Mensaje de ${nombre} - Clínica Veterinaria`);
    const body = encodeURIComponent(`
Nombre: ${nombre}
Correo: ${email}

Mensaje:
${mensaje}
`);
    
    // Abrir el cliente de correo
    const mailtoLink = `mailto:info@clinica-veterinaria.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    // Mostrar el modal de confirmación después de un pequeño retraso
    setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    }, 500);
    
    // Resetear el formulario
    form.reset();
    
    // Remover las clases de validación
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}

/**
 * Inicializa el scroll suave para enlaces internos
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Ajustar para el menú fijo
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Detecta cuando se abre el cliente de correo
 */
function initMailtoDetection() {
    // Escuchar el evento de cambio de visibilidad de la página
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // Verificar si el usuario volvió de una pestaña de correo
            setTimeout(() => {
                const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
                // No mostrar automáticamente el modal, solo si fue abierto desde el formulario
                // Esto es solo para demostración
            }, 1000);
        }
    });
    
    // También podemos detectar cuando el usuario hace clic en un enlace mailto
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Guardar en sessionStorage que se abrió un mailto
            sessionStorage.setItem('mailtoOpened', 'true');
        });
    });
    
    // Verificar al cargar la página si venimos de un mailto
    if (sessionStorage.getItem('mailtoOpened') === 'true') {
        sessionStorage.removeItem('mailtoOpened');
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    }
}

/**
 * Función para animar elementos al hacer scroll
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Inicializar la animación al hacer scroll
document.addEventListener('DOMContentLoaded', animateOnScroll);

/**
 * Función para el efecto de latido en los iconos del carrusel
 */
function initHeartbeatEffect() {
    const hearts = document.querySelectorAll('.heartbeat');
    hearts.forEach(heart => {
        heart.style.animation = 'heartbeat 1.5s ease-in-out infinite';
    });
}

// Inicializar el efecto de latido
document.addEventListener('DOMContentLoaded', initHeartbeatEffect);

/**
 * Función para el efecto arcoíris en los bordes de las cards
 */
function initRainbowBorderEffect() {
    const rainbowCards = document.querySelectorAll('.rainbow-border');
    rainbowCards.forEach(card => {
        card.style.animation = 'rainbowBorder 8s linear infinite';
    });
}

// Inicializar el efecto arcoíris
document.addEventListener('DOMContentLoaded', initRainbowBorderEffect);