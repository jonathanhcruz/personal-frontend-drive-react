# Feature — Share

## Contexto

El share vive dentro del `ExplorerPage`. No tiene página propia ni ruta en el frontend.
La descarga pública ocurre directamente contra el backend (`GET /api/share/:token`) — el frontend no interviene.

---

## Flujo completo

```
Usuario abre ContextMenu de un archivo
  → click "Compartir"
    → abre SharePanel (modal/popover)
      → carga tokens activos del archivo
        → usuario genera nuevo link o revoca existente
          → copia URL y la comparte externamente
            → receptor descarga desde backend directamente
```

---

## Componentes

### `SharePanel`
- Modal o drawer lateral (decidir en implementación según diseño)
- Se abre desde ContextMenu del archivo
- Recibe `fileId` como prop
- Tiene dos secciones:
  1. Lista de tokens activos
  2. Botón "Generar nuevo link"

#### Lista de tokens activos
- Cada token muestra:
  - URL copiable: `{VITE_API_URL}/api/share/{token}`
  - Tiempo restante hasta expiración (ej: "expira en 6h", "expira en 23 min")
  - Botón [Copiar] — copia la URL al clipboard
  - Botón [Revocar] — elimina el token con confirmación
- Estado vacío: "No hay links activos. Genera uno nuevo."

#### Botón "Generar nuevo link"
- Llama `POST /api/files/:id/share`
- El nuevo token aparece en la lista inmediatamente
- Un archivo puede tener múltiples tokens activos simultáneos

---

## Hooks (`src/hooks/useShare.ts` o `SharePanel.hooks.ts`)

### `useShareTokens(fileId: string)` — `useQuery`
```
GET /api/files/:id/share
queryKey: ['share', fileId]
Solo activo cuando el panel está abierto
```

### `useCreateShareToken(fileId: string)` — `useMutation`
```
POST /api/files/:id/share
onSuccess: invalidateQueries(['share', fileId])
```

### `useRevokeShareToken()` — `useMutation`
```
DELETE /api/files/share/:tokenId
onSuccess: invalidateQueries(['share', fileId])
```

---

## Service (`share.service.ts`)

```typescript
getShareTokens(fileId: string): Promise<ShareToken[]>
createShareToken(fileId: string): Promise<ShareToken>
revokeShareToken(tokenId: string): Promise<void>
```

---

## URL del link compartido

```
{VITE_API_URL}/api/share/{token}
```

`VITE_API_URL` viene de variable de entorno. Ejemplo:
```
https://drive.mi-dominio.com/api/share/abc123def456
```

El receptor abre esa URL en el navegador → el backend sirve el archivo directamente → el frontend no carga.

---

## Expiración de tokens

- Cada token expira 8 horas después de su creación (definido en el backend)
- El panel calcula el tiempo restante en cliente: `expiresAt - now()`
- Si el tiempo restante < 30 min → mostrar en rojo o con aviso visual
- Tokens expirados no aparecen en la lista (el backend solo devuelve activos)

---

## Tokens de un solo uso

El token se consume en la primera descarga. El panel no refleja esto en tiempo real (no hay websocket). Si el usuario quiere saber si fue usado, no hay forma desde el frontend — limitación conocida y aceptada.

---

## Errores a manejar

| Código backend | Situación | UI |
|---|---|---|
| `FILE_NOT_FOUND` | Archivo eliminado mientras el panel estaba abierto | Toast + cierra panel |
| `SHARE_TOKEN_NOT_FOUND` | Token ya revocado (doble click) | Refresca lista silencioso |
| `FORBIDDEN` | Archivo no pertenece al usuario | Toast error |

---

## Endpoints usados

| Método | Ruta | Cuándo |
|---|---|---|
| GET | `/api/files/:id/share` | Al abrir el SharePanel |
| POST | `/api/files/:id/share` | Botón "Generar nuevo link" |
| DELETE | `/api/files/share/:tokenId` | Botón "Revocar" por token |
