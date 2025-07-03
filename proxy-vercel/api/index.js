export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbz8SJUNOUZQDDEl595LspcMTWyhR7FYjqUy2f_ZENYutUhXqz3ho8Rzts9redJU6KUf/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req.body)
        }
      );

      const result = await response.json();
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error: '❌ Error al reenviar al Apps Script', detalle: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
