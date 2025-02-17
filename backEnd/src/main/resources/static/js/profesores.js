const btnAgregar = document.getElementById("botonAgregar4");
const listProfes = document.getElementById("listaProfes");

// Función para crear el modal de ingreso de datos (Agregar alumno)
function crearModalProfe() {
  const modal = document.createElement("div");
  modal.id = "modalProfesor";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Nuevo profesor</h3>
      <form id="formProfesor">
      
        <label>Nombre </label>
        <input type="text" placeholder="Nombre" required
        <label>Apellidos</label>      
        <input type="text" placeholder="apellido" required>
        <label>Correo electrónico</label>
        <input type="email" placeholder="Correo electrónico" required>
        
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
  if (!document.getElementById("modalProfesor")) {
    crearModalProfe();
  }
  
  const modal = document.getElementById("modalProfesor");
  const form = document.getElementById("formProfesor");
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
    const profeCount = listProfes.getElementsByClassName("profesor").length;
    const nuevoProfe = document.createElement("div");
    
    // Extraer valores de los inputs
    const nombre = inputs[0].value || `profesor ${profeCount + 1}`;
    const apellidos = inputs[1].value;
    const correo = inputs[2].value;
    
    // Guardar datos en atributos data para usarlos en edición
    nuevoProfe.dataset.nombre = nombre;
    nuevoProfe.dataset.apellidos = apellidos;
    nuevoProfe.dataset.correo = correo;
    
    nuevoProfe.classList.add("profesor");
    nuevoProfe.innerHTML = `
      <span>${nombre}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar"  id="verAlu" >❌</button>
      </div>
    `;
    
    listProfes.appendChild(nuevoProfe);
    modal.style.display = "none";
    form.reset();
  };
});

// Eliminar alumno al hacer clic en el botón de eliminar
listProfes.addEventListener("click", function(event) {
  if (event.target.classList.contains("eliminar")) {
    event.target.closest(".profesor").remove();
  }
  
  // Al hacer clic en "ver", abrir la ventana emergente para editar
  if (event.target.classList.contains("ver")) {
    const profElement = event.target.closest(".profesor");
    crearModalVerEditarProfe(profElement);
  }
});

// Función para crear la ventana emergente (modal) de ver y editar alumno
function crearModalVerEditarProfe(profElement) {
  // Crear el modal
  const modalProfe = document.createElement("div");
  modalProfe.className = "modal";
  modalProfe.id = "modalVerEditarProfe";
  
  // Recuperar los datos existentes
  const nombre = profElement.dataset.nombre || "";
  const apellidos = profElement.dataset.apellidos || "";
  const correo = profElement.dataset.correo || "";
  
  modalProfe.innerHTML = `
    <div class="modal-contenido">
      <h3>Editar Datos del Profesor</h3>
      <form id="formVerEditarProfe">

        <label>Nombre</label>
        <input type="text" placeholder="Nombre " value="${nombre}" required>
        <label>Apellidos</label>
        <input type="text" placeholder="Apellidos" value="${apellidos}" required>
        <label>correo</label>
        <input type="email" placeholder="correo" value="${correo}">
        <div class="modal-botones">

          <button type="button" class="cancelar">Cancelar</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modalProfe);
  modalProfe.style.display = "flex";
  
  const form = modalProfe.querySelector("form");
  
  // Configurar botón de cancelar
  modalProfe.querySelector(".cancelar").addEventListener("click", () => {
    modalProfe.remove();
  });
  
  // Manejar el envío del formulario para guardar cambios
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = form.getElementsByTagName("input");
    const nuevoNombre = inputs[0].value;
    const nuevoApellidos = inputs[1].value;
    const nuevoCorreo = inputs[2].value;
    
    // Actualizar datos en el alumno
    profElement.dataset.nombre = nuevoNombre;
    profElement.dataset.apellidos = nuevoApellidos;
    profElement.dataset.correo = nuevoCorreo;
    profElement.querySelector("span").textContent = nuevoNombre;
    
    modalProfe.remove();
  });
}
