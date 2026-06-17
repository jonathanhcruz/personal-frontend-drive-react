# Setup — Frontend Drive

## Stack confirmado

| Capa | Tecnología | Decisión |
|---|---|---|
| Framework | React 19 + TypeScript | Ya instalado |
| Bundler | Vite 8 | Ya instalado |
| Routing | React Router DOM | Pendiente instalar |
| HTTP | axios | Pendiente instalar |
| Data fetching | @tanstack/react-query | Pendiente instalar |
| Estilos | SCSS Modules | Pendiente instalar (`sass`) |
| Iconos | react-icons | Instalado |
| Linting | ESLint + Prettier | Pendiente configurar |

---

## Dependencias a instalar

### Producción
```bash
npm install react-router-dom axios @tanstack/react-query
```

### Desarrollo
```bash
npm install -D sass prettier eslint-config-prettier eslint-plugin-prettier
```

### Íconos
```bash
npm install react-icons   # ya instalado
```

---

## Arquitectura de carpetas

```
src/
├── pages/
│   ├── LoginPage.tsx
│   └── ExplorerPage.tsx
│
├── routes/
│   ├── router.tsx              → definición de rutas
│   └── ProtectedRoute.tsx      → redirige a /login si no hay sesión
│
├── components/                 → todos los componentes, estructura plana
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.scss
│   │   ├── Button.types.ts
│   │   └── index.ts
│   ├── Input/
│   ├── Modal/
│   ├── Spinner/
│   ├── Badge/
│   ├── Breadcrumb/
│   ├── FolderGrid/
│   ├── FolderItem/
│   ├── FileItem/
│   ├── ContextMenu/
│   ├── SharePanel/
│   ├── UploadPanel/
│   └── MetadataPanel/
│
├── services/                   → funciones axios por módulo
│   ├── auth.service.ts
│   ├── folders.service.ts
│   ├── files.service.ts
│   └── share.service.ts
│
├── hooks/                      → React Query hooks globales
│   ├── useAuth.ts
│   ├── useFolders.ts
│   ├── useFiles.ts
│   └── useShare.ts
│
├── lib/
│   ├── axios.ts                → instancia configurada + interceptores
│   └── queryClient.ts          → configuración de TanStack Query
│
├── types/
│   └── api.types.ts            → interfaces que espeja el contrato del backend
│
└── styles/
    ├── _variables.scss         → colores, espaciados, tipografía, breakpoints
    ├── _mixins.scss            → breakpoints, utilidades
    └── global.scss             → reset, fuentes, estilos base
```

### Regla de componente autocontenido
Cada componente vive en su propia carpeta con todo lo que necesita:
- `ComponentName.tsx`
- `ComponentName.module.scss`
- `ComponentName.types.ts`
- `ComponentName.hooks.ts` — solo si tiene hooks propios (no globales)
- `index.ts` — re-exporta el componente

---

## Rutas

| Ruta | Página | Auth |
|---|---|---|
| `/login` | LoginPage | No |
| `/drive` | ExplorerPage (carpetas raíz) | Sí |
| `/drive/:folderId` | ExplorerPage (carpeta) | Sí |

Sin ruta pública de share — la descarga pública va directamente al backend (`/api/share/:token`).

---

## Tipos base (`api.types.ts`)

Espeja el contrato del backend definido en `.spec` de backend-drive:

```typescript
interface ApiResponse<T> { data: T }
interface ApiError { error: { code: string; message: string } }

interface Folder { id: string; name: string; parentId: string | null; createdAt: string }
interface BreadcrumbItem { id: string; name: string }
interface FolderContents { folders: Folder[]; files: File[] }

interface File { id: string; name: string; mimeType: string; size: number; checksum: string; folderId: string; createdAt: string }

interface ShareToken { id: string; fileId: string; expiresAt: string; usedAt: string | null; createdAt: string }
```

---

## axios instance (`lib/axios.ts`)

Responsabilidades:
1. Base URL desde variable de entorno `VITE_API_URL`
2. Header `Authorization: Bearer <accessToken>` en cada request
3. Interceptor de respuesta: si recibe `401` → intenta `POST /api/auth/refresh` → reintenta request original
4. Si el refresh falla → limpia tokens → redirige a `/login`

Access token: en memoria (React context/store — nunca en localStorage).
Refresh token: en `localStorage` (consciente del tradeoff XSS vs usabilidad, sistema personal).
