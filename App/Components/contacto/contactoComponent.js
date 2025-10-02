import '/App/Components/contacto/regContacto.js';
import '/App/Components/contacto/lstContacto.js';
export class ContactoComponent extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/contacto/contactoStyle.css";
      </style>
      <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active mnucontacto" aria-current="page" href="#" data-verocultar='["#regContacto",["#lstContacto"]]'>Registrar Contacto</a>
      </li>
      <li class="nav-item">
        <a class="nav-link mnucontacto" href="#" data-verocultar='["#lstContacto",["#regContacto"]]'>Listado de contactos</a>
      </li>
    </ul>
    <div class="container" id="regContacto" style="display:block;">
        <reg-contacto></reg-contacto>
    </div>
    <div class="container" id="lstContacto" style="display:none;">
        <lst-contacto></lst-contacto>
    </div>    
    `;
    this.querySelectorAll(".mnucontacto").forEach((val, id) => {
        val.addEventListener("click", (e)=>{
            let data = JSON.parse(e.target.dataset.verocultar);
            let cardVer = document.querySelector(data[0]);
            cardVer.style.display = 'block';
            data[1].forEach(card => {
                let cardActual = document.querySelector(card);
                cardActual.style.display = 'none';
            });
            e.stopImmediatePropagation();
            e.preventDefault();
        })
    });
  }
}

customElements.define("contacto-component", ContactoComponent);