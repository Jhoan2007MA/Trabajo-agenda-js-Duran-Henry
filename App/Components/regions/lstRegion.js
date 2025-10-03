import { getRegions, deleteRegions, patchRegions } from '../../../Apis/region/regionApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class LstRegion extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        //  tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Regiones</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>País</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaRegions">
                            <tr><td colspan="4" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las regiones
        this.loadRegions();
    }

    async loadRegions() {
        try {
            const [regions, countries] = await Promise.all([
                getRegions(),
                getCountries()
            ]);
            
            const tabla = this.querySelector('#tablaRegions');
            
            if (regions && regions.length > 0) {
                let filas = '';
                regions.forEach(region => {
                    // Buscar el nombre del país
                    const country = countries.find(c => c.id === region.countryId);
                    const countryName = country ? country.name : 'No asignado';
                    
                    filas += `
                        <tr data-id="${region.id}">
                            <td>${region.id}</td>
                            <td>${region.name}</td>
                            <td>${countryName}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-region" data-id="${region.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-region" data-id="${region.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                tabla.querySelectorAll('.edit-region').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editRegion(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-region').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteRegion(e.target.dataset.id));
                });
            } else {
                tabla.innerHTML = '<tr><td colspan="4" class="text-center">No hay regiones registradas</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando regiones:', error);
            const tabla = this.querySelector('#tablaRegions');
            tabla.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar las regiones</td></tr>';
        }
    }

    async editRegion(id) {
        try {
            const [regions, countries] = await Promise.all([
                getRegions(),
                getCountries()
            ]);
            const region = regions.find(r => r.id == id);
            
            // Encontrar la fila correspondiente en la tabla
            const fila = this.querySelector(`tr[data-id="${id}"]`);
            if (fila) {
                // Cambiar las celdas a modo edición
                const celdaNombre = fila.querySelector('td:nth-child(2)');
                const celdaPais = fila.querySelector('td:nth-child(3)');
                const nombreOriginal = region.name;
                const paisOriginal = region.countryId;
                
                celdaNombre.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${nombreOriginal}" 
                           data-original="${nombreOriginal}" id="edit-name-${id}">
                `;
                
                // Crear select para países
                let optionsHtml = '<option value="">Seleccionar país...</option>';
                countries.forEach(country => {
                    const selected = country.id === paisOriginal ? 'selected' : '';
                    optionsHtml += `<option value="${country.id}" ${selected}>${country.name}</option>`;
                });
                
                celdaPais.innerHTML = `
                    <select class="form-control form-control-sm" id="edit-country-${id}" data-original="${paisOriginal}">
                        ${optionsHtml}
                    </select>
                `;
                
                const celdaAcciones = fila.querySelector('td:nth-child(4)');
                celdaAcciones.innerHTML = `
                    <button class="btn btn-sm btn-success save-region" data-id="${id}">Guardar</button>
                    <button class="btn btn-sm btn-secondary cancel-edit" data-id="${id}">Cancelar</button>
                `;
                
                this.querySelector(`.save-region[data-id="${id}"]`).addEventListener('click', (e) => this.saveRegion(e.target.dataset.id));
                this.querySelector(`.cancel-edit[data-id="${id}"]`).addEventListener('click', (e) => this.cancelEdit(e.target.dataset.id));
                
                this.querySelector(`#edit-name-${id}`).focus();
            }
        } catch (error) {
            console.error('Error al obtener región:', error);
            alert('Error al obtener la región');
        }
    }

    async saveRegion(id) {
        try {
            const inputNombre = this.querySelector(`#edit-name-${id}`);
            const selectPais = this.querySelector(`#edit-country-${id}`);
            const nuevoNombre = inputNombre.value.trim();
            const nuevoPaisId = selectPais.value;
            
            if (!nuevoNombre) {
                alert('El nombre de la región no puede estar vacío');
                return;
            }
            
            const response = await patchRegions(id, { name: nuevoNombre, countryId: nuevoPaisId });
            if (response.ok) {
                this.loadRegions();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al guardar región:', error);
            alert('Error al guardar la región: ' + error.message);
        }
    }

    cancelEdit(id) {
        this.loadRegions();
    }

    async deleteRegion(id) {
        try {
            const response = await deleteRegions(id);
            if (response.ok) {
                this.loadRegions();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al eliminar región:', error);
            alert('Error al eliminar la región: ' + error.message);
        }
    }

    setupEventListeners() {
        // Escuchar eventos de guardado, actualización y eliminación
        window.addEventListener('regionSaved', () => {
            console.log('Evento regionSaved recibido, actualizando listado...');
            this.loadRegions();
        });

        window.addEventListener('regionUpdated', () => {
            console.log('Evento regionUpdated recibido, actualizando listado...');
            this.loadRegions();
        });

        window.addEventListener('regionDeleted', () => {
            console.log('Evento regionDeleted recibido, actualizando listado...');
            this.loadRegions();
        });
    }
}

customElements.define('lst-region', LstRegion);