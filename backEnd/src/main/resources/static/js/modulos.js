function mostrarModal() {
    document.getElementById("modal").style.display = "block";
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

function createTable(json){
    let tbody = document.querySelector("#modulosTabla");
    json.forEach((modulo) => {
        let tr = document.createElement('tr');
        let nombre = document.createElement("td");
        nombre.innerText = modulo.nombre;
        let codigo = document.createElement("td");
        codigo.innerText = modulo.codigo;
        let horasSem = document.createElement("td");
        horasSem.innerText = modulo.horasSemana;
        let horasTot= document.createElement("td");
        horasTot.innerText = modulo.horasTotales;
        let ciclo = document.createElement("td");
        ciclo.innerText = modulo.ciclo.nombre;
        let profe = document.createElement("td");
        profe.innerText = modulo.profesor.nombre+" "+modulo.profesor.apellidos;

        tr.append(nombre);
        tr.append(codigo);
        tr.append(horasSem);
        tr.append(horasTot);
        tr.append(ciclo);
        tr.append(profe);
        tbody.append(tr);

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

    let nuevoModulo = {
        nombre,
        codigo,
        horasSemana: parseInt(horasSemana),
        horasTotales: parseInt(horasTotales),
        ciclo: { idCiclo: parseInt(cicloId) }, // Asociamos el ciclo por ID
        profesor: { idProfesor: parseInt(profesorId) } // Asociamos el profesor por ID
    };

  try {
      const response = await fetch("/api/admin/modulos", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoModulo)
      });

      if (!response.ok) throw new Error("Error al crear el módulo");

      const moduloCreado = await response.json();

      // SOLUCIÓN: Recargar datos completos antes de agregar a la tabla
      const moduloCompleto = await fetch(`/api/admin/modulos/${moduloCreado.idModulo}`, { credentials: "include" })
          .then(res => res.json());

      alert("Módulo agregado exitosamente");
      cerrarModal();
      document.getElementById("moduloForm").reset();

      agregarFilaModulo(moduloCompleto);  // Usamos el módulo con datos completos
  } catch (error) {
      console.error(error);
      alert("No se pudo agregar el módulo.");
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

    tr.innerHTML = `
        <td>${modulo.nombre}</td>
        <td>${modulo.codigo}</td>
        <td>${modulo.horasSemana}</td>
        <td>${modulo.horasTotales}</td>
        <td>${modulo.ciclo.nombre}</td>
        <td>${modulo.profesor.nombre} ${modulo.profesor.apellidos}</td>
    `;

    tbody.appendChild(tr);
}

