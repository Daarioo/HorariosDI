document.addEventListener("DOMContentLoaded", () => {
    let usuario;
    let horariosData = {}; // Para almacenar los horarios obtenidos
    let modulosExcluidos = [];

    const horariosFrame = document.getElementById("horariosList");
    const diaButtons = document.querySelectorAll(".dia");
    const pdfButton = document.getElementById("pdfButton");

    // Obtener usuario y cargar horarios
    async function obtenerUsuario() {
        try {
            const response = await fetch('/api/usuarios/info', { method: 'GET', credentials: 'include' });
            const data = await response.json();

            if (data.authenticated) {
                usuario = data.nombre;
                getHorarios(data.id);
            } else {
                console.error("Usuario no autenticado");
            }
        } catch (error) {
            console.error("Error al obtener usuario:", error);
        }
    }

    // Obtener los horarios del usuario desde la API
    function getHorarios(id) {
        fetch(`http://localhost:8080/api/alumno/${id}`)
            .then(response => response.json())
            .then(data => {
                if (!data.matriculas || data.matriculas.length === 0) {
                    console.error("El usuario no tiene matrículas.");
                    return;
                }

                let selectCiclo = document.getElementById("select-ciclo");
                selectCiclo.innerHTML = ""; // Limpiar selector

                let ciclosUnicos = new Set(data.matriculas.map(m => m.cicloFormativo.nombre));

                // Llenar el selector de ciclos
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
            .catch(error => console.error("Error al cargar horarios:", error));
    }

    function actualizarHorario(data, cicloSeleccionado) {
        horariosData = procesarHorarios(data, cicloSeleccionado);
        renderHorarios("Martes"); // Mostrar el horario del martes por defecto
    }



    // Procesar los horarios en un formato usable
    function procesarHorarios(data, cicloSeleccionado) {
        let horarios = {
            "Lunes": [], "Martes": [], "Miércoles": [], "Jueves": [], "Viernes": []
        };

        data.matriculas
            .filter(matricula => matricula.cicloFormativo.nombre === cicloSeleccionado) // Filtrar por ciclo
            .forEach(matricula => {
                if (matricula.modulo) {
                    matricula.modulo.sesiones.forEach(sesion => {
                        horarios[sesion.dia].push({
                            materia: matricula.modulo.nombre,
                            inicio: sesion.horaInicio,
                            fin: sesion.horaFin,
                            aula: sesion.aula
                        });
                    });
                }
            });

        // Ordenar horarios por hora de inicio
        Object.keys(horarios).forEach(dia => {
            horarios[dia].sort((a, b) => {
                let horaA = new Date(`1970-01-01T${a.inicio}:00`);
                let horaB = new Date(`1970-01-01T${b.inicio}:00`);
                return horaA - horaB;
            });
        });

        return horarios;
    }

    // Renderizar horarios en la página
    function renderHorarios(dia) {
        horariosFrame.innerHTML = "";

        if (horariosData[dia] && horariosData[dia].length > 0) {
            horariosData[dia].forEach(({ materia, inicio, fin, aula }) => {
                const horarioDiv = document.createElement("div");
                horarioDiv.classList.add("horario-item");
                horarioDiv.innerHTML = `
                    <div class='materia'><strong>${materia}</strong></div>
                    <div class='horario'>${inicio} - ${fin}</div>
                    <div class='aula'>${aula}</div>
                `;
                horariosFrame.appendChild(horarioDiv);
            });
        } else {
            horariosFrame.innerHTML = "<p>No hay clases este día.</p>";
        }
    }

    // Evento para cambiar de día al hacer clic en los botones
    diaButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".dia.active").classList.remove("active");
            button.classList.add("active");
            renderHorarios(button.dataset.dia);
        });
    });

    // Generar PDF
    pdfButton.addEventListener("click", () => {
        console.log("Botón PDF presionado");
        generarPDF();
    });
  function generarPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Título y usuario
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Horario", 105, 15, { align: "center" });
      doc.setFontSize(14);
      doc.text(usuario, 105, 25, { align: "center" });

      // Recuperamos los datos almacenados en localStorage
      let tablaDatos = JSON.parse(localStorage.getItem('tablaDatos'));

      if (!tablaDatos || tablaDatos.length === 0) {
          console.error("No se encontraron datos para generar el PDF.");
          return;
      }

      let headers = ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
      let dataTabla = tablaDatos; // Usamos los datos almacenados en tablaDatos

      // Generar la tabla en el PDF usando autoTable
      doc.autoTable({
          head: [headers],  // Cabeceras
          body: dataTabla,  // Filas de la tabla
          startY: 40,  // Posición vertical para la tabla
          styles: {
              fontSize: 8,
              cellPadding: 3,
              halign: "center",
              minCellWidth: 30
          },
          headStyles: {
              fillColor: [74, 139, 172],
              textColor: 255,
              fontStyle: "bold",
              halign: "center"
          },
          theme: "grid",
          margin: { top: 20 },
      });

      // Guardar el PDF
      doc.save("Horario.pdf");
  }
    // Función para generar XML
    function generarXML() {
        let xmlDoc = document.implementation.createDocument(null, "Horario", null);
        let rootElement = xmlDoc.documentElement;

        Object.keys(horariosData).forEach(dia => {
            horariosData[dia].forEach(({ materia, inicio, fin, aula }) => {
                let sesionElement = xmlDoc.createElement("Sesion");

                let diaElement = xmlDoc.createElement("Dia");
                diaElement.textContent = dia;
                sesionElement.appendChild(diaElement);

                let materiaElement = xmlDoc.createElement("Materia");
                materiaElement.textContent = materia;
                sesionElement.appendChild(materiaElement);

                let inicioElement = xmlDoc.createElement("Inicio");
                inicioElement.textContent = inicio;
                sesionElement.appendChild(inicioElement);

                let finElement = xmlDoc.createElement("Fin");
                finElement.textContent = fin;
                sesionElement.appendChild(finElement);

                let aulaElement = xmlDoc.createElement("Aula");
                aulaElement.textContent = aula;
                sesionElement.appendChild(aulaElement);

                rootElement.appendChild(sesionElement);
            });
        });

        let serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(xmlDoc);
        let blob = new Blob([xmlString], { type: "application/xml" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Horario.xml";
        a.click();
    }

    // Función para generar XLSX
    function generarXLSX() {
        let tablaDatos = JSON.parse(localStorage.getItem('tablaDatos'));
        if (!tablaDatos || tablaDatos.length === 0) {
            console.error("No se encontraron datos para generar el XLSX.");
            return;
        }

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet(tablaDatos);

        XLSX.utils.book_append_sheet(wb, ws, "Horario");
        XLSX.writeFile(wb, "Horario.xlsx");
    }

     document.getElementById("xmlButton").addEventListener("click", function () {
            generarXML();
        });

        // Botón XLSX
        document.getElementById("xlsxButton").addEventListener("click", function () {
            generarXLSX();
        });

    // Llamar a la función principal para obtener los datos
    obtenerUsuario();
});
