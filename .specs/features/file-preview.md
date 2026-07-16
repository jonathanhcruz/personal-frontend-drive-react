# Feature — File Preview

## Contexto

Vista previa de archivos directamente en el explorador sin necesidad de descargarlos.
Se abre haciendo click en un `FileItem` o desde una futura opción "Vista previa" en el ContextMenu.
El contenido se obtiene desde el mismo endpoint de descarga (`GET /api/files/:id/download`) y se carga en memoria como blob URL — sin exponer URLs firmadas ni requerir cambios en el backend.

---

## Fases

### Fase 1 — Imágenes ✅ (en desarrollo)
- Tipos: `image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/svg+xml`
- Render: `<img src={blobUrl}>`
- Trigger: click en `FileItem` si `mimeType.startsWith('image/')`

### Fase 2 — Texto y código ✅
- MIME: `text/*`, `application/json`, `application/xml`, `application/yaml`, `application/toml`, `application/sql`
- Extensiones (fallback): `.dart`, `.env`, `.yaml`, `.yml`, `.toml`, `.md`, `.sh`, `.sql`, `.ini`, `.cfg`, `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs`, `.dart`, y más (ver `src/utils/fileTypes.ts`)
- Render: `fetch(blobUrl).then(r => r.text())` + `<pre><code>` con scroll horizontal y vertical
- Sin syntax highlighting (posible mejora futura)
- Componente: `TextViewer.tsx`

### Fase 3 — PDF ✅
- Tipo: `application/pdf`
- Render: `pdfjs-dist` v6 — canvas por página, controles prev/next, escala 1.5x
- Componente: `PdfViewer.tsx`

### Fase 4 — Video y audio ✅
- Tipos: `video/mp4`, `video/webm`, `video/ogg`, `audio/mpeg`, `audio/wav`, `audio/ogg`, etc.
- Render: `<video controls>` / `<audio controls>` con blob URL como source
- Componente: `MediaViewer.tsx`

### Fase 5 — Fallback ⏳
- Tipos: todo lo no cubierto por fases anteriores
- Render: icono + "Vista previa no disponible para este tipo de archivo" + botón Descargar

---

## Componentes

### `FilePreviewModal`
- Modal de pantalla completa (o casi) con fondo oscuro
- Recibe `file: FolderFile | null`; si `null` → no renderiza nada
- Header: nombre del archivo + botón cerrar (×) + botón Descargar
- Body: renderiza según `mimeType` con el componente de viewer correspondiente
- Footer: vacío (las acciones van en el header)
- Limpia el blob URL con `URL.revokeObjectURL()` al cerrar (`useEffect` cleanup)

#### Viewers internos (sub-componentes o condicionales dentro del modal)

```
FilePreviewModal
  ├── ImageViewer     — Fase 1 — <img> centrado con max-width/max-height
  ├── TextViewer      — Fase 2 — <pre><code> con scroll
  ├── PdfViewer       — Fase 3 — <embed>
  ├── MediaViewer     — Fase 4 — <video> o <audio>
  └── UnsupportedView — Fase 5 — fallback con botón Descargar
```

---

## Hook — `useFileBlob`

```typescript
// src/hooks/useFileBlob.ts
useFileBlob(fileId: string | null): { blobUrl: string | undefined; isLoading: boolean; error: Error | null }
```

```
GET /api/files/:id/download  (responseType: 'blob')
queryKey: ['file-blob', fileId]
enabled: !!fileId
staleTime: 5 * 60 * 1000   // 5 min — raro que el contenido cambie mientras el modal está abierto
```

- Recibe el `Blob` de Axios y lo convierte a `URL.createObjectURL(blob)`
- El URL object se crea dentro del `select` o en el componente — la limpieza (`revokeObjectURL`) es responsabilidad del componente consumidor al desmontar

---

## Service

Función nueva en `files.service.ts`:

```typescript
getFileBlob(id: string): Promise<Blob>   // GET /api/files/:id/download con responseType: 'blob'
```

Distinto de `downloadFile` que dispara la descarga del browser — este solo devuelve el blob para que el componente lo maneje.

---

## Integración en ExplorerPage

### ModalState

```typescript
// Nuevo caso en el union type
| { type: 'preview-file'; file: FolderFile }
```

### Trigger

```typescript
// FileItem recibe onPreview?: () => void
// ExplorerPage pasa:
onPreview={file.mimeType.startsWith('image/') ? () => openPreview(file) : undefined}
```

En Fase 1 solo `image/*` dispara la acción. `FileItem` no muestra cursor pointer ni abre nada si `onPreview` es `undefined`.

---

## Flujo completo (Fase 1)

```
Usuario hace click en un FileItem de tipo imagen
  → ExplorerPage setModal({ type: 'preview-file', file })
    → FilePreviewModal se monta con isOpen=true
      → useFileBlob(file.id) dispara GET /api/files/:id/download (blob)
        → Axios retorna Blob
          → URL.createObjectURL(blob) → blobUrl
            → <img src={blobUrl}> muestra la imagen

Usuario cierra el modal (× o overlay)
  → isOpen=false
    → useEffect cleanup → URL.revokeObjectURL(blobUrl)
      → FilePreviewModal desmontado
```

---

## Errores a manejar

| Situación | UI |
|---|---|
| Archivo eliminado / 404 | Mensaje "No se pudo cargar la vista previa" + botón Descargar |
| `FORBIDDEN` | Toast error + cierra modal |
| Blob demasiado grande (timeout) | Spinner → error con botón Descargar como fallback |

---

## BEM block

| Componente | Bloque BEM |
|---|---|
| FilePreviewModal | `.file-preview` |

```
.file-preview
  .file-preview__header
  .file-preview__title
  .file-preview__actions
  .file-preview__body
  .file-preview__image         (ImageViewer)
  .file-preview__text          (TextViewer — Fase 2)
  .file-preview__unsupported   (Fase 5)
  .file-preview__loading
  .file-preview__error
```

---

## Endpoints usados

| Método | Ruta | Cuándo |
|---|---|---|
| GET | `/api/files/:id/download` | Al abrir el modal — carga blob en memoria |
