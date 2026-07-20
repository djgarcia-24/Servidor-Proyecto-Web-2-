const express = require('express');
const cors = require('cors');

//inicializacion
const app = express();
app.use(cors()); // Permite que tu HTML se conecte aquí
app.use(express.json()); // Permite leer la información de los formularios

// Ruta raíz para responder a peticiones de latido (heartbeat) y verificar conexión sin arrojar error 404
app.get('/', (req, res) => {
    res.status(200).json({ status: "OK", message: "Servidor en funcionamiento" });
});

// usuarios
const usuarios = [
    //cada usuario tendra un token de sesion diferente, contrasena, email y favoritos vacios que el server recordara hasta que este se apague
    { token: 111, email: "admin@correo.com", password: "123", favoritos: [] },
    { token: 222, email: "david@correo.com", password: "456" , favoritos: [] },
    { token: 333, email: "invitado@correo.com", password: "789" , favoritos: []}
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

    return res.status(200).json({ mensaje: "¡Inicio de sesión exitoso!", token: usuarioEncontrado.token });
});



// FUNCIÓN AUXILIAR: Extraer el token numérico de la petición
function obtenerUsuarioAutenticado(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    // El frontend mandará: "Authorization: Bearer 111"
    const tokenString = authHeader.split(" ")[1]; // Extraemos el "111" (como texto)
    const tokenNumero = parseInt(tokenString); // Lo convertimos a número

    // Buscamos al usuario que tenga ese número exacto
    return usuarios.find(u => u.token === tokenNumero);
}

// --- RUTA RENOMBRADA: OBTENER FAVORITOS ---
app.get('/obtenerFavoritos', (req, res) => {
    const usuario = obtenerUsuarioAutenticado(req);
    if (!usuario) return res.status(401).json({ error: "No autorizado. Token inválido o ausente." });
    
    res.json(usuario.favoritos); // Le devuelve sus favoritos
});

// --- RUTA: REEMPLAZAR TODOS LOS FAVORITOS ---
app.put('/favoritos', (req, res) => {
    const usuario = obtenerUsuarioAutenticado(req);
    if (!usuario) return res.status(401).json({ error: "No autorizado." });

    usuario.favoritos = req.body; 
    res.json({ mensaje: "Lista de favoritos reemplazada", favoritos: usuario.favoritos });
});

// --- RUTA: BORRAR UN FAVORITO ---
app.delete('/favoritos/:id', (req, res) => {
    const usuario = obtenerUsuarioAutenticado(req);
    if (!usuario) return res.status(401).json({ error: "No autorizado." });

    const idABorrar = req.params.id;
    usuario.favoritos = usuario.favoritos.filter(fav => String(fav.id) !== idABorrar);

    res.json({ mensaje: "Favorito eliminado", favoritos: usuario.favoritos });
});




// --- RUTA: AÑADIR O ACTUALIZAR UN FAVORITO ---
app.post('/favoritos', (req, res) => {
    const usuario = obtenerUsuarioAutenticado(req);
    if (!usuario) return res.status(401).json({ error: "No autorizado." });

    const nuevoFavorito = req.body;
    
    // Buscar si ya existe para actualizarlo o agregarlo si es nuevo
    const indiceExiste = usuario.favoritos.findIndex(fav => String(fav.id) === String(nuevoFavorito.id));
    if (indiceExiste > -1) {
        usuario.favoritos[indiceExiste] = nuevoFavorito;
    } else {
        usuario.favoritos.push(nuevoFavorito);
    }

    res.json({ mensaje: "Favorito procesado con éxito", favoritos: usuario.favoritos });
});








//encendido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor encendido y escuchando en el puerto ${PORT}`);
});
