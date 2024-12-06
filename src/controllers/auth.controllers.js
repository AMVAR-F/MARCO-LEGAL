import { pool } from '../database/conection.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  
  const { email, username, password } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      `INSERT INTO users (email, username, password) 
       VALUES ($1, $2, $3) RETURNING *`, 
      [email, username, hashedPassword]
    );

    const newUser = result.rows[0];
    delete newUser.password;

    // Generar el token
    const jwtSecret = process.env.JWT_SECRET || "secret123"; // Valor por defecto para desarrollo
    jwt.sign(
      { id: newUser.id },
      jwtSecret,
      { expiresIn: '1h' }, // Opcional: define el tiempo de expiración del token
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: 'Error generating token' });
        }

        // Devolver solo el token
        res.status(201).json({ token });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};


// Función de login 
export const login = async (req, res) => { 
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Campos faltantes' });
    }
  
    try {
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      delete user.password;
  
      const jwtSecret = process.env.JWT_SECRET || "secret123";
      jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          return res.status(500).json({ message: 'Error al generar el token' });
        }
  
        // Establecer la cookie con el token
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  
        // Devolver el token
        res.json({ token });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  };

//Funcion de cerrar sesion

export const logout = (req, res) => {
    // Eliminar la cookie del token
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  
    // Enviar una respuesta de éxito
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  };
  
export const profile = (req, res) => res.send('profile')