import express from "express";
import authRoutes from './routes/auth.routes.js'

const app = express();
app.use(express.json());

app.use(express.static('public'));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})