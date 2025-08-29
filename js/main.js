// Este código es solo para verificar que la Mini App se carga.
// La lógica de autenticación se agregará en la Fase 3.

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Mini App cargada con éxito.');
    document.querySelector('h1').textContent = 'Bienvenido al Club de Robótica';
    document.querySelector('p').textContent = 'Preparando su dashboard...';
});

// Detectar si la Mini App está en el entorno de Telegram
if (window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    console.log('Telegram WebApp está lista.');
}