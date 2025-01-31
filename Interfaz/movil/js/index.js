// Guardar los frames en variables
const loginFrame = document.getElementById('loginFrame');
const createAccountFrame = document.getElementById('createAccountFrame');
const initAccountFrame = document.getElementById('InitAccountFrame');

// Guardar los botones en variables
const registerBtn = document.getElementById('registerBtn');
const loginBtnFrame = document.getElementById('loginBtnFrame');
const createAccountBtn = document.getElementById('createAccountBtn');
const loginBtn= document.getElementById('loginBtn');

// Evento para el botón de Registrarse
registerBtn.addEventListener('click', function() {
    loginFrame.classList.add('hidden');
    createAccountFrame.classList.remove('hidden');

    
});

// Evento para el botón de Iniciar Sesión
loginBtnFrame.addEventListener('click', function() {
    loginFrame.classList.add('hidden');
    createAccountFrame.classList.add('hidden');
    initAccountFrame.classList.remove('hidden');
});

// Evento para el botón de Crear Cuenta
createAccountBtn.addEventListener('click', function() {
    createAccountFrame.classList.add('hidden');
    initAccountFrame.classList.remove('hidden');
});

// Evento para el botón de Iniciar Sesión
loginBtn.addEventListener('click', function() {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario
    window.location.href = 'nav.html'; // Redirige al usuario
});