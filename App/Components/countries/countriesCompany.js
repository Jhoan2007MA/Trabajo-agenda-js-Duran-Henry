import './lstcountries.js';
import './regcontries.js';

export class CountryComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/countries/countryStyle.css";
            </style>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active mnucountry" aria-current="page" href="#" data-verocultar='["#regCountry",["#lstCountry"]]'>Registrar País</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mnucountry" href="#" data-verocultar='["#lstCountry",["#regCountry"]]'>Listado de Países</a>
                </li>
            </ul>
            <div class="container" id="regCountry" style="display:block;">
                <reg-country></reg-country>
            </div>
            <div class="container" id="lstCountry" style="display:none;">
                <lst-country></lst-country>
            </div>    
        `;
        this.querySelectorAll(".mnucountry").forEach((val, id) => {
            val.addEventListener("click", (e) => {
                let data = JSON.parse(e.target.dataset.verocultar);
                let cardVer = document.querySelector(data[0]);
                cardVer.style.display = 'block';
                data[1].forEach(card => {
                    let cardActual = document.querySelector(card);
                    cardActual.style.display = 'none';
                });

                // Recargar listado cuando se hace clic en la pestaña
                if (data[0] === '#lstCountry') {
                    const lstCountry = document.querySelector('lst-country');
                    if (lstCountry) {
                        lstCountry.loadCountries();
                    }
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            })
        });
    }
}

customElements.define('country-component', CountryComponent);
