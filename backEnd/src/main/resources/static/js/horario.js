document.addEventListener("DOMContentLoaded", function () {
    obtenerUsuario();
});

let modulosExcluidos = [];
let usuario;
let ciclo;

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            usuario = data.nombre;
            getJson(data.id);
        } else {
            console.log("Usuario no autenticado");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

function getJson(id) {
    fetch('http://localhost:8080/api/alumno/' + id)
        .then(response => response.json())
        .then(data => {
            ciclo = data.matriculas[0].cicloFormativo;
            cargarModulosSelect(data);
            loadSesion(data);
        })
        .catch(error => console.error("Error:", error));
}

function cargarModulosSelect(data) {
    let selectModulos = document.getElementById("select-modulo");
    let contenedorBotones = document.getElementById("tag-container");

    selectModulos.innerHTML = "";
    contenedorBotones.innerHTML = "";

    data.matriculas.forEach(matricula => {
        if (matricula.modulo && !modulosExcluidos.includes(matricula.modulo.nombre)) {
            let option = document.createElement("option");
            option.value = matricula.modulo.nombre;
            option.innerText = matricula.modulo.nombre;
            selectModulos.appendChild(option);
        }
    });

    modulosExcluidos.forEach(modulo => {
        let boton = document.createElement("button");
        boton.innerText = modulo + " ❌";
        boton.classList.add("modulo-boton");
        boton.addEventListener("click", function () {
            quitarModulo(modulo, data);
        });
        contenedorBotones.appendChild(boton);
    });

    // 🔥 Eliminar event listeners anteriores para evitar duplicación
    let btnFiltrar = document.getElementById("btn-filtrar");
    let btnReset = document.getElementById("btn-reset");

    let nuevoBtnFiltrar = btnFiltrar.cloneNode(true);
    let nuevoBtnReset = btnReset.cloneNode(true);

    btnFiltrar.replaceWith(nuevoBtnFiltrar);
    btnReset.replaceWith(nuevoBtnReset);

    // Agregar event listeners solo una vez
    nuevoBtnFiltrar.addEventListener("click", function () {
        let moduloSeleccionado = selectModulos.value;
        if (moduloSeleccionado && !modulosExcluidos.includes(moduloSeleccionado)) {
            modulosExcluidos.push(moduloSeleccionado);
        }
        cargarModulosSelect(data);
        loadSesion(data);
    });

    nuevoBtnReset.addEventListener("click", function () {
        modulosExcluidos = [];
        cargarModulosSelect(data);
        loadSesion(data);
    });
}

function loadSesion(data) {
    var tabla = document.querySelector("table");
    tabla.innerHTML = "";

    var diasSemana = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    if (!data.matriculas || data.matriculas.length === 0) {
        console.error("No hay matrículas en el JSON.");
        return;
    }

    let sesionesOriginales = [];
    let horasSet = new Set();

    data.matriculas.forEach(matricula => {
        if (matricula.modulo && Array.isArray(matricula.modulo.sesiones)) {
            if (modulosExcluidos.includes(matricula.modulo.nombre)) return;

            matricula.modulo.sesiones.forEach(sesion => {
                let horaStr = `${sesion.horaInicio}-${sesion.horaFin}`;
                sesionesOriginales.push({
                    dia: sesion.dia,
                    horaInicio: sesion.horaInicio,
                    horaFin: sesion.horaFin,
                    aula: sesion.aula,
                    modulo: matricula.modulo.nombre
                });
                horasSet.add(sesion.horaInicio);
                horasSet.add(sesion.horaFin);
            });
        }
    });

    // Ordenar las horas para detectar huecos
    let horasOrdenadas = Array.from(horasSet).sort();

    var head = document.createElement("thead");
    var filaHead = document.createElement("tr");

    diasSemana.forEach(dia => {
        var celda = document.createElement("th");
        celda.innerText = dia;
        filaHead.append(celda);
    });
    head.append(filaHead);

    var body = document.createElement("tbody");

    for (let i = 0; i < horasOrdenadas.length - 1; i++) {
        let horaInicio = horasOrdenadas[i];
        let horaFin = horasOrdenadas[i + 1];

        var fila = document.createElement("tr");

        var celdaHora = document.createElement("td");
        celdaHora.innerText = `${horaInicio}-${horaFin}`;
        fila.append(celdaHora);

        for (let j = 0; j < 5; j++) {
            var celda = document.createElement("td");
            let diaSemana = diasSemana[j + 1];

            let sesion = sesionesOriginales.find(s => s.dia === diaSemana && s.horaInicio === horaInicio);
            if (sesion) {
                celda.innerText = `${sesion.modulo} (${sesion.aula})`;
            } else {
                celda.innerText = ""; // Espacio vacío en caso de que no haya sesión
            }

            fila.append(celda);
        }

        body.append(fila);
    }

    tabla.append(head);
    tabla.append(body);
}

function quitarModulo(modulo, data) {
    modulosExcluidos = modulosExcluidos.filter(m => m !== modulo);
    cargarModulosSelect(data);
    loadSesion(data);
}

document.getElementById("btn-pdf").addEventListener("click", function () {
    generarPDF();
});

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(ciclo.nombre, 105, 15, { align: "center" });
    doc.setFontSize(14);
    doc.text(usuario, 105, 25, { align: "center" });

    let tabla = document.querySelector("table");
    if (!tabla) {
        console.error("No se encontró la tabla.");
        return;
    }

    let dataTabla = [];
    let headers = [];

    let filas = tabla.querySelectorAll("tr");
    filas.forEach((fila, index) => {
        let filaData = [];
        fila.querySelectorAll("td, th").forEach(celda => {
            filaData.push(celda.innerText.trim());
        });

        if (index === 0) {
            headers = filaData;
        } else {
            dataTabla.push(filaData);
        }
    });

    doc.autoTable({
        head: [headers],
        body: dataTabla,
        startY: 30,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            halign: "center",
            minCellWidth: 20
        },
        headStyles: {
            fillColor: [74, 139, 172],
            textColor: 255,
            fontStyle: "bold",
            halign: "center"
        },
        theme: "grid",
        margin: { top: 20 }
    });

    doc.save("Horario.pdf");
}
