// Guardar los frames en variables
const loginFrame = document.getElementById('loginFrame');
const createAccountFrame = document.getElementById('createAccountFrame');
const initAccountFrame = document.getElementById('InitAccountFrame');

// Guardar los botones en variables
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const createAccountBtn = document.getElementById('createAccountBtn');

// Evento para el botón de Registrarse
registerBtn.addEventListener('click', function() {
    loginFrame.classList.add('hidden');
    createAccountFrame.classList.remove('hidden');
});

// Evento para el botón de Iniciar Sesión
loginBtn.addEventListener('click', function() {
    loginFrame.classList.add('hidden');
    createAccountFrame.classList.add('hidden');
    initAccountFrame.classList.remove('hidden');
});

// Evento para el botón de Crear Cuenta
createAccountBtn.addEventListener('click', function() {
    createAccountFrame.classList.add('hidden');
    initAccountFrame.classList.remove('hidden');
});