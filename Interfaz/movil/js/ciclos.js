const btnAgregarCiclo = document.getElementById("botonAgregarCiclo");
const listaCiclos = document.getElementById("listaCiclos");

// Función para crear el modal de ingreso de datos
function crearModalCiclo() {
    const modal = document.createElement("div");
    modal.id = "modalCiclo";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Nuevo Ciclo</h3>
            <form id="formCiclo">
                <input type="text" id="codigoCiclo" placeholder="Código" required>
                <input type="text" id="nombreCiclo" placeholder="Nombre del ciclo" required>
                <input type="number" id="duracionCiclo" placeholder="Duración en horas" required>
                <textarea id="descripcionCiclo" placeholder="Descripción"></textarea>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">Agregar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("formCiclo").addEventListener("submit", function (e) {
        e.preventDefault();
        agregarCiclo();
    });

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });
}

// Evento para abrir el modal al hacer clic en "Agregar"
btnAgregarCiclo.addEventListener("click", function () {
    if (!document.getElementById("modalCiclo")) {
        crearModalCiclo();
    }
    document.getElementById("modalCiclo").style.display = "flex";
});

// Función para agregar un ciclo a la lista
function agregarCiclo() {
    const codigo = document.getElementById("codigoCiclo").value.trim();
    const nombre = document.getElementById("nombreCiclo").value.trim();
    const duracion = document.getElementById("duracionCiclo").value.trim();
    const descripcion = document.getElementById("descripcionCiclo").value.trim();

    if (!codigo || !nombre || !duracion) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }

    const nuevoCiclo = document.createElement("div");
    nuevoCiclo.classList.add("ciclo");
    nuevoCiclo.dataset.codigo = codigo;
    nuevoCiclo.dataset.nombre = nombre;
    nuevoCiclo.dataset.duracion = duracion;
    nuevoCiclo.dataset.descripcion = descripcion;

    nuevoCiclo.innerHTML = `
        <span>${nombre} (${codigo})</span>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;

    listaCiclos.appendChild(nuevoCiclo);
    document.getElementById("modalCiclo").remove();
}

// Evento para manejar la eliminación y edición de ciclos
listaCiclos.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar")) {
        event.target.closest(".ciclo").remove();
    }

    if (event.target.classList.contains("ver")) {
        const cicloElement = event.target.closest(".ciclo");
        if (cicloElement) {
            crearModalVerEditarCiclo(cicloElement);
        }
    }
});

// Función para crear la ventana emergente (modal) de ver y editar ciclo
function crearModalVerEditarCiclo(cicloElement) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modalVerEditarCiclo";

    // Recuperar los datos existentes
    const codigo = cicloElement.dataset.codigo || "";
    const nombre = cicloElement.dataset.nombre || "";
    const duracion = cicloElement.dataset.duracion || "";
    const descripcion = cicloElement.dataset.descripcion || "";

    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Editar Datos del Ciclo</h3>
            <form id="formVerEditarCiclo">
                <label>Código</label>
                <input type="text" id="editCodigoCiclo" value="${codigo}" required>
                <label>Nombre</label>
                <input type="text" id="editNombreCiclo" value="${nombre}" required>
                <label>Duración</label>
                <input type="number" id="editDuracionCiclo" value="${duracion}" required>
                <label>Descripción</label>
                <textarea id="editDescripcionCiclo">${descripcion}</textarea>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">Guardar cambios</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });

    document.getElementById("formVerEditarCiclo").addEventListener("submit", function (e) {
        e.preventDefault();
        actualizarCiclo(cicloElement);
    });
}

// Función para actualizar los datos del ciclo
function actualizarCiclo(cicloElement) {
    const nuevoCodigo = document.getElementById("editCodigoCiclo").value.trim();
    const nuevoNombre = document.getElementById("editNombreCiclo").value.trim();
    const nuevaDuracion = document.getElementById("editDuracionCiclo").value.trim();
    const nuevaDescripcion = document.getElementById("editDescripcionCiclo").value.trim();

    if (!nuevoCodigo || !nuevoNombre || !nuevaDuracion) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }

    cicloElement.dataset.codigo = nuevoCodigo;
    cicloElement.dataset.nombre = nuevoNombre;
    cicloElement.dataset.duracion = nuevaDuracion;
    cicloElement.dataset.descripcion = nuevaDescripcion;
    cicloElement.querySelector("span").textContent = `${nuevoNombre} (${nuevoCodigo})`;

    document.getElementById("modalVerEditarCiclo").remove();
}
