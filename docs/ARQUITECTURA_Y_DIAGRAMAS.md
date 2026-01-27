# 🏗️ Arquitectura y Diagramas del Sistema RTECH

## Índice
1. [Arquitectura General](#arquitectura-general)
2. [Diagrama de Componentes](#diagrama-de-componentes)
3. [Flujos de Usuario](#flujos-de-usuario)
4. [Diagramas de Secuencia](#diagramas-de-secuencia)
5. [Estructura de Datos](#estructura-de-datos)

---

## Arquitectura General

### Vista de Alto Nivel

```mermaid
graph TB
    subgraph "Cliente (Browser)"
        A[React UI]
        B[Cart Context]
        C[Currency Context]
    end
    
    subgraph "Next.js Application"
        D[Server Components]
        E[Client Components]
        F[API Routes]
        G[Server Actions]
        H[Middleware]
    end
    
    subgraph "Servicios Externos"
        I[MercadoPago API]
        J[Correo Argentino API]
        K[DolarAPI]
    end
    
    subgraph "Base de Datos"
        L[(PostgreSQL)]
        M[Prisma ORM]
    end
    
    A --> E
    B --> E
    C --> E
    E --> G
    D --> M
    F --> M
    G --> M
    M --> L
    
    F --> I
    F --> J
    F --> K
    
    H --> D
    H --> F
```

### Capas de la Aplicación

```mermaid
graph LR
    subgraph "Presentation Layer"
        A[Components]
        B[Pages]
        C[Layouts]
    end
    
    subgraph "Business Logic Layer"
        D[Server Actions]
        E[API Routes]
        F[Services]
    end
    
    subgraph "Data Access Layer"
        G[Prisma Client]
        H[Database Queries]
    end
    
    subgraph "External Services"
        I[Payment Gateway]
        J[Shipping API]
        K[Exchange Rate API]
    end
    
    A --> D
    B --> D
    D --> G
    E --> G
    F --> G
    G --> H
    
    E --> I
    E --> J
    E --> K
```

---

## Diagrama de Componentes

### Estructura de Componentes React

```mermaid
graph TD
    subgraph "Layout Components"
        A[RootLayout]
        B[Header]
        C[Footer]
        D[Sidebar]
    end
    
    subgraph "Product Components"
        E[ProductCard]
        F[ProductList]
        G[ProductDetail]
        H[ProductFilters]
    end
    
    subgraph "Cart Components"
        I[CartButton]
        J[CartDrawer]
        K[CartItem]
        L[AddToCartButton]
    end
    
    subgraph "Checkout Components"
        M[CheckoutForm]
        N[ShippingCalculator]
        O[PaymentMethod]
        P[OrderSummary]
    end
    
    subgraph "Admin Components"
        Q[AdminDashboard]
        R[ProductManager]
        S[OrderManager]
        T[UserManager]
    end
    
    A --> B
    A --> C
    A --> D
    
    F --> E
    G --> L
    
    J --> K
    M --> N
    M --> O
    M --> P
    
    Q --> R
    Q --> S
    Q --> T
```

### Contextos y Estado Global

```mermaid
graph TB
    subgraph "React Context Providers"
        A[CartContext]
        B[CurrencyContext]
        C[SessionProvider]
    end
    
    subgraph "State Management"
        D[Cart State]
        E[Exchange Rate]
        F[User Session]
    end
    
    subgraph "Persistence"
        G[localStorage]
        H[Cookies]
        I[Database]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> I
    F --> H
```

---

## Flujos de Usuario

### Flujo de Navegación Principal

```mermaid
graph TD
    A[Homepage] --> B{Usuario autenticado?}
    B -->|No| C[Ver productos como invitado]
    B -->|Sí| D[Ver productos personalizados]
    
    C --> E[Explorar catálogo]
    D --> E
    
    E --> F[Ver detalle de producto]
    F --> G[Agregar al carrito]
    
    G --> H{Continuar comprando?}
    H -->|Sí| E
    H -->|No| I[Ir a checkout]
    
    I --> J{Usuario autenticado?}
    J -->|No| K[Login/Registro]
    J -->|Sí| L[Completar datos de envío]
    
    K --> L
    L --> M[Seleccionar método de envío]
    M --> N[Aplicar puntos si tiene]
    N --> O[Confirmar compra]
    O --> P[Pagar con MercadoPago]
    P --> Q{Pago exitoso?}
    
    Q -->|Sí| R[Orden confirmada]
    Q -->|No| S[Reintentar pago]
    
    R --> T[Ver orden en perfil]
    S --> O
```

### Flujo de Administrador

```mermaid
graph TD
    A[Login como Admin] --> B[Dashboard]
    
    B --> C[Gestión de Productos]
    B --> D[Gestión de Órdenes]
    B --> E[Gestión de Usuarios]
    B --> F[Configuraciones]
    
    C --> C1[Importar Excel]
    C --> C2[Editar producto]
    C --> C3[Ver stock]
    
    D --> D1[Ver órdenes pendientes]
    D1 --> D2[Generar envío]
    D2 --> D3[Descargar etiqueta]
    D3 --> D4[Marcar como enviado]
    
    E --> E1[Ver usuarios]
    E --> E2[Bloquear/Desbloquear]
    E --> E3[Ajustar puntos]
    
    F --> F1[Actualizar cotización USD]
    F --> F2[Configurar markup]
    F --> F3[Configurar MercadoPago]
```

---

## Diagramas de Secuencia

### Proceso de Compra Completo

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend
    participant A as Server Actions
    participant DB as Database
    participant MP as MercadoPago
    participant E as Email Service
    
    U->>F: Agrega productos al carrito
    F->>F: Guarda en localStorage
    
    U->>F: Click en "Finalizar compra"
    F->>F: Verifica autenticación
    
    alt No autenticado
        F->>U: Redirect a /login
        U->>A: Login con credenciales
        A->>DB: Verificar usuario
        DB-->>A: Usuario válido
        A-->>F: Session creada
    end
    
    F->>U: Muestra formulario de checkout
    U->>F: Completa datos de envío
    
    F->>A: Calcula costo de envío
    A->>DB: Obtiene configuración
    DB-->>A: Configuración de envío
    A-->>F: Costo calculado
    
    U->>F: Confirma compra
    
    F->>A: createOrder()
    A->>DB: Verifica stock
    DB-->>A: Stock disponible
    
    A->>DB: Crea orden (PENDING)
    A->>DB: Reduce stock
    A->>DB: Registra uso de puntos
    DB-->>A: Orden creada
    
    A->>MP: Crea preferencia de pago
    MP-->>A: URL de pago
    A-->>F: Preferencia creada
    
    F->>U: Redirect a MercadoPago
    U->>MP: Realiza pago
    
    MP->>A: Webhook (payment.updated)
    A->>MP: Consulta estado del pago
    MP-->>A: Pago aprobado
    
    A->>DB: Actualiza orden a PAID
    A->>DB: Suma puntos al usuario
    DB-->>A: Actualizado
    
    A->>E: Envía email de confirmación
    
    MP->>U: Redirect a /checkout/success
    U->>F: Ve confirmación de compra
```

### Generación de Envío

```mermaid
sequenceDiagram
    actor A as Admin
    participant UI as Admin UI
    participant SA as Server Action
    participant DB as Database
    participant CA as Correo Argentino API
    
    A->>UI: Ve orden PAID
    A->>UI: Click "Generar Envío"
    
    UI->>A: Muestra modal con datos
    A->>UI: Completa peso y dimensiones
    A->>UI: Click "Confirmar"
    
    UI->>SA: createShipment()
    
    SA->>DB: Obtiene datos de la orden
    DB-->>SA: Orden completa
    
    SA->>DB: Obtiene configuración CA
    DB-->>SA: Credenciales y datos remitente
    
    SA->>CA: Autentica
    CA-->>SA: Token JWT
    
    SA->>CA: Crea envío
    CA-->>SA: Tracking number + Label URL
    
    SA->>DB: Crea registro Shipment
    SA->>DB: Actualiza orden a SHIPPED
    DB-->>SA: Actualizado
    
    SA-->>UI: Envío creado
    UI->>A: Muestra tracking number
    
    A->>UI: Click "Descargar etiqueta"
    UI->>CA: Descarga PDF
    CA-->>UI: Archivo PDF
    UI->>A: Descarga etiqueta.pdf
```

### Actualización Automática de Precios

```mermaid
sequenceDiagram
    participant C as Cron Job
    participant SA as Server Action
    participant API as DolarAPI
    participant DB as Database
    participant Cache as Next.js Cache
    
    Note over C: Cada hora
    C->>SA: getExchangeRate()
    
    SA->>DB: Lee última cotización
    DB-->>SA: Rate actual
    
    SA->>API: Consulta cotización blue
    API-->>SA: Nuevo rate
    
    alt Rate cambió
        SA->>DB: Actualiza Setting EXCHANGE_RATE
        DB-->>SA: Actualizado
        
        SA->>DB: Recalcula pvpArs de productos
        DB-->>SA: Productos actualizados
        
        SA->>Cache: revalidatePath('/products')
        SA->>Cache: revalidatePath('/')
        
        Note over Cache: Cache invalidado
    else Rate igual
        Note over SA: No hace nada
    end
```

---

## Estructura de Datos

### Modelo de Datos Completo

```mermaid
erDiagram
    User ||--o{ Order : "places"
    User ||--o{ PointHistory : "has"
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
    
    Order ||--|{ OrderItem : "contains"
    Order ||--o| Shipment : "has"
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
    
    OrderItem }o--|| Product : "references"
    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        decimal price
    }
    
    Product }o--o| Category : "belongs_to"
    Product {
        string id PK
        string sku UK
        string codigoAlfa
        string codigoProducto UK
        string name
        string description
        string categoria
        string subCategoria
        string marca
        decimal precio
        decimal impuestoInterno
        decimal iva
        string moneda
        decimal markup
        decimal cotizacion
        decimal pvpUsd
        decimal pvpArs
        decimal peso
        string ean
        string nivelStock
        int stockTotal
        int stockDepositoCliente
        int stockDepositoCd
        string garantia
        string link
        string imagen
        string miniatura
        string atributos
        boolean gamer
        decimal price
        int stock
        string imageUrl
        decimal weight
        string dimensions
        string categoryId FK
        string provider
        datetime createdAt
        datetime updatedAt
    }
    
    Category ||--o{ Category : "parent_child"
    Category ||--o{ Product : "has"
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
        string metadata
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

### Estados de Orden

```mermaid
stateDiagram-v2
    [*] --> PENDING: Orden creada
    PENDING --> PAID: Pago confirmado
    PENDING --> CANCELLED: Pago fallido/timeout
    
    PAID --> SHIPPED: Envío generado
    PAID --> CANCELLED: Cancelación manual
    
    SHIPPED --> DELIVERED: Entrega confirmada
    SHIPPED --> CANCELLED: Problema en envío
    
    DELIVERED --> [*]
    CANCELLED --> [*]
    
    note right of PENDING
        Usuario completa checkout
        Orden en espera de pago
    end note
    
    note right of PAID
        Pago aprobado por MercadoPago
        Puntos sumados al usuario
    end note
    
    note right of SHIPPED
        Tracking number generado
        Etiqueta descargada
    end note
    
    note right of DELIVERED
        Envío completado
        Orden finalizada
    end note
```

### Estados de Envío

```mermaid
stateDiagram-v2
    [*] --> PENDING: Orden pagada
    PENDING --> LABEL_GENERATED: Etiqueta creada
    
    LABEL_GENERATED --> IN_TRANSIT: Despachado
    
    IN_TRANSIT --> OUT_FOR_DELIVERY: En reparto
    
    OUT_FOR_DELIVERY --> DELIVERED: Entregado
    OUT_FOR_DELIVERY --> FAILED: Intento fallido
    
    FAILED --> OUT_FOR_DELIVERY: Reintento
    FAILED --> CANCELLED: Cancelado
    
    PENDING --> CANCELLED: Cancelación
    LABEL_GENERATED --> CANCELLED: Cancelación
    IN_TRANSIT --> CANCELLED: Cancelación
    
    DELIVERED --> [*]
    CANCELLED --> [*]
```

### Flujo de Datos en Importación de Productos

```mermaid
graph LR
    A[Excel File] --> B[XLSX Parser]
    B --> C[Raw Data]
    
    C --> D{Proveedor?}
    D -->|ELIT| E[Mapeo ELIT]
    D -->|MOBE| F[Mapeo MOBE]
    
    E --> G[Datos Normalizados]
    F --> G
    
    G --> H[Obtener Exchange Rate]
    G --> I[Obtener Markup]
    
    H --> J[Calcular Precios]
    I --> J
    
    J --> K{Producto existe?}
    K -->|Sí| L[UPDATE]
    K -->|No| M[CREATE]
    
    L --> N[Database]
    M --> N
    
    N --> O[Revalidar Cache]
    O --> P[Productos Actualizados]
```

---

## Integraciones Externas

### Flujo de Integración con MercadoPago

```mermaid
graph TB
    subgraph "RTECH Application"
        A[Checkout Page]
        B[Server Action]
        C[Webhook Handler]
    end
    
    subgraph "MercadoPago"
        D[Preference API]
        E[Payment Gateway]
        F[Webhook Service]
    end
    
    subgraph "Database"
        G[(Orders)]
        H[(Users)]
    end
    
    A -->|1. Create Preference| B
    B -->|2. POST /preferences| D
    D -->|3. Return init_point| B
    B -->|4. Redirect| E
    
    E -->|5. User pays| F
    F -->|6. POST /webhooks| C
    
    C -->|7. Update order| G
    C -->|8. Add points| H
    
    E -->|9. Redirect| A
```

### Flujo de Integración con Correo Argentino

```mermaid
graph TB
    subgraph "RTECH Application"
        A[Admin Panel]
        B[Shipping Service]
        C[Database]
    end
    
    subgraph "Correo Argentino API"
        D[Auth Endpoint]
        E[Shipment Creation]
        F[Tracking Service]
        G[Label Service]
    end
    
    A -->|1. Generate Shipment| B
    B -->|2. Authenticate| D
    D -->|3. JWT Token| B
    
    B -->|4. Create Shipment| E
    E -->|5. Tracking Number| B
    
    B -->|6. Save to DB| C
    
    A -->|7. Download Label| B
    B -->|8. Get Label PDF| G
    G -->|9. PDF File| A
    
    A -->|10. Track Shipment| B
    B -->|11. Get Tracking| F
    F -->|12. Events| B
```

---

## Seguridad y Autenticación

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant M as Middleware
    participant A as NextAuth
    participant DB as Database
    
    U->>F: Accede a /admin
    F->>M: Request interceptado
    
    M->>A: Verifica session
    A->>A: Valida JWT token
    
    alt Token válido
        A-->>M: Session válida
        M->>A: Verifica role
        
        alt Es ADMIN
            A-->>M: Autorizado
            M-->>F: Permite acceso
            F-->>U: Muestra admin panel
        else No es ADMIN
            A-->>M: No autorizado
            M-->>F: Redirect a /
            F-->>U: Muestra homepage
        end
    else Token inválido
        A-->>M: Session inválida
        M-->>F: Redirect a /login
        F-->>U: Muestra login
    end
```

### Protección de Rutas

```mermaid
graph TD
    A[Request] --> B{Middleware}
    
    B --> C{Ruta pública?}
    C -->|Sí| D[Permitir acceso]
    C -->|No| E{Usuario autenticado?}
    
    E -->|No| F[Redirect a /login]
    E -->|Sí| G{Requiere admin?}
    
    G -->|No| D
    G -->|Sí| H{Es admin?}
    
    H -->|Sí| D
    H -->|No| I[Redirect a /]
    
    D --> J[Renderizar página]
    F --> K[Mostrar login]
    I --> L[Mostrar homepage]
```

---

## Performance y Optimización

### Estrategia de Caché

```mermaid
graph TB
    subgraph "Client Side"
        A[Browser Cache]
        B[localStorage]
        C[React State]
    end
    
    subgraph "Next.js Cache"
        D[Static Pages]
        E[API Routes Cache]
        F[ISR Pages]
    end
    
    subgraph "Database"
        G[Query Results]
        H[Connection Pool]
    end
    
    C --> B
    D --> A
    F --> E
    E --> G
    G --> H
    
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#FFD700
```

### Rendering Strategy

```mermaid
graph LR
    subgraph "Static Generation (SSG)"
        A[Homepage]
        B[About Page]
        C[FAQ]
    end
    
    subgraph "Server Side Rendering (SSR)"
        D[Product Detail]
        E[User Profile]
        F[Admin Dashboard]
    end
    
    subgraph "Client Side Rendering (CSR)"
        G[Cart]
        H[Search Results]
        I[Filters]
    end
    
    subgraph "Incremental Static Regeneration (ISR)"
        J[Product List]
        K[Category Pages]
    end
    
    style A fill:#90EE90
    style J fill:#FFD700
    style D fill:#87CEEB
    style G fill:#FFB6C1
```

---

## Monitoreo y Logging

### Sistema de Logs

```mermaid
graph TB
    subgraph "Application Events"
        A[User Actions]
        B[API Calls]
        C[Errors]
        D[Performance Metrics]
    end
    
    subgraph "Logging Service"
        E[Console Logs]
        F[File Logs]
        G[Sentry]
        H[Vercel Analytics]
    end
    
    subgraph "Monitoring Dashboard"
        I[Error Rate]
        J[Response Time]
        K[User Activity]
        L[Sales Metrics]
    end
    
    A --> E
    B --> E
    C --> G
    D --> H
    
    E --> I
    F --> I
    G --> I
    H --> J
    
    I --> L
    J --> L
    K --> L
```

---

## Deployment Pipeline

```mermaid
graph LR
    A[Local Development] -->|git push| B[GitHub]
    B -->|webhook| C[Vercel]
    
    C --> D{Build}
    D -->|Success| E[Preview Deploy]
    D -->|Fail| F[Notify Developer]
    
    E --> G{Tests Pass?}
    G -->|Yes| H[Production Deploy]
    G -->|No| F
    
    H --> I[Database Migration]
    I --> J[Revalidate Cache]
    J --> K[Live Site]
    
    F --> A
```

---

## Conclusión

Este documento proporciona una visión visual completa de la arquitectura del sistema RTECH E-Commerce, incluyendo:

- **Arquitectura de componentes**: Cómo se organizan y comunican los diferentes módulos
- **Flujos de negocio**: Procesos clave del sistema desde la perspectiva del usuario
- **Diagramas de secuencia**: Interacciones detalladas entre componentes
- **Modelo de datos**: Estructura y relaciones de la base de datos
- **Integraciones**: Cómo se conecta con servicios externos
- **Seguridad**: Mecanismos de autenticación y autorización
- **Performance**: Estrategias de caché y optimización
- **Deployment**: Pipeline de despliegue

Para información detallada sobre implementación, consultar el **MANUAL_COMPLETO.md**.
