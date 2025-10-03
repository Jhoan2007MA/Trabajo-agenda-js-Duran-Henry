import { getBranches, deleteBranches, patchBranches } from '../../../Apis/branch/branchApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';
import { getCompanies } from '../../../Apis/company/companyApi.js';

export class LstBranch extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        // tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Sucursales</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Número Comercial</th>
                                <th>Nombre Contacto</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>País</th>
                                <th>Empresa</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaBranches">
                            <tr><td colspan="9" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las sucursales
        this.loadBranches();
    }

    async loadBranches() {
        try {
            const [branches, countries, companies] = await Promise.all([
                getBranches(),
                getCountries(),
                getCompanies()
            ]);
            
            const tabla = this.querySelector('#tablaBranches');
            
            if (branches && branches.length > 0) {
                let filas = '';
                branches.forEach(branch => {
                    // Buscar el nombre del país
                    const country = countries.find(c => c.id === branch.countryId);
                    const countryName = country ? country.name : 'No asignado';
                    
                    // Buscar el nombre de la empresa
                    const company = companies.find(c => c.id === branch.companyId);
                    const companyName = company ? company.name : 'No asignada';
                    
                    filas += `
                        <tr data-id="${branch.id}">
                            <td>${branch.id}</td>
                            <td>${branch.numberComercial}</td>
                            <td>${branch.Contact_name}</td>
                            <td>${branch.Address || 'N/A'}</td>
                            <td>${branch.Phone || 'N/A'}</td>
                            <td>${branch.email || 'N/A'}</td>
                            <td>${countryName}</td>
                            <td>${companyName}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-branch" data-id="${branch.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-branch" data-id="${branch.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                tabla.querySelectorAll('.edit-branch').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editBranch(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-branch').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteBranch(e.target.dataset.id));
                });
            } else {
                tabla.innerHTML = '<tr><td colspan="9" class="text-center">No hay sucursales registradas</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando sucursales:', error);
            const tabla = this.querySelector('#tablaBranches');
            tabla.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error al cargar las sucursales</td></tr>';
        }
    }

    async editBranch(id) {
        try {
            const [branches, countries, companies] = await Promise.all([
                getBranches(),
                getCountries(),
                getCompanies()
            ]);
            
            const branch = branches.find(b => b.id == id);
            const fila = this.querySelector(`tr[data-id="${id}"]`);
            
            if (fila && branch) {
                // Convertir celdas en campos editables
                const celdaNumComercial = fila.querySelector('td:nth-child(2)');
                const celdaContacto = fila.querySelector('td:nth-child(3)');
                const celdaDireccion = fila.querySelector('td:nth-child(4)');
                const celdaTelefono = fila.querySelector('td:nth-child(5)');
                const celdaEmail = fila.querySelector('td:nth-child(6)');
                const celdaPais = fila.querySelector('td:nth-child(7)');
                const celdaEmpresa = fila.querySelector('td:nth-child(8)');
                
                celdaNumComercial.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${branch.numberComercial}" 
                           id="edit-numcomercial-${id}">
                `;
                
                celdaContacto.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${branch.Contact_name}" 
                           id="edit-contact-${id}">
                `;
                
                celdaDireccion.innerHTML = `
                    <textarea class="form-control form-control-sm" rows="2" id="edit-address-${id}">${branch.Address || ''}</textarea>
                `;
                
                celdaTelefono.innerHTML = `
                    <input type="tel" class="form-control form-control-sm" value="${branch.Phone || ''}" 
                           id="edit-phone-${id}">
                `;
                
                celdaEmail.innerHTML = `
                    <input type="email" class="form-control form-control-sm" value="${branch.email || ''}" 
                           id="edit-email-${id}">
                `;
                
                let countryOptionsHtml = '<option value="">Seleccionar país...</option>';
                countries.forEach(country => {
                    const selected = country.id === branch.countryId ? 'selected' : '';
                    countryOptionsHtml += `<option value="${country.id}" ${selected}>${country.name}</option>`;
                });
                
                celdaPais.innerHTML = `
                    <select class="form-control form-control-sm" id="edit-country-${id}">
                        ${countryOptionsHtml}
                    </select>
                `;
                
                let companyOptionsHtml = '<option value="">Seleccionar empresa...</option>';
                companies.forEach(company => {
                    const selected = company.id === branch.companyId ? 'selected' : '';
                    companyOptionsHtml += `<option value="${company.id}" ${selected}>${company.name}</option>`;
                });
                
                celdaEmpresa.innerHTML = `
                    <select class="form-control form-control-sm" id="edit-company-${id}">
                        ${companyOptionsHtml}
                    </select>
                `;
                
                // Cambiar los botones de acción
                const celdaAcciones = fila.querySelector('td:nth-child(9)');
                celdaAcciones.innerHTML = `
                    <button class="btn btn-sm btn-success save-branch" data-id="${id}">Guardar</button>
                    <button class="btn btn-sm btn-secondary cancel-edit" data-id="${id}">Cancelar</button>
                `;
                
                // Agregar event listeners a los nuevos botones
                const saveBtn = celdaAcciones.querySelector('.save-branch');
                const cancelBtn = celdaAcciones.querySelector('.cancel-edit');
                
                saveBtn.addEventListener('click', () => this.saveBranch(id));
                cancelBtn.addEventListener('click', () => this.cancelEdit(id));
            }
        } catch (error) {
            console.error('Error editando sucursal:', error);
            alert('Error al cargar los datos para editar');
        }
    }

    cancelEdit(id) {
        this.loadBranches();
    }

    async saveBranch(id) {
        try {
            const inputNumComercial = this.querySelector(`#edit-numcomercial-${id}`);
            const inputContacto = this.querySelector(`#edit-contact-${id}`);
            const inputDireccion = this.querySelector(`#edit-address-${id}`);
            const inputTelefono = this.querySelector(`#edit-phone-${id}`);
            const inputEmail = this.querySelector(`#edit-email-${id}`);
            const selectPais = this.querySelector(`#edit-country-${id}`);
            const selectEmpresa = this.querySelector(`#edit-company-${id}`);
            
            const nuevoNumComercial = inputNumComercial.value.trim();
            const nuevoContacto = inputContacto.value.trim();
            const nuevaDireccion = inputDireccion.value.trim();
            const nuevoTelefono = inputTelefono.value.trim();
            const nuevoEmail = inputEmail.value.trim();
            const nuevoPaisId = selectPais.value;
            const nuevaEmpresaId = selectEmpresa.value;
            
            if (!nuevoNumComercial) {
                alert('El número comercial es obligatorio');
                return;
            }
            
            if (!nuevoContacto) {
                alert('El nombre del contacto es obligatorio');
                return;
            }
            
            if (!nuevaDireccion) {
                alert('La dirección es obligatoria');
                return;
            }
            
            if (!nuevoTelefono) {
                alert('El teléfono es obligatorio');
                return;
            }
            
            if (!nuevoEmail) {
                alert('El email es obligatorio');
                return;
            }
            
            if (!nuevoPaisId) {
                alert('El país es obligatorio');
                return;
            }
            
            if (!nuevaEmpresaId) {
                alert('La empresa es obligatoria');
                return;
            }
            
            // Actualizar la sucursal
            const response = await patchBranches(id, { 
                numberComercial: nuevoNumComercial, 
                Contact_name: nuevoContacto,
                Address: nuevaDireccion,
                Phone: nuevoTelefono,
                email: nuevoEmail,
                countryId: nuevoPaisId,
                companyId: nuevaEmpresaId
            });
            if (response.ok) {
                this.loadBranches();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error guardando sucursal:', error);
            alert('Error al guardar los cambios');
        }
    }

    async deleteBranch(id) {
        const response = await deleteBranches(id);
        if (response.ok) {
            this.loadBranches();
        }
    }

    setupEventListeners() {
        window.addEventListener('branchSaved', () => {
            console.log('Evento branchSaved recibido, actualizando listado...');
            this.loadBranches();
        });

        window.addEventListener('branchUpdated', () => {
            console.log('Evento branchUpdated recibido, actualizando listado...');
            this.loadBranches();
        });

        window.addEventListener('branchDeleted', () => {
            console.log('Evento branchDeleted recibido, actualizando listado...');
            this.loadBranches();
        });
    }
}

customElements.define('lst-branch', LstBranch);