-- Script para crear un usuario administrador por defecto
-- Ejecutar en psql: psql -U postgres -d bd_aifitcampus -f seed-admin.sql

-- Insertar rol de administrador si no existe
INSERT INTO roles (name, is_active)
VALUES ('admin', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar rol de usuario si no existe
INSERT INTO roles (name, is_active)
VALUES ('usuario', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar usuario administrador por defecto
-- Nota: El correo debe coincidir con el de Microsoft 365
INSERT INTO users (first_name, last_name, email, password, auth_provider, role_id, status_id, created_at)
VALUES (
  'Admin',
  'Sistema',
  'nperez@uniempresarial.edu.co',
  NULL,
  'local',
  (SELECT id FROM roles WHERE name = 'admin'),
  1, -- 1 = activo
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificar que se creó correctamente
SELECT id, first_name, last_name, email, role_id, status_id FROM users WHERE email = 'nperez@uniempresarial.edu.co';
