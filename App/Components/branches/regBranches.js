import { postBranches, patchBranches } from '../../../Apis/branches/branchAPI.js';
import { getCountries } from '../../../Apis/country/countryAPI.js';
import { getCompanies } from '../../../Apis/company/companyAPI.js';

export class RegBranches extends HTMLElement {
    constructor() {
        super();
        this.render();
        setTimeout(() => {
            this.loadCountries();
            this.loadCompanies();
            this.saveData();
            this.enabledBtns();
            this.disableFrm(true);
        }, 0);
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/branches/branchStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Sucursales <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataBranch">
                        <div class="row">
                            <div class="col">
                                <label for="numberComercial" class="form-label">Número Comercial</label>
                                <input type="text" class="form-control" id="numberComercial" name="numberComercial">
                            </div>
                            <div class="col">
                                <label for="Contact_name" class="form-label">Nombre del Contacto</label>
                                <input type="text" class="form-control" id="Contact_name" name="Contact_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="Address" class="form-label">Dirección</label>
                                <textarea class="form-control" id="Address" name="Address" rows="2"></textarea>
                            </div>
                            <div class="col">
                                <label for="Phone" class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="Phone" name="Phone">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email">
                            </div>
                            <div class="col">
                                <label for="countryId" class="form-label">País</label>
                                <select class="form-control" id="countryId" name="countryId">
                                    <option value="">Seleccionar país...</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="companyId" class="form-label">Empresa</label>
                                <select class="form-control" id="companyId" name="companyId">
                                    <option value="">Seleccionar empresa...</option>
                                </select>
                            </div>
                            <div class="col">
                                <!-- Columna vacía para mantener el layout -->
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
        const frmRegistro = document.querySelector('#frmDataBranch');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log(' Guardando sucursal:', datos);
                
                // Validar que todos los campos sean obligatorios
                if (!datos.numberComercial || datos.numberComercial.trim() === '') {
                    alert('El número comercial es obligatorio');
                    return;
                }
                
                if (!datos.Contact_name || datos.Contact_name.trim() === '') {
                    alert('El nombre del contacto es obligatorio');
                    return;
                }
                
                if (!datos.Address || datos.Address.trim() === '') {
                    alert('La dirección es obligatoria');
                    return;
                }
                
                if (!datos.Phone || datos.Phone.trim() === '') {
                    alert('El teléfono es obligatorio');
                    return;
                }
                
                if (!datos.email || datos.email.trim() === '') {
                    alert('El email es obligatorio');
                    return;
                }
                
                if (!datos.countryId || datos.countryId.trim() === '') {
                    alert('El país es obligatorio');
                    return;
                }
                
                if (!datos.companyId || datos.companyId.trim() === '') {
                    alert('La empresa es obligatoria');
                    return;
                }
                
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    console.log(' Modo edición - actualizando sucursal ID:', currentId);
                    patchBranches(currentId, datos)
                        .then(response => {
                            console.log(' Respuesta del servidor (PATCH):', response);
                            console.log(' Status:', response.status);
                            console.log(' StatusText:', response.statusText);
                            
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('branchUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar sucursal:', error);
                            alert('Error al actualizar la sucursal: ' + error.message);
                        });
                } else {
                    // Modo creación - usar POST
                    console.log(' Modo creación - creando nueva sucursal');
                    postBranches(datos)
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
                            console.log('Sucursal guardada exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            window.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('branchSaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear sucursal:', error.message);
                            alert('Error al crear la sucursal: ' + error.message);
                        });
                }
            } catch (error) {
                console.error('Error en saveData:', error);
                alert('Error inesperado: ' + error.message);
            }
        })
    }


    fillForm = (branch) => {
        const frmRegistro = document.querySelector('#frmDataBranch');
        frmRegistro.elements['numberComercial'].value = branch.numberComercial;
        frmRegistro.elements['Contact_name'].value = branch.Contact_name;
        frmRegistro.elements['Address'].value = branch.Address;
        frmRegistro.elements['Phone'].value = branch.Phone;
        frmRegistro.elements['email'].value = branch.email;
        frmRegistro.elements['countryId'].value = branch.countryId || '';
        frmRegistro.elements['companyId'].value = branch.companyId || '';
        window.viewData(branch.id);
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

    loadCompanies = async () => {
        try {
            const companies = await getCompanies();
            const companySelect = document.querySelector('#companyId');
            
            if (companies && companies.length > 0) {
                // Limpiar opciones existentes excepto la primera
                companySelect.innerHTML = '<option value="">Seleccionar empresa...</option>';
                
                // Agregar empresas al selector
                companies.forEach(company => {
                    const option = document.createElement('option');
                    option.value = company.id;
                    option.textContent = company.name;
                    companySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando empresas:', error);
        }
    }

    disableFrm = (estado) => {
        window.disableFrm(estado, '#frmDataBranch');
    }
}

customElements.define('reg-branches', RegBranches);