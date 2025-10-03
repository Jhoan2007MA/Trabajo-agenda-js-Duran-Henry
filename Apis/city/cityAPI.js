// API para ciudades - Funciones para comunicarse con el servidor
const URL_API = "http://localhost:3000/cities";
const headers = { "Content-Type": "application/json" };

// Obtener todas las ciudades del servidor
async function getCities() {
    let response = await fetch(URL_API);
    let cities = await response.json();
    return cities;
}

// Crear una nueva ciudad en el servidor
async function postCities(datos) {
    return await IdManager.createWithSequentialId('cities', datos);
}

// Actualizar una ciudad existente en el servidor
async function patchCities(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Eliminar una ciudad del servidor
async function deleteCities(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getCities,
    postCities,
    patchCities,
    deleteCities
};