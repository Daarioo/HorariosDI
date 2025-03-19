document.addEventListener("DOMContentLoaded", function () {
    obtenerUsuario();
});

let modulosExcluidos = [];
let usuario;
let ciclo;
let tablaDatos = []; // Variable global para almacenar los datos de la tabla

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            usuario = data.nombre;
            document.getElementById("mensaje-bienvenida").innerText = `Bienvenido, ${usuario}`;
            let nombre = document.getElementById("usuarioFooter");
            nombre.innerText = usuario;
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
            if (!data.matriculas || data.matriculas.length === 0) {
                console.error("El usuario no tiene matrículas.");
                return;
            }

            let selectCiclo = document.getElementById("select-ciclo");
            selectCiclo.innerHTML = ""; // Limpiar select ciclos

            let ciclosUnicos = new Set(data.matriculas.map(m => m.cicloFormativo.nombre));

            ciclosUnicos.forEach(nombreCiclo => {
                let option = document.createElement("option");
                option.value = nombreCiclo;
                option.innerText = nombreCiclo;
                selectCiclo.appendChild(option);
            });

            // Escuchar cambios en el select de ciclo
            selectCiclo.addEventListener("change", () => {
                let cicloSeleccionado = selectCiclo.value;
                actualizarHorario(data, cicloSeleccionado);
            });

            // Cargar el horario del primer ciclo automáticamente
            actualizarHorario(data, selectCiclo.value);
        })
        .catch(error => console.error("Error:", error));
}

function actualizarHorario(data, cicloSeleccionado) {
    let matriculasFiltradas = data.matriculas.filter(m => m.cicloFormativo.nombre === cicloSeleccionado);

    cargarModulosSelect(matriculasFiltradas);
    loadSesion(matriculasFiltradas);
}

function cargarModulosSelect(matriculasFiltradas) {
    let selectModulos = document.getElementById("select-modulo");
    let contenedorBotones = document.getElementById("tag-container");

    selectModulos.innerHTML = "";
    contenedorBotones.innerHTML = "";

    matriculasFiltradas.forEach(matricula => {
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
            quitarModulo(modulo, matriculasFiltradas);
        });
        contenedorBotones.appendChild(boton);
    });

    document.getElementById("btn-filtrar").addEventListener("click", function () {
        let moduloSeleccionado = selectModulos.value;
        if (moduloSeleccionado && !modulosExcluidos.includes(moduloSeleccionado)) {
            modulosExcluidos.push(moduloSeleccionado);
        }
        cargarModulosSelect(matriculasFiltradas);
        loadSesion(matriculasFiltradas);
    });

    document.getElementById("btn-reset").addEventListener("click", function () {
        modulosExcluidos = [];
        cargarModulosSelect(matriculasFiltradas);
        loadSesion(matriculasFiltradas);
    });
}


function loadSesion(matriculasFiltradas) {
    var tabla = document.querySelector("table");
    tabla.innerHTML = "";

    var diasSemana = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    if (matriculasFiltradas.length === 0) {
        console.error("No hay módulos en este ciclo.");
        return;
    }

    let sesionesOriginales = [];
    let horasSet = new Set();

    matriculasFiltradas.forEach(matricula => {
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

    let horasOrdenadas = Array.from(horasSet).sort();
    tablaDatos = [];

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

        let row = [horaInicio + "-" + horaFin];

        for (let j = 0; j < 5; j++) {
            var celda = document.createElement("td");
            let diaSemana = diasSemana[j + 1];

            let sesion = sesionesOriginales.find(s => s.dia === diaSemana && s.horaInicio === horaInicio);
            if (sesion) {
                celda.innerText = `${sesion.modulo} (${sesion.aula})`;
                row.push(`${sesion.modulo} (${sesion.aula})`);
            } else {
                celda.innerText = "";
                row.push("");
            }

            fila.append(celda);
        }

        tablaDatos.push(row);
        body.append(fila);
    }

    localStorage.setItem('tablaDatos', JSON.stringify(tablaDatos));

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
      let selectCiclo = document.getElementById("select-ciclo");
        let cicloSeleccionado = selectCiclo.value; // Tomar el ciclo desde el select
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(cicloSeleccionado, 105, 15, { align: "center" });
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

//Exportar a XML

document.getElementById("btn-xml").addEventListener("click", function () {
    generarXML();
});

function generarXML() {
    let tabla = document.querySelector("table");
    if (!tabla) {
        console.error("No se encontró la tabla.");
        return;
    }

    let xmlDoc = document.implementation.createDocument(null, "Horario", null);
    let rootElement = xmlDoc.documentElement;

    let filas = tabla.querySelectorAll("tr");

    filas.forEach((fila, index) => {
        if (index === 0) return; // Omitir la cabecera

        let sesionElement = xmlDoc.createElement("Sesion");
        let celdas = fila.querySelectorAll("td");

        celdas.forEach((celda, i) => {
            let campo = ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][i];
            let elemento = xmlDoc.createElement(campo);
            elemento.textContent = celda.innerText.trim();
            sesionElement.appendChild(elemento);
        });

        rootElement.appendChild(sesionElement);
    });

    let serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);

    let blob = new Blob([xmlString], { type: "application/xml" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Horario.xml";
    a.click();
}

//Exportar a XLSX

document.getElementById("btn-xlsx").addEventListener("click", function () {
    generarXLSX();
});

function generarXLSX() {
    let tabla = document.querySelector("table");
    if (!tabla) {
        console.error("No se encontró la tabla.");
        return;
    }

    let data = [];
    let filas = tabla.querySelectorAll("tr");

    filas.forEach(fila => {
        let filaData = [];
        fila.querySelectorAll("td, th").forEach(celda => {
            filaData.push(celda.innerText.trim());
        });
        data.push(filaData);
    });

    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Horario");

    XLSX.writeFile(wb, "Horario.xlsx");
}