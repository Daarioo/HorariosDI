// Guardar los botones en variables
const ciclos = document.getElementById("ciclosBtn");
const modulos = document.getElementById("modulosBtn");
const horarios = document.getElementById("horariosBtn");
const alumnos = document.getElementById("alumnosBtn");
const profesores = document.getElementById("profesoresBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Menú desplegable
const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", function () {
  const navPanel = document.getElementById("navPanel");
  navPanel.classList.toggle("active");
});

// Redirecciones al hacer clic en los botones
ciclos.addEventListener("click", function () {
  window.top.location.href = "ciclos";
});

modulos.addEventListener("click", function () {
  window.top.location.href = "modulos";
});

horarios.addEventListener("click", function () {
  window.top.location.href = "sesiones";
});

alumnos.addEventListener("click", function () {
  window.top.location.href = "alumnos";
});

profesores.addEventListener("click", function () {
  window.top.location.href = "profesores";
});

logoutBtn.addEventListener("click", function () {
  window.top.location.href = "index"; // Redirige al usuario a la página de inicio de sesión
});
