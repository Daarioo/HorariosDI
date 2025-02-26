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
  window.location.href = "/templates/ciclos_movil.html";
});

modulos.addEventListener("click", function () {
  window.location.href = "modulos_movil.html";
});

horarios.addEventListener("click", function () {
  window.location.href = "horario.html";
});

alumnos.addEventListener("click", function () {
  window.location.href = "alumnos_movil.html";
});

profesores.addEventListener("click", function () {
  window.location.href = "profesores_movil.html";
});

logoutBtn.addEventListener("click", function () {
  window.location.href = "index.html"; // Redirige al usuario a la página de inicio de sesión
});
