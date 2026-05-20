# PROJECT.md — Rincón TECH

## Descripción General

**Rincón TECH** es una plataforma e-commerce full-stack especializada en hardware de computación y productos tecnológicos. Está orientada al mercado local argentino, con integración a proveedores locales y pasarela de pago nacional.

---

## Stack Tecnológico

### Framework y Frontend
- **Next.js 15.1.4** — App Router, Server Components, Server Actions (`/app/actions`), rutas de API (`/app/api`)
- **React 19.0.0** — Con soporte nativo para Server Components y optimizaciones de concurrencia
- **TypeScript 5.x** — Tipado estático en todo el proyecto

### Estilos
- **Tailwind CSS 3.4.17** — Framework principal de estilos (`tailwind.config.ts`)
- **tailwindcss-animate** — Micro-animaciones y transiciones
- **clsx + tailwind-merge** — Combinación condicional de clases CSS

### Íconos
- **Lucide React 0.471.1** — Set de íconos vectoriales para React

### Base de Datos y ORM
- **Prisma ORM 6.2.1** — ORM principal (`prisma/schema.prisma`)
- **PostgreSQL** — Motor de base de datos (contenedor Docker)
- Modelos: usuarios, puntos de fidelidad, productos, imágenes de productos, categorías jerárquicas, órdenes/pedidos, envíos, reseñas, cupones, anuncios, garantías (RMA/DOA)

### Autenticación
- **Auth.js v5 (NextAuth v5.0.0-beta.30)** — Autenticación con App Router
- **@auth/prisma-adapter** — Persistencia de sesiones en PostgreSQL
- **bcryptjs 3.0.3** — Hashing de contraseñas

### Formularios y Validación
- **React Hook Form 7.71.1** — Gestión de formularios en cliente
- **Zod 4.3.6** — Validación de esquemas en cliente y servidor
- **@hookform/resolvers** — Integración RHF + Zod

### Integraciones Externas
- **MercadoPago SDK 2.12.0** — Pasarela de pagos local (Argentina)
- **ELIT API** — Proveedor de catálogo de productos (sincronización CSV)
- **SheetJS (xlsx 0.18.5)** — Procesamiento de archivos Excel para importaciones masivas

### Visualización
- **Recharts 3.6.0** — Gráficos interactivos para dashboards del panel admin

---

## Estructura de Directorios

```
/app
  /(shop)         → Tienda pública (cliente)
  /admin          → Panel de administración
  /actions        → Server Actions (operaciones servidor)
  /api            → Rutas de API REST
/prisma
  schema.prisma   → Modelos de base de datos
/components       → Componentes React reutilizables
/lib              → Utilidades, helpers, configuraciones
/public           → Assets estáticos
```

---

## Áreas Funcionales del Proyecto

### Tienda Pública `(shop)`
- Catálogo de productos con filtros y búsqueda
- Páginas de detalle de producto con imágenes y reseñas
- Carrito de compras y checkout
- Integración con MercadoPago para pagos online
- Sistema de cupones de descuento
- Programa de puntos de fidelidad

### Panel de Administración `/admin`
- CRUD completo de productos, categorías, banners y anuncios
- Gestión de órdenes/pedidos y envíos
- Dashboard con métricas y gráficos (Recharts)
- Importación masiva de productos desde Excel (SheetJS)
- Sincronización de catálogo con API ELIT (CSV → base de datos)
- Gestión de garantías (RMA/DOA)
- Simulador de costos MercadoPago

---

## Enfoque Actual de Desarrollo

**Optimización y performance** es la prioridad actual. Los agentes deben privilegiar:

- Reducción de re-renders innecesarios en componentes React
- Uso correcto de Server Components vs Client Components
- Optimización de queries Prisma (select fields, includes selectivos, índices)
- Caching con `unstable_cache`, `revalidatePath` y `revalidateTag` de Next.js
- Lazy loading e imágenes optimizadas con `next/image`
- Code splitting y dynamic imports donde corresponda
- Minimizar el tamaño del bundle del cliente

---

## Entorno de Desarrollo

- **IDE:** Antigravity IDE (multi-agente)
- **Base de datos local:** PostgreSQL en Docker
- **Gestor de paquetes:** npm
- **Plataforma:** Windows (PowerShell disponible para scripts)
