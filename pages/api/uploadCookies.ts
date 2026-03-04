import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadPath = path.join(process.cwd(), 'uploads', 'cookies.json');

    try {
      fs.writeFileSync(uploadPath, file);
      return res.status(200).json({ message: 'Cookies uploaded successfully' });
    } catch (error) {
      console.error('Error saving cookies:', error);
      return res.status(500).json({ message: 'Error saving cookies' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}