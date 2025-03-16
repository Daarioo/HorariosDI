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
                <h4>Número de Matrícula:</h4>
                <input type="text" id="numeroMatricula" required>
                <h4>Ciclo:</h4>
                <select id="selectCiclo" required>
                    <option value="DAM">DAM</option>
                    <option value="DAW">DAW</option>
                    <option value="ASIR">ASIR</option>
                </select>
                <h4>Módulo:</h4>
                <select id="selectModulo" required>
                    <option value="Programación">Programación</option>
                    <option value="Bases de Datos">Bases de Datos</option>
                    <option value="Lenguaje de Marcas">Lenguaje de Marcas</option>
                </select>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit" class="añadir">Agregar</button>
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
    const matricula = document.getElementById("numeroMatricula").value.trim();
    const ciclo = document.getElementById("selectCiclo").value;
    const modulo = document.getElementById("selectModulo").value;

    if (!matricula) {
        alert("Por favor, introduzca el número de matrícula.");
        return;
    }

    const nuevoModulo = document.createElement("div");
    nuevoModulo.classList.add("modulo");
    nuevoModulo.dataset.matricula = matricula;
    nuevoModulo.dataset.ciclo = ciclo;
    nuevoModulo.dataset.modulo = modulo;

    nuevoModulo.innerHTML = `
        <span>${modulo} - ${ciclo} (Matrícula: ${matricula})</span>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;

    lista.appendChild(nuevoModulo);
    document.getElementById("modalModulo").remove();
}

// Evento para manejar eliminación y edición de módulos
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

// Función para crear la ventana de edición/ver módulo
function crearModalVerEditarModulo(moduloElement) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modalVerEditarModulo";

    const matricula = moduloElement.dataset.matricula || "";
    const ciclo = moduloElement.dataset.ciclo || "DAM";
    const modulo = moduloElement.dataset.modulo || "Programación";

    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Editar Datos del Módulo</h3>
            <form id="formVerEditarModulo">
                <label>Número de Matrícula</label>
                <input type="text" id="editNumeroMatricula" value="${matricula}" required>

                <label>Ciclo</label>
                <select id="editSelectCiclo">
                    <option value="DAM" ${ciclo === "DAM" ? "selected" : ""}>DAM</option>
                    <option value="DAW" ${ciclo === "DAW" ? "selected" : ""}>DAW</option>
                    <option value="ASIR" ${ciclo === "ASIR" ? "selected" : ""}>ASIR</option>
                </select>

                <label>Módulo</label>
                <select id="editSelectModulo">
                    <option value="Programación" ${modulo === "Programación" ? "selected" : ""}>Programación</option>
                    <option value="Bases de Datos" ${modulo === "Bases de Datos" ? "selected" : ""}>Bases de Datos</option>
                    <option value="Lenguaje de Marcas" ${modulo === "Lenguaje de Marcas" ? "selected" : ""}>Lenguaje de Marcas</option>
                </select>

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

// Función para actualizar datos
function actualizarModulo(moduloElement) {
    const nuevaMatricula = document.getElementById("editNumeroMatricula").value.trim();
    const nuevoCiclo = document.getElementById("editSelectCiclo").value;
    const nuevoModulo = document.getElementById("editSelectModulo").value;

    if (!nuevaMatricula) {
        alert("Por favor, introduzca el número de matrícula.");
        return;
    }

    moduloElement.dataset.matricula = nuevaMatricula;
    moduloElement.dataset.ciclo = nuevoCiclo;
    moduloElement.dataset.modulo = nuevoModulo;

    moduloElement.querySelector("span").textContent = `${nuevoModulo} - ${nuevoCiclo} (Matrícula: ${nuevaMatricula})`;

    document.getElementById("modalVerEditarModulo").remove();
}

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', { credentials: 'include' });
        const data = await response.json();

        if (data.authenticated) {
            const userName = document.getElementById("userName");
            userName.innerText = data.nombre;
        } else {
            console.log("Usuario no autenticado");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

await obtenerUsuario();