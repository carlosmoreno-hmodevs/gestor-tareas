# Mapa de Pantallas WhatsApp-first + Web/PWA Opcional — Ferretería Luisito

## Estado

Documento base para validar el nuevo mapa de pantallas del prototipo simulado de Gamora Bot bajo el enfoque WhatsApp-first con Web/PWA opcional.

## Propósito

Este documento redefine las pantallas y momentos del prototipo para reflejar la nueva arquitectura de doble interfaz:

- WhatsApp como interfaz principal de operación.
    
- Web/PWA como capa estructurada de coordinación, visualización, historial y control.
    
- Gamora Bot como puente que mantiene el contexto entre ambas.
    

Este documento reemplaza el mapa anterior basado en una experiencia híbrida donde varias acciones dependían obligatoriamente de la Web/PWA.

## Principio rector

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

## Regla central

El usuario debe poder completar el flujo operativo básico desde WhatsApp.

La Web/PWA debe aparecer como apoyo poderoso, no como obligación.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

---

# Arquitectura de experiencia

## 1. WhatsApp — Interfaz operativa

WhatsApp será el lugar donde el usuario puede:

- dictar o escribir instrucciones,
    
- crear borradores,
    
- confirmar compromisos,
    
- recibir asignaciones,
    
- aceptar,
    
- evidenciar,
    
- corregir,
    
- aprobar,
    
- cerrar,
    
- consultar estados básicos.
    

## 2. Web/PWA — Capa estructurada

La Web/PWA será el lugar donde el usuario puede:

- ver compromisos organizados,
    
- consultar historial,
    
- revisar evidencias en vista ampliada,
    
- filtrar por responsable,
    
- ver pendientes por estado,
    
- administrar muchos compromisos,
    
- entender el flujo completo de forma visual.
    

## 3. Gamora Bot — Puente de continuidad

Gamora Bot mantiene el hilo entre ambas interfaces.

Cuando algo ocurre en WhatsApp, se refleja en Web/PWA.

Cuando algo se revisa en Web/PWA, puede continuar en WhatsApp.

---

# Secuencia principal del prototipo

La secuencia recomendada para la demo será de 14 momentos.

Esta secuencia busca equilibrar tres cosas:

1. Mostrar baja fricción en WhatsApp.
    
2. Mostrar que la Web/PWA no sobra.
    
3. Mostrar que ambas interfaces están conectadas.
    

---

# Momento 1 — Antes: WhatsApp desordenado

## Tipo

Pantalla conceptual de apertura.

## Interfaz

WhatsApp tradicional, sin Gamora Bot.

## Actor principal

Luisito.

## Objetivo

Mostrar el dolor antes de Gamora Bot.

## Qué debe comunicar

Luisito ya usa WhatsApp para operar, pero los pendientes se pierden entre mensajes.

## Información mínima

- Mensajes sueltos.
    
- Preguntas repetidas.
    
- Evidencia perdida.
    
- Falta de cierre.
    

## Acción principal

Ninguna.

## Función dentro de la demo

Crear contraste.

## Nota crítica

Debe ser breve. Solo debe mostrar el dolor, no explicar todo el producto.

---

# Momento 2 — Luisito dicta instrucción a Gamora Bot

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Luisito.

## Objetivo

Mostrar que Luisito puede iniciar el flujo hablando o escribiendo de forma natural.

## Mensaje base

“Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.”

## Acción principal

Enviar mensaje a Gamora Bot.

## Estado asociado

Sin compromiso formal todavía.

## Función dentro de la demo

Mostrar el cambio clave: Luisito ya no llena primero una pantalla; expresa una instrucción natural.

---

# Momento 3 — Gamora estructura el compromiso

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Gamora Bot.

## Objetivo

Mostrar que Gamora Bot interpreta lenguaje natural y lo convierte en estructura.

## Información mínima

- Responsable: Panchito.
    
- Actividad: contar sacos de cemento.
    
- Ubicación: Sucursal Norte.
    
- Fecha compromiso: hoy antes de las 5:00 p.m.
    
- Evidencia esperada: foto del área y cantidad total.
    

## Acción principal

**Crear compromiso**

## Acciones secundarias

- Editar.
    
- Cancelar.
    

## Estado asociado

**Borrador**

## Función dentro de la demo

Mostrar que la IA propone, pero no ejecuta sin confirmación.

## Nota crítica

Este momento debe dejar claro que Gamora Bot no “hace magia sin permiso”. Estructura y pide confirmación.

---

# Momento 4 — Luisito confirma creación

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Luisito.

## Objetivo

Formalizar el compromiso desde WhatsApp.

## Acción principal

**Crear compromiso**

## Respuesta esperada

Gamora Bot confirma que el compromiso fue creado y será enviado a Panchito.

## Acciones disponibles

- Ver resumen.
    
- Abrir en Web/PWA.
    
- Crear otro compromiso.
    

## Estado asociado

**Nuevo**

## Función dentro de la demo

Mostrar que el pendiente ya dejó de ser mensaje suelto.

---

# Momento 5 — Web/PWA refleja el compromiso creado

## Tipo

Vista estructurada opcional.

## Interfaz

Web/PWA.

## Actor principal

Luisito.

## Objetivo

Mostrar que lo que nació en WhatsApp queda ordenado en una plataforma.

## Información mínima

- Compromiso.
    
- Responsable.
    
- Ubicación.
    
- Fecha compromiso.
    
- Evidencia esperada.
    
- Estado: Nuevo.
    
- Historial inicial.
    

## Acción principal

**Volver a WhatsApp**

## Acciones secundarias

- Ver historial.
    
- Copiar enlace.
    
- Ver tablero.
    

## Estado asociado

**Nuevo**

## Función dentro de la demo

Demostrar que la Web/PWA no sobra: estructura y conserva lo que nació en WhatsApp.

## Nota crítica

Esta pantalla no debe parecer obligatoria. Debe sentirse como vista ampliada.

---

# Momento 6 — Panchito recibe compromiso

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Panchito.

## Objetivo

Mostrar que el responsable recibe una instrucción clara sin entrar a otra plataforma.

## Información mínima

- Quién asignó: Luisito.
    
- Qué debe hacer.
    
- Para cuándo.
    
- Qué evidencia debe mandar.
    

## Acción principal

**Aceptar compromiso**

## Acciones secundarias

- Tengo una duda.
    
- No puedo atenderlo.
    
- Abrir en Web/PWA.
    

## Estado asociado

**Nuevo**

## Función dentro de la demo

Mostrar baja fricción para Panchito.

---

# Momento 7 — Panchito acepta y Web/PWA actualiza estado

## Tipo

Doble interfaz sincronizada.

## Interfaz principal

WhatsApp.

## Interfaz secundaria

Web/PWA.

## Actor principal

Panchito.

## Objetivo

Mostrar que una acción en WhatsApp actualiza automáticamente la estructura en Web/PWA.

## Acción principal

Panchito presiona:

**Aceptar compromiso**

## Resultado en WhatsApp

Gamora Bot confirma a Panchito que el compromiso quedó aceptado.

## Resultado en Web/PWA

El estado cambia a:

**Aceptado**

Y se agrega evento:

**Panchito aceptó el compromiso.**

## Mensaje a Luisito

Gamora Bot avisa a Luisito:

“Panchito ya aceptó el compromiso.”

## Función dentro de la demo

Mostrar continuidad entre interfaces.

## Nota crítica

Este momento es clave para que el usuario entienda que no son dos mundos separados.

---

# Momento 8 — Panchito envía evidencia desde WhatsApp

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Panchito.

## Objetivo

Mostrar que Panchito puede evidenciar sin salir de WhatsApp.

## Mensaje base

“Listo, hay 48 sacos de cemento disponibles.”

## Adjunto simulado

Foto del área de cemento.

## Respuesta de Gamora Bot

Gamora confirma que envió la evidencia a Luisito para revisión.

## Estado asociado

**Evidencia enviada**

## Función dentro de la demo

Mostrar que la evidencia se captura en WhatsApp, pero queda asociada al compromiso.

---

# Momento 9 — Luisito revisa evidencia desde WhatsApp o Web/PWA

## Tipo

Punto de decisión con doble interfaz.

## Interfaz principal

WhatsApp.

## Interfaz opcional

Web/PWA.

## Actor principal

Luisito.

## Objetivo

Mostrar que Luisito puede decidir desde WhatsApp o abrir vista ampliada si quiere más comodidad.

## Mensaje de WhatsApp

Gamora Bot informa:

- Panchito envió evidencia.
    
- Cantidad reportada: 48 sacos.
    
- Evidencia: foto.
    
- Opciones de decisión.
    

## Acciones en WhatsApp

- Aprobar y cerrar.
    
- Pedir corrección.
    
- Abrir en Web/PWA.
    

## Acciones en Web/PWA

- Ver foto ampliada.
    
- Ver historial.
    
- Aprobar y cerrar.
    
- Pedir corrección.
    
- Volver a WhatsApp.
    

## Estado asociado

**Evidencia enviada**

## Función dentro de la demo

Mostrar que la Web/PWA aporta valor visual sin ser obligatoria.

---

# Momento 10 — Luisito pide corrección

## Tipo

Conversación estructurada.

## Interfaz principal

WhatsApp.

## Interfaz reflejo

Web/PWA.

## Actor principal

Luisito.

## Objetivo

Mostrar que una corrección puede nacer en WhatsApp, estructurarse por Gamora y quedar registrada en Web/PWA.

## Acción principal

Luisito pide corrección.

## Mensaje base

“La foto no muestra completo el espacio de cemento. Que mande una foto más abierta y confirme otra vez la cantidad.”

## Respuesta de Gamora Bot

Gamora estructura el motivo y pregunta si lo envía.

## Acción final

**Enviar corrección**

## Resultado en Web/PWA

Estado cambia a:

**Necesita corrección**

Historial registra:

**Luisito solicitó corrección de evidencia.**

## Función dentro de la demo

Mostrar que Gamora convierte una instrucción natural en corrección ordenada.

---

# Momento 11 — Panchito recibe corrección y reenvía evidencia

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actor principal

Panchito.

## Objetivo

Mostrar que Panchito entiende qué debe corregir y puede reenviar evidencia sin fricción.

## Información mínima

- Qué falta corregir.
    
- Qué debe enviar.
    
- Botón: Corregir y reenviar.
    

## Acción principal

Panchito envía nueva foto y confirma:

“Corregido. Son 48 sacos en total.”

## Estado asociado

**Corregido**

## Resultado en Web/PWA

La evidencia corregida queda registrada y vinculada al mismo compromiso.

## Función dentro de la demo

Mostrar que la corrección conserva el hilo.

---

# Momento 12 — Luisito aprueba y confirma cierre

## Tipo

Conversación WhatsApp-first con confirmación.

## Interfaz principal

WhatsApp.

## Interfaz opcional

Web/PWA.

## Actor principal

Luisito.

## Objetivo

Cerrar el compromiso con aprobación humana.

## Mensaje de Gamora Bot

Gamora informa que Panchito envió evidencia corregida y ofrece acciones:

- Aprobar y cerrar.
    
- Pedir nueva corrección.
    
- Abrir en Web/PWA.
    

## Acción principal

**Aprobar y cerrar**

## Confirmación obligatoria

Gamora Bot muestra resumen final y pregunta:

“¿Confirmas el cierre?”

## Acción final

**Confirmar cierre**

## Estado asociado

**Cerrado**

## Función dentro de la demo

Mostrar que el cierre no es automático y que Luisito mantiene control.

---

# Momento 13 — Confirmación de cierre a ambos actores

## Tipo

Conversación WhatsApp-first.

## Interfaz

WhatsApp con Gamora Bot.

## Actores

Luisito y Panchito.

## Objetivo

Cerrar el ciclo para ambos usuarios.

## Mensaje a Luisito

Compromiso cerrado.  
Resultado registrado: 48 sacos.  
Ya no tienes que dar seguimiento manual a este pendiente.

## Mensaje a Panchito

Luisito aprobó la evidencia y cerró el compromiso.  
Buen trabajo.

## Estado asociado

**Cerrado**

## Función dentro de la demo

Dar sensación de cierre claro y satisfactorio.

---

# Momento 14 — Web/PWA muestra historial final

## Tipo

Vista estructurada opcional.

## Interfaz

Web/PWA.

## Actor principal

Luisito.

## Objetivo

Mostrar el valor estructural de la plataforma.

## Información mínima

- Compromiso.
    
- Responsable.
    
- Estado final.
    
- Resultado.
    
- Evidencia final.
    
- Corrección.
    
- Historial completo.
    
- Conversación relacionada.
    

## Acciones disponibles

- Volver al tablero.
    
- Abrir conversación en WhatsApp.
    
- Crear compromiso similar.
    
- Ver evidencia.
    
- Exportar o compartir resumen en el futuro.
    

## Estado asociado

**Cerrado**

## Función dentro de la demo

Mostrar que todo lo operado en WhatsApp quedó ordenado, trazable y consultable.

## Nota crítica

Este momento debe dejar claro que Web/PWA es el cerebro visual del sistema, no una app extra sin utilidad.

---

# Secuencia compacta para storyboard

```text
Antes: WhatsApp desordenado
→ Luisito dicta instrucción a Gamora
→ Gamora estructura y pide confirmación
→ Luisito crea compromiso
→ Web/PWA refleja compromiso creado
→ Panchito recibe y acepta en WhatsApp
→ Web/PWA actualiza estado
→ Panchito manda evidencia en WhatsApp
→ Luisito revisa desde WhatsApp o Web/PWA
→ Luisito pide corrección
→ Panchito corrige en WhatsApp
→ Luisito aprueba y cierra
→ Gamora confirma a ambos
→ Web/PWA muestra historial final
```

---

# Pantallas / momentos por interfaz

## WhatsApp

|Momento|Actor|Función|
|---|---|---|
|Instrucción natural|Luisito|Crear intención|
|Resumen estructurado|Gamora Bot|Convertir lenguaje en compromiso|
|Confirmación de creación|Luisito|Formalizar compromiso|
|Recepción de compromiso|Panchito|Entender asignación|
|Aceptación|Panchito|Confirmar atención|
|Envío de evidencia|Panchito|Reportar cumplimiento|
|Revisión de evidencia|Luisito|Decidir|
|Corrección|Luisito / Panchito|Ajustar evidencia|
|Cierre|Luisito|Aprobar y terminar|
|Confirmación final|Luisito / Panchito|Cerrar ciclo|

## Web/PWA

|Momento|Actor|Función|
|---|---|---|
|Reflejo del compromiso creado|Luisito|Ver estructura|
|Actualización de estado|Luisito|Ver avance|
|Vista ampliada de evidencia|Luisito|Revisar mejor|
|Historial de corrección|Luisito|Entender qué pasó|
|Historial final|Luisito|Consultar trazabilidad|
|Tablero general|Luisito|Coordinar varios compromisos|

---

# Pantallas críticas para el prototipo

Las pantallas/momentos que no pueden faltar son:

1. Luisito dicta instrucción en WhatsApp.
    
2. Gamora estructura y pide confirmación.
    
3. Panchito recibe compromiso.
    
4. Panchito manda evidencia.
    
5. Luisito decide desde WhatsApp.
    
6. Web/PWA refleja evidencia y estado.
    
7. Corrección.
    
8. Cierre.
    
9. Historial final en Web/PWA.
    

Si estas piezas funcionan, la demo comunica el valor principal.

---

# Pantallas que deben evitarse todavía

Para no complicar la demo, se deben evitar:

- login,
    
- registro,
    
- configuración de empresa,
    
- administración avanzada de usuarios,
    
- reportes ejecutivos,
    
- analítica,
    
- IA conversacional genérica,
    
- multiempresa,
    
- cobranza,
    
- permisos avanzados,
    
- automatizaciones complejas,
    
- chat grupal,
    
- lectura de chats personales,
    
- integración real de Meta,
    
- dashboard sobrecargado.
    

---

# Nueva distribución de peso en la demo

## Antes

La Web/PWA cargaba mucho del flujo.

## Ahora

WhatsApp carga la operación.

Web/PWA carga el control visual.

## Distribución recomendada

|Interfaz|Peso en la demo|Rol|
|---|--:|---|
|WhatsApp|70%|Operación|
|Web/PWA|30%|Control, estructura y memoria|

## Nota crítica

No interpretar esto como “WhatsApp importa y Web/PWA no”.

La Web/PWA debe aparecer menos, pero cuando aparezca debe demostrar mucho valor.

---

# Reglas de transición entre interfaces

## Regla 1 — Toda transición debe conservar contexto

Si el usuario abre Web/PWA desde WhatsApp, debe llegar al compromiso específico, no a una pantalla genérica.

## Regla 2 — Toda vista Web/PWA debe permitir volver a WhatsApp

Si el usuario abrió una vista ampliada, debe poder regresar al flujo conversacional.

## Regla 3 — No repetir información

El usuario no debe volver a capturar datos en Web/PWA si ya los dio en WhatsApp.

## Regla 4 — El estado debe ser único

No debe existir un estado en WhatsApp y otro distinto en Web/PWA.

Ambas interfaces son vistas del mismo compromiso.

## Regla 5 — La Web/PWA debe justificar su existencia

Cada aparición de Web/PWA debe mostrar algo que WhatsApp no muestra tan bien:

- orden,
    
- historial,
    
- tablero,
    
- evidencia agrupada,
    
- vista amplia,
    
- varios compromisos,
    
- memoria operativa.
    

---

# Mensaje de producto que debe transmitir este mapa

Gamora Bot te deja operar desde WhatsApp, pero no deja tus pendientes perdidos en WhatsApp.

Cada compromiso queda estructurado, coordinado y visible en una plataforma donde puedes controlar qué está pendiente, qué ya tiene evidencia, qué necesita corrección y qué quedó cerrado.

---

# Riesgo principal de esta versión

El riesgo principal es que la demo se vaya demasiado hacia WhatsApp y la Web/PWA parezca innecesaria.

## Cómo evitarlo

Mostrar la Web/PWA en tres momentos clave:

1. Al crear el compromiso, para ver que quedó estructurado.
    
2. Al revisar evidencia, para mostrar vista ampliada.
    
3. Al final, para mostrar historial y memoria operativa.
    

---

# Criterios de aprobación

Este mapa se considerará aprobado si:

- El usuario puede entender que opera desde WhatsApp.
    
- La Web/PWA se entiende como capa estructurada, no como obligación.
    
- Las dos interfaces se sienten conectadas.
    
- El usuario no repite información.
    
- Gamora Bot mantiene el hilo.
    
- La evidencia queda asociada al compromiso.
    
- La corrección queda registrada.
    
- El cierre requiere confirmación humana.
    
- El historial final justifica la plataforma.
    
- La demo no promete lectura de chats personales ni capacidades inviables.
    

## Próximo paso después de aprobar este documento

Después de aprobar este mapa, el siguiente entregable será:

**Wireframes Textuales WhatsApp-first + Web/PWA Opcional — Ferretería Luisito**

Ese documento ya representará las pantallas/momentos de la nueva demo en formato textual, mostrando cómo se vería la conversación y cómo se reflejaría en la Web/PWA.