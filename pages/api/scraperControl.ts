import { NextApiRequest, NextApiResponse } from 'next';

let scraperStatus = 'inactive';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar clave secreta interna
  const apiSecret = process.env.API_SECRET_KEY;
  const providedSecret = req.headers['x-api-secret'];
  if (!apiSecret || providedSecret !== apiSecret) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  if (req.method === 'POST') {
    const { action } = req.body;

    if (action === 'start') {
      scraperStatus = 'active';
      // Logic to start the scraper
      return res.status(200).json({ message: 'Scraper started' });
    }

    if (action === 'stop') {
      scraperStatus = 'inactive';
      // Logic to stop the scraper
      return res.status(200).json({ message: 'Scraper stopped' });
    }

    return res.status(400).json({ message: 'Invalid action' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: scraperStatus });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}