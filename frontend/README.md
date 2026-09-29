# Estándares de Desarrollo del Proyecto

## Índice

1. [Introducción](#1-introducción)
2. [Versiones del entorno](#2-versiones-del-entorno)
3. [Instalación del proyecto](#3-instalación-del-proyecto)
4. [Estructura general del proyecto](#4-estructura-general-del-proyecto)
5. [Core](#5-core)

   * [5.1 Services](#51-services)
   * [5.2 Guards](#52-guards)
   * [5.3 Interceptors](#53-interceptors)
   * [5.4 Models e Interfaces](#54-models-e-interfaces)
6. [Features](#6-features)

   * [6.1 Auth](#61-auth)
   * [6.2 User](#62-user)
   * [6.3 Admin](#63-admin)
7. [Shared](#7-shared)
8. [Pages y Components](#8-pages-y-components)
9. [Estilos globales](#9-estilos-globales)
10. [Variables CSS](#10-variables-css)
11. [Responsive Design](#11-responsive-design)
12. [Estándar de nombres](#12-estándar-de-nombres)
13. [Rutas](#13-rutas)
14. [Reglas generales de desarrollo](#14-reglas-generales-de-desarrollo)
15. [Estructura final recomendada](#15-estructura-final-recomendada)

---

# 1. Introducción

Este documento define los estándares de organización, desarrollo y diseño utilizados en el proyecto Angular.

El objetivo es mantener una estructura clara y consistente para que todos los integrantes del equipo puedan:

* Encontrar fácilmente los archivos.
* Entender dónde debe implementarse cada funcionalidad.
* Reutilizar componentes y servicios correctamente.
* Mantener un código organizado y escalable.
* Evitar duplicación de código.
* Mantener una misma convención de nombres.
* Facilitar el mantenimiento futuro del proyecto.

La aplicación se organiza principalmente mediante tres conceptos:

* **Core:** lógica central y servicios generales de la aplicación.
* **Features:** funcionalidades agrupadas según el tipo de usuario o módulo.
* **Shared:** recursos reutilizables entre diferentes partes de la aplicación.

Además, el proyecto utiliza **Capacitor** para permitir que la aplicación Angular pueda ejecutarse como aplicación móvil.

---

# 2. Versiones del entorno

Para evitar problemas de compatibilidad entre los integrantes del equipo, todos deben trabajar utilizando las mismas versiones principales del entorno.

| Tecnología | Versión     |
| ---------- | ----------- |
| Node.js    | `v24.18.0`  |
| Angular    | `22.1.6`    |
| npm        | `12.0.1`    |
| JDK        | `21.0.12.1` |

El JDK es necesario principalmente para el desarrollo y compilación de la aplicación Android mediante Capacitor.

## Verificar versiones

Node.js:

```bash
node -v
```

npm:

```bash
npm -v
```

Angular:

```bash
ng version
```

Java:

```bash
java -version
```

Las versiones deben verificarse antes de instalar dependencias o comenzar el desarrollo.

---

# 3. Instalación del proyecto

Cuando un integrante descargue o clone el proyecto desde Git, **no encontrará la carpeta `node_modules`**, ya que esta carpeta está incluida en `.gitignore`.

Esto es intencional.

La carpeta `node_modules` contiene las dependencias instaladas localmente y puede ocupar mucho espacio, por lo que no debe almacenarse en Git.

## 3.1 Instalar las dependencias

Después de clonar el proyecto, ubicarse en la carpeta raíz:

```bash
cd nombre-del-proyecto
```

Luego ejecutar:

```bash
npm install
```

Este comando lee `package.json` y `package-lock.json` y vuelve a instalar las dependencias necesarias.

Después de ejecutar el comando se generará nuevamente:

```text
node_modules/
```

Por lo tanto:

```text
Git
 ↓
Clonar proyecto
 ↓
npm install
 ↓
node_modules/
```

**No se debe crear ni subir manualmente `node_modules` al repositorio.**

---

# 3.2 Capacitor

El proyecto utiliza **Capacitor** para integrar la aplicación Angular con plataformas móviles.

Capacitor permite utilizar el proyecto Angular como aplicación nativa para plataformas como Android.

Las dependencias de Capacitor se encuentran registradas en `package.json`.

Por esta razón, cuando un integrante ejecuta:

```bash
npm install
```

también se instalan nuevamente las dependencias de Capacitor definidas en el proyecto.

No es necesario instalar Capacitor manualmente cada vez que se clone el proyecto.

---

# 3.3 Si Capacitor necesita sincronizarse

Después de instalar las dependencias, se puede sincronizar Capacitor con:

```bash
npx cap sync
```

Este comando sincroniza el proyecto web de Angular con las plataformas nativas de Capacitor.

El flujo recomendado es:

```text
npm install
    ↓
npx cap sync
    ↓
Proyecto Angular + Capacitor actualizado
```

Si se está trabajando específicamente con Android:

```bash
npx cap sync android
```

---

# 3.4 Agregar Android por primera vez

Si el proyecto ya tiene la carpeta:

```text
android/
```

no es necesario ejecutar nuevamente `npx cap add android`.

La carpeta Android forma parte del proyecto y debe conservarse en el repositorio cuando el equipo trabaja con Capacitor.

Solamente cuando se configure Capacitor en un proyecto que todavía no tenga plataforma Android se utilizará:

```bash
npx cap add android
```

Después:

```bash
npx cap sync android
```

---

# 3.5 Ejecutar el proyecto Angular

Para ejecutar el proyecto en el navegador:

```bash
ng serve
```

También puede utilizarse:

```bash
ng serve -o
```

para abrir automáticamente el navegador.

---

# 3.6 Ejecutar en Android

Después de compilar o sincronizar el proyecto, se puede abrir el proyecto Android mediante:

```bash
npx cap open android
```

Esto abrirá el proyecto en Android Studio.

El desarrollo debe probarse tanto en navegador como en Android cuando corresponda.

---

# 4. Estructura general del proyecto

La aplicación utiliza una organización basada en funcionalidades:

```text
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── interfaces/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── user/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── home/
│   │   │   │   ├── profile/
│   │   │   │   └── services/
│   │   │   └── user.routes.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       ├── pages/
│   │       │   ├── dashboard/
│   │       │   ├── users/
│   │       │   └── services/
│   │       └── admin.routes.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── directives/
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
└── styles.css
```

La carpeta `features` contiene las funcionalidades principales de la aplicación.

`auth`, `user` y `admin` son **carpetas de organización de funcionalidades**, no componentes.

Cada feature puede contener sus propios:

* Components.
* Pages.
* Routes.

---

# 5. Core

La carpeta `core` contiene la lógica central de la aplicación.

Aquí se ubican elementos que normalmente son utilizados por diferentes funcionalidades y que tienen una responsabilidad importante dentro de la aplicación.

```text
core/
├── services/
├── guards/
├── interceptors/
├── models/
└── interfaces/
```

## 5.1 Services

Los servicios contienen lógica que no debería estar directamente dentro de los componentes.

Uno de sus principales usos es la comunicación con el backend mediante peticiones HTTP.

```text
Component
    ↓
Service
    ↓
API / Backend
```

Los servicios pueden utilizarse para:

* Consultar información.
* Crear registros.
* Actualizar información.
* Eliminar registros.
* Autenticar usuarios.
* Administrar sesiones.
* Comunicarse con APIs.
* Centralizar lógica reutilizable.

Ejemplos:

```text
auth.service.ts
user.service.ts
service.service.ts
admin.service.ts
```

Ejemplo de métodos:

```typescript
getUsers()
createUser()
updateUser()
deleteUser()
getServiceById()
```

La lógica de comunicación con el backend debe mantenerse en los servicios y no directamente dentro de los componentes.

---

## 5.2 Guards

Los guards controlan el acceso a determinadas rutas.

Ejemplos:

```text
auth.guard.ts
admin.guard.ts
```

Un guard puede comprobar:

* Si el usuario está autenticado.
* Si tiene permisos.
* Si pertenece a determinado rol.

---

## 5.3 Interceptors

Los interceptors permiten interceptar las peticiones HTTP antes de que sean enviadas o después de recibir una respuesta.

Pueden utilizarse para:

* Agregar tokens de autenticación.
* Manejar errores HTTP.
* Agregar headers.
* Centralizar configuraciones HTTP.

---

## 5.4 Models e Interfaces

Las interfaces y modelos permiten definir la estructura de los datos utilizados en la aplicación.

Ejemplo:

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

Esto permite mantener una estructura consistente cuando se trabaja con datos provenientes del backend.

---

# 6. Features

`features` contiene las funcionalidades principales de la aplicación.

Cada feature representa una parte específica del sistema y puede tener sus propios componentes, páginas y rutas.

```text
features/
├── auth/
├── user/
└── admin/
```

---

# 6.1 Auth

La feature `auth` contiene todo lo relacionado con la autenticación.

```text
auth/
├── components/
├── pages/
│   ├── login/
│   └── register/
└── auth.routes.ts
```

Las páginas pueden incluir:

```text
login/
register/
```

Los componentes exclusivos de autenticación deben permanecer en:

```text
features/auth/components/
```

Las rutas relacionadas con autenticación se encuentran en:

```text
auth.routes.ts
```

---

# 6.2 User

La feature `user` contiene las funcionalidades disponibles para los usuarios normales.

```text
user/
├── components/
├── pages/
│   ├── home/
│   ├── profile/
│   └── services/
└── user.routes.ts
```

Las páginas pueden incluir:

* Inicio.
* Perfil.
* Consulta de servicios.
* Otras funcionalidades disponibles para el usuario.

---

# 6.3 Admin

La feature `admin` contiene las funcionalidades exclusivas para administradores.

```text
admin/
├── components/
├── pages/
│   ├── dashboard/
│   ├── users/
│   └── services/
└── admin.routes.ts
```

Puede incluir funcionalidades como:

* Dashboard administrativo.
* Gestión de usuarios.
* Gestión de servicios.
* Administración de información.

El acceso a estas páginas debe estar protegido mediante guards cuando sea necesario.

---

# 7. Shared

La carpeta `shared` contiene recursos reutilizables por diferentes features.

```text
shared/
├── components/
├── pipes/
└── directives/
```

La regla principal es:

> Si un recurso solamente pertenece a una feature, debe permanecer dentro de esa feature. Si realmente se reutiliza entre diferentes features, puede pasar a `shared`.

Ejemplo:

```text
shared/
└── components/
    ├── button/
    ├── modal/
    ├── loading/
    ├── footer/
    └── navbar/
```

Un modal genérico puede utilizarse en diferentes funcionalidades, por lo que puede pertenecer a `shared`.

En cambio, un componente exclusivo del administrador debe permanecer en:

```text
features/admin/components/
```

---

# 8. Pages y Components

Es importante diferenciar entre una **page** y un **component**.

## Pages

Una `page` representa una pantalla completa de la aplicación y normalmente está asociada a una ruta.

Ejemplos:

```text
login/
register/
home/
profile/
dashboard/
users/
```

Una page puede utilizar varios componentes.

```text
Dashboard Page
│
├── Statistics Card
├── User Table
├── Navbar
└── Footer
```

## Components

Un component representa una parte específica de una pantalla.

Ejemplos:

```text
user-card/
service-card/
user-table/
login-form/
profile-card/
```

Los componentes permiten dividir una pantalla grande en partes pequeñas y reutilizables.

---

# 9. Estilos globales

Todos los estilos generales de la aplicación deben definirse en:

```text
src/styles.css
```

Se utilizará **Poppins** como fuente principal.

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}
```

Los estilos específicos de cada componente deben permanecer dentro de su propio componente cuando sea posible.

---

# 10. Variables CSS

Las variables globales permiten mantener consistencia en colores, tipografías, espacios y otros valores.

```css
:root {
  --color-primary: #5e3ea4;
  --color-secondary: #2dd4bf;
  --color-accent: #c69c00;
  --color-text: #111827;
  --color-background: #f9fafb;

  --font-primary: 'Poppins', sans-serif;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
}
```

La convención será:

```text
--categoria-nombre
```

Ejemplos:

```text
--color-primary
--color-background
--font-primary
--spacing-md
--border-radius-md
```

Se deben evitar nombres poco descriptivos como:

```text
--purple
--color1
--x
--valor
```

---

# 11. Responsive Design

La aplicación debe diseñarse teniendo en cuenta diferentes tamaños de pantalla.

Se recomienda utilizar `clamp()` para valores que puedan adaptarse de manera fluida.

```css
clamp(minimo, valor-preferido, maximo)
```

Ejemplo:

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

Para espacios:

```css
.section {
  padding: clamp(2rem, 5vw, 5rem);
}
```

Para componentes:

```css
.card {
  width: clamp(280px, 80vw, 500px);
}
```

## Uso de media queries

Las media queries deben utilizarse cuando sea necesario cambiar la estructura o comportamiento de un elemento.

```css
@media (max-width: 768px) {
  .navbar {
    display: none;
  }
}
```

Regla general:

```text
clamp()
↓
Cambios fluidos de tamaño

@media
↓
Cambios estructurales o de comportamiento
```

---

# 12. Estándar de nombres

## Variables

Se utilizará `camelCase`.

Correcto:

```typescript
userName
userEmail
totalServices
selectedUser
isAuthenticated
```

Incorrecto:

```typescript
UserName
user_name
USERNAME
user-name
```

## Métodos

Los métodos deben utilizar `camelCase` y describir claramente la acción que realizan.

Correcto:

```typescript
getUsers()
createUser()
updateUser()
deleteUser()
getServiceById()
validateForm()
```

Evitar:

```typescript
doThing()
method1()
functionTest()
data()
```

## Archivos

Los archivos deben utilizar nombres descriptivos siguiendo las convenciones de Angular.

Ejemplos:

```text
auth.service.ts
user.service.ts
user.routes.ts
auth.guard.ts
admin.guard.ts
user-navbar.component.ts
service-card.component.ts
profile-card.component.ts
```

## Componentes

Los componentes deben tener nombres descriptivos.

Ejemplos:

```text
user-navbar
service-card
profile-card
admin-dashboard
user-table
login-form
```

---

# 13. Rutas

Las rutas principales se organizan desde:

```text
app.routes.ts
```

Cada feature puede tener su propio archivo de rutas:

```text
auth.routes.ts
user.routes.ts
admin.routes.ts
```

La responsabilidad se divide de la siguiente manera:

```text
app.routes.ts
        │
        ├── auth.routes.ts
        ├── user.routes.ts
        └── admin.routes.ts
```

Las rutas principales pueden organizarse de esta manera:

```text
/auth
/user
/admin
```

Y dentro de cada feature:

```text
/auth/login
/auth/register

/user/home
/user/profile
/user/services

/admin/dashboard
/admin/users
/admin/services
```

Las rutas administrativas deben estar protegidas mediante los guards correspondientes.

---

# 14. Reglas generales de desarrollo

## 14.1 Mantener responsabilidades separadas

Cada elemento debe tener una responsabilidad clara.

```text
Component
→ Interfaz y presentación

Service
→ Lógica y comunicación con API

Guard
→ Control de acceso

Interceptor
→ Procesamiento de peticiones HTTP

Model / Interface
→ Estructura de datos
```

No se debe colocar toda la lógica de la aplicación dentro de los componentes.

---

## 14.2 Evitar duplicación

Antes de crear un nuevo componente, servicio o función, revisar si ya existe uno que pueda reutilizarse.

---

## 14.3 Mantener las features independientes

Los elementos exclusivos de una funcionalidad deben mantenerse dentro de ella.

Los elementos reutilizados entre varias funcionalidades deben colocarse en:

```text
shared/
```

---

## 14.4 Mantener los estilos organizados

Los estilos globales deben ir en:

```text
src/styles.css
```

Los estilos específicos deben permanecer en el componente correspondiente.

---

## 14.5 Utilizar nombres descriptivos

El código debe poder entenderse fácilmente por cualquier integrante del equipo.

Se debe preferir:

```typescript
getUserServices()
```

sobre:

```typescript
getData()
```

---

## 14.6 Mantener consistencia

Todos los integrantes deben respetar:

* La estructura de carpetas.
* Las convenciones de nombres.
* Las versiones del entorno.
* La organización de estilos.
* La separación entre pages y components.
* La separación entre lógica y presentación.
* La configuración de Angular y Capacitor.

---

# 15. Estructura final recomendada

```text
src/
│
├── app/
│   │
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── interfaces/
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── user/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── home/
│   │   │   │   ├── profile/
│   │   │   │   └── services/
│   │   │   └── user.routes.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       ├── pages/
│   │       │   ├── dashboard/
│   │       │   ├── users/
│   │       │   └── services/
│   │       └── admin.routes.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── directives/
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
└── styles.css
```

En la raíz del proyecto también se encuentran los elementos relacionados con Capacitor:

```text
proyecto/
├── src/
├── public/
├── android/
├── capacitor.config.ts
├── angular.json
├── package.json
├── package-lock.json
└── .gitignore
```

## Resumen de responsabilidades

| Carpeta               | Responsabilidad                            |
| --------------------- | ------------------------------------------ |
| `core`                | Lógica central de la aplicación            |
| `core/services`       | Comunicación con API y lógica reutilizable |
| `core/guards`         | Control de acceso a rutas                  |
| `core/interceptors`   | Interceptar y configurar peticiones HTTP   |
| `core/models`         | Modelos de datos                           |
| `core/interfaces`     | Contratos y estructuras de datos           |
| `features`            | Funcionalidades principales                |
| `features/auth`       | Autenticación                              |
| `features/user`       | Funcionalidades del usuario                |
| `features/admin`      | Funcionalidades administrativas            |
| `pages`               | Pantallas completas asociadas a rutas      |
| `components`          | Componentes específicos de una feature     |
| `shared`              | Recursos reutilizables entre features      |
| `styles.css`          | Estilos y configuraciones globales         |
| `app.routes.ts`       | Organización principal de las rutas        |
| `android`             | Proyecto nativo Android de Capacitor       |
| `capacitor.config.ts` | Configuración de Capacitor                 |

## Regla principal

La organización del proyecto puede resumirse en:

```text
CORE
Lógica central
    ↓
FEATURES
Funcionalidades según el rol
    ↓
PAGES
Pantallas
    ↓
COMPONENTS
Elementos de cada pantalla
    ↓
SHARED
Elementos reutilizables entre funcionalidades
```

Para iniciar el proyecto después de clonarlo:

```bash
npm install
npx cap sync
ng serve
```

Si se necesita trabajar específicamente con Android:

```bash
npx cap sync android
npx cap open android
```

La carpeta `node_modules` no se sube al repositorio. Se genera nuevamente mediante `npm install`.

La carpeta `android` no debe eliminarse ni ignorarse completamente, ya que forma parte del proyecto Capacitor y debe mantenerse en el repositorio cuando se trabaja con Android.
