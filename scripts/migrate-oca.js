const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    console.log('🚀 Iniciando migración OCA e-Pak...\n');

    try {
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '../prisma/migrations/add_oca_integration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        console.log('📄 Archivo de migración cargado');
        console.log('📊 Ejecutando SQL...\n');

        // Dividir el SQL en statements individuales
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        let executed = 0;
        for (const statement of statements) {
            try {
                await prisma.$executeRawUnsafe(statement);
                executed++;
                console.log(`✅ Statement ${executed}/${statements.length} ejecutado`);
            } catch (error) {
                // Ignorar errores de "already exists" o "duplicate key"
                if (
                    error.message.includes('already exists') ||
                    error.message.includes('duplicate key') ||
                    error.message.includes('ON CONFLICT')
                ) {
                    console.log(`⚠️  Statement ${executed + 1} ya aplicado (ignorado)`);
                    executed++;
                } else {
                    throw error;
                }
            }
        }

        console.log('\n✅ Migración completada exitosamente!\n');

        // Verificación
        console.log('🔍 Verificando migración...\n');

        // Verificar columnas OCA
        const columns = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'Shipment' 
                AND column_name IN ('ocaOrderId', 'ocaOperativa', 'ocaBranchId', 'ocaBranchName', 'ocaRemito', 'carrier')
            ORDER BY ordinal_position
        `;

        console.log('📋 Columnas OCA en Shipment:');
        console.table(columns);

        // Verificar settings OCA
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    startsWith: 'oca_'
                }
            },
            select: {
                key: true,
                description: true,
                value: true
            },
            orderBy: {
                key: 'asc'
            }
        });

        console.log('\n⚙️  Configuraciones OCA creadas:');
        console.table(settings.map(s => ({
            key: s.key,
            description: s.description,
            hasValue: s.value ? '✓' : '✗'
        })));

        console.log('\n✨ Todo listo! Ahora puedes:');
        console.log('1. Ejecutar: npx prisma generate');
        console.log('2. Reiniciar el servidor de desarrollo');
        console.log('3. Ir a /admin/settings para configurar OCA\n');

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message);
        console.error('\nDetalles del error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar migración
migrate();
