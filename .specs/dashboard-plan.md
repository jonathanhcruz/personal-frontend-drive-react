# Plan: Esqueleto del Dashboard

## Estructura de carpetas
Los componentes del dashboard son específicos de la página explorer — van colocados junto a ella:

```
src/
  pages/
    explorer/
      components/
        Sidebar/
          Sidebar.tsx
          Sidebar.module.scss
          Sidebar.types.ts
          index.ts
        DriveTopbar/
          DriveTopbar.tsx
          DriveTopbar.module.scss
          DriveTopbar.types.ts
          index.ts
        DriveContent/
          DriveContent.tsx
          DriveContent.module.scss
          DriveContent.types.ts
          index.ts
      ExplorerPage.tsx
      ExplorerPage.module.scss
```

## Layout general

```
┌─────────────┬──────────────────────────────────────────┐
│   Sidebar   │              drive-main                  │
│  ~220px     │                                          │
│  fijo       │  ┌──────────────────────────────────┐   │
│             │  │         DriveTopbar               │   │
│  Logo sm +  │  │  breadcrumb · search · toggle ·   │   │
│  PRIVATE    │  │  + Subir · avatar JL              │   │
│  DRIVE      │  ├──────────────────────────────────┤   │
│             │  │         DriveContent              │   │
│  Mi Drive   │  │  título · metadata                │   │
│  Compartido │  │  CARPETAS → placeholders          │   │
│             │  │  ARCHIVOS → placeholders          │   │
│  ─────────  │  └──────────────────────────────────┘   │
│  Storage    │                                          │
└─────────────┴──────────────────────────────────────────┘
```

## BEM blocks
| Componente    | Bloque BEM      |
|---------------|-----------------|
| ExplorerPage  | `.explorer`     |
| Sidebar       | `.sidebar`      |
| DriveTopbar   | `.drive-topbar` |
| DriveContent  | `.drive-content`|

---

## Fase 1 — `Sidebar` ⏳

**Responsabilidad:** columna izquierda fija. No recibe props de data — autónomo.

**Contenido:**
- Brand: `<Logo size="sm" />` + texto "PRIVATE" / "DRIVE" (dos líneas)
- Nav: `<NavLink to="/drive">Mi Drive</NavLink>` + `<NavLink to="/shared">Compartidos</NavLink>` con active state
- Storage: barra de progreso + "ALMACENAMIENTO · 37%" + "18.4 GB / 30 GB" (hardcodeado)

**Props:** ninguna por ahora (storage se hardcodea)

**Validación:** `tsc --noEmit`

---

## Fase 2 — `DriveTopbar` ⏳

**Responsabilidad:** barra superior del área principal.

**Props:**
```ts
interface DriveTopbarProps {
  breadcrumb: BreadcrumbItem[];
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  onUpload: () => void;
}
```

**Contenido:**
- Breadcrumb: items separados por `›`
- Search: `<input disabled placeholder="Buscar..." />`
- Toggle: dos botones icono (grid/list) — el activo resaltado
- Botón "+ Subir" variant primary
- Avatar: `<div>JL</div>` mock

**Validación:** `tsc --noEmit`

---

## Fase 3 — `DriveContent` ⏳

**Responsabilidad:** área de contenido scrolleable.

**Props:**
```ts
interface DriveContentProps {
  folderName: string;
  subfolders: FolderDto[];
  files: FolderFile[];
  viewMode: 'grid' | 'list';
  onNewFolder: () => void;
}
```

**Contenido:**
- Título: nombre de la carpeta (o "Mi Drive" si es raíz)
- Metadata: "X carpetas · Y archivos"
- Botón "Nueva carpeta" (ghost o secondary)
- Sección "CARPETAS": label + grid de placeholders (`FolderItem` pendiente)
- Sección "ARCHIVOS": label + grid/lista de placeholders (`FileItem` pendiente)

**Validación:** `tsc --noEmit`

---

## Fase 4 — `ExplorerPage` ensamblaje ⏳

**Responsabilidad:** shell de dos columnas, owns el estado.

**Estado local:**
- `viewMode: 'grid' | 'list'` — default `'grid'`

**Conecta hooks:**
- `useFolders(folderId)` → pasa `breadcrumb`, `subfolders`, `files`, `currentFolder` a los componentes
- `useFiles(folderId)` → `uploadFile` se pasa a `DriveTopbar.onUpload`

**Estructura JSX:**
```tsx
<div className={styles['explorer']}>
  <Sidebar />
  <main className={styles['explorer__main']}>
    <DriveTopbar breadcrumb={...} viewMode={viewMode} onViewChange={setViewMode} onUpload={...} />
    <DriveContent folderName={...} subfolders={...} files={...} viewMode={viewMode} onNewFolder={...} />
  </main>
</div>
```

**Validación:** `tsc --noEmit` + verificación visual en browser

---

## Siguientes pasos (después del esqueleto)
1. `Modal` — para crear carpeta, renombrar, confirmar eliminación
2. `FolderItem` + `FolderGrid` — reemplaza placeholders en DriveContent
3. `FileItem` — reemplaza placeholders en DriveContent
4. `UploadPanel` — reemplaza trigger de onUpload
5. `SharePanel` + `MetadataPanel`
6. `ContextMenu` — click derecho en FolderItem/FileItem
