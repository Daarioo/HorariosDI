const btnAgregar = document.getElementById("botonAgregar1");
const lista = document.getElementById("listaMatriculas");
let usuarioId;

async function getMatriculas(id) {
    try {
        const matriculasResponse = await fetch(`/api/alumno/${id}`, { credentials: "include" });
        if (!matriculasResponse.ok) throw new Error("Error al obtener matrículas");

        const alumno = await matriculasResponse.json();
        const matriculas = alumno.matriculas;

        lista.innerHTML = "";
        await getCiclos();

        matriculas.forEach(matricula => {
            agregarMatriculaLista(matricula);
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las matrículas.");
    }
}

async function getCiclos() {
    try {
        const response = await fetch("/api/admin/ciclos", { credentials: "include" });
        if (!response.ok) throw new Error("Error al obtener ciclos");

        window.ciclos = await response.json();
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los ciclos.");
    }
}

async function formalizarMatricula() {
    let cicloId = document.getElementById("selectCiclo").value;
    let moduloId = document.getElementById("selectModulo").value;
    let numMatricula = document.getElementById("numeroMatricula").value;

    let matriculaData = {
        numMatricula: numMatricula,
        usuario: { idUsuario: usuarioId, tipo: 'ALUMNO' },
        cicloFormativo: { idCiclo: window.ciclos[cicloId].idCiclo },
        modulo: { idModulo: window.ciclos[cicloId].modulos[moduloId].idModulo }
    };

    console.log(matriculaData);

    try {
        const response = await fetch("/api/alumno/matricula", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matriculaData)
        });

        if (!response.ok) throw new Error("Error al matricular el módulo");

        await getMatriculas(usuarioId);
    } catch (error) {
        console.error(error);
        alert("No se pudo formalizar la matrícula.");
    }
}

async function eliminarMatricula(idMatricula) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta matrícula?");

    if (confirmacion) {
        try {
            const response = await fetch(`/api/alumno/matricula/${idMatricula}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al eliminar la matrícula");
            await getMatriculas(usuarioId);
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar la matrícula.");
        }
    }
}

async function actualizarMatricula(idMatricula) {
    let cicloId = window.ciclos[document.getElementById("selectCiclo").value].idCiclo;
    let moduloId = window.ciclos[document.getElementById("selectCiclo").value].matriculas[document.getElementById("selectModulo").value].id;
    let numMatricula = document.getElementById("numeroMatricula").value;

    let matriculaData = {
        numMatricula: numMatricula,
        usuario: { idUsuario: usuarioId, tipo: "ALUMNO" },
        cicloFormativo: { idCiclo: parseInt(cicloId) },
        modulo: { idModulo: parseInt(moduloId) }
    };

    try {
        const response = await fetch(`/api/alumno/matricula/${idMatricula}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(matriculaData)
        });

        if (!response.ok) throw new Error("Error al actualizar la matrícula");
        await getMatriculas(usuarioId);

    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar la matrícula.");
    }
}

function agregarMatriculaLista(matricula){
    const nuevaMatricula = document.createElement("div");
        nuevaMatricula.classList.add("matricula");
        nuevaMatricula.dataset.matricula = matricula.numMatricula;
        nuevaMatricula.dataset.ciclo = matricula.cicloFormativo.idCiclo;
        nuevaMatricula.dataset.modulo = matricula.modulo.idModulo;

    nuevaMatricula.innerHTML = `
            <span>[${matricula.numMatricula}] ${matricula.modulo.nombre} - ${matricula.cicloFormativo.nombre} </span>
            <div class="acciones">
                <button class="ver">👁️</button>
                <button onclick="eliminarMatricula(${matricula.id})" class="eliminar">❌</button>
            </div>
    `;

    nuevaMatricula.querySelector(".ver").addEventListener("click", async function() {
        await crearModalEditarModulo(matricula.id);
        document.querySelector(".modal").style.display = "flex";
    });

    lista.append(nuevaMatricula);
}

function crearModalModulo() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Nuevo Módulo</h3>
            <form id="formModulo">
                <label>Número de Matrícula:</label>
                <input type="text" id="numeroMatricula" required>
                <label>Ciclo:</label>
                <select id="selectCiclo" required></select>
                <label>Módulo:</label>
                <select id="selectModulo" required></select>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit" class="añadir">Agregar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const selectCiclo = document.getElementById("selectCiclo");
    const selectModulo = document.getElementById("selectModulo");

    window.ciclos.map((ciclo, i)=>{
            selectCiclo.innerHTML += `<option value="${i}">${ciclo.nombre}</option>`
    });

    window.ciclos[0].modulos.forEach((modulo)=>{
        selectModulo.innerHTML += `<option value="${modulo.idModulo}">${modulo.nombre}</option>`
    });

    selectCiclo.addEventListener("change", async function (e) {
        selectModulo.innerHTML = "";
        window.ciclos[selectCiclo.value].modulos.forEach((modulo)=>{
                    selectModulo.innerHTML += `<option value="${modulo.idModulo}">${modulo.nombre}</option>`
        });
    });

    document.getElementById("formModulo").addEventListener("submit", async function (e) {
        e.preventDefault();
        await formalizarMatricula();
        modal.remove();
    });

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });
}

btnAgregar.addEventListener("click", function () {
    if (!document.getElementById("modalModulo")) {
        crearModalModulo();
    }
    document.querySelector(".modal").style.display = "flex";
});

lista.addEventListener("click", function (event) {
    if (event.target.classList.contains("ver")) {
        const moduloElement = event.target.closest(".modulo");
        if (moduloElement) {
            crearModalVerEditarModulo(moduloElement);
        }
    }
});

async function crearModalEditarModulo(id) {
    const response = await fetch(`/api/alumno/matricula/${id}`, { credentials: "include" });
    if (!response.ok) throw new Error("Error al obtener la matrícula");

    const matricula = await response.json();

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Nuevo Módulo</h3>
            <form id="formModulo">
                <label>Número de Matrícula:</label>
                <input type="text" id="numeroMatricula" required>
                <label>Ciclo:</label>
                <select id="selectCiclo" required></select>
                <label>Módulo:</label>
                <select id="selectModulo" required></select>
                <div class="modal-botones">
                    <button type="button" class="cancelar">Cancelar</button>
                    <button type="submit" class="añadir">Agregar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const selectCiclo = document.getElementById("selectCiclo");
    const selectModulo = document.getElementById("selectModulo");

    window.ciclos.map((ciclo, i)=>{
            selectCiclo.innerHTML += `<option value="${i}">${ciclo.nombre}</option>`
    });

    window.ciclos[0].modulos.forEach((modulo)=>{
        selectModulo.innerHTML += `<option value="${modulo.idModulo}">${modulo.nombre}</option>`
    });

    document.getElementById("numeroMatricula").value = matricula.numMatricula;

    selectCiclo.addEventListener("change", async function (e) {
        selectModulo.innerHTML = "";
        window.ciclos[selectCiclo.value].modulos.forEach((modulo)=>{
                    selectModulo.innerHTML += `<option value="${modulo.idModulo}">${modulo.nombre}</option>`
        });
    });

    document.getElementById("formModulo").addEventListener("submit", async function (e) {
        e.preventDefault();
        await actualizarMatricula(id);
        modal.remove();
    });

    document.querySelector(".cancelar").addEventListener("click", function () {
        modal.remove();
    });
}

async function obtenerUsuario() {
    const url = window.top.location.href;
    const partes = url.split('/');
    const id = partes[partes.length - 1];
    try {
        const response = await fetch('/api/usuarios/' + id, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        const userName = document.getElementById("userName");
        userName.innerText = data.nombre;
        usuarioId = data.idUsuario;
        await getMatriculas(usuarioId);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

obtenerUsuario();