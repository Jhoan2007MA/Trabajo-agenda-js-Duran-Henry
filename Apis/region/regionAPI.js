// API para regiones - Funciones para comunicarse con el servidor
const URL_API = "http://localhost:3000/region";
const headers = { "Content-Type": "application/json" };

// Obtener todas las regiones del servidor
async function getRegions() {
    let response = await fetch(URL_API);
    let regions = await response.json();
    return regions;
}

// Crear una nueva región en el servidor
async function postRegions(datos) {
    return await IdManager.createWithSequentialId('regions', datos);
}

// Actualizar una región existente en el servidor
async function patchRegions(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Eliminar una región del servidor
async function deleteRegions(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getRegions,
    postRegions,
    patchRegions,
    deleteRegions
};