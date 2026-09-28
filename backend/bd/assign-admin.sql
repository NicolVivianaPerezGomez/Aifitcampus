-- Script para asignar rol de administrador a un usuario
-- Ejecutar en psql: psql -U postgres -d bd_aifitcampus -f assign-admin.sql

-- Verificar si el rol "admin" existe, si no, crearlo
INSERT INTO roles (name, is_active)
VALUES ('admin', true)
ON CONFLICT (name) DO NOTHING;

-- Asignar rol de administrador al usuario con correo específico
-- Cambia 'nperez@uniempresarial.edu.co' por el correo de la persona que será administradora
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE email = 'nperez@uniempresarial.edu.co';

-- Verificar que se asignó correctamente
SELECT u.id, u.first_name, u.last_name, u.email, r.name as role
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email = 'nperez@uniempresarial.edu.co';
