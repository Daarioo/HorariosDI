document.addEventListener("DOMContentLoaded", async function () {
    await obtenerUsuario();
    await getAlumnos();
});

const btnAgregar = document.getElementById("botonAgregar3");
const listAlumnos = document.getElementById("listaAlumnos");
const filtro = document.getElementById("filtro");
filtro.addEventListener("input", filtrarAlumnos);

async function getAlumnos() {
    const response = await fetch("/api/alumno", { credentials: "include" });

    if (!response.ok) {
        throw new Error("Error al obtener los alumnos");
    }

    listAlumnos.innerHTML = "";
    const usuarios = await response.json();
    window.alumnos = usuarios.filter((usuario)=> usuario.tipo == "ALUMNO");
    if (window.alumnosFiltrados != undefined){
        if(window.alumnos.length != window.alumnosFiltrados.length){
            filtrarAlumnos();
            return;
        }
    }
    window.alumnos.forEach((alumno)=>{
        agregarAlumnoLista(alumno);
    });
}

async function agregarAlumno(alumno) {
    try {
        const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(alumno),
                credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al crear el alumno");
        }

        await getAlumnos();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function editarAlumno(id, alumnoNuevo) {
    try {
        const response = await fetch("/api/usuarios/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumnoNuevo),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Error al actualizar el alumno");
        await getAlumnos();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function borrarAlumno(id) {
    try {
        const response = await fetch(`/api/usuarios/` + id, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el alumno");
        }

        await getAlumnos();
    } catch (error) {
         console.error("Error:", error);
    }
}

function agregarAlumnoLista(alumno) {
    const nuevoAlumno = document.createElement("div");
    nuevoAlumno.classList.add("alumno");
    nuevoAlumno.dataset.id = alumno.idUsuario;
    nuevoAlumno.dataset.nombre = alumno.nombreUsuario;
    nuevoAlumno.dataset.correo = alumno.email;

    nuevoAlumno.innerHTML = `
        <div class="alumno-info">
            <span><strong>${alumno.nombreUsuario}</strong></span>
        </div>
        <div class="acciones">
            <button class="ver">👁️</button>
            <button onclick="borrarAlumno(${alumno.idUsuario})" class="eliminar">❌</button>
        </div>
    `;
    listAlumnos.appendChild(nuevoAlumno);
}

function crearModalAlumno() {
  const modal = document.createElement("div");
  modal.id = "modalAlumno";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Nuevo Alumno</h3>
      <form id="formAlumno">
        <label>Nombre completo</label>
        <input type="text" placeholder="Nombre completo" required>
        <label>Correo electrónico</label>
        <input type="email" placeholder="Correo electrónico" required>
        <div class="modal-botones">
          <button type="button" class="cancelar">Cancelar</button>
          <button type="submit">Agregar</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

btnAgregar.addEventListener("click", function() {
  if (!document.getElementById("modalAlumno")) {
    crearModalAlumno();
  }
  
  const modal = document.getElementById("modalAlumno");
  const form = document.getElementById("formAlumno");
  const inputs = form.getElementsByTagName("input");
  
  modal.style.display = "flex";

  modal.querySelector(".cancelar").addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  form.onsubmit = (e) => {
    e.preventDefault();
    const alumnoCount = listAlumnos.getElementsByClassName("alumno").length;

    const nombre = inputs[0].value || `Alumno ${alumnoCount + 1}`;
    const correo = inputs[1].value;

    const nuevoAlumno = {
        contraseña: "abc123..",
        email: correo,
        nombreUsuario: nombre,
        tipo: "ALUMNO"
    };

    agregarAlumno(nuevoAlumno);

    modal.style.display = "none";
    form.reset();
  };
});

listAlumnos.addEventListener("click", function(event) {
  if (event.target.classList.contains("ver")) {
    const alumnoElement = event.target.closest(".alumno");
    crearModalVerEditarProfe(alumnoElement);
  }
});

async function crearModalVerEditarProfe(alumnoElement) {
  const modalAlu = document.createElement("div");
  modalAlu.className = "modal";
  modalAlu.id = "modalVerEditarAlumno";
  
  const nombre = alumnoElement.dataset.nombreUsuario || alumnoElement.querySelector("span").textContent;
  const correo = alumnoElement.dataset.correo || "";
  const contraseña = await obtenerContraseña(alumnoElement.dataset.id) || "";
  
  modalAlu.innerHTML = `
    <div class="modal-contenido">
      <h3>Editar Alumno</h3>
      <form id="formVerEditarAlumno">
        <label>Nombre completo</label>
        <input type="text" placeholder="Nombre completo" value="${nombre}" required>
        <label>Correo electrónico</label>
        <input type="email" placeholder="Correo electrónico" value="${correo}" required>
        <label>Contraseña</label>
        <input type="password" placeholder="Contraseña" value="${contraseña}" required>
        <div class="modal-botones">
          <button type="button" class="cancelar">Cancelar</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modalAlu);
  modalAlu.style.display = "flex";
  
  const form = modalAlu.querySelector("form");

  modalAlu.querySelector(".cancelar").addEventListener("click", () => {
    modalAlu.remove();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = form.getElementsByTagName("input");
    const nuevoNombre = inputs[0].value;
    const nuevoCorreo = inputs[1].value;
    const nuevaContraseña = inputs[2].value;

    const nuevoAlumno = {
        contraseña: nuevaContraseña,
        email: nuevoCorreo,
        nombreUsuario: nuevoNombre,
        tipo: "ALUMNO"
    };

    await editarAlumno(alumnoElement.dataset.id, nuevoAlumno);
    
    modalAlu.remove();
  });
}

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

async function obtenerContraseña(id) {
    try {
        const response = await fetch('/api/alumno/' + id, { credentials: 'include' });
        const data = await response.json();

        return data.contraseña;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

function filtrarAlumnos(){
    let text = filtro.value;
    window.alumnosFiltrados = window.alumnos.filter(obj =>
        Object.values(obj).some(value =>
            String(value).toLowerCase().includes(text.toLowerCase())
        )
    );
    cargarAlumnosFiltrados();
}

function cargarAlumnosFiltrados() {
    listAlumnos.innerHTML = "";

    window.alumnosFiltrados.forEach(alumno => {
        agregarAlumnoLista(alumno);
    });
}

