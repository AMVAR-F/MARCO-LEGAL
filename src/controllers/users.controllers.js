import {pool} from '../database/conection.js'

export const getusers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los usuarios' })
  }
}

export const createusers = async (req, res) => {
  const { idUser } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id_user = $1', [idUser])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener el usuario' })
  }
}
export const insertusers = async (req, res) => {
  const { data } = req.body

  // Validar que el objeto data esté definido
  if (!data) {
    return res.status(400).json({ message: 'Data object is missing' })
  }

  // Desestructurar y mapear los campos del objeto data, con valores predeterminados
  const { firstname, lastname, id_card: idCard, photo = '', password, status = true, email } = data

  // Validación básica de campos requeridos
  if (!firstname || !lastname || !idCard || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // eslint-disable-next-line camelcase
    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, id_card, photo, password, status, email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [firstname, lastname, idCard, photo,password, status, email])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el usuario' })
  }
}

export const deleteusers = async (req, res) => {
  const { idUser } = req.params

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    await client.query('DELETE FROM admins WHERE id_user = $1', [idUser])
    await client.query('DELETE FROM technical_directors WHERE id_user = $1', [idUser])
    await client.query('DELETE FROM treasurers WHERE id_user = $1', [idUser])

    const { rows, rowCount } = await client.query('DELETE FROM users WHERE id_user = $1 RETURNING *', [idUser])
    if (rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'User not found' })
    }

    await client.query('COMMIT')

    res.json({ message: 'User deleted successfully', user: rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  } finally {
    client.release()
  }
}

export const updateusers = async (req, res) => {
  const { idUser } = req.params
  const { data } = req.body
  if (!data) {
    return res.status(400).json({ message: 'Data object is missing' })
  }

  const { firstname, lastname, id_card: idCard, photo = '', password, status = true, email } = data
  if (!firstname || !lastname || !idCard || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' })
  }
  try {
    const { rows } = await pool.query(
        `UPDATE users SET firstname = $1, lastname = $2, id_card = $3, photo = $4, password = $5, status = $6, email = $7 WHERE id_user = $8  
        RETURNING *`, [firstname, lastname, idCard, photo, password, status, email, idUser])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
}
