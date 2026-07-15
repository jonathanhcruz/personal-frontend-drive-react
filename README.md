# PrivateDrive — Frontend

Interfaz web para PrivateDrive, un sistema de almacenamiento de archivos privado. Permite navegar carpetas, subir archivos, renombrar, mover, compartir y descargar desde un backend NestJS.

## Stack

- **React 19** + **TypeScript strict** + **Vite 8**
- **TanStack Query v5** — estado del servidor, caché, mutaciones
- **React Router v6** — rutas y navegación
- **SCSS Modules + BEM** — estilos por componente, sin clases globales
- **react-icons/hi** — iconografía (HeroIcons)

## Requisitos

- Node.js 20+
- Backend corriendo en `http://localhost:3000` (o configurar `VITE_BACKEND_URL`)

## Levantar en local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Lint con ESLint |

## Documentación interna

Ver [`.specs/`](.specs/README.md) — features, estado del proyecto, convenciones y decisiones técnicas.
