# Especificación de Pantallas V1 — Prototipo Visual Gamora Bot

## Estado

Documento operativo para construir las pantallas V1 del prototipo visual estático de Gamora Bot.

## Propósito

Este documento define, pantalla por pantalla, qué debe mostrar el primer prototipo visual de Gamora Bot.

Su objetivo es convertir el plan de construcción visual en una guía concreta de diseño.

No es código.

No es implementación funcional.

No es prototipo navegable definitivo.

Es la especificación base para producir pantallas visuales estáticas, claras y profesionales.

---

# Principio rector

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

---

# Frase central del prototipo

**Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.**

---

# Caso demo

**Ferretería Luisito**

## Compromiso operativo

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

---

# Formato general de la V1

La V1 del prototipo visual debe construirse como una secuencia de pantallas estáticas.

Cada pantalla debe poder entenderse en pocos segundos.

Cada pantalla debe tener:

- título breve,
    
- interfaz principal,
    
- actor principal,
    
- acción principal,
    
- estado del compromiso cuando aplique,
    
- mensaje clave,
    
- transición lógica hacia la siguiente pantalla.
    

---

# Pantalla 1 — El problema actual

## Nombre de pantalla

**WhatsApp conversa, pero no controla**

## Objetivo

Mostrar el dolor antes de Gamora Bot.

## Interfaz

WhatsApp tradicional, sin Gamora Bot.

## Actor principal

Luisito.

## Layout sugerido

Pantalla tipo móvil al centro.

Fondo externo limpio.

Chat con Panchito.

No más de 6 mensajes visibles.

## Contenido visual

Chat simulado:

```text
Luisito:
Panchito, porfa cuenta los sacos de cemento y me mandas foto.

Panchito:
Va, al rato lo reviso.

Luisito:
¿Ya lo hiciste?

Panchito:
Creo que sí eran 48.

Luisito:
¿Me mandaste foto?

Panchito:
Sí, creo que quedó arriba.
```

## Texto de apoyo

**El problema no es WhatsApp.  
El problema es que los pendientes quedan sin estructura, evidencia clara ni cierre.**

## Mensaje clave

**Los pendientes importantes se pierden entre mensajes.**

## Estado

Sin estado.

## Regla visual

No saturar.

La pantalla debe comunicar desorden, pero no caos excesivo.

---

# Pantalla 2 — Luisito inicia con Gamora Bot

## Nombre de pantalla

**Luisito opera desde WhatsApp**

## Objetivo

Mostrar que el flujo empieza donde el usuario ya trabaja.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Luisito.

## Layout sugerido

Móvil vertical.

Chat limpio con Gamora Bot.

Un solo mensaje principal de Luisito.

## Contenido visual

```text
Luisito:
Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.
```

## Texto de apoyo

**Luisito no llena formularios.  
Solo escribe o dicta una instrucción natural.**

## Mensaje clave

**El pendiente nace desde WhatsApp.**

## Estado

Aún no existe compromiso formal.

## Regla visual

El mensaje debe sentirse natural, no como comando técnico.

---

# Pantalla 3 — Gamora estructura el compromiso

## Nombre de pantalla

**Gamora convierte conversación en compromiso**

## Objetivo

Mostrar el valor principal: estructurar una instrucción natural.

## Interfaz

WhatsApp con tarjeta conversacional de Gamora.

## Actor principal

Gamora Bot.

## Layout sugerido

Móvil vertical.

Mensaje de Luisito arriba.

Debajo, tarjeta estructurada de Gamora.

## Contenido visual

```text
Gamora Bot:
Entendido, Luisito. Detecté este compromiso:
```

Tarjeta:

```text
Responsable
Panchito

Actividad
Contar los sacos de cemento disponibles

Ubicación
Sucursal Norte

Fecha compromiso
Hoy antes de las 5:00 p.m.

Evidencia esperada
Foto del área de cemento y cantidad total de sacos

¿Lo creo así?
```

Botones:

```text
[ Crear compromiso ]
[ Editar ]
[ Cancelar ]
```

## Estado

**Borrador**

## Badge sugerido

```text
Borrador
```

## Texto de apoyo

**Gamora interpreta y estructura.  
Luisito confirma antes de crear.**

## Mensaje clave

**La IA acompaña, pero no decide sola.**

## Regla visual

Esta debe ser una de las pantallas más fuertes de la demo.

Debe verse limpia, estructurada y confiable.

---

# Pantalla 4 — Compromiso creado

## Nombre de pantalla

**El mensaje ya es un compromiso**

## Objetivo

Mostrar que Luisito formaliza el pendiente desde WhatsApp.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Luisito.

## Layout sugerido

Móvil vertical.

Mostrar acción seleccionada y respuesta de Gamora.

## Contenido visual

```text
Luisito selecciona:
[ Crear compromiso ]
```

Respuesta:

```text
Gamora Bot:
Listo, Luisito.
Creé el compromiso y se lo enviaré a Panchito por WhatsApp.

Te avisaré cuando lo acepte o cuando mande evidencia.
```

Botones:

```text
[ Ver resumen ]
[ Abrir en Web/PWA ]
[ Crear otro compromiso ]
```

## Estado

**Nuevo**

## Texto de apoyo

**El pendiente dejó de ser un mensaje suelto.**

## Mensaje clave

**Ahora existe responsable, fecha, evidencia y estado.**

## Regla visual

El botón **Abrir en Web/PWA** debe estar visible, pero no debe dominar.

---

# Pantalla 5 — Web/PWA refleja el compromiso

## Nombre de pantalla

**Lo que nace en WhatsApp queda ordenado en Gamora**

## Objetivo

Mostrar que la Web/PWA no sobra.

## Interfaz

Web/PWA.

## Actor principal

Luisito.

## Layout sugerido

Pantalla tipo dashboard limpio.

Panel central con tarjeta de compromiso.

Sidebar mínima o encabezado superior simple.

## Contenido visual

Encabezado:

```text
Gamora
Compromisos
```

Tarjeta principal:

```text
Contar sacos de cemento

Estado: Nuevo

Responsable
Panchito

Ubicación
Sucursal Norte

Fecha compromiso
Hoy antes de las 5:00 p.m.

Evidencia esperada
Foto del área de cemento y cantidad total de sacos

Último evento
Luisito creó este compromiso desde WhatsApp.
```

Botones:

```text
[ Volver a WhatsApp ]
[ Ver historial ]
[ Ver tablero ]
```

## Estado

**Nuevo**

## Texto de apoyo

**WhatsApp opera.  
Web/PWA estructura y conserva el control.**

## Mensaje clave

**La plataforma ordena lo que nació en la conversación.**

## Regla visual

La Web/PWA debe verse como capa de control, no como copia del chat.

---

# Pantalla 6 — Panchito recibe el compromiso

## Nombre de pantalla

**Panchito recibe una instrucción clara**

## Objetivo

Mostrar baja fricción para el responsable operativo.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Panchito.

## Layout sugerido

Móvil vertical.

Mensaje compacto de Gamora a Panchito.

Botón principal claro.

## Contenido visual

```text
Gamora Bot:
Hola, Panchito.
Luisito te asignó un nuevo compromiso:

Qué hay que hacer:
Contar los sacos de cemento disponibles en Sucursal Norte.

Para cuándo:
Hoy antes de las 5:00 p.m.

Evidencia esperada:
Manda una foto del área de cemento y escribe la cantidad total de sacos.
```

Botones:

```text
[ Aceptar compromiso ]
[ Tengo una duda ]
[ No puedo atenderlo ]
```

## Estado

**Nuevo**

## Texto de apoyo

**Panchito no aprende otra plataforma.  
Solo entiende, acepta y evidencia.**

## Mensaje clave

**El responsable opera desde WhatsApp.**

## Regla visual

Panchito debe ver lo mínimo necesario.

No meter historial, tablero ni información administrativa.

---

# Pantalla 7 — Panchito acepta y se sincroniza

## Nombre de pantalla

**Una acción actualiza todo el flujo**

## Objetivo

Mostrar conexión entre WhatsApp y Web/PWA.

## Interfaz

Doble interfaz: WhatsApp + Web/PWA.

## Actor principal

Panchito.

## Layout sugerido

Dividir pantalla en dos:

- izquierda: móvil WhatsApp,
    
- derecha: panel Web/PWA,
    
- entre ambos: conector sutil.
    

## Contenido visual WhatsApp

```text
Panchito selecciona:
[ Aceptar compromiso ]

Gamora Bot:
Perfecto, Panchito.
El compromiso quedó aceptado.

Cuando termines el conteo, manda aquí mismo la foto del área de cemento y la cantidad total de sacos.
```

## Contenido visual Web/PWA

```text
Contar sacos de cemento

Estado: Aceptado

Último evento:
Panchito aceptó el compromiso desde WhatsApp.
```

## Mensaje a Luisito

Puede mostrarse como notificación breve:

```text
Panchito ya aceptó el compromiso.
```

## Estado

**Aceptado**

## Texto de apoyo

**Una acción en WhatsApp actualiza la plataforma.**

## Mensaje clave

**Una acción. Dos vistas. Un solo compromiso.**

## Regla visual

La sincronización debe sentirse natural, no técnica.

---

# Pantalla 8 — Panchito envía evidencia

## Nombre de pantalla

**La evidencia queda asociada al compromiso**

## Objetivo

Mostrar que Panchito evidencia desde WhatsApp sin perder estructura.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Panchito.

## Layout sugerido

Móvil vertical.

Mensaje de Panchito.

Miniatura de foto.

Respuesta de Gamora.

## Contenido visual

```text
Panchito:
Listo, hay 48 sacos de cemento disponibles.

[ Foto del área de cemento ]
```

Respuesta:

```text
Gamora Bot:
Gracias, Panchito.
Envié la evidencia a Luisito para revisión.

Te avisaré si queda cerrada o si hace falta corregir algo.
```

Botones opcionales:

```text
[ Ver resumen ]
[ Abrir en Web/PWA ]
```

## Estado

**Evidencia enviada**

## Texto de apoyo

**La foto ya no queda como imagen suelta en un chat.**

## Mensaje clave

**La evidencia queda ligada al compromiso correcto.**

## Regla visual

La imagen debe tener peso visual.

No debe parecer un adjunto cualquiera.

---

# Pantalla 9 — Luisito revisa evidencia

## Nombre de pantalla

**Luisito decide desde donde le conviene**

## Objetivo

Mostrar decisión desde WhatsApp y valor opcional de Web/PWA.

## Interfaz

Doble interfaz opcional.

## Actor principal

Luisito.

## Layout sugerido

Pantalla comparativa:

- móvil WhatsApp con resumen,
    
- panel Web/PWA con foto ampliada.
    

## Contenido visual WhatsApp

```text
Gamora Bot:
Luisito, Panchito envió evidencia del compromiso:

Contar los sacos de cemento disponibles en Sucursal Norte.

Cantidad reportada:
48 sacos

Evidencia:
Foto del área de cemento

¿Qué deseas hacer?
```

Botones:

```text
[ Aprobar y cerrar ]
[ Pedir corrección ]
[ Abrir en Web/PWA ]
```

## Contenido visual Web/PWA

```text
Revisar evidencia

Compromiso:
Contar sacos de cemento

Responsable:
Panchito

Cantidad reportada:
48 sacos

[ Imagen ampliada del área de cemento ]

Estado:
Evidencia enviada
```

Botones:

```text
[ Aprobar y cerrar ]
[ Pedir corrección ]
[ Volver a WhatsApp ]
```

## Estado

**Evidencia enviada**

## Texto de apoyo

**WhatsApp permite decidir rápido.  
Web/PWA permite revisar con más contexto.**

## Mensaje clave

**El usuario opera donde le conviene; Gamora mantiene el hilo.**

## Regla visual

La Web/PWA debe aportar valor real: imagen amplia, contexto y acciones.

---

# Pantalla 10 — Luisito pide corrección

## Nombre de pantalla

**La corrección no rompe el hilo**

## Objetivo

Mostrar que una corrección se estructura y queda registrada.

## Interfaz

WhatsApp + reflejo Web/PWA.

## Actor principal

Luisito.

## Layout sugerido

Móvil WhatsApp como foco principal.

Pequeño panel Web/PWA al lado o debajo mostrando estado actualizado.

## Contenido visual WhatsApp

```text
Luisito:
La foto no muestra completo el espacio de cemento.
Que mande una foto más abierta y confirme otra vez la cantidad.
```

Respuesta de Gamora:

```text
Gamora Bot:
Entendido, Luisito.
Enviaré esta corrección a Panchito:

Motivo:
La foto no muestra completo el espacio de cemento.

Qué debe enviar:
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.

¿La envío?
```

Botones:

```text
[ Enviar corrección ]
[ Editar ]
[ Cancelar ]
```

## Contenido visual Web/PWA

```text
Estado: Necesita corrección

Último evento:
Luisito solicitó corrección desde WhatsApp.
```

## Estado

**Necesita corrección**

## Texto de apoyo

**Gamora convierte una observación natural en una corrección clara.**

## Mensaje clave

**Corregir no significa perder seguimiento.**

## Regla visual

Usar ámbar suave.

No usar rojo.

No usar lenguaje de rechazo.

---

# Pantalla 11 — Panchito corrige

## Nombre de pantalla

**Panchito corrige sin empezar de nuevo**

## Objetivo

Mostrar continuidad del ciclo de corrección.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Panchito.

## Layout sugerido

Móvil vertical.

Mensaje de corrección claro.

Respuesta de Panchito con nueva foto.

## Contenido visual

```text
Gamora Bot:
Panchito, Luisito necesita una corrección:

Qué falta corregir:
La foto no muestra completo el espacio de cemento.

Qué debes enviar:
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.
```

Botón:

```text
[ Corregir y reenviar ]
```

Respuesta de Panchito:

```text
Panchito:
Corregido. Son 48 sacos en total.

[ Foto completa del área de cemento ]
```

Respuesta de Gamora:

```text
Gracias, Panchito.
Envié la evidencia corregida a Luisito para revisión.
```

## Estado

**Corregido**

## Texto de apoyo

**Panchito solo corrige lo necesario.  
El compromiso sigue siendo el mismo.**

## Mensaje clave

**El hilo se conserva.**

## Regla visual

Debe sentirse como ajuste, no como regaño.

---

# Pantalla 12 — Luisito aprueba y cierra

## Nombre de pantalla

**El cierre requiere aprobación humana**

## Objetivo

Mostrar que Gamora acompaña, pero Luisito decide.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Luisito.

## Layout sugerido

Móvil vertical.

Resumen de evidencia corregida.

Botón de aprobación.

Confirmación final.

## Contenido visual

```text
Gamora Bot:
Luisito, Panchito envió evidencia corregida.

Compromiso:
Contar los sacos de cemento disponibles en Sucursal Norte.

Cantidad confirmada:
48 sacos

Corrección:
Foto más abierta del área.

¿Qué deseas hacer?
```

Botones:

```text
[ Aprobar y cerrar ]
[ Pedir nueva corrección ]
[ Abrir en Web/PWA ]
```

Después de aprobar:

```text
Gamora Bot:
Vas a cerrar este compromiso:

Responsable:
Panchito

Resultado:
48 sacos de cemento disponibles en Sucursal Norte.

Evidencia final:
Foto completa del área.

¿Confirmas el cierre?
```

Botones:

```text
[ Confirmar cierre ]
[ Volver a revisar ]
```

## Estado

**Pendiente de cierre**

## Texto de apoyo

**La IA acompaña.  
El humano decide.**

## Mensaje clave

**El cierre no es automático.**

## Regla visual

El botón **Confirmar cierre** debe ser claro y contundente.

---

# Pantalla 13 — Compromiso cerrado

## Nombre de pantalla

**El pendiente quedó cumplido, evidenciado y cerrado**

## Objetivo

Cerrar la experiencia operativa en WhatsApp.

## Interfaz

WhatsApp con Gamora Bot.

## Actores

Luisito y Panchito.

## Layout sugerido

Dos móviles o dos tarjetas de conversación:

- mensaje a Luisito,
    
- mensaje a Panchito.
    

## Contenido visual Luisito

```text
Gamora Bot:
Compromiso cerrado, Luisito.

El pendiente quedó cumplido, evidenciado y cerrado.

Resultado registrado:
48 sacos de cemento disponibles en Sucursal Norte.

Ya no tienes que dar seguimiento manual a este pendiente.
```

Botones:

```text
[ Ver historial ]
[ Abrir en Web/PWA ]
[ Crear otro compromiso ]
```

## Contenido visual Panchito

```text
Gamora Bot:
Listo, Panchito.

Luisito aprobó la evidencia y cerró el compromiso.

Resultado registrado:
48 sacos de cemento disponibles en Sucursal Norte.

Buen trabajo.
```

## Estado

**Cerrado**

## Texto de apoyo

**Todos saben que el compromiso terminó.**

## Mensaje clave

**El cierre queda claro para solicitante y responsable.**

## Regla visual

Debe sentirse satisfactorio, no burocrático.

---

# Pantalla 14 — Historial final en Web/PWA

## Nombre de pantalla

**La operación queda convertida en memoria**

## Objetivo

Mostrar el valor final de Web/PWA.

## Interfaz

Web/PWA.

## Actor principal

Luisito.

## Layout sugerido

Panel amplio.

Encabezado del compromiso.

Columna de resumen.

Timeline de historial.

Panel de evidencia final.

## Contenido visual

Encabezado:

```text
Historial del compromiso
```

Resumen:

```text
Compromiso:
Contar sacos de cemento

Estado final:
Cerrado

Responsable:
Panchito

Resultado:
48 sacos de cemento disponibles

Evidencia final:
Foto completa del área
```

Timeline:

```text
9:15 a.m.  Luisito dictó la instrucción a Gamora.
9:16 a.m.  Gamora estructuró el compromiso.
9:17 a.m.  Luisito confirmó creación.
9:18 a.m.  Panchito recibió el compromiso.
9:20 a.m.  Panchito aceptó desde WhatsApp.
3:40 p.m.  Panchito envió evidencia.
3:50 p.m.  Luisito pidió corrección.
4:10 p.m.  Panchito envió evidencia corregida.
4:18 p.m.  Luisito aprobó y cerró.
```

Botones:

```text
[ Abrir conversación en WhatsApp ]
[ Crear compromiso similar ]
[ Volver al tablero ]
```

## Estado

**Cerrado**

## Texto de apoyo

**WhatsApp fue la operación.  
Web/PWA es la memoria y el control.**

## Mensaje clave

**Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.**

## Regla visual

Esta pantalla debe justificar toda la existencia de la Web/PWA.

Debe verse ordenada, útil y poderosa.

---

# Pantalla 15 — Cierre comercial

## Nombre de pantalla

**Gamora Bot**

## Objetivo

Cerrar la demo con una frase clara y recordable.

## Interfaz

Slide final o pantalla de presentación.

## Layout sugerido

Fondo limpio.

Marca Gamora Bot.

Frase central.

Tres beneficios.

## Contenido visual

Título:

```text
Gamora Bot
```

Frase principal:

```text
Tus pendientes se atienden en WhatsApp,
pero no se pierden en WhatsApp.
```

Subfrase:

```text
Gamora Bot convierte conversaciones operativas en compromisos con evidencia, seguimiento y cierre.
```

Tres beneficios:

```text
Opera desde WhatsApp.
Controla desde Web/PWA.
Cierra con evidencia.
```

Frase final:

```text
WhatsApp opera. Web/PWA controla. Gamora mantiene el hilo.
```

## Estado

No aplica.

## Mensaje clave

**Conversación + estructura + cierre.**

## Regla visual

Debe sentirse profesional, simple y memorable.

---

# Resumen de pantallas V1

|#|Pantalla|Interfaz|Estado|
|--:|---|---|---|
|1|WhatsApp conversa, pero no controla|WhatsApp tradicional|N/A|
|2|Luisito opera desde WhatsApp|WhatsApp|N/A|
|3|Gamora convierte conversación en compromiso|WhatsApp|Borrador|
|4|El mensaje ya es un compromiso|WhatsApp|Nuevo|
|5|Lo que nace en WhatsApp queda ordenado en Gamora|Web/PWA|Nuevo|
|6|Panchito recibe una instrucción clara|WhatsApp|Nuevo|
|7|Una acción actualiza todo el flujo|WhatsApp + Web/PWA|Aceptado|
|8|La evidencia queda asociada al compromiso|WhatsApp|Evidencia enviada|
|9|Luisito decide desde donde le conviene|WhatsApp + Web/PWA|Evidencia enviada|
|10|La corrección no rompe el hilo|WhatsApp + Web/PWA|Necesita corrección|
|11|Panchito corrige sin empezar de nuevo|WhatsApp|Corregido|
|12|El cierre requiere aprobación humana|WhatsApp|Pendiente de cierre|
|13|El pendiente quedó cumplido, evidenciado y cerrado|WhatsApp|Cerrado|
|14|La operación queda convertida en memoria|Web/PWA|Cerrado|
|15|Gamora Bot|Slide final|N/A|

---

# Pantallas indispensables

Si se necesita reducir la V1, no eliminar estas pantallas:

1. Pantalla 1 — problema actual.
    
2. Pantalla 3 — Gamora estructura.
    
3. Pantalla 5 — Web/PWA ordena.
    
4. Pantalla 8 — evidencia.
    
5. Pantalla 10 — corrección.
    
6. Pantalla 12 — cierre humano.
    
7. Pantalla 14 — historial final.
    

---

# Reglas visuales obligatorias

## 1. No saturar WhatsApp

Cada pantalla móvil debe tener pocos mensajes.

## 2. No hacer Web/PWA genérica

Cada pantalla Web/PWA debe mostrar estructura real del compromiso.

## 3. No usar lenguaje técnico

Evitar palabras como workflow, entidad, automatización, request, ticket o proceso liberado.

## 4. No usar rojo para corrección

Usar ámbar suave.

## 5. No mostrar IA como protagonista visual

Gamora no debe parecer una IA autónoma; debe parecer asistente operativo.

## 6. No agregar funciones no aprobadas

No meter reportes, pricing, dashboards avanzados, usuarios, roles ni analítica.

## 7. Mantener actor claro

Cada pantalla debe dejar claro quién actúa:

- Luisito,
    
- Panchito,
    
- Gamora Bot,
    
- Web/PWA.
    

## 8. Mantener estado visible

Cuando exista compromiso, el estado debe ser visible.

---

# Mensajes narrativos por pantalla

|Pantalla|Mensaje narrativo|
|---|---|
|1|WhatsApp conversa, pero no controla.|
|2|El flujo empieza donde el usuario ya trabaja.|
|3|Gamora interpreta; Luisito confirma.|
|4|El pendiente se convierte en compromiso.|
|5|La Web/PWA ordena lo que nació en WhatsApp.|
|6|Panchito opera con baja fricción.|
|7|Una acción actualiza todo el flujo.|
|8|La evidencia queda asociada al compromiso.|
|9|Luisito decide donde le conviene.|
|10|La corrección conserva el hilo.|
|11|Panchito corrige sin empezar de nuevo.|
|12|El cierre requiere aprobación humana.|
|13|Todos saben que el compromiso terminó.|
|14|La Web/PWA conserva memoria y control.|
|15|Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.|

---

# Checklist antes de producir visualmente

Antes de diseñar cada pantalla, confirmar:

|Pregunta|Sí / No|
|---|---|
|¿La pantalla existe en el storyboard aprobado?||
|¿Tiene un objetivo claro?||
|¿Muestra una acción concreta?||
|¿Evita agregar funcionalidades nuevas?||
|¿Refuerza WhatsApp-first?||
|¿Refuerza Web/PWA como control?||
|¿Mantiene continuidad entre interfaces?||
|¿Puede entenderse en menos de 5 segundos?||
|¿No parece task manager?||
|¿No parece vigilancia?||

---

# Criterios de aprobación de esta especificación

Esta especificación se considerará aprobada si:

- define pantallas concretas,
    
- conserva el flujo aprobado,
    
- materializa la dirección visual,
    
- permite diseñar sin improvisar,
    
- da valor claro a Web/PWA,
    
- mantiene baja fricción en WhatsApp,
    
- evita promesas inviables,
    
- prepara la producción visual V1.
    

## Próximo paso después de aprobar este documento

Después de aprobar esta especificación, el siguiente entregable será:

**Prompt Maestro para Generar Prototipo Visual Estático — Gamora Bot**

Ese documento servirá para pedirle a una herramienta de diseño o generación visual que construya las pantallas V1 respetando toda la estrategia, UI Kit y especificación aprobada.