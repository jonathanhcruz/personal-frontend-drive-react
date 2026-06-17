# Feature — Auth

## Páginas y rutas

| Ruta | Componente | Protegida |
|---|---|---|
| `/login` | `LoginPage` | No |
| `/drive*` | `ExplorerPage` vía `ProtectedRoute` | Sí |

---

## Componentes

### `LoginPage`
- Formulario: email + contraseña
- Botón submit con estado loading
- Mensaje de error si credenciales incorrectas (`INVALID_CREDENTIALS`)
- Redirect automático a `/drive` si ya hay sesión activa

### `ProtectedRoute`
- Wrapper que verifica si hay sesión válida
- Sin sesión → redirect a `/login`
- Con sesión → renderiza el children (la página protegida)
- Mientras verifica → spinner de carga (evita flash de redirect)

---

## Hooks

### `useLogin` — `useMutation`
```
POST /api/auth/login
body: { email, password }
onSuccess: guarda tokens → navega a /drive
onError: muestra mensaje según error.code
```

### `useLogout` — `useMutation`
```
POST /api/auth/logout
body: { refreshToken }
onSuccess: limpia tokens → navega a /login
onSettled: limpia tokens igual (aunque falle el endpoint)
```

### `useSession`
- Expone `isAuthenticated`, `accessToken`, usuario actual
- Usado por `ProtectedRoute` y el interceptor de axios

---

## Services (`auth.service.ts`)

```typescript
login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>
refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>
logout(refreshToken: string): Promise<void>
```

---

## Flujo de sesión

### Login
```
LoginForm submit
  → useLogin (useMutation)
    → auth.service.login()
      → POST /api/auth/login
        → guarda accessToken en memoria (AuthContext)
        → guarda refreshToken en localStorage
        → navega a /drive
```

### Persistencia entre recargas
```
App mount
  → lee refreshToken de localStorage
  → si existe → auth.service.refresh()
    → actualiza accessToken en memoria
    → ProtectedRoute permite acceso
  → si no existe o falla → redirect /login
```

### Token expirado durante sesión
```
Request cualquiera → 401
  → interceptor axios intenta refresh automático
  → reintenta request original con nuevo accessToken
  → si refresh falla → limpia localStorage → redirect /login
```

### Logout
```
useLogout.mutate()
  → POST /api/auth/logout (con refreshToken)
  → limpia accessToken de memoria
  → limpia refreshToken de localStorage
  → redirect /login
```

---

## Almacenamiento de tokens

| Token | Dónde | Por qué |
|---|---|---|
| Access token | Memoria (React Context) | No persiste, se renueva solo |
| Refresh token | `localStorage` | Necesita sobrevivir recarga — sistema personal, tradeoff aceptado |

---

## Errores a manejar

| Código backend | Qué muestra el UI |
|---|---|
| `INVALID_CREDENTIALS` | "Email o contraseña incorrectos" |
| `VALIDATION_ERROR` | "Completa todos los campos" |
| `INTERNAL_ERROR` | "Error del servidor, intenta de nuevo" |

Rate limiting del backend (20 intentos / 15 min) → llega como `429` → "Demasiados intentos, espera unos minutos"

---

## Endpoints usados

| Método | Ruta | Cuándo |
|---|---|---|
| POST | `/api/auth/login` | Submit del formulario |
| POST | `/api/auth/refresh` | Interceptor 401 + persistencia en mount |
| POST | `/api/auth/logout` | Acción de logout del usuario |
