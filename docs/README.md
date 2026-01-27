# 📚 Documentación del Proyecto RTECH E-Commerce

Bienvenido a la documentación completa del sistema RTECH E-Commerce.

## 📖 Documentos Disponibles

### 1. [Manual Completo del Sistema](./MANUAL_COMPLETO.md)
**Descripción**: Documentación exhaustiva de todos los aspectos del sistema.

**Contenido**:
- ✅ Visión general del sistema
- ✅ Arquitectura técnica y stack tecnológico
- ✅ Modelo de datos completo con descripciones
- ✅ Módulos del sistema (Autenticación, Productos, Carrito, Checkout, etc.)
- ✅ Flujos de negocio detallados
- ✅ APIs y servicios (Server Actions, API Routes)
- ✅ Sistema de autenticación y autorización
- ✅ Integración con MercadoPago
- ✅ Sistema de envíos (Correo Argentino)
- ✅ Panel de administración completo
- ✅ Configuración y deployment
- ✅ Mantenimiento y troubleshooting

**Ideal para**: Desarrolladores nuevos en el proyecto, onboarding, referencia técnica

---

### 2. [Arquitectura y Diagramas](./ARQUITECTURA_Y_DIAGRAMAS.md)
**Descripción**: Representación visual de la arquitectura del sistema con diagramas Mermaid.

**Contenido**:
- 🎨 Diagrama de arquitectura general
- 🎨 Diagrama de componentes React
- 🎨 Flujos de usuario (navegación, compra, administración)
- 🎨 Diagramas de secuencia (checkout, envíos, actualización de precios)
- 🎨 Modelo de datos (ERD completo)
- 🎨 Estados de órdenes y envíos
- 🎨 Integraciones externas (MercadoPago, Correo Argentino)
- 🎨 Flujos de autenticación y seguridad
- 🎨 Estrategias de performance y caché
- 🎨 Pipeline de deployment

**Ideal para**: Entender visualmente el sistema, presentaciones, diseño de nuevas features

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos

1. **Lee primero**: [Manual Completo - Sección 1 y 2](./MANUAL_COMPLETO.md#1-visión-general-del-sistema)
2. **Revisa la arquitectura**: [Arquitectura General](./ARQUITECTURA_Y_DIAGRAMAS.md#arquitectura-general)
3. **Configura tu entorno**: [Manual - Sección 11.2](./MANUAL_COMPLETO.md#112-instalación-local)
4. **Explora el código**: Comienza con `app/page.tsx` y sigue los flujos

### Para Administradores del Sistema

1. **Panel de Admin**: [Manual - Sección 10](./MANUAL_COMPLETO.md#10-panel-de-administración)
2. **Configuraciones**: [Manual - Sección 10.5](./MANUAL_COMPLETO.md#105-configuraciones)
3. **Gestión de Órdenes**: [Manual - Sección 10.3](./MANUAL_COMPLETO.md#103-gestión-de-órdenes)

### Para Troubleshooting

1. **Problemas Comunes**: [Manual - Sección 12.2](./MANUAL_COMPLETO.md#122-problemas-comunes)
2. **Logs y Monitoreo**: [Manual - Sección 12.3](./MANUAL_COMPLETO.md#123-logs-y-monitoreo)

---

## 🏗️ Estructura del Proyecto

```
F:\RTECH\
├── app/                    # Next.js App Router
│   ├── (public)/          # Rutas públicas
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   └── actions/           # Server Actions
├── components/            # Componentes React
├── context/              # React Context
├── lib/                  # Utilidades y servicios
├── prisma/               # Prisma ORM
└── docs/                 # 📚 Esta documentación
```

---

## 🔑 Conceptos Clave

### Stack Tecnológico
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Next.js API Routes + Server Actions
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js v5
- **Pagos**: MercadoPago SDK
- **Estilos**: Tailwind CSS

### Flujo de Datos
1. Usuario interactúa con componentes React
2. Componentes llaman Server Actions
3. Server Actions ejecutan lógica de negocio
4. Prisma ORM interactúa con PostgreSQL
5. Respuesta se envía al cliente
6. UI se actualiza reactivamente

### Patrones de Diseño
- **Server Components**: Renderizado en servidor (por defecto)
- **Client Components**: Interactividad del cliente ('use client')
- **Server Actions**: Mutaciones de datos en el servidor
- **Context API**: Estado global del cliente (carrito, moneda)

---

## 📊 Métricas del Proyecto

### Modelos de Datos
- **8 modelos principales**: User, Product, Order, OrderItem, Category, Shipment, PointHistory, Setting
- **4 enums**: Role, OrderStatus, ShipmentStatus, PointTransactionType

### Módulos Funcionales
- **Autenticación**: Login, registro, sesiones
- **Catálogo**: Productos, categorías, búsqueda, filtros
- **Carrito**: Gestión de items, persistencia
- **Checkout**: Proceso de compra, cálculo de envío
- **Pagos**: Integración MercadoPago, webhooks
- **Envíos**: Correo Argentino, tracking
- **Admin**: Dashboard, gestión completa
- **Puntos**: Sistema de fidelización

### Integraciones
- ✅ MercadoPago (Pagos)
- ✅ Correo Argentino (Envíos)
- ✅ DolarAPI (Cotización)

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor de desarrollo

# Base de Datos
npx prisma studio             # Abrir Prisma Studio
npx prisma migrate dev        # Crear migración
npx prisma generate           # Regenerar cliente Prisma

# Producción
npm run build                 # Build de producción
npm start                     # Iniciar servidor de producción

# Utilidades
npm run lint                  # Ejecutar linter
```

---

## 📞 Soporte

**Desarrollador**: RTECH Development Team  
**Email**: contacto@rtech.ar  
**Repositorio**: GitHub (privado)

---

## 📝 Historial de Versiones

### v1.0 - Enero 2027
- ✅ Documentación completa del sistema
- ✅ Diagramas de arquitectura
- ✅ Manual de usuario y desarrollador
- ✅ Guías de troubleshooting

---

## 🎯 Próximos Pasos

Si eres nuevo en el proyecto, te recomendamos:

1. **Día 1**: Lee el [Manual Completo - Secciones 1-3](./MANUAL_COMPLETO.md)
2. **Día 2**: Configura tu entorno local siguiendo la [Sección 11.2](./MANUAL_COMPLETO.md#112-instalación-local)
3. **Día 3**: Explora el código siguiendo los [Diagramas de Flujo](./ARQUITECTURA_Y_DIAGRAMAS.md#flujos-de-usuario)
4. **Día 4**: Prueba crear un producto y realizar una compra de prueba
5. **Día 5**: Revisa el panel de admin y las configuraciones

---

**Última Actualización**: Enero 2027  
**Versión de la Documentación**: 1.0
