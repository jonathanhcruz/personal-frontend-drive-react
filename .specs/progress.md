# Estado de construcción

_Última actualización: 2026-07-14 (sesión 5)_

## Completado ✅

### Infraestructura
- `src/styles/` — variables, mixins, reset, global
- `src/lib/axios.ts` — axiosInstance + interceptor de auth + SKIP_REFRESH_URLS
- `src/lib/queryClient.ts` — QueryClient (staleTime 30s, retry 1, no refetchOnWindowFocus)
- `src/lib/queryKeys.ts` — query keys centralizadas
- `src/types/api.types/` — login.ts, files.ts, folders.ts, index.ts (re-exporta ui.types)
- `src/types/ui.types.ts` — `ViewMode = 'grid' | 'list'`
- `src/routes/router.tsx` — rutas `/login`, `/`, `/drive`, `/drive/:folderId`, `/shared`; layout route con `DashboardLayout`
- `src/routes/ProtectedRoute.tsx`

### Servicios
- `src/services/auth.service.ts`
- `src/services/files.service.ts` — upload · list · getById · download · delete · renameFile · moveFile + share endpoints (listShares · createShare · revokeShare); `uploadFile` acepta `onUploadProgress?: (percent: number) => void` vía Axios
- `src/services/folders.service.ts` — `listRoot` (→ `FolderDto[]`) · `getFolderContents` · `getBreadcrumb` · `createFolder` · `renameFolder` · `moveFolder` · `deleteFolder`
- `src/services/share.service.ts` — `getPublicDownloadUrl(token)` helper: `${VITE_BACKEND_URL}/api/share/${token}`

### Hooks
- `src/hooks/useAuth.ts` — login/logout mutations, token solo en memoria
- `src/hooks/useFolders.ts` — query contenido unificado (`FolderContents` raíz y subfolder) + breadcrumb + mutations create/rename/delete; `currentFolder` disponible en raíz
- `src/hooks/useFiles.ts` — mutations upload/delete/download; invalida queryKeys.folders al mutar
- `src/hooks/useShare.ts` — query listShares + mutations createShare/revokeShare; scoped a `fileId`
- `src/hooks/useTopbar.ts` — inyecta `left`/`right` en el topbar del layout vía `TopbarContext`; usa `useLayoutEffect`
- `src/hooks/useUploadQueue.ts` — cola de uploads: `enqueue(files, actualFolderId, paramFolderId?)` lanza uploads en paralelo con progreso por callback; invalida query correcta distinguiendo raíz vs. subcarpeta; `clearCompleted()` limpia done/error
- `src/hooks/useSharedFiles.ts` — `useQuery` sobre `listAllShares()` (key `['shares', 'all']`) + `useMutation` revokeShare con invalidación

### Componentes base
- `src/components/Button` — variantes primary/secondary/ghost/danger · tamaños sm/md/lg · loading · iconStart/iconEnd
- `src/components/Input` — `TextInput` con password toggle · size variants · error state · iconStart/iconEnd
- `src/components/Logo` — dot animado · variantes sm/md/lg
- `src/components/Spinner` — tamaños sm/md/lg · colores primary/muted

### Layout — DashboardLayout
- `src/layouts/DashboardLayout/TopbarContext.tsx` — `TopbarConfig { left, right? }` · `TopbarProvider` · `useTopbarContext`
- `src/layouts/DashboardLayout/DashboardLayout.tsx` — `TopbarProvider` wrappea `LayoutShell`; shell renderiza `<Sidebar>` + `<AppTopbar>` + `<Outlet>`
- `src/components/AppTopbar` — topbar genérico con slots `left`/`right` como `ReactNode`; search y avatar fijos; BEM `.app-topbar`

### Dashboard — shell
- `src/components/Sidebar` — Logo sm + brand PRIVATE/DRIVE + NavLinks + barra de almacenamiento (hardcoded); NAV_ITEMS en `constants/`
- `src/components/DriveContent` — heading con título/meta + "Nueva carpeta" + sección CARPETAS + sección ARCHIVOS + estado vacío

### Componentes de navegación
- `src/components/BreadcrumbNav` — breadcrumb con `<Link>` funcionales; truncación MAX_VISIBLE=4 (root + … + últimos 3); BEM `.breadcrumb-nav`
- `src/components/ExplorerTopbarActions` — view-toggle grid/list + botón Subir; BEM `.explorer-topbar-actions`

### Componentes de contenido
- `src/components/FolderItem` — icono HiFolder (accent) + nombre truncado + botón HiDotsVertical (hover) · `viewMode` · `--list` modifier
- `src/components/FileItem` — badge coloreado por extensión (constants) + nombre truncado + tamaño + fecha + botón HiDotsVertical · `viewMode` · `--list` modifier (layout horizontal: badge | nombre+meta | ⋮)

### Componentes globales — Modal
- `src/components/Modal` — base con portal + cierre por Esc/overlay click · BEM `.modal`
- `src/components/Modal/CreateFolderModal` — input controlado + Enter confirma + llama `createFolder`
- `src/components/Modal/RenameModal` — input pre-cargado + deshabilita guardar si sin cambio + llama `renameFolder`
- `src/components/Modal/DeleteModal` — confirmación `variant="danger"` · cubre carpeta y archivo · cierra al confirmar

### Componentes globales — ContextMenu
- `src/components/ContextMenu` — menú flotante portal · cierre por Esc/click fuera · BEM `.context-menu` · variante `danger`
- Carpeta: Renombrar → `ModalState rename-folder` · Eliminar → `ModalState delete-folder`
- Archivo: Compartir → `ModalState share-file` · Descargar → `downloadFile` · Eliminar → `ModalState delete-file`

### Componentes globales — SharePanel ✅
- `src/components/SharePanel` — modal de compartir · reutiliza `Modal` base · `useShare(fileId)` interno
- Lista enlaces activos con fecha creación/expiración + botón revocar por enlace
- Botón "Crear enlace" → muestra URL copiable con feedback "Copiado" 2s
- Estado `createdUrl` se resetea al cambiar `fileId`
- URL construida como `${VITE_BACKEND_URL}/api/files/share/${token}`

### Componentes globales — UploadPanel ✅
- `src/components/UploadPanel` — overlay fixed bottom-right · BEM `.upload-panel`
- Usa `useUploadQueue` (no `useFiles.uploadFile`) — cola independiente por sesión
- Header dinámico: "Subiendo N archivos…" / "N subidos" / "N subidos · M con error"
- Lista scrolleable (máx 260px) con nombre + barra de progreso animada (Axios `onUploadProgress`)
- Iconos: spinner CSS (uploading) · HiCheck verde (done) · HiExclamation rojo (error)
- Botón "×" → `clearCompleted()` — solo cierra si no hay uploads activos
- `<input type="file" multiple>` en ExplorerPage — soporta selección múltiple

### Páginas
- `src/pages/LoginPage/index.tsx` — diseño completo
- `src/pages/ExplorerPage/index.tsx` — usa `useTopbar`; `ModalState` incluye share-file; `fileMenuItems` tiene Compartir/Descargar/Eliminar; `<input multiple>`; `useFiles(folderId)` recibe param URL (no UUID) para invalidación correcta
- `src/pages/SharedPage/index.tsx` — lista real via `useSharedFiles`; copiar enlace con feedback 2s; revocar con botón papelera; estados vacío y loading

---

### Componentes globales — SharedPage ✅
- `src/pages/SharedPage` — lista todos los shares del usuario via `GET /api/files/shares`
- `ShareWithFile` tipo en `api.types/files.ts` — extiende share con `fileName`, `token`, `fileId`
- `listAllShares()` en `files.service.ts` — `GET /api/files/shares`
- `queryKeys.shares.all = ['shares', 'all']`
- Copiar enlace público (`getPublicDownloadUrl(token)`) con feedback "Copiado" 2s
- Revocar enlace con botón papelera — deshabilita durante mutación, invalida query al completar

---

## Pendiente ⏳

### MetadataPanel ⏳ (scaffold vacío)
- Panel lateral o modal con metadatos de archivo/carpeta
- Campos: nombre, tamaño, fecha creación, tipo MIME, propietario

---

## Bugs corregidos
- **`listRoot` tipo incorrecto** — devolvía `FolderDto[]` pero el backend retorna `FolderContents`; corregido en `folders.service.ts`
- **`currentFolder` nulo en raíz** — `useFolders` ignoraba el `folder` del response en raíz; ahora unificado con subfolder
- **`parentId: null` al crear en raíz** — ExplorerPage deriva `activeFolderId = currentFolder?.id`
- **DeleteModal no cerraba** — `onDelete` no llamaba `closeModal()`; corregido en ExplorerPage
- **Breadcrumb no navegable** — items eran `<span>` sin link; reemplazados por `<Link>` en `BreadcrumbNav`
- **UI no se actualizaba tras upload/delete** — mismatch de query keys: `useFiles(activeFolderId)` generaba key `['folders', uuid]` pero `useFolders(undefined)` en raíz usa `['folders', 'root']`; corregido pasando `folderId` (param URL) a `useFiles`; igual en `useUploadQueue.enqueue` con `paramFolderId` separado de `actualFolderId`

## Decisiones tomadas
- **Badge, Breadcrumb, FolderGrid:** eliminados — YAGNI; `FileItem` ya maneja el badge inline; `BreadcrumbNav` vive en ExplorerPage
- **Recientes y Papelera:** eliminados del sidebar — no disponibles en backend
- **Almacenamiento:** visual hardcodeado; se conecta cuando backend lo exponga
- **Avatar:** mock "JL"; se conecta con datos reales del usuario después
- **Búsqueda:** input deshabilitado visualmente; funcionalidad no disponible aún
- **Streaming:** `downloadFile` usa Blob — deuda técnica para archivos grandes, fase futura
- **TopbarContext scope:** scoped al `DashboardLayout`, no global
- **AppTopbar:** presentacional puro; `LayoutShell` es el intermediario con el context
- **DriveTopbar:** eliminado — reemplazado por AppTopbar + slots de ExplorerPage; `ViewMode` movido a `src/types/ui.types.ts`
- **SharePanel URL:** `/api/files/share/${token}` (autenticado, para SharePanel) vs. `/api/share/${token}` (público, `getPublicDownloadUrl` en share.service.ts) — son endpoints distintos por diseño
