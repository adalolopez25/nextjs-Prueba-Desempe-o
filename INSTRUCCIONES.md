#  INSTRUCCIONES PARA EJECUTAR EL PROYECTO

## ¿QUÉ NECESITAS HACER?

Sigue estos 7 pasos en orden. Toma menos de 10 minutos.

---

## PASO 1: INSTALAR POSTGRESQL (Si no lo tienes)

### Windows:
1. Descarga desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalante
3. **IMPORTANTE**: Recuerda la contraseña que pones para el usuario `postgres`
4. Deja todo en valores por defecto
5. Presiona Finish

### macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## PASO 2: CREAR LA BASE DE DATOS

Abre una terminal (PowerShell en Windows) y ejecuta:

```bash
psql -U postgres
```

Te pedirá la contraseña. Escribe la contraseña que pusiste en PASO 1.

Luego, dentro de psql, escribe:

```bash
CREATE DATABASE helpdeskpro;
\q
```

 Ya creaste la BD

---

## PASO 3: CONFIGURAR EL ARCHIVO .env.local

1. Abre la carpeta del proyecto: `C:\Users\Andres\Desktop\nextjs\nextjs-Prueba-Desempe-o`
2. Busca el archivo `.env.local`
3. Ábrelo con VS Code (click derecho → Open with Code)
4. Reemplaza **TU_CONTRASEÑA** con la contraseña que pusiste en PASO 1:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/helpdeskpro"
JWT_SECRET="secreto-seguro-2024"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Por ejemplo, si tu contraseña es `admin123`, sería:

```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/helpdeskpro"
JWT_SECRET="secreto-seguro-2024"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

5. Guarda el archivo (Ctrl+S)

 Ya configuraste las variables

---

## PASO 4: INSTALAR DEPENDENCIAS

En la terminal, en la carpeta del proyecto:

```bash
cd C:\Users\Andres\Desktop\nextjs\nextjs-Prueba-Desempe-o
npm install
```

Espera a que termine (puede tomar 2-3 minutos)

 Ya instalaste todo

---

## PASO 5: CREAR TABLAS EN LA BASE DE DATOS

En la misma terminal, ejecuta:

```bash
npx prisma migrate dev --name init
```

Presiona Enter cuando te pregunte si quieres continuar.

Esto creará todas las tablas en PostgreSQL.

 Ya creaste las tablas

---

## PASO 6: CARGAR DATOS DE PRUEBA (Opcional pero recomendado)

```bash
npm run seed
```

Esto crea:
-  Usuario cliente: `client@example.com` / `123456`
-  Usuario agente: `agent@example.com` / `123456`
-  2 tickets de ejemplo
-  2 comentarios de ejemplo

---

## PASO 7: INICIAR EL SERVIDOR

```bash
npm run dev
```

Deberías ver algo como:

```
> next dev
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

 **El servidor está corriendo**

---

##  ACCEDER A LA APLICACIÓN

Abre tu navegador y ve a: **http://localhost:3000**

### Prueba como Cliente:
- Email: `client@example.com`
- Contraseña: `123456`

### Prueba como Agente:
- Email: `agent@example.com`
- Contraseña: `123456`

---

##  QUÉ VAS A VER

### Página de Login:
- Fondo oscuro con gradiente
- Logo "HelpDeskPro"
- Campos para email y contraseña
- Botones para probar login como cliente o agente

### Dashboard de Cliente:
- Lista de tus tickets
- Botón para crear nuevo ticket
- Ver detalles de cada ticket
- Agregar comentarios

### Dashboard de Agente:
- Todos los tickets de todos los usuarios
- Botones para cambiar estado (Open → In Progress → Resolved → Closed)
- Filtros por estado
- Ver comentarios de clientes

---

##  SI ALGO SALE MAL

### Error: "connect ECONNREFUSED"
**Problema**: PostgreSQL no está corriendo

**Solución**:
```bash
# Windows: Abre Services y busca "PostgreSQL"
# Haz click derecho → Start

# macOS:
brew services start postgresql@15

# Linux:
sudo systemctl start postgresql
```

### Error: "database does not exist"
**Problema**: No creaste la BD

**Solución**:
```bash
psql -U postgres
CREATE DATABASE helpdeskpro;
\q
npx prisma migrate dev --name init
```

### Error: "JWS invalid" o token inválido
**Problema**: Las cookies están corruptas

**Solución**:
1. Abre DevTools (F12)
2. Va a Application → Cookies
3. Elimina todas las cookies de localhost
4. Recarga la página

### Las estilos (Tailwind) no aparecen
**Problema**: Cache del navegador

**Solución**:
1. Presiona Ctrl+Shift+Delete
2. Limpia el cache
3. Recarga la página

---

##  COMANDOS ÚTILES PARA DESPUÉS

```bash
# Ver la BD visualmente
npx prisma studio

# Detener el servidor
Ctrl+C en la terminal

# Ver logs de PostgreSQL
psql -U postgres -d helpdeskpro

# Limpiar TODO y empezar de nuevo ( borra todos los datos)
npx prisma migrate reset
```

---

##  CHECKLIST

- [ ] PostgreSQL instalado
- [ ] BD `helpdeskpro` creada
- [ ] `.env.local` configurado correctamente
- [ ] `npm install` completado
- [ ] `npx prisma migrate dev --name init` completado
- [ ] `npm run seed` completado (opcional)
- [ ] `npm run dev` ejecutándose
- [ ] Navegador abierto en http://localhost:3000
- [ ] Login exitoso con `client@example.com`

---

##  RESUMEN

1. **PostgreSQL instalado** 
2. **BD creada** 
3. **`.env.local` configurado** 
4. **`npm install`** 
5. **`npx prisma migrate dev --name init`** 
6. **`npm run seed`** (opcional) 
7. **`npm run dev`** 

**¡Listo! Tu aplicación está funcionando** 🎉

---

##  DUDA MÁS FRECUENTE

**P: ¿Dónde veo el código?**
A: En VS Code, carpeta `app/` para páginas, `components/` para componentes, `lib/` para lógica

**P: ¿Puedo crear nuevos usuarios?**
A: Sí, en la página `/register`

**P: ¿Puedo editar los estilos?**
A: Sí, están en `app/globals.css` (Tailwind CSS)

**P: ¿Dónde está el código de las APIs?**
A: En `app/api/` (login, tickets, comments)

**P: ¿Cómo agrego datos manuales?**
A: Usa Prisma Studio: `npx prisma studio`

---

**¡Adelante! Todo está listo para que veas tu aplicación funcionando! **
