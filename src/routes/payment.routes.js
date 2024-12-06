import { Router } from 'express'
import { deletePayment, getPaymentById, getPayments, insertPayment, updatePayment } from '../controllers/payment.controllers.js'

const router = Router()

// Obtener todos los usuarios
router.get('/payments', getPayments)

// Obtener un usuario por ID
router.get('/payments/:paymentId', getPaymentById)

// Crear un nuevo usuario
router.post('/payments', insertPayment)

// Eliminar un usuario por ID
router.delete('/payments/:paymentId', deletePayment)

// Actualizar un usuario por ID
router.put('/payments/:paymentId', updatePayment)

export default router
