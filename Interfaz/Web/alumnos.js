function init() {
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.querySelector(".close");
    const form = document.getElementById("matriculaForm");
    const tableBody = document.querySelector("#alumnosTable tbody");

    openModal.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        agregarAlumno();
    });

    tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete")) {
            event.target.closest("tr").remove();
        } else if (event.target.classList.contains("edit")) {
            editarAlumno(event.target.closest("tr"));
        }
    });
}

function agregarAlumno() {
    const matricula = document.getElementById("matricula").value;
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const ciclos = document.getElementById("ciclos").value;
    const tableBody = document.querySelector("#alumnosTable tbody");
    const modal = document.getElementById("modal");
    const form = document.getElementById("matriculaForm");
    
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${matricula}</td>
        <td>${nombre}</td>
        <td>${email}</td>
        <td>${ciclos}</td>
        <td class="botons">
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
        </td>
    `;
    
    tableBody.appendChild(row);
    modal.style.display = "none";
    form.reset();
}

function editarAlumno(row) {
    document.getElementById("matricula").value = row.cells[0].textContent;
    document.getElementById("nombre").value = row.cells[1].textContent;
    document.getElementById("email").value = row.cells[2].textContent;
    document.getElementById("ciclos").value = row.cells[3].textContent;
    row.remove();
    document.getElementById("modal").style.display = "flex";
}


document.addEventListener("DOMContentLoaded", function () {
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
});