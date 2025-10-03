import { postCompanies, patchCompanies } from '../../../Apis/company/companyAPI.js';
import { getCountries } from '../../../Apis/country/countryAPI.js';

export class RegCompany extends HTMLElement {
    constructor() {
        super();
        this.render();
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
                @import "./App/Components/companies/companyStyle.css";
            </style>
            <div class="card mt-3">
                <div class="card-header">
                    Registro de Empresas <span class="badge rounded-pill text-bg-primary" id="idView"></span>
                </div>
                <div class="card-body">
                    <form id="frmDataCompany">
                        <div class="row">
                            <div class="col">
                                <label for="name" class="form-label">Nombre de la Empresa</label>
                                <input type="text" class="form-control" id="name" name="name">
                            </div>
                            <div class="col">
                                <label for="UKNiu" class="form-label">UKNiu</label>
                                <input type="text" class="form-control" id="UKNiu" name="UKNiu">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="address" class="form-label">Dirección</label>
                                <textarea class="form-control" id="address" name="address" rows="2"></textarea>
                            </div>
                            <div class="col">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="countryId" class="form-label">País</label>
                                <select class="form-control" id="countryId" name="countryId">
                                    <option value="">Seleccionar país...</option>
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
        const frmRegistro = document.querySelector('#frmDataCompany');
        document.querySelector('#btnGuardar').addEventListener("click", (e) => {
            try {
                e.stopImmediatePropagation();
                e.preventDefault();
                
                const datos = Object.fromEntries(new FormData(frmRegistro).entries());
                console.log(' Guardando empresa:', datos);
                
                // Validar que el nombre no esté vacío
                if (!datos.name || datos.name.trim() === '') {
                    alert('El nombre de la empresa es requerido');
                    return;
                }
                
                // Verificar si está en modo edición (hay un ID en el badge)
                const idView = document.querySelector('#idView');
                const currentId = idView.textContent.trim();
                
                if (currentId) {
                    console.log(' Modo edición - actualizando empresa ID:', currentId);
                    patchCompanies(currentId, datos)
                        .then(response => {
                            console.log(' Respuesta del servidor (PATCH):', response);
                            console.log(' Status:', response.status);
                            console.log(' StatusText:', response.statusText);
                            
                            if (response.ok) {
                                window.resetIdView();
                                this.disableFrm(true);
                                this.ctrlBtn(document.querySelector('#btnNuevo').dataset.ed);
                                // Disparar evento para actualizar listado
                                window.dispatchEvent(new CustomEvent('companyUpdated', { detail: { id: currentId, datos } }));
                            } else {
                                throw new Error(`Error en la solicitud PATCH: ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(error => {
                            console.error('Error al actualizar empresa:', error);
                            alert('Error al actualizar la empresa: ' + error.message);
                        });
                } else {
                    console.log(' Modo creación - creando nueva empresa');
                    postCompanies(datos)
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
                            console.log('Empresa guardada exitosamente:', responseData);
                            this.viewData(responseData.id);
                            this.disableFrm(true);
                            window.ctrlBtn(e.target.dataset.ed);
                            // Disparar evento para actualizar listado
                            window.dispatchEvent(new CustomEvent('companySaved', { detail: responseData }));
                        })
                        .catch(error => {
                            console.error('Error al crear empresa:', error.message);
                            alert('Error al crear la empresa: ' + error.message);
                        });
                }
            } catch (error) {
                console.error('Error en saveData:', error);
                alert('Error inesperado: ' + error.message);
            }
        })
    }


    fillForm = (company) => {
        const frmRegistro = document.querySelector('#frmDataCompany');
        frmRegistro.elements['name'].value = company.name;
        frmRegistro.elements['UKNiu'].value = company.UKNiu;
        frmRegistro.elements['address'].value = company.address;
        frmRegistro.elements['email'].value = company.email;
        frmRegistro.elements['countryId'].value = company.countryId || '';
        window.viewData(company.id);
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
                

                countries.forEach(country => {nt('option');
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
        window.disableFrm(estado, '#frmDataCompany');
    }

}

customElements.define('reg-company', RegCompany);