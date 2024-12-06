import { Router } from 'express'

import { deleteReservation, getReservationById, getReservations, insertReservation, updateReservation } from '../controllers/reservation.controllers.js'

const router = Router()

// Obtener todos los usuarios
router.get('/reservation', getReservations)

// Obtener un usuario por ID
router.get('/reservation/:reservationId', getReservationById)

// Crear un nuevo usuario
router.post('/reservation', insertReservation)

// Eliminar un usuario por ID
router.delete('/reservation/:reservationId', deleteReservation)

// Actualizar un usuario por ID
router.put('/reservation/:reservationId', updateReservation)

export default router
