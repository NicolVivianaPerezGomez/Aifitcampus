### **Explicación de cada sección**

1. Instalado ->
 - npm install bcryptjs
 - npm install --save-dev @types/bcryptjs
 - npm install jsonwebtoken
 - npm install --save-dev @types/jsonwebtoken
 * Revisar "esModuleInterop": true, 
 - npm install cors
 - npm install --save-dev @types/cors
 - npx typeorm-model-generator -h localhost -p 5432 -d bd_aifitcampus -u postgres -x 123 -e postgres -o ./src/entities --noConfig --ce pascal --cp camel 
typeorm-model-generator@0.4.6
 ### Levantar server:
 - npm run dev

 # API Node.js + PostgreSQL + JWT

Proyecto backend desarrollado con Node.js, PostgreSQL y autenticación mediante JWT.

## Requisitos previos

Antes de ejecutar el proyecto, asegúrese de tener instalado:

- Node.js
- npm
- PostgreSQL
- Git
- Visual Studio Code o cualquier editor de código

## Instalación

### 2. Ingresar a la carpeta del proyecto

- cd nombre-del-proyecto
- npm install
- crear un archivo .env

PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=bd_aifitcampus

## Endpoints principales

## Endpoints de la API

### Autenticación

| Método | Ruta | Descripción | Requiere token |
|---|---|---|---|
| POST | `/login` | Inicia sesión y genera el token JWT | No |

### Usuarios

| Método | Ruta | Descripción | Requiere token |
|---|---|---|---|
| POST | `/users` | Crea un nuevo usuario | No |
| GET | `/users` | Consulta todos los usuarios | Sí |
| GET | `/users/email/:email` | Consulta un usuario por correo electrónico | Sí |

## Autenticación JWT

Las rutas protegidas requieren enviar el token JWT en el encabezado de la petición.

Ejemplo:

```text
Authorization: Bearer TOKEN_GENERADO

# Recomendaciones
Ejecutar npm install después de clonar el proyecto.
No subir node_modules.
No subir el archivo .env.
No almacenar contraseñas o claves JWT directamente en el código.
Mantener actualizado el archivo package.json.
Realizar git pull antes de comenzar a trabajar.
Crear commits pequeños y descriptivos.
Trabajar en ramas cuando se desarrollen nuevas funcionalidades.
Validar que el proyecto funcione antes de realizar push.