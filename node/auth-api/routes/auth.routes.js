import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/auth.middleware.js';
import bcrypt from 'bcrypt'
import db from '../db/db.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body

    if(!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Email and valid password required" })
    }

    const existingUser = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email)
    if(existingUser)
        return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

    return res.status(201).json({ message: "User registered successfully" })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email)
    
    if(!user) {
        return res.status(401).json({message: "Invalid email or password"})
    }

    const match = await bcrypt.compare(password, user.password)
    
    if(!match) {
        return res.status(401).json({ message: "Invalid credentials!" })
    }
    const token = jwt.sign(
        { email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return res.json({
        message: 'Login successful',
        token
    })


})

router.get('/me', authenticate, (req, res) => {
    const { id, email } = req.user
    res.json({ id, email })
})

router.get('/dashboard', authenticate, (req, res) => {
    return res.json({ message: `Welcome ${req.user.email}`, role: req.user.role })
})

export default router