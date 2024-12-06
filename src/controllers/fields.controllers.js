import { pool } from '../database/conection.js'

// Obtener todos los campos
export const getFields = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM public.field')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los campos' })
  }
}

// Obtener un campo por ID
export const getFieldById = async (req, res) => {
  const { fieldId } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM public.field WHERE field_id = $1', [fieldId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Campo no encontrado' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener el campo' })
  }
}

// Insertar un nuevo campo
export const insertField = async (req, res) => {
  const { data } = req.body
  if (!data) {
    return res.status(400).json({ message: 'Falta el objeto data' })
  }

  const { name, pricePerHour, status = true } = data
  if (!name || !pricePerHour) {
    return res.status(400).json({ message: 'Faltan campos requeridos' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.field (name, price_per_hour, status) 
       VALUES ($1, $2, $3) RETURNING *`, [name, pricePerHour, status])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el campo' })
  }
}

// Eliminar un campo por ID
export const deleteField = async (req, res) => {
  const { fieldId } = req.params

  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const { rows, rowCount } = await client.query('DELETE FROM public.field WHERE field_id = $1 RETURNING *', [fieldId])
    if (rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Campo no encontrado' })
    }

    await client.query('COMMIT')
    res.json({ message: 'Campo eliminado con éxito', field: rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el campo' })
  } finally {
    client.release()
  }
}

// Actualizar un campo por ID
export const updateField = async (req, res) => {
  const { fieldId } = req.params
  const { data } = req.body
  if (!data) {
    return res.status(400).json({ message: 'Falta el objeto data' })
  }

  const { name, pricePerHour, status = true } = data
  if (!name || !pricePerHour) {
    return res.status(400).json({ message: 'Faltan campos requeridos' })
  }

  try {
    const { rows } = await pool.query(
      `UPDATE public.field 
       SET name = $1, price_per_hour = $2, status = $3 
       WHERE field_id = $4 RETURNING *`, [name, pricePerHour, status, fieldId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Campo no encontrado' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el campo' })
  }
}
