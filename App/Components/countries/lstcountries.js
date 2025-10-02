import { getCountries, deleteCountries } from '../../../Apis/country/countryApi.js';

export class LstCountry extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Países</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCountries">
                            <tr><td colspan="3" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar los países
        this.loadCountries();
    }

    async loadCountries() {
        try {
            const countries = await getCountries();
            const tabla = this.querySelector('#tablaCountries');
            
            // Si hay países, mostrarlos
            if (countries && countries.length > 0) {
                let filas = '';
                countries.forEach(country => {
                    filas += `
                        <tr>
                            <td>${country.id}</td>
                            <td>${country.name}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-country" data-id="${country.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-country" data-id="${country.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                // Agregar event listeners a los botones
                tabla.querySelectorAll('.edit-country').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editCountry(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-country').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteCountry(e.target.dataset.id));
                });
            } else {
                // Si no hay países, mostrar mensaje
                tabla.innerHTML = '<tr><td colspan="3" class="text-center">No hay países registrados</td></tr>';
            }
        } catch (error) {
            console.error('Error al cargar países:', error);
            const tabla = this.querySelector('#tablaCountries');
            tabla.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar los países</td></tr>';
        }
    }

    async editCountry(id) {
        try {
            const countries = await getCountries();
            const country = countries.find(c => c.id == id);
            
            // Llenar el formulario de registro con los datos
            const regCountry = document.querySelector('reg-country');
            if (regCountry) {
                regCountry.fillForm(country);
                // Cambiar a la pestaña de registro
                document.querySelector('.mnucountry[data-verocultar*="#regCountry"]').click();
            }
        } catch (error) {
            console.error('Error al obtener país:', error);
            alert('Error al obtener el país');
        }
    }

    async deleteCountry(id) {
        try {
            const response = await deleteCountries(id);
            if (response.ok) {
                this.loadCountries(); // Recargar la tabla
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al eliminar país:', error);
            alert('Error al eliminar el país: ' + error.message);
        }
    }
}

customElements.define('lst-country', LstCountry);
