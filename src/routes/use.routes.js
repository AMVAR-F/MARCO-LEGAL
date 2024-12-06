import { Router } from 'express'
import { createusers, deleteusers, getusers, insertusers, updateusers } from '../controllers/users.controllers.js'

const router = Router()

// Obtener todos los usuarios
router.get('/users', getusers)

// Obtener un usuario por ID
router.get('/users/:idUser', createusers)

// Crear un nuevo usuario
router.post('/users', insertusers)

// Eliminar un usuario por ID
router.delete('/users/:idUser', deleteusers)

// Actualizar un usuario por ID
router.put('/users/:idUser', updateusers)

export default router
