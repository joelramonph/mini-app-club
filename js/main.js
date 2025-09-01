// Obtiene el ID de usuario de Telegram usando la API de la Mini App
const telegramUserId = Telegram.WebApp.initDataUnsafe.user.id;

// URL de tus flujos de trabajo de n8n

const NGROK_URL = "  https://5587707d1fe6.ngrok-free.app";
 
const AUTH_WEBHOOK_URL = `${NGROK_URL}/webhook/api/v1/auth`;
const DASHBOARD_WEBHOOK_URL = `${NGROK_URL}/webhook/api/v1/dashboard`;
let token = null;

// Referencias a los elementos de la interfaz
const loadingMessage = document.getElementById('loading');
const dashboardContent = document.getElementById('dashboard-content');
const errorMessage = document.getElementById('error-message');
const nombreElement = document.getElementById('nombre-estudiante');
const rolElement = document.getElementById('rol-estudiante');
const fechaElement = document.getElementById('fecha-ingreso');

// Función para mostrar y ocultar mensajes
function showLoading() {
    loadingMessage.classList.remove('hidden');
    dashboardContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function showContent() {
    loadingMessage.classList.add('hidden');
    dashboardContent.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function showError() {
    loadingMessage.classList.add('hidden');
    dashboardContent.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}

// ----------------------------------------------------
// Paso 1: Autenticación - Obtener el token JWT
// ----------------------------------------------------
async function authenticateUser() {
    try {
        const response = await fetch(AUTH_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegramUserId: telegramUserId })
        });

        if (!response.ok) {
            throw new Error('Error en la autenticación.');
        }

        const data = await response.json();
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
                'Authorization': `Bearer ${userToken}` // Envía el token en la cabecera
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del dashboard.');
        }

        const data = await response.json();
        return data; // Retorna el JSON limpio
    } catch (err) {
        console.error("Error al obtener datos:", err);
        return null;
    }
}

// ----------------------------------------------------
// Lógica principal: Iniciar el proceso
// ----------------------------------------------------
async function init() {
    showLoading();

    // 1. Autentica al usuario y obtiene el token
    token = await authenticateUser();
    
    if (token) {
        // 2. Si hay token, obtiene los datos del dashboard
        const studentData = await getDashboardData(token);
        
        if (studentData) {
            // 3. Muestra los datos en la interfaz
            nombreElement.textContent = studentData.nombre;
            rolElement.textContent = studentData.rol;
            fechaElement.textContent = studentData.fechaIngreso;
            showContent();
        } else {
            showError();
        }
    } else {
        showError();
    }
}




// Inicia el proceso cuando la Mini App se carga
init();