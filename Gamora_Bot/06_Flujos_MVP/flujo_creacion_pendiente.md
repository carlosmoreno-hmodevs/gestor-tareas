# Flujo MVP — Creación de Compromiso Operativo

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del flujo

Este flujo describe cómo un usuario autorizado crea un compromiso operativo trazable desde WhatsApp o web/PWA.

El objetivo es documentar cómo Gamora Bot interpreta una solicitud, valida datos mínimos, confirma con el usuario, asigna responsable y deja el compromiso listo para aceptación, sin sacrificar control, consentimiento, permisos ni guardrails.

Este documento no define modelo técnico, base de datos, endpoints, APIs ni código. Es un flujo funcional para orientar el MVP.

## 2. Principios del flujo

- No todo mensaje es compromiso.
- Gamora no lee chats personales.
- Solo usuarios enrolados pueden crear compromisos operativos.
- Si falta información, Gamora pregunta.
- Si hay ambigüedad, Gamora confirma.
- IA interpreta, backend valida, humano confirma.
- No se notifica a responsables no enrolados.
- Todo queda en bitácora.
- Se aplican guardrails de IA y WhatsApp.
- WhatsApp es el canal operativo principal, pero el estado oficial vive en Gamora Core.

## 3. Actores

### Coordinador / solicitante

Usuario autorizado que crea el compromiso, asigna responsable y confirma la creación.

Ejemplo: Luisito.

### Responsable operativo

Usuario autorizado que recibe el compromiso, lo acepta y posteriormente ejecuta o envía evidencia.

Ejemplo: Panchito.

### Gamora Bot

Canal formal que conversa con usuarios por WhatsApp, solicita datos faltantes, confirma acciones y comunica resultados.

### IA auxiliar

Capacidad auxiliar que interpreta lenguaje natural, detecta intención, sugiere estructura y ayuda a identificar datos faltantes.

### Backend / Gamora Core

Núcleo funcional que valida usuarios, permisos, estados, enrolamiento, datos mínimos, bitácora y reglas del compromiso.

### Web/PWA

Capa formal de control donde se puede crear el compromiso desde formulario ligero, revisar datos, consultar estados y administrar usuarios.

### Guardrails

Capa funcional que limita consumo, evita loops, bloquea duplicados, controla reintentos y detiene acciones ambiguas o riesgosas.

## 4. Datos mínimos del compromiso

Un compromiso operativo debe contar con datos mínimos para quedar activo:

- Qué se debe hacer.
- Responsable.
- Fecha compromiso.
- Evidencia esperada, si aplica.
- Empresa/espacio.
- Unidad/sucursal/frente, si aplica.
- Prioridad opcional.

### Regla

Un compromiso no debe quedar activo si faltan responsable, fecha o descripción mínima.

Si falta información, el compromiso permanece como borrador, pendiente de datos o en confirmación requerida.

## 5. Flujo A — Creación desde WhatsApp en lenguaje natural

### Ejemplo

“Gamora, dile a Panchito que cuente los sacos de cemento de la sucursal Sur hoy antes de las 5 y me mande foto.”

### Pasos

1. Luisito escribe al WhatsApp de Gamora.
2. Gamora identifica que Luisito está enrolado.
3. IA auxiliar interpreta la intención del mensaje.
4. Backend valida empresa, rol y permisos de Luisito.
5. Gamora extrae responsable, actividad, unidad, fecha y evidencia esperada.
6. Si los datos son suficientes, Gamora muestra resumen de confirmación.
7. Luisito confirma.
8. Backend crea el compromiso.
9. Gamora registra bitácora.
10. Gamora notifica a Panchito si está enrolado y tiene WhatsApp activo.
11. El compromiso queda en estado Pendiente de aceptación.

### Resultado esperado

El mensaje informal se convierte en compromiso operativo trazable con responsable, fecha, evidencia esperada, estado y bitácora.

## 6. Flujo B — Creación con datos faltantes

### Ejemplo

“Gamora, ponle a Panchito contar los sacos.”

### Datos faltantes

- Sucursal.
- Fecha compromiso.
- Evidencia esperada.

### Pasos

1. Gamora detecta intención de crear compromiso.
2. Backend identifica datos faltantes.
3. Gamora pregunta lo mínimo necesario.
4. Luisito responde con la información faltante.
5. Gamora confirma resumen.
6. Luisito aprueba.
7. El compromiso se crea.

### Estados usados

- Borrador.
- Pendiente de datos.
- Confirmación requerida.
- Creado/asignado.
- Pendiente de aceptación.

### Regla

Gamora debe pedir solo la información necesaria para activar el compromiso. Si el usuario no responde, el flujo debe quedar pausado, guardarse como borrador o cancelarse según regla funcional.

## 7. Flujo C — Creación con responsable no enrolado

### Ejemplo

“Gamora, dile a Chuy que revise el inventario.”

### Pasos

1. Gamora detecta que Chuy no está enrolado.
2. Gamora no envía compromiso.
3. Gamora ofrece opciones:
   - Invitar a Chuy.
   - Asignar a otro usuario enrolado.
   - Guardar como borrador.
   - Cancelar.
4. Si Luisito invita a Chuy, se inicia flujo de invitación/enrolamiento.
5. El compromiso no se notifica hasta que Chuy acepte.

### Regla

No mensajes a usuarios no enrolados.

La invitación no equivale a enrolamiento. El compromiso puede quedar como borrador o pendiente de responsable válido, pero no debe enviarse por WhatsApp a Chuy hasta que acepte participar.

## 8. Flujo D — Creación desde web/PWA

### Pasos

1. Luisito entra a web/PWA.
2. Selecciona crear compromiso.
3. Captura datos mínimos.
4. Selecciona responsable enrolado.
5. Define evidencia esperada.
6. Guarda.
7. Gamora notifica al responsable por WhatsApp si tiene canal activo.
8. El compromiso queda pendiente de aceptación.

### Regla

La web/PWA debe permitir creación con mayor control formal, pero sin convertir el flujo en un formulario pesado. Si el responsable no está enrolado o tiene WhatsApp desactivado, Gamora debe bloquear o ajustar la notificación según estado del usuario.

## 9. Flujo E — Ambigüedad y menú guiado

### Ejemplo

“Gamora, que Panchito revise eso de ayer.”

### Pasos

1. IA detecta baja confianza.
2. Backend bloquea creación directa.
3. Gamora pregunta:
   - ¿Qué debe revisar?
   - ¿Para cuándo?
   - ¿En qué sucursal?
4. Si falla varias veces, pasa a menú guiado.
5. Si no se resuelve, se guarda borrador o se cancela.

### Reglas

- No crear compromisos ambiguos.
- No loops.
- Fallback a menú guiado.
- Guardrail puede pausar flujo si hay intentos repetidos.
- Una interpretación de IA de baja confianza no debe convertirse en compromiso activo.

## 10. Estados usados en el flujo

| Momento | Estado del compromiso | Estado de conversación | Estado IA | Estado guardrail |
|---|---|---|---|---|
| Mensaje inicial claro | Borrador | Intención detectada | Interpretación generada | Normal |
| Faltan datos mínimos | Pendiente de datos | Esperando respuesta | Interpretación generada | Normal |
| Datos completos, requiere aprobación | Confirmación requerida | Esperando respuesta | Requiere confirmación | Normal |
| Creación confirmada | Creado/asignado | Flujo completado | No requerida | Normal |
| Notificación al responsable | Pendiente de aceptación | Flujo completado | No requerida | Normal |
| Mensaje ambiguo | Borrador | Intención ambigua | Baja confianza | Normal |
| Ambigüedad repetida | Pendiente de datos | Menú guiado | Menú guiado requerido | Cerca de límite |
| Se alcanza límite | Suspendido por guardrail | Flujo bloqueado por guardrail | Límite alcanzado | Límite alcanzado |

## 11. Bitácora requerida

El flujo debe registrar los siguientes eventos cuando apliquen:

- Mensaje recibido.
- IA utilizada.
- Datos extraídos.
- Datos faltantes solicitados.
- Confirmación recibida.
- Compromiso creado.
- Responsable validado.
- Notificación enviada.
- Notificación bloqueada por no enrolamiento.
- Guardrail activado, si aplica.
- Borrador guardado, si aplica.
- Flujo cancelado, si aplica.

## 12. Guardrails aplicables

- Límite de llamadas IA por conversación.
- Límite de intentos de aclaración.
- No mensajes a no enrolados.
- No reintentos infinitos.
- No creación masiva sin control.
- Fallback a menú guiado.
- Registro de consumo IA/WhatsApp.
- Bloqueo si se alcanza límite.
- Pausa del flujo ante comportamiento anómalo.
- Prevención de duplicados si el mismo evento o mensaje se procesa más de una vez.

## 13. Notificaciones

### Confirmación al creador

Gamora debe mostrar a Luisito un resumen antes de crear el compromiso:

- Responsable.
- Actividad.
- Fecha compromiso.
- Unidad/sucursal/frente.
- Evidencia esperada.

### Notificación al responsable

Gamora debe notificar a Panchito solo si:

- Está enrolado.
- Tiene WhatsApp activo.
- Pertenece al espacio de trabajo correspondiente.
- Tiene rol que permite recibir compromisos.

### Alerta si responsable no está enrolado

Si el responsable no está enrolado, Gamora debe avisar al creador que no puede enviar el compromiso por WhatsApp y ofrecer alternativas.

### No enviar mensaje si WhatsApp está desactivado

Si el responsable tiene estado WhatsApp desactivado, Gamora no debe enviar notificación por WhatsApp. El compromiso puede gestionarse por web/PWA si el flujo lo permite.

### Notificación agrupada si aplica

Si existen varias notificaciones próximas, Gamora puede agruparlas para reducir ruido y costo.

## 14. Salidas posibles del flujo

- Compromiso creado y pendiente de aceptación.
- Borrador guardado por datos faltantes.
- Flujo cancelado.
- Responsable no enrolado.
- Bloqueado por guardrail.
- Enrolamiento requerido.
- Creación desde web/PWA completada.
- Menú guiado requerido por ambigüedad.
- Notificación bloqueada por WhatsApp desactivado.

## 15. Criterios de aceptación funcional

- Usuario enrolado puede crear compromiso.
- Usuario no enrolado no puede recibir compromiso.
- Gamora pregunta datos faltantes.
- Gamora confirma antes de crear.
- El compromiso queda con responsable, fecha, evidencia esperada y estado.
- La notificación al responsable se envía solo si está enrolado y WhatsApp activo.
- Todo cambio queda en bitácora.
- Si IA tiene baja confianza, no crea compromiso directo.
- Si se alcanza límite, guardrail bloquea o pausa.
- La creación desde web/PWA respeta las mismas reglas de usuario, permisos, enrolamiento y bitácora.

## 16. Cierre del flujo

Este flujo prueba la capacidad base de Gamora Bot: convertir lenguaje natural en compromiso operativo trazable sin sacrificar control, consentimiento ni seguridad.

El valor del flujo no está en crear una tarea más, sino en asegurar que una instrucción operativa tenga responsable, fecha, evidencia esperada, confirmación, notificación válida, estado y bitácora dentro de Gamora Core.
