let alumnos;
let alumnosFiltrados;
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

    const filtro = document.getElementById("filtro");
    filtro.addEventListener("input", filtrarAlumnos);

    init();
    getAlumnos();
    obtenerUsuario();
});

async function getAlumnos() {
        const response = await fetch("/api/alumno", { credentials: "include" });

        if (!response.ok) {
             throw new Error("Error al obtener los alumnos");
        }

        const usuarios = await response.json();
        alumnos = usuarios.filter((usuario)=> usuario.tipo == "ALUMNO");
        cargarPágina();
    }

function agregarFilaAlumno(alumno) {
    let tbody = document.querySelector("#alumnosTable>tbody");

    let tr = document.createElement("tr");

    htmlRow = ` <td>${alumno.email}</td> <td>${alumno.nombreUsuario}</td>`;

    if(alumno.contraseña == "abc123.."){
        htmlRow += `<td>No cambiada</td>`;
    } else {
        htmlRow += `<td>Cambiada</td>`;
    }

    htmlRow += `
        <td><a href="matriculasadmin/${alumno.idUsuario}">Ver matriculas</a></td>
        <td>
            <button class="btn-editar" onclick="modalEditarAlumno(${alumno.idUsuario})"><img src="/images/pencil.svg"/> Editar</button>
            <button class="btn-eliminar" onclick="borrarAlumno(${alumno.idUsuario})"><img src="/images/bin.svg"/> Eliminar</button>
        </td>`;

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
    const alumnosTabla = document.querySelector("#alumnosTable tbody");
    alumnosTabla.innerHTML = "";
    for(let i = tamanhoPagina * (pagina - 1); i < tamanhoPagina * (pagina - 1) + tamanhoPagina; i++){
        if(i < alumnos.length){
            agregarFilaAlumno(alumnos[i]);
        }
    }
    const pagesContainer = document.querySelector("#pagesContainer");
    let paginasTotales = Math.ceil(alumnos.length / tamanhoPagina);
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

function cargarPáginaFiltrada(){
    const alumnosTabla = document.querySelector("#alumnosTable tbody");
    alumnosTabla.innerHTML = "";
    for(let i = tamanhoPagina * (pagina - 1); i < tamanhoPagina * (pagina - 1) + tamanhoPagina; i++){
        if(i < alumnosFiltrados.length){
            agregarFilaAlumno(alumnosFiltrados[i]);
        }
    }
    const pagesContainer = document.querySelector("#pagesContainer");
    let paginasTotales = Math.ceil(alumnosFiltrados.length / tamanhoPagina);
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
    const filtro = document.getElementById("filtro");
    if(filtro.value == ''){
        cargarPágina();
    } else {
        cargarPáginaFiltrada();
    }
}

function filtrarAlumnos(event){
    let text = event.target.value.toLowerCase().trim();
    alumnosFiltrados = alumnos.filter(obj =>
        Object.values(obj).some(value =>
            String(value).toLowerCase().includes(text)
        )
    );

    pagina = 1;
    cargarPáginaFiltrada();
}