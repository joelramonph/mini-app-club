// ----------------------------------------------------
// Simulación de IDs de Telegram para pruebas locales
// ----------------------------------------------------

// Simulador de IDs por rol (puedes cambiarlos para tus pruebas)
const simulatedUsers = {
    Estudiante: 1111111111,
    Padres: 2222222222,
    Profesor: 3333333333
};

// URL de tus flujos de trabajo de n8n
const NGROK_URL = "https://11ee702658ac.ngrok-free.app"; // cambia al tuyo
const AUTH_WEBHOOK_URL = `${NGROK_URL}/webhook/api/v1/auth`;
const DASHBOARD_WEBHOOK_URL = `${NGROK_URL}/webhook/api/v1/dashboard`;

let token = null;
let userRole = null;

// Referencias a los elementos de la interfaz
const roleSelectionScreen = document.getElementById('role-selection-screen');
const loadingMessage = document.getElementById('loading');
const dashboardContent = document.getElementById('dashboard-content');
const errorMessage = document.getElementById('error-message');
const nombreElement = document.getElementById('nombre-estudiante');
const rolElement = document.getElementById('rol-estudiante');
const fechaElement = document.getElementById('fecha-ingreso');

// Botones de roles
const estudianteBtn = document.getElementById('estudiante-btn');
const padresBtn = document.getElementById('padres-btn');
const profesorBtn = document.getElementById('profesor-btn');

// Función para mostrar y ocultar pantallas
function showScreen(screen) {
    roleSelectionScreen.classList.add('hidden');
    loadingMessage.classList.add('hidden');
    dashboardContent.classList.add('hidden');
    errorMessage.classList.add('hidden');

    if (screen === 'loading') {
        loadingMessage.classList.remove('hidden');
    } else if (screen === 'dashboard') {
        dashboardContent.classList.remove('hidden');
    } else if (screen === 'error') {
        errorMessage.classList.remove('hidden');
    } else if (screen === 'selection') {
        roleSelectionScreen.classList.remove('hidden');
    }
}

// ----------------------------------------------------
// Paso 1: Autenticación - Obtener el token JWT
// ----------------------------------------------------
async function authenticateUser(role) {
    try {
        // Obtenemos el ID simulado según el rol
        const telegramUserId = simulatedUsers[role];

        const response = await fetch(AUTH_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramUserId: telegramUserId, role: role })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || 'Error en la autenticación.');
        }

        return data.token; // Retorna el token JWT
    } catch (err) {
        console.error("Error al autenticar:", err);
        return null;
    }
}

// ----------------------------------------------------
// Paso 2: Obtener datos del Dashboard usando el token
// ----------------------------------------------------
async function getDashboardData(userToken) {
    try {
        const response = await fetch(DASHBOARD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || 'Error al obtener los datos del dashboard.');
        }
        return data; // Retorna el JSON limpio
    } catch (err) {
        console.error("Error al obtener datos:", err);
        return null;
    }
}

// ----------------------------------------------------
// Lógica principal
// ----------------------------------------------------
async function init(role) {
    showScreen('loading');

    // 1. Autentica al usuario y obtiene el token
    token = await authenticateUser(role);

    if (token) {
        // 2. Si hay token, obtiene los datos del dashboard
        const userData = await getDashboardData(token);

        if (userData) {
            // 3. Muestra los datos en la interfaz
            nombreElement.textContent = userData.nombre;
            rolElement.textContent = userData.rol;
            fechaElement.textContent = userData.fechaIngreso;
            showScreen('dashboard');
        } else {
            showScreen('error');
        }
    } else {
        showScreen('error');
    }
}

// ----------------------------------------------------
// Asignación de eventos a los botones
// ----------------------------------------------------
estudianteBtn.addEventListener('click', () => init('Estudiante'));
padresBtn.addEventListener('click', () => init('Padres'));
profesorBtn.addEventListener('click', () => init('Profesor'));
