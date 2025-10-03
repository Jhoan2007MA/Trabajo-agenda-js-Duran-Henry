// API para países - Funciones para comunicarse con el servidor
const URL_API = "http://localhost:3000/countries";
const headers = { "Content-Type": "application/json" };

// Obtener todos los países del servidor
async function getCountries() {
    let response = await fetch(URL_API);
    let countries = await response.json();
    return countries;
}

// Crear un nuevo país en el servidor
async function postCountries(datos) {
    return await IdManager.createWithSequentialId('countries', datos);
}

// Actualizar un país existente en el servidor
async function patchCountries(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Eliminar un país del servidor
async function deleteCountries(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getCountries,
    postCountries,
    patchCountries,
    deleteCountries
};