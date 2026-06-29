# Estado de construcción

_Última actualización: 2026-06-29_

## Completado ✅

### Infraestructura
- `src/styles/` — variables, mixins, reset, global
- `src/lib/axios.ts` — axiosInstance + interceptor de auth + SKIP_REFRESH_URLS
- `src/lib/queryClient.ts` — QueryClient (staleTime 30s, retry 1, no refetchOnWindowFocus)
- `src/lib/queryKeys.ts` — query keys centralizadas
- `src/types/api.types/` — login.ts, files.ts, folders.ts, index.ts
- `src/routes/router.tsx` — rutas `/login`, `/`, `/drive`, `/drive/:folderId`
- `src/routes/ProtectedRoute.tsx`

### Servicios
- `src/services/auth.service.ts`
- `src/services/files.service.ts`
- `src/services/folders.service.ts`
- `src/services/share.service.ts`

### Hooks
- `src/hooks/useAuth.ts` — login/logout mutations, token solo en memoria
- `src/hooks/useFolders.ts` — query contenido (root/subfolder normalizado) + breadcrumb + mutations create/rename/delete
- `src/hooks/useFiles.ts` — mutations upload/delete/download; invalida queryKeys.folders al mutar
- `src/hooks/useShare.ts` — query listShares + mutations createShare/revokeShare; `newShare` expone último token

### Componentes globales
- `src/components/Button` — variantes primary/secondary/ghost/danger · tamaños sm/md/lg · neon glow en primary · loading state
- `src/components/Input` (TextInput) — toggle contraseña · iconStart/iconEnd · error state · sizes
- `src/components/Spinner` — `<span role="status">` · tamaños sm/md/lg
- `src/components/Logo` — solo la órbita · tamaños sm/md/lg via CSS custom properties

### Páginas
- `src/pages/LoginPage.tsx` + `LoginPage.module.scss` — diseño completo según PDF

---

## En progreso 🔨

### Esqueleto del dashboard (plan por fases)
Ver [dashboard-plan.md](./dashboard-plan.md)

---

## Pendiente ⏳

### Componentes globales
- `Badge` — pospuesto, se evalúa al construir FileItem/MetadataPanel
- `Modal` — para crear carpeta, renombrar, confirmar eliminación
- `Breadcrumb`
- `ContextMenu`

### Componentes de contenido (dentro del dashboard)
- `FolderItem`
- `FolderGrid`
- `FileItem`
- `UploadPanel`
- `SharePanel`
- `MetadataPanel`

### Páginas
- `ExplorerPage.tsx` — tiene smoke test temporal; pendiente diseño real

---

## Decisiones tomadas
- **Badge:** pospuesto — se extrae solo si el patrón se repite en FileItem/MetadataPanel
- **Recientes y Papelera:** eliminados del sidebar — no disponibles en backend
- **Almacenamiento:** se construye visual con props hardcodeadas; se conecta cuando backend lo exponga
- **Avatar:** mock "JL" por ahora, se conecta con datos reales del usuario después
- **Búsqueda:** input deshabilitado visualmente, funcionalidad no disponible aún
- **Streaming:** `downloadFile` usa Blob — deuda técnica para archivos grandes, fase futura
