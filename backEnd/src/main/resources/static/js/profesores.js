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
    const form = document.getElementById("profesorForm");
    const tableBody = document.querySelector("#profesoresTable tbody");

    openModal.addEventListener("click", () => {
        document.getElementById("profesorForm").reset();
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let submitButton = document.querySelector("#profesorForm button[type='submit']");
        if(submitButton.getAttribute("data-id")){
            editarProfesor(submitButton.getAttribute("data-id"));
        } else {
            agregarProfesor();
        }
        modal.style.display = "none";
        submitButton.removeAttribute("data-id");
    });

    tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete")) {
            event.target.closest("tr").remove();
        } else if (event.target.classList.contains("edit")) {
            modalEditarprofesor(event.target.closest("tr"));
        }
    });
}

async function agregarProfesor() {
    const nuevoProfesor = {
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            email: document.getElementById("email").value
    };
    
    try {
        const response = await fetch("/api/admin/profesores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoProfesor),
                credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al crear el profesor");
        }
        console.log("Profesor creado");
        getProfesores();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function modalEditarProfesor(id) {
    try {
        const response = await fetch(`/api/admin/profesores/${id}`, { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener el módulo");

        const profesor = await response.json();

        document.getElementById("nombre").value = profesor.nombre;
        document.getElementById("apellidos").value = profesor.apellidos;
        document.getElementById("email").value = profesor.email;

        let submitButton = document.querySelector("#profesorForm button[type='submit']");
        submitButton.setAttribute("data-id", profesor.idProfesor);

        mostrarModal();
    } catch (error) {
        console.error(error);
        alert("Error al cargar los datos del módulo.");
    }
}

async function editarProfesor(id){
    const updatedProfesor = {
                nombre: document.getElementById("nombre").value,
                apellidos: document.getElementById("apellidos").value,
                email: document.getElementById("email").value
    };

    try {
        const response = await fetch("/api/admin/profesores/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify(updatedProfesor),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el ciclo");
        }

        console.log(`Profesor con id ${id} actualizado`);
        getProfesores();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function borrarProfesor(id) {
    try {
        const response = await fetch(`/api/admin/profesores/` + id, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el profesor");
        }

        console.log(`Profesor borrado exitosamente`);
        getProfesores();
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
  obtenerUsuario();
  init();
  getProfesores();
});

async function getProfesores() {
    const response = await fetch("/api/admin/profesores", { credentials: "include" });

        if (!response.ok) {
             throw new Error("Error al obtener los profesores");
        }

        const profesores = await response.json();
        createTable(profesores);
}

function createTable(json) {
    let tbody = document.querySelector("#profesoresTable>tbody");
    tbody.innerHTML = "";
    // let modulos = getModulos(id);

    json.forEach((profesor) => {
        let tr = document.createElement("tr");

        htmlRow = ` <td>${profesor.nombre} ${profesor.apellidos}</td> <td>${profesor.email}</td>`;

        htmlRow += `<td>
                <button class="btn-editar" onclick="modalEditarProfesor(${profesor.idProfesor})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="borrarProfesor(${profesor.idProfesor})">🗑️ Eliminar</button>
        </td>`

        tr.innerHTML = htmlRow;

        tbody.appendChild(tr);
    });
}

/*
async function getModulos(id){
    const response = await fetch("/api/admin/modulos", { credentials: "include" });

    if (!response.ok) {
         throw new Error("Error al obtener los profesores");
    }

    const modulos = await response.json();
    return modulos.filter((modulo)=>modulo.idProfesor == id);
}*/

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