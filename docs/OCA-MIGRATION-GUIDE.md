# Guía de Migración de Base de Datos - OCA Integration

Esta guía te ayudará a aplicar la migración de base de datos para la integración de OCA e-Pak.

## ⚠️ Importante

Antes de ejecutar la migración, asegúrate de:
1. Tener un backup de tu base de datos
2. Estar en un ambiente de desarrollo o staging primero
3. Verificar que no haya operaciones críticas en curso

## Opción 1: Usar Prisma Migrate (Recomendado)

Esta es la forma más segura y recomendada:

```powershell
# 1. Generar el cliente de Prisma con los nuevos campos
npx prisma generate

# 2. Aplicar la migración
npx prisma db push

# O si prefieres crear una migración formal:
npx prisma migrate dev --name add_oca_integration
```

## Opción 2: Ejecutar SQL Manualmente

Si Prisma Migrate no funciona, puedes ejecutar el SQL directamente:

### Usando psql (si está instalado):

```powershell
# Conectarse a la base de datos
psql -U postgres -d rtech -f prisma/migrations/add_oca_integration.sql
```

### Usando pgAdmin o DBeaver:

1. Abre tu cliente de PostgreSQL (pgAdmin, DBeaver, etc.)
2. Conéctate a tu base de datos `rtech`
3. Abre el archivo `prisma/migrations/add_oca_integration.sql`
4. Ejecuta el script completo

### Usando Node.js (script de migración):

Crea un archivo `scripts/migrate-oca.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, '../prisma/migrations/add_oca_integration.sql'),
            'utf-8'
        );

        // Ejecutar el SQL
        await prisma.$executeRawUnsafe(sql);
        
        console.log('✅ Migración aplicada exitosamente');
    } catch (error) {
        console.error('❌ Error en la migración:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
```

Luego ejecuta:

```powershell
node scripts/migrate-oca.js
```

## Verificación Post-Migración

Después de aplicar la migración, verifica que todo esté correcto:

```powershell
# 1. Regenerar el cliente de Prisma
npx prisma generate

# 2. Verificar el schema
npx prisma db pull

# 3. Reiniciar el servidor de desarrollo
npm run dev
```

## Verificación Manual en la Base de Datos

Ejecuta estas consultas para verificar:

```sql
-- Verificar que las columnas OCA se agregaron
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Shipment' 
  AND column_name LIKE 'oca%';

-- Verificar configuración OCA
SELECT key, description 
FROM "Setting" 
WHERE key LIKE 'oca_%'
ORDER BY key;

-- Verificar el default del carrier
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'Shipment' 
  AND column_name = 'carrier';
```

Deberías ver:
- 5 columnas nuevas: `ocaOrderId`, `ocaOperativa`, `ocaBranchId`, `ocaBranchName`, `ocaRemito`
- 18 configuraciones OCA en la tabla Setting
- El default de `carrier` debe ser `'OCA'`

## Problemas Comunes

### Error: "relation Shipment does not exist"
- Asegúrate de que la base de datos existe y está accesible
- Verifica la conexión en `.env`

### Error: "column already exists"
- La migración ya fue aplicada parcialmente
- Puedes comentar las líneas que ya se ejecutaron en el SQL

### Error de permisos
- Asegúrate de que el usuario de PostgreSQL tenga permisos para ALTER TABLE e INSERT

### TypeScript sigue mostrando errores
- Ejecuta `npx prisma generate` nuevamente
- Reinicia el servidor de TypeScript en VS Code (Ctrl+Shift+P → "TypeScript: Restart TS Server")

## Rollback (si algo sale mal)

Si necesitas revertir la migración:

```sql
-- Eliminar columnas OCA
ALTER TABLE "Shipment" 
DROP COLUMN IF EXISTS "ocaOrderId",
DROP COLUMN IF EXISTS "ocaOperativa",
DROP COLUMN IF EXISTS "ocaBranchId",
DROP COLUMN IF EXISTS "ocaBranchName",
DROP COLUMN IF EXISTS "ocaRemito";

-- Restaurar default anterior del carrier
ALTER TABLE "Shipment" 
ALTER COLUMN "carrier" SET DEFAULT 'Correo Argentino';

-- Eliminar configuración OCA
DELETE FROM "Setting" WHERE "key" LIKE 'oca_%';
```

## Siguiente Paso

Una vez aplicada la migración exitosamente:

1. Reinicia el servidor de desarrollo
2. Ve a `/admin/settings`
3. Configura tus credenciales de OCA
4. Prueba crear un envío de prueba en el ambiente de testing

## Soporte

Si encuentras problemas durante la migración, revisa:
- Los logs de PostgreSQL
- Los errores en la consola de Node.js
- El estado de la conexión a la base de datos

¿Necesitas ayuda? Comparte el error específico que estás recibiendo.
