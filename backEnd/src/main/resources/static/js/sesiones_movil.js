const btnAgregar = document.getElementById("botonAgregar5");
const listaSesiones = document.getElementById("listaSesiones");

// Función para crear el modal de ingreso de datos
function crearModalSesion() {
    const modal = document.createElement("div");
    modal.id = "modalSesion";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Nueva Sesión</h3>
            <form id="formSesion">
                <input type="text" id="horaInicio" placeholder="Hora de inicio" required>
                <input type="text" id="horaFin" placeholder="Hora de fin" required>
                <input type="text" id="dia" placeholder="Día" required>
                <input type="text" id="aula" placeholder="Aula" required>
                <input type="text" id="cursoAcademico" placeholder="Curso" required>
                <input type="text" id="modulo" placeholder="Módulo" required>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">Agregar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("formSesion").addEventListener("submit", function (e) {
        e.preventDefault();
        agregarSesion();
    });

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });
}

// Evento para abrir el modal al hacer clic en "Agregar"
btnAgregar.addEventListener("click", function () {
    if (!document.getElementById("modalSesion")) {
        crearModalSesion();
    }
    document.getElementById("modalSesion").style.display = "flex";
});

// Función para agregar una sesión a la lista
function agregarSesion() {
    const horaInicio = document.getElementById("horaInicio").value.trim();
    const horaFin = document.getElementById("horaFin").value.trim();
    const dia = document.getElementById("dia").value.trim();
    const aula = document.getElementById("aula").value.trim();
    const cursoAcademico = document.getElementById("cursoAcademico").value.trim();
    const modulo = document.getElementById("modulo").value.trim();

    if (!horaInicio || !horaFin || !dia || !aula || !cursoAcademico || !modulo) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const nuevaSesion = document.createElement("div");
    nuevaSesion.classList.add("sesion");
    nuevaSesion.dataset.horaInicio = horaInicio;
    nuevaSesion.dataset.horaFin = horaFin;
    nuevaSesion.dataset.dia = dia;
    nuevaSesion.dataset.aula = aula;
    nuevaSesion.dataset.cursoAcademico = cursoAcademico;
    nuevaSesion.dataset.modulo = modulo;

    nuevaSesion.innerHTML = `
        <span>${modulo} - ${dia} (${horaInicio} - ${horaFin})</span>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;

    listaSesiones.appendChild(nuevaSesion);
    document.getElementById("modalSesion").remove();
}

// Evento para manejar la eliminación y edición de sesiones
listaSesiones.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar")) {
        event.target.closest(".sesion").remove();
    }

    if (event.target.classList.contains("ver")) {
        const sesionElement = event.target.closest(".sesion");
        if (sesionElement) {
            crearModalVerEditarSesion(sesionElement);
        }
    }
});

// Función para crear la ventana emergente (modal) de ver y editar sesión
function crearModalVerEditarSesion(sesionElement) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modalVerEditarSesion";

    // Recuperar los datos existentes
    const horaInicio = sesionElement.dataset.horaInicio || "";
    const horaFin = sesionElement.dataset.horaFin || "";
    const dia = sesionElement.dataset.dia || "";
    const aula = sesionElement.dataset.aula || "";
    const cursoAcademico = sesionElement.dataset.cursoAcademico || "";
    const modulo = sesionElement.dataset.modulo || "";

    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Editar Sesión</h3>
            <form id="formVerEditarSesion">
                <label>Hora de Inicio</label>
                <input type="text" id="editHoraInicio" value="${horaInicio}" required>
                <label>Hora de Fin</label>
                <input type="text" id="editHoraFin" value="${horaFin}" required>
                <label>Día</label>
                <input type="text" id="editDia" value="${dia}" required>
                <label>Aula</label>
                <input type="text" id="editAula" value="${aula}" required>
                <label>Curso</label>
                <input type="text" id="editCursoAcademico" value="${cursoAcademico}" required>
                <label>Módulo</label>
                <input type="text" id="editModulo" value="${modulo}" required>
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

    document.getElementById("formVerEditarSesion").addEventListener("submit", function (e) {
        e.preventDefault();
        actualizarSesion(sesionElement);
    });
}

// Función para actualizar los datos de la sesión
function actualizarSesion(sesionElement) {
    sesionElement.dataset.horaInicio = document.getElementById("editHoraInicio").value.trim();
    sesionElement.dataset.horaFin = document.getElementById("editHoraFin").value.trim();
    sesionElement.dataset.dia = document.getElementById("editDia").value.trim();
    sesionElement.dataset.aula = document.getElementById("editAula").value.trim();
    sesionElement.dataset.cursoAcademico = document.getElementById("editCursoAcademico").value.trim();
    sesionElement.dataset.modulo = document.getElementById("editModulo").value.trim();
    sesionElement.querySelector("span").textContent = `${sesionElement.dataset.modulo} - ${sesionElement.dataset.dia} (${sesionElement.dataset.horaInicio} - ${sesionElement.dataset.horaFin})`;
    document.getElementById("modalVerEditarSesion").remove();
}
