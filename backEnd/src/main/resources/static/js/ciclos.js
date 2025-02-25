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
        
        if (editingCycle) {
            let firstP = editingCycle.querySelector("p:nth-of-type(1)");
            updateCiclo(firstP.textContent.replace("Código:", "").trim(), code, name, duration, description)
            editingCycle.innerHTML = createCycleHTML(code, name, duration, description);
            addEventListeners(editingCycle);
        } else {
            // Crear un nuevo ciclo
            const cycleDiv = document.createElement("div");
            cycleDiv.classList.add("cycle-card");
            cycleDiv.innerHTML = createCycleHTML(code, name, duration, description);
            addEventListeners(cycleDiv);
            container.appendChild(cycleDiv);
            crearCiclo(code, name, duration, description);
        }

        modal.style.display = "none";
        form.reset();
        editingCycle = null;
    });

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
            const firstP = cycleDiv.querySelector("p:nth-of-type(1)");
            deleteCiclo(firstP.textContent.replace("Código:", "").trim());
            cycleDiv.remove();
        });

        cycleDiv.querySelector(".edit").addEventListener("click", () => {
            modal.style.display = "flex";
            modal.classList.add("show");
            editingCycle = cycleDiv;

            document.getElementById("code").value = cycleDiv.querySelector("p:nth-of-type(1)").textContent.replace("Código: ", "");
            document.getElementById("name").value = cycleDiv.querySelector("h3").textContent;
            document.getElementById("duration").value = cycleDiv.querySelector("p:nth-of-type(2)").textContent.replace("Duración: ", "");
            document.getElementById("description").value = cycleDiv.querySelector("p:nth-of-type(3)").textContent.replace("Descripción: ", "");
        });
    }

    async function crearCiclo(code, name, duration, description) {
        const ciclo = {
            codigo: code,
            nombre: name,
            descripcion: description,
            duracion: duration
        };

        try {
            const response = await fetch("/api/admin/ciclos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ciclo),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al crear el ciclo");
            }

            const data = await response.json();
            console.log("Ciclo creado:", data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", async function () {
        const container = document.getElementById("cycle-container"); // Asegúrate de tener este elemento en tu HTML

        try {
            let ciclos = await getCiclos();
            ciclos.forEach(ciclo => {
                const cycleDiv = document.createElement("div");
                cycleDiv.classList.add("cycle-card");
                cycleDiv.innerHTML = createCycleHTML(ciclo.codigo, ciclo.nombre, ciclo.duracion, ciclo.descripcion);
                addEventListeners(cycleDiv);
                container.appendChild(cycleDiv);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    });

    async function deleteCiclo(codigo) {
        let ciclos = await getCiclos();
        let ciclo = ciclos.find(c => c.codigo === codigo);

        try {
            const response = await fetch(`/api/admin/ciclos/${ciclo.idCiclo}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el ciclo");
            }

            console.log(`Ciclo con código ${codigo} eliminado correctamente.`);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function updateCiclo(oldCode, code, name, duration, description) {
        let ciclos = await getCiclos();
        let ciclo = ciclos.find(c => c.codigo === oldCode);

        const updatedCiclo = {
            codigo: code,
            nombre: name,
            descripcion: description,
            duracion: duration
        };

        try {
            const response = await fetch("/api/admin/ciclos/" + ciclo.idCiclo, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedCiclo),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el ciclo");
            }

            console.log(`Ciclo con código ${oldCode} actualizado a ${code}`);
        } catch (error) {
            console.error("Error:", error);
        }
    }


    async function getCiclos() {
        const response = await fetch("/api/admin/ciclos", { credentials: "include" });

        if (!response.ok) {
             throw new Error("Error al obtener los ciclos");
        }

        const ciclos = await response.json();
        return ciclos;
    }
}

document.addEventListener("DOMContentLoaded", manageCycles());

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
    obtenerUsuario();
});

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            usuario = data.nombre;
            let nombre = document.getElementById("usuarioFooter");
            nombre.innerText = usuario;
        } else {
            console.log("Usuario no autenticado");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}