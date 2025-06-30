import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/auth.middleware.js';
import bcrypt from 'bcrypt'

const router = Router();

const users = [{ email: "test123@gmail.com", password: '$2b$10$H56hHnglXKzyOVj/ERFj5ukSZLKQCgUMf51b7cy5tNAq7NPW0nRqy' }]

router.post('/register', async (req, res) => {
    const { email, password } = req.body

    if(!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Email and valid password required" })
    }

    const existingUser = users.find(user => user.email === email)
    if(existingUser)
        return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ email, password: hashedPassword });

    console.log(users)

    return res.status(201).json({ message: "User registered successfully" })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    console.log(users);
    

    const user = users.find(user => user.email === email)
    
    if(!user) {
        return res.status(401).json({message: "Invalid email or password"})
    }

    const match = await bcrypt.compare(password, user.password)
    
    if(!match) {
        return res.status(401).json({ message: "Invalid credentials!" })
    }
    const token = jwt.sign(
        { email, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return res.json({
        message: 'Login successful',
        token
    })


})

router.get('/dashboard', authenticate, (req, res) => {
    return res.json({ message: `Welcome ${req.user.email}`, role: req.user.role })
})

export default router