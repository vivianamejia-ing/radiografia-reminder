document.getElementById('citaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    fecha: document.getElementById('fecha').value
  };

  const res = await fetch('https://radiografia-backend.onrender.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Cita guardada correctamente. Se enviará recordatorio.');
  } else {
    alert('Hubo un error al guardar la cita.');
  }
});
