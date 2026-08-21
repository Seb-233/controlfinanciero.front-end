# Control Financiero - Frontend

Base técnica y visual del frontend de **Control Financiero**, una plataforma moderna, sobria, accesible y enfocada en la gestión de finanzas personales, flujos de caja y registro rápido de transacciones desde atajos de iPhone.

---

## Stack Tecnológico

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) con Server Components por defecto.
- **UI Library**: [React 19](https://react.dev/).
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) con tipado estricto.
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) con `@tailwindcss/postcss` y tokens semánticos basados en variables CSS.
- **Autenticación**: [Firebase JavaScript SDK modular](https://firebase.google.com/) (Google Sign-In, aislamiento en cliente).
- **Pruebas Unitarias y de Componentes**: [Vitest](https://vitest.dev/) y [React Testing Library](https://testing-library.com/).
- **Linting**: [ESLint](https://eslint.org/) con configuración flat (`eslint.config.mjs`).

---

## Requisitos Previos

- **Node.js**: `v20.x` o superior (Recomendado `Node.js 24 LTS`).
- **npm**: `v10.x` o superior.

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Seb-233/controlfinanciero.front-end.git
   cd controlfinanciero.front-end
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno local:
   ```bash
   cp .env.example .env.local
   ```

---

## Variables de Entorno

El proyecto cuenta con validación estricta en tiempo de ejecución en `src/lib/env/env.ts`.

| Variable | Tipo | Descripción | Requerido en Modo Mock | Requerido en Producción |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_ENV` | `local` \| `preview` \| `production` | Entorno de ejecución de la aplicación | **Sí** | **Sí** |
| `NEXT_PUBLIC_API_BASE_URL` | `string` | URL base del backend REST (e.g. Cloudflare Tunnel o URL interna) | Opcional | **Sí** |
| `NEXT_PUBLIC_USE_MOCKS` | `boolean` (`true` \| `false`) | Activa datos simulados sin dependencias externas | **Sí** (`true`) | **Prohibido** (`false`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `string` | Llave de API del proyecto de Firebase | Opcional | **Sí** |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `string` | Dominio de autenticación de Firebase | Opcional | **Sí** |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `string` | ID del proyecto de Firebase | Opcional | **Sí** |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `string` | App ID del cliente web de Firebase | Opcional | **Sí** |

### Reglas de Seguridad en Variables de Entorno:
1. **Bloqueo en Producción**: Si `NEXT_PUBLIC_APP_ENV === 'production'`, el modo mock (`NEXT_PUBLIC_USE_MOCKS=true`) lanza un error inmediato impidiendo el despliegue.
2. **Inicialización Perezosa de Firebase**: Si `NEXT_PUBLIC_USE_MOCKS=true`, el SDK de Firebase **nunca se inicializa**, lo que permite levantar y probar la interfaz completa en desarrollo sin necesidad de credenciales.

---

## Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000`. |
| `npm run build` | Genera el empaquetado optimizado de producción. |
| `npm run start` | Inicia el servidor de producción compilado localmente. |
| `npm run lint` | Ejecuta el análisis estático de código con ESLint (`eslint .`). |
| `npm run typecheck` | Ejecuta la verificación de tipos de TypeScript (`tsc --noEmit`). |
| `npm run test` | Inicia el runner de pruebas en modo interactivo/watch con Vitest. |
| `npm run test:run` | Ejecuta la suite completa de pruebas unitarias y finaliza. |

---

## Estructura del Proyecto

```text
src/
├── app/                                 # App Router (páginas, layouts y rutas)
│   ├── (public)/
│   │   └── login/                       # Página de inicio de sesión con Google
│   ├── (protected)/
│   │   └── app/                         # Rutas protegidas por AuthGuard
│   │       ├── layout.tsx               # Layout protegido (AuthGuard -> AppShell -> Children)
│   │       ├── page.tsx                 # Dashboard principal
│   │       ├── accounts/                # Vista de cuentas financieras
│   │       ├── transactions/            # Vista de movimientos
│   │       ├── categories/              # Vista de categorías
│   │       └── settings/
│   │           └── shortcut-devices/    # Gestión del atajo de iPhone y dispositivos
│   ├── error.tsx                        # Manejador global de errores
│   ├── globals.css                      # Variables semánticas y Tailwind CSS
│   ├── layout.tsx                       # RootLayout con AuthProvider
│   ├── loading.tsx                      # Estado de carga global
│   ├── not-found.tsx                    # Página 404 accesible
│   └── page.tsx                         # Redirección cliente inteligente (/ -> /app o /login)
├── components/
│   ├── feedback/                        # EmptyState, ErrorState, LoadingState
│   ├── layout/                          # AppShell, Sidebar, Header, UserMenu, MobileNavigation
│   └── ui/                              # Button, Card, Input, Select, Badge, Skeleton, CurrencyAmount, PageHeader, AppLogo
├── features/
│   ├── auth/                            # Context, hooks, servicios y guards de autenticación
│   └── dashboard/                       # Componentes visuales y repositorios del dashboard
├── lib/
│   ├── api/                             # Cliente HTTP central (fetch con retry 401, timeout y rate limiting)
│   ├── env/                             # Validador seguro de variables de entorno
│   ├── firebase/                        # Inicialización modular y perezosa de Firebase
│   └── formatters/                      # Formateador central de moneda COP (es-CO)
└── types/                               # Definiciones de tipos y DTOs de dominio
```

---

## Arquitectura de Autenticación y Autorización

- **Autenticación (Firebase Auth)**: Identifica la identidad del usuario a través de Google Sign-In y emite un Firebase ID Token de corta duración.
- **Autorización (Backend Propio)**: El frontend **nunca** calcula saldos, límites ni decide roles. El backend local expuesto valida el ID Token en cada petición (`Authorization: Bearer <token>`) y aplica las políticas de seguridad y aislamiento por espacio de trabajo (*workspace*).
- **Cliente HTTP Resiliente**:
  - Inyecta automáticamente el token de Firebase actual.
  - Si recibe un `401 Unauthorized`, solicita de forma transparente un refresco forzado del token (`getIdToken(true)`) y reintenta la solicitud una única vez.
  - Si la solicitud reintentada vuelve a fallar, notifica el vencimiento de sesión de forma controlada y evita ciclos infinitos.
  - Gestiona `403 Forbidden` como denegación de permisos sin desautenticar al usuario.
  - Detecta límites de tasa `429 RateLimitError` leyendo el encabezado `Retry-After`.
  - Diferencia caídas del backend (`502`, `503`, `504`) permitiendo reintentar la conexión sin borrar el estado del usuario.

---

## Modelo Financiero y Manejo de Moneda

- **Unidad monetaria**: Pesos Colombianos (`COP`).
- **Locale**: `es-CO` / Zona horaria `America/Bogota`.
- **Valores enteros**: Todos los montos se transportan como números enteros menores (`amountMinor`, `balanceMinor`, etc.). En COP no se divide entre 100 ni se utilizan operaciones de punto flotante para dinero.
- **Formateo**: Se realiza centralizadamente a través de `formatCop()` en `src/lib/formatters/currency.ts`.

---

## Configuración para Despliegue en Vercel

Para desplegar este frontend en Vercel:

1. Importa el repositorio `controlfinanciero.front-end` en Vercel.
2. Configura el Framework Preset como **Next.js**.
3. En **Environment Variables**, configura:
   - `NEXT_PUBLIC_APP_ENV`: `preview` para ramas de staging / `production` para producción.
   - `NEXT_PUBLIC_USE_MOCKS`: `false` en producción (o `true` opcional en preview para demostraciones).
   - `NEXT_PUBLIC_API_BASE_URL`: URL HTTPS pública expuesta por Cloudflare Tunnel (ej. `https://api.tudominio.com`).
   - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`: Credenciales de tu aplicación web en la consola de Firebase.
4. Asegúrate de autorizar el dominio de Vercel en la consola de Firebase Auth (*Authentication > Settings > Authorized domains*).
