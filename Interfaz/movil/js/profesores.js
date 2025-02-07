// Función para crear el modal de ingreso de datos
function crearModalProfe() {
  const modal = document.createElement("div");
  modal.id = "modalProfe";
  modal.className = "modal";
  modal.innerHTML = `
      <div class="modal-contenido">
          <h3>Nuevo Profesor</h3>
          <form id="formProfe">
              <input type="text" placeholder="Nombre completo" required>
              <input type="email" placeholder="Correo electrónico" required>
              <input type="tel" placeholder="Teléfono">
              <div class="modal-botones">
                  <button type="button" class="cancelar">Cancelar</button>
                  <button type="submit">Agregar</button>
              </div>
          </form>
      </div>
  `;
  document.body.appendChild(modal);
}

// Añadir nuevo alumno con ventana emergente
document.getElementById("botonAgregar4").addEventListener("click", function() {
  // Crear modal si no existe
  if (!document.getElementById("modalProfe")) {
    crearModalProfe();
  }
  
  const modal = document.getElementById("modalProfe");
  const form = document.getElementById("formProfe");
  const inputs = form.getElementsByTagName("input");
  
  // Mostrar modal
  modal.style.display = "block";

  // Configurar cancelar
  modal.querySelector(".cancelar").addEventListener("click", () => {
      modal.style.display = "none";
      form.reset();
  });

  // Manejar envío del formulario
  form.onsubmit = (e) => {
      e.preventDefault();
      const lista = document.getElementById("listaProfes");
      const profeCount = lista.getElementsByClassName("profesor").length;
      
      // Crear nuevo alumno con los datos ingresados
      const nuevoProfe = document.createElement("div");
      nuevoProfe.classList.add("profesor");
      nuevoProfe.innerHTML = `
      <span>${inputs[0].value || `Profesor ${profeCount + 1}`}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar">❌</button>
      </div>
    `;
      
      lista.appendChild(nuevoProfe);
      modal.style.display = "none";
      form.reset();
  };
});

// Elimina un profesor de la lista al hacer clic en el botón "❌"
document.getElementById("listaProfes").addEventListener("click", function(event) {
  if (event.target.classList.contains("eliminar")) {
    event.target.closest(".profesor").remove();
  }
});
