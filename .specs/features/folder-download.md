# Feature — Folder ZIP Download

**Estado:** ✅ Implementado

---

## Contexto

Descarga de una carpeta completa como archivo ZIP directamente desde el ContextMenu de cualquier carpeta en el explorador. No requiere página nueva ni modal — es una acción directa idéntica al patrón de descarga de archivos individual.

---

## Flujo completo

```
Usuario abre ContextMenu de una carpeta
  → click "Descargar"
    → folders.service.downloadFolder(id, name)
      → GET /api/folders/:id/download (stream ZIP)
        → Blob descargado → link temporal → descarga en el navegador
          → archivo guardado como "<nombre-carpeta>.zip"
```

---

## Cambios necesarios

### 1. `folders.service.ts` — nuevo método

```typescript
downloadFolder(id: string, name: string): Promise<void>
  // GET /api/folders/:id/download
  // responseType: blob
  // crea <a> temporal → click → revoke → igual que downloadFile en files.service.ts
```

El nombre del archivo descargado es `${name}.zip`. El backend ya envía el header `Content-Disposition` correcto, pero el Blob download del frontend usa el `name` recibido como parámetro para nombrar el archivo localmente.

### 2. `FolderItem` — ContextMenu

Agregar opción "Descargar" al menú contextual de carpetas, junto a las existentes (Renombrar | Mover a... | Eliminar).

| Acción | Comportamiento |
|--------|----------------|
| Descargar | Llama `downloadFolder(folder.id, folder.name)` directamente, sin modal |

---

## Service

```typescript
// folders.service.ts
async downloadFolder(id: string, name: string): Promise<void> {
  const response = await api.get(`/folders/${id}/download`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## Errores a manejar

| Código backend | Situación | UI |
|----------------|-----------|-----|
| `FOLDER_NOT_FOUND` | Carpeta eliminada mientras el menú estaba abierto | Toast error |
| `FORBIDDEN` | Carpeta no pertenece al usuario | Toast error |

---

## Endpoints usados

| Método | Ruta | Cuándo |
|--------|------|--------|
| GET | `/api/folders/:id/download` | Click "Descargar" en ContextMenu de carpeta |

---

## Notas

- Carpeta vacía → descarga un ZIP vacío (200 OK desde el backend). El frontend lo trata igual — no hay caso especial.
- Subcarpetas vacías sin archivos no aparecen en el ZIP (comportamiento del backend documentado).
- No hay indicador de progreso — el navegador muestra su barra de descarga nativa. La misma limitación aplica a `downloadFile`.
