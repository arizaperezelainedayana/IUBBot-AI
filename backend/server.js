
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import Groq from "groq-sdk";

/*==================================
        CONFIGURACIÓN
==================================*/

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

/*==================================
            GROQ
==================================*/

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/*==================================
            MYSQL
==================================*/

let conexion;

async function conectarBD(){

    try{

        conexion = await mysql.createConnection({

            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME

        });

        console.log("✅ Base de datos conectada");

    }

    catch(error){

        console.log(error);
        process.exit();

    }

}
/*==================================
        PALABRAS CLAVE
==================================*/

const palabrasClave = [

    "matriculas",
    "programas",
    "biblioteca",
    "bienestar",
    "admisiones",
    "inscripcion",
    "certificados",
    "pagos",
    "campus virtual",
    "contacto",
    "horarios"

];

/*==================================
        RUTA PRINCIPAL
==================================*/

app.get("/", (req, res) => {

    res.json({

        estado: true,
        proyecto: "IUBBot AI",
        mensaje: "Servidor funcionando correctamente"

    });

});

/*==================================
        BUSCAR FAQ
==================================*/

async function buscarRespuesta(pregunta){

    const texto = pregunta

        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    console.log("");
    console.log("==============================");
    console.log("Pregunta:", texto);

    for(const palabra of palabrasClave){

        if(texto.includes(palabra)){

            console.log("Palabra encontrada:", palabra);

            const [faq] = await conexion.execute(

                "SELECT respuesta FROM faq WHERE pregunta=? LIMIT 1",

                [palabra]

            );

            if(faq.length){

                console.log("Respuesta encontrada en MySQL");

                return faq[0].respuesta;

            }

        }

    }

    console.log("No existe en la base de datos");

    return null;

}
/*==================================
        RESPONDER CON GROQ
==================================*/

async function responderConGroq(pregunta){

    try{

        console.log("Consultando Groq...");

        const respuesta = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [

                {
                    role: "system",
                    content: `Eres IUBBot AI.

Eres el asistente virtual oficial de la Institución Universitaria de Barranquilla.

Tu función es ayudar a estudiantes, docentes y aspirantes.

Si la pregunta es sobre la universidad responde de forma clara y profesional.

Si la pregunta no está relacionada con la universidad puedes responder normalmente, pero aclara que eres un asistente institucional.`
                },

                {
                    role: "user",
                    content: pregunta
                }

            ],

            temperature: 0.5,
            max_tokens: 500

        });

        console.log("Respuesta obtenida desde Groq");

        return respuesta.choices[0].message.content;

    }

    catch(error){

        console.log("ERROR GROQ");
        console.log(error);

        return "En este momento la IA no está disponible.";

    }

}

/*==================================
    GUARDAR CONVERSACIÓN
==================================*/

async function guardarConversacion(pregunta,respuesta){

    try{

        await conexion.execute(

            `INSERT INTO conversaciones
            (pregunta,respuesta)
            VALUES(?,?)`,

            [pregunta,respuesta]

        );

        console.log("Conversación guardada");

    }

    catch(error){

        console.log("No se pudo guardar la conversación");
        console.log(error);

    }

}
/*==================================
            CHAT
==================================*/

app.post("/chat", async (req, res) => {

    try{

        const { pregunta } = req.body;

        if(!pregunta){

            return res.status(400).json({

                respuesta: "Debes escribir una pregunta."

            });

        }

        let respuesta = await buscarRespuesta(pregunta);

        /*==============================
            SI NO ESTÁ EN MYSQL
        ==============================*/

        if(!respuesta){

            respuesta = await responderConGroq(pregunta);

        }

        /*==============================
            GUARDAR HISTORIAL
        ==============================*/

        await guardarConversacion(

            pregunta,

            respuesta

        );

        /*==============================
            RESPUESTA
        ==============================*/

        res.json({

            respuesta

        });

    }

    catch(error){

        console.log("");
        console.log("ERROR GENERAL");
        console.log(error);

        res.status(500).json({

            respuesta: "Ha ocurrido un error interno."

        });

    }

});

/*==================================
        INICIAR SERVIDOR
==================================*/

async function iniciarServidor(){

    await conectarBD();

    app.listen(PORT,()=>{

        console.log("");
        console.log("======================================");
        console.log("🤖 IUBBot AI");
        console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
        console.log("======================================");
        console.log("");

    });

}

iniciarServidor();
