import './lstCompany.js';
import './regCompany.js';

export class CompanyComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>@import "./App/Components/companies/companyStyle.css";</style>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a class="nav-link active mnucompany" href="#" data-verocultar='["#regCompany",["#lstCompany"]]'>Registrar Empresa</a></li>
                <li class="nav-item"><a class="nav-link mnucompany" href="#" data-verocultar='["#lstCompany",["#regCompany"]]'>Listado de Empresas</a></li>
            </ul>
            <div class="container" id="regCompany" style="display:block;"><reg-company></reg-company></div>
            <div class="container" id="lstCompany" style="display:none;"><lst-company></lst-company></div>`;
        window.setupTabNavigation('company', 'loadCompanies');
    }
}

customElements.define('company-component', CompanyComponent);