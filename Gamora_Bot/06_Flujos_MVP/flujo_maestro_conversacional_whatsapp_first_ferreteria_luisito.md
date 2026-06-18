# Flujo Maestro Conversacional WhatsApp-first — Ferretería Luisito

## Estado

Documento rector actualizado del flujo principal del prototipo simulado de Gamora Bot bajo enfoque WhatsApp-first.

## Propósito

Este documento redefine el flujo maestro del prototipo simulado de Gamora Bot para que el ciclo principal pueda ejecutarse de punta a punta desde la conversación de WhatsApp con Gamora Bot.

La Web/PWA se conserva como capa opcional de visualización, consulta, historial y control estructurado, pero deja de ser obligatoria para iniciar, seguir o cerrar el flujo principal.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Decisión rectora

Gamora Bot debe sentirse como una experiencia que vive dentro de WhatsApp.

El usuario no debe sentir que necesita salir de WhatsApp para crear, aceptar, evidenciar, corregir o cerrar un compromiso.

La Web/PWA debe reflejar lo que ocurre, pero no imponer el flujo.

## Nueva regla de experiencia

**WhatsApp ejecuta. Web/PWA observa, ordena y amplía.**

## Qué significa WhatsApp-first

WhatsApp-first significa que el usuario puede realizar las acciones principales desde el chat con Gamora Bot:

- escribir o dictar una instrucción,
    
- crear un compromiso,
    
- responder preguntas faltantes,
    
- confirmar el compromiso,
    
- recibir asignaciones,
    
- aceptar compromisos,
    
- enviar evidencia,
    
- revisar evidencia,
    
- pedir corrección,
    
- reenviar evidencia,
    
- aprobar,
    
- cerrar,
    
- consultar estados básicos.
    

## Qué significa Web/PWA opcional

La Web/PWA existe para dar una vista más estructurada, pero no para obligar al usuario a operar desde ahí.

La Web/PWA sirve para:

- ver todos los compromisos,
    
- consultar historial,
    
- filtrar por responsable,
    
- revisar evidencias agrupadas,
    
- ver vencidos,
    
- administrar usuarios,
    
- consultar tableros,
    
- preparar reportes,
    
- tener más comodidad cuando hay muchos compromisos.
    

## Principio de IA

Gamora Bot puede interpretar lenguaje natural, pero no debe actuar de forma definitiva sin confirmación humana.

La regla será:

**Gamora Bot interpreta, estructura y propone; el usuario confirma.**

## Campos mínimos del compromiso

Para el prototipo simulado, Gamora Bot debe capturar estos campos mínimos:

|Campo|Ejemplo|
|---|---|
|Responsable|Panchito|
|Actividad|Contar los sacos de cemento disponibles|
|Ubicación|Sucursal Norte|
|Fecha compromiso|Hoy antes de las 5:00 p.m.|
|Evidencia esperada|Foto del área de cemento y cantidad total de sacos|

## Flujo maestro resumido

1. Luisito escribe o dicta una instrucción a Gamora Bot en WhatsApp.
    
2. Gamora Bot interpreta la instrucción.
    
3. Gamora Bot detecta campos completos y campos faltantes.
    
4. Si falta información, Gamora Bot pregunta dentro del chat.
    
5. Luisito responde los datos faltantes.
    
6. Gamora Bot muestra un resumen estructurado.
    
7. Luisito confirma.
    
8. Gamora Bot crea el compromiso.
    
9. Panchito recibe el compromiso por WhatsApp.
    
10. Panchito acepta desde WhatsApp.
    
11. Panchito ejecuta la actividad.
    
12. Panchito envía evidencia por WhatsApp.
    
13. Gamora Bot avisa a Luisito dentro de WhatsApp.
    
14. Luisito revisa desde WhatsApp.
    
15. Luisito pide corrección desde WhatsApp.
    
16. Panchito recibe la corrección por WhatsApp.
    
17. Panchito reenvía evidencia corregida por WhatsApp.
    
18. Luisito aprueba y cierra desde WhatsApp.
    
19. Gamora Bot confirma cierre a Luisito y Panchito.
    
20. La Web/PWA refleja todo como historial y tablero opcional.
    

---

# Flujo maestro detallado

## Paso 1 — Luisito inicia por lenguaje natural

### Actor principal

Luisito.

### Canal

WhatsApp con Gamora Bot.

### Acción

Luisito escribe o dicta una instrucción en lenguaje natural.

### Ejemplo de instrucción completa

“Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.”

### Objetivo del paso

Mostrar que Luisito no necesita llenar un formulario para iniciar el flujo.

### Estado del compromiso

Aún no existe compromiso formal.

### Nota crítica

Aquí nace la reducción real de fricción.

Luisito habla como normalmente hablaría.

---

## Paso 2 — Gamora Bot interpreta la instrucción

### Actor principal

Gamora Bot.

### Acción

Gamora Bot detecta los elementos principales de la instrucción.

### Campos detectados

|Campo|Valor detectado|
|---|---|
|Responsable|Panchito|
|Actividad|Contar sacos de cemento|
|Ubicación|Sucursal Norte|
|Fecha compromiso|Hoy antes de las 5:00 p.m.|
|Evidencia esperada|Foto|

### Objetivo del paso

Convertir lenguaje natural en estructura operativa.

### Estado del compromiso

Borrador estructurado.

### Nota crítica

La interpretación no debe ser definitiva. Debe mostrarse a Luisito para confirmación.

---

## Paso 3 — Gamora Bot detecta si falta información

### Actor principal

Gamora Bot.

### Acción

Gamora revisa si la instrucción contiene los campos mínimos.

### Si la instrucción está completa

Gamora Bot pasa directo al resumen estructurado.

### Si falta información

Gamora Bot pregunta dentro del chat.

### Ejemplos de preguntas

Si falta responsable:

“¿Quién debe atender este compromiso?”

Si falta fecha:

“¿Para cuándo debe quedar listo?”

Si falta ubicación:

“¿En qué sucursal o lugar debe hacerse?”

Si falta evidencia:

“¿Qué evidencia debe mandar para confirmar que quedó hecho?”

### Objetivo del paso

Evitar formularios largos y capturar solo lo necesario.

### Nota crítica

Gamora Bot no debe hacer demasiadas preguntas. Solo debe pedir lo indispensable.

---

## Paso 4 — Luisito completa datos faltantes

### Actor principal

Luisito.

### Canal

WhatsApp.

### Acción

Luisito responde la pregunta de Gamora Bot.

### Ejemplo

Gamora Bot:

“¿Para cuándo debe quedar listo?”

Luisito:

“Hoy antes de las 5.”

### Objetivo del paso

Completar el compromiso sin sacar al usuario de la conversación.

### Estado del compromiso

Borrador completo.

---

## Paso 5 — Gamora Bot muestra resumen estructurado

### Actor principal

Gamora Bot.

### Acción

Gamora Bot presenta el compromiso en formato claro antes de crearlo.

### Mensaje ejemplo

“Entendido, Luisito. Detecté este compromiso:

Responsable: Panchito  
Actividad: contar los sacos de cemento disponibles  
Ubicación: Sucursal Norte  
Fecha compromiso: hoy antes de las 5:00 p.m.  
Evidencia esperada: foto del área de cemento y cantidad total de sacos.

¿Lo creo así?”

### Opciones simuladas

- Crear compromiso
    
- Editar
    
- Cancelar
    

### Objetivo del paso

Evitar errores por interpretación automática.

### Estado del compromiso

Pendiente de confirmación.

### Regla crítica

No se crea el compromiso hasta que Luisito confirme.

---

## Paso 6 — Luisito confirma creación

### Actor principal

Luisito.

### Acción

Luisito selecciona:

**Crear compromiso**

### Objetivo del paso

Formalizar el pendiente como compromiso trazable.

### Estado del compromiso

Nuevo.

---

## Paso 7 — Gamora Bot confirma creación a Luisito

### Actor principal

Gamora Bot.

### Mensaje ejemplo

“Listo, Luisito. Creé el compromiso y se lo enviaré a Panchito por WhatsApp.

Te avisaré cuando lo acepte o cuando mande evidencia.”

### Opciones simuladas

- Ver resumen
    
- Crear otro compromiso
    

### Objetivo del paso

Dar certeza de que el pendiente ya quedó formalizado.

### Estado visible

Nuevo.

---

## Paso 8 — Panchito recibe compromiso por WhatsApp

### Actor principal

Panchito.

### Canal

WhatsApp.

### Mensaje ejemplo

“Hola, Panchito. Luisito te asignó un nuevo compromiso:

Qué hay que hacer:  
Contar los sacos de cemento disponibles en Sucursal Norte.

Para cuándo:  
Hoy antes de las 5:00 p.m.

Evidencia esperada:  
Manda una foto del área de cemento y escribe la cantidad total de sacos.”

### Opciones simuladas

- Aceptar compromiso
    
- Tengo una duda
    
- No puedo atenderlo
    

### Objetivo del paso

Que Panchito entienda en segundos qué debe hacer.

### Estado visible

Nuevo.

---

## Paso 9 — Panchito acepta desde WhatsApp

### Actor principal

Panchito.

### Acción

Panchito selecciona:

**Aceptar compromiso**

### Mensaje de Gamora Bot a Panchito

“Perfecto, Panchito. El compromiso quedó aceptado.

Cuando termines el conteo, manda la foto del área de cemento y la cantidad total de sacos aquí mismo.”

### Mensaje de Gamora Bot a Luisito

“Luisito, Panchito ya aceptó el compromiso:

Contar los sacos de cemento disponibles en Sucursal Norte.

Estado: Aceptado.”

### Objetivo del paso

Eliminar incertidumbre sobre si Panchito recibió o no la instrucción.

### Estado visible

Aceptado.

---

## Paso 10 — Panchito ejecuta la actividad

### Actor principal

Panchito.

### Acción

Panchito cuenta los sacos de cemento en Sucursal Norte.

### Objetivo del paso

Mostrar que el trabajo ocurre en el mundo real y Gamora Bot solo ordena el seguimiento.

### Estado visible

En proceso.

### Nota crítica

No hace falta que Panchito entre a Web/PWA para este paso.

---

## Paso 11 — Panchito envía evidencia desde WhatsApp

### Actor principal

Panchito.

### Canal

WhatsApp.

### Acción

Panchito manda mensaje y foto dentro del chat.

### Mensaje ejemplo

“Listo, hay 48 sacos de cemento disponibles.”

Adjunto simulado:

Foto del área de cemento.

### Respuesta de Gamora Bot a Panchito

“Gracias, Panchito. Envié la evidencia a Luisito para revisión.

Te avisaré si queda cerrada o si hace falta corregir algo.”

### Objetivo del paso

Mostrar que la evidencia se envía sin salir de WhatsApp.

### Estado visible

Evidencia enviada.

### Nota crítica

No decir que el compromiso está cerrado. Todavía falta revisión de Luisito.

---

## Paso 12 — Gamora Bot avisa a Luisito

### Actor principal

Gamora Bot.

### Canal

WhatsApp.

### Mensaje ejemplo

“Luisito, Panchito envió evidencia del compromiso:

Contar los sacos de cemento disponibles en Sucursal Norte.

Cantidad reportada:  
48 sacos.

Evidencia:  
Foto del área de cemento.

¿Qué deseas hacer?”

### Opciones simuladas

- Aprobar y cerrar
    
- Pedir corrección
    
- Ver detalle
    

### Objetivo del paso

Llevar a Luisito directo al punto de decisión sin obligarlo a abrir Web/PWA.

### Estado visible

Evidencia enviada.

---

## Paso 13 — Luisito revisa desde WhatsApp

### Actor principal

Luisito.

### Acción

Luisito revisa la foto y la cantidad reportada desde la conversación.

### Decisión de la demo

Para mostrar el ciclo completo, Luisito elegirá:

**Pedir corrección**

### Objetivo del paso

Mostrar que el solicitante conserva control desde WhatsApp.

### Estado visible

Evidencia enviada.

---

## Paso 14 — Luisito pide corrección desde WhatsApp

### Actor principal

Luisito.

### Canal

WhatsApp.

### Acción

Luisito escribe o selecciona pedir corrección.

### Mensaje ejemplo de Luisito

“La foto no muestra completo el espacio de cemento. Que mande una foto más abierta y confirme otra vez la cantidad.”

### Gamora Bot estructura la corrección

“Entendido. Enviaré esta corrección a Panchito:

Motivo:  
La foto no muestra completo el espacio de cemento.

Qué debe enviar:  
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.

¿La envío?”

### Opciones simuladas

- Enviar corrección
    
- Editar
    
- Cancelar
    

### Objetivo del paso

Mostrar que incluso la corrección puede expresarse en lenguaje natural, pero se estructura antes de enviarse.

### Estado visible

Necesita corrección.

---

## Paso 15 — Panchito recibe corrección por WhatsApp

### Actor principal

Panchito.

### Canal

WhatsApp.

### Mensaje ejemplo

“Panchito, Luisito necesita una corrección en este compromiso:

Contar los sacos de cemento disponibles en Sucursal Norte.

Qué falta corregir:  
La foto no muestra completo el espacio de cemento.

Qué debes enviar:  
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.”

### Opciones simuladas

- Corregir y reenviar
    
- Tengo una duda
    

### Objetivo del paso

Que Panchito entienda exactamente qué debe corregir sin sentirse regañado.

### Estado visible

Necesita corrección.

---

## Paso 16 — Panchito reenvía evidencia corregida desde WhatsApp

### Actor principal

Panchito.

### Canal

WhatsApp.

### Mensaje ejemplo

“Corregido. Son 48 sacos en total.”

Adjunto simulado:

Foto completa del área de cemento.

### Respuesta de Gamora Bot a Panchito

“Gracias, Panchito. Envié la evidencia corregida a Luisito para revisión.”

### Objetivo del paso

Mostrar que la corrección conserva el hilo del compromiso.

### Estado visible

Corregido.

---

## Paso 17 — Gamora Bot avisa a Luisito de evidencia corregida

### Actor principal

Gamora Bot.

### Canal

WhatsApp.

### Mensaje ejemplo

“Luisito, Panchito envió evidencia corregida.

Compromiso:  
Contar los sacos de cemento disponibles en Sucursal Norte.

Cantidad confirmada:  
48 sacos.

Corrección:  
Foto más abierta del área de cemento.

¿Qué deseas hacer?”

### Opciones simuladas

- Aprobar y cerrar
    
- Pedir nueva corrección
    
- Ver detalle
    

### Objetivo del paso

Llevar a Luisito al cierre final.

### Estado visible

Corregido.

---

## Paso 18 — Luisito aprueba y cierra desde WhatsApp

### Actor principal

Luisito.

### Acción

Luisito selecciona:

**Aprobar y cerrar**

### Gamora Bot confirma antes de cerrar

“Vas a cerrar este compromiso:

Responsable:  
Panchito

Resultado:  
48 sacos de cemento disponibles en Sucursal Norte.

Evidencia final:  
Foto completa del área de cemento.

¿Confirmas el cierre?”

### Opciones simuladas

- Confirmar cierre
    
- Volver a revisar
    

### Objetivo del paso

Evitar cierres accidentales y reforzar que el cierre es humano.

### Estado visible

Pendiente de cierre.

---

## Paso 19 — Gamora Bot cierra el compromiso

### Actor principal

Gamora Bot.

### Mensaje a Luisito

“Compromiso cerrado, Luisito.

El pendiente quedó cumplido, evidenciado y cerrado.

Resultado registrado:  
48 sacos de cemento disponibles en Sucursal Norte.

Ya no tienes que dar seguimiento manual a este pendiente.”

### Mensaje a Panchito

“Listo, Panchito.

Luisito aprobó la evidencia y cerró el compromiso.

Resultado registrado:  
48 sacos de cemento disponibles en Sucursal Norte.

Buen trabajo.”

### Objetivo del paso

Cerrar la historia con claridad.

### Estado visible

Cerrado.

---

## Paso 20 — Web/PWA refleja el historial opcional

### Actor principal

Luisito.

### Canal

Web/PWA opcional.

### Acción

Luisito puede consultar el compromiso en una vista estructurada si lo desea.

### Información visible

- compromiso,
    
- responsable,
    
- estado final,
    
- fecha compromiso,
    
- evidencia,
    
- corrección,
    
- cierre,
    
- historial.
    

### Objetivo del paso

Mostrar que la Web/PWA existe como respaldo visual y administrativo, no como obligación operativa.

### Estado visible

Cerrado.

---

# Ruta conversacional compacta para la demo

La demo debe poder contarse en esta secuencia:

```text
Luisito dicta instrucción a Gamora Bot
→ Gamora estructura el compromiso
→ Luisito confirma
→ Panchito recibe y acepta
→ Panchito manda evidencia
→ Luisito revisa
→ Luisito pide corrección
→ Panchito corrige
→ Luisito aprueba y cierra
→ Web/PWA refleja el historial
```

## Estados visibles actualizados

|Estado visible|Qué significa|
|---|---|
|Borrador|Gamora Bot entendió la instrucción, pero aún no se crea|
|Nuevo|El compromiso fue creado y enviado|
|Aceptado|Panchito confirmó que lo atenderá|
|En proceso|Panchito está trabajando o pendiente de evidencia|
|Evidencia enviada|Panchito mandó evidencia para revisión|
|Necesita corrección|Luisito pidió ajuste|
|Corregido|Panchito reenvió evidencia corregida|
|Pendiente de cierre|Luisito está por confirmar cierre|
|Cerrado|El compromiso fue aprobado y terminado|

## Estados mínimos para la demo visual

Para no saturar, los estados visibles pueden reducirse a:

1. Borrador.
    
2. Nuevo.
    
3. Aceptado.
    
4. Evidencia enviada.
    
5. Necesita corrección.
    
6. Corregido.
    
7. Cerrado.
    

## Diferencia clave frente al flujo anterior

Antes:

Luisito y Panchito dependían de Web/PWA para varias acciones.

Ahora:

Luisito y Panchito pueden operar todo desde WhatsApp.

La Web/PWA se convierte en reflejo estructurado.

## Pantallas que cambian

Las siguientes pantallas anteriores deben dejar de ser obligatorias:

- Crear compromiso en Web/PWA.
    
- Enviar evidencia en Web/PWA.
    
- Revisar evidencia en Web/PWA.
    
- Pedir corrección en Web/PWA.
    
- Aprobar y cerrar en Web/PWA.
    

Ahora esas acciones ocurren principalmente en WhatsApp.

## Pantallas que siguen siendo útiles como opcionales

- Inicio de Luisito.
    
- Tablero de compromisos.
    
- Detalle de compromiso.
    
- Historial.
    
- Vista de evidencias.
    
- Filtros por estado.
    
- Filtros por responsable.
    

## Principio de diseño actualizado

La demo debe mostrar principalmente una conversación.

La Web/PWA debe aparecer al final o como apoyo visual breve.

No debe dominar la experiencia.

## Beneficio narrativo

Este cambio hace que la propuesta sea más fuerte porque el usuario entiende:

“No tengo que aprender otra plataforma para operar mis pendientes. Solo hablo con Gamora Bot por WhatsApp, y Gamora se encarga de estructurar, registrar y dar seguimiento.”

## Riesgos de este nuevo flujo

## Riesgo 1 — Que parezca magia excesiva

Si Gamora Bot interpreta demasiado sin confirmar, puede sentirse poco confiable.

### Mitigación

Siempre mostrar resumen y pedir confirmación.

## Riesgo 2 — Que la conversación se vuelva larga

Si faltan muchos datos, puede haber demasiados mensajes.

### Mitigación

Pedir solo campos mínimos y usar preguntas directas.

## Riesgo 3 — Que WhatsApp se sature

Si cada cambio de estado genera mensajes largos, puede sentirse invasivo.

### Mitigación

Agrupar información y usar mensajes breves.

## Riesgo 4 — Que la Web/PWA parezca innecesaria

Si todo ocurre en WhatsApp, puede parecer que la plataforma no aporta.

### Mitigación

Mostrar la Web/PWA como memoria operativa, tablero, historial y control para varios compromisos.

## Riesgo 5 — Que el usuario tema que Gamora lee sus chats

Si se comunica mal, puede parecer que Gamora analiza conversaciones privadas.

### Mitigación

Aclarar que Gamora solo procesa mensajes enviados directamente al canal formal de Gamora Bot.

## Mensaje de privacidad recomendado

“Gamora Bot no lee tus chats personales ni tus grupos. Solo da seguimiento a los compromisos que tú decides crear dentro del chat formal con Gamora Bot.”

## Criterios de aprobación del flujo

Este flujo se considerará aprobado si:

- Permite ejecutar el ciclo completo desde WhatsApp.
    
- Reduce dependencia obligatoria de Web/PWA.
    
- Mantiene confirmación humana antes de crear y cerrar.
    
- Permite detectar datos faltantes.
    
- Evita que la IA actúe sin autorización.
    
- Mantiene baja fricción para Luisito y Panchito.
    
- Refuerza evidencia, corrección y cierre.
    
- Mantiene la Web/PWA como capa opcional de control.
    
- Diferencia Gamora Bot de un task manager tradicional.
    

## Próximo paso después de aprobar este documento

Después de aprobar este flujo, el siguiente entregable será:

**Mensajes Conversacionales WhatsApp-first — Ferretería Luisito**

Ese documento reemplazará la versión anterior de mensajes simulados y definirá la conversación completa desde el dictado inicial de Luisito hasta el cierre del compromiso.