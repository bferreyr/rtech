# SKILLS.md — Habilidades Técnicas

Este archivo documenta las habilidades técnicas disponibles para los agentes. Cada skill describe **cuándo usarla, cómo aplicarla y ejemplos concretos** en el contexto de Rincón TECH.

---

## SKILL: Server Components y Data Fetching

**Cuándo usar:** Siempre que se necesite mostrar datos en una página o layout sin interactividad del usuario.

**Cómo aplicar:**
- El componente no lleva `"use client"`.
- El fetch de datos se hace directamente en el cuerpo del componente con `async/await`.
- Usar `unstable_cache` para cachear resultados de queries costosas.
- Pasar solo los datos necesarios como props a los Client Components hijos.

```tsx
// app/(shop)/productos/page.tsx
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

const getProductos = unstable_cache(
  async () => {
    return prisma.product.findMany({
      select: { id: true, name: true, price: true, slug: true },
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  },
  ['productos-lista'],
  { revalidate: 3600, tags: ['productos'] }
)

export default async function ProductosPage() {
  const productos = await getProductos()
  return <ProductosGrid productos={productos} />
}
```

---

## SKILL: Server Actions

**Cuándo usar:** Para mutaciones de datos (crear, actualizar, eliminar) desde formularios o interacciones del usuario.

**Cómo aplicar:**
- Archivo con `"use server"` al inicio o función con la directiva.
- Validar siempre el input con Zod antes de tocar la base de datos.
- Retornar siempre `{ success: true, data? }` o `{ success: false, error: string }`.
- Usar `revalidatePath` o `revalidateTag` después de mutaciones exitosas.

```ts
// app/actions/productos.ts
"use server"

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidateTag } from 'next/cache'

const CreateProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  categoryId: z.string().cuid(),
})

export async function createProducto(input: unknown) {
  try {
    const data = CreateProductSchema.parse(input)
    const producto = await prisma.product.create({ data })
    revalidateTag('productos')
    return { success: true, data: producto }
  } catch (error) {
    console.error('[createProducto]', error)
    return { success: false, error: 'No se pudo crear el producto.' }
  }
}
```

---

## SKILL: Formularios con React Hook Form + Zod

**Cuándo usar:** Cualquier formulario con validación en el cliente (login, checkout, admin CRUD).

**Cómo aplicar:**
- Definir el schema Zod para el formulario.
- Usar `useForm` con `zodResolver`.
- Conectar al Server Action con `action` o mediante `handleSubmit`.
- Mostrar errores de campo con `formState.errors`.

```tsx
"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // llamar Server Action o signIn de Auth.js
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      <input type="password" {...register('password')} />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      <button type="submit" disabled={isSubmitting}>Ingresar</button>
    </form>
  )
}
```

---

## SKILL: Queries Prisma Optimizados

**Cuándo usar:** Toda interacción con la base de datos PostgreSQL.

**Cómo aplicar:**
- Usar `select` explícito: nunca traer el modelo completo.
- Usar `include` solo para relaciones necesarias, con `select` anidado.
- Siempre incluir `take` y `skip` en queries de lista (paginación).
- Para operaciones de solo lectura en listas grandes, considerar índices en el schema Prisma.

```ts
// ✅ Correcto — solo los campos necesarios
const productos = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    images: { select: { url: true }, take: 1 },
    category: { select: { name: true } },
  },
  where: { active: true },
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
})

// ❌ Incorrecto — trae todo, incluye contraseñas y campos innecesarios
const productos = await prisma.product.findMany()
```

---

## SKILL: Caching y Revalidación en Next.js

**Cuándo usar:** Para cachear datos que cambian con poca frecuencia y necesitan revalidarse tras mutaciones.

**Cómo aplicar:**
- `unstable_cache` para cachear resultados de funciones async (queries, fetches externos).
- `revalidateTag(tag)` en Server Actions para invalidar cachés relacionados tras una mutación.
- `revalidatePath(path)` cuando se necesita regenerar una ruta específica.

```ts
// Cachear query con tag
const getData = unstable_cache(fn, ['cache-key'], { tags: ['mi-tag'], revalidate: 3600 })

// Invalidar tras mutación
revalidateTag('mi-tag')
revalidatePath('/admin/productos')
```

---

## SKILL: Componentes Client con Estado

**Cuándo usar:** Solo cuando hay interactividad real: toggles, modales, formularios controlados, drag & drop, filtros dinámicos.

**Cómo aplicar:**
- Agregar `"use client"` al inicio del archivo.
- Mantener el componente lo más pequeño posible — solo la parte interactiva.
- Recibir los datos iniciales como props desde el Server Component padre.
- No hacer fetch de datos dentro de Client Components — recibirlos como props.

```tsx
"use client"

import { useState } from 'react'

interface Props {
  initialCount: number
}

export function Counter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount)
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  )
}
```

---

## SKILL: Autenticación con Auth.js v5

**Cuándo usar:** Proteger rutas del panel `/admin`, obtener sesión del usuario, verificar roles.

**Cómo aplicar:**
- Usar `auth()` de Auth.js en Server Components y Server Actions para obtener la sesión.
- Proteger rutas admin verificando `session.user.role === 'ADMIN'` antes de renderizar o ejecutar.
- No usar `useSession` en Client Components si el dato se puede pasar como prop desde el servidor.

```ts
// En un Server Component o Server Action
import { auth } from '@/lib/auth'

export default async function AdminPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }
  // renderizar panel
}
```

---

## SKILL: Imágenes Optimizadas

**Cuándo usar:** Siempre que se muestre una imagen en la interfaz.

**Cómo aplicar:**
- Usar siempre `next/image` en lugar de `<img>`.
- Definir `width` y `height` para imágenes de tamaño conocido.
- Usar `fill` + contenedor con `position: relative` para imágenes responsivas.
- Agregar `priority` solo en imágenes above-the-fold (hero, primera imagen del producto).
- Configurar los dominios de imágenes externas en `next.config.js`.

```tsx
import Image from 'next/image'

// Tamaño fijo
<Image src={producto.imageUrl} alt={producto.name} width={400} height={400} />

// Responsivo
<div className="relative w-full aspect-square">
  <Image src={producto.imageUrl} alt={producto.name} fill className="object-cover" />
</div>
```

---

## SKILL: Importación de Productos con SheetJS

**Cuándo usar:** Procesamiento de archivos Excel para importaciones masivas del catálogo (desde ELIT u otras fuentes).

**Cómo aplicar:**
- Leer el archivo en una Route Handler o Server Action.
- Parsear con `XLSX.read` y convertir a JSON con `XLSX.utils.sheet_to_json`.
- Validar cada fila con Zod antes de insertar en la base de datos.
- Usar `prisma.createMany` con `skipDuplicates: true` para eficiencia.

```ts
import * as XLSX from 'xlsx'

const workbook = XLSX.read(buffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet)

// Validar y persistir filas...
```
