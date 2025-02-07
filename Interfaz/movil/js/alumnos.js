// Función para crear el modal de ingreso de datos
function crearModalAlumno() {
  const modal = document.createElement("div");
  modal.id = "modalAlumno";
  modal.className = "modal";
  modal.innerHTML = `
      <div class="modal-contenido">
          <h3>Nuevo Alumno</h3>
          <form id="formAlumno">
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
document.getElementById("botonAgregar3").addEventListener("click", function() {
  // Crear modal si no existe
  if (!document.getElementById("modalAlumno")) {
      crearModalAlumno();
  }
  
  const modal = document.getElementById("modalAlumno");
  const form = document.getElementById("formAlumno");
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
      const lista = document.getElementById("listaAlumnos");
      const alumnoCount = lista.getElementsByClassName("alumno").length;
      
      // Crear nuevo alumno con los datos ingresados
      const nuevoAlumno = document.createElement("div");
      nuevoAlumno.classList.add("alumno");
      nuevoAlumno.innerHTML = `
          <span>${inputs[0].value || `Alumno ${alumnoCount + 1}`}</span>
          <div class="acciones">
              <button class="ver">👁️</button>
              <button class="eliminar">❌</button>
          </div>
      `;
      
      lista.appendChild(nuevoAlumno);
      modal.style.display = "none";
      form.reset();
  };
});

// Eliminar alumno 
document.getElementById("listaAlumnos").addEventListener("click", function(event) {
  if (event.target.classList.contains("eliminar")) {
      event.target.closest(".alumno").remove();
  }
});