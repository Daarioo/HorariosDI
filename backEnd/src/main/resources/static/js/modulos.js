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