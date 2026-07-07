<?php
// router.php — Router para el servidor built-in de PHP en Railway
// Enruta peticiones /api/* al controlador principal index.php
// Sirve archivos estáticos (.html, .css, .js, imágenes) directamente

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Si es una petición a la API, enrutar a index.php (router PHP del backend)
if (strpos($uri, '/api/') === 0) {
    require __DIR__ . '/index.php';
    return;
}

// Si el archivo estático existe en /public/, servirlo directamente
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; // El servidor built-in de PHP lo sirve automáticamente
}

// Por defecto, servir index.html (SPA)
if (file_exists(__DIR__ . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    return;
}

http_response_code(404);
echo '404 Not Found';
