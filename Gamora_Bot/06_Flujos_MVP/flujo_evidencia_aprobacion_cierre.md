# Flujo MVP — Evidencia, Aprobación y Cierre

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del flujo

Este flujo describe cómo un compromiso operativo pasa de aceptado/en proceso a evidencia recibida, revisión, aprobación/corrección/rechazo y cierre/liberación.

El objetivo es documentar cómo Gamora Bot recibe evidencia, la asocia al compromiso correcto, notifica al coordinador o validador, permite revisión desde web/PWA y registra una decisión trazable.

Este documento no define modelo técnico, base de datos, APIs, endpoints ni código. Es un flujo funcional para orientar el MVP.

## 2. Principios del flujo

- La evidencia no es simple adjunto.
- Toda evidencia debe asociarse a un compromiso.
- Evidencia recibida no equivale a aprobación.
- El responsable no debe aprobar su propia evidencia si el flujo requiere validación.
- Gamora debe notificar al coordinador/validador cuando haya evidencia pendiente de revisión.
- IA no aprueba ni cierra.
- Backend gobierna estados.
- Todo queda en bitácora.
- Se aplican guardrails contra duplicados, reintentos y consumo innecesario.
- La web/PWA es la capa formal de revisión y control.

## 3. Actores

### Responsable operativo

Usuario enrolado que ejecuta el compromiso y envía evidencia.

Ejemplo: Panchito.

### Coordinador / validador

Usuario autorizado que revisa evidencia y decide si aprueba, pide corrección o rechaza.

Ejemplo: Luisito.

### Gamora Bot

Canal formal que recibe evidencia, pide aclaración cuando haga falta, notifica al revisor y comunica el resultado.

### Web/PWA

Capa formal donde el coordinador o validador revisa evidencias, consulta bitácora y registra decisiones.

### Backend / Gamora Core

Núcleo funcional que valida usuarios, compromisos, permisos, estados, asociación de evidencia y bitácora.

### IA auxiliar, si aplica

Capacidad auxiliar que puede ayudar a interpretar texto, audio o contexto, pero no aprueba ni cierra.

### Guardrails

Capa funcional que evita duplicados, loops, reintentos infinitos, acciones no autorizadas y consumo innecesario.

## 4. Precondiciones

- Empresa creada.
- Responsable enrolado.
- Compromiso creado.
- Compromiso aceptado/en proceso.
- Evidencia esperada definida, si aplica.
- Coordinador/validador autorizado.
- Canal WhatsApp activo, salvo flujo por web/PWA.
- Guardrails operando en estado normal o dentro de límites permitidos.

## 5. Flujo A — Envío de evidencia desde WhatsApp

### Ejemplo

Panchito manda foto de los sacos de cemento contados.

### Pasos

1. Panchito envía foto, audio, PDF o archivo al WhatsApp de Gamora.
2. Gamora identifica a Panchito como usuario enrolado.
3. Backend busca compromiso activo relacionado.
4. Si hay un solo compromiso claro, Gamora asocia evidencia.
5. Si hay varios compromisos posibles, Gamora pregunta a cuál corresponde.
6. Si no hay compromiso claro, Gamora solicita aclaración o bloquea asociación.
7. Evidencia queda en estado Recibida / Asociada.
8. Compromiso pasa a Evidencia recibida.
9. Gamora registra bitácora.
10. Gamora notifica a Luisito/coordinador/validador que hay evidencia pendiente de revisión.

### Resultado esperado

La evidencia no queda perdida en WhatsApp. Queda vinculada a un compromiso específico, visible para revisión y registrada en bitácora.

## 6. Flujo B — Evidencia ambigua o sin compromiso claro

### Ejemplo

Panchito manda una foto sin texto.

### Pasos

1. Gamora recibe evidencia.
2. Backend identifica que Panchito tiene varios compromisos activos o ninguno claro.
3. Gamora pregunta:
   - ¿Esta evidencia corresponde a conteo de cemento?
   - ¿A corte de caja?
   - ¿A otro compromiso?
4. Panchito responde.
5. Gamora asocia evidencia.
6. Si no se puede aclarar, evidencia queda pendiente de asociación o se descarta según regla futura.

### Reglas

- No cerrar compromiso con evidencia sin asociación.
- No mezclar evidencias entre compromisos.
- Fallback a menú guiado si hay ambigüedad repetida.
- La evidencia pendiente de asociación no debe habilitar aprobación ni cierre.

## 7. Flujo C — Revisión desde web/PWA

### Pasos

1. Luisito recibe notificación.
2. Luisito entra a web/PWA.
3. Ve lista de evidencias pendientes de revisión.
4. Abre compromiso.
5. Revisa evidencia, descripción, fecha, responsable y bitácora.
6. Decide:
   - aprobar;
   - aprobar con observación;
   - pedir corrección;
   - rechazar.
7. Gamora registra decisión.
8. Gamora notifica resultado a Panchito.

### Regla

La revisión debe ocurrir con permisos adecuados. Si el usuario no tiene rol para revisar o ver evidencia sensible, Gamora debe bloquear la acción.

## 8. Flujo D — Aprobación y cierre

### Pasos

1. Luisito aprueba evidencia.
2. Gamora cambia validación a Aprobada.
3. Para compromiso simple, Gamora puede cerrar/liberar en la misma acción si así está configurado.
4. Gamora registra cierre.
5. Gamora notifica a Panchito que el compromiso quedó aprobado/cerrado.
6. Compromiso queda Cerrado / liberado.
7. Bitácora conserva evidencia y validación.

### Regla

Aprobado y Cerrado pueden ser pasos separados en flujos más formales, pero en compromisos simples pueden ocurrir como acción compuesta autorizada.

IA no aprueba, no cierra y no libera compromisos.

## 9. Flujo E — Corrección solicitada

### Pasos

1. Luisito pide corrección.
2. Debe registrar motivo.
3. Gamora cambia estado a Corrección solicitada.
4. Gamora notifica a Panchito.
5. Panchito envía nueva evidencia o ajuste.
6. Nueva evidencia queda asociada al mismo compromiso.
7. Flujo vuelve a Evidencia recibida / En revisión.

### Regla

La corrección debe conservar la evidencia anterior, la nueva evidencia y el motivo de corrección en bitácora.

## 10. Flujo F — Rechazo

### Pasos

1. Luisito rechaza evidencia.
2. Debe registrar motivo.
3. Gamora cambia estado a Rechazado.
4. Gamora notifica a Panchito.
5. Según regla futura, puede:
   - permitir nueva evidencia;
   - crear nuevo compromiso;
   - cerrar como no cumplido;
   - escalar a coordinador.

### Regla

Rechazo no debe borrar evidencia ni bitácora.

El rechazo debe diferenciarse de corrección solicitada. Rechazar implica que la evidencia no cumple; corregir implica que puede ajustarse y reenviarse dentro del mismo compromiso.

## 11. Flujo G — Evidencia recibida después de vencimiento

### Pasos

1. El compromiso está vencido.
2. Panchito envía evidencia.
3. Gamora acepta evidencia, pero conserva marca de vencido.
4. Luisito revisa.
5. Si aprueba, se cierra con registro de entrega tardía.
6. Si pide corrección, mantiene trazabilidad.

### Regla

Vencido no significa que no pueda recibir evidencia; significa que debe quedar registro de incumplimiento de fecha.

La aprobación posterior al vencimiento no borra el hecho de que la entrega fue tardía.

## 12. Flujo H — Evidencia sensible

### Pasos

1. Evidencia puede contener datos financieros, rostros, ubicaciones, documentos o información sensible por contexto.
2. Gamora permite marcar evidencia como sensible.
3. Solo roles autorizados pueden verla.
4. Accesos quedan en bitácora.

### Ejemplo

Rosita sube corte de caja.

### Regla

La evidencia sensible debe protegerse por permisos. No debe estar visible para todo usuario del espacio de trabajo.

## 13. Estados usados en el flujo

| Momento | Estado del compromiso | Estado de evidencia | Estado de validación | Estado notificación | Estado guardrail |
|---|---|---|---|---|---|
| Responsable ejecuta | Aceptado/en proceso | Sin evidencia | Sin revisión | No aplica | Normal |
| Evidencia llega | Evidencia recibida | Recibida | Pendiente de revisión | Programado | Normal |
| Evidencia se vincula | Evidencia recibida | Asociada | Pendiente de revisión | Programado | Normal |
| Evidencia sensible | Evidencia recibida | Sensible | Pendiente de revisión | Programado | Normal |
| Revisor notificado | En revisión | Asociada | Pendiente de revisión | Notificación enviada | Normal |
| Revisor abre evidencia | En revisión | En revisión | En revisión | Enviado | Normal |
| Revisor aprueba | Aprobado | Aprobada | Aprobada | Programado | Normal |
| Cierre simple | Cerrado/liberado | Aprobada | Liberada | Notificación enviada | Normal |
| Corrección | Corrección solicitada | Corrección solicitada | Corrección solicitada | Notificación enviada | Normal |
| Rechazo | Rechazado | Rechazada | Rechazada | Notificación enviada | Normal |
| Evento duplicado | Sin cambio | Sin cambio | Sin cambio | Bloqueado por guardrail | Bloqueado por guardrail |

## 14. Bitácora requerida

El flujo debe registrar los siguientes eventos cuando apliquen:

- Evidencia recibida.
- Evidencia asociada.
- Evidencia marcada sensible.
- Notificación al revisor.
- Evidencia abierta/revisada.
- Aprobación.
- Aprobación con observación.
- Corrección solicitada con motivo.
- Rechazo con motivo.
- Nueva evidencia recibida.
- Cierre/liberación.
- Acceso a evidencia sensible.
- Guardrail activado.
- Evidencia duplicada detectada.
- Entrega tardía registrada.

## 15. Guardrails aplicables

- Prevención de evidencia duplicada.
- Límite de archivos por compromiso.
- Límite de tamaño o cantidad de evidencias como regla funcional futura.
- No reintentos infinitos de notificación.
- No enviar archivos completos a IA salvo necesidad justificada.
- Bloqueo de revisión si usuario no tiene permisos.
- Bloqueo de cierre si evidencia no está asociada.
- Registro de consumo WhatsApp/IA.
- Pausa si hay comportamiento anómalo.
- Bloqueo de notificaciones si el usuario tiene opt-out.
- Prevención de cierre si la validación está pendiente.

## 16. Notificaciones

### Notificación al coordinador/validador

Se envía cuando la evidencia queda pendiente de revisión.

### Notificación al responsable por aprobación

Se envía cuando la evidencia es aprobada o el compromiso queda cerrado/liberado.

### Notificación al responsable por corrección

Se envía cuando el revisor solicita corrección, incluyendo el motivo.

### Notificación al responsable por rechazo

Se envía cuando la evidencia es rechazada, incluyendo el motivo.

### Notificación agrupada

Si hay muchas evidencias o decisiones pendientes, Gamora puede agruparlas para reducir ruido y costo.

### Bloqueo de notificaciones

No se envían notificaciones si opt-out, WhatsApp desactivado o guardrail aplica.

## 17. Salidas posibles del flujo

- Evidencia aprobada y compromiso cerrado.
- Evidencia aprobada, pendiente de cierre formal.
- Corrección solicitada.
- Evidencia rechazada.
- Evidencia pendiente de asociación.
- Evidencia sensible restringida.
- Flujo bloqueado por guardrail.
- Entrega tardía registrada.
- Evidencia duplicada ignorada o bloqueada.

## 18. Criterios de aceptación funcional

- Responsable puede enviar evidencia por WhatsApp.
- Gamora asocia evidencia al compromiso correcto.
- Si hay ambigüedad, Gamora pregunta.
- Coordinador/validador recibe notificación.
- Evidencia se puede revisar en web/PWA.
- Revisor puede aprobar, pedir corrección o rechazar.
- Se notifica resultado al responsable.
- Cierre queda en bitácora.
- Evidencia sensible respeta permisos.
- Guardrails bloquean duplicados, loops o acciones no autorizadas.
- Evidencia recibida no cierra automáticamente.
- Evidencia vencida puede recibirse, pero queda marca de entrega tardía si aplica.
- IA no aprueba ni cierra compromisos.

## 19. Cierre del flujo

Este flujo demuestra la diferencia entre WhatsApp informal y Gamora Bot: no basta con mandar una foto; la evidencia debe quedar asociada, revisada, validada y trazada.

Gamora convierte la evidencia en parte del ciclo formal del compromiso operativo, con permisos, notificaciones, decisión humana, bitácora y guardrails para evitar duplicados, consumo innecesario o cierres no autorizados.
