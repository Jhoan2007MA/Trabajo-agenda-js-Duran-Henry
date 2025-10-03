📒 Agenda en JavaScript
📌 Descripción

Este proyecto es una aplicación de agenda digital desarrollada con JavaScript, HTML y CSS, diseñada para la gestión de información empresarial y de contactos.
Permite registrar, listar, editar y eliminar entidades como:

🌍 Países y regiones

🏙️ Ciudades

🏢 Compañías y sucursales

👤 Contactos

Está organizado de manera modular, separando componentes y estilos, lo cual facilita la escalabilidad del proyecto.

🚀 Instalación y ejecución
1. Clonar repositorio
git clone <URL_DEL_REPOSITORIO>
cd Trabajo-agenda-js-Duran-Henry-main

2. Instalar dependencias

El proyecto utiliza principalmente Bootstrap (incluido en la carpeta css/ y js/).
Si deseas correrlo con un servidor local:

npm install -g serve
serve .

3. Abrir la aplicación

Abre el archivo index.html directamente en tu navegador o

Usa un servidor local para que db.json pueda ser consumido como API (ejemplo con json-server):

npm install -g json-server
json-server --watch db.json --port 3000


Esto expondrá un servidor fake REST en:

http://localhost:3000

📂 Estructura del proyecto
Trabajo-agenda-js-Duran-Henry-main/
│── index.html            # Página principal de la aplicación
│── app.js                # Script raíz de la lógica
│── db.json               # Base de datos simulada (JSON Server)
│
├── Apis/
│   └── contact/
│       └── contactApi.js # Lógica de API para contactos
│
├── App/
│   └── Components/
│       ├── branches/     # Módulo de sucursales
│       ├── cities/       # Módulo de ciudades
│       ├── companies/    # Módulo de compañías
│       ├── countries/    # Módulo de países
│       ├── regions/      # Módulo de regiones
│       └── navMenu/      # Menú de navegación
│
├── Models/
│   └── contactModel.js   # Modelo de datos para contactos
│
├── css/
│   └── bootstrap/        # Estilos de Bootstrap
│
└── js/
    └── bootstrap/        # Scripts de Bootstrap

🧩 Componentes principales
📍 Países y Regiones

countryComponent.js y regionComponent.js: gestionan la creación y listado.

lstCountry.js, lstRegion.js: muestran listas en tablas dinámicas.

regCountry.js, regRegion.js: permiten registrar nuevos elementos.

Estilos propios en countryStyle.css y regionStyle.css.

🏙️ Ciudades

cityComponent.js: vista principal.

lstCity.js: listado de ciudades.

regCity.js: formulario de registro.

cityStyle.css: estilos de interfaz.

🏢 Compañías y Sucursales

companyComponent.js y branchesComponent.js: vistas principales.

lstCompany.js, lstBranches.js: listados dinámicos.

regCompany.js, regBranches.js: registro de nuevos datos.

Estilos: companyStyle.css y branchesStyle.css.

👤 Contactos

contactApi.js: comunicación con la API simulada (db.json).

contactModel.js: definición de estructura de un contacto.

Funcionalidades: crear, leer, actualizar, eliminar (CRUD).

🧭 Menú de navegación

navMenu.js: genera dinámicamente el menú de la aplicación.

menuStyle.css: estilos del menú.

🛠️ Tecnologías utilizadas

HTML5

CSS3 + Bootstrap 5

JavaScript (ES6)

JSON Server (para simular una API REST)