//Guardar los Frames en Variables
const emptyFrame = document.getElementById("emptyFrame");
const ciclosFrame = document.getElementById("ciclosFrame");
const modulosFrame = document.getElementById("modulosFrame");
const horariosFrame = document.getElementById("horariosFrame");
const alumnosFrame = document.getElementById("alumnosFrame");
const profesoresFrame = document.getElementById("profesoresFrame");

//Guardar los botones en variables
const menuToggle = document.getElementById("menuToggle")
const ciclos= document.getElementById("ciclosBtn");
const modulos = document.getElementById("modulosBtn");
const horarios = document.getElementById("horariosBtn");
const alumnos = document.getElementById("alumnosBtn");
const profesores = document.getElementById("profesoresBtn");
const logoutBtn = document.getElementById("logoutBtn");


menuToggle.addEventListener('click', function() {
    const navPanel = document.getElementById('navPanel');
    navPanel.classList.toggle('active');
});

logoutBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario
    window.location.href = 'index.html'; // Redirige al usuario
});