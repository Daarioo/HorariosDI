const btnAgregar = document.getElementById("botonAgregar3");
const listAlumnos = document.getElementById("listaAlumnos");

// Función para crear el modal de ingreso de datos (Agregar alumno)
function crearModalAlumno() {
  const modal = document.createElement("div");
  modal.id = "modalAlumno";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Nuevo Alumno</h3>
      <form id="formAlumno">
        <label>Nombre completo</label>
        <input type="text" placeholder="Nombre completo" required>
        <label>Correo electrónico</label>
        <input type="email" placeholder="Correo electrónico" required>
        <label>Teléfono</label>
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

// Event listener para el botón de agregar alumno
btnAgregar.addEventListener("click", function() {
  // Crear modal si no existe
  if (!document.getElementById("modalAlumno")) {
    crearModalAlumno();
  }
  
  const modal = document.getElementById("modalAlumno");
  const form = document.getElementById("formAlumno");
  const inputs = form.getElementsByTagName("input");
  
  modal.style.display = "flex"; // Mostrar el modal centrado
  
  // Configurar botón de cancelar
  modal.querySelector(".cancelar").addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });
  
  // Manejar el envío del formulario para agregar un nuevo alumno
  form.onsubmit = (e) => {
    e.preventDefault();
    const alumnoCount = listAlumnos.getElementsByClassName("alumno").length;
    const nuevoAlumno = document.createElement("div");
    
    // Extraer valores de los inputs
    const nombre = inputs[0].value || `Alumno ${alumnoCount + 1}`;
    const correo = inputs[1].value;
    const telefono = inputs[2].value;
    
    // Guardar datos en atributos data para usarlos en edición
    nuevoAlumno.dataset.nombre = nombre;
    nuevoAlumno.dataset.correo = correo;
    nuevoAlumno.dataset.telefono = telefono;
    
    nuevoAlumno.classList.add("alumno");
    nuevoAlumno.innerHTML = `
      <span>${nombre}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar">❌</button>
      </div>
    `;
    
    listAlumnos.appendChild(nuevoAlumno);
    modal.style.display = "none";
    form.reset();
  };
});

// Eliminar alumno al hacer clic en el botón de eliminar
listAlumnos.addEventListener("click", function(event) {
  if (event.target.classList.contains("eliminar")) {
    event.target.closest(".alumno").remove();
  }
  
  // Al hacer clic en "ver", abrir la ventana emergente para editar
  if (event.target.classList.contains("ver")) {
    const alumnoElement = event.target.closest(".alumno");
    crearModalVerEditarCiclo(alumnoElement);
  }
});

// Función para crear la ventana emergente (modal) de ver y editar alumno
function crearModalVerEditarCiclo(alumnoElement) {
  // Crear el modal
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modalVerEditarAlumno";
  
  // Recuperar los datos existentes
  const nombre = alumnoElement.dataset.nombre || alumnoElement.querySelector("span").textContent;
  const correo = alumnoElement.dataset.correo || "";
  const telefono = alumnoElement.dataset.telefono || "";
  
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Editar Datos del Alumno</h3>
      <form id="formVerEditarAlumno">
        <label>Nombre completo</label>
        <input type="text" placeholder="Nombre completo" value="${nombre}" required>
        <label>Correo electrónico</label>
        <input type="email" placeholder="Correo electrónico" value="${correo}" required>
        <label>Teléfono</label>
        <input type="tel" placeholder="Teléfono" value="${telefono}">
        <div class="modal-botones">
          <button type="button" class="cancelar">Cancelar</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = "flex";
  
  const form = modal.querySelector("form");
  
  // Configurar botón de cancelar
  modal.querySelector(".cancelar").addEventListener("click", () => {
    modal.remove();
  });
  
  // Manejar el envío del formulario para guardar cambios
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = form.getElementsByTagName("input");
    const nuevoNombre = inputs[0].value;
    const nuevoCorreo = inputs[1].value;
    const nuevoTelefono = inputs[2].value;
    
    // Actualizar datos en el alumno
    alumnoElement.dataset.nombre = nuevoNombre;
    alumnoElement.dataset.correo = nuevoCorreo;
    alumnoElement.dataset.telefono = nuevoTelefono;
    alumnoElement.querySelector("span").textContent = nuevoNombre;
    
    modal.remove();
  });
}
