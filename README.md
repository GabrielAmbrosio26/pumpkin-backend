# Backend - Pumpkin Store

Backend REST construido con Node.js + TypeScript + Express y Prisma (PostgreSQL).

Resumen
- API para usuarios, productos y carrito (pedidos).
- Prisma como ORM; migraciones en `prisma/migrations`.

Requisitos
- Node.js 18+ (recomendado)
- PostgreSQL accesible y `DATABASE_URL` configurada

Instalación (PowerShell)
```powershell
cd `backend-store`
npm install
```

Variables de entorno
- `DATABASE_URL` : URL de la base de datos PostgreSQL
- `PORT` (opcional) : puerto del servidor (por defecto 4000)

Comandos útiles
- Generar cliente Prisma: `npx prisma generate`
- Aplicar migraciones (producción): `npx prisma migrate deploy`
- Migración en desarrollo: `npx prisma migrate dev --name <nombre>`
- Ejecutar seed (crea productos de ejemplo): `npx ts-node src/seed.ts`
- Desarrollo: `npm run dev` (usa `ts-node index.ts`)
- Build: `npm run build` y luego `npm start`

Estructura importante
- `index.ts` : servidor Express y definición de endpoints.
- `prismaClient.ts` : exporta instancia de `PrismaClient`.
- `prisma/schema.prisma` : modelos `User`, `Product`, `Pedido`.
- `src/seed.ts` : datos iniciales de productos.

Endpoints principales
- `GET /` : salud del servidor
- `GET /users` : listar usuarios
- `POST /auth/register` : registro (body: `name`, `surname`, `email`, `password`)
- `POST /auth/login` : login (body: `email`, `password`)
- `PATCH /users/:id` : actualizar usuario (body: `name`, `surname`, `avatarColor`, `avatarTextColor`)
- `GET /products` : listar productos (query `q` para búsqueda)
- `GET /products/category/:category` : productos por categoría
- `GET /categories` : lista de categorías únicas
- `GET /cart/:userId` : obtener carrito (status `CART`)
- `POST /cart/:userId` : crear/actualizar carrito (body: `productos` array, `total`)
- `DELETE /cart/:userId` : eliminar carrito

Notas técnicas y recomendaciones
- `Pedido.productos` se almacena como `String` (JSON serializado). Para búsquedas complejas, normalizar a tablas relacionadas.
- Considerar añadir autenticación con tokens (JWT) si necesitas sesiones seguras.
- Recomiendo agregar scripts en `package.json` para `prisma:generate`, `prisma:migrate` y `seed`.
