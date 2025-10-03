import { postRegions, patchRegions } from '../../../Apis/region/regionApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class RegRegion extends HTMLElement {
    constructor() {
        super();
        this.render();
        // Usar setTimeout para asegurar que el DOM esté listo
        setTimeout(() => {
            this.loadCountries();
            this.saveData();
            this.enabledBtns();
            this.disableFrm(true);
        }, 0);
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/regions/regionStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Regiones <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataRegion">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre de la Región</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="countryId" class="form-label">País</label>
                                <select class="form-control" id="countryId" name="countryId">
                                    <option value="">Seleccionar país...</option>
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
        const frmRegistro = document.querySelector('#frmDataRegion');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log(' Guardando región:', datos);
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('El nombre de la región es requerido');
                    return;
                }
                

                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {

                    console.log(' Modo edición - actualizando región ID:', currentId);
                    patchRegions(currentId, datos)
                        .then(response => {
                            console.log(' Respuesta del servidor (PATCH):', response);
                            console.log(' Status:', response.status);
                            console.log(' StatusText:', response.statusText);
                            
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('regionUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar región:', error);
                            alert('Error al actualizar la región: ' + error.message);
                        });
                } else {
                    console.log(' Modo creación - creando nueva región');
                    postRegions(datos)
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
                            console.log('Región guardada exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            window.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('regionSaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear región:', error.message);
                            alert('Error al crear la región: ' + error.message);
                        });
                }
            } catch (error) {
                console.error('Error en saveData:', error);
                alert('Error inesperado: ' + error.message);
            }
        })
    }


    fillForm = (region) => {
        const frmRegistro = document.querySelector('#frmDataRegion');
        frmRegistro.elements['name'].value = region.name;
        frmRegistro.elements['countryId'].value = region.countryId || '';
        window.viewData(region.id);
        this.disableFrm(false);
        

        window.ctrlBtn(document.querySelector('#btnGuardar').dataset.ed);
    }

    loadCountries = async () => {
        try {
            const countries = await getCountries();
            const countrySelect = document.querySelector('#countryId');
            
            if (countries && countries.length > 0) {
                // Limpiar opciones existentes excepto la primera
                countrySelect.innerHTML = '<option value="">Seleccionar país...</option>';
                
                // Agregar países al selector
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.id;
                    option.textContent = country.name;
                    countrySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando países:', error);
        }
    }

    disableFrm = (estado) => {
        window.disableFrm(estado, '#frmDataRegion');
    }
}

customElements.define('reg-region', RegRegion);
