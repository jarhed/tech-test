// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const mariadb = require('mariadb')

const config = {
  host: process.env.MYSQL_HOST,    
  database: process.env.MYSQL_DATABASE,    
  user: process.env.MYSQL_USER,    
  password: process.env.MYSQL_PASSWORD
}

type Data = {
  status?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { filename, meta_data } = req.body

    try {
      const db = await mariadb.createConnection(config)
      let result = await db.query(`INSERT INTO video_data (filename, meta_data) VALUES (?,?)`, [filename, JSON.stringify(meta_data)])
      res.status(200).json({ status: 'OK' })
    } catch (e) {
      res.status(500).send({ status: JSON.stringify(e) })
    }
  }
}
