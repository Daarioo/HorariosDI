document.addEventListener("DOMContentLoaded", async function () {
    await cargarModulos();  // Cargar módulos en el select
    await cargarSesiones(); // Cargar sesiones en la tabla
    obtenerUsuario();
});

// Función para abrir el modal
function mostrarModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
    document.getElementById("moduloForm").reset();

    let submitButton = document.querySelector("#moduloForm button[type='submit']");
    submitButton.innerText = "Guardar";
    submitButton.removeAttribute("data-id"); // Quitar el ID si estaba en modo edición
}

// Obtener los módulos disponibles para llenar el select
async function cargarModulos() {
    try {
        const response = await fetch("/api/admin/modulos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los módulos");

        const modulos = await response.json();
        let selectModulo = document.getElementById("modulo");

        selectModulo.innerHTML = `<option value="">Selecciona un módulo</option>`;
        modulos.forEach(modulo => {
            let option = document.createElement("option");
            option.value = modulo.idModulo;
            option.textContent = `${modulo.nombre} (${modulo.ciclo.nombre})`;
            selectModulo.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los módulos.");
    }
}

// Obtener y mostrar todas las sesiones en la tabla
async function cargarSesiones() {
    try {
        const response = await fetch("/api/admin/sesiones", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener las sesiones");

        const sesiones = await response.json();
        let tbody = document.querySelector("#sesionesTabla");
        tbody.innerHTML = ""; // Limpiar tabla antes de llenarla

        sesiones.forEach(sesion => agregarFilaSesion(sesion));
    } catch (error) {
        console.error(error);
        alert("Error al cargar las sesiones.");
    }
}

// Función para agregar una fila de sesión a la tabla
function agregarFilaSesion(sesion) {
    let tbody = document.querySelector("#sesionesTabla");
    let tr = document.createElement("tr");
    tr.setAttribute("data-id", sesion.idSesion); // Guardar ID en la fila

    tr.innerHTML = `
        <td>${sesion.modulo.nombre} (${sesion.modulo.ciclo.nombre})</td>
        <td>${sesion.horaInicio}</td>
        <td>${sesion.horaFin}</td>
        <td>${sesion.dia}</td>
        <td>${sesion.aula}</td>
        <td>${sesion.cursoAcademico}</td>
        <td>
            <button class="btn-editar" onclick="editarSesion(${sesion.idSesion})">✏️ Editar</button>
            <button class="btn-eliminar" onclick="eliminarSesion(${sesion.idSesion})">🗑️ Eliminar</button>
        </td>
    `;

    tbody.appendChild(tr);
}

// Función para agregar o editar una sesión
async function agregarSesion(event) {
    event.preventDefault();

    let idSesion = document.querySelector("#moduloForm button[type='submit']").getAttribute("data-id");
    let horaInicio = document.getElementById("horaInicio").value;
    let horaFin = document.getElementById("horaFin").value;
    let dia = document.getElementById("dia").value;
    let aula = document.getElementById("aula").value;
    let cursoAcademico = document.getElementById("cursoAcademico").value;
    let moduloId = document.getElementById("modulo").value;

    if (!horaInicio || !horaFin || !dia || !aula || !cursoAcademico || !moduloId) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    let sesionData = {
        horaInicio,
        horaFin,
        dia,
        aula,
        cursoAcademico,
        modulo: { idModulo: parseInt(moduloId) }
    };

    try {
        let response;
        if (idSesion) {
            response = await fetch(`/api/admin/sesiones/${idSesion}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sesionData)
            });
        } else {
            response = await fetch("/api/admin/sesiones", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sesionData)
            });
        }

        if (!response.ok) throw new Error("Error al guardar la sesión");

        alert(idSesion ? "Sesión actualizada exitosamente" : "Sesión agregada exitosamente");

        cerrarModal();
        await cargarSesiones(); // Recargar la tabla
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar la sesión.");
    }
}

// Función para cargar datos de una sesión en el formulario para editar
async function editarSesion(idSesion) {
    try {
        const response = await fetch(`/api/admin/sesiones/${idSesion}`, { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener la sesión");

        const sesion = await response.json();

        document.getElementById("horaInicio").value = sesion.horaInicio;
        document.getElementById("horaFin").value = sesion.horaFin;
        document.getElementById("dia").value = sesion.dia;
        document.getElementById("aula").value = sesion.aula;
        document.getElementById("cursoAcademico").value = sesion.cursoAcademico;
        document.getElementById("modulo").value = sesion.modulo.idModulo;

        let submitButton = document.querySelector("#moduloForm button[type='submit']");
        submitButton.setAttribute("data-id", idSesion);
        submitButton.innerText = "Confirmar datos";

        mostrarModal();
    } catch (error) {
        console.error(error);
        alert("Error al cargar los datos de la sesión.");
    }
}

// Función para eliminar una sesión
async function eliminarSesion(idSesion) {
    if (!confirm("¿Seguro que deseas eliminar esta sesión?")) return;

    try {
        const response = await fetch(`/api/admin/sesiones/${idSesion}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Error al eliminar la sesión");

        alert("Sesión eliminada exitosamente");

        document.querySelector(`tr[data-id='${idSesion}']`).remove();
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar la sesión.");
    }
}

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            usuario = data.nombre;
            let nombre = document.getElementById("usuarioFooter");
            nombre.innerText = usuario;
        } else {
            console.log("Usuario no autenticado");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}