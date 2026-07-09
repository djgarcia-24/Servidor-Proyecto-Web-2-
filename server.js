// 1. Importamos las herramientas que compramos
const express = require('express');
const cors = require('cors');

// 2. Inicializamos el servidor
const app = express();
app.use(cors()); // Permite que tu HTML se conecte aquí
app.use(express.json()); // Permite leer la información de los formularios

// 3. Tus usuarios manuales (Nuestra "Base de datos" por ahora)
const usuarios = [
    { email: "admin@correo.com", password: "123" },
    { email: "david@correo.com", password: "456" },
    { email: "invitado@correo.com", password: "789" }
];

// 4. La ruta para iniciar sesión
app.post('/login', (req, res) => {
    const emailRecibido = req.body.email;
    const passwordRecibida = req.body.password;

    // Buscamos si el correo existe en nuestra lista
    const usuarioEncontrado = usuarios.find(u => u.email === emailRecibido);

    if (!usuarioEncontrado) {
        return res.status(401).json({ error: "El correo no existe." });
    }

    if (usuarioEncontrado.password !== passwordRecibida) {
        return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    // Si todo está bien, damos luz verde para que entren a buscar música
    return res.status(200).json({ mensaje: "¡Inicio de sesión exitoso!" });
});

// 5. Encendemos el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});