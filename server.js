// importaciones
import express, { urlencoded } from 'express'
import cors from 'cors'
import client from './src/common/db.js'
import peliculaRoutes from './src/pelicula/routes.js'
import actorRoutes from './src/actor/routes.js'

// definicion de variables
const PORTS = 3000 || 4000
const app = express()

// configuracion de middlewares
app.use(express.json())
app.use(urlencoded({ extended: true}))
app.use(cors())
app.use('/api', peliculaRoutes)
app.use('/api', actorRoutes)

await client.connect()
.then(() => {
    console.log('Conectado al cluster')
    app.get('/', (req, res) => { return res.status(200).send("Bienvenido al cine Iplacex")})
})
.catch(() => {
    console.log('Ha ocurrido un error al conectar al cluster')
})

app.listen(PORTS, () => { console.log(`Servidor corriendo en http://localhost:${PORTS}`)})
