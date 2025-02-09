async function obtenerUsuario() {
    const response = await fetch('/api/usuarios/info', {
        method: 'GET',
        credentials: 'include'
    });
    const data = await response.json();

    if (data.authenticated) {
        // console.log("ID:", data.id, "Nombre:", data.nombre, "Tipo:", data.tipo);
        getJson(data.id)
    } else {
        console.log("Usuario no autenticado");
    }
}

function getJson(id){
    fetch('http://localhost:8080/api/alumno/' + id)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar el archivo');
      }
      return response.json();
    })
    .then(data => {
      loadSesion(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function loadSesion(data){
  createTable(data);
}

function createTable(data){
  var tabla = document.querySelector("table");
    tabla.innerHTML = "";

    var diasSemana = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    if (!data.matriculas || data.matriculas.length === 0) {
        console.error("No hay matrículas en el JSON.");
        return;
    }

    let sesionesExpandida = [];
    let horasSet = new Set();

    data.matriculas.forEach(matricula => {
      if (matricula.modulo && Array.isArray(matricula.modulo.sesiones)) {
          matricula.modulo.sesiones.forEach(sesion => {
              let horaInicio = parseInt(sesion.horaInicio.split(":")[0]);
              let horaFin = parseInt(sesion.horaFin.split(":")[0]);

              for (let hora = horaInicio; hora < horaFin; hora++) {
                  let horaStr = `${hora.toString().padStart(2, "0")}:00`;
                  sesionesExpandida.push({
                      dia: sesion.dia,
                      horaInicio: horaStr,
                      horaFin: `${(hora + 1).toString().padStart(2, "0")}:00`,
                      aula: sesion.aula,
                      modulo: matricula.modulo.nombre
                  });
                  horasSet.add(horaStr);
              }
          });
      }
  });

  let minHora = Math.min(...Array.from(horasSet).map(h => parseInt(h.split(":")[0])));
  let maxHora = Math.max(...Array.from(horasSet).map(h => parseInt(h.split(":")[0])));

  let horasOrdenadas = [];
  for (let h = minHora; h <= maxHora; h++) {
      horasOrdenadas.push(`${h.toString().padStart(2, "0")}:00-${(h + 1).toString().padStart(2, "0")}:00`);
  }

  var head = document.createElement("thead");
  var filaHead = document.createElement("tr");

  diasSemana.forEach(dia => {
      var celda = document.createElement("th");
      celda.innerText = dia;
      filaHead.append(celda);
  });

  head.append(filaHead);
  tabla.append(head);

  var body = document.createElement("tbody");

  horasOrdenadas.forEach(hora => {
      var fila = document.createElement("tr");

      var celdaHora = document.createElement("td");
      celdaHora.innerText = hora;
      fila.append(celdaHora);

      for (let i = 0; i < 5; i++) {
          var celda = document.createElement("td");
          let diaSemana = diasSemana[i + 1]; 

          let sesion = sesionesExpandida.find(s => s.dia === diaSemana && `${s.horaInicio}-${s.horaFin}` === hora);
          if (sesion) {
              celda.innerText = `${sesion.modulo} (${sesion.aula})`;
          } else {
            celda.innerText = "";
          }

          fila.append(celda);
      }

      body.append(fila);
  });

  tabla.append(body);
}

obtenerUsuario();