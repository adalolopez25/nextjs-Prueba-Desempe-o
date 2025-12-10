# 🎨 VISTA VISUAL DE LA APLICACIÓN

## 📺 ESTRUCTURA DE PANTALLAS

---

## 1️⃣ PÁGINA DE LOGIN (http://localhost:3000)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Fondo oscuro con gradiente]           │
│                                                     │
│                   HelpDeskPro                       │
│                   (Título grande)                   │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  📧 Email                                     │ │
│  │  [input field]                                │ │
│  │                                               │ │
│  │  🔐 Password                                  │ │
│  │  [input field]                                │ │
│  │                                               │ │
│  │  ❌ [Error message if any]                    │ │
│  │                                               │ │
│  │  [Login Button] (Azul)                        │ │
│  │                                               │ │
│  │  [Test Login Client] (Verde)                  │ │
│  │  [Test Login Agent] (Púrpura)                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘

Colores:
- Fondo: Gradiente gris oscuro (gray-900 → gray-800 → gray-700)
- Tarjeta: Gris oscuro (gray-800)
- Texto: Blanco
- Botones: Azul, Verde, Púrpura con hover effects
```

---

## 2️⃣ DASHBOARD DE CLIENTE (http://localhost:3000/dashboard/client)

```
┌─────────────────────────────────────────────────────┐
│ HelpDeskPro        [Hola, Client Test]  [Logout]   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Mis Tickets                   [+ Create Ticket]    │
└─────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📌 Error en login                               │ │
│  │ 2024-12-10                                      │ │
│  │                                                 │ │
│  │ No puedo iniciar sesión con mi cuenta...        │ │
│  │                                                 │ │
│  │ [Open] [High] [Ver Detalles]                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📌 Problema con impresora                       │ │
│  │ 2024-12-10                                      │ │
│  │                                                 │ │
│  │ La impresora de la oficina no funciona...       │ │
│  │                                                 │ │
│  │ [In Progress] [Medium] [Ver Detalles]           │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘

Funcionalidades:
✅ Ver todos tus tickets
✅ Ver estado y prioridad
✅ Crear nuevo ticket
✅ Ver detalles y comentarios
✅ Logout
```

---

## 3️⃣ DASHBOARD DE AGENTE (http://localhost:3000/dashboard/agent)

```
┌─────────────────────────────────────────────────────┐
│ HelpDeskPro        [Hola, Agente Soporte] [Logout] │
└─────────────────────────────────────────────────────┘

[All Tickets] [Open] [In Progress] [Resolved] [Closed]

┌──────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📌 Error en login                               │ │
│  │                       [Open] [High]              │ │
│  │ No puedo iniciar sesión con mi cuenta           │ │
│  │                                                 │ │
│  │ Creado: 2024-12-10                              │ │
│  │ [Start Progress] [View]                         │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📌 Problema con impresora                       │ │
│  │                  [In Progress] [Medium]          │ │
│  │ La impresora de la oficina no funciona          │ │
│  │                                                 │ │
│  │ Creado: 2024-12-10                              │ │
│  │ [Mark Resolved] [View]                          │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘

Funcionalidades:
✅ Ver TODOS los tickets (no solo los propios)
✅ Filtrar por estado
✅ Cambiar estado de tickets
✅ Ver detalles y comentarios
✅ Responder a clientes
```

---

## 4️⃣ DETALLE DE TICKET (http://localhost:3000/tickets/[id])

```
┌─────────────────────────────────────────────────────┐
│ HelpDeskPro        [Hola, Client Test]  [Logout]   │
└─────────────────────────────────────────────────────┘

[Back]

┌──────────────────────────────────────────────────────┐
│                                                      │
│  Error en login                    [Open] [High]     │
│  No puedo iniciar sesión con mi cuenta              │
│                                                      │
│  (Solo Agentes)                                      │
│  [Start Progress] [Mark Resolved] [Close Ticket]     │
│                                                      │
└──────────────────────────────────────────────────────┘

Comentarios:

┌──────────────────────────────────────────────────────┐
│  Agente Soporte                                      │
│  2024-12-10 10:30                                    │
│                                                      │
│  Estamos revisando el problema de autenticación      │
│                                                      │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  [Input field - Write a comment...]                  │
│  [Send Comment]                                      │
└──────────────────────────────────────────────────────┘

Funcionalidades:
✅ Ver detalles completos del ticket
✅ Ver historial de comentarios
✅ Agregar nuevos comentarios
✅ (Solo agentes) Cambiar estado del ticket
✅ Volver atrás
```

---

## 5️⃣ CREAR NUEVO TICKET (http://localhost:3000/tickets/new)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Create New Ticket                                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Title                                       │   │
│  │  [Problem with printer]                      │   │
│  │                                              │   │
│  │  Description                                 │   │
│  │  [Large text area with problem details]      │   │
│  │                                              │   │
│  │  Priority                                    │   │
│  │  [Dropdown: Low / Medium / High]             │   │
│  │                                              │   │
│  │  [Create Ticket] [Cancel]                    │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘

Funcionalidades:
✅ Escribir título y descripción
✅ Seleccionar prioridad
✅ Crear ticket que aparecerá en el dashboard
✅ Cancelar y volver
```

---

## 6️⃣ PÁGINA DE REGISTRO (http://localhost:3000/register)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Register                                            │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Name                                        │   │
│  │  [Full Name]                                 │   │
│  │                                              │   │
│  │  Email                                       │   │
│  │  [email@example.com]                         │   │
│  │                                              │   │
│  │  Password                                    │   │
│  │  [password]                                  │   │
│  │                                              │   │
│  │  Role                                        │   │
│  │  [Dropdown: Client / Agent]                  │   │
│  │                                              │   │
│  │  [Register]                                  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘

Funcionalidades:
✅ Crear nuevo usuario
✅ Elegir rol (cliente o agente)
✅ Contraseña encriptada con bcrypt
✅ Login automático después de registrarse
```

---

## 🎨 PALETA DE COLORES

### Fondos:
- Primario: `gray-900` (Negro oscuro)
- Secundario: `gray-800` (Gris oscuro)
- Terciario: `gray-700` (Gris medio)

### Estados de Tickets:
- 🔵 **Open**: Azul (`blue-500`)
- 🟡 **In Progress**: Amarillo (`yellow-500`)
- 🟢 **Resolved**: Verde (`green-500`)
- 🔴 **Closed**: Rojo (`red-500`)

### Prioridades:
- 🔵 **Low**: Azul (`blue-500`)
- 🟡 **Medium**: Amarillo (`yellow-500`)
- 🔴 **High**: Rojo (`red-500`)

### Botones:
- 🔵 **Primary**: Azul (`blue-600`)
- ⚫ **Secondary**: Gris (`gray-700`)
- 🔴 **Danger**: Rojo (`red-600`)

---

## 📱 RESPONSIVIDAD

La aplicación es **responsive** (se adapta a móvil):
- ✅ Desktop: Layout completo
- ✅ Tablet: Adaptado
- ✅ Móvil: Interfaz simplificada

---

## ✨ ANIMACIONES

- **Fade In**: Las páginas aparecen con transición suave
- **Hover Effects**: Los botones y tarjetas cambian al pasar el cursor
- **Scale**: Las tarjetas se agrandan ligeramente al hover
- **Color Transitions**: Los colores transicionan suavemente

---

## 🔐 FLUJO DE SEGURIDAD

```
Usuario intenta Login
       ↓
Credenciales validadas contra BD (bcrypt)
       ↓
Se genera JWT token (2 horas de expiración)
       ↓
Token guardado en cookie HTTP-only (no accesible por JS)
       ↓
Cookie enviada automáticamente con cada request
       ↓
Servidor verifica token y rol
       ↓
✅ Usuario autenticado accede a dashboard
```

---

## 🚀 FLUJO DE TICKET

### Cliente:
```
Cliente crea ticket
    ↓
Aparece en su dashboard
    ↓
Cliente puede agregar comentarios
    ↓
Agente responde en el ticket
    ↓
Cliente ve la respuesta
```

### Agente:
```
Agente ve TODOS los tickets
    ↓
Agente cambia estado (Open → In Progress → Resolved → Closed)
    ↓
Agente agrega comentarios/respuestas
    ↓
Cliente recibe notificación (futura)
```

---

## 📊 ESTRUCTURA DE DATOS VISIBLE

### En Dashboard de Cliente:
```
- Título del ticket
- Descripción previa
- Fecha de creación
- Estado (badge con color)
- Prioridad (badge con color)
- Botón "Ver Detalles"
```

### En Detalle de Ticket:
```
- Título y descripción completa
- Estado actual y prioridad
- Lista de comentarios con:
  - Autor del comentario
  - Fecha y hora
  - Contenido del mensaje
- Campo para agregar nuevo comentario
- Botones de acción (solo agentes)
```

---

## 🎯 CASOS DE USO REALES

### Caso 1: Cliente reporta problema
```
1. Cliente va a /dashboard/client
2. Hace clic en "+ Create Ticket"
3. Escribe título: "No puedo resetear contraseña"
4. Describe el problema en detalle
5. Selecciona prioridad "High"
6. Hace clic en "Create Ticket"
7. Ticket aparece en su dashboard
8. Agente lo ve en /dashboard/agent
9. Agente responde en el ticket
10. Cliente ve la respuesta y puede comentar más
```

### Caso 2: Agente resuelve ticket
```
1. Agente ve 15 tickets en /dashboard/agent
2. Filtra por "Open" para ver nuevos
3. Hace clic en "View" de un ticket
4. Lee el problema y comentarios
5. Agrega comentario explicando la solución
6. Hace clic en "Mark Resolved"
7. Estado cambia a "Resolved" (verde)
8. Cliente ve el ticket resuelto
9. Cliente puede cerrar o comentar más
10. Agente puede hacer clic "Close Ticket"
```

---

**¡Así se vería tu aplicación en acción! 🎉**
