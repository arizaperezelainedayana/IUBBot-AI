/*=========================================
        IUBBot AI
        Base de Datos
==========================================*/

CREATE DATABASE IF NOT EXISTS iubbot_ai;

USE iubbot_ai;


/*=========================================
            TABLA FAQ
==========================================*/

CREATE TABLE faq(

id INT AUTO_INCREMENT PRIMARY KEY,

pregunta VARCHAR(255) NOT NULL,

respuesta TEXT NOT NULL

);


/*=========================================
      CONVERSACIONES
==========================================*/

CREATE TABLE conversaciones(

id INT AUTO_INCREMENT PRIMARY KEY,

pregunta TEXT NOT NULL,

respuesta TEXT NOT NULL,

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


/*=========================================
          DATOS INICIALES
==========================================*/

INSERT INTO faq(pregunta,respuesta) VALUES

(

'matriculas',

'Las matrículas se realizan según el calendario académico institucional publicado por la IUB.'

),

(

'admisiones',

'Puedes consultar el proceso de admisión desde el portal institucional de la IUB.'

),

(

'programas',

'La Institución Universitaria de Barranquilla ofrece programas técnicos, tecnológicos y profesionales.'

),

(

'biblioteca',

'La biblioteca brinda acceso a libros, bases de datos y material académico.'

),

(

'bienestar',

'Bienestar Universitario desarrolla actividades deportivas, culturales y de acompañamiento.'

),

(

'certificados',

'Los certificados académicos pueden solicitarse mediante Registro y Control Académico.'

),

(

'horarios',

'Los horarios de atención se encuentran publicados en los canales oficiales de la institución.'

),

(

'contacto',

'Puedes comunicarte con la IUB mediante los canales oficiales disponibles en su sitio web.'

),

(

'campus virtual',

'El Campus Virtual permite acceder a clases, recursos y actividades académicas.'

),

(

'pagos',

'Los pagos pueden realizarse siguiendo las instrucciones establecidas por la institución.'

);