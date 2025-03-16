document.addEventListener("DOMContentLoaded", function () {
    obtenerUsuario();
    getProfesores();
});

const btnAgregar = document.getElementById("botonAgregar4");
const listProfes = document.getElementById("listaProfes");
const filtro = document.getElementById("filtro");
filtro.addEventListener("input", filtrarProfesores);

async function getProfesores() {
    try {
        const response = await fetch("/api/admin/profesores", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los profesores");
        window.profesores = await response.json();
        window.profesores.forEach((profesor)=>{
            agregarProfesorLista(profesor);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

function agregarProfesorLista(profesor) {
    const nuevoProfe = document.createElement("div");
    nuevoProfe.classList.add("profesor");
    nuevoProfe.dataset.id = profesor.idProfesor;
    nuevoProfe.dataset.nombre = profesor.nombre;
    nuevoProfe.dataset.apellidos = profesor.apellidos;
    nuevoProfe.dataset.correo = profesor.email;

    nuevoProfe.innerHTML = `
        <div class="profesor-info">
            <span><strong>${profesor.nombre} ${profesor.apellidos}</strong></span>
        </div>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button class="eliminar">❌</button>
        </div>
    `;
    listProfes.appendChild(nuevoProfe);
}


btnAgregar.addEventListener("click", function () {
    mostrarModalAgregar();
});

function mostrarModalAgregar() {
    const modal = crearModal("Nuevo Profesor", "Agregar");
    modal.onsubmit = async (e) => {
        e.preventDefault();
        await agregarProfesor(modal);
        modal.closest(".modal").remove();
        crearModalConfirmacion("Profesor agregado correctamente");
    };
}

async function agregarProfesor(modal) {
    const nuevoProfesor = obtenerDatosFormulario(modal);
    try {
        const response = await fetch("/api/admin/profesores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProfesor),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Error al agregar el profesor");
        if(window.profesores.length == window.profesoresFiltrados.length){
            getProfesores();
        } else {
            cargarProfesoresFiltrados();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listProfes.addEventListener("click", function (event) {
    const profElement = event.target.closest(".profesor");
    if (!profElement) return;

    if (event.target.classList.contains("eliminar")) {
        borrarProfesor(profElement.dataset.id);
    } else if (event.target.classList.contains("ver")) {
        mostrarModalEditar(profElement);
    }
});

function mostrarModalEditar(profElement) {
    const modal = crearModal("Editar Profesor", "Guardar cambios", profElement);
    modal.onsubmit = async (e) => {
        e.preventDefault();
        await editarProfesor(profElement.dataset.id, modal);
        modal.closest(".modal").remove();
        crearModalConfirmacion("Profesor editado correctamente");
    };
}

async function editarProfesor(id, modal) {
    const updatedProfesor = obtenerDatosFormulario(modal);
    try {
        const response = await fetch(`/api/admin/profesores/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProfesor),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Error al actualizar el profesor");
        if(window.profesores.length == window.profesoresFiltrados.length){
            getProfesores();
        } else {
            cargarProfesoresFiltrados();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function borrarProfesor(id) {
    try {
        const response = await fetch(`/api/admin/profesores/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Error al eliminar el profesor");
        if(window.profesores.length == window.profesoresFiltrados.length){
            getProfesores();
        } else {
            cargarProfesoresFiltrados();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
function crearModalConfirmacion(mensaje) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <p>${mensaje}</p>
            <button id="cerrarConfirmacion">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "flex";

    // Estilos para el botón de cerrar
    const botonCerrar = document.getElementById("cerrarConfirmacion");
    botonCerrar.style.padding = "10px 20px";
    botonCerrar.style.backgroundColor = "#007bff";
    botonCerrar.style.color = "white";
    botonCerrar.style.border = "none";
    botonCerrar.style.borderRadius = "5px";
    botonCerrar.style.cursor = "pointer";
    botonCerrar.style.fontSize = "16px";

    // Efecto de hover
    botonCerrar.addEventListener("mouseover", () => {
        botonCerrar.style.backgroundColor = "#0056b3";
    });
    botonCerrar.addEventListener("mouseout", () => {
        botonCerrar.style.backgroundColor = "#007bff";
    });

    // Evento para cerrar el modal
    botonCerrar.addEventListener("click", () => modal.remove());
}


function crearModal(titulo, botonTexto, profElement = null) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>${titulo}</h3>
            <form>
                <label>Nombre</label>
                <input type="text" value="${profElement ? profElement.dataset.nombre : ""}" required>
                <label>Apellidos</label>
                <input type="text" value="${profElement ? profElement.dataset.apellidos : ""}" required>
                <label>Correo electrónico</label>
                <input type="email" value="${profElement ? profElement.dataset.correo : ""}" required>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit">${botonTexto}</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "flex";
    modal.querySelector(".cancelar").addEventListener("click", () => modal.remove());
    return modal.querySelector("form");
}

function obtenerDatosFormulario(form) {
    const inputs = form.getElementsByTagName("input");
    return {
        nombre: inputs[0].value,
        apellidos: inputs[1].value,
        email: inputs[2].value
    };
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

function filtrarProfesores(event){
    let text = event.target.value;
    window.profesoresFiltrados = window.profesores.filter(obj =>
        Object.values(obj).some(value =>
            String(value).toLowerCase().includes(text)
        )
    );
    cargarProfesoresFiltrados();
}

async function cargarProfesoresFiltrados() {
    listProfes.innerHTML = "";

    window.profesoresFiltrados.forEach(profesor => {
        agregarProfesorLista(profesor);
    });
}