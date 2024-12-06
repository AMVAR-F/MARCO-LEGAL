import { Router } from 'express'

import { deleteTeam, getTeamById, getTeams, insertTeam, updateTeam } from '../controllers/team.controllers.js'

const router = Router()

// Obtener todos los usuarios
router.get('/teams', getTeams)

// Obtener un usuario por ID
router.get('/teams/:teamId', getTeamById)

// Crear un nuevo usuario
router.post('/teams', insertTeam)

// Eliminar un usuario por ID
router.delete('/teams/:teamId', deleteTeam)

// Actualizar un usuario por ID
router.put('/teams/:teamId', updateTeam)

export default router
