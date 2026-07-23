/* =======================================
        IUBBot AI
======================================= */

const chatButton = document.getElementById("chatButton");

const openChat = document.getElementById("openChat");

const closeChat = document.getElementById("closeChat");

const chatContainer = document.getElementById("chatContainer");

const sendButton = document.getElementById("sendMessage");

const input = document.getElementById("message");

const chatBody = document.getElementById("chatBody");


/*==============================
        ABRIR CHAT
===============================*/

function abrirChat(){

    chatContainer.style.display="flex";

    input.focus();

}

chatButton.addEventListener("click",abrirChat);

openChat.addEventListener("click",abrirChat);


/*==============================
        CERRAR CHAT
===============================*/

closeChat.addEventListener("click",()=>{

    chatContainer.style.display="none";

});


/*==============================
      PRESIONAR ENTER
===============================*/

input.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        enviarMensaje();

    }

});


sendButton.addEventListener("click",enviarMensaje);



/*==============================
      ENVIAR MENSAJE
===============================*/

function enviarMensaje(){

    const texto=input.value.trim();

    if(texto==="") return;

    agregarMensajeUsuario(texto);

    input.value="";

    mostrarPensando();

    setTimeout(()=>{

        responder(texto);

    },1500);

}



/*==============================
     MENSAJE USUARIO
===============================*/

function agregarMensajeUsuario(texto){

    const div=document.createElement("div");

    div.className="user-message";

    div.innerHTML=texto;

    chatBody.appendChild(div);

    bajarScroll();

}
/*==============================
        PENSANDO...
===============================*/

function mostrarPensando(){

    const typing=document.createElement("div");

    typing.className="typing";

    typing.id="typing";

    typing.innerHTML=`
        <span></span>
        <span></span>
        <span></span>
    `;

    chatBody.appendChild(typing);

    bajarScroll();

}

/*==============================
    ELIMINAR PENSANDO
===============================*/

function quitarPensando(){

    const typing=document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}


/*==============================
      RESPUESTAS FAQ
===============================*/

const respuestas={

"hola":"¡Hola! 👋 Soy IUBBot AI. Estoy listo para ayudarte con información sobre la Institución Universitaria de Barranquilla.",

"buenas":"¡Hola! 😊 ¿En qué puedo ayudarte hoy?",

"gracias":"¡Con mucho gusto! Si tienes otra duda aquí estaré.",

"adios":"Hasta luego 👋. Gracias por utilizar IUBBot AI.",

"matriculas":"Las matrículas se realizan de acuerdo con el calendario académico establecido por la Institución Universitaria de Barranquilla. Para información actualizada consulta el calendario académico institucional.",

"inscripcion":"Puedes realizar tu proceso de inscripción desde el portal institucional siguiendo las indicaciones de Admisiones.",

"admisiones":"La oficina de Admisiones brinda información sobre requisitos, inscripción y proceso de ingreso a la institución.",

"programas":"La IUB ofrece programas técnicos, tecnológicos y profesionales en diferentes áreas del conocimiento.",

"biblioteca":"La biblioteca ofrece acceso a material académico, bases de datos y servicios de consulta para estudiantes.",

"bienestar":"Bienestar Universitario desarrolla actividades deportivas, culturales y de apoyo para toda la comunidad educativa.",

"contacto":"Puedes comunicarte con la institución mediante los canales oficiales publicados en la página web.",

"horario":"El horario de atención administrativa es de lunes a viernes en jornada laboral.",

"certificados":"Los certificados académicos pueden solicitarse siguiendo el procedimiento establecido por Registro y Control Académico."

};


/*==============================
    RESPONDER CON EL SERVIDOR
===============================*/

async function responder(texto){

    quitarPensando();

    try{

        const response = await fetch("https://iub-bot-ai-ko6y.vercel.app/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                pregunta:texto

            })

        });

        const data = await response.json();

        escribirRespuesta(data.respuesta);

    }

    catch(error){

        escribirRespuesta(

            "❌ No fue posible conectar con IUBBot AI. Verifica que el servidor esté ejecutándose."

        );

    }

}
/*==============================
    ESCRIBIR RESPUESTA
===============================*/

function escribirRespuesta(texto){

    const div=document.createElement("div");

    div.className="bot-message";

    chatBody.appendChild(div);

    let i=0;

    const intervalo=setInterval(()=>{

        div.innerHTML+=texto.charAt(i);

        i++;

        bajarScroll();

        if(i>=texto.length){

            clearInterval(intervalo);

        }

    },20);

}


/*==============================
    BAJAR SCROLL
===============================*/

function bajarScroll(){

    chatBody.scrollTop=chatBody.scrollHeight;

}


/*==============================
      OPENAI (FUTURO)
===============================*/

/*

Cuando terminemos el backend únicamente reemplazaremos la función
"responder()" por esta petición.

async function responderConIA(texto){

const response = await fetch("http://localhost:3000/chat",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

pregunta:texto

})

});

const data = await response.json();

quitarPensando();

escribirRespuesta(data.respuesta);

}

Y dentro de enviarMensaje()

cambiar

responder(texto);

por

responderConIA(texto);

y automáticamente IUBBot AI comenzará a responder utilizando OpenAI.

*/


/*==============================
    MENSAJE DE BIENVENIDA
===============================*/

window.onload=()=>{

    chatContainer.style.display="none";

};
/*==============================
      BOTONES RÁPIDOS
===============================*/

function preguntar(texto){

    input.value = texto;

    enviarMensaje();

}


/*==============================
     MENSAJES SUGERIDOS
===============================*/

const sugerencias = [

"📅 Matrículas",

"🎓 Programas",

"📚 Biblioteca",

"🏢 Bienestar"

];


/*==============================
 MOSTRAR SUGERENCIAS
===============================*/

function mostrarSugerencias(){

    const contenedor = document.createElement("div");

    contenedor.style.display = "flex";

    contenedor.style.flexWrap = "wrap";

    contenedor.style.gap = "10px";

    contenedor.style.marginTop = "15px";

    sugerencias.forEach(item=>{

        const boton=document.createElement("button");

        boton.innerHTML=item;

        boton.style.border="none";

        boton.style.background="#0057B8";

        boton.style.color="white";

        boton.style.padding="8px 15px";

        boton.style.borderRadius="20px";

        boton.style.cursor="pointer";

        boton.onclick=()=>{

            preguntar(item);

        };

        contenedor.appendChild(boton);

    });

    chatBody.appendChild(contenedor);

}

mostrarSugerencias();
