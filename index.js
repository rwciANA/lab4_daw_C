const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// este es el middleware
app.use(express.json()); // para recibir JSON
app.use(express.static('pub')); // archivos cliente

// carpeta donde esta el mark down 
const folder = path.join(__dirname, 'markdowns');

// esta es la ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// listar archibos 
app.get('/files', (req, res) => {
  fs.readdir(folder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo archivos' });
    }

    // solo   mds
    const mdFiles = files.filter(f => f.endsWith('.md'));

    res.json({ files: mdFiles });
  });
});


// es parte de ver contenido 
app.get('/file/:name', (req, res) => {
  const filePath = path.join(folder, req.params.name);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    // convertir markdown básico a HTML (simple)
    const html = data
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\n/g, '<br>');

    res.json({ content: html });
  });
});


// parte de crear archivoo
app.post('/file', (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const filePath = path.join(folder, name + '.md');

  fs.writeFile(filePath, content, err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo guardar' });
    }

    res.json({ message: 'Archivo creado' });
  });
});


// iniciar servidor
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});