// API para sucursales - Funciones para comunicarse con el servidor
const URL_API = "http://localhost:3000/branches";
const headers = { "Content-Type": "application/json" };

// Obtener todas las sucursales del servidor
async function getBranches() {
    let response = await fetch(URL_API);
    let branches = await response.json();
    return branches;
}

// Crear una nueva sucursal en el servidor
async function postBranches(datos) {
    return await IdManager.createWithSequentialId('branches', datos);
}

// Actualizar una sucursal existente en el servidor
async function patchBranches(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Eliminar una sucursal del servidor
async function deleteBranches(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getBranches,
    postBranches,
    patchBranches,
    deleteBranches
};