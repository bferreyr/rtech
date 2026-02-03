-- CreateEnum
CREATE TYPE "OCAEnvironment" AS ENUM ('TESTING', 'PRODUCTION');

-- AlterTable
ALTER TABLE "Shipment" 
  ADD COLUMN "ocaOrderId" TEXT,
  ADD COLUMN "ocaOperativa" TEXT,
  ADD COLUMN "ocaBranchId" TEXT,
  ADD COLUMN "ocaBranchName" TEXT,
  ADD COLUMN "ocaRemito" TEXT,
  ALTER COLUMN "carrier" SET DEFAULT 'OCA';

-- Insert OCA configuration settings
INSERT INTO "Setting" (id, key, value, description) VALUES
  (gen_random_uuid(), 'oca_environment', 'testing', 'Ambiente OCA: testing o production'),
  (gen_random_uuid(), 'oca_username', 'test@oca.com.ar', 'Usuario e-Pak'),
  (gen_random_uuid(), 'oca_password', '123456', 'Contraseña e-Pak'),
  (gen_random_uuid(), 'oca_account', '111757/001', 'Número de cuenta OCA'),
  (gen_random_uuid(), 'oca_cuit', '30-53625919-4', 'CUIT del cliente'),
  (gen_random_uuid(), 'oca_operativa_pp', '64665', 'Operativa Puerta a Puerta'),
  (gen_random_uuid(), 'oca_operativa_ps', '62342', 'Operativa Puerta a Sucursal'),
  (gen_random_uuid(), 'oca_origin_address', '', 'Dirección de origen'),
  (gen_random_uuid(), 'oca_origin_number', '', 'Número de dirección'),
  (gen_random_uuid(), 'oca_origin_floor', '', 'Piso (opcional)'),
  (gen_random_uuid(), 'oca_origin_apartment', '', 'Departamento (opcional)'),
  (gen_random_uuid(), 'oca_origin_zip', '', 'Código postal de origen'),
  (gen_random_uuid(), 'oca_origin_city', '', 'Ciudad de origen'),
  (gen_random_uuid(), 'oca_origin_province', '', 'Provincia de origen'),
  (gen_random_uuid(), 'oca_origin_email', '', 'Email de contacto'),
  (gen_random_uuid(), 'oca_origin_observations', '', 'Observaciones para retiro'),
  (gen_random_uuid(), 'oca_default_dimensions', '{"width":10,"height":10,"depth":10}', 'Dimensiones por defecto en cm'),
  (gen_random_uuid(), 'oca_default_timeframe', '1', 'Franja horaria por defecto (1: 8-17, 2: 8-12, 3: 14-17)')
ON CONFLICT (key) DO NOTHING;
