// Guardar los botones en variables
const ciclos = document.getElementById("ciclosBtn");
const modulos = document.getElementById("modulosBtn");
const horarios = document.getElementById("horariosBtn");
const alumnos = document.getElementById("alumnosBtn");
const profesores = document.getElementById("profesoresBtn");
const horario = document.getElementById("horariosBtn");
const matricula = document.getElementById("matriculasBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Menú desplegable
const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", function () {
  const navPanel = document.getElementById("navPanel");
  navPanel.classList.toggle("active");
});

// Redirecciones al hacer clic en los botones
if(ciclos != undefined){
    ciclos.addEventListener("click", function () {
        window.top.location.href = "ciclos";
    });
}

if(modulos != undefined){
    modulos.addEventListener("click", function () {
        window.top.location.href = "modulos";
    });
}

if(horario != undefined){
    horario.addEventListener("click", function () {
        window.top.location.href = "horarios";
    });
}

if(matricula != undefined){
    matricula.addEventListener("click", function () {
        window.top.location.href = "matriculaalumno";
    });
}

if(alumnos != undefined){
    alumnos.addEventListener("click", function () {
        window.top.location.href = "alumnos";
    });
}

if(profesores != undefined){
    profesores.addEventListener("click", function () {
        window.top.location.href = "profesores";
    });
}

if(modulos != undefined){
    modulos.addEventListener("click", function () {
        window.top.location.href = "modulos";
    });
}

logoutBtn.addEventListener("click", function () {
    window.top.location.href = "index";
});
