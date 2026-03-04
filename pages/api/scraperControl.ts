import { NextApiRequest, NextApiResponse } from 'next';

let scraperStatus = 'inactive';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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