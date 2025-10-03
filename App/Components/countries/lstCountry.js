import { getCities, deleteCities, patchCities } from '../../../Apis/city/cityApi.js';
import { getRegions } from '../../../Apis/region/regionApi.js';

export class LstCity extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Ciudades</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Región</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCities">
                            <tr><td colspan="4" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las ciudades
        this.loadCities();
    }

    async loadCities() {
        try {
            const [cities, regions] = await Promise.all([
                getCities(),
                getRegions()
            ]);
            
            const tabla = this.querySelector('#tablaCities');
            
            if (cities && cities.length > 0) {
                let filas = '';
                cities.forEach(city => {
                    // Buscar el nombre de la región
                    const region = regions.find(r => r.id === city.regionId);
                    const regionName = region ? region.name : 'No asignada';
                    
                    filas += `
                        <tr data-id="${city.id}">
                            <td>${city.id}</td>
                            <td>${city.name}</td>
                            <td>${regionName}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-city" data-id="${city.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-city" data-id="${city.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                tabla.querySelectorAll('.edit-city').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editCity(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-city').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteCity(e.target.dataset.id));
                });
            } else {
                tabla.innerHTML = '<tr><td colspan="4" class="text-center">No hay ciudades registradas</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando ciudades:', error);
            const tabla = this.querySelector('#tablaCities');
            tabla.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar las ciudades</td></tr>';
        }
    }

    async editCity(id) {
        try {
            const [cities, regions] = await Promise.all([
                getCities(),
                getRegions()
            ]);
            const city = cities.find(c => c.id == id);
            
            // Encontrar la fila correspondiente en la tabla
            const fila = this.querySelector(`tr[data-id="${id}"]`);
            if (fila) {
                const celdaNombre = fila.querySelector('td:nth-child(2)');
                const celdaRegion = fila.querySelector('td:nth-child(3)');
                const nombreOriginal = city.name;
                const regionOriginal = city.regionId;
                
                celdaNombre.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${nombreOriginal}" 
                           data-original="${nombreOriginal}" id="edit-name-${id}">
                `;
                
                let optionsHtml = '<option value="">Seleccionar región...</option>';
                regions.forEach(region => {
                    const selected = region.id === regionOriginal ? 'selected' : '';
                    optionsHtml += `<option value="${region.id}" ${selected}>${region.name}</option>`;
                });
                
                celdaRegion.innerHTML = `
                    <select class="form-control form-control-sm" id="edit-region-${id}" data-original="${regionOriginal}">
                        ${optionsHtml}
                    </select>
                `;
                
                const celdaAcciones = fila.querySelector('td:nth-child(4)');
                celdaAcciones.innerHTML = `
                    <button class="btn btn-sm btn-success save-city" data-id="${id}">Guardar</button>
                    <button class="btn btn-sm btn-secondary cancel-edit" data-id="${id}">Cancelar</button>
                `;
                
                this.querySelector(`.save-city[data-id="${id}"]`).addEventListener('click', (e) => this.saveCity(e.target.dataset.id));
                this.querySelector(`.cancel-edit[data-id="${id}"]`).addEventListener('click', (e) => this.cancelEdit(e.target.dataset.id));
                
                this.querySelector(`#edit-name-${id}`).focus();
            }
        } catch (error) {
            console.error('Error al obtener ciudad:', error);
            alert('Error al obtener la ciudad');
        }
    }

    async saveCity(id) {
        try {
            const inputNombre = this.querySelector(`#edit-name-${id}`);
            const selectRegion = this.querySelector(`#edit-region-${id}`);
            const nuevoNombre = inputNombre.value.trim();
            const nuevaRegionId = selectRegion.value;
            
            if (!nuevoNombre) {
                alert('El nombre de la ciudad no puede estar vacío');
                return;
            }
            
            // Actualizar la ciudad
            const response = await patchCities(id, { name: nuevoNombre, regionId: nuevaRegionId });
            if (response.ok) {
                this.loadCities();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al guardar ciudad:', error);
            alert('Error al guardar la ciudad: ' + error.message);
        }
    }

    cancelEdit(id) {
        // Recargar la tabla para volver al estado normal
        this.loadCities();
    }

    async deleteCity(id) {
        try {
            const response = await deleteCities(id);
            if (response.ok) {
                this.loadCities();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al eliminar ciudad:', error);
            alert('Error al eliminar la ciudad: ' + error.message);
        }
    }

    setupEventListeners() {
        // Escuchar eventos de guardado, actualización y eliminación
        window.addEventListener('citySaved', () => {
            console.log('Evento citySaved recibido, actualizando listado...');
            this.loadCities();
        });

        window.addEventListener('cityUpdated', () => {
            console.log('Evento cityUpdated recibido, actualizando listado...');
            this.loadCities();
        });

        window.addEventListener('cityDeleted', () => {
            console.log('Evento cityDeleted recibido, actualizando listado...');
            this.loadCities();
        });
    }
}

customElements.define('lst-city', LstCity);