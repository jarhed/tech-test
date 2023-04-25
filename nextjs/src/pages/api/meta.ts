// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const mariadb = require('mariadb')

const config = {
  host: 'db',    
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
    const { filename } = req.body
    let meta_data = null

    try {
      const db = await mariadb.createConnection(config)
      let result = await db.query(`INSERT INTO video_data (filename, meta_data) VALUES ('${filename}','${meta_data}')`)
      res.status(200).json({ status: 'OK' })
    } catch (e) {
      res.status(500).send({ status: JSON.stringify(e) })
    }
  }
}
