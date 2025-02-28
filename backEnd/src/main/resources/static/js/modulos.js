function mostrarModal() {
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("modal")) {
        cerrarModal();
    }
};

function agregarModulo(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let codigo = document.getElementById("codigo").value;
    let horasSemana = document.getElementById("horasSemana").value;
    let horasTotales = document.getElementById("horasTotales").value;
    let ciclo = document.getElementById("ciclo").value;
    let profesor = document.getElementById("profesor").value;

    if (!nombre || !codigo || !horasSemana || !horasTotales || !ciclo || !profesor) {
        alert("Por favor, complete todos los campos");
        return;
    }

    let tabla = document.getElementById("modulosTabla");
    let fila = tabla.insertRow();
    fila.innerHTML = `<td>${nombre}</td><td>${codigo}</td><td>${horasSemana}</td><td>${horasTotales}</td><td>${ciclo}</td><td>${profesor}</td>`;

    document.getElementById("moduloForm").reset();
    cerrarModal();
}


document.addEventListener("DOMContentLoaded", async function () {
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
    let json = await getModulos();
    createTable(json)
});

 async function getModulos() {
        const response = await fetch("/api/admin/modulos", { credentials: "include" });

        if (!response.ok) {
             throw new Error("Error al obtener los modulos");
        }

        const modulos = await response.json();
        return modulos;
    }

function createTable(json) {
    let tbody = document.querySelector("#modulosTabla");
    tbody.innerHTML = ""; // Limpia la tabla antes de llenarla

    json.forEach((modulo) => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${modulo.nombre}</td>
            <td>${modulo.codigo}</td>
            <td>${modulo.horasSemana}</td>
            <td>${modulo.horasTotales}</td>
            <td>${modulo.ciclo.nombre}</td>
            <td>${modulo.profesor.nombre} ${modulo.profesor.apellidos}</td>
            <td>
                <button class="btn-editar" onclick="editarModulo(${modulo.idModulo})">✏️</button>
                <button class="btn-eliminar" onclick="eliminarModulo(${modulo.idModulo})">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// parte añadida en casa

document.addEventListener("DOMContentLoaded", async function () {
    await cargarCiclos();
    await cargarProfesores();
    await cargarModulos();
});

// Función para obtener y llenar los ciclos en el select
async function cargarCiclos() {
    try {
        const response = await fetch("/api/admin/ciclos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los ciclos");

        const ciclos = await response.json();
        let selectCiclo = document.getElementById("ciclo");

        // Limpiar y agregar opciones dinámicas
        selectCiclo.innerHTML = `<option value="">Selecciona un ciclo</option>`;
        ciclos.forEach(ciclo => {
            let option = document.createElement("option");
            option.value = ciclo.idCiclo;  // Usamos el ID real del ciclo
            option.textContent = ciclo.nombre;
            selectCiclo.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los ciclos.");
    }
}

// Función para obtener y llenar los profesores en el select
async function cargarProfesores() {
    try {
        const response = await fetch("/api/admin/profesores", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los profesores");

        const profesores = await response.json();
        let selectProfesor = document.getElementById("profesor");

        // Limpiar y agregar opciones dinámicas
        selectProfesor.innerHTML = `<option value="">Selecciona un profesor</option>`;
        profesores.forEach(profesor => {
            let option = document.createElement("option");
            option.value = profesor.idProfesor;  // Usamos el ID real del profesor
            option.textContent = `${profesor.nombre} ${profesor.apellidos}`;
            selectProfesor.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los profesores.");
    }
}

// Función para agregar un nuevo módulo
async function agregarModulo(event) {
    event.preventDefault();

    let idModulo = document.querySelector("#moduloForm button[type='submit']").getAttribute("data-id");
    let nombre = document.getElementById("nombre").value;
    let codigo = document.getElementById("codigo").value;
    let horasSemana = document.getElementById("horasSemana").value;
    let horasTotales = document.getElementById("horasTotales").value;
    let cicloId = document.getElementById("ciclo").value;
    let profesorId = document.getElementById("profesor").value;

    if (!nombre || !codigo || !horasSemana || !horasTotales || !cicloId || !profesorId) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    let moduloData = {
        nombre,
        codigo,
        horasSemana: parseInt(horasSemana),
        horasTotales: parseInt(horasTotales),
        ciclo: { idCiclo: parseInt(cicloId) },
        profesor: { idProfesor: parseInt(profesorId) }
    };

    try {
        let response;
        if (idModulo) {
            // Modo edición: actualizar el módulo existente
            response = await fetch(`/api/admin/modulos/${idModulo}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(moduloData)
            });
        } else {
            // Modo creación: agregar nuevo módulo
            response = await fetch("/api/admin/modulos", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(moduloData)
            });
        }

        if (!response.ok) throw new Error("Error al guardar el módulo");

        alert(idModulo ? "Módulo actualizado exitosamente" : "Módulo agregado exitosamente");

        cerrarModal();
        document.getElementById("moduloForm").reset();
        document.querySelector("#moduloForm button[type='submit']").removeAttribute("data-id");

        await cargarModulos();  // Recargar la tabla
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar el módulo.");
    }
}

// Función para obtener y mostrar los módulos en la tabla
async function cargarModulos() {
    try {
        const response = await fetch("/api/admin/modulos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener los módulos");

        const modulos = await response.json();
        let tbody = document.querySelector("#modulosTabla");
        tbody.innerHTML = "";  // Limpiar la tabla antes de agregar nuevos módulos

        modulos.forEach(modulo => agregarFilaModulo(modulo));
    } catch (error) {
        console.error(error);
        alert("Error al cargar los módulos.");
    }
}

// Función para agregar una fila a la tabla de módulos
function agregarFilaModulo(modulo) {
    let tbody = document.querySelector("#modulosTabla");
    let tr = document.createElement("tr");
    tr.setAttribute("data-id", modulo.idModulo);  // Guardamos el ID del módulo en el tr

    tr.innerHTML = `
        <td>${modulo.nombre}</td>
        <td>${modulo.codigo}</td>
        <td>${modulo.horasSemana}</td>
        <td>${modulo.horasTotales}</td>
        <td>${modulo.ciclo.nombre}</td>
        <td>${modulo.profesor.nombre} ${modulo.profesor.apellidos}</td>
        <td>
            <button class="btn-editar" onclick="editarModulo(${modulo.idModulo})">✏️ Editar</button>
            <button class="btn-eliminar" onclick="eliminarModulo(${modulo.idModulo})"><img src="/images/bin.svg"/> Eliminar</button>
        </td>
    `;

    tbody.appendChild(tr);
}


async function editarModulo(idModulo) {
    try {
        const response = await fetch(`/api/admin/modulos/${idModulo}`, { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener el módulo");

        const modulo = await response.json();

        // Cargar los datos en el formulario
        document.getElementById("nombre").value = modulo.nombre;
        document.getElementById("codigo").value = modulo.codigo;
        document.getElementById("horasSemana").value = modulo.horasSemana;
        document.getElementById("horasTotales").value = modulo.horasTotales;
        document.getElementById("ciclo").value = modulo.ciclo.idCiclo;
        document.getElementById("profesor").value = modulo.profesor.idProfesor;

        // Guardar el ID del módulo en un atributo del botón de envío
        let submitButton = document.querySelector("#moduloForm button[type='submit']");
        submitButton.setAttribute("data-id", idModulo);

        // Mostrar el modal
        mostrarModal();
    } catch (error) {
        console.error(error);
        alert("Error al cargar los datos del módulo.");
    }
}

async function eliminarModulo(idModulo) {
    if (!confirm("¿Seguro que deseas eliminar este módulo?")) return;

    try {
        const response = await fetch(`/api/admin/modulos/${idModulo}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Error al eliminar el módulo");

        alert("Módulo eliminado exitosamente");

        // Eliminar la fila de la tabla
        document.querySelector(`tr[data-id='${idModulo}']`).remove();
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el módulo.");
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