export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://vitaleval.web.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder rápido a preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const urlDestino = 'https://script.google.com/macros/s/AKfycbz8SJUNOUZQDDEl595LspcMTWyhR7FYjqUy2f_ZENYutUhXqz3ho8Rzts9redJU6KUf/exec';

    try {
      // 1. Enviar a Google Sheets
      const respuesta = await fetch(urlDestino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      const datos = await respuesta.json();

      // 2. Enviar mensaje por WhatsApp si es válido
      const telefono = req.body.whatsapp?.toString();
      const nombre = req.body.nombre;

      if (telefono && nombre) {
        const mensajeGupshup = new URLSearchParams({
          channel: 'whatsapp',
          source: '584142605919',
          destination: telefono,
          message: JSON.stringify({
            type: 'template',
            template: {
              namespace: '1c4c440c_6f1f_4964_9da1_7e30519705fb',
              name: 'bienvenida_eval_1',
              language: { code: 'es' },
              components: [
                {
                  type: 'body',
                  parameters: [{ type: 'text', text: nombre }]
                }
              ]
            }
          }),
          'src.name': 'EvalBienestarBot'
        });

        await fetch('https://api.gupshup.io/wa/api/v1/template/msg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': 'sk_b9d0c8439d81424289ca256199905a6c'
          },
          body: mensajeGupshup
        });
      }

      res.status(200).json({ mensaje: '✅ Datos enviados correctamente' });

    } catch (error) {
      res.status(500).json({ error: '❌ Error: ' + error.message });
    }
  } else {
    res.status(405).send('Esta función solo acepta solicitudes POST');
  }
}
