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

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("code").value;
        const name = document.getElementById("name").value;
        const duration = document.getElementById("duration").value;
        const description = document.getElementById("description").value;
        
        if (editingCycle) {
            editingCycle.innerHTML = createCycleHTML(code, name, duration, description);
            addEventListeners(editingCycle);
            modal.style.display = "none";
            return;
        }
        
        const cycleDiv = document.createElement("div");
        cycleDiv.classList.add("cycle");
        cycleDiv.innerHTML = createCycleHTML(code, name, duration, description);
        addEventListeners(cycleDiv);
        
        container.appendChild(cycleDiv);
        modal.style.display = "none";
        form.reset();
    });

    function createCycleHTML(code, name, duration, description) {
        return `<div class='cycle-row'>
                    <span><strong>${code} - ${name}</strong> (${duration})</span>
                    <span>${description}</span>
                    <button class='edit'>Editar</button>
                    <button class='delete'>Eliminar</button>
                </div>`;
    }

    function addEventListeners(cycleDiv) {
        cycleDiv.querySelector(".delete").addEventListener("click", () => {
            cycleDiv.remove();
        });
        
        cycleDiv.querySelector(".edit").addEventListener("click", () => {
            modal.style.display = "flex";
            editingCycle = cycleDiv;
            
            const details = cycleDiv.querySelector("span").textContent.match(/(\S+) - (.+) \((.+)\)/);
            if (details) {
                document.getElementById("code").value = details[1];
                document.getElementById("name").value = details[2];
                document.getElementById("duration").value = details[3];
            }
            document.getElementById("description").value = cycleDiv.children[1].textContent;
        });
    }
}

document.addEventListener("DOMContentLoaded", manageCycles);
