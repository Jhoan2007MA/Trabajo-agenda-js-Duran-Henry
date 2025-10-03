import './lstRegion.js';
import './regRegion.js';

export class RegionComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>@import "./App/Components/regions/regionStyle.css";</style>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a class="nav-link active mnuregion" href="#" data-verocultar='["#regRegion",["#lstRegion"]]'>Registrar Región</a></li>
                <li class="nav-item"><a class="nav-link mnuregion" href="#" data-verocultar='["#lstRegion",["#regRegion"]]'>Listado de Regiones</a></li>
            </ul>
            <div class="container" id="regRegion" style="display:block;"><reg-region></reg-region></div>
            <div class="container" id="lstRegion" style="display:none;"><lst-region></lst-region></div>`;
        window.setupTabNavigation('region', 'loadRegions');
    }
}

customElements.define('region-component', RegionComponent);