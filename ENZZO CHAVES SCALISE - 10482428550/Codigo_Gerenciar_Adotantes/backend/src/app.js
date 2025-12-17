import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import adotanteRoutes from './routes/AdotanteRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express()

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', adotanteRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'API de Adotantes está rodando' })
})

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' })
})

app.listen(PORT, () => {
    console.log('Servidor rodando na porta: ' + PORT)
})

export default app;