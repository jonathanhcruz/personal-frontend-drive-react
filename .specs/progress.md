# Estado de construcción

_Última actualización: 2026-07-01_

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
- `src/hooks/useFolders.ts` — query contenido unificado (`FolderContents` tanto en raíz como subfolder) + breadcrumb + mutations create/rename/delete; `currentFolder` disponible en raíz
- `src/hooks/useFiles.ts` — mutations upload/delete/download; invalida queryKeys.folders al mutar
- `src/hooks/useShare.ts` — query listShares + mutations createShare/revokeShare; `newShare` expone último token

### Componentes globales
- `src/components/Button` — variantes primary/secondary/ghost/danger · tamaños sm/md/lg · neon glow en primary · loading state
- `src/components/Input` (TextInput) — toggle contraseña · iconStart/iconEnd · error state · sizes
- `src/components/Spinner` — `<span role="status">` · tamaños sm/md/lg
- `src/components/Logo` — solo la órbita · tamaños sm/md/lg via CSS custom properties

### Dashboard — shell
- `src/components/Sidebar` — Logo sm + brand PRIVATE/DRIVE + NavLinks + barra de almacenamiento (hardcoded); NAV_ITEMS en `Sidebar/constants/index.ts`
- `src/components/DriveTopbar` — breadcrumb `›` + search disabled + toggle grid/list + botón Subir + avatar JL
- `src/components/DriveContent` — heading con título/meta + "Nueva carpeta" + sección CARPETAS + sección ARCHIVOS + estado vacío

### Componentes de contenido
- `src/components/FolderItem` — icono HiFolder (accent) + nombre truncado + botón HiDotsVertical (hover) · prop `viewMode` · `--list` modifier
- `src/components/FileItem` — badge coloreado por extensión (constants) + nombre truncado + tamaño + fecha + botón HiDotsVertical (hover) · prop `viewMode` · `--list` modifier (layout horizontal: badge | nombre+meta | ⋮)

### Componentes globales — Modal
- `src/components/Modal` — base con portal + cierre por Esc/overlay click · BEM `.modal`
- `src/components/Modal/CreateFolderModal` — input controlado + Enter confirma + llama `createFolder`
- `src/components/Modal/RenameModal` — input pre-cargado + deshabilita guardar si sin cambio + llama `renameFolder`
- `src/components/Modal/DeleteModal` — confirmación `variant="danger"` · cubre carpeta y archivo · cierra al confirmar

### Componentes globales — ContextMenu
- `src/components/ContextMenu` — menú flotante portal · cierre por Esc/click fuera · BEM `.context-menu` · variante `danger` para Eliminar
- Carpeta: Renombrar → `ModalState rename-folder` · Eliminar → `ModalState delete-folder`
- Archivo: Descargar → `downloadFile` directo · Eliminar → `ModalState delete-file`

### Páginas
- `src/pages/LoginPage/index.tsx` — diseño completo según PDF
- `src/pages/ExplorerPage/index.tsx` — `ModalState` + `ContextMenuState` discriminated unions; todos los callbacks conectados; `activeFolderId = currentFolder?.id` para create/upload

---

## Pendiente ⏳

### Paneles del dashboard
- `UploadPanel` — overlay "Subiendo 2 archivos..." con progreso
- `SharePanel` — gestión de enlaces compartidos (usa `useShare`)
- `MetadataPanel` — panel de metadatos de archivo/carpeta

---

## Bugs corregidos
- **`listRoot` tipo incorrecto** — devolvía `FolderDto[]` pero el backend retorna `FolderContents`; corregido en `folders.service.ts`
- **`currentFolder` nulo en raíz** — `useFolders` ignoraba el `folder` del response en raíz; ahora unificado con subfolder
- **`parentId: null` al crear en raíz** — ExplorerPage ahora deriva `activeFolderId = currentFolder?.id` y lo usa en `createFolder` y `useFiles`
- **DeleteModal no cerraba** — `onDelete` no llamaba `closeModal()`; corregido en ExplorerPage

## Decisiones tomadas
- **Badge:** pospuesto — se extrae solo si el patrón se repite en FileItem/MetadataPanel
- **Recientes y Papelera:** eliminados del sidebar — no disponibles en backend
- **Almacenamiento:** se construye visual con props hardcodeadas; se conecta cuando backend lo exponga
- **Avatar:** mock "JL" por ahora, se conecta con datos reales del usuario después
- **Búsqueda:** input deshabilitado visualmente, funcionalidad no disponible aún
- **Streaming:** `downloadFile` usa Blob — deuda técnica para archivos grandes, fase futura
