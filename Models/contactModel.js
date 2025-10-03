
export class CountryModel {
    constructor() {
        this.countries = [];
        this.loadFromStorage();
    }
    loadFromStorage() {
        const stored = localStorage.getItem('countries');
        if (stored) {
            this.countries = JSON.parse(stored);
        }
    }

    saveToStorage() {
        localStorage.setItem('countries', JSON.stringify(this.countries));
    }

    // Obtener todos los países
    getAllCountries() {
        return this.countries;
    }

    // Obtener país por ID
    getCountryById(id) {
        return this.countries.find(country => country.id === id);
    }

    // Agregar nuevo país
    addCountry(countryData) {
        const newCountry = {
            id: this.generateId(),
            ...countryData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.countries.push(newCountry);
        this.saveToStorage();
        return newCountry;
    }

    // Actualizar país
    updateCountry(id, countryData) {
        const index = this.countries.findIndex(country => country.id === id);
        if (index !== -1) {
            this.countries[index] = {
                ...this.countries[index],
                ...countryData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            return this.countries[index];
        }
        return null;
    }

    // Eliminar país
    deleteCountry(id) {
        const index = this.countries.findIndex(country => country.id === id);
        if (index !== -1) {
            const deletedCountry = this.countries.splice(index, 1)[0];
            this.saveToStorage();
            return deletedCountry;
        }
        return null;
    }

    // Buscar países por nombre
    searchCountries(query) {
        return this.countries.filter(country => 
            country.name.toLowerCase().includes(query.toLowerCase()) ||
            country.code.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Validar datos de país
    validateCountryData(countryData) {
        const errors = [];

        if (!countryData.name || countryData.name.trim() === '') {
            errors.push('El nombre del país es requerido');
        }

        if (!countryData.code || countryData.code.trim() === '') {
            errors.push('El código del país es requerido');
        }

        if (countryData.code && countryData.code.length > 3) {
            errors.push('El código del país no puede tener más de 3 caracteres');
        }

        // Verificar si ya existe un país con el mismo nombre.
        const existingCountry = this.countries.find(country => 
            country.name.toLowerCase() === countryData.name.toLowerCase() ||
            country.code.toLowerCase() === countryData.code.toLowerCase()
        );

        if (existingCountry) {
            errors.push('Ya existe un país con este nombre o código');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}