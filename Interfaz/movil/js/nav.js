//Guardar los Frames en Variables
const emptyFrame = document.getElementById("emptyFrame");
const ciclosFrame = document.getElementById("ciclosFrame");
const modulosFrame = document.getElementById("modulosFrame");
const horariosFrame = document.getElementById("horariosFrame");
const alumnosFrame = document.getElementById("alumnosFrame");
const profesoresFrame = document.getElementById("profesoresFrame");

//Guardar los botones en variables
const ciclos= document.getElementById("ciclosBtn");
const modulos = document.getElementById("modulosBtn");
const horarios = document.getElementById("horariosBtn");
const alumnos = document.getElementById("alumnosBtn");
const profesores = document.getElementById("profesoresBtn");
const logoutBtn = document.getElementById("logoutBtn");

//Menu desplegable
const menuToggle = document.getElementById("menuToggle")

menuToggle.addEventListener('click', function() {
    const navPanel = document.getElementById('navPanel');
    navPanel.classList.toggle('active');
});

// Establecer emptyFrame como visible por defecto
document.addEventListener("DOMContentLoaded", function() {
    ciclosFrame.style.display = "none";
    modulosFrame.style.display = "none";
    horariosFrame.style.display = "none";
    alumnosFrame.style.display = "none";
    profesoresFrame.style.display = "none";
    emptyFrame.style.display = "block";
});


logoutBtn.addEventListener('click', function(event) {
    window.location.href = 'index.html'; // Redirige al usuario
});

ciclos.addEventListener('click', function(event) {
    emptyFrame.style.display = "none";
    modulosFrame.style.display = "none";
    horariosFrame.style.display = "none";
    alumnosFrame.style.display = "none";
    profesoresFrame.style.display = "none";
    ciclosFrame.style.display = "block";
});


modulos.addEventListener('click', function(event) {
    emptyFrame.style.display = "none";
    ciclosFrame.style.display = "none";
    horariosFrame.style.display = "none";
    alumnosFrame.style.display = "none";
    profesoresFrame.style.display = "none";
    modulosFrame.style.display = "block";
});

horarios.addEventListener('click', function(event) {
    emptyFrame.style.display = "none";
    ciclosFrame.style.display = "none";
    modulosFrame.style.display = "none";
    alumnosFrame.style.display = "none";
    profesoresFrame.style.display = "none";
    horariosFrame.style.display = "block";
});

alumnos.addEventListener('click', function(event) {   
    emptyFrame.style.display = "none";
    ciclosFrame.style.display = "none";
    modulosFrame.style.display = "none";
    horariosFrame.style.display = "none";
    profesoresFrame.style.display = "none";
    alumnosFrame.style.display = "block";
});

profesores.addEventListener('click', function(event) {
    emptyFrame.style.display = "none";
    ciclosFrame.style.display = "none";
    modulosFrame.style.display = "none";
    horariosFrame.style.display = "none";
    alumnosFrame.style.display = "none";
    profesoresFrame.style.display = "block";
});
