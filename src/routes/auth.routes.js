import { Router } from "express";
import {login, register, logout, profile} from '../controllers/auth.controllers.js'
const router = Router()
import {authRequired} from '../middlewares/validatetoken.js'

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", authRequired, profile)

export default router