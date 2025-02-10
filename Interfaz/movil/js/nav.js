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
  window.location.href = "ciclos.html";
});

modulos.addEventListener("click", function () {
  window.location.href = "modulos.html";
});

horarios.addEventListener("click", function () {
  window.location.href = "horario.html";
});

alumnos.addEventListener("click", function () {
  window.location.href = "alumnos.html";
});

profesores.addEventListener("click", function () {
  window.location.href = "profesores.html";
});

logoutBtn.addEventListener("click", function () {
  window.location.href = "index.html"; // Redirige al usuario a la página de inicio de sesión
});
