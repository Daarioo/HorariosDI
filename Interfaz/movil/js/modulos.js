// Función para crear el modal de ingreso de datos
function crearModalModulo() {
  const modal = document.createElement("div");
  modal.id = "modalModulo";
  modal.className = "modal";
  modal.innerHTML = `
      <div class="modal-contenido">
          <h3>Nuevo Módulo</h3>
          <form id="formModulo">
              <input type="text" placeholder="codigo" required>
              <input type="text" placeholder="Nombre modulo" required>
              <input type="text" placeholder="familia profesional">
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
document.getElementById("botonAgregar1").addEventListener("click", function() {
  // Crear modal si no existe
  if (!document.getElementById("modalModulo")) {
    crearModalModulo();
  }
  
  const modal = document.getElementById("modalModulo");
  const form = document.getElementById("formModulo");
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
      const lista = document.getElementById("listaModulos");
      const moduloCount = lista.getElementsByClassName("modulo").length;
      
      // Crear nuevo alumno con los datos ingresados
      const nuevoModulo = document.createElement("div");
      nuevoModulo.classList.add("modulo");
      nuevoModulo.innerHTML = `
      <span>${inputs[0].value || `Alumno ${moduloCount + 1}`}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar">❌</button>
      </div>
    `;
      
      lista.appendChild(nuevoModulo);
      modal.style.display = "none";
      form.reset();
  };
});

// Elimina un profesor de la lista al hacer clic en el botón "❌"
document.getElementById("listaModulos").addEventListener("click", function(event) {
  if (event.target.classList.contains("eliminar")) {
    event.target.closest(".modulo").remove();
  }
});