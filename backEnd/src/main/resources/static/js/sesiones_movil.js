document.addEventListener("DOMContentLoaded", async function () {
    await cargarModulos(); // Cargar módulos al iniciar
    await cargarSesiones(); // Cargar sesiones al iniciar
    obtenerUsuario();

    // Asegurémonos de agregar el event listener para el botón
    const btnAgregar = document.getElementById("botonAgregar5");
    const listaSesiones = document.getElementById("listaSesiones");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", function() {
            crearModalSesion(); // Llamar a la función para crear el modal
        });
    } else {
        console.error("El botón de agregar no se encontró.");
    }
});



// Función para cargar módulos desde la API y llenar el select
async function cargarModulos() {
    try {
        const response = await fetch("/api/admin/modulos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los módulos");

        const modulos = await response.json();
        window.modulos = modulos; // Guardamos los módulos en una variable global
    } catch (error) {
        console.error("Error al cargar módulos:", error);
        alert("No se pudieron cargar los módulos.");
    }
}

function crearModalSesion(sesion = null) {
    const modal = document.createElement("div");
    modal.id = "modalSesion";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>${sesion ? 'Editar Sesión' : 'Nueva Sesión'}</h3>
            <form id="formSesion">
                <input type="text" id="horaInicio" placeholder="Hora de inicio" required>
                <input type="text" id="horaFin" placeholder="Hora de fin" required>
                <input type="text" id="dia" placeholder="Día" required>
                <input type="text" id="aula" placeholder="Aula" required>
                <input type="text" id="cursoAcademico" placeholder="Curso" required>
                <select id="modulo" required>
                    <option value="">Selecciona un módulo</option>
                </select>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">${sesion ? 'Actualizar' : 'Agregar'}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = "flex";

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });

    // Cargar módulos al modal
    cargarModulosSelect(sesion);

    // Si estamos editando una sesión, cargamos los valores en el formulario
    if (sesion) {
        document.getElementById("horaInicio").value = sesion.horaInicio;
        document.getElementById("horaFin").value = sesion.horaFin;
        document.getElementById("dia").value = sesion.dia;
        document.getElementById("aula").value = sesion.aula;
        document.getElementById("cursoAcademico").value = sesion.cursoAcademico;
        document.getElementById("modulo").value = sesion.modulo.idModulo;
    }

    // Evento de submit para agregar o actualizar sesión
    document.getElementById("formSesion").addEventListener("submit", function(e) {
        e.preventDefault();
        if (sesion) {
            actualizarSesion(sesion.idSesion);
        } else {
            agregarSesion(e);
        }
    });
}

// Función para cargar los módulos en el selector
function cargarModulosSelect(sesion) {
    const selectModulo = document.getElementById("modulo");
    selectModulo.innerHTML = '<option value="">Selecciona un módulo</option>'; // Limpiar opciones previas

    // Agregar los módulos al select
    window.modulos.forEach(modulo => {
        const option = document.createElement("option");
        option.value = modulo.idModulo;
        option.textContent = modulo.nombre;
        selectModulo.appendChild(option);
    });

    // Si estamos editando una sesión, seleccionamos el módulo correspondiente
    if (sesion) {
        selectModulo.value = sesion.modulo.idModulo;
    }
}

// Función para cargar sesiones desde la API
async function cargarSesiones() {
    try {
        const response = await fetch("/api/admin/sesiones", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener sesiones");

        const sesiones = await response.json();
        listaSesiones.innerHTML = "";

        sesiones.forEach(sesion => {
            agregarSesionLista(sesion);
        });
    } catch (error) {
        console.error("Error al cargar sesiones:", error);
        alert("No se pudieron cargar las sesiones.");
    }
}

// Función para agregar sesión a la lista
function agregarSesionLista(sesion) {
    const nuevaSesion = document.createElement("div");
    nuevaSesion.classList.add("sesion");
    nuevaSesion.dataset.id = sesion.idSesion;

    nuevaSesion.innerHTML = `
        <span>${sesion.modulo.nombre} - ${sesion.dia} (${sesion.horaInicio} - ${sesion.horaFin})</span>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;

    listaSesiones.appendChild(nuevaSesion);
}

// Evento para eliminar o ver sesión
listaSesiones.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar")) {
        const sesionId = event.target.closest(".sesion").dataset.id;
        eliminarSesion(sesionId);
    }

    if (event.target.classList.contains("ver")) {
        const sesionId = event.target.closest(".sesion").dataset.id;
        editarSesion(sesionId);
    }
});

// Función para agregar sesión
async function agregarSesion(e) {
    e.preventDefault();
    const form = e.target;
    const modulo = form.querySelector("#modulo").value;
    const horaInicio = form.querySelector("#horaInicio").value;
    const horaFin = form.querySelector("#horaFin").value;
    const dia = form.querySelector("#dia").value;
    const aula = form.querySelector("#aula").value;
    const cursoAcademico = form.querySelector("#cursoAcademico").value;

    if (!modulo || !horaInicio || !horaFin || !dia || !aula || !cursoAcademico) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const sesion = {
        modulo: { idModulo: parseInt(modulo) },
        horaInicio,
        horaFin,
        dia,
        aula,
        cursoAcademico
    };

    try {
        const response = await fetch("/api/admin/sesiones", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sesion)
        });

        if (!response.ok) throw new Error("Error al agregar sesión");

        alert("Sesión agregada correctamente");
        document.getElementById("modalSesion").remove();
        await cargarSesiones();
    } catch (error) {
        console.error("Error al agregar sesión:", error);
        alert("No se pudo agregar la sesión.");
    }
}

async function eliminarSesion(idSesion) {
    if (!confirm("¿Seguro que deseas eliminar esta sesión?")) return;

    try {
        const response = await fetch(`/api/admin/sesiones/${idSesion}`, { // Corrige la URL aquí
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Error al eliminar sesión");

        alert("Sesión eliminada correctamente");
        await cargarSesiones();
    } catch (error) {
        console.error("Error al eliminar sesión:", error);
        alert("No se pudo eliminar la sesión.");
    }
}

// Función para editar sesión
async function editarSesion(idSesion) {
    try {
        const response = await fetch(`/api/admin/sesiones/${idSesion}`, { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener la sesión");

        const sesion = await response.json();
        crearModalSesion(sesion); // Pasamos la sesión para editar

    } catch (error) {
        console.error("Error al cargar sesión para editar:", error);
        alert("No se pudo cargar la sesión.");
    }
}

// Función para actualizar sesión
async function actualizarSesion(idSesion) {
    const form = document.getElementById("formSesion");
    const modulo = form.querySelector("#modulo").value;
    const horaInicio = form.querySelector("#horaInicio").value;
    const horaFin = form.querySelector("#horaFin").value;
    const dia = form.querySelector("#dia").value;
    const aula = form.querySelector("#aula").value;
    const cursoAcademico = form.querySelector("#cursoAcademico").value;

    if (!modulo || !horaInicio || !horaFin || !dia || !aula || !cursoAcademico) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const sesion = {
        modulo: { idModulo: parseInt(modulo) },
        horaInicio,
        horaFin,
        dia,
        aula,
        cursoAcademico
    };

    try {
        const response = await fetch(`/api/admin/sesiones/${idSesion}`, {
            method: "PUT", // Cambiar a PUT para actualización
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sesion)
        });

        if (!response.ok) throw new Error("Error al actualizar sesión");

        alert("Sesión actualizada correctamente");
        document.getElementById("modalSesion").remove();
        await cargarSesiones();
    } catch (error) {
        console.error("Error al actualizar sesión:", error);
        alert("No se pudo actualizar la sesión.");
    }
}

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', { credentials: 'include' });
        const data = await response.json();

        if (data.authenticated) {
            let nombre = document.getElementById("usuarioFooter");
            nombre.innerText = data.nombre;
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}