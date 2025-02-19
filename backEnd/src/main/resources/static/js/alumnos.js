function mostrarModal() {
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
    submitButton.removeAttribute("data-id");
}

function init() {
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.querySelector(".close");
    const form = document.getElementById("alumnoForm");
    const tableBody = document.querySelector("#alumnosTable tbody");

    openModal.addEventListener("click", () => {
        document.getElementById("alumnoForm").reset();
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let submitButton = document.querySelector("#alumnoForm button[type='submit']");
        if(submitButton.getAttribute("data-id")){
            editarAlumno(submitButton.getAttribute("data-id"));
        } else {
            agregarAlumno();
        }
        modal.style.display = "none";
        submitButton.removeAttribute("data-id");
    });

    tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete")) {
            event.target.closest("tr").remove();
        } else if (event.target.classList.contains("edit")) {
            modalEditarAlumno(event.target.closest("tr"));
        }
    });
}

async function agregarAlumno() {
    const nuevoAlumno = {
            contraseña: "abc123..",
            email: document.getElementById("email").value,
            nombreUsuario: document.getElementById("nombre").value,
            tipo: "ALUMNO"
    };
    
    try {
        const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoAlumno),
                credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al crear el alumno");
        }
        console.log("Alumno creado");
        getAlumnos();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function modalEditarAlumno(idUsuario) {
    try {
        const response = await fetch(`/api/alumno/${idUsuario}`, { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener el módulo");

        const alumno = await response.json();

        document.getElementById("nombre").value = alumno.nombreUsuario;
        document.getElementById("email").value = alumno.email;
        document.getElementById("contraseña").value = alumno.contraseña;

        let submitButton = document.querySelector("#alumnoForm button[type='submit']");
        submitButton.setAttribute("data-id", alumno.idUsuario);

        mostrarModal();
    } catch (error) {
        console.error(error);
        alert("Error al cargar los datos del módulo.");
    }
}

async function editarAlumno(id){
    const updatedAlumno = {
        id: id,
        contraseña: document.getElementById("contraseña").value,
        email: document.getElementById("email").value,
        nombreUsuario: document.getElementById("nombre").value,
        tipo: "ALUMNO"
    };

    try {
        const response = await fetch("/api/usuarios/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify(updatedAlumno),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el ciclo");
        }

        console.log(`Alumno con id ${id} actualizado`);
        getAlumnos();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function borrarAlumno(id) {
    try {
        const response = await fetch(`/api/usuarios/` + id, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el alumno");
        }

        console.log(`Alumno borrado exitosamente`);
        getAlumnos();
    } catch (error) {
         console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtener la URL actual
    const currentPage = window.location.pathname.split("/").pop();

    // Seleccionar todos los enlaces del nav
    const links = document.querySelectorAll("nav a");

    // Recorrer los enlaces y marcar el activo
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
    init();
    getAlumnos();
});

async function getAlumnos() {
        const response = await fetch("/api/alumno", { credentials: "include" });

        if (!response.ok) {
             throw new Error("Error al obtener los alumnos");
        }

        const usuarios = await response.json();
        createTable(usuarios.filter((usuario)=> usuario.tipo == "ALUMNO"));
    }

function createTable(json) {
    let tbody = document.querySelector("#alumnosTable>tbody");
    tbody.innerHTML = "";

    json.forEach((alumno) => {
        let tr = document.createElement("tr");

        htmlRow = ` <td>${alumno.email}</td> <td>${alumno.nombreUsuario}</td>`;

        if(alumno.contraseña == "abc123.."){
            htmlRow += `<td>No cambiada</td>`;
        } else {
            htmlRow += `<td>Cambiada</td>`;
        }

        htmlRow += `<td>
                <button class="btn-editar" onclick="modalEditarAlumno(${alumno.idUsuario})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="borrarAlumno(${alumno.idUsuario})">🗑️ Eliminar</button>
        </td>`

        tr.innerHTML = htmlRow;

        tbody.appendChild(tr);
    });
}