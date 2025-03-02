let profesores;
let pagina = 1;
const tamanhoPagina = 12;

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
  const currentPage = window.location.pathname.split("/").pop();

  const links = document.querySelectorAll("nav a");

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

    profesores = await response.json();
    cargarPágina();
}

function agregarFilaProfesor(profesor) {
    let tbody = document.querySelector("#profesoresTable tbody");
    let tr = document.createElement("tr");

    htmlRow = ` <td>${profesor.nombre} ${profesor.apellidos}</td> <td>${profesor.email}</td>`;

    htmlRow += `<td>
            <button class="btn-editar" onclick="modalEditarProfesor(${profesor.idProfesor})">✏️ Editar</button>
            <button class="btn-eliminar" onclick="borrarProfesor(${profesor.idProfesor})"><img src="/images/bin.svg"/> Eliminar</button>
    </td>`

    tr.innerHTML = htmlRow;
    tbody.appendChild(tr);
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

function cargarPágina(){
    const profesoresTabla = document.querySelector("#profesoresTable tbody");
    profesoresTabla.innerHTML = "";
    for(let i = tamanhoPagina * (pagina - 1); i < tamanhoPagina * (pagina - 1) + tamanhoPagina; i++){
        if(i < profesores.length){
            agregarFilaProfesor(profesores[i]);
        }
    }
    const pagesContainer = document.querySelector("#pagesContainer");
    let paginasTotales = Math.ceil(profesores.length / tamanhoPagina);
    pagesContainer.innerHTML = "";

    if(pagina > 4){
        pagesContainer.innerHTML += `
            <button onclick="cambiarPagina(1)">1</button>
            <span>...</span>
            <button onclick="cambiarPagina(${pagina - 2})">${pagina - 2}</button>
            <button onclick="cambiarPagina(${pagina - 1})">${pagina - 1}</button>
            <button id="activeBtn">${pagina}</button>
        `;
    } else {
        for(let i=1; i <= pagina; i++){
            if(i == pagina){
                pagesContainer.innerHTML += `<button id="activeBtn">${i}</button>`;
            } else {
                pagesContainer.innerHTML += `<button onclick="cambiarPagina(${i})">${i}</button>`;
            }
        }
    }

    let cond = paginasTotales - pagina;

    if(cond > 2){
        pagesContainer.innerHTML += `
            <button onclick="cambiarPagina(${pagina + 1})">${pagina + 1}</button>
            <button onclick="cambiarPagina(${pagina + 2})">${pagina + 2}</button>
            <span>...</span>
            <button onclick="cambiarPagina(${paginasTotales})">${paginasTotales}</button>
        `;
    } else {
        for(let i=pagina + 1; i<=paginasTotales; i++){
            pagesContainer.innerHTML += `<button onclick="cambiarPagina(${i})">${i}</button>`;
        }
    }
}

function cambiarPagina(numero){
    pagina = numero;
    cargarPágina();
}