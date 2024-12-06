import { pool } from '../database/conection.js'

// Obtener todos los equipos
export const getTeams = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM teams')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los equipos' })
  }
}

// Obtener un equipo por ID
export const getTeamById = async (req, res) => {
  const { teamId } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM teams WHERE team_id = $1', [teamId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener el equipo' })
  }
}

// Insertar un nuevo equipo
export const insertTeam = async (req, res) => {
  const { data } = req.body

  if (!data) {
    return res.status(400).json({ message: 'Data object is missing' })
  }

  const {
    team_name: teamName,
    id_scolor: idScolor,
    id_td: idTd,
    status = true,
    created_at: createdAt = new Date()
  } = data

  if (!teamName || !idScolor || !idTd) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO teams (team_name, id_scolor, id_td, status, created_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [teamName, idScolor, idTd, status, createdAt]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear el equipo' })
  }
}

// Eliminar un equipo por ID
export const deleteTeam = async (req, res) => {
  const { teamId } = req.params

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Borrar relaciones con tablas relacionadas
    await client.query('DELETE FROM team_players WHERE team_id = $1', [teamId])
    await client.query('DELETE FROM champion_teams WHERE team_id = $1', [teamId])

    // Borrar el equipo
    const { rows, rowCount } = await client.query('DELETE FROM teams WHERE team_id = $1 RETURNING *', [teamId])
    if (rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Team not found' })
    }

    await client.query('COMMIT')

    res.json({ message: 'Team deleted successfully', team: rows[0] })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar el equipo' })
  } finally {
    client.release()
  }
}

// Actualizar un equipo por ID
export const updateTeam = async (req, res) => {
  const { teamId } = req.params
  const { data } = req.body

  if (!data) {
    return res.status(400).json({ message: 'Data object is missing' })
  }

  const {
    team_name: teamName,
    id_scolor: idScolor,
    id_td: idTd,
    status = true
  } = data

  if (!teamName || !idScolor || !idTd) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const { rows } = await pool.query(
      `UPDATE teams SET team_name = $1, id_scolor = $2, id_td = $3, status = $4
       WHERE team_id = $5 RETURNING *`,
      [teamName, idScolor, idTd, status, teamId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el equipo' })
  }
}
