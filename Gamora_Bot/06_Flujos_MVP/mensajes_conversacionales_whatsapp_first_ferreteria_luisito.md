# Mensajes Conversacionales WhatsApp-first — Ferretería Luisito

## Estado

Documento base para validar la conversación principal del prototipo simulado WhatsApp-first de Gamora Bot.

## Propósito

Este documento define los mensajes conversacionales que permitirán simular el flujo completo de Gamora Bot desde WhatsApp, desde la creación del compromiso en lenguaje natural hasta la evidencia, corrección, cierre y reflejo opcional en Web/PWA.

Este documento reemplaza la lógica anterior donde varias acciones dependían de la Web/PWA.

A partir de esta versión, WhatsApp será la interfaz principal de operación y la Web/PWA será la capa que estructura, coordina, visualiza y conserva el control del flujo.

## Principio rector actualizado

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora Bot conecta ambas sin que el usuario sienta fricción.**

## Qué significa esto

El usuario puede operar desde WhatsApp porque ahí ya conversa y trabaja.

La Web/PWA no sobra. La Web/PWA es el centro estructurado donde se ordenan los compromisos, evidencias, estados, responsables, fechas, historial y tableros.

La diferencia es que el usuario no debe estar obligado a entrar a la Web/PWA para completar el flujo operativo básico.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Actores

|Actor|Rol|
|---|---|
|Luisito|Crea, revisa, corrige y cierra compromisos|
|Panchito|Recibe, acepta, ejecuta, evidencia y corrige|
|Gamora Bot|Interpreta, estructura, pregunta, confirma, comunica y registra|
|Web/PWA Gamora|Ordena, visualiza, coordina e historiza todo lo ocurrido|

---

# Reglas conversacionales

## 1. La IA no formaliza sin confirmación

Gamora Bot puede interpretar lenguaje natural, pero no debe crear un compromiso sin confirmación humana.

Regla:

**Interpreta → estructura → muestra resumen → pide confirmación → crea.**

## 2. Si falta información, Gamora pregunta

Gamora Bot debe detectar datos faltantes y preguntar solamente lo indispensable.

Campos mínimos:

- responsable,
    
- actividad,
    
- fecha compromiso,
    
- evidencia esperada,
    
- ubicación si aplica.
    

## 3. WhatsApp no reemplaza la Web/PWA

WhatsApp es la interfaz de operación.

La Web/PWA es la capa de estructura, coordinación, consulta e historial.

## 4. La conversación debe ser breve

Gamora Bot no debe mandar textos largos si puede resolver con mensajes compactos.

## 5. El usuario debe sentir control

Gamora Bot no debe actuar como si decidiera por Luisito.

Luisito siempre confirma creación, corrección y cierre.

---

# Flujo conversacional completo

## Momento 1 — Luisito inicia con lenguaje natural completo

### Canal

WhatsApp con Gamora Bot.

### Mensaje de Luisito

Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.

### Respuesta de Gamora Bot

Entendido, Luisito.  
Detecté este compromiso:

**Responsable:** Panchito  
**Actividad:** Contar los sacos de cemento disponibles  
**Ubicación:** Sucursal Norte  
**Fecha compromiso:** Hoy antes de las 5:00 p.m.  
**Evidencia esperada:** Foto del área de cemento y cantidad total de sacos

¿Lo creo así?

### Botones simulados

- Crear compromiso
    
- Editar
    
- Cancelar
    

### Estado

**Borrador**

### Qué debe demostrar

Luisito puede hablar de forma natural y Gamora Bot convierte esa instrucción en estructura.

---

## Momento 2 — Variante: Luisito inicia con información incompleta

Esta variante no necesariamente debe aparecer en la demo principal, pero es importante documentarla porque muestra inteligencia y baja fricción.

### Mensaje incompleto de Luisito

Gamora, dile a Panchito que cuente los sacos de cemento.

### Respuesta de Gamora Bot

Claro, Luisito.  
Me falta un dato para crear el compromiso:

**¿Para cuándo debe quedar listo?**

### Luisito responde

Hoy antes de las 5.

### Gamora Bot pregunta si falta ubicación

Perfecto.  
¿En qué sucursal o lugar debe hacerse?

### Luisito responde

Sucursal Norte.

### Gamora Bot pregunta evidencia

¿Qué evidencia debe mandar Panchito para confirmar que quedó hecho?

### Luisito responde

Foto del área y cantidad total.

### Gamora Bot estructura

Listo, Luisito.  
Detecté este compromiso:

**Responsable:** Panchito  
**Actividad:** Contar los sacos de cemento disponibles  
**Ubicación:** Sucursal Norte  
**Fecha compromiso:** Hoy antes de las 5:00 p.m.  
**Evidencia esperada:** Foto del área de cemento y cantidad total de sacos

¿Lo creo así?

### Botones simulados

- Crear compromiso
    
- Editar
    
- Cancelar
    

### Estado

**Borrador**

### Qué debe demostrar

Gamora Bot no obliga a llenar formulario. Pregunta lo mínimo necesario dentro de WhatsApp.

---

## Momento 3 — Luisito confirma creación

### Acción de Luisito

Luisito selecciona:

**Crear compromiso**

### Respuesta de Gamora Bot a Luisito

Listo, Luisito.  
Creé el compromiso y se lo enviaré a Panchito por WhatsApp.

Te avisaré cuando lo acepte o cuando mande evidencia.

### Botones simulados

- Ver resumen
    
- Abrir en Web/PWA
    
- Crear otro compromiso
    

### Estado

**Nuevo**

### Nota importante

Aquí aparece por primera vez la conexión con Web/PWA.

El botón **Abrir en Web/PWA** no es obligatorio. Es una opción para ver el compromiso de forma estructurada.

### Qué debe demostrar

WhatsApp permite operar; Web/PWA queda disponible como vista ordenada.

---

## Momento 4 — Web/PWA refleja el compromiso creado

### Canal

Web/PWA opcional.

### Vista simulada

Compromiso creado:

**Contar sacos de cemento**  
Responsable: Panchito  
Ubicación: Sucursal Norte  
Fecha compromiso: Hoy antes de las 5:00 p.m.  
Estado: Nuevo  
Evidencia esperada: Foto del área y cantidad total

### Acciones opcionales

- Ver historial
    
- Ver evidencia
    
- Copiar enlace del compromiso
    
- Volver a WhatsApp
    

### Qué debe demostrar

La Web/PWA no sobra. Ordena y conserva todo lo que nació en WhatsApp.

---

## Momento 5 — Panchito recibe el compromiso

### Canal

WhatsApp con Gamora Bot.

### Mensaje de Gamora Bot a Panchito

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
    

### Estado

**Nuevo**

### Qué debe demostrar

Panchito entiende el compromiso sin entrar a una plataforma.

---

## Momento 6 — Panchito acepta

### Acción de Panchito

Panchito selecciona:

**Aceptar compromiso**

### Respuesta de Gamora Bot a Panchito

Perfecto, Panchito.  
El compromiso quedó aceptado.

Cuando termines el conteo, manda aquí mismo la foto del área de cemento y la cantidad total de sacos.

### Botones simulados

- Enviar evidencia
    
- Ver resumen
    
- Abrir en Web/PWA
    

### Estado

**Aceptado**

### Mensaje de Gamora Bot a Luisito

Luisito, Panchito ya aceptó el compromiso:

**Contar los sacos de cemento disponibles en Sucursal Norte.**

Estado: **Aceptado**

### Botones simulados para Luisito

- Ver estado
    
- Abrir en Web/PWA
    

### Qué debe demostrar

Luisito ya no tiene que preguntar “¿sí lo viste?”. Gamora Bot actualiza el estado y lo refleja en ambas interfaces.

---

## Momento 7 — Web/PWA actualiza estado automáticamente

### Canal

Web/PWA opcional.

### Actualización visible

Estado del compromiso:

**Aceptado**

Último evento:

**Panchito aceptó el compromiso.**

### Qué debe demostrar

Lo que ocurre en WhatsApp alimenta la Web/PWA en automático.

---

## Momento 8 — Panchito envía evidencia desde WhatsApp

### Mensaje de Panchito

Listo, hay 48 sacos de cemento disponibles.

### Adjunto simulado

Foto del área de cemento.

### Respuesta de Gamora Bot a Panchito

Gracias, Panchito.  
Envié la evidencia a Luisito para revisión.

Te avisaré si queda cerrada o si hace falta corregir algo.

### Botones simulados

- Ver resumen
    
- Abrir en Web/PWA
    

### Estado

**Evidencia enviada**

### Qué debe demostrar

Panchito no tiene que cambiar de interfaz para evidenciar.

---

## Momento 9 — Luisito recibe evidencia para revisión

### Mensaje de Gamora Bot a Luisito

Luisito, Panchito envió evidencia del compromiso:

**Contar los sacos de cemento disponibles en Sucursal Norte.**

**Cantidad reportada:** 48 sacos  
**Evidencia:** Foto del área de cemento

¿Qué deseas hacer?

### Botones simulados

- Aprobar y cerrar
    
- Pedir corrección
    
- Ver detalle
    
- Abrir en Web/PWA
    

### Estado

**Evidencia enviada**

### Nota importante

La opción **Abrir en Web/PWA** permite revisar con más comodidad, pero no es obligatoria.

### Qué debe demostrar

Luisito puede decidir desde WhatsApp, pero también puede abrir la vista estructurada si lo desea.

---

## Momento 10 — Web/PWA muestra evidencia estructurada

### Canal

Web/PWA opcional.

### Vista simulada

**Revisión de evidencia**

Compromiso: Contar sacos de cemento  
Responsable: Panchito  
Cantidad reportada: 48 sacos  
Evidencia: Foto del área de cemento  
Estado: Evidencia enviada

### Acciones opcionales

- Aprobar y cerrar
    
- Pedir corrección
    
- Volver a WhatsApp
    
- Ver historial
    

### Qué debe demostrar

La Web/PWA permite revisar de forma más ordenada sin romper el flujo conversacional.

---

## Momento 11 — Luisito pide corrección desde WhatsApp

### Acción de Luisito

Luisito selecciona:

**Pedir corrección**

### Mensaje de Luisito

La foto no muestra completo el espacio de cemento. Que mande una foto más abierta y confirme otra vez la cantidad.

### Respuesta de Gamora Bot

Entendido, Luisito.  
Enviaré esta corrección a Panchito:

**Motivo:**  
La foto no muestra completo el espacio de cemento.

**Qué debe enviar:**  
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.

¿La envío?

### Botones simulados

- Enviar corrección
    
- Editar
    
- Cancelar
    

### Estado

**Necesita corrección**

### Qué debe demostrar

Incluso la corrección puede nacer en lenguaje natural, pero Gamora la estructura antes de enviarla.

---

## Momento 12 — Luisito confirma envío de corrección

### Acción de Luisito

Luisito selecciona:

**Enviar corrección**

### Respuesta de Gamora Bot a Luisito

Listo, Luisito.  
Le pedí a Panchito corregir la evidencia.

Te avisaré cuando la reenvíe.

### Botones simulados

- Ver estado
    
- Abrir en Web/PWA
    

### Estado

**Necesita corrección**

---

## Momento 13 — Panchito recibe corrección

### Mensaje de Gamora Bot a Panchito

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
    
- Abrir en Web/PWA
    

### Estado

**Necesita corrección**

### Qué debe demostrar

La corrección es clara y específica. No se siente como regaño.

---

## Momento 14 — Web/PWA refleja corrección solicitada

### Canal

Web/PWA opcional.

### Actualización visible

Estado: **Necesita corrección**

Último evento:

**Luisito solicitó corrección de evidencia.**

Motivo:

**La foto no muestra completo el espacio de cemento.**

### Qué debe demostrar

La Web/PWA funciona como memoria y coordinación del flujo.

---

## Momento 15 — Panchito reenvía evidencia corregida

### Mensaje de Panchito

Corregido. Son 48 sacos en total.

### Adjunto simulado

Foto completa del área de cemento.

### Respuesta de Gamora Bot a Panchito

Gracias, Panchito.  
Envié la evidencia corregida a Luisito para revisión.

### Botones simulados

- Ver resumen
    
- Abrir en Web/PWA
    

### Estado

**Corregido**

---

## Momento 16 — Luisito recibe evidencia corregida

### Mensaje de Gamora Bot a Luisito

Luisito, Panchito envió evidencia corregida.

**Compromiso:**  
Contar los sacos de cemento disponibles en Sucursal Norte.

**Cantidad confirmada:** 48 sacos

**Corrección:**  
Foto más abierta del área de cemento.

¿Qué deseas hacer?

### Botones simulados

- Aprobar y cerrar
    
- Pedir nueva corrección
    
- Ver detalle
    
- Abrir en Web/PWA
    

### Estado

**Corregido**

---

## Momento 17 — Luisito aprueba y cierra desde WhatsApp

### Acción de Luisito

Luisito selecciona:

**Aprobar y cerrar**

### Respuesta de Gamora Bot

Vas a cerrar este compromiso:

**Responsable:** Panchito  
**Resultado:** 48 sacos de cemento disponibles en Sucursal Norte  
**Evidencia final:** Foto completa del área de cemento

¿Confirmas el cierre?

### Botones simulados

- Confirmar cierre
    
- Volver a revisar
    
- Abrir en Web/PWA
    

### Estado

**Pendiente de cierre**

### Qué debe demostrar

El cierre no ocurre solo. Luisito confirma.

---

## Momento 18 — Luisito confirma cierre

### Acción de Luisito

Luisito selecciona:

**Confirmar cierre**

### Respuesta de Gamora Bot a Luisito

Compromiso cerrado, Luisito.

El pendiente quedó cumplido, evidenciado y cerrado.

**Resultado registrado:**  
48 sacos de cemento disponibles en Sucursal Norte.

Ya no tienes que dar seguimiento manual a este pendiente.

### Botones simulados

- Ver historial
    
- Abrir en Web/PWA
    
- Crear otro compromiso
    

### Estado

**Cerrado**

---

## Momento 19 — Panchito recibe confirmación de cierre

### Mensaje de Gamora Bot a Panchito

Listo, Panchito.  
Luisito aprobó la evidencia y cerró el compromiso.

**Resultado registrado:**  
48 sacos de cemento disponibles en Sucursal Norte.

Buen trabajo.

### Botones simulados

- Ver mis compromisos
    
- Abrir en Web/PWA
    

### Estado

**Cerrado**

---

## Momento 20 — Web/PWA muestra historial final

### Canal

Web/PWA opcional.

### Vista simulada

**Historial del compromiso**

Compromiso: Contar sacos de cemento  
Responsable: Panchito  
Estado final: Cerrado  
Resultado: 48 sacos  
Evidencia final: Foto completa del área

### Eventos

|Hora simulada|Evento|
|---|---|
|9:15 a.m.|Luisito dictó la instrucción a Gamora Bot|
|9:16 a.m.|Gamora estructuró el compromiso|
|9:17 a.m.|Luisito confirmó creación|
|9:18 a.m.|Panchito recibió el compromiso|
|9:20 a.m.|Panchito aceptó|
|3:40 p.m.|Panchito envió evidencia|
|3:50 p.m.|Luisito pidió corrección|
|4:10 p.m.|Panchito envió evidencia corregida|
|4:18 p.m.|Luisito aprobó y cerró|

### Acciones opcionales

- Volver al tablero
    
- Abrir conversación relacionada
    
- Crear compromiso similar
    

### Qué debe demostrar

La Web/PWA es la memoria estructurada del flujo que se operó desde WhatsApp.

---

# Conexión bidireccional entre WhatsApp y Web/PWA

## Desde WhatsApp hacia Web/PWA

WhatsApp puede ofrecer opciones como:

- Abrir en Web/PWA
    
- Ver detalle
    
- Ver historial
    
- Ver tablero
    
- Ver mis compromisos
    

## Desde Web/PWA hacia WhatsApp

La Web/PWA puede ofrecer opciones como:

- Abrir conversación en WhatsApp
    
- Enviar recordatorio por WhatsApp
    
- Solicitar corrección por WhatsApp
    
- Compartir resumen por WhatsApp
    
- Continuar en WhatsApp
    

## Principio de continuidad

El usuario debe poder cambiar de una interfaz a otra sin sentir que empezó de nuevo.

La conversación, estado, evidencia e historial deben conservarse.

## Frase guía

**El usuario opera donde le conviene; Gamora mantiene el hilo.**

---

# Mensajes clave para explicar la doble interfaz

## Mensaje corto

Gamora Bot funciona en WhatsApp para operar rápido y en Web/PWA para ver todo ordenado.

## Mensaje comercial

Tus pendientes nacen y se atienden en WhatsApp, pero quedan organizados en una plataforma donde puedes ver estados, responsables, evidencias e historial.

## Mensaje de producto

WhatsApp es la interfaz natural de operación.  
Web/PWA es la capa de control, coordinación y memoria.

## Mensaje de confianza

Gamora Bot no lee tus chats personales ni tus grupos.  
Solo procesa los mensajes que envías directamente al canal formal de Gamora Bot.

---

# Diferencia frente a un task manager

Gamora Bot no es una lista de tareas que obliga al usuario a entrar a otra app.

Gamora Bot convierte una conversación operativa en un compromiso estructurado y lo mantiene conectado entre WhatsApp y Web/PWA.

## Diferenciadores

|Task manager tradicional|Gamora Bot|
|---|---|
|El usuario entra a una app|El usuario opera desde WhatsApp|
|La tarea se captura manualmente|La instrucción se estructura desde lenguaje natural|
|La evidencia suele quedar fuera|La evidencia queda asociada al compromiso|
|El seguimiento se fragmenta|Gamora mantiene el hilo|
|El cierre puede ser ambiguo|El cierre requiere aprobación|
|La conversación queda separada|WhatsApp y Web/PWA se conectan|

---

# Riesgos del enfoque conversacional

## Riesgo 1 — Conversaciones demasiado largas

Si Gamora Bot pregunta demasiadas cosas, la baja fricción se pierde.

### Mitigación

Solo preguntar lo indispensable.

## Riesgo 2 — Interpretación incorrecta

La IA puede estructurar mal una instrucción.

### Mitigación

Siempre pedir confirmación antes de crear.

## Riesgo 3 — WhatsApp saturado

Demasiadas notificaciones pueden molestar.

### Mitigación

Mensajes compactos y agrupados.

## Riesgo 4 — Web/PWA percibida como secundaria sin valor

Si la demo solo muestra WhatsApp, la plataforma puede parecer innecesaria.

### Mitigación

Mostrar la Web/PWA como el lugar donde todo queda ordenado, trazable y consultable.

## Riesgo 5 — Frontera confusa entre interfaces

Si el usuario no entiende cuándo usar cada una, puede confundirse.

### Mitigación

Comunicar claramente:

- WhatsApp para operar.
    
- Web/PWA para visualizar, coordinar y administrar.
    

---

# Criterios de aprobación

Este documento se considerará aprobado si:

- El flujo puede operarse completo desde WhatsApp.
    
- La IA estructura lenguaje natural sin actuar sin confirmación.
    
- La Web/PWA no se siente sobrante.
    
- La Web/PWA se entiende como capa de control y memoria.
    
- La conexión entre WhatsApp y Web/PWA se siente natural.
    
- Panchito mantiene baja fricción.
    
- Luisito mantiene control.
    
- La evidencia, corrección y cierre quedan claros.
    
- La demo se diferencia de un task manager tradicional.
    

## Próximo paso después de aprobar este documento

Después de aprobar este documento, el siguiente entregable será:

**Mapa de Pantallas WhatsApp-first + Web/PWA Opcional — Ferretería Luisito**

Ese documento redefinirá las pantallas del prototipo para reflejar esta nueva arquitectura de doble interfaz.