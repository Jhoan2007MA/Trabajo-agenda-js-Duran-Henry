import { postCities, patchCities } from '../../../Apis/city/cityApi.js';
import { getRegions } from '../../../Apis/region/regionApi.js';

export class RegCity extends HTMLElement {
    constructor() {
        super();
        this.render();

        setTimeout(() => {
            this.loadRegions();
            this.saveData();
            this.enabledBtns();
            this.disableFrm(true);
        }, 0);
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/cities/cityStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Ciudades <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataCity">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre de la Ciudad</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="regionId" class="form-label">Región</label>
                                <select class="form-control" id="regionId" name="regionId">
                                    <option value="">Seleccionar región...</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <div class="container mt-4 text-center">
                                    <a href="#" class="btn btn-primary" id="btnNuevo" data-ed='[["#btnGuardar","#btnCancelar"],["#btnNuevo"]]'>Nuevo</a>
                                    <a href="#" class="btn btn-dark" id="btnCancelar" data-ed='[["#btnNuevo"],["#btnGuardar","#btnCancelar"]]'>Cancelar</a>
                                    <a href="#" class="btn btn-success" id="btnGuardar" data-ed='[["#btnCancelar","#btnNuevo"],["#btnGuardar"]]'>Guardar</a>
                                </div>
                            </div>
                        </div> 
                    </form>
                </div>
            </div>
        `;
        this.querySelector("#btnNuevo").addEventListener("click", (e) => {
            window.ctrlBtn(e.target.dataset.ed);
            window.resetIdView();
            this.disableFrm(false);
        })
        this.querySelector("#btnCancelar").addEventListener("click", (e) => {
            window.ctrlBtn(e.target.dataset.ed);
            window.resetIdView();
            this.disableFrm(true);
        })
    }



    saveData = () => {
        const frmRegistro = document.querySelector('#frmDataCity');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log(' Guardando ciudad:', datos);
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('El nombre de la ciudad es requerido');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    // Modo edición - usar PATCH
                    console.log(' Modo edición - actualizando ciudad ID:', currentId);
                    patchCities(currentId, datos)
                        .then(response => {
                            console.log(' Respuesta del servidor (PATCH):', response);
                            console.log(' Status:', response.status);
                            console.log(' StatusText:', response.statusText);
                            
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('cityUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar ciudad:', error);
                            alert('Error al actualizar la ciudad: ' + error.message);
                        });
                } else {
                    // Modo creación - usar POST
                    console.log(' Modo creación - creando nueva ciudad');
                    postCities(datos)
                        .then(response => {
                            console.log(' Respuesta del servidor (POST):', response);
                            console.log(' Status:', response.status);
                            console.log(' StatusText:', response.statusText);
                            
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error(`Error en la solicitud POST: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .then(responseData => {
                            console.log('Ciudad guardada exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            window.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('citySaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear ciudad:', error.message);
                            alert('Error al crear la ciudad: ' + error.message);
                        });
                }
            } catch (error) {
                console.error('Error en saveData:', error);
                alert('Error inesperado: ' + error.message);
            }
        })
    }


    fillForm = (city) => {
        const frmRegistro = document.querySelector('#frmDataCity');
        frmRegistro.elements['name'].value = city.name;
        frmRegistro.elements['regionId'].value = city.regionId || '';
        window.viewData(city.id);
        this.disableFrm(false);
        
        window.ctrlBtn(document.querySelector('#btnGuardar').dataset.ed);
    }

    loadRegions = async () => {
        try {
            const regions = await getRegions();
            const regionSelect = document.querySelector('#regionId');
            
            if (regions && regions.length > 0) {
                // Limpiar opciones existentes excepto la primera
                regionSelect.innerHTML = '<option value="">Seleccionar región...</option>';
                
                // Agregar regiones al selector
                regions.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.id;
                    option.textContent = region.name;
                    regionSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando regiones:', error);
        }
    }

    disableFrm = (estado) => {
        window.disableFrm(estado, '#frmDataCity');
    }
}

customElements.define('reg-city', RegCity);