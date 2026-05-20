# RULES.md — Reglas Globales

Estas reglas aplican a **todos los agentes** sin excepción. Deben respetarse en cada tarea, archivo generado o decisión técnica.

---

## 1. Lenguaje y Comunicación

- Toda comunicación con el usuario es en **español**.
- Los nombres de variables, funciones, tipos y comentarios en código van en **inglés** (convención estándar del stack).
- Las respuestas deben ser **concisas y orientadas a la acción**: explicar el qué y el por qué, sin relleno.
- Ante ambigüedad, **preguntar antes de asumir**.

---

## 2. Tecnología y Stack

- Usar **exclusivamente** las librerías del stack definido en `PROJECT.md`. No proponer ni instalar dependencias externas sin aprobación explícita.
- Todo código nuevo debe estar escrito en **TypeScript**. Prohibido usar `any` salvo casos justificados con comentario.
- Respetar la arquitectura **App Router de Next.js 15**: sin mezclar patrones de Pages Router.
- Los estilos se escriben con **Tailwind CSS**. No crear archivos `.css` o `.scss` separados salvo necesidad justificada.
- Usar **Lucide React** para todos los íconos. No importar librerías de íconos adicionales.

---

## 3. Base de Datos

- Toda interacción con la base de datos pasa por **Prisma ORM**. Prohibido SQL raw salvo casos extremos justificados.
- Los queries deben usar `select` explícito para traer solo los campos necesarios — nunca traer el modelo completo si no se necesita.
- Los campos sensibles (contraseñas, tokens) **nunca** se incluyen en los `select` de lectura.
- Ante cambios en el esquema, siempre generar la migración con `prisma migrate dev`.

---

## 4. Autenticación y Seguridad

- La autenticación se maneja exclusivamente con **Auth.js v5**. No crear sistemas de sesión propios.
- Las contraseñas siempre se hashean con **bcryptjs**. Nunca almacenar en texto plano.
- Las rutas del panel `/admin` deben verificar el rol del usuario en el servidor antes de renderizar.
- Los datos de entrada del usuario siempre se validan con **Zod** antes de procesarse.

---

## 5. Formularios

- Todos los formularios del cliente usan **React Hook Form + Zod** mediante `@hookform/resolvers`.
- No manejar estado de formulario con `useState` manual si React Hook Form puede hacerlo.
- Siempre mostrar mensajes de error de validación al usuario.

---

## 6. Componentes y Arquitectura React

- Por defecto, los componentes son **Server Components**. Solo usar `"use client"` cuando sea estrictamente necesario (interactividad, hooks de estado/efecto, APIs del navegador).
- Las operaciones de datos (fetch, mutaciones) van en **Server Actions** o **Route Handlers**, no en el cliente.
- Los componentes deben ser pequeños y de responsabilidad única. Si un componente supera ~150 líneas, evaluar división.
- Usar `dynamic()` de Next.js para importar componentes pesados que no necesiten SSR.

---

## 7. Performance (Prioridad Actual)

- **Siempre** preferir Server Components sobre Client Components para reducir el bundle del cliente.
- Usar `unstable_cache`, `revalidatePath` y `revalidateTag` correctamente para caching de datos.
- Las imágenes siempre se renderizan con `next/image` con `width`, `height` y `alt` definidos.
- Evitar re-renders innecesarios: usar `useMemo`, `useCallback` y `React.memo` cuando el profiling lo justifique.
- Los queries de lista deben incluir paginación. Prohibido traer colecciones completas sin límite.

---

## 8. Manejo de Errores

- Toda Server Action debe tener manejo de errores con `try/catch` y retornar un objeto `{ success, error }`.
- Las rutas de API (`/app/api`) deben retornar los códigos HTTP correctos (200, 400, 401, 404, 500).
- No silenciar errores con `catch(() => {})` vacíos.
- Loguear errores del servidor con `console.error` incluyendo contexto útil.

---

## 9. Estructura de Archivos

- Seguir la estructura definida en `PROJECT.md`.
- Los componentes reutilizables van en `/components`.
- Las utilidades y helpers van en `/lib`.
- No crear archivos en la raíz del proyecto sin justificación.

---

## 10. Control de Calidad

- Antes de entregar cualquier código, el agente debe verificar mentalmente:
  1. ¿Compila sin errores de TypeScript?
  2. ¿Sigue las reglas de este archivo?
  3. ¿Es la solución más simple que resuelve el problema?
  4. ¿Impacta negativamente la performance?
- No generar código comentado ("código muerto") en la entrega final.
- No dejar `TODO` o `FIXME` sin descripción clara de qué falta y por qué.
