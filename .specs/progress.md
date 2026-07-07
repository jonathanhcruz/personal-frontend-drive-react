# Estado de construcción

_Última actualización: 2026-07-07_

## Completado ✅

### Infraestructura
- `src/styles/` — variables, mixins, reset, global
- `src/lib/axios.ts` — axiosInstance + interceptor de auth + SKIP_REFRESH_URLS
- `src/lib/queryClient.ts` — QueryClient (staleTime 30s, retry 1, no refetchOnWindowFocus)
- `src/lib/queryKeys.ts` — query keys centralizadas
- `src/types/api.types/` — login.ts, files.ts, folders.ts, index.ts
- `src/routes/router.tsx` — rutas `/login`, `/`, `/drive`, `/drive/:folderId`, `/shared`; layout route con `DashboardLayout`
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
- `src/hooks/useTopbar.ts` — hook que usan las páginas para inyectar `left`/`right` en el topbar del layout vía `TopbarContext`; usa `useLayoutEffect` para evitar flash visual

### Layout — DashboardLayout
- `src/layouts/DashboardLayout/TopbarContext.tsx` — `TopbarConfig { left, right? }` · `TopbarProvider` · `useTopbarContext`; patrón provider+shell para evitar consumir el context en el mismo componente que lo provee
- `src/layouts/DashboardLayout/DashboardLayout.tsx` — `TopbarProvider` wrappea `LayoutShell`; shell renderiza `<Sidebar>` + `<AppTopbar>` + `<Outlet>`
- `src/components/AppTopbar` — topbar genérico con slots `left`/`right` como `ReactNode`; search y avatar siempre fijos; BEM `.app-topbar`

### Dashboard — shell
- `src/components/Sidebar` — Logo sm + brand PRIVATE/DRIVE + NavLinks + barra de almacenamiento (hardcoded); NAV_ITEMS en `Sidebar/constants/index.ts`
- `src/components/DriveContent` — heading con título/meta + "Nueva carpeta" + sección CARPETAS + sección ARCHIVOS + estado vacío
- `src/components/DriveTopbar` — **pendiente de borrar**; reemplazado por `AppTopbar` + slots internos de `ExplorerPage`

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
- `src/pages/ExplorerPage/index.tsx` — usa `useTopbar` para inyectar `BreadcrumbNav` + `ExplorerTopbarActions`; ya no renderiza `<Sidebar>` ni `<DriveTopbar>`; solo contenido + modals + context menu
  - `BreadcrumbNav.tsx` — breadcrumb con `<Link>` funcionales; root → `/drive`; intermedios → `/drive/:id`; último item sin link · BEM `.breadcrumb-nav`
  - `ExplorerTopbarActions.tsx` — view-toggle (grid/list) + botón Subir · BEM `.explorer-topbar-actions`
- `src/pages/SharedPage/index.tsx` — placeholder; usa `useTopbar({ left: <span>Compartidos</span> })`

---

## Pendiente ⏳

### Limpieza post-refactor
- Borrar `src/components/DriveTopbar/` — reemplazado por `AppTopbar`; pendiente confirmación visual

### SharedPage — contenido real
- Definir qué muestra (archivos compartidos por el usuario, o compartidos con el usuario)
- Conectar con backend — puede requerir endpoint nuevo `GET /api/shares` si no existe
- Implementar `SharedContent` — lista de archivos con sus tokens activos

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
- **Breadcrumb no navegable** — items eran `<span>` sin link; reemplazados por `<Link>` en `BreadcrumbNav`

## Decisiones tomadas
- **Badge:** pospuesto — se extrae solo si el patrón se repite en FileItem/MetadataPanel
- **Recientes y Papelera:** eliminados del sidebar — no disponibles en backend
- **Almacenamiento:** se construye visual con props hardcodeadas; se conecta cuando backend lo exponga
- **Avatar:** mock "JL" por ahora, se conecta con datos reales del usuario después
- **Búsqueda:** input deshabilitado visualmente, funcionalidad no disponible aún
- **Streaming:** `downloadFile` usa Blob — deuda técnica para archivos grandes, fase futura
- **TopbarContext scope:** context scoped al `DashboardLayout` (no global) — solo páginas dentro del layout lo necesitan; Redux y context global descartados por overkill
- **AppTopbar:** presentacional puro (recibe props), no consume el context directamente — `LayoutShell` es el intermediario
