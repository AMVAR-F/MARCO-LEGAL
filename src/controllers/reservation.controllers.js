import { pool } from '../database/conection.js'

export const getReservations = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM public.reservation')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener las reservas' })
  }
}

export const getReservationById = async (req, res) => {
  const { reservationId } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM public.reservation WHERE reservation_id = $1', [reservationId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener la reserva' })
  }
}
export const insertReservation = async (req, res) => {
  const { data } = req.body
  // Validar que el objeto data esté definido
  if (!data) {
    return res.status(400).json({ message: 'Data object is missing' })
  }
  // Desestructurar los campos del objeto data
  const { idUser, fieldId, date, startTime, endTime, status = 'Reserved', statusR = true } = data
  // Validación básica de campos requeridos
  if (!idUser || !fieldId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' })
  }
  try {
    const result = await pool.query(
        `INSERT INTO public.reservation (id_user, field_id, date, start_time, end_time, status, status_r) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [idUser, fieldId, date, startTime, endTime, status, statusR])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear la reserva' })
  }
}
export const deleteReservation = async (req, res) => {
  const { reservationId } = req.params

  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const { rows, rowCount } = await client.query('DELETE FROM public.reservation WHERE reservation_id = $1 RETURNING *', [reservationId])
    if (rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Reservation not found' })
    }

    await client.query('COMMIT')
    res.json({ message: 'Reservation deleted successfully', reservation: rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar la reserva' })
  } finally {
    client.release()
  }
}
export const updateReservation = async (req, res) => {
  const { reservationId } = req.params
  const { data } = req.body
  if (!data) {
    return res.status(400).json({ message: 'Data object is missing' })
  }

  const { idUser, fieldId, date, startTime, endTime, status = 'Reserved', statusR = true } = data
  if (!idUser || !fieldId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const { rows } = await pool.query(
        `UPDATE public.reservation 
         SET id_user = $1, field_id = $2, date = $3, start_time = $4, end_time = $5, status = $6, status_r = $7 
         WHERE reservation_id = $8 RETURNING *`, [idUser, fieldId, date, startTime, endTime, status, statusR, reservationId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar la reserva' })
  }
}
