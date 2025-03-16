document.addEventListener("DOMContentLoaded", async function () {
    const btnAgregar = document.getElementById("botonAgregar5");
    const listaCiclos = document.getElementById("listaCiclos");
    let cicloEditando = null;

    btnAgregar.addEventListener("click", () => {
        crearModalCiclo();
    });

    async function getCiclos() {
        try {
            const response = await fetch("/api/admin/ciclos", { credentials: "include" });
            if (!response.ok) throw new Error("Error al obtener ciclos");

            const ciclos = await response.json();
            listaCiclos.innerHTML = "";
            ciclos.forEach(ciclo => {
                agregarCicloDOM(ciclo.codigo, ciclo.nombre, ciclo.duracion, ciclo.descripcion, ciclo.idCiclo);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function crearModalCiclo(ciclo = null) {
        const modal = document.createElement("div");
        modal.id = "modalCiclo";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-contenido">
                <h3>${ciclo ? "Editar Ciclo" : "Nuevo Ciclo"}</h3>
                <form id="formCiclo">
                    <input type="text" id="codigoCiclo" placeholder="Código" value="${ciclo?.codigo || ''}" required>
                    <input type="text" id="nombreCiclo" placeholder="Nombre del ciclo" value="${ciclo?.nombre || ''}" required>
                    <input type="number" id="duracionCiclo" placeholder="Duración en horas" value="${ciclo?.duracion || ''}" required>
                    <textarea id="descripcionCiclo" placeholder="Descripción">${ciclo?.descripcion || ''}</textarea>
                    <div class="modal-botones">
                        <button type="button" class="cancelar">Cancelar</button>
                        <button type="submit">${ciclo ? "Guardar" : "Agregar"}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = "flex";

        document.querySelector(".cancelar").addEventListener("click", () => modal.remove());

        document.getElementById("formCiclo").addEventListener("submit", async function (e) {
            e.preventDefault();
            const cicloData = {
                codigo: document.getElementById("codigoCiclo").value.trim(),
                nombre: document.getElementById("nombreCiclo").value.trim(),
                duracion: document.getElementById("duracionCiclo").value.trim(),
                descripcion: document.getElementById("descripcionCiclo").value.trim()
            };

            if (ciclo) {
                await updateCiclo(ciclo.idCiclo, cicloData);
            } else {
                await crearCiclo(cicloData);
            }

            modal.remove();
            await getCiclos();
        });
    }

    function agregarCicloDOM(codigo, nombre, duracion, descripcion, id) {
        const ciclo = document.createElement("div");
        ciclo.className = "ciclo";
        ciclo.dataset.id = id;
        ciclo.innerHTML = `
            <span>${nombre} (${codigo})</span>
            <div class="acciones">
                <button class="ver">👁️</button>
                <button class="eliminar">❌</button>
            </div>
        `;

        ciclo.querySelector(".ver").addEventListener("click", () => {
            crearModalCiclo({ codigo, nombre, duracion, descripcion, idCiclo: id });
        });

        ciclo.querySelector(".eliminar").addEventListener("click", async () => {
            await deleteCiclo(id);
            ciclo.remove();
        });

        listaCiclos.appendChild(ciclo);
    }

    async function crearCiclo(ciclo) {
        try {
            const response = await fetch("/api/admin/ciclos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ciclo),
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al crear el ciclo");

            console.log("Ciclo creado");
            getCiclos();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function updateCiclo(id, ciclo) {
        try {
            const response = await fetch(`/api/admin/ciclos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ciclo),
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al actualizar el ciclo");

            console.log(`Ciclo con ID ${id} actualizado`);
            getCiclos();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function deleteCiclo(id) {
        try {
            const response = await fetch(`/api/admin/ciclos/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error al eliminar ciclo");

            console.log(`Ciclo con ID ${id} eliminado`);

            getCiclos();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    await getCiclos();
    obtenerUsuario();
});

async function obtenerUsuario() {
    try {
        const response = await fetch('/api/usuarios/info', { credentials: 'include' });
        const data = await response.json();

        if (data.authenticated) {
            const userName = document.getElementById("userName");
            userName.innerText = data.nombre;
        } else {
            console.log("Usuario no autenticado");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}
