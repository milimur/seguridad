# Proyecto seguridad

Este proyecto consiste en una API que utiliza la API de YouTube para ofrecer funcionalidades de búsqueda y gestión de contenido. Además, implementa una pipeline CI/CD utilizando GitHub Actions, garantizando prácticas seguras para la gestión de claves privadas.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)

## Descripción

Este proyecto tiene como objetivo proporcionar una API que se integra con la API de YouTube, permitiendo a los usuarios realizar búsquedas de contenido y acceder a información relacionada con videos y canales. La implementación de una pipeline CI/CD con GitHub Actions asegura que el código se despliegue de manera eficiente y segura.

## Características

- *Integración con la API de YouTube*: Permite búsquedas de videos, canales y comentarios, así como la recuperación de información relevante.
- *CI/CD con GitHub Actions*: Automatiza el proceso de construcción, prueba y despliegue de la aplicación.


## Tecnologías utilizadas

- *Node.js*: Entorno de ejecución para JavaScript del lado del servidor.
- *Express.js*: Framework web para Node.js.
- *YouTube API*: API externa para acceder a contenido de YouTube.
- *GitHub Actions*: Herramienta para la integración y entrega continua.
- *dotenv*: Gestión de variables de entorno.
- *Terraform*: IaC para la creación de recursos.
- *Docker*: Como herramienta de contenedor.  

## Estructura del proyecto
```bash
/api-seguridad
├── src
│   ├── app.js          # Configuraciones de express
│   ├── index.js        # Rutas de la API
│   └── app.test.js     # Tests unitarios
├── tests               # Pruebas automatizadas
├── .env                # Variables de entorno
├── .github             # Configuraciones de GitHub Actions
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del proyecto
```


## Instalación
1. *Clona el repositorio*:
   bash
   git clone https://github.com/milimur/seguridad.git
   cd seguridad
2. **instala las dependencias**
    bash
    npm install
3. *configurar las variables de entorno*
   Crea un archivo .env y agrega las credenciales necesarias para acceder a la       API de YouTube.


## Uso
Para iniciar la api, ejecuta:
```bash
npm run start
```
