// 🔹 listar archivos
function cargarArchivos() {
  fetch('/files')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista');
      lista.innerHTML = '';

      data.files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;

        li.onclick = () => verArchivo(file);

        lista.appendChild(li);
      });
    });
}


// 🔹 ver archivo
function verArchivo(nombre) {
  fetch('/file/' + nombre)
    .then(res => res.json())
    .then(data => {
      document.getElementById('contenido').innerHTML = data.content;
    });
}


// 🔹 crear archivo
function crearArchivo() {
  const nombre = document.getElementById('nombre').value;
  const texto = document.getElementById('texto').value;

  fetch('/file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: nombre,
      content: texto
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    cargarArchivos();
  });
}