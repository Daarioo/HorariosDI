const btnAgregar1 = document.getElementById("botonAgregar5");
const listCiclos = document.getElementById("listaCiclos");

// Función para crear el modal de ingreso de datos (Agregar alumno)
function crearModalCiclo() {
  const modal = document.createElement("div");
  modal.id = "modalCiclo";
  modal.className = "modal";
  modal.innerHTML = `
  <div class="modal-contenido">
    <h3>Nuevo Ciclo</h3>
    <form id="formCiclo">

        <label for="codigo">Código ciclo</label>
        <input type="text" id="codigo" placeholder="código" required>

        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" placeholder="nombre" required>

        <label for="duracion">Duración (horas)</label>
        <input type="number" id="duracion" placeholder="horas de duración" required>

        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" placeholder="Descripción"></textarea>

        <div class="modal-botones">
        <button type="button" class="cancelar" onclick="document.getElementById('formCiclo').reset();">Cancelar</button>
        <button type="submit">Agregar</button>
        </div>

    </form>
  </div>
  `;
  document.body.appendChild(modal);
}

// Event listener para el botón de agregar alumno
btnAgregar1.addEventListener("click", function() {
  // Crear modal si no existe
  if (!document.getElementById("modalCiclo")) {
    crearModalCiclo();
  }
  
  const modal = document.getElementById("modalCiclo");
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
    const cicloCount = listAlumnos.getElementsByClassName("ciclo").length;
    const nuevoCiclo = document.createElement("div");
    
    // Extraer valores de los inputs
    const codigo = inputs[0].value || `Ciclo ${cicloCount + 1}`;
    const nombre = inputs[1].value || `Ciclo ${cicloCount + 1}`;
    const duracion = inputs[2].value;
    const descripcion = inputs[3].value;
    
    // Guardar datos en atributos data para usarlos en edición
    nuevoCiclo.dataset.codigo = codigo;
    nuevoCiclo.dataset.nombre = nombre;
    nuevoCiclo.dataset.duracion = duracion;
    nuevoCiclo.dataset.descripcion = descripcion;
    
    nuevoCiclo.classList.add("ciclo");
    nuevoCiclo.innerHTML = `
      <span>${nombre}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar">❌</button>
      </div>
    `;
    
    listAlumnos.appendChild(nuevoCiclo);
    modal.style.display = "none";
    form.reset();
  };
});

// Eliminar alumno al hacer clic en el botón de eliminar
listAlumnos.addEventListener("click", function(event) {
  if (event.target.classList.contains("eliminar")) {
    event.target.closest(".ciclo").remove();
  }
  
  // Al hacer clic en "ver", abrir la ventana emergente para editar
  if (event.target.classList.contains("ver")) {
    const cicloElement = event.target.closest(".ciclo");
    crearModalVerEditarCiclo(cicloElement);
  }
});

// Función para crear la ventana emergente (modal) de ver y editar alumno
function crearModalVerEditarCiclo(cicloElement) {
  // Crear el modal
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modalVerEditarCiclo";
  
  // Recuperar los datos existentes
  const codigo = cicloElement.dataset.codigo || "";
  const nombre = cicloElement.dataset.nombre || cicloElement.querySelector("span").textContent;
  const duracion = cicloElement.dataset.duracion || "";
  const descripcion = cicloElement.dataset.descripcion || "";
  
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Editar Datos del Ciclo</h3>
      <form id="formVerEditarCiclo">
        <label>codigo </label>
        <input type="text" placeholder="codigo ciclo" value="${codigo}" required>

        <label>Nombre </label>
        <input type="text" placeholder="Nombre completo" value="${nombre}" required>

        <label>Duracion</label>
        <input type="number" placeholder="duracion en horas" value="${duracion}" required>

        <label>Teléfono</label>
        <input type="tel" placeholder="Teléfono" value="${descripcion}">

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
    const nuevoCodigo = inputs[0].value;
    const nuevoNombre = inputs[1].value;
    const nuevaDuracion = inputs[2].value;
    const nuevaDescripcion = inputs[3].value;
    
    // Actualizar datos en el alumno
    cicloElement.dataset.codigo = nuevoCodigo;
    cicloElement.dataset.nombre = nuevoNombre;
    cicloElement.dataset.duracion = nuevaDuracion;
    cicloElement.dataset.descripcion = nuevaDescripcion;
    cicloElement.querySelector("span").textContent = nuevoNombre;
    
    modal.remove();
  });
}