document.addEventListener("DOMContentLoaded", async function () {
    await cargarCiclos();
    await cargarProfesores();
    await cargarModulos();
});

const btnAgregar = document.getElementById("botonAgregar1");
const lista = document.getElementById("listaModulos");

// Mostrar Modal
btnAgregar.addEventListener("click", function () {
    crearModalModulo();
});

async function cargarCiclos() {
    try {
        const response = await fetch("/api/admin/ciclos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los ciclos");

        const ciclos = await response.json();
        window.ciclos = ciclos;
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los ciclos.");
    }
}

async function cargarProfesores() {
    try {
        const response = await fetch("/api/admin/profesores", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los profesores");

        const profesores = await response.json();
        window.profesores = profesores;
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los profesores.");
    }
}

async function cargarModulos() {
    try {
        const response = await fetch("/api/admin/modulos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los módulos");

        const modulos = await response.json();
        lista.innerHTML = "";

        modulos.forEach(modulo => {
            agregarModuloLista(modulo);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los módulos.");
    }
}

function agregarModuloLista(modulo) {
    const div = document.createElement("div");
    div.className = "modulo";
    div.dataset.id = modulo.idModulo;
    div.dataset.nombre = modulo.nombre;
    div.dataset.codigo = modulo.codigo;
    div.dataset.horasSemana = modulo.horasSemana;
    div.dataset.horasTotales = modulo.horasTotales;
    div.dataset.idCiclo = modulo.ciclo?.idCiclo;  // Añadir
    div.dataset.idProfesor = modulo.profesor?.idProfesor;  // Añadir

    div.innerHTML = `
        <span>${modulo.nombre} (${modulo.codigo})</span>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;

    lista.appendChild(div);
}


function crearModalModulo(modulo = {}) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>${modulo.idModulo ? "Editar Módulo" : "Nuevo Módulo"}</h3>
            <form id="formModulo">
                <input type="hidden" id="idModulo" value="${modulo.idModulo || ''}">
                <input type="text" id="nombreModulo" placeholder="Nombre módulo" value="${modulo.nombre || ''}" required>
                <input type="text" id="codigoModulo" placeholder="Código" value="${modulo.codigo || ''}" required>
                <input type="number" id="horasSemana" placeholder="Horas por semana" value="${modulo.horasSemana || ''}" required>
                <input type="number" id="horasTotales" placeholder="Horas totales" value="${modulo.horasTotales || ''}" required>
                <select id="cicloModulo">
                    ${window.ciclos.map(c => `<option value="${c.idCiclo}" ${modulo.ciclo?.idCiclo === c.idCiclo ? "selected" : ""}>${c.nombre}</option>`).join('')}
                </select>
                <select id="profesorModulo">
                    ${window.profesores.map(p => `<option value="${p.idProfesor}" ${modulo.profesor?.idProfesor === p.idProfesor ? "selected" : ""}>${p.nombre} ${p.apellidos}</option>`).join('')}
                </select>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">${modulo.idModulo ? "Guardar" : "Agregar"}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.querySelector(".cancelar").onclick = () => modal.remove();

    modal.querySelector("#formModulo").onsubmit = (e) => {
        e.preventDefault();
        guardarModulo(modulo.idModulo);
    };
}

async function guardarModulo(idModulo) {
    const nombre = document.getElementById("nombreModulo").value.trim();
    const codigo = document.getElementById("codigoModulo").value.trim();
    const horasSemana = document.getElementById("horasSemana").value.trim();
    const horasTotales = document.getElementById("horasTotales").value.trim();
    const cicloId = document.getElementById("cicloModulo").value;
    const profesorId = document.getElementById("profesorModulo").value;

    if (!nombre || !codigo || !horasSemana || !horasTotales || !cicloId || !profesorId) {
        alert("Todos los campos son obligatorios");
        return;
    }

    // Ahora comprobamos que las horas sean realmente números válidos
    if (isNaN(horasSemana) || isNaN(horasTotales) || horasSemana <= 0 || horasTotales <= 0) {
        alert("Las horas deben ser números mayores que 0");
        return;
    }

    const modulo = {
        nombre,
        codigo,
        horasSemana: parseInt(horasSemana),  // Convertimos SOLO si son válidos
        horasTotales: parseInt(horasTotales),
        ciclo: { idCiclo: parseInt(cicloId) },
        profesor: { idProfesor: parseInt(profesorId) }
    };

    try {
        const url = idModulo ? `/api/admin/modulos/${idModulo}` : "/api/admin/modulos";
        const method = idModulo ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(modulo)
        });

        if (!response.ok) throw new Error("Error al guardar el módulo");

        alert(idModulo ? "Módulo actualizado" : "Módulo agregado");
        document.querySelector(".modal").remove();
        cargarModulos();
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el módulo");
    }
}

lista.addEventListener("click", function (e) {
    const moduloElement = e.target.closest(".modulo");
    if (e.target.classList.contains("ver")) {
        const modulo = {
            idModulo: moduloElement.dataset.id,
            nombre: moduloElement.dataset.nombre,
            codigo: moduloElement.dataset.codigo,
            horasSemana: parseInt(moduloElement.dataset.horasSemana), // Ahora sí
            horasTotales: parseInt(moduloElement.dataset.horasTotales), // Ahora sí
            ciclo: {
                idCiclo: moduloElement.dataset.idCiclo
            },
            profesor: {
                idProfesor: moduloElement.dataset.idProfesor
            }
        };
        crearModalModulo(modulo);
    }

    if (e.target.classList.contains("eliminar")) {
        const id = moduloElement.dataset.id;
        eliminarModulo(id);
    }
});

async function eliminarModulo(id) {
    if (!confirm("¿Seguro que deseas eliminar este módulo?")) return;

    try {
        const response = await fetch(`/api/admin/modulos/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Error al eliminar el módulo");

        alert("Módulo eliminado");
        cargarModulos();
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el módulo");
    }
}