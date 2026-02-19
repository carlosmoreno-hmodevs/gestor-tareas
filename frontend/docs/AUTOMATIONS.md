# Automatizaciones de tareas recurrentes

## Qué es una automatización

Una **automatización** es una regla que crea tareas de forma recurrente según una **periodicidad** (diaria, semanal o mensual) dentro de un **rango de fechas**. Cada vez que “toca” ejecutarse, el sistema crea una nueva tarea con los datos configurados (título, descripción, categoría, responsable, proyecto opcional, etc.) y registra en el historial que fue creada por esa automatización.

Tipos soportados:

- **Tarea desde plantilla**: la tarea se crea con los datos del blueprint (título, categoría, responsable, etc.) y opcionalmente se asocia a un proyecto.
- **Recurrente desde proyecto**: la automatización está vinculada a un proyecto; las tareas generadas se crean dentro de ese proyecto y heredan su alcance org.

## Limitación importante: solo corre con la app abierta

**No hay backend.** Las automatizaciones se evalúan **solo cuando la aplicación está abierta** en el navegador. El motor se ejecuta en estos momentos:

- Al **seleccionar la organización** (tenant).
- Al **entrar al tablero** (dashboard).
- Al **entrar a la lista de tareas**.

No se usan workers en segundo plano ni servicios externos. Si nadie abre la app, no se crean tareas aunque haya llegado la hora programada.

## Cómo probar

1. **Crear una automatización**: Admin → Automatizaciones → Nueva automatización. Configura nombre, tipo, contenido de la tarea, recurrencia (frecuencia, intervalo, hora, días/mes) y rango (inicio y opcionalmente fin).
2. **Ver próxima ejecución**: En la lista de automatizaciones se muestra “Próxima ejecución” y “Última ejecución”.
3. **Ejecutar ahora (simulación)**: Usa el botón **“Ejecutar ahora”** en una automatización para crear una tarea de inmediato sin esperar a la hora programada. Se actualiza `lastRunAt`, `nextRunAt` y el contador de ejecuciones.
4. **Comprobar la tarea creada**: La tarea aparece en la lista de tareas y en el detalle tiene en el historial la entrada de creación con `createdByAutomation`, `automationId` y `automationName`.
5. **Pausar**: Desactiva la automatización con el interruptor; dejará de crear tareas hasta que la vuelvas a activar.
6. **Fecha fin**: Si configuras una “Fecha fin”, la automatización deja de ejecutarse después de esa fecha.

### Limpiar datos para volver a probar

- **Solo automatizaciones**: En la consola del navegador (F12), Application → Local Storage, borra la clave `gestor-tareas:snapshot:automations.{tenantId}` (sustituye `{tenantId}` por el id del tenant, p. ej. `tenant-1`). Al recargar, se volverán a crear las automatizaciones demo si la lista queda vacía.
- **Tareas generadas**: Las tareas creadas por automatizaciones se guardan con el resto de tareas del tenant. Para borrarlas tendrías que eliminar o editar el snapshot de tareas (`gestor-tareas:snapshot:tasks.{tenantId}.normal` o `.ferretero`) o usar la UI de tareas si existe borrado.

## Anti-duplicados: cómo se evita ejecutar dos veces la misma ocurrencia

1. **Estado persistido**: Cada automatización guarda `nextRunAt` (próxima ejecución programada) en `localStorage` por tenant (`gestor-tareas:snapshot:automations.{tenantId}`).
2. **Condición de ejecución**: El motor solo ejecuta cuando `now >= nextRunAt` y la automatización está activa y dentro del rango (startDate / endDate).
3. **Actualización tras ejecutar**: Después de crear la tarea, se actualiza esa automatización con:
   - `lastRunAt = now`
   - `nextRunAt =` siguiente ocurrencia (calculada según frecuencia, intervalo, hora y días/mes)
   - `runCount += 1`  
   y se persiste de inmediato.
4. Así, aunque el usuario recargue la página o entre varias veces al tablero/tareas, la misma “ventana” de ejecución no se vuelve a usar porque `nextRunAt` ya se avanzó a la siguiente vez.

## Persistencia

- **Clave**: `gestor-tareas:snapshot:automations.{tenantId}`.
- **Contenido**: Array JSON de `Automation` (sin versionado de snapshot; se puede añadir después si el resto del proyecto lo usa).
- Si no existe la clave o está vacía, la primera vez que se pide la lista para ese tenant se insertan dos automatizaciones demo (revisión diaria y semanal) para que se vean datos en la UI y en el dashboard al ejecutarlas.

## Criterios de aceptación cubiertos

- Crear una automatización y ver `nextRunAt` en la lista.
- En el momento programado (o al usar “Ejecutar ahora”), se crean tareas sin duplicar la misma ocurrencia.
- Pausar detiene la creación; reactivar la reanuda.
- Una `endDate` hace que la automatización deje de ejecutarse después de esa fecha.
- Las tareas generadas aparecen en listas, proyecto (si aplica) y dashboards y alimentan KPIs.
- Multitenant, org scope, modo normal/ferretero y snapshots existentes se mantienen sin cambios.
