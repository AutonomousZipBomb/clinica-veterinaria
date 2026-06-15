/* ============================================ */
/* CLÍNICA VETERINARIA - JAVASCRIPT */
/* ============================================ */

(function() {
    'use strict';

    /* ============================================ */
    /* ESPERA A QUE EL DOM ESTÉ CARGADO */
    /* ============================================ */
    document.addEventListener('DOMContentLoaded', function() {

        /* ============================================ */
        /* VARIABLES GLOBALES */
        /* ============================================ */
        const navbar = document.getElementById('mainNav');
        const contactForm = document.getElementById('contactForm');
        const emailInput = document.getElementById('email');
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        const navLinks = document.querySelectorAll('.nav-link');

        /* ============================================ */
        /* 1. EFECTO DE NAVBAR AL HACER SCROLL */
        /* ============================================ */
        function handleNavbarScroll() {
            if (window.scrollY > 50) {
                navbar.style.padding = '8px 0';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.padding = '12px 0';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }
        }
        window.addEventListener('scroll', handleNavbarScroll);

        /* ============================================ */
        /* 2. SCROLL SUAVE PARA ENLACES INTERNOS */
        /* ============================================ */
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // Cerrar menú móvil si está abierto
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse.classList.contains('show')) {
                            navbarCollapse.classList.remove('show');
                        }
                    }
                }
            });
        });

        /* ============================================ */
        /* 3. VALIDACIÓN DE EMAIL EN TIEMPO REAL */
        /* ============================================ */
        function validateEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        emailInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                if (validateEmail(this.value)) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });

        /* ============================================ */
        /* 4. VALIDACIÓN Y ENVÍO DEL FORMULARIO */
        /* ============================================ */
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = emailInput.value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            // Validación de campos
            if (nombre.length < 2) {
                alert('⚠️ Por favor ingresa un nombre válido (mínimo 2 caracteres).');
                document.getElementById('nombre').focus();
                return false;
            }

            if (!validateEmail(email)) {
                alert('⚠️ Por favor ingresa un correo electrónico válido.');
                emailInput.focus();
                return false;
            }

            if (mensaje.length < 10) {
                alert('⚠️ El mensaje debe tener al menos 10 caracteres.');
                document.getElementById('mensaje').focus();
                return false;
            }

            // Mostrar modal de confirmación
            confirmModal.show();

            // Detectar cuando se abre el cliente de correo y mostrar modal
            setTimeout(function() {
                // Enviar el formulario nativamente (abre cliente de correo)
                contactForm.submit();
            }, 1500);
        });

        /* ============================================ */
        /* 5. DETECTAR VISIBILIDAD DE PÁGINA */
        /* ============================================ */
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // La página volvió a ser visible (usuario regresó del cliente de correo)
                console.log('Usuario ha regresado a la página');
            }
        });

        /* ============================================ */
        /* 6. ANIMACIÓN DE ELEMENTOS AL SCROLL */
        /* ============================================ */
        function animateOnScroll() {
            const elements = document.querySelectorAll('.service-card, .team-card, .testimonial-card');
            elements.forEach(function(el) {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100;
                if (isVisible) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        }

        // Inicializar elementos con opacidad 0 para animación
        const animatedElements = document.querySelectorAll('.service-card, .team-card, .testimonial-card');
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Ejecutar al cargar

        /* ============================================ */
        /* 7. LINK ACTIVO EN NAVBAR SEGÚN SECCIÓN */
        /* ============================================ */
        function setActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(function(section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        window.addEventListener('scroll', setActiveNavLink);

        /* ============================================ */
        /* 8. SERVICE WORKER (PERSISTENCIA Y OFFLINE) */
        /* ============================================ */
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('data:text/javascript,' + encodeURIComponent(`
                self.addEventListener('install', function(e) {
                    e.waitUntil(
                        caches.open('vetcare-v1').then(function(cache) {
                            return cache.addAll(['/', '/index.html', '/style.css', '/script.js']);
                        })
                    );
                });
                self.addEventListener('fetch', function(e) {
                    e.respondWith(
                        caches.match(e.request).then(function(response) {
                            return response || fetch(e.request);
                        })
                    );
                });
            `)).then(function() {
                console.log('Service Worker registrado correctamente');
            }).catch(function(err) {
                console.log('Error al registrar Service Worker:', err);
            });
        }

        /* ============================================ */
        /* 9. ANALYTICS LOCAL (SIMULACIÓN) */
        /* ============================================ */
        function trackPageView() {
            const pageData = {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                screenSize: window.innerWidth + 'x' + window.innerHeight
            };
            // Guardar en localStorage para persistencia
            let analytics = JSON.parse(localStorage.getItem('vetcare_analytics') || '[]');
            analytics.push(pageData);
            localStorage.setItem('vetcare_analytics', JSON.stringify(analytics));
        }
        trackPageView();

        /* ============================================ */
        /* 10. MANEJO DE ERRORES GLOBALES */
        /* ============================================ */
        window.addEventListener('error', function(e) {
            console.error('Error capturado:', e.message, 'en', e.filename, 'línea', e.lineno);
        });

        /* ============================================ */
        /* 11. PREFETCH DE IMÁGENES PARA MEJOR RENDIMIENTO */
        /* ============================================ */
        const imagesToPrefetch = [
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
            'https://purina.com.do/sites/default/files/2022-10/purina-consulta-veterinaria-para-mascotas-lo-que-debes-saber.jpg',
            'https://holavet.com.ar/wp-content/uploads/2022/04/close-up-on-veterinarian-taking-care-of-pet-1.webp',
            'https://neozoo.com.ar/wp-content/uploads/2023/06/Iconos-e-imagenes-09.png'
        ];

        imagesToPrefetch.forEach(function(src) {
            const img = new Image();
            img.src = src;
        });

    });

})();