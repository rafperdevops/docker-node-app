const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Conexión a MongoDB
// En esta fase, usamos 'mongodb' como hostname debido al --link
// En fases posteriores, usaremos el nombre del servicio en la red Docker
mongoose.connect('mongodb://mongodb:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

// Definir el esquema y el modelo de Mongoose
const NameSchema = new mongoose.Schema({
    name: String,
    timestamp: { type: Date, default: Date.now }
});
const Name = mongoose.model('Name', NameSchema);

// Rutas de la aplicación
app.get('/', (req, res) => {
    res.send('<h1>¡Bienvenido a la aplicación Docker Node.js!</h1>' +
        '<p>Usa /add?name=TuNombre para añadir un nombre.</p>' +
        '<p>Usa /names para ver todos los nombres.</p>');
});

// Ruta para añadir un nombre
app.get('/add', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).send('Por favor, proporciona un nombre en la URL (ej: /add?name=Juan)');
    }
    try {
        const newName = new Name({ name });
        await newName.save();
        res.send(`Nombre "${name}" guardado exitosamente.`);
    } catch (err) {
        console.error('Error al guardar el nombre:', err);
        res.status(500).send('Error al guardar el nombre.');
    }
});

// Ruta para listar todos los nombres
app.get('/names', async (req, res) => {
    try {
        const names = await Name.find({});
        if (names.length === 0) {
            return res.send('No hay nombres guardados aún. Intenta añadir uno con /add?name=TuNombre');
        }
        let html = '<h1>Nombres Guardados:</h1><ul>';
        names.forEach(n => {
            html += `<li>${n.name} (Añadido el: ${n.timestamp.toLocaleString()})</li>`;
        });
        html += '</ul>';
        res.send(html);
    } catch (err) {
        console.error('Error al obtener nombres:', err);
        res.status(500).send('Error al obtener nombres.');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Aplicación Node.js escuchando en http://localhost:${port}`);
});
