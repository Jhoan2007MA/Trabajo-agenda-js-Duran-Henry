
class IdManager {
    static async getNextId(endpoint) {
        try {
            // Hacer petición al servidor para obtener datos
            const response = await fetch(`http://localhost:3000/${endpoint}`);
            const data = await response.json();
            
            // Si hay datos, encontrar el ID más alto
            if (data.length > 0) {
                let maxId = 0;
                for (let item of data) {
                    let itemId = parseInt(item.id) || 0;
                    if (itemId > maxId) {
                        maxId = itemId;
                    }
                }
                return (maxId + 1).toString();
            }
            
            // Si no hay datos, empezar con ID 1
            return "1";
        } catch (error) {
            // Si hay error, empezar con ID 1
            return "1";
        }
    }
    
    // Crear nuevo registro con ID automático
    static async createWithSequentialId(endpoint, data) {
        // Obtener el siguiente ID
        const nextId = await this.getNextId(endpoint);
        
        // Agregar el ID a los datos
        const dataWithId = { ...data, id: nextId };
        
        // Enviar datos al servidor
        return fetch(`http://localhost:3000/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataWithId)
        });
    }
}

function ctrlBtn(e) {
    // Convertir el string JSON a un objeto
    const buttonData = JSON.parse(e);
    const buttonsToEnable = buttonData[0];  
    const buttonsToDisable = buttonData[1]; 
    
    // Activar botones
    for (let buttonSelector of buttonsToEnable) {
        let button = document.querySelector(buttonSelector);
        if (button) {
            button.classList.remove('disabled');
            button.removeAttribute('disabled');
        }
    }
    
    // Desactivar botones
    for (let buttonSelector of buttonsToDisable) {
        let button = document.querySelector(buttonSelector);
        if (button) {
            button.classList.add('disabled');
            button.setAttribute('disabled', 'disabled');
        }
    }
}


function resetIdView() {
    let idViewElement = document.querySelector('#idView');
    if (idViewElement) {
        idViewElement.innerHTML = '';
    }
}

// Mostrar un ID en la pantalla
function viewData(id) {
    let idViewElement = document.querySelector('#idView');
    if (idViewElement) {
        idViewElement.innerHTML = id;
    }
}

// Activar todos los botones que tienen configuración
function enabledBtns() {
    let allButtons = document.querySelectorAll(".btn[data-ed]");
    for (let button of allButtons) {
        ctrlBtn(button.dataset.ed);
    }
}

// Limpiar y deshabilitar un formulario
function disableFrm(estado, formId) {
    let form = document.querySelector(formId);
    if (form) {
        for (let element of form.elements) {
            if (element.type !== 'button' && element.type !== 'submit') {
                element.value = '';
                element.disabled = estado;
            }
        }
    }
}


function setupTabNavigation(prefix, listMethod) {
    // Encontrar todos los botones de navegación
    let navigationButtons = document.querySelectorAll(`.mnu${prefix}`);
    
   
    for (let button of navigationButtons) {
        button.addEventListener("click", function(event) {
            
            let navigationData = JSON.parse(event.target.dataset.verocultar);
            let elementToShow = navigationData[0];    // Elemento a mostrar
            let elementsToHide = navigationData[1];   // Elementos a ocultar
            
            
            let showElement = document.querySelector(elementToShow);
            if (showElement) {
                showElement.style.display = 'block';
            }
            
            
            for (let elementSelector of elementsToHide) {
                let hideElement = document.querySelector(elementSelector);
                if (hideElement) {
                    hideElement.style.display = 'none';
                }
            }
            
            
            if (elementToShow.includes('lst')) {
                let listComponent = document.querySelector(`lst-${prefix}`);
                if (listComponent && listComponent[listMethod]) {
                    listComponent[listMethod]();
                }
            }
            
        
            event.stopImmediatePropagation();
            event.preventDefault();
        });
    }
}

// Exportar para uso global
window.IdManager = IdManager;
window.ctrlBtn = ctrlBtn;
window.resetIdView = resetIdView;
window.viewData = viewData;
window.enabledBtns = enabledBtns;
window.disableFrm = disableFrm;
window.setupTabNavigation = setupTabNavigation;

import '/App/Components/navMenu/navMenu.js';
import '/App/Components/countries/countryComponent.js';
import '/App/Components/region/regionComponent.js';
import '/App/Components/cities/cityComponent.js';
import '/App/Components/companies/companyComponent.js';
import '/App/Components/branches/branchesComponent.js';