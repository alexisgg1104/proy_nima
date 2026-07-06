// SAII - Cliente de API REST asíncrono
// ============================================

const APIClient = {
    // Resolver dinámicamente la URL base de la API REST
    getBaseURL: function() {
        const origin = window.location.origin;
        let path = window.location.pathname;

        // Quitar index.html del final si está presente
        if (path.endsWith('/index.html')) {
            path = path.slice(0, -11);
        } else if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Quitar /public del final si está presente
        if (path.endsWith('/public')) {
            path = path.slice(0, -7);
        }

        // Redireccionar a PHP en puerto 8000 si se corre desde puerto 3000 de Next.js
        if (origin.includes(':3000')) {
            const hostname = window.location.hostname;
            return `http://${hostname}:8000/api`;
        }

        return origin + path + '/api';
    },

    csrfToken: null,

    // Obtener el token CSRF desde el servidor de forma asíncrona
    fetchCSRFToken: async function() {
        if (this.csrfToken) return this.csrfToken;
        try {
            // Hacemos una petición directa usando fetch tradicional para evitar recursión infinita
            const url = this.getBaseURL() + '/auth/csrf';
            const response = await fetch(url, { credentials: 'include' });
            const data = await response.json().catch(() => null);
            if (data && data.status === 'success' && data.data && data.data.csrfToken) {
                this.csrfToken = data.data.csrfToken;
            }
            return this.csrfToken;
        } catch (e) {
            console.error("Error al obtener token CSRF del backend", e);
            return null;
        }
    },

    // Realizar peticiones asíncronas con credenciales (para cookies de sesión)
    request: async function(endpoint, options = {}) {
        const method = (options.method || 'GET').toUpperCase();

        // Si se realiza una acción que modifica estado, asegurar que tenemos el token CSRF
        if (['POST', 'PUT', 'DELETE'].includes(method) && endpoint !== '/auth/csrf') {
            if (!this.csrfToken) {
                await this.fetchCSRFToken();
            }
        }

        const url = this.getBaseURL() + endpoint;
        
        // Incluir credenciales de cookies para mantener sesiones nativas de PHP
        options.credentials = 'include';

        if (options.body && typeof options.body === 'object') {
            options.headers = options.headers || {};
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }

        // Si tenemos token CSRF y es una acción modificadora de estado, enviarla en cabeceras
        if (this.csrfToken && ['POST', 'PUT', 'DELETE'].includes(method)) {
            options.headers = options.headers || {};
            options.headers['X-CSRF-TOKEN'] = this.csrfToken;
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json().catch(() => null);

            if (!response.ok) {
                // Manejar error de sesión expirada o no autenticada globalmente
                if (response.status === 401) {
                    localStorage.removeItem('saii_currentUser');
                    this.csrfToken = null; // Limpiar token al expirar sesión
                    // Redirigir a login
                    const loginScreen = document.getElementById('loginScreen');
                    const appContainer = document.getElementById('appContainer');
                    if (loginScreen && appContainer) {
                        loginScreen.style.display = 'flex';
                        appContainer.style.display = 'none';
                    }
                }
                const errMsg = (data && data.message) ? data.message : 'Error en la petición del servidor.';
                throw new Error(errMsg);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
