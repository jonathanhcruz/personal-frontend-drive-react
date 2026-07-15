# Feature — Upload

## Contexto

El upload vive dentro del `ExplorerPage`. No tiene página propia.
Siempre sube a la carpeta actualmente abierta (`folderId` del URL o raíz).

---

## Puntos de entrada

| Trigger | Cómo | Dispositivo |
|---|---|---|
| Botón en toolbar | Click → file picker nativo | Desktop + Mobile |
| Drag & drop | Arrastra sobre la vista de carpeta | Solo Desktop |
| Menú contextual | Click derecho en espacio vacío → "Subir archivos" | Desktop |

Los tres métodos invocan el mismo flujo. Destino siempre = carpeta actual.

---

## Componentes

### `UploadPanel`
- Panel flotante
- **Desktop**: bottom-right, posición fija sobre el contenido
- **Mobile**: banner top, colapsable/expandible
- Muestra lista de archivos en progreso
- Cada item: nombre, barra de progreso, porcentaje, estado (subiendo / completado / error)
- Se colapsa manualmente o auto-desaparece N segundos después de que todos completen
- No bloquea la UI mientras sube

### `UploadTrigger` (dentro de toolbar)
- Botón que activa el `<input type="file">` oculto
- Permite selección múltiple (`multiple`)

### `DropZone` (overlay sobre FolderGrid)
- Invisible por defecto
- Al detectar `dragenter` → overlay visible con indicador
- Al soltar → inicia upload
- Al `dragleave` → overlay desaparece

---

## Hook (`UploadPanel.hooks.ts` o `src/hooks/useUpload.ts`)

### `useUpload(folderId: string)`

Usa `axios` directamente (no `useMutation`) para acceder a `onUploadProgress`.

```typescript
interface UploadItem {
  id: string          // generado en cliente para tracking
  file: File
  progress: number    // 0-100
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}
```

Flujo interno:
```
addFiles(files[])
  → por cada archivo:
    → estado 'uploading'
    → axios.post('/api/files/upload', formData, {
        params: { folderId },
        onUploadProgress: (e) → actualiza progress %
      })
    → onSuccess: estado 'done' → invalidateQueries(['folder', folderId])
    → onError: estado 'error' → guarda mensaje
```

Cada archivo sube de forma independiente (no en serie). El panel refleja el estado individual de cada uno.

---

## Service (`files.service.ts`)

```typescript
uploadFile(
  file: File,
  folderId: string,
  onProgress: (percent: number) => void
): Promise<File>
```

Implementación con axios:
```typescript
const formData = new FormData()
formData.append('file', file)

return axios.post('/api/files/upload', formData, {
  params: { folderId },
  onUploadProgress: (event) => {
    const percent = Math.round((event.loaded * 100) / (event.total ?? 1))
    onProgress(percent)
  }
})
```

---

## Comportamiento del panel por dispositivo

### Desktop
```
┌──────────────────────────────────┐  ← bottom-right, z-index alto
│ ↑ Subiendo 2 archivos...     [▾] │
│ video.mp4     [████░░░░] 47%     │
│ foto.jpg      [████████] ✓       │
└──────────────────────────────────┘
```
- `[▾]` colapsa la lista, el header sigue visible
- Desaparece automáticamente 3s después de completar todos

### Mobile
```
┌──────────────────────────────────┐  ← top, ancho completo
│ ↑ Subiendo 2 archivos...     [▾] │
│ video.mp4     [████░░░░] 47%     │
│ foto.jpg      [████████] ✓       │
└──────────────────────────────────┘
```
- Mismo comportamiento, posición diferente

---

## Post-upload

Cuando un archivo completa:
```
onSuccess
  → queryClient.invalidateQueries({ queryKey: ['folder', folderId] })
    → React Query refetch automático
      → GET /api/folders/:id (o raíz)
        → React agrega solo el nuevo item al DOM (reconciliación por key UUID)
```

No hay placeholder en la grilla. El archivo aparece cuando el backend confirma.

---

## Errores a manejar

| Código backend | Status | Qué muestra en el panel |
|---|---|---|
| `FILE_TOO_LARGE` | 413 | "Archivo demasiado grande" |
| `CONFLICT` | 409 | "Ya existe un archivo con ese nombre" |
| `NO_FILE` | 400 | "No se pudo leer el archivo" |
| `INTERNAL_ERROR` | 500 | "Error al subir, intenta de nuevo" |

Los errores se muestran inline en el item del panel, no como toast global.

---

## Endpoints usados

| Método | Ruta | Cuándo |
|---|---|---|
| POST | `/api/files/upload?folderId=:id` | Por cada archivo seleccionado/soltado |
