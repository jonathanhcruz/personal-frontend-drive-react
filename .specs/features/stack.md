# Stack y convenciones

## Tech stack
- **Frontend:** React 19, TypeScript strict, Vite 8
- **Estado servidor:** TanStack Query v5
- **Routing:** React Router v6
- **Estilos:** SCSS Modules + metodología BEM
- **Iconos:** react-icons/hi (HeroIcons)
- **Backend:** NestJS en `localhost:3000` | Frontend en `localhost:5173`

## Diseño
- Tema oscuro. `bg: #0d1117`, acento `#00e5cc` (teal/cyan)
- Referencia visual: `Private Drive.pdf`

## Convenciones de componentes
- Props de texto: `label` (nunca `children` para texto plano)
- Iconos: `iconStart` / `iconEnd` — tipo `ReactElement | null`
- Extender atributos HTML nativos: `ButtonHTMLAttributes`, `InputHTMLAttributes`
- Barrel export en `index.ts` por cada componente

## CSS — BEM + SCSS Modules
- Bloque → `.nombre-bloque`
- Elemento → `.nombre-bloque__elemento`
- Modificador → `.nombre-bloque--modificador`
- En TSX: siempre bracket notation para clases con guiones: `styles['nombre-bloque__elemento']`
- `@use '../../styles/variables' as *` — nunca `@import`
- El nombre del bloque lo define el usuario antes de escribir el SCSS

## Mixins de uso obligatorio
- `@include no-select` en el bloque raíz de todo componente interactivo que no debe permitir selección de texto: `FileItem`, `FolderItem`, `BreadcrumbNav`, `Sidebar __nav-item`
- `@include truncate` para nombres de archivo/carpeta que pueden desbordar su contenedor

## Estructura de archivos por componente
```
ComponentName/
  ComponentName.tsx
  ComponentName.module.scss
  ComponentName.types.ts
  index.ts
```

## Tokens de estilos
- Variables: `src/styles/_variables.scss`
- Mixins: `src/styles/_mixins.scss`
- Reset: `src/styles/_reset.scss`
- Global: `src/styles/global.scss`

## Auth
- Token de acceso solo en memoria (`src/lib/axios.ts`) — nunca localStorage
- `SKIP_REFRESH_URLS` evita loop de reintento en endpoints de auth
- `useAuth` expone: `login`, `logout`, `isLoggingIn`, `loginError`

## Query keys centralizadas (`src/lib/queryKeys.ts`)
```ts
queryKeys.folders.root                  // ['folders', 'root']
queryKeys.folders.content(id)           // ['folders', id]
queryKeys.folders.breadcrumb(id)        // ['folders', id, 'breadcrumb']
queryKeys.shares.list(fileId)           // ['shares', fileId]
```
