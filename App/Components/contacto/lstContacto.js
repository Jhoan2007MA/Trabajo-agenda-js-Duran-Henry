import {getContacts} from '../../../Apis/contact/contactApi.js';

export class LstContacto extends HTMLElement {
  constructor() {
    super();
    this.mostrarPagina();
  }

  async mostrarPagina() {
    // Crear la tabla HTML
    this.innerHTML = `
      <div class="card mt-3">
        <div class="card-header">Listado de Contactos</div>
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Celular</th>
                <th>Email</th>
                <th>Residencia</th>
              </tr>
            </thead>
            <tbody id="tablaContactos">
              <tr><td colspan="5" class="text-center">Cargando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Cargar los contactos
    this.loadContacts();
  }

  async loadContacts() {
    // Traer contactos de la API
    const contactos = await getContacts();
    const tabla = this.querySelector('#tablaContactos');
    
    // Si hay contactos, mostrarlos
    if (contactos && contactos.length > 0) {
        let filas = '';
        contactos.forEach(contacto => {
            filas += `
              <tr style="cursor: pointer;" onclick="cargarContactoParaEditar('${contacto.id}')">
                <td>${contacto.nombreContacto}</td>
                <td>${contacto.apellidoContacto}</td>
                <td>${contacto.nroCelular}</td>
                <td>${contacto.emailContacto}</td>
                <td>${contacto.nroResidencia}</td>
              </tr>
            `;
        });
        tabla.innerHTML = filas;
    } else {
        // Si no hay contactos, mostrar mensaje
        tabla.innerHTML = '<tr><td colspan="5" class="text-center">No hay contactos</td></tr>';
    }
  }
}

// Función global para cargar contacto para editar
window.cargarContactoParaEditar = async (id) => {
    try {
        const regTab = document.querySelector('.mnucontacto[data-verocultar*="regContacto"]');
        if (regTab) {
            regTab.click();
        }
        
        const contactos = await getContacts();
        const contacto = contactos.find(c => c.id === id);
        
        if (contacto) {
            const form = document.querySelector('#frmDataContacto');
            if (form) {
                form.elements['nombreContacto'].value = contacto.nombreContacto || '';
                form.elements['apellidoContacto'].value = contacto.apellidoContacto || '';
                form.elements['nroCelular'].value = contacto.nroCelular || '';
                form.elements['emailContacto'].value = contacto.emailContacto || '';
                form.elements['nroResidencia'].value = contacto.nroResidencia || '';
                
                const idView = document.querySelector('#idView');
                if (idView) {
                    idView.innerHTML = id;
                }
                
                const regComponent = document.querySelector('reg-contacto');
                if (regComponent) {
                    regComponent.disableFrm(false);
                    regComponent.ctrlBtn('[["#btnEditar","#btnEliminar","#btnGuardar"],["#btnCancelar","#btnNuevo"]]');
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar contacto para editar:', error);
    }
};

customElements.define("lst-contacto", LstContacto);