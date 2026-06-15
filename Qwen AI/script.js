// ============================================
// SCRIPT PRINCIPAL - CLÍNICA VETERINARIA
// ============================================

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. SCROLL SUAVE ENTRE SECCIONES
    // ============================================
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Solo aplicar scroll suave si es un enlace interno válido
            if (targetId !== '#' && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Cierra el menú móvil si está abierto
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                    
                    // Calcula posición con offset por el navbar fijo
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    // Scroll suave
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // 2. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtiene los valores de los campos
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        // Validación personalizada
        let isValid = true;
        
        // Resetea estados de validación
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-invalid');
        });
        
        // Valida nombre
        if (nombre.length < 2) {
            document.getElementById('nombre').classList.add('is-invalid');
            isValid = false;
        }
        
        // Valida email con expresión regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').classList.add('is-invalid');
            isValid = false;
        }
        
        // Valida mensaje
        if (mensaje.length < 10) {
            document.getElementById('mensaje').classList.add('is-invalid');
            isValid = false;
        }
        
        // Si todo es válido, envía el correo
        if (isValid) {
            enviarCorreo(nombre, email, mensaje);
        }
    });
    
    // ============================================
    // 3. FUNCIÓN PARA ENVIAR CORREO
    // ============================================
    function enviarCorreo(nombre, email, mensaje) {
        // Destinatario de la clínica
        const destinatario = 'contacto@petcare.com.do';
        
        // Asunto del correo
        const asunto = `Consulta de ${nombre} - PetCare`;
        
        // Cuerpo del mensaje
        const cuerpo = `Nombre: ${nombre}%0D%0AEmail: ${email}%0D%0A%0D%0AMensaje:%0D%0A${mensaje}`;
        
        // Construye el enlace mailto
        const mailtoLink = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${cuerpo}`;
        
        // Abre el cliente de correo
        window.location.href = mailtoLink;
        
        // Muestra el modal de confirmación después de un pequeño delay
        // Esto detecta la apertura de la aplicación de correo
        setTimeout(() => {
            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            confirmModal.show();
            
            // Limpia el formulario
            contactForm.reset();
        }, 500);
    }
    
    // ============================================
    // 4. ANIMACIÓN AL HACER SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa todas las cards para animarlas al aparecer
    document.querySelectorAll('.service-card, .team-card, .testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // ============================================
    // 5. EFECTO NAVBAR AL HACER SCROLL
    // ============================================
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--primary)';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // ============================================
    // 6. PERSISTENCIA DE DATOS EN LOCAL STORAGE
    // ============================================
    // Guarda el último mensaje escrito para recuperarlo si recarga
    const mensajeField = document.getElementById('mensaje');
    const mensajeGuardado = localStorage.getItem('ultimoMensaje');
    if (mensajeGuardado) {
        mensajeField.value = mensajeGuardado;
    }
    
    mensajeField.addEventListener('input', function() {
        localStorage.setItem('ultimoMensaje', this.value);
    });
    
    // Limpia localStorage al enviar exitosamente
    contactForm.addEventListener('reset', function() {
        localStorage.removeItem('ultimoMensaje');
    });
    
    // ============================================
    // 7. DETECCIÓN DE VISIBILIDAD DE LA PÁGINA
    // ============================================
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // La página volvió a estar visible
            console.log('🐾 ¡Bienvenido de vuelta a PetCare!');
        }
    });
    
    // ============================================
    // 8. VALIDACIÓN EN TIEMPO REAL
    // ============================================
    document.getElementById('email').addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        } else {
            this.classList.remove('is-valid');
        }
    });
    
    // Mensaje de bienvenida en consola
    console.log('%c🐾 PetCare - Clínica Veterinaria 🐾', 
        'color: #18BC9C; font-size: 20px; font-weight: bold;');
    console.log('Desarrollado con ❤️ para el cuidado de tus mascotas');
});