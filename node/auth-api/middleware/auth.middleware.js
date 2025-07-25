import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid or missing token' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}