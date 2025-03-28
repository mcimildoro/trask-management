📝 Task Management App
Aplicación desarrollada con React, Redux Toolkit y Next.js para la gestión de tareas.
Permite a los usuarios autenticarse, crear, completar y eliminar tareas, además de visualizar un resumen dinámico.

🔐 Backend originalmente propuesto en Java, pero se ha implementado con Supabase (PostgreSQL + Auth) para aprovechar un entorno fullstack JavaScript moderno, desplegable fácilmente en plataformas como Vercel


🚀 Funcionalidades principales
1️⃣ Lista de Tareas
Componente: <TaskList />
🔹 Muestra todas las tareas del usuario desde el backend
🔹 Permite marcar una tarea como completada
🔹 Cada tarea puede eliminarse

2️⃣ Formulario para Agregar Tareas
Componente: <TaskForm />
🔹 Campo de texto para ingresar una nueva tarea
🔹 Botón "Agregar"
🔹 Al enviar, la lista se actualiza automáticamente

3️⃣ Resumen de Tareas
Componente: <TaskSummary />
🔹 Total de tareas
🔹 Tareas completadas
🔹 Tareas pendientes
🔹 Se actualiza dinámicamente al agregar, completar o eliminar tareas

✨ Funcionalidades adicionales
✅ Registro y login de usuarios (signup / signin)
✅ Cada usuario ve únicamente sus propias tareas
✅ Backend seguro con Supabase (o Firebase/PostgreSQL)
✅ Despliegue continuo con Vercel
