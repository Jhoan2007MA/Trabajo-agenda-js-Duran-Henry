export class LstContacto extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = /* html */ `
      <style rel="stylesheet">
        @import "./App/Components/contacto/contactoStyle.css";
      </style>
        <div class="card mt-3">
            <div class="card-header">
                Listado de productos
            </div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>     
      `

  }
}

customElements.define("lst-contacto", LstContacto);