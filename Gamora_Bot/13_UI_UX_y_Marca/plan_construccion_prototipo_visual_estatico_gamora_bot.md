# Plan de Construcción del Prototipo Visual Estático — Gamora Bot

## Estado

Documento operativo para construir el primer prototipo visual estático de Gamora Bot.

## Propósito

Este documento define la ruta de construcción del prototipo visual estático de Gamora Bot, basado en los documentos ya aprobados de estrategia, flujo, storyboard, dirección visual y UI Kit inicial.

No es código.

No es desarrollo funcional.

No es integración real con WhatsApp.

No es implementación técnica.

Es el plan para crear una demo visual clara, profesional y validable.

---

# Principio rector

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

El prototipo visual debe reforzar este principio en cada escena.

---

# Frase central

**Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.**

Esta frase debe aparecer como eje narrativo de la demo o como cierre principal.

---

# Objetivo del prototipo visual

El prototipo debe permitir explicar Gamora Bot en pocos minutos, mostrando que:

- los pendientes nacen en WhatsApp,
    
- Gamora los estructura,
    
- el usuario confirma,
    
- el responsable opera con baja fricción,
    
- la evidencia queda asociada,
    
- la corrección conserva el hilo,
    
- el cierre requiere aprobación humana,
    
- Web/PWA ordena, visualiza e historiza,
    
- ambas interfaces se sienten conectadas.
    

---

# Alcance de la primera versión visual

## Incluido

La primera versión visual incluirá:

1. Escena de dolor actual en WhatsApp.
    
2. Instrucción natural a Gamora Bot.
    
3. Compromiso estructurado por Gamora.
    
4. Compromiso creado y reflejado en Web/PWA.
    
5. Panchito recibe y acepta.
    
6. Panchito envía evidencia.
    
7. Luisito revisa evidencia.
    
8. Luisito pide corrección.
    
9. Panchito corrige.
    
10. Luisito aprueba y cierra.
    
11. Web/PWA muestra historial final.
    
12. Cierre comercial de la demo.
    

## Excluido

No se incluirá:

- login,
    
- registro,
    
- configuración,
    
- administración avanzada,
    
- dashboard ejecutivo,
    
- analítica,
    
- reportes,
    
- IA autónoma,
    
- lectura de chats personales,
    
- grupos de WhatsApp,
    
- pricing,
    
- backend,
    
- APIs,
    
- Meta Business real,
    
- integración real,
    
- onboarding avanzado.
    

---

# Formato recomendado

La primera versión debe poder existir como:

- presentación visual,
    
- prototipo estático,
    
- secuencia tipo storyboard visual,
    
- demo navegable simple en herramienta de diseño.
    

## Recomendación

Construirlo primero como una secuencia de pantallas estáticas.

La navegación puede ser simulada.

No hace falta que sea interactiva al inicio.

---

# Número de escenas recomendado

La versión V1 debe tener entre 10 y 12 escenas.

## Escenas mínimas

1. Dolor actual.
    
2. Luisito escribe a Gamora.
    
3. Gamora estructura.
    
4. Web/PWA refleja compromiso.
    
5. Panchito recibe y acepta.
    
6. Panchito manda evidencia.
    
7. Luisito revisa.
    
8. Corrección.
    
9. Cierre.
    
10. Historial final.
    
11. Cierre comercial.
    

---

# Estructura de cada escena

Cada escena debe contener:

1. Título breve.
    
2. Interfaz principal.
    
3. Acción principal.
    
4. Estado del compromiso si aplica.
    
5. Mensaje clave.
    
6. Transición a la siguiente escena.
    

## Ejemplo

|Elemento|Ejemplo|
|---|---|
|Título|Gamora estructura el compromiso|
|Interfaz|WhatsApp|
|Acción|Crear compromiso|
|Estado|Borrador|
|Mensaje clave|Gamora interpreta, Luisito confirma|
|Transición|Compromiso creado y enviado a Panchito|

---

# Plan de escenas V1

## Escena 1 — El problema: WhatsApp conversa, pero no controla

### Interfaz

WhatsApp tradicional.

### Objetivo

Mostrar el dolor actual.

### Contenido visual

Chat normal entre Luisito y Panchito con mensajes sueltos:

- “Cuenta los sacos de cemento.”
    
- “¿Ya lo hiciste?”
    
- “Creo que eran 48.”
    
- “¿Me mandaste foto?”
    
- “¿Esa foto es de hoy?”
    

### Mensaje clave

**El problema no es WhatsApp. El problema es que los pendientes quedan sin estructura.**

### Regla visual

Debe ser simple y rápida.

No saturar con demasiados mensajes.

---

## Escena 2 — Luisito escribe a Gamora Bot

### Interfaz

WhatsApp con Gamora Bot.

### Objetivo

Mostrar baja fricción.

### Contenido visual

Luisito escribe:

“Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.”

### Mensaje clave

**El flujo empieza donde el usuario ya trabaja.**

### Regla visual

Debe parecer una instrucción natural, no un comando técnico.

---

## Escena 3 — Gamora estructura el compromiso

### Interfaz

WhatsApp con tarjeta conversacional.

### Objetivo

Mostrar inteligencia operativa.

### Contenido visual

Tarjeta de Gamora:

- Responsable: Panchito.
    
- Actividad: contar sacos de cemento.
    
- Ubicación: Sucursal Norte.
    
- Fecha: hoy antes de las 5:00 p.m.
    
- Evidencia: foto del área y cantidad total.
    

Botones:

- Crear compromiso.
    
- Editar.
    
- Cancelar.
    

### Estado

**Borrador**

### Mensaje clave

**Gamora interpreta y estructura; Luisito confirma.**

### Regla visual

Esta escena debe ser una de las más limpias y potentes.

---

## Escena 4 — Compromiso creado + Web/PWA lo ordena

### Interfaz

Doble interfaz: WhatsApp + Web/PWA.

### Objetivo

Mostrar conexión y valor de Web/PWA.

### Contenido visual

En WhatsApp:

“Listo, Luisito. Creé el compromiso.”

Botón:

- Abrir en Web/PWA.
    

En Web/PWA:

Tarjeta del compromiso:

- estado Nuevo,
    
- responsable,
    
- fecha,
    
- evidencia esperada,
    
- último evento: creado desde WhatsApp.
    

### Estado

**Nuevo**

### Mensaje clave

**Lo que nace en WhatsApp queda ordenado en Gamora.**

### Regla visual

Esta escena debe evitar que Web/PWA parezca un espejo. Debe verse como estructura.

---

## Escena 5 — Panchito recibe y acepta

### Interfaz

WhatsApp con Gamora Bot.

### Objetivo

Mostrar baja fricción para el responsable.

### Contenido visual

Gamora le dice a Panchito:

- qué debe hacer,
    
- para cuándo,
    
- qué evidencia debe mandar.
    

Botón:

- Aceptar compromiso.
    

Después de aceptar:

“Perfecto, Panchito. El compromiso quedó aceptado.”

### Estado

**Aceptado**

### Mensaje clave

**Panchito entiende y acepta sin aprender otra plataforma.**

### Regla visual

Panchito debe ver menos información que Luisito.

---

## Escena 6 — Estado sincronizado

### Interfaz

Doble interfaz: WhatsApp + Web/PWA.

### Objetivo

Mostrar que una acción en WhatsApp actualiza el sistema.

### Contenido visual

En WhatsApp de Luisito:

“Panchito ya aceptó el compromiso.”

En Web/PWA:

Estado cambia a:

**Aceptado**

Último evento:

“Panchito aceptó desde WhatsApp.”

### Mensaje clave

**Una acción. Dos vistas. Un solo compromiso.**

### Regla visual

Mostrar sincronización sin hacerlo demasiado técnico.

---

## Escena 7 — Panchito envía evidencia

### Interfaz

WhatsApp con Gamora Bot.

### Objetivo

Mostrar evidencia con baja fricción.

### Contenido visual

Panchito escribe:

“Listo, hay 48 sacos de cemento disponibles.”

Adjunta:

- foto del área de cemento.
    

Gamora responde:

“Envié la evidencia a Luisito para revisión.”

### Estado

**Evidencia enviada**

### Mensaje clave

**La foto ya no queda suelta en el chat; queda asociada al compromiso.**

### Regla visual

La evidencia debe verse clara y central.

---

## Escena 8 — Luisito revisa evidencia

### Interfaz

WhatsApp + Web/PWA opcional.

### Objetivo

Mostrar decisión desde WhatsApp o vista ampliada.

### Contenido visual

En WhatsApp:

- cantidad reportada: 48 sacos,
    
- evidencia recibida,
    
- botones: aprobar y cerrar, pedir corrección, abrir en Web/PWA.
    

En Web/PWA:

- foto ampliada,
    
- datos del compromiso,
    
- acciones.
    

### Estado

**Evidencia enviada**

### Mensaje clave

**Luisito decide donde le conviene; Gamora mantiene el hilo.**

### Regla visual

Web/PWA debe aportar vista ampliada y orden, no verse obligatoria.

---

## Escena 9 — Luisito pide corrección

### Interfaz

WhatsApp + reflejo Web/PWA.

### Objetivo

Mostrar corrección estructurada.

### Contenido visual

Luisito escribe:

“La foto no muestra completo el espacio de cemento. Que mande una foto más abierta y confirme otra vez la cantidad.”

Gamora estructura:

- motivo,
    
- qué debe reenviar Panchito.
    

Botón:

- Enviar corrección.
    

Web/PWA:

Estado:

**Necesita corrección**

### Mensaje clave

**La corrección no rompe el hilo.**

### Regla visual

Usar tono ámbar suave, no rojo.

---

## Escena 10 — Panchito corrige

### Interfaz

WhatsApp con Gamora Bot.

### Objetivo

Mostrar que Panchito corrige sin reiniciar el flujo.

### Contenido visual

Gamora le dice:

- qué faltó,
    
- qué debe reenviar.
    

Panchito responde:

“Corregido. Son 48 sacos en total.”

Adjunta:

- foto completa del área.
    

### Estado

**Corregido**

### Mensaje clave

**Corregir no significa empezar de nuevo.**

### Regla visual

Debe sentirse como continuidad, no como castigo.

---

## Escena 11 — Luisito aprueba y cierra

### Interfaz

WhatsApp con Gamora Bot.

### Objetivo

Mostrar cierre humano.

### Contenido visual

Gamora informa:

- evidencia corregida recibida,
    
- cantidad confirmada,
    
- botón aprobar y cerrar.
    

Después muestra resumen:

- responsable,
    
- resultado,
    
- evidencia final.
    

Pregunta:

“¿Confirmas el cierre?”

Botón:

- Confirmar cierre.
    

### Estado

**Pendiente de cierre → Cerrado**

### Mensaje clave

**La IA acompaña; el humano decide.**

### Regla visual

El cierre debe sentirse claro y satisfactorio.

---

## Escena 12 — Historial final en Web/PWA

### Interfaz

Web/PWA.

### Objetivo

Mostrar valor final de la plataforma.

### Contenido visual

Panel final:

- compromiso,
    
- estado cerrado,
    
- responsable,
    
- resultado,
    
- evidencia final,
    
- historial completo,
    
- botón abrir conversación en WhatsApp.
    

### Estado

**Cerrado**

### Mensaje clave

**WhatsApp fue la operación. Web/PWA es la memoria y el control.**

### Regla visual

Esta escena debe justificar toda la plataforma.

---

## Escena 13 — Cierre comercial

### Interfaz

Slide o pantalla final.

### Objetivo

Cerrar la demo con mensaje claro.

### Contenido visual

Frase principal:

**Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.**

Frase secundaria:

**Gamora Bot convierte conversaciones operativas en compromisos con evidencia, seguimiento y cierre.**

### Mensaje clave

**WhatsApp opera. Web/PWA controla. Gamora mantiene el hilo.**

---

# Orden de construcción recomendado

## Paso 1 — Construir escenas WhatsApp

Priorizar:

1. Instrucción natural.
    
2. Gamora estructura.
    
3. Panchito recibe.
    
4. Evidencia.
    
5. Corrección.
    
6. Cierre.
    

## Paso 2 — Construir escenas Web/PWA

Priorizar:

1. Compromiso creado.
    
2. Revisión de evidencia.
    
3. Historial final.
    

## Paso 3 — Construir escenas de doble interfaz

Priorizar:

1. Creación + reflejo Web/PWA.
    
2. Aceptación + sincronización.
    
3. Revisión evidencia + vista ampliada.
    

## Paso 4 — Construir apertura y cierre

Priorizar:

1. Dolor actual.
    
2. Cierre comercial.
    

---

# Nivel de fidelidad visual

## V1

Fidelidad media-alta.

Debe verse profesional, pero no final.

Debe priorizar:

- claridad,
    
- lectura,
    
- jerarquía,
    
- coherencia,
    
- sensación de producto real.
    

## No debe buscar todavía

- animaciones,
    
- microinteracciones avanzadas,
    
- identidad final,
    
- onboarding completo,
    
- diseño responsive,
    
- sistema completo.
    

---

# Reglas de validación interna

Antes de mostrar el prototipo a usuarios, revisar:

1. ¿Se entiende el problema en la primera escena?
    
2. ¿Se entiende que Luisito opera desde WhatsApp?
    
3. ¿Se entiende que Gamora estructura?
    
4. ¿Se ve que Luisito confirma antes de crear?
    
5. ¿Se entiende qué recibe Panchito?
    
6. ¿Se entiende que la evidencia queda asociada?
    
7. ¿Se entiende la corrección?
    
8. ¿Se entiende el cierre?
    
9. ¿Web/PWA se ve útil?
    
10. ¿Las dos interfaces se sienten conectadas?
    
11. ¿Parece task manager?
    
12. ¿Parece técnicamente fantasioso?
    

---

# Checklist por escena

## Cada escena debe responder

|Pregunta|Sí / No|
|---|---|
|¿Tiene un objetivo claro?||
|¿Tiene una acción principal?||
|¿Se entiende el actor?||
|¿El texto es breve?||
|¿El estado es visible cuando aplica?||
|¿La escena avanza la historia?||
|¿No agrega funcionalidades nuevas?||
|¿No contradice los guardrails?||

---

# Checklist del prototipo completo

|Pregunta|Sí / No|
|---|---|
|¿La demo puede explicarse en menos de 5 minutos?||
|¿WhatsApp se siente como interfaz operativa?||
|¿Web/PWA se siente como capa de control?||
|¿Gamora mantiene el hilo entre ambas?||
|¿La evidencia tiene peso visual?||
|¿La corrección se entiende sin sentirse punitiva?||
|¿El cierre se siente final?||
|¿No parece otra app de tareas?||
|¿No parece vigilancia?||
|¿No promete leer chats personales?||
|¿Genera deseo de probarlo?||

---

# Riesgos durante la construcción visual

## Riesgo 1 — Hacer demasiadas pantallas

Si el flujo se alarga, perderá fuerza.

### Mitigación

Mantener V1 entre 10 y 13 escenas.

## Riesgo 2 — Decorar demasiado

Si el diseño compite con el flujo, la validación se contamina.

### Mitigación

Claridad antes que belleza.

## Riesgo 3 — Web/PWA débil

Si la Web/PWA solo refleja el chat, parecerá innecesaria.

### Mitigación

Mostrar estructura, evidencia ampliada e historial.

## Riesgo 4 — WhatsApp saturado

Si las conversaciones son demasiado largas, parecerá pesado.

### Mitigación

Mensajes compactos y tarjetas claras.

## Riesgo 5 — Parecer task manager

Si se enfatizan listas y checklists, se pierde diferenciación.

### Mitigación

Enfatizar conversación → compromiso → evidencia → corrección → cierre.

---

# Resultado esperado de la V1

Al terminar la primera versión visual, se debe poder mostrar a alguien y que entienda:

1. Qué problema existe.
    
2. Qué hace Gamora Bot.
    
3. Por qué WhatsApp-first reduce fricción.
    
4. Por qué Web/PWA aporta control.
    
5. Cómo se cierra un compromiso.
    
6. Por qué no es solo una app de tareas.
    

---

# Criterios de aprobación de la V1 visual

La V1 visual se considerará aprobada si:

- se entiende sin explicación larga,
    
- se ve profesional,
    
- el flujo se siente natural,
    
- las interfaces se sienten conectadas,
    
- Web/PWA aporta valor claro,
    
- evidencia/corrección/cierre son comprensibles,
    
- no hay promesas inviables,
    
- puede usarse para validar con usuarios.
    

---

# Próximo entregable después de este plan

Después de aprobar este plan, el siguiente entregable será:

**Especificación de Pantallas V1 — Prototipo Visual Gamora Bot**

Ese documento describirá cada pantalla visual que debe construirse, con contenido exacto, layout sugerido, componentes UI y mensaje narrativo.