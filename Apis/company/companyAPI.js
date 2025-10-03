// API para empresas - Funciones para comunicarse con el servidor
const URL_API = "http://localhost:3000/companies";
const headers = { "Content-Type": "application/json" };

// Obtener todas las empresas del servidor
async function getCompanies() {
    let response = await fetch(URL_API);
    let companies = await response.json();
    return companies;
}

// Crear una nueva empresa en el servidor
async function postCompanies(datos) {
    return await IdManager.createWithSequentialId('companies', datos);
}

// Actualizar una empresa existente en el servidor
async function patchCompanies(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Eliminar una empresa del servidor
async function deleteCompanies(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getCompanies,
    postCompanies,
    patchCompanies,
    deleteCompanies
};