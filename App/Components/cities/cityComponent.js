import './lstCity.js';
import './regCity.js';

export class CityComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>@import "./App/Components/cities/cityStyle.css";</style>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a class="nav-link active mnucity" href="#" data-verocultar='["#regCity",["#lstCity"]]'>Registrar Ciudad</a></li>
                <li class="nav-item"><a class="nav-link mnucity" href="#" data-verocultar='["#lstCity",["#regCity"]]'>Listado de Ciudades</a></li>
            </ul>
            <div class="container" id="regCity" style="display:block;"><reg-city></reg-city></div>
            <div class="container" id="lstCity" style="display:none;"><lst-city></lst-city></div>`;
        window.setupTabNavigation('city', 'loadCities');
    }
}

customElements.define('city-component', CityComponent);
