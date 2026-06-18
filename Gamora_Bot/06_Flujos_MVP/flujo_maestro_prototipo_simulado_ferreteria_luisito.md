# Flujo Maestro del Prototipo Simulado — Ferretería Luisito

## Estado

Documento base para validar el flujo funcional principal del prototipo simulado de Gamora Bot.

## Propósito

Este documento define la secuencia funcional que se usará para construir los mensajes simulados, pantallas base, wireframes, storyboard y prototipo estático de Gamora Bot.

No es diseño visual.

No es arquitectura técnica.

No es código.

No es MVP 3.

Es el flujo maestro que muestra cómo un pendiente operativo se convierte en compromiso trazable, con evidencia, corrección y cierre.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Actores

|Actor|Rol dentro del flujo|
|---|---|
|Luisito|Crea, revisa, pide corrección y aprueba el compromiso|
|Panchito|Recibe, acepta, ejecuta, envía evidencia y corrige si aplica|
|Gamora Bot|Guía el flujo, comunica estados y conserva trazabilidad|
|Rosita|Actor secundario, no participa en el flujo principal inicial|

## Principio del flujo

El flujo debe sentirse simple.

El responsable operativo no debe sentir que está usando una plataforma compleja.

La experiencia debe transmitir que Gamora Bot ordena lo que ya ocurre por WhatsApp, pero con estructura mínima:

- qué se debe hacer,
    
- quién lo debe hacer,
    
- para cuándo,
    
- qué evidencia debe enviar,
    
- quién revisa,
    
- si se aprueba o se pide corrección,
    
- cuándo queda cerrado.
    

## Flujo maestro resumido

1. Luisito detecta un pendiente.
    
2. Luisito crea un compromiso.
    
3. Gamora Bot confirma que el compromiso fue creado.
    
4. Panchito recibe el compromiso.
    
5. Panchito acepta el compromiso.
    
6. Panchito realiza la actividad.
    
7. Panchito envía evidencia.
    
8. Luisito revisa la evidencia.
    
9. Luisito pide corrección.
    
10. Panchito corrige y reenvía evidencia.
    
11. Luisito aprueba.
    
12. Gamora Bot marca el compromiso como cerrado.
    
13. Luisito consulta el historial y estado final.
    

## Flujo maestro detallado

---

## Paso 1 — Luisito detecta un pendiente operativo

### Actor principal

Luisito.

### Situación

Luisito necesita saber cuántos sacos de cemento hay disponibles en Sucursal Norte.

### Dolor actual

Sin Gamora Bot, Luisito mandaría un mensaje informal por WhatsApp y después tendría que dar seguimiento manualmente.

### Objetivo del paso

Mostrar que el flujo nace de una necesidad operativa real y cotidiana.

### Resultado del paso

Luisito decide convertir ese pendiente en un compromiso formal.

---

## Paso 2 — Luisito crea el compromiso

### Actor principal

Luisito.

### Acción

Luisito registra un compromiso con la información mínima necesaria.

### Información capturada

|Campo|Valor para la demo|
|---|---|
|Responsable|Panchito|
|Ubicación|Sucursal Norte|
|Compromiso|Contar los sacos de cemento disponibles|
|Fecha compromiso|Hoy antes de las 5:00 p.m.|
|Evidencia esperada|Foto del área de cemento y cantidad total reportada|

### Principio de experiencia

La creación no debe sentirse como llenar un formulario pesado.

Debe sentirse como convertir una instrucción en seguimiento formal.

### Resultado del paso

El compromiso queda creado.

### Estado del compromiso

**Creado**

---

## Paso 3 — Gamora Bot confirma la creación

### Actor principal

Gamora Bot.

### Acción

Gamora Bot confirma a Luisito que el compromiso fue creado y que Panchito será notificado.

### Mensaje conceptual

“Compromiso creado. Panchito recibirá la instrucción con fecha compromiso y evidencia esperada.”

### Objetivo del paso

Darle certeza a Luisito de que el pendiente ya no está solo en su memoria o en un mensaje suelto.

### Resultado del paso

Gamora Bot prepara la notificación para Panchito.

### Estado del compromiso

**Asignado**

---

## Paso 4 — Panchito recibe el compromiso

### Actor principal

Panchito.

### Canal simulado

WhatsApp / experiencia tipo WhatsApp.

### Acción

Panchito recibe una instrucción clara.

### Información que debe ver Panchito

- Quién se lo pide.
    
- Qué debe hacer.
    
- Dónde debe hacerlo.
    
- Para cuándo.
    
- Qué evidencia debe mandar.
    

### Principio de experiencia

Panchito no debe recibir lenguaje técnico ni burocrático.

Debe entender el compromiso en menos de 10 segundos.

### Resultado del paso

Panchito puede aceptar o indicar que tiene dudas.

### Estado del compromiso

**Recibido**

---

## Paso 5 — Panchito acepta el compromiso

### Actor principal

Panchito.

### Acción

Panchito confirma que recibió y atenderá el compromiso.

### Objetivo del paso

Eliminar la incertidumbre de Luisito sobre si Panchito vio o no vio la instrucción.

### Resultado del paso

Luisito puede ver que Panchito aceptó.

### Estado del compromiso

**Aceptado**

### Nota crítica

Este paso debe mantenerse simple.

No debe sentirse como autorización formal compleja.

Debe sentirse como:

“Sí, entendido. Lo atiendo.”

---

## Paso 6 — Panchito realiza la actividad

### Actor principal

Panchito.

### Acción

Panchito va al área de cemento, cuenta los sacos disponibles y toma una foto.

### Objetivo del paso

Mostrar que Gamora Bot no complica la operación.

El trabajo ocurre en el mundo real; Gamora Bot solo guía y registra.

### Resultado del paso

Panchito tiene evidencia para reportar.

### Estado del compromiso

**En proceso**

---

## Paso 7 — Panchito envía evidencia

### Actor principal

Panchito.

### Acción

Panchito envía la evidencia solicitada.

### Evidencia enviada

- Foto del área de cemento.
    
- Cantidad reportada: 48 sacos.
    

### Mensaje conceptual

“Listo, hay 48 sacos de cemento disponibles. Te mando foto.”

### Objetivo del paso

Mostrar que la evidencia queda asociada al compromiso, no perdida como foto suelta en un chat.

### Resultado del paso

Gamora Bot avisa a Luisito que hay evidencia lista para revisión.

### Estado del compromiso

**Evidencia enviada**

---

## Paso 8 — Luisito revisa la evidencia

### Actor principal

Luisito.

### Acción

Luisito revisa el compromiso y la evidencia enviada.

### Información que debe ver Luisito

- Compromiso original.
    
- Responsable.
    
- Fecha compromiso.
    
- Evidencia enviada.
    
- Cantidad reportada.
    
- Hora de envío.
    
- Acciones disponibles.
    

### Acciones disponibles

- Aprobar y cerrar.
    
- Pedir corrección.
    
- Comentar.
    

### Objetivo del paso

Mostrar que Luisito ya no tiene que buscar evidencia entre mensajes.

Todo lo necesario está junto.

### Resultado del paso

Luisito detecta que la evidencia no es suficiente.

### Estado del compromiso

**En revisión**

---

## Paso 9 — Luisito pide corrección

### Actor principal

Luisito.

### Acción

Luisito solicita una corrección porque la foto no muestra completo el espacio de cemento.

### Motivo de corrección

La foto no muestra todos los sacos y no permite validar completamente el conteo.

### Mensaje conceptual

“Panchito, la foto no muestra completo el espacio de cemento. Por favor manda una foto más abierta y confirma nuevamente la cantidad total.”

### Objetivo del paso

Mostrar que Gamora Bot permite corregir sin perder el hilo del compromiso.

### Resultado del paso

Panchito recibe una instrucción específica de corrección.

### Estado del compromiso

**Necesita corrección**

### Nota crítica

La corrección no debe sentirse como regaño.

Debe sentirse como una aclaración operativa.

---

## Paso 10 — Panchito recibe la corrección

### Actor principal

Panchito.

### Acción

Panchito recibe el motivo de corrección y entiende qué debe reenviar.

### Información que debe ver Panchito

- Qué evidencia envió.
    
- Por qué no fue suficiente.
    
- Qué debe corregir.
    
- Botón o acción para reenviar evidencia.
    

### Objetivo del paso

Evitar ambigüedad.

Panchito no debe preguntarse:

“¿Qué hice mal?”

Debe saber exactamente qué falta.

### Resultado del paso

Panchito prepara nueva evidencia.

### Estado del compromiso

**Corrección solicitada**

---

## Paso 11 — Panchito corrige y reenvía evidencia

### Actor principal

Panchito.

### Acción

Panchito toma una nueva foto más abierta y confirma la cantidad total.

### Evidencia corregida

- Foto completa del área de cemento.
    
- Confirmación de cantidad: 48 sacos.
    

### Mensaje conceptual

“Corregido. Son 48 sacos en total. Te mando foto completa del área.”

### Objetivo del paso

Mostrar que el ciclo de corrección es simple y controlado.

### Resultado del paso

Luisito recibe nueva evidencia para revisión.

### Estado del compromiso

**Evidencia corregida enviada**

---

## Paso 12 — Luisito aprueba la evidencia

### Actor principal

Luisito.

### Acción

Luisito revisa la nueva evidencia y la aprueba.

### Criterio de aprobación

La foto muestra el área completa y la cantidad reportada es clara.

### Objetivo del paso

Mostrar que el compromiso no se cierra solo por mandar evidencia.

Se cierra cuando el solicitante la valida.

### Resultado del paso

El compromiso queda aprobado.

### Estado del compromiso

**Aprobado**

---

## Paso 13 — Gamora Bot cierra el compromiso

### Actor principal

Gamora Bot.

### Acción

Gamora Bot marca el compromiso como cerrado y registra el historial.

### Historial mínimo del compromiso

- Creado por Luisito.
    
- Asignado a Panchito.
    
- Aceptado por Panchito.
    
- Evidencia enviada.
    
- Corrección solicitada.
    
- Evidencia corregida enviada.
    
- Aprobado por Luisito.
    
- Cerrado.
    

### Objetivo del paso

Mostrar el valor de trazabilidad.

### Resultado del paso

El compromiso queda cerrado formalmente.

### Estado final

**Cerrado**

---

## Paso 14 — Luisito consulta el control final

### Actor principal

Luisito.

### Acción

Luisito puede ver que el compromiso ya fue cerrado.

### Información final visible

- Compromiso cerrado.
    
- Responsable.
    
- Evidencia final.
    
- Corrección realizada.
    
- Fecha y hora de cierre.
    
- Historial.
    

### Objetivo del paso

Generar el momento de valor principal:

Luisito ve que el pendiente ya no quedó perdido en WhatsApp.

Quedó cumplido, evidenciado, corregido y cerrado.

### Resultado del paso

Luisito entiende el beneficio central de Gamora Bot.

---

# Estados del compromiso en este flujo

|Orden|Estado|Qué significa|
|---|---|---|
|1|Creado|Luisito registró el compromiso|
|2|Asignado|Gamora Bot preparó el envío a Panchito|
|3|Recibido|Panchito recibió la instrucción|
|4|Aceptado|Panchito confirmó que lo atenderá|
|5|En proceso|Panchito está realizando la actividad|
|6|Evidencia enviada|Panchito mandó primera evidencia|
|7|En revisión|Luisito está revisando evidencia|
|8|Necesita corrección|Luisito pidió ajuste|
|9|Corrección solicitada|Panchito recibió el motivo|
|10|Evidencia corregida enviada|Panchito reenvió evidencia|
|11|Aprobado|Luisito validó la evidencia|
|12|Cerrado|El compromiso quedó terminado|

## Estados que sí deben aparecer en la demo

Para no saturar al usuario, en la demo visual no necesariamente se deben mostrar todos los estados internos.

Los estados visibles recomendados son:

- Nuevo.
    
- Aceptado.
    
- En proceso.
    
- Evidencia enviada.
    
- Necesita corrección.
    
- Corregido.
    
- Cerrado.
    

## Ruta ideal

La ruta ideal sin corrección sería:

1. Creado.
    
2. Asignado.
    
3. Recibido.
    
4. Aceptado.
    
5. En proceso.
    
6. Evidencia enviada.
    
7. En revisión.
    
8. Aprobado.
    
9. Cerrado.
    

## Ruta con corrección

La ruta principal para la demo será con corrección, porque muestra más valor.

1. Creado.
    
2. Asignado.
    
3. Recibido.
    
4. Aceptado.
    
5. En proceso.
    
6. Evidencia enviada.
    
7. En revisión.
    
8. Necesita corrección.
    
9. Corrección solicitada.
    
10. Evidencia corregida enviada.
    
11. Aprobado.
    
12. Cerrado.
    

## Por qué conviene mostrar corrección

Conviene mostrar corrección porque evidencia que Gamora Bot no solo sirve para pedir cosas.

Sirve para cerrar correctamente.

La corrección muestra tres capacidades clave:

1. La evidencia se revisa.
    
2. El solicitante puede pedir ajustes.
    
3. El compromiso no se cierra hasta quedar validado.
    

## Decisiones dentro del flujo

|Momento|Actor|Decisión|Opciones|
|---|---|---|---|
|Recepción del compromiso|Panchito|Confirmar si lo atenderá|Aceptar / Tengo dudas / No puedo atender|
|Envío de evidencia|Panchito|Reportar cumplimiento|Enviar evidencia / Comentar problema|
|Revisión|Luisito|Evaluar evidencia|Aprobar / Pedir corrección|
|Corrección|Panchito|Atender ajuste|Reenviar evidencia / Comentar|
|Cierre|Luisito|Validar final|Aprobar y cerrar|

## Acciones que deben sentirse simples

Para Panchito:

- Aceptar compromiso.
    
- Ver qué tiene que hacer.
    
- Subir evidencia.
    
- Corregir y reenviar.
    

Para Luisito:

- Crear compromiso.
    
- Ver estado.
    
- Revisar evidencia.
    
- Pedir corrección.
    
- Aprobar y cerrar.
    

## Acciones que no deben aparecer todavía

Para evitar complejidad, en esta primera demo no se deben mostrar:

- Reasignar responsable.
    
- Cambiar fecha compromiso.
    
- Crear múltiples evidencias.
    
- Crear subtareas.
    
- Escalar a supervisor.
    
- Agregar múltiples aprobadores.
    
- Analítica avanzada.
    
- Configuración de empresa.
    
- Permisos por rol.
    
- Integración con inventario.
    
- Reportes PDF.
    
- IA sugerente.
    
- Automatizaciones complejas.
    

## Momentos críticos de fricción

|Momento|Riesgo|Solución en el prototipo|
|---|---|---|
|Crear compromiso|Puede parecer formulario pesado|Usar pocos campos y lenguaje simple|
|Recibir compromiso|Panchito puede no entender qué hacer|Mostrar instrucción clara y evidencia esperada|
|Aceptar compromiso|Puede parecer burocrático|Usar botón simple: “Aceptar compromiso”|
|Subir evidencia|Puede no saber qué foto mandar|Explicar con texto corto qué evidencia se espera|
|Corrección|Puede sentirse como regaño|Usar lenguaje de ajuste, no de castigo|
|Revisión|Luisito puede tener demasiadas opciones|Mostrar solo aprobar o pedir corrección|
|Cierre|Puede parecer automático|Dejar claro que Luisito aprueba y cierra|

## Frase guía del flujo

**Del mensaje suelto al compromiso cerrado.**

## Lo que debe sentir Luisito

Luisito debe sentir:

- “Ya no tengo que perseguir tanto.”
    
- “Ya sé quién tiene cada pendiente.”
    
- “Ya puedo ver si se aceptó.”
    
- “Ya tengo evidencia ordenada.”
    
- “Ya puedo pedir corrección sin perder el hilo.”
    
- “Ya sé qué quedó cerrado.”
    

## Lo que debe sentir Panchito

Panchito debe sentir:

- “Entiendo qué tengo que hacer.”
    
- “No necesito aprender una app complicada.”
    
- “Solo acepto, hago y mando evidencia.”
    
- “Si me piden corrección, sé exactamente qué falta.”
    

## Lo que debe demostrar Gamora Bot

Gamora Bot debe demostrar:

- orden,
    
- claridad,
    
- evidencia,
    
- seguimiento,
    
- corrección,
    
- cierre,
    
- mínima fricción.
    

## Lo que no debe intentar demostrar

Este flujo no debe intentar demostrar:

- inteligencia artificial,
    
- integraciones,
    
- tecnología,
    
- automatización avanzada,
    
- reportería ejecutiva,
    
- cumplimiento normativo,
    
- escalabilidad enterprise.
    

## Criterio de aprobación del flujo

Este flujo se considerará aprobado si:

- Se entiende sin explicación técnica.
    
- Muestra claramente el valor de convertir un pendiente en compromiso.
    
- Distingue Gamora Bot de una simple lista de tareas.
    
- Mantiene a Panchito con baja fricción.
    
- Da a Luisito control real.
    
- Incluye evidencia, corrección y cierre.
    
- Puede convertirse después en mensajes simulados y pantallas base.
    

## Próximo paso después de aprobar este flujo

Después de aprobar este flujo, el siguiente entregable será:

**Mapa de Estados Simplificado y Puntos de Fricción del Prototipo Simulado**

Ese documento servirá para decidir qué estados sí se mostrarán al usuario y qué complejidades se quedarán ocultas para no saturar la experiencia.