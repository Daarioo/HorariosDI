

document.addEventListener("DOMContentLoaded", () => {
    const horariosFrame = document.getElementById("horariosList");
    const diaButtons = document.querySelectorAll(".dia");
    const cicloSelect = document.querySelector(".cicloSelect");

    const horarios = {
        "Lunes": [
            { materia: "Matemáticas", inicio: "8:00", fin: "9:00" },
            { materia: "Física", inicio: "9:00", fin: "10:00" }
        ],
        "Martes": [
            { materia: "Administración de sistemas", inicio: "9:00", fin: "9:50" },
            { materia: "Lenguaje de Marcas", inicio: "9:50", fin: "10:40" },
            { materia: "Programación", inicio: "11:00", fin: "11:50" }
        ],
        "Miércoles": [
            { materia: "Historia", inicio: "10:00", fin: "11:00" },
            { materia: "Literatura", inicio: "11:00", fin: "12:00" }
        ],
        "Jueves": [
            { materia: "Química", inicio: "8:00", fin: "9:00" },
            { materia: "Biología", inicio: "9:00", fin: "10:00" }
        ],
        "Viernes": [
            { materia: "Educación Física", inicio: "8:00", fin: "9:00" },
            { materia: "Arte", inicio: "9:00", fin: "10:00" }
        ]
    };

    function renderHorarios(dia) {
        horariosFrame.innerHTML = "";
        if (horarios[dia]) {
            horarios[dia].forEach(({ materia, inicio, fin }) => {
                const horarioDiv = document.createElement("div");
                horarioDiv.classList.add("horario-item");
                horarioDiv.innerHTML = `
                    <div class='materia'>${materia}</div>
                    <div class='horario'>${inicio} - ${fin}</div>
                `;
                horariosFrame.appendChild(horarioDiv);
            });
        }
    }

    diaButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".dia.active").classList.remove("active");
            button.classList.add("active");
            renderHorarios(button.dataset.dia);
        });
    });

    renderHorarios("Martes"); // Cargar por defecto
});
