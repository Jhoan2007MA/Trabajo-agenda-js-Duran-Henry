import './lstCountry.js';
import './regCountry.js';

export class CountryComponent extends HTMLElement {
    constructor() {
        super();
        
        // Crear el HTML del componente
        this.innerHTML = `
            <style>@import "./App/Components/countries/countryStyle.css";</style>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active mnucountry" href="#" data-verocultar='["#regCountry",["#lstCountry"]]'>
                        Registrar País
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mnucountry" href="#" data-verocultar='["#lstCountry",["#regCountry"]]'>
                        Listado de Países
                    </a>
                </li>
            </ul>
            <div class="container" id="regCountry" style="display:block;">
                <reg-country></reg-country>
            </div>
            <div class="container" id="lstCountry" style="display:none;">
                <lst-country></lst-country>
            </div>`;
        
        window.setupTabNavigation('country', 'loadCountries');
    }
}

customElements.define('country-component', CountryComponent);
