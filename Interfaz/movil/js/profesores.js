// Añade un nuevo profesor al hacer clic en el botón "+"
document.getElementById("botonAgregar4").addEventListener("click", function() {
    const lista = document.getElementById("listaProfes");
    const profeCount = lista.getElementsByClassName("profesor").length;
    const nuevoProfe = document.createElement("div");
    nuevoProfe.classList.add("profesor");
    nuevoProfe.innerHTML = `
      <span>Profesor ${profeCount + 1}</span>
      <div class="acciones">
        <button class="ver">👁️</button>
        <button class="eliminar">❌</button>
      </div>
    `;
    lista.appendChild(nuevoProfe);
  });
  
  // Elimina un alumno de la lista al hacer clic en el botón "❌"
  document.getElementById("listaProfes").addEventListener("click", function(event) {
    if (event.target.classList.contains("eliminar")) {
      event.target.closest(".profesor").remove();
    }
  });