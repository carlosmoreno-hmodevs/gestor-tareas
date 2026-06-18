# Mensajes Simulados de WhatsApp — Ferretería Luisito

## Estado

Documento base para validar los mensajes simulados de WhatsApp del prototipo estático de Gamora Bot.

## Propósito

Este documento define los mensajes exactos que aparecerán en la experiencia tipo WhatsApp dentro del prototipo simulado de Gamora Bot.

No representa una integración real con WhatsApp.

No representa un flujo técnico.

No representa una automatización funcional.

Su objetivo es definir cómo debe sentirse la conversación entre Gamora Bot, Luisito y Panchito para que el usuario entienda el valor del producto con mínima fricción.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Actores del flujo conversacional

|Actor|Función dentro de los mensajes|
|---|---|
|Luisito|Crea, revisa, pide corrección y cierra el compromiso|
|Panchito|Recibe, acepta, cumple, manda evidencia y corrige|
|Gamora Bot|Comunica, guía y ordena el seguimiento|

## Principio de conversación

Los mensajes deben sentirse como WhatsApp, no como un sistema corporativo.

La conversación debe ser:

- clara,
    
- breve,
    
- humana,
    
- operativa,
    
- fácil de entender,
    
- sin tecnicismos,
    
- sin tono robótico pesado.
    

## Regla principal de copy

Cada mensaje debe responder una pregunta simple:

- ¿Qué tengo que hacer?
    
- ¿Quién me lo pidió?
    
- ¿Para cuándo?
    
- ¿Qué evidencia debo mandar?
    
- ¿Qué sigue?
    
- ¿Qué falta corregir?
    
- ¿Ya quedó cerrado?
    

## Tono recomendado

El tono debe ser amable, claro y directo.

No debe sonar a auditoría, castigo, vigilancia o sistema burocrático.

## Palabras recomendadas

Usar palabras como:

- compromiso,
    
- pendiente,
    
- evidencia,
    
- foto,
    
- revisar,
    
- corregir,
    
- cerrar,
    
- listo,
    
- hoy,
    
- responsable.
    

## Palabras a evitar

Evitar palabras como:

- workflow,
    
- ticket,
    
- incidencia,
    
- incumplimiento,
    
- evidencia rechazada,
    
- liberación,
    
- trazabilidad avanzada,
    
- automatización,
    
- auditoría,
    
- no conformidad.
    

---

# Flujo conversacional principal

## Momento 1 — Luisito crea el compromiso

Este momento puede mostrarse en la demo como una confirmación tipo WhatsApp o como parte de la capa web/PWA.

Para efectos del prototipo conversacional, Gamora Bot confirma a Luisito que el compromiso fue creado.

### Mensaje para Luisito

**Gamora Bot:**

Listo, Luisito.  
Creé este compromiso para Panchito:

**Compromiso:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Fecha compromiso:**  
Hoy antes de las 5:00 p.m.

**Evidencia esperada:**  
Foto del área de cemento y cantidad total reportada.

Panchito recibirá la instrucción para aceptarla y darle seguimiento.

### Botones simulados

- Ver compromiso
    
- Crear otro compromiso
    

### Estado visible

**Nuevo**

### Objetivo del mensaje

Confirmar a Luisito que el pendiente ya quedó convertido en compromiso y que Panchito será notificado.

---

## Momento 2 — Panchito recibe el compromiso

Este es uno de los mensajes más importantes del prototipo.

Debe ser claro en menos de 10 segundos.

### Mensaje para Panchito

**Gamora Bot:**

Hola, Panchito.  
Luisito te asignó un nuevo compromiso:

**Qué hay que hacer:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Para cuándo:**  
Hoy antes de las 5:00 p.m.

**Evidencia esperada:**  
Manda una foto del área de cemento y escribe la cantidad total de sacos.

### Botones simulados

- Aceptar compromiso
    
- Tengo una duda
    
- No puedo atenderlo
    

### Estado visible

**Nuevo**

### Objetivo del mensaje

Que Panchito entienda rápidamente qué tiene que hacer, para cuándo y qué evidencia debe mandar.

### Nota crítica

No usar un mensaje largo ni técnico. Panchito no debe sentir que está entrando a un sistema.

---

## Momento 3 — Panchito acepta el compromiso

Panchito confirma que recibió y atenderá el compromiso.

### Acción de Panchito

Panchito presiona:

**Aceptar compromiso**

### Mensaje para Panchito

**Gamora Bot:**

Perfecto, Panchito.  
El compromiso quedó aceptado.

Cuando termines el conteo, manda la foto del área de cemento y la cantidad total de sacos.

### Botones simulados

- Enviar evidencia
    
- Ver compromiso
    

### Estado visible

**Aceptado**

### Mensaje para Luisito

**Gamora Bot:**

Luisito, Panchito ya aceptó el compromiso:

**Contar los sacos de cemento disponibles en Sucursal Norte.**

Fecha compromiso:  
Hoy antes de las 5:00 p.m.

### Botones simulados

- Ver estado
    
- Ver compromiso
    

### Estado visible para Luisito

**Aceptado**

### Objetivo del mensaje

Eliminar la incertidumbre de Luisito sobre si Panchito recibió o no la instrucción.

---

## Momento 4 — Panchito consulta su compromiso

Este mensaje puede aparecer si Panchito toca “Ver compromiso” o entra a su vista “Mi día”.

### Mensaje para Panchito

**Gamora Bot:**

Tu compromiso de hoy:

**Contar los sacos de cemento disponibles en Sucursal Norte.**

**Fecha compromiso:**  
Hoy antes de las 5:00 p.m.

**Evidencia esperada:**  
Foto del área de cemento y cantidad total de sacos.

### Botones simulados

- Enviar evidencia
    
- Tengo una duda
    

### Estado visible

**En proceso**

### Objetivo del mensaje

Recordarle a Panchito qué debe hacer sin mostrarle información innecesaria.

---

## Momento 5 — Panchito envía evidencia

Panchito realiza el conteo, toma la foto y reporta la cantidad.

### Mensaje de Panchito

Listo, hay 48 sacos de cemento disponibles.  
Te mando foto.

**Adjunto simulado:**  
Foto del área de cemento.

### Respuesta para Panchito

**Gamora Bot:**

Gracias, Panchito.  
La evidencia fue enviada a Luisito para revisión.

Te avisaré si queda cerrada o si hace falta corregir algo.

### Botones simulados

- Ver compromiso
    

### Estado visible para Panchito

**En proceso**

### Mensaje para Luisito

**Gamora Bot:**

Luisito, Panchito envió evidencia del compromiso:

**Contar los sacos de cemento disponibles en Sucursal Norte.**

**Cantidad reportada:**  
48 sacos.

**Evidencia:**  
Foto del área de cemento.

### Botones simulados

- Revisar evidencia
    
- Ver compromiso
    

### Estado visible para Luisito

**Evidencia enviada**

### Objetivo del mensaje

Mostrar que la evidencia no queda perdida en el chat, sino asociada al compromiso.

---

## Momento 6 — Luisito revisa la evidencia

Luisito abre la evidencia enviada por Panchito.

### Mensaje conceptual para Luisito

**Gamora Bot:**

Revisión de evidencia:

**Compromiso:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Responsable:**  
Panchito.

**Cantidad reportada:**  
48 sacos.

**Evidencia enviada:**  
Foto del área de cemento.

¿Qué deseas hacer?

### Botones simulados

- Aprobar y cerrar
    
- Pedir corrección
    

### Estado visible

**Evidencia enviada**

### Objetivo del mensaje

Dar a Luisito solo dos decisiones claras: aprobar o pedir corrección.

### Nota crítica

No mostrar demasiadas opciones. Para esta demo no se necesitan reasignar, escalar, cambiar fecha ni crear subtareas.

---

## Momento 7 — Luisito pide corrección

Luisito nota que la foto no muestra todo el espacio de cemento.

### Acción de Luisito

Luisito presiona:

**Pedir corrección**

### Mensaje de corrección escrito por Luisito

Panchito, la foto no muestra completo el espacio de cemento.  
Por favor manda una foto más abierta y confirma nuevamente la cantidad total.

### Confirmación para Luisito

**Gamora Bot:**

Listo, Luisito.  
Le pedí a Panchito corregir la evidencia.

**Motivo:**  
La foto no muestra completo el espacio de cemento.

### Botones simulados

- Ver compromiso
    
- Ver historial
    

### Estado visible para Luisito

**Necesita corrección**

### Mensaje para Panchito

**Gamora Bot:**

Panchito, Luisito necesita una corrección en este compromiso:

**Compromiso:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Qué falta corregir:**  
La foto no muestra completo el espacio de cemento.

**Qué debes enviar:**  
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.

### Botones simulados

- Corregir y reenviar
    
- Tengo una duda
    

### Estado visible para Panchito

**Necesita corrección**

### Objetivo del mensaje

Mostrar que la corrección es específica, entendible y no se siente como castigo.

---

## Momento 8 — Panchito corrige y reenvía evidencia

Panchito toma una foto más abierta y confirma nuevamente la cantidad.

### Mensaje de Panchito

Corregido.  
Son 48 sacos en total.  
Te mando foto completa del área.

**Adjunto simulado:**  
Foto completa del área de cemento.

### Respuesta para Panchito

**Gamora Bot:**

Gracias, Panchito.  
La evidencia corregida fue enviada a Luisito para revisión.

### Botones simulados

- Ver compromiso
    

### Estado visible para Panchito

**Corregido**

### Mensaje para Luisito

**Gamora Bot:**

Luisito, Panchito envió evidencia corregida.

**Compromiso:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Cantidad confirmada:**  
48 sacos.

**Corrección:**  
Foto más abierta del área de cemento.

### Botones simulados

- Aprobar y cerrar
    
- Pedir nueva corrección
    

### Estado visible para Luisito

**Corregido**

### Objetivo del mensaje

Mostrar que el ciclo de corrección no pierde el hilo del compromiso.

---

## Momento 9 — Luisito aprueba y cierra

Luisito revisa la nueva evidencia y ahora sí la aprueba.

### Acción de Luisito

Luisito presiona:

**Aprobar y cerrar**

### Confirmación para Luisito

**Gamora Bot:**

Compromiso cerrado, Luisito.

**Compromiso:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Responsable:**  
Panchito.

**Resultado:**  
48 sacos reportados.

**Evidencia:**  
Foto completa del área de cemento.

El compromiso quedó cumplido, evidenciado y cerrado.

### Botones simulados

- Ver historial
    
- Crear otro compromiso
    

### Estado visible para Luisito

**Cerrado**

### Mensaje para Panchito

**Gamora Bot:**

Listo, Panchito.  
Luisito aprobó la evidencia y cerró el compromiso.

**Resultado registrado:**  
48 sacos de cemento disponibles en Sucursal Norte.

Buen trabajo.

### Botones simulados

- Ver mis compromisos
    

### Estado visible para Panchito

**Cerrado**

### Objetivo del mensaje

Generar cierre claro y satisfactorio para ambos actores.

---

# Historial conversacional resumido

El historial mínimo del compromiso debe poder verse así:

|Hora simulada|Evento|
|---|---|
|9:15 a.m.|Luisito creó el compromiso|
|9:16 a.m.|Panchito recibió la instrucción|
|9:18 a.m.|Panchito aceptó el compromiso|
|3:40 p.m.|Panchito envió evidencia|
|3:50 p.m.|Luisito pidió corrección|
|4:10 p.m.|Panchito reenvió evidencia corregida|
|4:18 p.m.|Luisito aprobó y cerró el compromiso|

## Nota sobre horarios

Los horarios son simulados y solo sirven para dar sensación de trazabilidad.

No representan integración real.

---

# Mensajes alternativos para dudas o bloqueo

Estos mensajes no serán protagonistas de la primera demo, pero pueden considerarse como rutas secundarias futuras.

## Panchito tiene una duda

### Acción de Panchito

Panchito presiona:

**Tengo una duda**

### Mensaje de Panchito

Luisito, ¿quieres que cuente solo los sacos cerrados o también los que están abiertos?

### Respuesta conceptual de Gamora Bot

**Gamora Bot:**

Duda registrada en el compromiso.  
Luisito podrá responderla sin perder el hilo del pendiente.

### Estado recomendado

**En proceso**

## Panchito no puede atenderlo

### Acción de Panchito

Panchito presiona:

**No puedo atenderlo**

### Mensaje sugerido

No puedo atenderlo ahora porque estoy fuera de la sucursal.

### Respuesta conceptual de Gamora Bot

**Gamora Bot:**

Entendido.  
Le avisaré a Luisito para que decida si cambia el responsable o ajusta el compromiso.

### Estado recomendado

**Requiere atención**

### Nota crítica

Esta ruta no debe aparecer en la primera demo para evitar complejidad.

---

# Mensajes que deben evitarse

## Evitar tono punitivo

No usar:

**La evidencia fue rechazada por incumplimiento.**

Usar:

**Se necesita una corrección en la evidencia.**

## Evitar tono técnico

No usar:

**El workflow cambió al estado de validación.**

Usar:

**La evidencia fue enviada a Luisito para revisión.**

## Evitar tono de vigilancia

No usar:

**El sistema detectó que Panchito no ha cumplido.**

Usar:

**Este compromiso sigue pendiente de evidencia.**

## Evitar tono corporativo pesado

No usar:

**Se requiere liberación del entregable por parte del solicitante.**

Usar:

**Luisito debe revisar y cerrar el compromiso.**

---

# Botones simulados recomendados

## Para Panchito

|Momento|Botones recomendados|
|---|---|
|Nuevo compromiso|Aceptar compromiso / Tengo una duda / No puedo atenderlo|
|Compromiso aceptado|Enviar evidencia / Ver compromiso|
|Corrección solicitada|Corregir y reenviar / Tengo una duda|
|Compromiso cerrado|Ver mis compromisos|

## Para Luisito

|Momento|Botones recomendados|
|---|---|
|Compromiso creado|Ver compromiso / Crear otro compromiso|
|Panchito aceptó|Ver estado / Ver compromiso|
|Evidencia recibida|Revisar evidencia / Ver compromiso|
|Revisión|Aprobar y cerrar / Pedir corrección|
|Corrección enviada|Ver compromiso / Ver historial|
|Evidencia corregida|Aprobar y cerrar / Pedir nueva corrección|
|Cerrado|Ver historial / Crear otro compromiso|

---

# Copy final recomendado por estado

|Estado visible|Mensaje corto recomendado|
|---|---|
|Nuevo|Nuevo compromiso asignado|
|Aceptado|Compromiso aceptado|
|En proceso|Compromiso en proceso|
|Evidencia enviada|Evidencia enviada para revisión|
|Necesita corrección|Se necesita una corrección|
|Corregido|Evidencia corregida enviada|
|Cerrado|Compromiso cerrado|

---

# Mensaje de confianza sobre privacidad

Este mensaje puede aparecer al inicio de una demo comercial o en una nota breve.

## Mensaje recomendado

Gamora Bot no lee tus chats personales.  
Solo da seguimiento a los compromisos que tú decides crear dentro del canal formal de Gamora Bot.

## Cuándo usarlo

Usarlo si el usuario pregunta:

- si Gamora Bot lee chats,
    
- si se mete a grupos,
    
- si vigila conversaciones,
    
- si analiza mensajes privados.
    

## Cuándo no usarlo

No ponerlo en cada pantalla, porque puede crear miedo innecesario.

Debe estar disponible como aclaración, no como protagonista.

---

# Versión compacta de la conversación para storyboard

Esta es la versión mínima que después podrá convertirse en storyboard:

1. Luisito crea el compromiso.
    
2. Gamora Bot confirma creación.
    
3. Panchito recibe el compromiso.
    
4. Panchito acepta.
    
5. Gamora Bot avisa a Luisito.
    
6. Panchito manda evidencia.
    
7. Gamora Bot avisa a Luisito.
    
8. Luisito pide corrección.
    
9. Gamora Bot explica a Panchito qué corregir.
    
10. Panchito corrige y reenvía.
    
11. Luisito aprueba y cierra.
    
12. Gamora Bot confirma cierre a ambos.
    

---

# Criterios de aprobación de los mensajes

Estos mensajes se considerarán aprobados si:

- Se entienden sin explicación técnica.
    
- Suenan naturales en un contexto de WhatsApp.
    
- No se sienten como sistema corporativo pesado.
    
- No se sienten como regaño.
    
- Mantienen clara la diferencia entre evidencia enviada y compromiso cerrado.
    
- Refuerzan el valor de evidencia, corrección y cierre.
    
- Ayudan a distinguir Gamora Bot de una lista genérica de tareas.
    
- Mantienen baja fricción para Panchito.
    
- Dan control suficiente a Luisito.
    

## Próximo paso después de aprobar este documento

Después de aprobar este documento, el siguiente entregable será:

**Textos Base de Pantallas Web/PWA — Ferretería Luisito**

Ese documento definirá los textos que aparecerán en las pantallas simuladas fuera de WhatsApp, como creación de compromiso, vista de “Mi día”, detalle, revisión, corrección y cierre.