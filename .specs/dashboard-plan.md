# Plan: Dashboard

## Estructura de carpetas (estado actual)

```
src/
  layouts/
    DashboardLayout/  ✅  DashboardLayout.tsx · TopbarContext.tsx · DashboardLayout.module.scss
  components/
    AppTopbar/        ✅  slots left/right · search fijo · avatar fijo · BEM .app-topbar
    BreadcrumbNav/    ✅  links funcionales · truncación MAX_VISIBLE=4 · BEM .breadcrumb-nav
    Button/           ✅  primary/secondary/ghost/danger · sm/md/lg · loading · icons
    ContextMenu/      ✅  portal · Esc/click fuera · variante danger
    DriveContent/     ✅
    ExplorerTopbarActions/ ✅  view-toggle grid/list · botón Subir · BEM .explorer-topbar-actions
    FileItem/         ✅  EXTENSION_COLORS en constants/
    FolderItem/       ✅
    Input/            ✅  TextInput · password toggle · size variants · error state
    Logo/             ✅  dot animado · sm/md/lg
    MetadataPanel/    🏗️  scaffold vacío — pendiente implementar
    Modal/            ✅  CreateFolderModal · RenameModal · DeleteModal
    SharePanel/       ✅  modal compartir · useShare interno · copiar token · revocar enlaces
    Sidebar/          ✅  NAV_ITEMS en constants/
    Spinner/          ✅  sm/md/lg · primary/muted
    UploadPanel/      🏗️  scaffold vacío — pendiente implementar
  hooks/
    useAuth.ts        ✅
    useFiles.ts       ✅
    useFolders.ts     ✅
    useShare.ts       ✅
    useTopbar.ts      ✅
  pages/
    LoginPage/        ✅
    ExplorerPage/     ✅  solo index.tsx — BreadcrumbNav y ExplorerTopbarActions en components/
    SharedPage/       ⏳  placeholder · contenido real pendiente
  services/
    auth.service.ts   ✅
    files.service.ts  ✅  incluye share endpoints
    folders.service.ts ✅
    share.service.ts  ✅  getPublicDownloadUrl helper
  types/
    api.types/        ✅  login · files · folders · index (re-exporta ui.types)
    ui.types.ts       ✅  ViewMode = 'grid' | 'list'
```

## Layout general

```
┌─────────────┬──────────────────────────────────────────┐
│   Sidebar   │              drive-main                  │
│  ~220px     │                                          │
│  fijo       │  ┌──────────────────────────────────┐   │
│             │  │           AppTopbar               │   │
│  Logo sm +  │  │  left slot · search · avatar JL  │   │
│  PRIVATE    │  ├──────────────────────────────────┤   │
│  DRIVE      │  │         DriveContent              │   │
│             │  │  título · metadata                │   │
│  Mi Drive   │  │  CARPETAS → FolderItem            │   │
│  Compartido │  │  ARCHIVOS → FileItem              │   │
│             │  └──────────────────────────────────┘   │
│  ─────────  │                                          │
│  Storage    │                                          │
└─────────────┴──────────────────────────────────────────┘
```

## BEM blocks
| Componente          | Bloque BEM                  |
|---------------------|-----------------------------|
| ExplorerPage        | `.explorer`                 |
| Sidebar             | `.sidebar`                  |
| AppTopbar           | `.app-topbar`               |
| DriveContent        | `.drive-content`            |
| ContextMenu         | `.context-menu`             |
| Modal               | `.modal`                    |
| SharePanel          | `.share-panel`              |
| FolderItem          | `.folder-item`              |
| FileItem            | `.file-item`                |
| BreadcrumbNav       | `.breadcrumb-nav`           |
| ExplorerTopbarActions | `.explorer-topbar-actions`|

---

## Fase 1 — `Sidebar` ✅
Columna izquierda fija. Autónoma (no recibe props de data).
- Brand: `<Logo size="sm" />` + texto "PRIVATE" / "DRIVE"
- Nav: NavLinks Mi Drive / Compartidos con active state
- Storage: barra de progreso + datos hardcodeados

---

## Fase 2 — `AppTopbar` ✅
Reemplaza al anterior `DriveTopbar` (eliminado). Puramente presentacional.
- Slots `left` / `right` como `ReactNode`
- Search y avatar siempre fijos
- `ExplorerPage` inyecta `BreadcrumbNav` en `left` y `ExplorerTopbarActions` en `right` vía `useTopbar`

---

## Fase 3 — `DriveContent` ✅
Área de contenido scrolleable.
- Título + metadata (X carpetas · Y archivos)
- Botón "Nueva carpeta"
- Secciones CARPETAS / ARCHIVOS con FolderItem / FileItem

---

## Fase 4 — `ExplorerPage` ensamblaje ✅
Shell de la vista principal. Owns estado `viewMode` + `modal` + `contextMenu`.

**ModalState:**
```ts
| { type: 'create-folder' }
| { type: 'rename-folder'; id: string; name: string }
| { type: 'delete-folder'; id: string; name: string }
| { type: 'delete-file';   id: string; name: string }
| { type: 'share-file';    id: string; name: string }
```

**Menú contextual de archivos:** Compartir · Descargar · Eliminar  
**Menú contextual de carpetas:** Renombrar · Eliminar

---

## Fase 5 — `SharePanel` ✅
Modal para compartir archivos individuales.
- Usa `useShare(fileId)` internamente
- Lista enlaces activos con fecha creación/expiración + botón revocar
- Botón "Crear enlace" → muestra URL con botón copiar (feedback "Copiado" 2s)
- `createdUrl` se resetea al cambiar de `fileId`
- ⚠️ Pendiente verificar: URL usa `/api/files/share/${token}`; `share.service.ts` tiene helper con `/api/share/${token}` — puede ser que difieran el endpoint público vs. autenticado

---

## Siguientes pasos
1. `SharedPage` ⏳ — contenido real (definir endpoint backend, implementar `SharedContent`)
2. `UploadPanel` ⏳ — overlay progreso de subida (scaffold existe)
3. `MetadataPanel` ⏳ — metadatos de archivo/carpeta (scaffold existe)
4. ⚠️ Verificar URL pública de share (`/api/share/` vs. `/api/files/share/`)
