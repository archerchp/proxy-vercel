export default async function handler(req, res) {
  if (req.method === 'POST') {
    const urlDestino = 'https://script.google.com/macros/s/AKfycbz8SJUNOUZQDDEl595LspcMTWyhR7FYjqUy2f_ZENYutUhXqz3ho8Rzts9redJU6KUf/exec';

    try {
      const respuesta = await fetch(urlDestino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      const datos = await respuesta.json();
      res.status(200).json(datos);
    } catch (error) {
      res.status(500).json({ error: '❌ Error al reenviar datos al script: ' + error.message });
    }
  } else {
    res.status(405).send('Esta función solo acepta solicitudes POST');
  }
}
