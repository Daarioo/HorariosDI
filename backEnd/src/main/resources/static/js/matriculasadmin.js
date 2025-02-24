document.addEventListener("DOMContentLoaded", () => {
    (async function () {
        await obtenerUsuario();
        cargarCiclos();
        cargarMatriculas();
    })();
});
let usuario;
let usuarioId;

// Mostrar y cerrar modal
function mostrarModal() {
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";

    // Restablecer el formulario para crear una nueva matrícula
    const matriculaForm = document.getElementById("matriculaForm");
    matriculaForm.onsubmit = function (event) {
        event.preventDefault();
        formalizarMatricula(event);  // Llamar la función de formalizar matrícula
    };
}

// Cierra modal si se hace clic fuera del contenido
window.onclick = function (event) {
    if (event.target == document.getElementById("modal")) {
        cerrarModal();
    }
};

// Cargar ciclos disponibles
async function cargarCiclos() {
    try {
        const response = await fetch("/api/admin/ciclos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener ciclos");

        const ciclosCargados = await response.json();
        ciclos = ciclosCargados;
        let selectCiclo = document.getElementById("ciclo");
        selectCiclo.innerHTML = `<option value="">Seleccione un ciclo</option>`;

        selectCiclo.addEventListener("change", function () {
                const valorSeleccionado = selectCiclo.value;
                cargarModulos(valorSeleccionado);
        });

        ciclosCargados.forEach(ciclo => {
            let option = document.createElement("option");
            option.value = ciclo.idCiclo;
            option.textContent = ciclo.nombre;
            selectCiclo.append(option);
        });

        console.log(ciclos);
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los ciclos.");
    }
}

// Cargar módulos cuando se seleccione un ciclo
async function cargarModulos() {
    let cicloId = document.getElementById("ciclo").value;
    if (!cicloId) return;

    try {
        const response = await fetch(`/api/admin/ciclos/${cicloId}`, { credentials: "include" });

        if (!response.ok) throw new Error("Error al obtener módulos");

        const ciclo = await response.json(); // El JSON contiene el ciclo y sus módulos
        let modulos = ciclo.modulos; // Extraemos los módulos del ciclo

        let selectModulo = document.getElementById("modulo");
        selectModulo.innerHTML = `<option value="">Seleccione un módulo</option>`;

        modulos.forEach(modulo => {
            let option = document.createElement("option");
            option.value = modulo.idModulo; // ID del módulo
            option.textContent = modulo.nombre; // Nombre del módulo
            selectModulo.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los módulos.");
    }
}

// Formalizar matrícula
async function formalizarMatricula(event) {
    event.preventDefault();

    let cicloId = document.getElementById("ciclo").value;
    let moduloId = document.getElementById("modulo").value;
    let numMatricula = document.getElementById("numMatricula").value; // Obtener numMatricula del formulario

    // Verificar que el usuario esté definido
    if (!usuario || !usuario.idUsuario) {
        alert("Error: No se ha podido obtener el usuario. Intenta recargar la página.");
        return;
    }

    if (!numMatricula || !cicloId || !moduloId) {
        alert("Por favor, complete todos los campos.");
        return;
    }

  let matriculaData = {
      numMatricula: numMatricula,
      usuario: { idUsuario: usuarioId, tipo: "ALUMNO" },
      cicloFormativo: { idCiclo: parseInt(cicloId) }, // Aquí cambiamos para que sea un objeto con el id
      modulo: { idModulo: parseInt(moduloId) }
  };

    console.log(matriculaData);

    try {
        const response = await fetch("/api/admin/matriculas", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matriculaData)
        });

        if (!response.ok) throw new Error("Error al matricular el módulo");

        alert("Matrícula realizada con éxito");
        cerrarModal();
        cargarMatriculas();

    } catch (error) {
        console.error(error);
        alert("No se pudo formalizar la matrícula.");
    }
}


// Cargar matrículas en la tabla
async function cargarMatriculas() {
    try {
        // Verificar que el usuario está definido
        if (!usuario) {
            await obtenerUsuario();
        }

        // Obtener las matrículas del usuario autenticado
        const matriculasResponse = await fetch(`/api/alumno/${usuario.idUsuario}`, { credentials: "include" });
        if (!matriculasResponse.ok) throw new Error("Error al obtener matrículas");

        const alumno = await matriculasResponse.json();
        const matriculas = alumno.matriculas; // Extraer las matrículas del usuario

        let tbody = document.getElementById("matriculasTabla");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

        matriculas.forEach(matricula => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${matricula.numMatricula}</td>
                <td>${matricula.cicloFormativo.nombre}</td>
                <td>${matricula.modulo.nombre}</td>
                <td>
                    <button class="btn-editar" onclick="editarMatricula(${matricula.id})">✏️ Editar</button>
                    <button class="btn-eliminar" onclick="eliminarMatricula(${matricula.id})">🗑️ Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las matrículas.");
    }
}


async function obtenerUsuario() {
    const url = window.location.href;
    const partes = url.split('/');
    const id = partes[partes.length - 1];
    try {
        const response = await fetch('/api/usuarios/' + id, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        usuario = data;
        usuarioId = usuario.idUsuario;

    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}


// Editar matrícula
async function editarMatricula(idMatricula) {
    try {
        // Obtener los datos de la matrícula seleccionada
        const response = await fetch(`/api/admin/matriculas/${idMatricula}`, { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener la matrícula");

        const matricula = await response.json();

        // Rellenar el formulario del modal con los datos de la matrícula
        document.getElementById("numMatricula").value = matricula.numMatricula;
        document.getElementById("ciclo").value = matricula.cicloFormativo.idCiclo;
        document.getElementById("modulo").value = matricula.modulo.idModulo;

        // Mostrar el modal para editar
        mostrarModal();

        // Cambiar el texto del botón a "Actualizar matrícula"
        const submitButton = document.querySelector("button[type='submit']");


        // Cambiar la acción del formulario para que ejecute la actualización
        const matriculaForm = document.getElementById("matriculaForm");
        matriculaForm.onsubmit = function (event) {
            event.preventDefault();  // Prevenir la acción por defecto del formulario
            actualizarMatricula(idMatricula);  // Llamar la función de actualización con el id
        };

    } catch (error) {
        console.error(error);
        alert("No se pudo obtener la matrícula para editar.");
    }
}
// Actualizar matrícula
async function actualizarMatricula(idMatricula) {
    let cicloId = document.getElementById("ciclo").value;
    let moduloId = document.getElementById("modulo").value;
    let numMatricula = document.getElementById("numMatricula").value;

    // Verificar que los datos son válidos
    if (!numMatricula || !cicloId || !moduloId) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    let matriculaData = {
        numMatricula: numMatricula,
        usuario: { idUsuario: usuarioId, tipo: "ALUMNO" },
        cicloFormativo: { idCiclo: parseInt(cicloId) },
        modulo: { idModulo: parseInt(moduloId) }
    };

    try {
        const response = await fetch(`/api/admin/matriculas/${idMatricula}`, {
            method: "PUT", // Método PUT para actualizar
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(matriculaData)
        });

        if (!response.ok) throw new Error("Error al actualizar la matrícula");

        alert("Matrícula actualizada con éxito");
        cerrarModal();  // Cerrar el modal después de la actualización
        cargarMatriculas();  // Recargar las matrículas

    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar la matrícula.");
    }
}
// Eliminar matrícula
async function eliminarMatricula(idMatricula) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta matrícula?");

    if (confirmacion) {
        try {
            const response = await fetch(`/api/admin/matriculas/${idMatricula}`, {
                method: "DELETE", // El método HTTP para eliminar
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al eliminar la matrícula");

            alert("Matrícula eliminada con éxito");
            cargarMatriculas(); // Recargar las matrículas después de eliminar

        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar la matrícula.");
        }
    }
}