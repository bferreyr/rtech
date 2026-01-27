# 📘 Manual Completo del Sistema RTECH E-Commerce

**Versión:** 1.0  
**Fecha:** Enero 2027  
**Plataforma:** Next.js 15 + React 19 + TypeScript + PostgreSQL

---

## 📑 Índice

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Arquitectura Técnica](#2-arquitectura-técnica)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Módulos del Sistema](#4-módulos-del-sistema)
5. [Flujos de Negocio](#5-flujos-de-negocio)
6. [APIs y Servicios](#6-apis-y-servicios)
7. [Autenticación y Autorización](#7-autenticación-y-autorización)
8. [Sistema de Pagos](#8-sistema-de-pagos)
9. [Sistema de Envíos](#9-sistema-de-envíos)
10. [Panel de Administración](#10-panel-de-administración)
11. [Configuración y Deployment](#11-configuración-y-deployment)
12. [Mantenimiento y Troubleshooting](#12-mantenimiento-y-troubleshooting)

---

## 1. Visión General del Sistema

### 1.1 Descripción

RTECH es una plataforma de e-commerce B2C especializada en productos tecnológicos, con las siguientes características principales:

- **Catálogo de Productos**: Gestión de productos importados desde proveedores (ELIT, MOBE)
- **Carrito de Compras**: Sistema de carrito con persistencia en localStorage
- **Sistema de Pagos**: Integración con MercadoPago
- **Gestión de Usuarios**: Registro, login, perfiles y sistema de puntos
- **Panel de Administración**: Gestión completa de productos, órdenes, usuarios y configuraciones
- **Herramientas Especiales**: PC Builder, calculadora de envíos, impresión 3D

### 1.2 Stack Tecnológico

```mermaid
graph TB
    A[Frontend - Next.js 15] --> B[React 19]
    A --> C[TypeScript]
    A --> D[Tailwind CSS]
    
    E[Backend - Next.js API Routes] --> F[Prisma ORM]
    E --> G[NextAuth.js]
    E --> H[Server Actions]
    
    F --> I[PostgreSQL]
    
    J[Integraciones] --> K[MercadoPago]
    J --> L[Correo Argentino]
    J --> M[DolarAPI]
```

**Dependencias Principales:**
- **Next.js 15.1.4**: Framework React con SSR/SSG
- **React 19**: Librería UI
- **Prisma 6.2.1**: ORM para PostgreSQL
- **NextAuth 5.0**: Autenticación
- **MercadoPago 2.12.0**: Pasarela de pagos
- **Tailwind CSS 3.4**: Framework CSS
- **Lucide React**: Iconos
- **Recharts**: Gráficos y estadísticas
- **XLSX**: Importación/exportación Excel

---

## 2. Arquitectura Técnica

### 2.1 Estructura de Directorios

```
F:\RTECH\
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rutas públicas
│   │   ├── page.tsx             # Homepage
│   │   ├── products/            # Catálogo
│   │   ├── checkout/            # Proceso de compra
│   │   ├── login/               # Autenticación
│   │   └── register/            # Registro
│   │
│   ├── admin/                    # Panel de administración
│   │   ├── page.tsx             # Dashboard
│   │   ├── products/            # Gestión de productos
│   │   ├── orders/              # Gestión de órdenes
│   │   ├── users/               # Gestión de usuarios
│   │   ├── settings/            # Configuraciones
│   │   └── shipments/           # Gestión de envíos
│   │
│   ├── profile/                  # Perfil de usuario
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/                # Endpoints de autenticación
│   │   ├── webhooks/            # Webhooks (MercadoPago)
│   │   ├── shipping/            # Endpoints de envíos
│   │   └── exchange-rate/       # Cotización dólar
│   │
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts              # Acciones de autenticación
│   │   ├── orders.ts            # Acciones de órdenes
│   │   ├── products.ts          # Acciones de productos
│   │   ├── settings.ts          # Acciones de configuración
│   │   └── shipping.ts          # Acciones de envíos
│   │
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── layout/                  # Componentes de layout
│   ├── product/                 # Componentes de productos
│   ├── cart/                    # Componentes del carrito
│   ├── checkout/                # Componentes de checkout
│   ├── admin/                   # Componentes del admin
│   └── ui/                      # Componentes UI reutilizables
│
├── context/                      # React Context
│   ├── CartContext.tsx          # Estado del carrito
│   └── CurrencyContext.tsx      # Conversión de moneda
│
├── lib/                          # Utilidades y servicios
│   ├── prisma.ts                # Cliente Prisma
│   ├── exchange-rate.ts         # Servicio de cotización
│   ├── correo-argentino.ts      # Cliente Correo Argentino
│   └── utils.ts                 # Utilidades generales
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma            # Esquema de base de datos
│   └── migrations/              # Migraciones
│
├── public/                       # Archivos estáticos
│
├── .env                          # Variables de entorno
├── auth.config.ts               # Configuración NextAuth
├── auth.ts                      # Implementación NextAuth
├── middleware.ts                # Middleware de Next.js
└── tailwind.config.ts           # Configuración Tailwind
```

### 2.2 Patrones de Diseño

#### Server Components vs Client Components

```typescript
// Server Component (por defecto en Next.js 15)
// - Acceso directo a la base de datos
// - No tiene estado ni efectos
// - Se renderiza en el servidor

export default async function ProductsPage() {
  const products = await prisma.product.findMany();
  return <ProductList products={products} />;
}

// Client Component
// - Interactividad del usuario
// - Estado y efectos
// - Se marca con 'use client'

'use client';
export function AddToCartButton({ productId }) {
  const { addItem } = useCart();
  return <button onClick={() => addItem(productId)}>Agregar</button>;
}
```

#### Server Actions

```typescript
// app/actions/products.ts
'use server';

export async function createProduct(formData: FormData) {
  const product = await prisma.product.create({
    data: {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      // ...
    }
  });
  revalidatePath('/admin/products');
  return { success: true, product };
}
```

---

## 3. Modelo de Datos

### 3.1 Diagrama de Entidad-Relación

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ PointHistory : has
    User {
        string id PK
        string email UK
        string password
        string name
        enum role
        boolean isBlocked
        boolean canPurchase
        int points
        datetime createdAt
        datetime updatedAt
    }
    
    Order ||--|{ OrderItem : contains
    Order ||--o| Shipment : has
    Order {
        string id PK
        string userId FK
        enum status
        decimal total
        decimal shippingCost
        string shippingAddress
        string shippingZip
        string shippingMethod
        string paymentId
        string paymentStatus
        datetime createdAt
        datetime updatedAt
    }
    
    OrderItem }o--|| Product : references
    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        decimal price
    }
    
    Product }o--o| Category : belongs_to
    Product {
        string id PK
        string sku UK
        string name
        string description
        decimal price
        int stock
        string imageUrl
        string provider
        datetime createdAt
        datetime updatedAt
    }
    
    Category ||--o{ Category : parent_child
    Category {
        string id PK
        string name UK
        string slug UK
        string imageUrl
        string parentId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Shipment {
        string id PK
        string orderId FK UK
        string trackingNumber UK
        string carrier
        string service
        decimal cost
        enum status
        string labelUrl
        datetime estimatedDelivery
        datetime createdAt
        datetime updatedAt
    }
    
    PointHistory {
        string id PK
        string userId FK
        int amount
        enum type
        string description
        datetime createdAt
    }
    
    Setting {
        string id PK
        string key UK
        string value
        string description
        datetime updatedAt
    }
```

### 3.2 Modelos Principales

#### User (Usuario)
- **Propósito**: Gestión de usuarios del sistema
- **Roles**: USER (cliente), ADMIN (administrador)
- **Características**:
  - Sistema de puntos de fidelidad
  - Control de bloqueo y permisos de compra
  - Historial de puntos

#### Product (Producto)
- **Propósito**: Catálogo de productos
- **Proveedores**: ELIT, MOBE
- **Campos Especiales**:
  - `precio`: Precio base en USD
  - `markup`: Margen de ganancia
  - `cotizacion`: Tipo de cambio aplicado
  - `pvpUsd`/`pvpArs`: Precio de venta público
  - `provider`: Proveedor del producto

#### Order (Orden)
- **Estados**:
  - `PENDING`: Orden creada, pago pendiente
  - `PAID`: Pago confirmado
  - `SHIPPED`: Enviado
  - `DELIVERED`: Entregado
  - `CANCELLED`: Cancelado

#### Shipment (Envío)
- **Estados**:
  - `PENDING`: Pendiente de generación
  - `LABEL_GENERATED`: Etiqueta generada
  - `IN_TRANSIT`: En tránsito
  - `OUT_FOR_DELIVERY`: En reparto
  - `DELIVERED`: Entregado
  - `FAILED`: Fallido
  - `CANCELLED`: Cancelado

---

## 4. Módulos del Sistema

### 4.1 Módulo de Autenticación

**Ubicación**: `app/login`, `app/register`, `auth.ts`

**Tecnología**: NextAuth.js v5

**Flujo de Login**:
```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as NextAuth
    participant DB as Database
    
    U->>F: Ingresa credenciales
    F->>A: signIn(credentials)
    A->>DB: Buscar usuario por email
    DB-->>A: Usuario encontrado
    A->>A: Verificar password (bcrypt)
    A-->>F: Session creada
    F-->>U: Redirect a /profile
```

**Características**:
- Autenticación con email/password
- Hash de contraseñas con bcryptjs
- Sesiones JWT
- Middleware para proteger rutas
- Roles (USER/ADMIN)

**Código de Ejemplo**:
```typescript
// app/actions/auth.ts
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return { error: 'Usuario no encontrado' };
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return { error: 'Contraseña incorrecta' };
  }
  
  await signIn('credentials', {
    email,
    password,
    redirect: false
  });
  
  return { success: true };
}
```

### 4.2 Módulo de Productos

**Ubicación**: `app/products`, `app/admin/products`

**Funcionalidades**:

1. **Catálogo Público**:
   - Listado de productos con paginación
   - Búsqueda por nombre/SKU
   - Filtros por categoría, marca, precio
   - Vista de detalle del producto

2. **Gestión Admin**:
   - CRUD completo de productos
   - Importación masiva desde Excel (ELIT/MOBE)
   - Actualización de precios y stock
   - Gestión de imágenes

**Importación de Productos**:
```typescript
// app/actions/products.ts
export async function importProductsFromExcel(file: File, provider: 'ELIT' | 'MOBE') {
  const workbook = XLSX.read(await file.arrayBuffer());
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  const exchangeRate = await getExchangeRate();
  const markup = await getGlobalMarkup();
  
  for (const row of data) {
    const priceUSD = parseFloat(row.precio);
    const priceARS = priceUSD * exchangeRate.rate;
    const finalPrice = priceARS * (1 + markup / 100);
    
    await prisma.product.upsert({
      where: { sku: row.sku },
      update: {
        price: finalPrice,
        stock: row.stock,
        // ...
      },
      create: {
        sku: row.sku,
        name: row.nombre,
        price: finalPrice,
        provider,
        // ...
      }
    });
  }
}
```

### 4.3 Módulo de Carrito

**Ubicación**: `context/CartContext.tsx`, `components/cart/`

**Tecnología**: React Context + localStorage

**Estructura del Carrito**:
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}
```

**Persistencia**:
- Los items se guardan en `localStorage` bajo la key `rtech-cart`
- Se sincronizan automáticamente entre pestañas
- Se limpian al completar una compra

### 4.4 Módulo de Checkout

**Ubicación**: `app/checkout`

**Flujo de Compra**:
```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as Checkout
    participant MP as MercadoPago
    participant DB as Database
    
    U->>C: Completa datos de envío
    C->>C: Calcula costo de envío
    U->>C: Confirma compra
    C->>DB: Crea orden (PENDING)
    C->>MP: Crea preferencia de pago
    MP-->>C: URL de pago
    C-->>U: Redirect a MercadoPago
    U->>MP: Realiza pago
    MP->>DB: Webhook (actualiza orden a PAID)
    MP-->>U: Redirect a /checkout/success
```

**Características**:
- Calculadora de envío integrada
- Sistema de puntos (descuento hasta 50% del total)
- Integración con MercadoPago
- Validación de stock antes de crear orden

### 4.5 Módulo de Órdenes

**Ubicación**: `app/admin/orders`, `app/profile` (vista usuario)

**Funcionalidades Admin**:
- Listado de todas las órdenes
- Filtros por estado, fecha, usuario
- Cambio de estado manual
- Generación de envíos
- Descarga de etiquetas

**Funcionalidades Usuario**:
- Ver historial de compras
- Tracking de envíos
- Descarga de comprobantes

### 4.6 Sistema de Puntos

**Ubicación**: `app/actions/points.ts`

**Reglas**:
- **Ganancia**: 1 punto por cada USD gastado
- **Canje**: 1 punto = 1 USD de descuento
- **Límite**: Máximo 50% del total de la compra
- **Expiración**: Los puntos no expiran (configurable)

**Tipos de Transacciones**:
- `EARNED`: Puntos ganados por compra
- `REDEEMED`: Puntos canjeados
- `EXPIRED`: Puntos expirados
- `ADMIN_ADJUSTMENT`: Ajuste manual por admin

---

## 5. Flujos de Negocio

### 5.1 Flujo Completo de Compra

```mermaid
graph TD
    A[Usuario navega catálogo] --> B[Agrega productos al carrito]
    B --> C{Usuario autenticado?}
    C -->|No| D[Redirect a /login]
    D --> E[Login/Registro]
    E --> F[Checkout]
    C -->|Sí| F
    
    F --> G[Completa datos de envío]
    G --> H[Calcula costo de envío]
    H --> I{Usa puntos?}
    I -->|Sí| J[Aplica descuento de puntos]
    I -->|No| K[Total sin descuento]
    J --> L[Crea orden en DB]
    K --> L
    
    L --> M[Crea preferencia MercadoPago]
    M --> N[Redirect a MercadoPago]
    N --> O{Pago exitoso?}
    
    O -->|Sí| P[Webhook actualiza orden a PAID]
    P --> Q[Suma puntos al usuario]
    Q --> R[Envía email confirmación]
    R --> S[Redirect a /checkout/success]
    
    O -->|No| T[Redirect a /checkout con error]
    T --> U[Orden queda en PENDING]
```

### 5.2 Flujo de Gestión de Envíos

```mermaid
graph TD
    A[Admin ve orden PAID] --> B[Click en Generar Envío]
    B --> C[Completa datos del paquete]
    C --> D[Llama API Correo Argentino]
    D --> E{Éxito?}
    
    E -->|Sí| F[Recibe tracking number]
    F --> G[Descarga etiqueta PDF]
    G --> H[Actualiza orden a SHIPPED]
    H --> I[Crea registro en Shipment]
    I --> J[Envía email con tracking]
    
    E -->|No| K[Muestra error]
    K --> L[Orden queda en PAID]
```

### 5.3 Flujo de Actualización de Precios

```mermaid
graph TD
    A[Servicio cron cada hora] --> B[Consulta DolarAPI]
    B --> C[Obtiene cotización USD/ARS]
    C --> D[Actualiza Setting EXCHANGE_RATE]
    D --> E[Recalcula precios de productos]
    E --> F{Hay cambios?}
    
    F -->|Sí| G[Revalida cache de Next.js]
    G --> H[Usuarios ven nuevos precios]
    
    F -->|No| I[No hace nada]
```

---

## 6. APIs y Servicios

### 6.1 API Routes

#### GET /api/exchange-rate
**Propósito**: Obtener cotización actual del dólar

**Response**:
```json
{
  "rate": 1050.50,
  "lastUpdated": "2027-01-27T12:00:00Z",
  "source": "DolarAPI"
}
```

#### POST /api/webhooks/mercadopago
**Propósito**: Recibir notificaciones de MercadoPago

**Request Body**:
```json
{
  "action": "payment.updated",
  "data": {
    "id": "123456789"
  }
}
```

**Proceso**:
1. Verifica firma del webhook
2. Consulta estado del pago en MercadoPago
3. Actualiza orden en la base de datos
4. Suma puntos al usuario si el pago fue aprobado

#### GET /api/shipping/quote
**Propósito**: Calcular costo de envío

**Query Params**:
- `zip`: Código postal de destino
- `weight`: Peso en kg

**Response**:
```json
{
  "options": [
    {
      "service": "Correo Argentino - Estándar",
      "cost": 2500,
      "estimatedDelivery": "3-5 días hábiles"
    }
  ]
}
```

### 6.2 Server Actions

#### createOrder
```typescript
'use server';

export async function createOrder(data: {
  userId: string;
  items: CartItem[];
  shippingAddress: string;
  shippingCost: number;
  pointsToRedeem: number;
}) {
  // 1. Validar stock
  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.id }
    });
    
    if (product.stock < item.quantity) {
      return { error: `Stock insuficiente para ${product.name}` };
    }
  }
  
  // 2. Calcular total
  const subtotal = data.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  const discount = data.pointsToRedeem;
  const total = subtotal + data.shippingCost - discount;
  
  // 3. Crear orden
  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      total,
      shippingCost: data.shippingCost,
      shippingAddress: data.shippingAddress,
      status: 'PENDING',
      items: {
        create: data.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });
  
  // 4. Reducir stock
  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.id },
      data: { stock: { decrement: item.quantity } }
    });
  }
  
  // 5. Registrar uso de puntos
  if (data.pointsToRedeem > 0) {
    await prisma.pointHistory.create({
      data: {
        userId: data.userId,
        amount: -data.pointsToRedeem,
        type: 'REDEEMED',
        description: `Canjeados en orden ${order.id}`
      }
    });
    
    await prisma.user.update({
      where: { id: data.userId },
      data: { points: { decrement: data.pointsToRedeem } }
    });
  }
  
  return { success: true, orderId: order.id };
}
```

---

## 7. Autenticación y Autorización

### 7.1 Configuración de NextAuth

**Archivo**: `auth.config.ts`

```typescript
export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) return null;
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          points: user.points
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === 'ADMIN';
      const isOnAdmin = request.nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin && !isAdmin) {
        return false;
      }
      
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.points = user.points;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.points = token.points;
      return session;
    }
  }
};
```

### 7.2 Middleware de Protección

**Archivo**: `middleware.ts`

```typescript
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN';
  const { pathname } = req.nextUrl;
  
  // Rutas protegidas para usuarios autenticados
  const protectedRoutes = ['/profile', '/checkout'];
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }
  
  // Rutas protegidas para admins
  if (pathname.startsWith('/admin') && !isAdmin) {
    return Response.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

---

## 8. Sistema de Pagos

### 8.1 Integración con MercadoPago

**Configuración**:
```typescript
// lib/mercadopago.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

export const preferenceClient = new Preference(client);
```

**Creación de Preferencia**:
```typescript
export async function createMercadoPagoPreference(data: {
  email: string;
  name: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }>;
  total: number;
  shippingAddress: any;
  shippingOption: any;
  pointsToRedeem: number;
}) {
  // 1. Crear orden en DB
  const order = await createOrder({
    userId: session.user.id,
    items: data.items,
    shippingAddress: data.shippingAddress,
    shippingCost: data.shippingOption?.cost || 0,
    pointsToRedeem: data.pointsToRedeem
  });
  
  // 2. Crear preferencia en MercadoPago
  const preference = await preferenceClient.create({
    body: {
      items: data.items.map(item => ({
        id: item.productId,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS'
      })),
      payer: {
        email: data.email,
        name: data.name
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/checkout`,
        pending: `${process.env.NEXT_PUBLIC_URL}/checkout`
      },
      auto_return: 'approved',
      external_reference: order.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercadopago`
    }
  });
  
  return {
    success: true,
    initPoint: preference.init_point
  };
}
```

### 8.2 Webhook de MercadoPago

**Endpoint**: `/api/webhooks/mercadopago`

**Proceso**:
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  
  // 1. Validar firma (opcional pero recomendado)
  // ...
  
  // 2. Obtener información del pago
  if (body.type === 'payment') {
    const paymentId = body.data.id;
    
    const payment = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      }
    ).then(res => res.json());
    
    // 3. Actualizar orden
    const orderId = payment.external_reference;
    
    if (payment.status === 'approved') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paymentId: payment.id,
          paymentStatus: payment.status
        }
      });
      
      // 4. Sumar puntos al usuario
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true }
      });
      
      const pointsEarned = Math.floor(order.total);
      
      await prisma.user.update({
        where: { id: order.userId },
        data: { points: { increment: pointsEarned } }
      });
      
      await prisma.pointHistory.create({
        data: {
          userId: order.userId,
          amount: pointsEarned,
          type: 'EARNED',
          description: `Ganados por compra #${orderId}`
        }
      });
      
      // 5. Enviar email de confirmación
      // await sendOrderConfirmationEmail(order);
    }
  }
  
  return new Response('OK', { status: 200 });
}
```

---

## 9. Sistema de Envíos

### 9.1 Integración con Correo Argentino

**Servicio**: `lib/correo-argentino.ts`

**Nota**: Este servicio está preparado pero requiere credenciales de Correo Argentino para funcionar.

**Funcionalidades**:
1. **Cotización de Envíos**: Calcular costo según destino y peso
2. **Creación de Envíos**: Generar tracking number y etiqueta
3. **Tracking**: Consultar estado del envío
4. **Descarga de Etiquetas**: Obtener PDF de la etiqueta

**Ejemplo de Uso**:
```typescript
import { correoArgentinoService } from '@/lib/correo-argentino';

// Cotizar envío
const quotes = await correoArgentinoService.quoteShipment({
  destinationZip: '1000',
  weight: 2.5,
  dimensions: {
    width: 30,
    height: 20,
    depth: 15
  }
});

// Crear envío
const shipment = await correoArgentinoService.createShipment({
  orderId: 'order-123',
  service: 'STANDARD',
  destinationAddress: 'Av. Corrientes 1234',
  destinationZip: '1000',
  destinationCity: 'Buenos Aires',
  destinationProvince: 'CABA',
  recipientName: 'Juan Pérez',
  recipientEmail: 'juan@example.com',
  recipientPhone: '+5491123456789',
  weight: 2.5,
  declaredValue: 50000
});

// Tracking
const tracking = await correoArgentinoService.getTracking(
  shipment.trackingNumber
);
```

### 9.2 Calculadora de Envíos

**Componente**: `components/checkout/ShippingCalculator.tsx`

**Características**:
- Cálculo automático basado en peso total del carrito
- Múltiples opciones de envío
- Estimación de tiempo de entrega
- Integración con API de Correo Argentino

---

## 10. Panel de Administración

### 10.1 Dashboard

**Ruta**: `/admin`

**Métricas Mostradas**:
- Total de ventas (mes actual)
- Número de órdenes
- Productos con stock bajo
- Gráfico de ventas por día
- Últimas órdenes

**Tecnología**: Recharts para gráficos

### 10.2 Gestión de Productos

**Ruta**: `/admin/products`

**Funcionalidades**:
1. **Listado**: Tabla con todos los productos
2. **Búsqueda**: Por nombre, SKU, marca
3. **Filtros**: Por categoría, proveedor, stock
4. **Edición**: Modal para editar producto
5. **Importación**: Carga masiva desde Excel
6. **Exportación**: Descarga de catálogo en Excel

**Importación de Excel**:
- Soporta formatos de ELIT y MOBE
- Actualiza precios automáticamente con cotización actual
- Aplica markup global configurado
- Actualiza stock

### 10.3 Gestión de Órdenes

**Ruta**: `/admin/orders`

**Funcionalidades**:
1. **Listado**: Todas las órdenes con filtros
2. **Detalle**: Ver items, usuario, dirección
3. **Cambio de Estado**: Actualizar estado de la orden
4. **Generación de Envíos**: Crear envío en Correo Argentino
5. **Descarga de Etiquetas**: PDF de etiqueta de envío

### 10.4 Gestión de Usuarios

**Ruta**: `/admin/users`

**Funcionalidades**:
1. **Listado**: Todos los usuarios
2. **Bloqueo/Desbloqueo**: Impedir login
3. **Permisos de Compra**: Permitir/denegar compras
4. **Ajuste de Puntos**: Sumar/restar puntos manualmente
5. **Historial**: Ver órdenes del usuario

### 10.5 Configuraciones

**Ruta**: `/admin/settings`

**Configuraciones Disponibles**:

1. **Cotización del Dólar**:
   - Actualización automática desde DolarAPI
   - Valor actual mostrado
   - Última actualización

2. **Ganancia Global (Markup)**:
   - Porcentaje aplicado a todos los productos
   - Se usa en importación de Excel

3. **MercadoPago**:
   - Access Token de producción
   - Configuración de webhook

**Almacenamiento**: Tabla `Setting` con key-value

---

## 11. Configuración y Deployment

### 11.1 Variables de Entorno

**Archivo**: `.env`

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rtech"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-..."

# Correo Argentino (opcional)
CORREO_ARGENTINO_BASE_URL="https://api.correoargentino.com.ar"
CORREO_ARGENTINO_USERNAME="your-username"
CORREO_ARGENTINO_PASSWORD="your-password"
CORREO_ARGENTINO_ORIGIN_ZIP="3000"
CORREO_ARGENTINO_ORIGIN_ADDRESS="Jacaranda 1657"
CORREO_ARGENTINO_ORIGIN_CITY="Santa Fe"
CORREO_ARGENTINO_ORIGIN_PROVINCE="Santa Fe"

# App
NEXT_PUBLIC_URL="http://localhost:3000"
```

### 11.2 Instalación Local

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/rtech.git
cd rtech

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos
# Crear base de datos PostgreSQL
createdb rtech

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 5. Ejecutar migraciones
npx prisma migrate dev

# 6. Crear usuario admin
npm run seed-admin

# 7. Iniciar servidor de desarrollo
npm run dev
```

### 11.3 Deployment en Producción

**Plataformas Recomendadas**:
- **Vercel**: Ideal para Next.js (deployment automático)
- **Railway**: Para PostgreSQL y aplicación
- **Render**: Alternativa con free tier

**Pasos para Vercel**:

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Configurar variables de entorno en Vercel Dashboard
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - MERCADOPAGO_ACCESS_TOKEN
# - etc.

# 5. Ejecutar migraciones en producción
npx prisma migrate deploy
```

**Configuración de Base de Datos**:
- Usar servicio como **Neon**, **Supabase** o **Railway**
- Habilitar SSL en conexión
- Configurar connection pooling

### 11.4 Scripts NPM

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed-admin": "node scripts/create-admin.js"
  }
}
```

---

## 12. Mantenimiento y Troubleshooting

### 12.1 Tareas de Mantenimiento

#### Actualización de Cotización del Dólar

**Automático**: Configurado en `lib/exchange-rate.ts`

```typescript
// Se ejecuta cada hora automáticamente
export async function fetchLiveExchangeRate(): Promise<number | null> {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/blue');
    const data = await response.json();
    return data.venta;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}
```

**Manual**: Desde `/admin/settings`

#### Limpieza de Órdenes Pendientes

```sql
-- Cancelar órdenes pendientes de más de 7 días
UPDATE "Order"
SET status = 'CANCELLED'
WHERE status = 'PENDING'
  AND "createdAt" < NOW() - INTERVAL '7 days';
```

#### Backup de Base de Datos

```bash
# Backup
pg_dump -U postgres -d rtech > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d rtech < backup_20270127.sql
```

### 12.2 Problemas Comunes

#### Error: "Database connection failed"

**Causa**: DATABASE_URL incorrecta o base de datos no disponible

**Solución**:
```bash
# Verificar conexión
npx prisma db pull

# Regenerar cliente Prisma
npx prisma generate
```

#### Error: "MercadoPago webhook not working"

**Causa**: URL de webhook no configurada o incorrecta

**Solución**:
1. Ir a https://www.mercadopago.com.ar/developers
2. Configurar webhook: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Verificar que el endpoint esté público (no protegido por auth)

#### Error: "Products not showing correct prices"

**Causa**: Cotización del dólar desactualizada

**Solución**:
```typescript
// Forzar actualización desde admin/settings
await updateExchangeRate(newRate, true);
revalidatePath('/products');
```

#### Error: "Stock inconsistencies"

**Causa**: Múltiples compras simultáneas

**Solución**:
```typescript
// Usar transacciones en la creación de órdenes
await prisma.$transaction(async (tx) => {
  // 1. Verificar stock
  const product = await tx.product.findUnique({
    where: { id: productId }
  });
  
  if (product.stock < quantity) {
    throw new Error('Stock insuficiente');
  }
  
  // 2. Crear orden
  const order = await tx.order.create({ /* ... */ });
  
  // 3. Reducir stock
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } }
  });
});
```

### 12.3 Logs y Monitoreo

**Logs de Aplicación**:
```typescript
// Usar console.log en desarrollo
console.log('Order created:', order.id);

// En producción, usar servicio como Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error);
```

**Monitoreo de Performance**:
- Usar Vercel Analytics
- Configurar alertas para errores 500
- Monitorear tiempo de respuesta de APIs

### 12.4 Seguridad

**Checklist de Seguridad**:
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones JWT con secret seguro
- ✅ Validación de inputs en server actions
- ✅ Protección CSRF (incluida en Next.js)
- ✅ Rate limiting en APIs críticas
- ✅ HTTPS en producción
- ✅ Variables de entorno seguras
- ✅ Sanitización de datos de usuario

**Actualización de Dependencias**:
```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Actualizar Prisma
npm install @prisma/client@latest prisma@latest
npx prisma generate
```

---

## 📞 Soporte y Contacto

**Desarrollador**: RTECH Development Team  
**Email**: contacto@rtech.ar  
**Documentación**: Este manual  
**Repositorio**: GitHub (privado)

---

## 📝 Notas Finales

Este manual cubre todos los aspectos principales del sistema RTECH E-Commerce. Para información más detallada sobre componentes específicos, consultar el código fuente y los comentarios inline.

**Última Actualización**: Enero 2027  
**Versión del Manual**: 1.0
