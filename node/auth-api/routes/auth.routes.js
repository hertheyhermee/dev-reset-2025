import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if(email === 'admin@example.com' && password === 'password123') {
        const token = jwt.sign(
            { email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        return res.json({
            message: 'Login successful',
            token
        })
    }

    return res.status(401).json({ message: "Invalid credentials!" })

})

router.get('/dashboard', authenticate, (req, res) => {
    return res.json({ message: `Welcome ${req.user.email}`, role: req.user.role })
})

export default router