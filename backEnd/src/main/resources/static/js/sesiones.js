let sesiones;
let sesionesFiltradas;
let pagina = 1;
const tamanhoPagina = 12;

document.addEventListener("DOMContentLoaded", async function () {
    await cargarModulos();  // Cargar módulos en el select
    await cargarSesiones(); // Cargar sesiones en la tabla
    const filtro = document.getElementById("filtro");
    filtro.addEventListener("input", filtrarSesiones);
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
          if (link.getAttribute("href") === currentPage) {
              link.classList.add("active");
          }
      });
    obtenerUsuario();
});

// Función para abrir el modal
function mostrarModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "flex";
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

        sesiones = await response.json();
        let tbody = document.querySelector("#sesionesTabla");
        tbody.innerHTML = "";
        cargarPágina();
    } catch (error) {
        console.error(error);
        alert("Error al cargar las sesiones.");
    }
}

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
            <button class="btn-eliminar" onclick="eliminarSesion(${sesion.idSesion})"><img src="/images/bin.svg"/> Eliminar</button>
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

function cargarPágina(){
    const sesionesTabla = document.querySelector("#sesionesTabla");
    sesionesTabla.innerHTML = "";
    for(let i = tamanhoPagina * (pagina - 1); i < tamanhoPagina * (pagina - 1) + tamanhoPagina; i++){
        if(i < sesiones.length){
            agregarFilaSesion(sesiones[i]);
        }
    }
    const pagesContainer = document.querySelector("#pagesContainer");
    let paginasTotales = Math.ceil(sesiones.length / tamanhoPagina);
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
    const sesionesTabla = document.querySelector("#sesionesTabla");
    sesionesTabla.innerHTML = "";
    for(let i = tamanhoPagina * (pagina - 1); i < tamanhoPagina * (pagina - 1) + tamanhoPagina; i++){
        if(i < sesionesFiltradas.length){
            agregarFilaSesion(sesionesFiltradas[i]);
        }
    }
    const pagesContainer = document.querySelector("#pagesContainer");
    let paginasTotales = Math.ceil(sesionesFiltradas.length / tamanhoPagina);
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

function filtrarSesiones(event){
    let text = event.target.value;
    sesionesFiltradas = sesiones.filter(obj => {
        const valores = Object.values(obj);
        const valoresModulo = obj.modulo ? Object.values(obj.modulo) : [];
        const valoresCiclo = obj.modulo?.ciclo ? Object.values(obj.modulo.ciclo) : [];

        return [...valores, ...valoresModulo, ...valoresCiclo].some(value =>
            String(value).toLowerCase().includes(text.toLowerCase().trim())
        );
    });
    pagina = 1;
    cargarPáginaFiltrada();
}