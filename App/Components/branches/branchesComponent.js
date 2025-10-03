import './lstBranch.js';
import './regBranch.js';

export class BranchComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>@import "./App/Components/branches/branchStyle.css";</style>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a class="nav-link active mnubranch" href="#" data-verocultar='["#regBranch",["#lstBranch"]]'>Registrar Sucursal</a></li>
                <li class="nav-item"><a class="nav-link mnubranch" href="#" data-verocultar='["#lstBranch",["#regBranch"]]'>Listado de Sucursales</a></li>
            </ul>
            <div class="container" id="regBranch" style="display:block;"><reg-branch></reg-branch></div>
            <div class="container" id="lstBranch" style="display:none;"><lst-branch></lst-branch></div>`;
        window.setupTabNavigation('branch', 'loadBranches');
    }
}

customElements.define('branch-component', BranchComponent);
