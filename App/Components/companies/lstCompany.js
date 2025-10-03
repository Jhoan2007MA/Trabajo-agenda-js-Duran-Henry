import { getCompanies, deleteCompanies, patchCompanies } from '../../../Apis/company/companyApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class LstCompany extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        //  tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Empresas</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>UKNiu</th>
                                <th>Email</th>
                                <th>País</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCompanies">
                            <tr><td colspan="6" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las empresas
        this.loadCompanies();
    }

    async loadCompanies() {
        try {
            const [companies, countries] = await Promise.all([
                getCompanies(),
                getCountries()
            ]);
            
            const tabla = this.querySelector('#tablaCompanies');
            
            if (companies && companies.length > 0) {
                let filas = '';
                companies.forEach(company => {
                    // Buscar el nombre del país
                    const country = countries.find(c => c.id === company.countryId);
                    const countryName = country ? country.name : 'No asignado';
                    
                    filas += `
                        <tr data-id="${company.id}">
                            <td>${company.id}</td>
                            <td>${company.name}</td>
                            <td>${company.UKNiu}</td>
                            <td>${company.email || 'N/A'}</td>
                            <td>${countryName}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-company" data-id="${company.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-company" data-id="${company.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                tabla.querySelectorAll('.edit-company').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editCompany(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-company').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteCompany(e.target.dataset.id));
                });
            } else {
                tabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay empresas registradas</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando empresas:', error);
            const tabla = this.querySelector('#tablaCompanies');
            tabla.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar las empresas</td></tr>';
        }
    }

    async editCompany(id) {
        try {
            const [companies, countries] = await Promise.all([
                getCompanies(),
                getCountries()
            ]);
            const company = companies.find(c => c.id == id);
            
            // Encontrar la fila correspondiente en la tabla
            const fila = this.querySelector(`tr[data-id="${id}"]`);
            if (fila) {
                // Cambiar las celdas a modo edición
                const celdaNombre = fila.querySelector('td:nth-child(2)');
                const celdaUKNiu = fila.querySelector('td:nth-child(3)');
                const celdaEmail = fila.querySelector('td:nth-child(4)');
                const celdaPais = fila.querySelector('td:nth-child(5)');
                
                celdaNombre.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${company.name}" 
                           id="edit-name-${id}">
                `;
                
                celdaUKNiu.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${company.UKNiu}" 
                           id="edit-ukniu-${id}">
                `;
                
                celdaEmail.innerHTML = `
                    <input type="email" class="form-control form-control-sm" value="${company.email || ''}" 
                           id="edit-email-${id}">
                `;
                
                // Crear select para países
                let optionsHtml = '<option value="">Seleccionar país...</option>';
                countries.forEach(country => {
                    const selected = country.id === company.countryId ? 'selected' : '';
                    optionsHtml += `<option value="${country.id}" ${selected}>${country.name}</option>`;
                });
                
                celdaPais.innerHTML = `
                    <select class="form-control form-control-sm" id="edit-country-${id}">
                        ${optionsHtml}
                    </select>
                `;
                
                const celdaAcciones = fila.querySelector('td:nth-child(6)');
                celdaAcciones.innerHTML = `
                    <button class="btn btn-sm btn-success save-company" data-id="${id}">Guardar</button>
                    <button class="btn btn-sm btn-secondary cancel-edit" data-id="${id}">Cancelar</button>
                `;
                
                this.querySelector(`.save-company[data-id="${id}"]`).addEventListener('click', (e) => this.saveCompany(e.target.dataset.id));
                this.querySelector(`.cancel-edit[data-id="${id}"]`).addEventListener('click', (e) => this.cancelEdit(e.target.dataset.id));
                
                this.querySelector(`#edit-name-${id}`).focus();
            }
        } catch (error) {
            console.error('Error al obtener empresa:', error);
            alert('Error al obtener la empresa');
        }
    }

    async saveCompany(id) {
        try {
            const inputNombre = this.querySelector(`#edit-name-${id}`);
            const inputUKNiu = this.querySelector(`#edit-ukniu-${id}`);
            const inputEmail = this.querySelector(`#edit-email-${id}`);
            const selectPais = this.querySelector(`#edit-country-${id}`);
            
            const nuevoNombre = inputNombre.value.trim();
            const nuevoUKNiu = inputUKNiu.value.trim();
            const nuevoEmail = inputEmail.value.trim();
            const nuevoPaisId = selectPais.value;
            
            if (!nuevoNombre) {
                alert('El nombre de la empresa no puede estar vacío');
                return;
            }
            
            // Actualizar la empresa
            const response = await patchCompanies(id, { 
                name: nuevoNombre, 
                UKNiu: nuevoUKNiu,
                email: nuevoEmail,
                countryId: nuevoPaisId 
            });
            if (response.ok) {
                this.loadCompanies();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al guardar empresa:', error);
            alert('Error al guardar la empresa: ' + error.message);
        }
    }

    cancelEdit(id) {
        this.loadCompanies();
    }

    async deleteCompany(id) {
        try {
            const response = await deleteCompanies(id);
            if (response.ok) {
                this.loadCompanies();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
            alert('Error al eliminar la empresa: ' + error.message);
        }
    }

    setupEventListeners() {
        window.addEventListener('companySaved', () => {
            console.log('Evento companySaved recibido, actualizando listado...');
            this.loadCompanies();
        });

        window.addEventListener('companyUpdated', () => {
            console.log('Evento companyUpdated recibido, actualizando listado...');
            this.loadCompanies();
        });

        window.addEventListener('companyDeleted', () => {
            console.log('Evento companyDeleted recibido, actualizando listado...');
            this.loadCompanies();
        });
    }
}

customElements.define('lst-company', LstCompany);