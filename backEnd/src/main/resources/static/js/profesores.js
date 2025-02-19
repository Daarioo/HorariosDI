function init() {
  document.addEventListener("DOMContentLoaded", () => {
      const modal = document.getElementById("modal");
      const openModalBtn = document.getElementById("openModal");
      const closeModalBtn = document.querySelector(".close");
      const form = document.getElementById("matriculaForm");
      const tableBody = document.querySelector("#profesoresTable tbody");

      openModalBtn.addEventListener("click", () => modal.style.display = "block");
      closeModalBtn.addEventListener("click", () => modal.style.display = "none");
      window.addEventListener("click", (e) => {
          if (e.target === modal) modal.style.display = "none";
      });

      form.addEventListener("submit", (e) => {
          e.preventDefault();
          
          const nombre = document.getElementById("nombre").value;
          const apellidos = document.getElementById("apellidos").value;
          const email = document.getElementById("email").value;
          const modulos = document.getElementById("modulos").value;
          
          if (nombre && apellidos && email && modulos) {
              agregarProfesor(nombre, apellidos, email, modulos);
              form.reset();
              modal.style.display = "none";
          }
      });

      function agregarProfesor(nombre, apellidos, email, modulos) {
          const row = tableBody.insertRow();
          
          row.insertCell(0).textContent = `${nombre} ${apellidos}`;
          row.insertCell(1).textContent = email;
          row.insertCell(2).textContent = modulos;

          const actionsCell = row.insertCell(3);
          const editBtn = document.createElement("button");
          editBtn.textContent = "Editar";
          editBtn.classList.add("edit");
          editBtn.onclick = () => editarProfesor(row, nombre, apellidos, email, modulos);
          
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Eliminar";
          deleteBtn.classList.add("delete");
          deleteBtn.onclick = () => row.remove();

          actionsCell.appendChild(editBtn);
          actionsCell.appendChild(deleteBtn);
      }

      function editarProfesor(row, nombre, apellidos, email, modulos) {
          document.getElementById("nombre").value = nombre;
          document.getElementById("apellidos").value = apellidos;
          document.getElementById("email").value = email;
          document.getElementById("modulos").value = modulos;

          modal.style.display = "block";

          form.onsubmit = (e) => {
              e.preventDefault();
              row.cells[0].textContent = `${document.getElementById("nombre").value} ${document.getElementById("apellidos").value}`;
              row.cells[1].textContent = document.getElementById("email").value;
              row.cells[2].textContent = document.getElementById("modulos").value;
              modal.style.display = "none";
              form.onsubmit = agregarProfesor;
          };
      }
  });
}


document.addEventListener("DOMContentLoaded", function () {
  // Obtener la URL actual
  const currentPage = window.location.pathname.split("/").pop();

  // Seleccionar todos los enlaces del nav
  const links = document.querySelectorAll("nav a");

  // Recorrer los enlaces y marcar el activo
  links.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
      }
  });
});