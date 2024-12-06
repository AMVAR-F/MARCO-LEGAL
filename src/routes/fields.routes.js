import { Router } from 'express'
import { deleteField, getFieldById, getFields, insertField, updateField } from '../controllers/fields.controllers.js'

const router = Router()

// Obtener todos los usuarios
router.get('/fields', getFields)

// Obtener un usuario por ID
router.get('/fields/fieldId', getFieldById)

// Crear un nuevo usuario
router.post('/fields', insertField)

// Eliminar un usuario por ID
router.delete('/fields/:fieldId', deleteField)

// Actualizar un usuario por ID
router.put('/fields/:fieldId', updateField)

export default router
