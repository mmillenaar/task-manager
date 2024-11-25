import express from "express";
import dotenv from 'dotenv'
import { Server as HttpServer } from 'http'
import { createUsersRoutes } from "./routes/users.routes";

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const httpServer = new HttpServer(app)

app.use('/api/users', createUsersRoutes())

const PORT: number = Number(process.env.PORT) || 3030
const server = httpServer.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`);
})
server.on("error", error => console.log(`Error in server: ${error}`))