function manageCycles() {
    const modal = document.getElementById("modal");
    const btnAdd = document.getElementById("btn-add");
    const closeBtn = document.querySelector(".close");
    const form = document.getElementById("cycle-form");
    const container = document.getElementById("cycle-container");
    let editingCycle = null;

    btnAdd.addEventListener("click", () => {
        modal.style.display = "flex";
        form.reset();
        editingCycle = null;
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const code = document.getElementById("code").value.trim();
        const name = document.getElementById("name").value.trim();
        const duration = document.getElementById("duration").value.trim();
        const description = document.getElementById("description").value.trim();

        if (!code || !name || !duration || !description) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (!editingCycle) {
            // Verificar si ya existe un ciclo con el mismo código
            const existingCycle = Array.from(container.children).find(cycle =>
                cycle.querySelector("p:first-of-type").textContent.includes(`Código: ${code}`)
            );

            if (existingCycle) {
                alert("Ya existe un ciclo con este código.");
                return;
            }
        }

        if (editingCycle) {
            // Editar el ciclo existente sin crear uno nuevo
            editingCycle.innerHTML = createCycleHTML(code, name, duration, description);
            addEventListeners(editingCycle);
        } else {
            // Crear un nuevo ciclo
            const cycleDiv = document.createElement("div");
            cycleDiv.classList.add("cycle-card");
            cycleDiv.innerHTML = createCycleHTML(code, name, duration, description);
            addEventListeners(cycleDiv);
            container.appendChild(cycleDiv);
        }

        modal.style.display = "none";
        form.reset();
        editingCycle = null; // Restablecer la variable después de editar
    });

    function createCycleHTML(code, name, duration, description) {
        return `
            <h3>${name}</h3>
            <p><strong>Código:</strong> ${code}</p>
            <p><strong>Duración:</strong> ${duration}</p>
            <p><strong>Descripción:</strong> ${description}</p>
            <button class='edit'>Editar</button>
            <button class='delete'>Eliminar</button>
        `;
    }

    function addEventListeners(cycleDiv) {
        cycleDiv.querySelector(".delete").addEventListener("click", () => {
            cycleDiv.remove();
        });

        cycleDiv.querySelector(".edit").addEventListener("click", () => {
            modal.style.display = "flex";
            editingCycle = cycleDiv;

            document.getElementById("code").value = cycleDiv.querySelector("p:nth-of-type(1)").textContent.replace("Código: ", "");
            document.getElementById("name").value = cycleDiv.querySelector("h3").textContent;
            document.getElementById("duration").value = cycleDiv.querySelector("p:nth-of-type(2)").textContent.replace("Duración: ", "");
            document.getElementById("description").value = cycleDiv.querySelector("p:nth-of-type(3)").textContent.replace("Descripción: ", "");
        });
    }
}

document.addEventListener("DOMContentLoaded", manageCycles);


document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementById("btn-add");
    const closeModalBtn = document.querySelector(".close");

    // Función para mostrar el modal
    function showModal() {
        modal.classList.add("show");
    }

    // Función para ocultar el modal
    function hideModal() {
        modal.classList.remove("show");
    }

    // Evento para abrir el modal
    if (openModalBtn) {
        openModalBtn.addEventListener("click", showModal);
    }

    // Evento para cerrar el modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", hideModal);
    }

    // Cerrar el modal si se hace clic fuera del contenido
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            hideModal();
        }
    });
});


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