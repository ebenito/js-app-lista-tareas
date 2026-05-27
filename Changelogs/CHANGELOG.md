# Changelog

## [1.1.0] - 2026-05-27

### Corrección de bugs

- **Vulnerabilidad XSS eliminada** (`src/todos/use-cases/create-todo-html.js`)  
  La descripción de cada tarea se insertaba directamente en `innerHTML`, permitiendo la ejecución de código malicioso. Ahora se construye el elemento mediante la DOM API y se asigna con `textContent`.

- **Input de edición inline con valor hardcodeado** (`src/todos/use-cases/create-todo-html.js`)  
  El `<input class="edit">` tenía `value="Create a TodoMVC template"` fijo. Ahora usa la descripción real de la tarea.

- **Clase duplicada en el filtro "Todos"** (`src/todos/app.html`)  
  El primer enlace de filtro tenía dos atributos `class` (`class="filtro" class="selected"`), lo que hacía que el segundo sobreescribiera al primero y el listener nunca se aplicara. Corregido a `class="filtro selected"`.

- **`event.keyCode` deprecado** (`src/todos/app.js`)  
  Se reemplazó `event.keyCode !== 13` por `event.key !== 'Enter'`, siguiendo el estándar moderno de la Web API.

- **`loadStore` no reconstruía instancias de `Todo`** (`src/store/todo.store.js`)  
  Al leer desde `localStorage`, los objetos se cargaban como literales planos. Ahora cada objeto se reconstruye con `new Todo()` para preservar el prototipo y convertir `createdAt` de vuelta a `Date`.

- **`Filters` con valores inconsistentes** (`src/store/todo.store.js`)  
  Los valores `'Completed'` y `'Pending'` tenían la primera letra en mayúscula mientras que `'all'` estaba en minúsculas. Todos los valores pasan a minúsculas: `'all'`, `'completed'`, `'pending'`.

---

### Nuevas funcionalidades

- **Edición inline de tareas** (`src/todos/app.js`, `src/todos/use-cases/create-todo-html.js`)  
  Doble clic sobre una tarea activa el modo edición (clase CSS `editing`). La edición se confirma con `Enter` o al perder el foco, y se cancela con `Escape`. Si se deja el campo vacío al confirmar, la tarea se elimina.

- **Toggle-all funcional** (`src/todos/app.js`, `src/store/todo.store.js`)  
  El checkbox `#toggle-all` ahora marca o desmarca todas las tareas a la vez. Se añadieron al store el método `toggleAll()` y el getter `isAllCompleted()`, que también mantiene el estado visual del checkbox sincronizado.

- **Hash routing** (`src/todos/app.js`, `src/todos/app.html`)  
  El filtro activo se refleja en la URL (`#/`, `#/active`, `#/completed`) y se restaura al recargar la página. Se escucha el evento `hashchange` para sincronizar el filtro con la navegación del navegador. Se añadió el atributo `data-filter` a cada enlace de filtro.

- **Ocultar sección y footer cuando no hay tareas** (`src/todos/app.js`)  
  Las secciones `.main` y `.footer` se ocultan automáticamente cuando la lista de tareas está vacía, siguiendo la especificación visual de TodoMVC.

- **`updateTodo()`** (`src/store/todo.store.js`)  
  Nuevo método del store que permite actualizar la descripción de una tarea existente por su ID.

---

### Refactorización

- **Dos listeners `click` fusionados en uno** (`src/todos/app.js`)  
  Existían dos event listeners independientes en `todoListUL` para gestionar el toggle y el borrado. Se unificaron en un único listener que diferencia la acción por clase del elemento clickado (`.toggle` o `.destroy`).

- **Filtros matcheados por `data-filter`** (`src/todos/app.js`, `src/todos/app.html`)  
  El filtro activo se determinaba comparando el texto visible del enlace (`element.target.text`), lo cual era frágil ante cambios de idioma o contenido. Ahora se usa el atributo `data-filter` del elemento.

---

## [1.0.0] - inicial

- Aplicación Todo básica con Vite y JavaScript vanilla.
- Persistencia en `localStorage`.
- Filtros: Todos, Pendientes, Completados.
- Datos de ejemplo precargados en el store.
