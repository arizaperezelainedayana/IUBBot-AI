JavaScript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos usando Pool (más estable)
const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configuración de Groq AI
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Función para buscar en la base de datos
async function buscarRespuesta(mensaje) {
    const palabrasClave = mensaje.toLowerCase().split(" ");

    for (let palabra of palabrasClave) {
        if (palabra.length < 4) continue; // Ignora palabras muy cortas (de, la, el...)

        // Búsqueda flexible con LIKE
        const [faq] = await conexion.execute(
            "SELECT respuesta FROM faq WHERE pregunta LIKE ? LIMIT 1",
            [`%${palabra}%`]
        );

        if (faq.length > 0) {
            return faq[0].respuesta;
        }
    }
    return null;
}

// Ruta principal del chatbot
app.post("/chat", async (req, res) => {
    try {
        const { mensaje } = req.body;

        // 1. Primero intenta buscar en la base de datos
        const respuestaBD = await buscarRespuesta(mensaje);

        if (respuestaBD) {
            return res.json({ respuesta: respuestaBD, fuente: "Base de datos" });
        }

        // 2. Si no encuentra nada en la BD, le pregunta a la Inteligencia Artificial (Groq)
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Eres el asistente oficial de la Institución Universitaria de Barranquilla (IUB). Responde con un tono amable, claro y profesional."
                },
                {
                    role: "user",
                    content: mensaje
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        const respuestaIA = completion.choices[0].message.content;
        res.json({ respuesta: respuestaIA, fuente: "IA" });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Ocurrió un error al procesar tu solicitud." });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
