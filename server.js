const express = require('express');
const cors = require('cors');

//inicializacion
const app = express();
app.use(cors()); // Permite que tu HTML se conecte aquí
app.use(express.json()); // Permite leer la información de los formularios

// usuarios
const usuarios = [
    { email: "admin@correo.com", password: "123" },
    { email: "david@correo.com", password: "456" },
    { email: "invitado@correo.com", password: "789" }
];

// permite el inicio de sesion
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    //funcion que itera sobre los usuarios
    const usuarioEncontrado = usuarios.find(u => u.email === email);

    if (!usuarioEncontrado) {
        return res.status(401).json({ error: "El correo no existe." });
    }

    if (usuarioEncontrado.password !== password) {
        return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    return res.status(200).json({ mensaje: "¡Inicio de sesión exitoso!" });
});


//encendido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});
