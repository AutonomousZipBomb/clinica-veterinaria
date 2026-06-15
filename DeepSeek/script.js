(function() {
  'use strict';

  // Referencias al DOM
  const form = document.getElementById('formContacto');
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

  // Validación y envío del formulario
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    // Validación de Bootstrap
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Validación extra de email (expresión regular)
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('is-invalid');
      form.classList.add('was-validated');
      return;
    } else {
      emailInput.classList.remove('is-invalid');
    }

    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const email = emailInput.value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // Mostrar modal de confirmación
    modalConfirmacion.show();

    // Construir enlace mailto
    const asunto = encodeURIComponent('Consulta desde sitio web - Clínica Huellitas');
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}\n\n---\nEnviado desde el formulario de contacto.`
    );
    const mailtoLink = `mailto:contacto@clinichuellitas.com?subject=${asunto}&body=${cuerpo}`;

    // Abrir cliente de correo después de un pequeño retraso para que el modal sea visible
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 1500);

    // Limpiar formulario y quitar validación visual después del envío
    form.reset();
    form.classList.remove('was-validated');
  });

  // Eliminar clase de validación en tiempo real al escribir
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      if (this.checkValidity()) {
        this.classList.remove('is-invalid');
      } else {
        this.classList.add('is-invalid');
      }
    });
  });

  // Cerrar automáticamente el navbar colapsado al hacer clic en un enlace (mejora UX móvil)
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarContenido');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).toggle();
      }
    });
  });

})();