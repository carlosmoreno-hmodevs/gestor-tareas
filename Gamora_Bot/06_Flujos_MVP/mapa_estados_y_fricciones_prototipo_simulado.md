# Mapa de Estados y Fricciones — Prototipo Simulado Gamora Bot

## Estado

Documento base para validar los estados visibles, estados internos y puntos de fricción del prototipo simulado de Gamora Bot.

## Propósito

Este documento define qué estados del compromiso deben mostrarse al usuario durante la demo y cuáles deben permanecer ocultos o simplificados para evitar saturación.

También identifica los puntos donde el usuario podría sentir fricción y propone cómo reducirla en la narrativa, mensajes y pantallas base.

## Principio rector

Gamora Bot debe transmitir control sin sentirse pesado.

El usuario no necesita ver toda la lógica interna del sistema.

El usuario solo necesita entender:

- qué está pendiente,
    
- quién lo tiene,
    
- para cuándo,
    
- si fue aceptado,
    
- si ya tiene evidencia,
    
- si necesita corrección,
    
- si ya quedó cerrado.
    

## Diferencia entre estados internos y estados visibles

### Estados internos

Son los estados que podrían existir en la lógica completa del producto.

Sirven para trazabilidad, control y arquitectura futura.

### Estados visibles

Son los estados que el usuario realmente debe ver en la demo.

Deben ser pocos, claros y fáciles de entender.

## Estados internos del flujo completo

|Orden|Estado interno|Significado|
|---|---|---|
|1|Creado|Luisito registró el compromiso|
|2|Asignado|Gamora Bot preparó el envío al responsable|
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

## Estados visibles recomendados

Para la demo, los estados visibles deben reducirse a siete:

|Estado visible|Qué significa para el usuario|Quién lo ve principalmente|
|---|---|---|
|Nuevo|El compromiso fue creado y enviado|Luisito / Panchito|
|Aceptado|El responsable confirmó que lo atenderá|Luisito / Panchito|
|En proceso|El compromiso está siendo atendido|Luisito / Panchito|
|Evidencia enviada|El responsable mandó evidencia|Luisito|
|Necesita corrección|La evidencia requiere ajuste|Panchito / Luisito|
|Corregido|El responsable corrigió y reenvió evidencia|Luisito|
|Cerrado|El compromiso fue aprobado y terminado|Luisito / Panchito|

## Estados que deben ocultarse o fusionarse

|Estado interno|Tratamiento recomendado en demo|Razón|
|---|---|---|
|Creado|Fusionar con Nuevo|Evita explicar dos pasos similares|
|Asignado|Ocultar|Es lógica del sistema, no del usuario|
|Recibido|Ocultar o mostrar como parte del mensaje|Puede sentirse innecesario|
|En revisión|Fusionar con Evidencia enviada|Para Luisito, si hay evidencia, la siguiente acción es revisar|
|Corrección solicitada|Fusionar con Necesita corrección|Es más claro para Panchito|
|Aprobado|Fusionar con Cerrado|Para la demo, aprobar y cerrar pueden sentirse como una sola acción|

## Mapa simplificado de estados visibles

La ruta principal visible será:

1. Nuevo.
    
2. Aceptado.
    
3. En proceso.
    
4. Evidencia enviada.
    
5. Necesita corrección.
    
6. Corregido.
    
7. Cerrado.
    

## Ruta visual de la demo

```text
Nuevo
  ↓
Aceptado
  ↓
En proceso
  ↓
Evidencia enviada
  ↓
Necesita corrección
  ↓
Corregido
  ↓
Cerrado
```

## Justificación de esta simplificación

La demo no debe enseñar la arquitectura completa del producto.

Debe enseñar el valor.

El valor no está en que existan muchos estados, sino en que el usuario entienda rápidamente que un pendiente puede avanzar de forma ordenada desde que se asigna hasta que se cierra.

## Estado inicial recomendado

El primer estado visible debe ser:

**Nuevo**

No se recomienda usar “Creado” como estado visible principal porque puede sonar más administrativo.

“Nuevo” es más simple para Panchito y más natural para una demo.

## Estado final recomendado

El estado final debe ser:

**Cerrado**

No se recomienda cerrar con “Aprobado” porque aprobado puede sonar incompleto.

El valor real para Luisito es que el pendiente ya terminó.

## Diferencia entre Evidencia enviada y Cerrado

Este punto debe quedar muy claro en la demo.

**Evidencia enviada** no significa que el compromiso terminó.

Significa que Panchito ya mandó algo para que Luisito revise.

**Cerrado** significa que Luisito ya revisó, aprobó y dio por terminado el compromiso.

Esta diferencia es una de las claves para que Gamora Bot no parezca una simple lista de tareas.

## Regla de oro de estados

Cada estado visible debe contestar una pregunta sencilla.

|Estado|Pregunta que contesta|
|---|---|
|Nuevo|¿Qué me acaban de asignar?|
|Aceptado|¿El responsable ya lo vio y confirmó?|
|En proceso|¿Ya se está atendiendo?|
|Evidencia enviada|¿Ya mandaron prueba?|
|Necesita corrección|¿Qué falta corregir?|
|Corregido|¿Ya reenviaron evidencia?|
|Cerrado|¿Ya quedó terminado formalmente?|

## Puntos de fricción por actor

## Fricciones para Luisito

|Momento|Fricción posible|Riesgo|Solución propuesta|
|---|---|---|---|
|Crear compromiso|Sentir que está llenando un formulario|Abandono o rechazo|Usar pocos campos y lenguaje natural|
|Elegir responsable|No saber si el contacto está enrolado|Confusión|En demo asumir responsable disponible|
|Definir evidencia|No saber qué pedir|Compromisos ambiguos|Usar ejemplos simples de evidencia|
|Revisar evidencia|Tener demasiadas opciones|Saturación|Mostrar solo “Aprobar y cerrar” o “Pedir corrección”|
|Pedir corrección|Sentir que está regañando|Resistencia cultural|Usar tono de ajuste operativo|
|Consultar historial|Ver demasiados datos|Ruido visual|Mostrar solo eventos clave|

## Fricciones para Panchito

|Momento|Fricción posible|Riesgo|Solución propuesta|
|---|---|---|---|
|Recibir compromiso|No entender qué debe hacer|Incumplimiento|Mostrar instrucción breve y directa|
|Aceptar|Sentir que es algo formal o pesado|Resistencia|Usar botón simple: “Aceptar compromiso”|
|Subir evidencia|No saber qué foto mandar|Evidencia incompleta|Mostrar evidencia esperada con ejemplo|
|Reportar cantidad|No saber dónde escribirla|Reporte incompleto|Usar campo o mensaje simple|
|Recibir corrección|Sentirse regañado|Rechazo emocional|Usar lenguaje neutral y específico|
|Reenviar evidencia|No saber si reemplaza la anterior|Confusión|Mostrar “Corregir y reenviar”|

## Fricciones para Rosita

Rosita no será protagonista en la primera versión del flujo.

La principal fricción sería agregarla demasiado pronto y complicar la demo.

Por ahora, Rosita debe mantenerse fuera del flujo principal.

Puede usarse más adelante para mostrar consulta, apoyo o supervisión.

## Fricciones generales de la demo

|Riesgo|Por qué importa|Cómo evitarlo|
|---|---|---|
|Que parezca un task manager genérico|Debilita la diferenciación|Insistir en WhatsApp, evidencia y cierre|
|Que parezca vigilancia|Puede generar rechazo|Aclarar que no lee chats personales|
|Que parezca burocrático|Mata la promesa de baja fricción|Usar pocos pasos y lenguaje simple|
|Que parezca demasiado técnico|Aleja a PyMEs|No hablar de API, IA, backend ni webhooks|
|Que parezca solo para empleados internos|Puede crear tensión regulatoria/comercial|Enfocar en operación y compromisos formales|
|Que parezca que WhatsApp se reemplaza|Confunde el valor|Mostrar que WhatsApp sigue siendo el canal natural|

## Principios para reducir fricción

## 1. Menos campos

La demo no debe mostrar formularios largos.

Campos máximos recomendados para crear el compromiso:

- Responsable.
    
- Qué debe hacer.
    
- Para cuándo.
    
- Evidencia esperada.
    
- Ubicación si aplica.
    

## 2. Lenguaje humano

Usar lenguaje operativo.

Ejemplos correctos:

- “Contar sacos de cemento.”
    
- “Mandar foto del área.”
    
- “Aceptar compromiso.”
    
- “Corregir y reenviar.”
    
- “Aprobar y cerrar.”
    

Evitar lenguaje como:

- “Generar workflow.”
    
- “Ejecutar trazabilidad.”
    
- “Liberar evidencia.”
    
- “Gestionar cumplimiento.”
    
- “Validar entregable operativo.”
    

## 3. Un solo objetivo por pantalla

Cada pantalla debe tener una función clara.

Ejemplos:

- Crear compromiso.
    
- Ver compromiso.
    
- Enviar evidencia.
    
- Revisar evidencia.
    
- Pedir corrección.
    
- Cerrar.
    

No mezclar demasiadas acciones en una sola pantalla.

## 4. Panchito debe ver menos que Luisito

Panchito no necesita tablero, analítica ni historial completo.

Panchito necesita:

- qué hacer,
    
- para cuándo,
    
- qué evidencia mandar,
    
- cómo enviarla,
    
- qué corregir si aplica.
    

Luisito necesita más control, pero tampoco debe saturarse.

## 5. La corrección debe ser amable

El estado “Necesita corrección” puede generar resistencia si se siente como regaño.

Debe presentarse como ajuste práctico.

Ejemplo recomendado:

**“Falta una foto más abierta para confirmar el conteo.”**

No usar:

**“Evidencia rechazada por incumplimiento.”**

## 6. Cierre claro

El cierre debe sentirse satisfactorio.

Debe comunicar:

- el compromiso terminó,
    
- la evidencia fue aprobada,
    
- el historial quedó guardado,
    
- ya no hay que perseguir ese pendiente.
    

## Copy recomendado por estado

|Estado visible|Texto recomendado|
|---|---|
|Nuevo|Nuevo compromiso asignado|
|Aceptado|Panchito aceptó el compromiso|
|En proceso|Compromiso en proceso|
|Evidencia enviada|Evidencia enviada para revisión|
|Necesita corrección|Se necesita una corrección|
|Corregido|Evidencia corregida enviada|
|Cerrado|Compromiso cerrado|

## Copy que se debe evitar

|Texto a evitar|Motivo|
|---|---|
|Tarea creada|Suena a task manager genérico|
|Workflow iniciado|Demasiado técnico|
|Evidencia rechazada|Suena punitivo|
|Incumplimiento detectado|Suena corporativo y agresivo|
|Liberación final|Suena a auditoría|
|Usuario subordinado|Lenguaje incorrecto para PyME|
|Ticket cerrado|Se parece a mesa de ayuda|

## Estados por actor

## Luisito

Luisito debe poder ver:

- Nuevo.
    
- Aceptado.
    
- En proceso.
    
- Evidencia enviada.
    
- Necesita corrección.
    
- Corregido.
    
- Cerrado.
    

## Panchito

Panchito debe ver principalmente:

- Nuevo.
    
- Aceptado.
    
- En proceso.
    
- Necesita corrección.
    
- Cerrado.
    

Panchito no necesita ver “Evidencia enviada” como estado principal; para él es una acción realizada.

## Gamora Bot

Gamora Bot no “ve” estados como usuario, pero comunica el cambio de estado en lenguaje simple.

Ejemplo:

**“Listo, Luisito ya recibió tu evidencia para revisión.”**

## Pantallas o momentos asociados a estados

|Estado visible|Momento o pantalla asociada|
|---|---|
|Nuevo|Mensaje de compromiso recibido|
|Aceptado|Confirmación de aceptación|
|En proceso|Vista “Mi día” o detalle del compromiso|
|Evidencia enviada|Aviso a Luisito para revisar|
|Necesita corrección|Mensaje de corrección para Panchito|
|Corregido|Aviso a Luisito de nueva evidencia|
|Cerrado|Confirmación final de cierre|

## Estados mínimos para el prototipo estático

Para el primer prototipo estático, podrían bastar cinco estados visibles:

1. Nuevo.
    
2. Aceptado.
    
3. Evidencia enviada.
    
4. Necesita corrección.
    
5. Cerrado.
    

Sin embargo, para la versión completa de la narrativa es mejor conservar siete estados.

## Recomendación

La primera demo debe mostrar siete estados, pero no todos como pantallas separadas.

Algunos pueden aparecer como etiquetas dentro de la misma pantalla.

Lo importante no es que el usuario memorice estados.

Lo importante es que vea progreso claro.

## Validación interna del mapa de estados

Este mapa será válido si:

- Los estados son fáciles de entender.
    
- No se sienten técnicos.
    
- No saturan la demo.
    
- Refuerzan evidencia y cierre.
    
- Ayudan a distinguir Gamora Bot de una app genérica de tareas.
    
- Reducen fricción para Panchito.
    
- Dan sensación de control a Luisito.
    

## Decisión propuesta

Para el prototipo simulado de Ferretería Luisito, se usarán estos estados visibles:

1. Nuevo.
    
2. Aceptado.
    
3. En proceso.
    
4. Evidencia enviada.
    
5. Necesita corrección.
    
6. Corregido.
    
7. Cerrado.
    

Los demás estados quedarán como lógica interna o narrativa oculta.

## Próximo paso después de aprobar este documento

Después de aprobar este documento, el siguiente entregable será:

**Mensajes Simulados de WhatsApp — Ferretería Luisito**

Ese documento definirá los mensajes exactos que verán Luisito y Panchito durante el prototipo simulado.