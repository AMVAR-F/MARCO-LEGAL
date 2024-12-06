import express from 'express'
import { PORT } from './config.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/use.routes.js'
import teamRoutes from './routes/team.routes.js'
import reservationRoutes from './routes/reservation.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import fieldsRoutes from './routes/fields.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser)
app.use(userRoutes)
app.use(teamRoutes)
app.use(reservationRoutes)
app.use(paymentRoutes)
app.use(fieldsRoutes)
app.use('/api',authRoutes)

app.listen(PORT, () => {
  console.log('server running on port', PORT)
})
