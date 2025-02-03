// Añade un nuevo alumno al hacer clic en el botón "+"
document.getElementById("botonAgregar3").addEventListener("click", function() {
    const lista = document.getElementById("listaAlumnos");
    const alumnoCount = lista.getElementsByClassName("alumno").length;
    const nuevoAlumno = document.createElement("div");
    nuevoAlumno.classList.add("alumno");
    nuevoAlumno.innerHTML = `
      <span>Alumno ${alumnoCount + 1}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar">❌</button>
      </div>
    `;
    lista.appendChild(nuevoAlumno);
  });
  
  // Elimina un alumno de la lista al hacer clic en el botón "❌"
  document.getElementById("listaAlumnos").addEventListener("click", function(event) {
    if (event.target.classList.contains("eliminar")) {
      event.target.closest(".alumno").remove();
    }
  });
  