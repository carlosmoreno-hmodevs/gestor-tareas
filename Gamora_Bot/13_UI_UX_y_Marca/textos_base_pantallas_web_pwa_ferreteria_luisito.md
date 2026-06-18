# Textos Base de Pantallas Web/PWA — Ferretería Luisito

## Estado

Documento base para validar los textos, etiquetas, títulos, subtítulos, botones y mensajes de las pantallas simuladas web/PWA del prototipo estático de Gamora Bot.

## Propósito

Este documento define el contenido textual que aparecerá en las pantallas simuladas fuera de WhatsApp.

No define diseño visual final.

No define layout definitivo.

No define componentes técnicos.

No define código.

Su propósito es asegurar que la experiencia web/PWA sea clara, ligera y entendible antes de diseñar wireframes o interfaces visuales.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Principio de experiencia

Las pantallas deben ayudar al usuario a entender qué está pasando, qué debe hacer y qué sigue.

El texto debe ser:

- breve,
    
- claro,
    
- humano,
    
- operativo,
    
- no técnico,
    
- no corporativo,
    
- no burocrático.
    

## Regla principal

Cada pantalla debe tener un solo objetivo principal.

Si una pantalla intenta explicar demasiado, se debe simplificar.

---

# Pantalla 1 — Inicio / Vista principal de Luisito

## Objetivo de la pantalla

Mostrar a Luisito el estado general de sus compromisos sin saturarlo.

## Título recomendado

**Hola, Luisito**

## Subtítulo recomendado

Estos son los compromisos que necesitan tu atención hoy.

## Bloques principales

### Bloque 1 — Compromisos activos

Texto recomendado:

**Compromisos activos**

Aquí verás los pendientes que todavía están en seguimiento.

### Bloque 2 — Evidencias por revisar

Texto recomendado:

**Evidencias por revisar**

Compromisos donde alguien ya mandó evidencia y necesitan tu aprobación o corrección.

### Bloque 3 — Necesitan corrección

Texto recomendado:

**Necesitan corrección**

Compromisos donde pediste un ajuste y estás esperando nueva evidencia.

### Bloque 4 — Cerrados hoy

Texto recomendado:

**Cerrados hoy**

Compromisos que ya fueron revisados, aprobados y cerrados.

## Botón principal

**Crear compromiso**

## Botones secundarios

- Ver todos
    
- Ver cerrados
    
- Ver pendientes
    

## Mensaje vacío recomendado

Cuando no hay compromisos pendientes:

**No tienes compromisos pendientes por ahora.**

Subtexto:

Cuando crees un compromiso, aparecerá aquí para darle seguimiento.

## Nota de UX

Esta pantalla debe dar sensación de control, no de carga administrativa.

Luisito debe entender rápidamente qué requiere atención.

---

# Pantalla 2 — Crear compromiso

## Objetivo de la pantalla

Permitir a Luisito crear un compromiso operativo con los datos mínimos necesarios.

## Título recomendado

**Crear compromiso**

## Subtítulo recomendado

Convierte un pendiente operativo en un compromiso claro, con responsable, fecha y evidencia esperada.

## Campos recomendados

### Campo 1 — Responsable

Etiqueta:

**Responsable**

Placeholder:

**Selecciona quién debe atenderlo**

Valor para la demo:

**Panchito**

### Campo 2 — Qué debe hacer

Etiqueta:

**Qué debe hacer**

Placeholder:

**Escribe el compromiso de forma clara**

Valor para la demo:

**Contar los sacos de cemento disponibles**

### Campo 3 — Ubicación

Etiqueta:

**Dónde aplica**

Placeholder:

**Sucursal, área o lugar**

Valor para la demo:

**Sucursal Norte**

### Campo 4 — Fecha compromiso

Etiqueta:

**Para cuándo**

Placeholder:

**Selecciona fecha y hora**

Valor para la demo:

**Hoy antes de las 5:00 p.m.**

### Campo 5 — Evidencia esperada

Etiqueta:

**Qué evidencia debe mandar**

Placeholder:

**Ejemplo: foto, cantidad, comentario o archivo**

Valor para la demo:

**Foto del área de cemento y cantidad total de sacos**

## Botón principal

**Crear compromiso**

## Botón secundario

**Cancelar**

## Mensaje de ayuda

Texto recomendado:

Mientras más clara sea la evidencia esperada, más fácil será cerrar el compromiso sin estar preguntando después.

## Mensaje de confirmación

Después de crear:

**Compromiso creado**

Subtexto:

Panchito recibirá la instrucción con fecha compromiso y evidencia esperada.

## Nota crítica

No usar demasiados campos.

No incluir prioridad, categoría, etiquetas, aprobadores, recordatorios avanzados ni configuraciones en esta primera demo.

---

# Pantalla 3 — Detalle del compromiso para Luisito

## Objetivo de la pantalla

Mostrar a Luisito toda la información importante del compromiso en un solo lugar.

## Título recomendado

**Contar sacos de cemento**

## Subtítulo recomendado

Compromiso asignado a Panchito en Sucursal Norte.

## Estado visible

**Aceptado**

o según momento del flujo:

- Nuevo
    
- Aceptado
    
- En proceso
    
- Evidencia enviada
    
- Necesita corrección
    
- Corregido
    
- Cerrado
    

## Información principal

### Responsable

**Panchito**

### Fecha compromiso

**Hoy antes de las 5:00 p.m.**

### Evidencia esperada

**Foto del área de cemento y cantidad total de sacos.**

### Ubicación

**Sucursal Norte**

## Acciones disponibles según estado

### Si está Nuevo

- Ver compromiso
    
- Esperar aceptación
    

### Si está Aceptado

- Ver estado
    
- Enviar recordatorio
    

Nota: en la primera demo, “Enviar recordatorio” puede omitirse para no complicar.

### Si tiene Evidencia enviada

- Revisar evidencia
    
- Pedir corrección
    
- Aprobar y cerrar
    

### Si Necesita corrección

- Ver corrección solicitada
    
- Ver historial
    

### Si está Corregido

- Revisar evidencia corregida
    
- Aprobar y cerrar
    
- Pedir nueva corrección
    

### Si está Cerrado

- Ver historial
    
- Crear compromiso similar
    

## Mensaje de contexto

Texto recomendado:

Este compromiso concentra la instrucción, evidencia, revisión y cierre en un solo lugar.

## Nota de UX

Esta pantalla debe reforzar la diferencia entre un mensaje suelto de WhatsApp y un compromiso trazable.

---

# Pantalla 4 — Mi día / Vista de Panchito

## Objetivo de la pantalla

Mostrar a Panchito solamente los compromisos que debe atender, sin tablero complejo.

## Título recomendado

**Mi día**

## Subtítulo recomendado

Estos son tus compromisos pendientes.

## Tarjeta del compromiso

### Título de tarjeta

**Contar sacos de cemento**

### Descripción

Sucursal Norte.

### Fecha compromiso

**Hoy antes de las 5:00 p.m.**

### Estado

**Aceptado**

### Evidencia esperada

**Foto del área de cemento y cantidad total de sacos.**

## Botón principal

**Enviar evidencia**

## Botón secundario

**Ver detalle**

## Mensaje vacío recomendado

Si Panchito no tiene pendientes:

**No tienes compromisos pendientes.**

Subtexto:

Cuando te asignen uno nuevo, aparecerá aquí.

## Nota crítica

Panchito no debe ver analítica, reportes, configuración, historial completo ni información de otros usuarios.

Para Panchito, la experiencia debe ser:

**entiendo, hago, evidencio.**

---

# Pantalla 5 — Detalle del compromiso para Panchito

## Objetivo de la pantalla

Mostrar a Panchito qué debe hacer y cómo cumplir.

## Título recomendado

**Contar sacos de cemento**

## Subtítulo recomendado

Luisito te asignó este compromiso para Sucursal Norte.

## Información principal

### Qué hay que hacer

**Contar los sacos de cemento disponibles.**

### Para cuándo

**Hoy antes de las 5:00 p.m.**

### Qué evidencia debes mandar

**Una foto del área de cemento y la cantidad total de sacos.**

## Estado

**Aceptado**

## Botón principal

**Enviar evidencia**

## Botones secundarios

- Tengo una duda
    
- Ver mensaje original
    

## Mensaje de ayuda

Texto recomendado:

Asegúrate de que la foto muestre claramente el área de cemento.

## Nota de UX

No saturar esta pantalla con trazabilidad ni historial. Panchito solo necesita saber qué hacer y cómo reportarlo.

---

# Pantalla 6 — Enviar evidencia

## Objetivo de la pantalla

Permitir que Panchito reporte cumplimiento con foto y cantidad.

## Título recomendado

**Enviar evidencia**

## Subtítulo recomendado

Agrega la foto y confirma la cantidad total de sacos.

## Campos recomendados

### Campo 1 — Foto

Etiqueta:

**Foto de evidencia**

Botón:

**Agregar foto**

Texto de ayuda:

La foto debe mostrar el área de cemento lo más completa posible.

### Campo 2 — Cantidad total

Etiqueta:

**Cantidad total de sacos**

Placeholder:

**Ejemplo: 48**

Valor para demo:

**48**

### Campo 3 — Comentario opcional

Etiqueta:

**Comentario**

Placeholder:

**Agrega una nota si hace falta**

Valor para demo:

**Listo, hay 48 sacos de cemento disponibles.**

## Botón principal

**Enviar evidencia**

## Botón secundario

**Cancelar**

## Confirmación después de enviar

Título:

**Evidencia enviada**

Subtexto:

Luisito recibirá la evidencia para revisión.

Mensaje adicional:

Te avisaremos si queda cerrada o si hace falta corregir algo.

## Nota crítica

No decir “compromiso cerrado” después de enviar evidencia.

La evidencia enviada todavía requiere revisión de Luisito.

---

# Pantalla 7 — Revisar evidencia para Luisito

## Objetivo de la pantalla

Permitir a Luisito revisar la evidencia y decidir si aprueba o pide corrección.

## Título recomendado

**Revisar evidencia**

## Subtítulo recomendado

Panchito envió evidencia para este compromiso.

## Información del compromiso

### Compromiso

**Contar los sacos de cemento disponibles en Sucursal Norte.**

### Responsable

**Panchito**

### Fecha compromiso

**Hoy antes de las 5:00 p.m.**

### Cantidad reportada

**48 sacos**

### Evidencia enviada

**Foto del área de cemento**

## Decisión requerida

Texto recomendado:

¿Qué deseas hacer con esta evidencia?

## Botón principal

**Aprobar y cerrar**

## Botón secundario

**Pedir corrección**

## Mensaje de ayuda

Texto recomendado:

Aprueba solo si la evidencia es suficiente para confirmar que el compromiso fue cumplido.

## Nota crítica

Esta pantalla debe tener solo dos decisiones principales.

No agregar opciones avanzadas en esta etapa.

---

# Pantalla 8 — Pedir corrección

## Objetivo de la pantalla

Permitir a Luisito explicar qué falta corregir de forma clara y amable.

## Título recomendado

**Pedir corrección**

## Subtítulo recomendado

Explica qué debe ajustar Panchito para poder cerrar el compromiso.

## Campo principal

### Motivo de corrección

Etiqueta:

**Qué falta corregir**

Placeholder:

**Ejemplo: la foto no muestra completo el área**

Valor para demo:

**La foto no muestra completo el espacio de cemento. Por favor manda una foto más abierta y confirma nuevamente la cantidad total.**

## Botón principal

**Enviar corrección**

## Botón secundario

**Cancelar**

## Mensaje de ayuda

Texto recomendado:

Sé específico para que Panchito sepa exactamente qué debe reenviar.

## Confirmación después de enviar

Título:

**Corrección enviada**

Subtexto:

Panchito recibirá el motivo y podrá reenviar la evidencia corregida.

## Nota de tono

Evitar lenguaje punitivo.

No usar:

**Evidencia rechazada.**

Usar:

**Se necesita una corrección.**

---

# Pantalla 9 — Corrección para Panchito

## Objetivo de la pantalla

Mostrar a Panchito qué debe corregir y permitirle reenviar evidencia.

## Título recomendado

**Se necesita una corrección**

## Subtítulo recomendado

Luisito necesita una foto más clara para poder cerrar el compromiso.

## Motivo

**La foto no muestra completo el espacio de cemento.**

## Qué debes enviar

**Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.**

## Botón principal

**Corregir y reenviar**

## Botón secundario

**Tengo una duda**

## Mensaje de ayuda

Texto recomendado:

No necesitas empezar de nuevo. Solo manda la evidencia corregida.

## Nota crítica

La corrección debe sentirse como una guía, no como regaño.

---

# Pantalla 10 — Enviar evidencia corregida

## Objetivo de la pantalla

Permitir que Panchito reenvíe la evidencia corregida.

## Título recomendado

**Corregir y reenviar**

## Subtítulo recomendado

Agrega la nueva foto y confirma la cantidad total.

## Campos recomendados

### Campo 1 — Nueva foto

Etiqueta:

**Foto corregida**

Botón:

**Agregar nueva foto**

Texto de ayuda:

Procura que se vea completa el área de cemento.

### Campo 2 — Cantidad total confirmada

Etiqueta:

**Cantidad total confirmada**

Valor para demo:

**48**

### Campo 3 — Comentario

Etiqueta:

**Comentario**

Valor para demo:

**Corregido. Son 48 sacos en total. Te mando foto completa del área.**

## Botón principal

**Reenviar evidencia**

## Botón secundario

**Cancelar**

## Confirmación después de reenviar

Título:

**Evidencia corregida enviada**

Subtexto:

Luisito recibirá la nueva evidencia para revisión.

---

# Pantalla 11 — Aprobar y cerrar

## Objetivo de la pantalla

Confirmar que Luisito está por cerrar formalmente el compromiso.

## Título recomendado

**Aprobar y cerrar**

## Subtítulo recomendado

La evidencia será aprobada y el compromiso quedará cerrado.

## Resumen del cierre

### Compromiso

**Contar los sacos de cemento disponibles en Sucursal Norte.**

### Responsable

**Panchito**

### Resultado registrado

**48 sacos**

### Evidencia final

**Foto completa del área de cemento.**

## Botón principal

**Cerrar compromiso**

## Botón secundario

**Volver a revisar**

## Confirmación final

Título:

**Compromiso cerrado**

Subtexto:

El compromiso quedó cumplido, evidenciado y cerrado.

Mensaje adicional:

Ya no tienes que dar seguimiento manual a este pendiente.

## Nota crítica

El cierre debe sentirse como el momento de valor principal para Luisito.

---

# Pantalla 12 — Historial del compromiso

## Objetivo de la pantalla

Mostrar la trazabilidad mínima sin saturar al usuario.

## Título recomendado

**Historial del compromiso**

## Subtítulo recomendado

Aquí puedes ver cómo avanzó este compromiso hasta quedar cerrado.

## Eventos sugeridos

|Hora simulada|Evento|
|---|---|
|9:15 a.m.|Luisito creó el compromiso|
|9:16 a.m.|Panchito recibió la instrucción|
|9:18 a.m.|Panchito aceptó el compromiso|
|3:40 p.m.|Panchito envió evidencia|
|3:50 p.m.|Luisito pidió una corrección|
|4:10 p.m.|Panchito envió evidencia corregida|
|4:18 p.m.|Luisito aprobó y cerró el compromiso|

## Botones

- Volver al compromiso
    
- Crear otro compromiso
    

## Mensaje de valor

Texto recomendado:

Este historial evita que el seguimiento quede perdido entre mensajes sueltos de WhatsApp.

## Nota crítica

No convertir el historial en una bitácora técnica compleja.

Solo mostrar eventos clave.

---

# Pantalla 13 — Vista final de control para Luisito

## Objetivo de la pantalla

Mostrar el beneficio final: Luisito ya tiene control del compromiso cerrado.

## Título recomendado

**Compromiso cerrado**

## Subtítulo recomendado

Este pendiente ya fue cumplido, evidenciado y aprobado.

## Resumen visible

|Elemento|Valor|
|---|---|
|Responsable|Panchito|
|Ubicación|Sucursal Norte|
|Resultado|48 sacos|
|Evidencia|Foto completa del área|
|Cierre|Hoy, 4:18 p.m.|

## Mensaje final de valor

Texto recomendado:

Antes, este pendiente habría quedado perdido entre mensajes.  
Ahora quedó registrado con responsable, evidencia, corrección y cierre.

## Botones

- Crear otro compromiso
    
- Ver historial
    
- Volver al inicio
    

---

# Microcopy general

## Botones principales recomendados

|Acción|Texto recomendado|
|---|---|
|Crear|Crear compromiso|
|Aceptar|Aceptar compromiso|
|Evidenciar|Enviar evidencia|
|Revisar|Revisar evidencia|
|Corregir|Pedir corrección|
|Reenviar|Corregir y reenviar|
|Aprobar|Aprobar y cerrar|
|Cerrar|Cerrar compromiso|
|Historial|Ver historial|

## Estados visibles recomendados

|Estado|Texto visible|
|---|---|
|Nuevo|Nuevo|
|Aceptado|Aceptado|
|En proceso|En proceso|
|Evidencia enviada|Evidencia enviada|
|Necesita corrección|Necesita corrección|
|Corregido|Corregido|
|Cerrado|Cerrado|

## Mensajes vacíos recomendados

### Sin compromisos

**No hay compromisos por ahora.**

Subtexto:

Cuando se cree un nuevo compromiso, aparecerá aquí.

### Sin evidencias por revisar

**No hay evidencias por revisar.**

Subtexto:

Cuando alguien mande evidencia, la verás en esta sección.

### Sin correcciones pendientes

**No hay correcciones pendientes.**

Subtexto:

Las correcciones aparecerán aquí cuando una evidencia necesite ajuste.

---

# Textos que se deben evitar

|Texto a evitar|Motivo|
|---|---|
|Crear tarea|Suena a task manager genérico|
|Ticket|Se parece a soporte técnico|
|Rechazar evidencia|Suena punitivo|
|Liberar compromiso|Suena corporativo o de auditoría|
|Workflow|Demasiado técnico|
|Incumplimiento|Suena agresivo|
|Validación documental|Demasiado formal|
|Usuario ejecutor|Lenguaje frío e innecesario|

---

# Reglas de claridad por actor

## Para Luisito

Luisito debe ver:

- estado,
    
- responsable,
    
- fecha,
    
- evidencia,
    
- decisión requerida,
    
- historial,
    
- cierre.
    

Luisito no necesita ver:

- configuración avanzada,
    
- reglas internas,
    
- lógica técnica,
    
- permisos,
    
- API,
    
- automatización.
    

## Para Panchito

Panchito debe ver:

- qué hacer,
    
- para cuándo,
    
- qué evidencia mandar,
    
- cómo enviarla,
    
- qué corregir,
    
- si ya quedó cerrado.
    

Panchito no necesita ver:

- tablero,
    
- historial completo,
    
- reportes,
    
- otros responsables,
    
- analítica,
    
- configuración.
    

---

# Criterios de aprobación

Estos textos se considerarán aprobados si:

- Son claros sin explicación adicional.
    
- Mantienen baja fricción para Panchito.
    
- Dan sensación de control a Luisito.
    
- No suenan técnicos.
    
- No suenan corporativos.
    
- No suenan punitivos.
    
- Refuerzan evidencia, corrección y cierre.
    
- Ayudan a construir wireframes simples.
    
- Mantienen la diferencia entre WhatsApp como canal y Gamora Bot como capa de control.
    

## Próximo paso después de aprobar este documento

Después de aprobar este documento, el siguiente entregable será:

**Mapa de Pantallas del Prototipo Simulado — Ferretería Luisito**

Ese documento definirá qué pantallas existirán, en qué orden aparecerán, qué actor las verá y cuál será el objetivo de cada una.