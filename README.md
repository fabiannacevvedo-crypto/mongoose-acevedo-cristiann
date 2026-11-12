# Práctica de MongoDB y Mongoose — `mongoose-acevedo-cristian`

**Autor:** Cristian Acevedo  
**Institución:** Instituto Politécnico Formosa  
**Tecnologías:** Node.js, Express, MongoDB, Mongoose, express-validator (ESModules)

## Requisitos
- Node.js 18+
- MongoDB en ejecución (local o remoto)

## Instalación y ejecución
```bash
npm install
cp .env.example .env   # ajustar MONGO_URI y PORT si es necesario
npm run dev
```

El servidor levanta en `http://localhost:3001` (por defecto) y expone la API bajo `/api`.

## Estructura del proyecto
```
src/
  config/        # conexión a MongoDB
  controllers/   # lógica de negocio y CRUD
  helpers/       # utilidades reutilizables
  middlewares/   # validaciones con express-validator y manejo de errores
  models/        # esquemas y modelos de Mongoose
  routes/        # definición de rutas
app.js
```

## Colecciones y relaciones

Se implementan 4 colecciones: **User**, **Profile**, **Course** y **Tag**.

| Relación | Tipo | Implementación | Justificación |
|---|---|---|---|
| `User.address` | **Embebida (1:1)** | Subdocumento `addressSchema` dentro de `User` | La dirección pertenece exclusivamente al usuario, se lee siempre junto con él y no se reutiliza en otras colecciones; embeberla evita joins y mejora el rendimiento de lectura. |
| `User` ↔ `Profile` | **Referenciada 1:1** | `User.profile` (ObjectId → Profile) y `Profile.user` (ObjectId → User, único) | El perfil puede crecer con muchos campos y consultarse/actualizarse de forma independiente; referenciarlo mantiene documentos livianos y respeta la unicidad 1:1. |
| `User` → `Course` | **Referenciada 1:N** | `Course.instructor` (ObjectId → User) y virtual `User.courses` | Un instructor puede dictar muchos cursos; la referencia vive en el lado "muchos" (Course) para evitar arrays ilimitados en User. |
| `Course` ↔ `Tag` | **Referenciada N:M** | `Course.tags` (array de ObjectId → Tag) y virtual `Tag.courses` | Un curso tiene múltiples etiquetas y una etiqueta puede pertenecer a múltiples cursos; el array de referencias en Course permite `$addToSet/$pull` para gestionar vínculos eficientemente. |

## Populate desde colecciones sin referencias

Las colecciones que **no almacenan** la referencia usan **virtual populate** de Mongoose (`ref`, `localField`, `foreignField`) junto con `toJSON: { virtuals: true }` y `toObject: { virtuals: true }`:
- `User` define el virtual `courses` (`localField: "_id"`, `foreignField: "instructor"`), permitiendo hacer `UserModel.find().populate("courses")` sin guardar un array de cursos en el usuario.
- `Tag` define el virtual `courses` (`localField: "_id"`, `foreignField: "tags"`), permitiendo `TagModel.find().populate("courses")` aunque Tag no guarda referencias a Course.

## Eliminaciones lógicas y en cascada

- **Eliminación lógica:** todos los modelos incluyen `deletedAt` (Date, default `null`). Las consultas filtran `deletedAt: null` y el "borrado" se realiza con `updateOne({ _id }, { $set: { deletedAt: new Date() } })`, preservando el registro.
- **Eliminación en cascada:**
  - Al eliminar lógicamente un **User**: se elimina lógicamente su **Profile** (1:1) y sus **Courses** (1:N) y se desvincula el perfil.
  - Al eliminar lógicamente un **Profile**: se desvincula del **User** (`profile = null`).
  - Al eliminar lógicamente un **Tag**: se quita su referencia de todos los **Courses** que la contenían (`$pull` sobre `Course.tags`, cascada sobre la relación N:M).

## Endpoint de vínculo N:M (agregar/quitar etiqueta a un curso)

- `POST /api/courses/:id/tags` — body: `{ "tagId": "<ObjectId>" }`. Valida que el curso y la etiqueta existan y que el vínculo no esté duplicado; agrega el vínculo con `$addToSet`.
- `DELETE /api/courses/:id/tags/:tagId` — elimina el vínculo con `$pull`.

## Endpoints principales

### Users
- `POST /api/users` — crear
- `GET /api/users` — listar (populate profile, courses)
- `GET /api/users/:id` — obtener por id
- `PUT /api/users/:id` — actualizar
- `DELETE /api/users/:id` — eliminación lógica en cascada

### Profiles
- `POST /api/profiles` — crear (vincula 1:1 con user)
- `GET /api/profiles` — listar
- `GET /api/profiles/:id` — obtener por id
- `PUT /api/profiles/:id` — actualizar
- `DELETE /api/profiles/:id` — eliminación lógica

### Courses
- `POST /api/courses` — crear
- `GET /api/courses` — listar (populate instructor, tags)
- `GET /api/courses/:id` — obtener por id
- `PUT /api/courses/:id` — actualizar
- `DELETE /api/courses/:id` — eliminación lógica
- `POST /api/courses/:id/tags` — agregar vínculo N:M
- `DELETE /api/courses/:id/tags/:tagId` — quitar vínculo N:M

### Tags
- `POST /api/tags` — crear
- `GET /api/tags` — listar (virtual populate courses)
- `GET /api/tags/:id` — obtener por id
- `PUT /api/tags/:id` — actualizar
- `DELETE /api/tags/:id` — eliminación lógica en cascada (quita de courses)

## Validaciones
- `express-validator` en todas las rutas de creación y actualización.
- Validación de parámetros `:id` con `isMongoId()` y middleware reutilizable `validateResult` (responde 400).
- Uso de `matchedData()` en los controladores para trabajar solo con datos validados.
- Validaciones personalizadas (`custom`) para existencia de documentos relacionados, unicidad y no duplicación de vínculos N:M.
- Validación de campos de la propiedad embebida `address`.
