const btnAgregar = document.getElementById("botonAgregar1");
const lista = document.getElementById("listaModulos");

// Función para crear el modal de ingreso de datos
function crearModalModulo() {
    const modal = document.createElement("div");
    modal.id = "modalModulo";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Nuevo Módulo</h3>
            <form id="formModulo">
                <input type="text" id="codigoModulo" placeholder="Código" required>
                <input type="text" id="nombreModulo" placeholder="Nombre módulo" required>
                <input type="number" id="horasSem" placeholder="Horas semanales">
                <input type="number" id="horasTot" placeholder="Horas totales">
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">Agregar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("formModulo").addEventListener("submit", function (e) {
        e.preventDefault();
        agregarModulo();
    });

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });
}

// Evento para abrir el modal al hacer clic en "Agregar"
btnAgregar.addEventListener("click", function () {
    if (!document.getElementById("modalModulo")) {
        crearModalModulo();
    }
    document.getElementById("modalModulo").style.display = "flex";
});

// Función para agregar un módulo a la lista
function agregarModulo() {
    const codigo = document.getElementById("codigoModulo").value.trim();
    const nombre = document.getElementById("nombreModulo").value.trim();
    const familia = document.getElementById("familiaModulo").value.trim();

    if (!codigo || !nombre) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }

    const nuevoModulo = document.createElement("div");
    nuevoModulo.classList.add("modulo");
    nuevoModulo.dataset.codigo = codigo;
    nuevoModulo.dataset.nombre = nombre;
    nuevoModulo.dataset.familia = familia;

    nuevoModulo.innerHTML = `
        <span>${nombre} (${codigo})</span>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;

    lista.appendChild(nuevoModulo);
    document.getElementById("modalModulo").remove();
}

// Evento para manejar la eliminación y edición de módulos
lista.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar")) {
        event.target.closest(".modulo").remove();
    }

    if (event.target.classList.contains("ver")) {
        const moduloElement = event.target.closest(".modulo");
        if (moduloElement) {
            crearModalVerEditarModulo(moduloElement);
        }
    }
});

// Función para crear la ventana emergente (modal) de ver y editar módulo
function crearModalVerEditarModulo(moduloElement) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modalVerEditarModulo";

    // Recuperar los datos existentes
    const codigo = moduloElement.dataset.codigo || "";
    const nombre = moduloElement.dataset.nombre || "";
    const familia = moduloElement.dataset.familia || "";

    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Editar Datos del Módulo</h3>
            <form id="formVerEditarModulo">
                <label>Código</label>
                <input type="text" id="editCodigoModulo" value="${codigo}" required>
                <label>Nombre</label>
                <input type="text" id="editNombreModulo" value="${nombre}" required>
                <label>Familia Profesional</label>
                <input type="text" id="editFamiliaModulo" value="${familia}">
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

    document.getElementById("formVerEditarModulo").addEventListener("submit", function (e) {
        e.preventDefault();
        actualizarModulo(moduloElement);
    });
}

// Función para actualizar los datos del módulo
function actualizarModulo(moduloElement) {
    const nuevoCodigo = document.getElementById("editCodigoModulo").value.trim();
    const nuevoNombre = document.getElementById("editNombreModulo").value.trim();
    const nuevaFamilia = document.getElementById("editFamiliaModulo").value.trim();

    if (!nuevoCodigo || !nuevoNombre) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }

    moduloElement.dataset.codigo = nuevoCodigo;
    moduloElement.dataset.nombre = nuevoNombre;
    moduloElement.dataset.familia = nuevaFamilia;
    moduloElement.querySelector("span").textContent = `${nuevoNombre} (${nuevoCodigo})`;

    document.getElementById("modalVerEditarModulo").remove();
}
