# Flujo MVP+ — Sunworks: Hitos y Avances Parciales

## Versión
v0.2

## Estatus
Borrador alineado con arquitectura funcional v0.2 para validación de Luis Felipe García Duarte

## 1. Objetivo del flujo

Este flujo prueba si Gamora Bot puede soportar proyectos operativos por hitos, avances parciales, evidencias iterativas y validación supervisora sin romper la premisa de baja fricción.

Sunworks es un caso MVP+ / estrés funcional controlado. No es gestión total de proyectos, no reemplaza un software de project management y no pretende cubrir toda la complejidad de construcción, instalación o ingeniería.

Su propósito es validar que Gamora Core puede manejar compromisos más complejos que una tarea simple: proyectos, hitos, reportes parciales, evidencias, avance reportado, avance validado, correcciones y cierres supervisados.

## 2. Contexto operativo Sunworks

Sunworks se toma como ejemplo de empresa de proyectos fotovoltaicos y almacenamiento de energía.

Su operación puede incluir:

- Supervisión de cuadrillas en campo.
- Reportes por WhatsApp con fotos, audios y avances.
- Checklist de hitos H1-H7.
- Evidencias iterativas por etapa.
- Validación supervisora.
- Necesidad de distinguir avance reportado vs avance validado.

El reto funcional es permitir que el jefe de cuadrilla reporte de forma natural desde WhatsApp, mientras Gamora estructura internamente el avance por proyecto, hito, evidencia, revisión y validación.

## 3. Actores

### Sofía

Coordinadora de proyectos. Crea proyectos, asigna checklist, consulta avance general y da seguimiento operativo.

### Mario

Supervisor / validador. Revisa reportes parciales, valida porcentajes, solicita correcciones, rechaza evidencia o cierra hitos.

### Raúl

Jefe de cuadrilla. Reporta avances desde campo, envía evidencias y responde observaciones.

### Cuadrilla

Ejecutores en campo. Pueden participar indirectamente enviando información a través de Raúl o bajo reglas futuras de usuarios autorizados.

### Gamora Bot

Canal operativo por WhatsApp que recibe reportes, solicita aclaraciones, notifica y mantiene continuidad del flujo.

### Web/PWA

Capa formal para configurar proyectos, revisar evidencias, validar avances, consultar bitácora y ver tablero por hitos.

### IA auxiliar

Interpreta lenguaje natural, audios, alias, proyecto probable, hito probable, porcentaje reportado y evidencia esperada.

### Backend / Gamora Core

Valida usuarios, permisos, enrolamiento, proyecto, hitos, estados, evidencias, avance validado y reglas de negocio.

### Guardrails

Evitan loops, duplicados, reintentos infinitos, consumo excesivo, actualizaciones no autorizadas y acciones críticas sin validación humana.

## 4. Estructura funcional del proyecto

La estructura funcional será:

Proyecto → Checklist → Hito → Reporte parcial → Evidencia → Revisión → Avance validado → Cierre de hito.

El proyecto agrupa hitos. El hito agrupa reportes parciales. El reporte parcial contiene avance reportado y evidencia. El avance validado solo cambia por acción de un supervisor autorizado.

Gamora debe permitir que el usuario operativo reporte con lenguaje natural, mientras Gamora Core conserva la estructura formal del avance.

## 5. Checklist base H1-H7

- H1 Levantamiento inicial y condiciones del sitio.
- H2 Preparación de soportes, bases y herrería.
- H3 Montaje de estructura.
- H4 Instalación de paneles.
- H5 Cableado, canalización y protecciones.
- H6 Inversores, baterías y almacenamiento.
- H7 Pruebas, puesta en marcha y cierre documental.

### Regla

Las claves H1-H7 son internas. Raúl no debe memorizar claves; puede usar lenguaje natural como “bases”, “herrería”, “paneles”, “cableado” o “inversor”.

## 6. Flujo A — Alta de proyecto y asignación

1. Sofía crea proyecto en web/PWA.
2. Selecciona checklist H1-H7.
3. Asigna supervisor Mario.
4. Asigna jefe de cuadrilla Raúl.
5. Verifica que Mario y Raúl estén enrolados.
6. Gamora activa proyecto.
7. Gamora notifica a Raúl el proyecto asignado si corresponde.

### Regla

No notificar usuarios no enrolados.

Si Mario o Raúl no están enrolados, Gamora debe bloquear notificaciones WhatsApp y pedir completar enrolamiento antes de operar por ese canal.

## 7. Flujo B — Reporte parcial en lenguaje natural

### Ejemplo

“Gamora, avance de Los Olivos. Ya terminamos bases del lado norte, vamos como 25%, mando fotos.”

### Pasos

1. Raúl escribe o manda audio al WhatsApp de Gamora.
2. IA interpreta proyecto, hito probable, porcentaje y evidencia esperada.
3. Backend valida usuario, proyecto, hito y permisos.
4. Si hay confianza suficiente, Gamora muestra resumen.
5. Raúl confirma o envía evidencia.
6. Evidencia queda asociada al reporte parcial.
7. Reporte parcial queda pendiente de validación.
8. Gamora notifica a Mario.

### Regla

IA propone, backend valida, supervisor aprueba.

El porcentaje enviado por Raúl es avance reportado. No se convierte en avance oficial hasta que Mario lo valide.

## 8. Flujo C — Reporte sin claves técnicas

Raúl puede decir “bases”, “paneles”, “inversor”, “cableado” o cualquier nombre natural relacionado con la etapa.

Gamora debe usar:

- Alias.
- Contexto activo.
- Proyecto en curso.
- Historial reciente.
- Selección guiada cuando haya ambigüedad.

Si hay más de un proyecto activo, Gamora pregunta a cuál corresponde. Si hay ambigüedad de hito, ofrece menú guiado.

### Ejemplo de menú

“¿Te refieres a:

1. Bases y herrería
2. Montaje de estructura
3. Instalación de paneles?”

### Regla

Gamora no debe exigir claves como “SW-LO-001” ni “H2” al usuario operativo.

Las claves técnicas pueden existir internamente para trazabilidad, pero no deben ser carga de captura para Raúl.

## 9. Flujo D — Evidencia ambigua o mezclada

### Ejemplo

Raúl manda 8 fotos sin texto o fotos mezcladas de H2 y H4.

### Pasos

1. Gamora recibe evidencias.
2. Backend detecta que no puede asociarlas con certeza.
3. Gamora pregunta a qué hito corresponden.
4. Raúl responde.
5. Gamora asocia evidencias.
6. Si no se aclara, quedan pendientes de asociación y no actualizan avance.

### Regla

No evidencia sin asociación para validar avance.

Si la evidencia está mezclada, Gamora debe pedir separación o aclaración antes de crear reportes parciales definitivos.

## 10. Flujo E — Validación del supervisor

### Pasos

1. Mario recibe notificación de reporte parcial pendiente.
2. Entra a web/PWA.
3. Revisa proyecto, hito, porcentaje reportado, evidencias y bitácora.
4. Decide:
   - aprobar porcentaje reportado;
   - aprobar con ajuste;
   - pedir corrección;
   - rechazar.
5. Gamora actualiza avance validado solo si Mario aprueba.
6. Gamora notifica a Raúl el resultado.

### Ejemplo

Raúl reporta 60%, Mario valida 50%.

### Regla

Avance oficial = avance validado, no avance reportado.

IA no aprueba, no ajusta porcentaje oficial y no cierra hitos.

## 11. Flujo F — Hitos en paralelo

### Ejemplo

“En Los Olivos bases 60%, paneles 10% y ya llegó el inversor.”

### Pasos

1. IA detecta múltiples avances.
2. Backend separa posibles reportes parciales.
3. Gamora confirma cada hito.
4. Si falta porcentaje en uno, pregunta.
5. Si evidencias están mezcladas, pide separación.
6. Crea reportes parciales separados.
7. Mario valida cada hito por separado.

### Regla

No mezclar avances entre hitos.

Un mensaje puede contener varios avances, pero Gamora debe separarlos antes de registrarlos como reportes parciales.

## 12. Flujo G — Corrección solicitada

1. Mario solicita corrección.
2. Debe registrar motivo.
3. Gamora notifica a Raúl.
4. Raúl sube nueva evidencia o aclara.
5. Reporte vuelve a pendiente de validación.

### Regla

La corrección debe conservar el reporte original, motivo, evidencia previa y nueva evidencia en bitácora.

## 13. Flujo H — Cierre de hito

1. Hito acumula avance validado.
2. Cuando llega a 100% validado, Mario puede cerrar hito.
3. Gamora registra cierre.
4. Raúl y Sofía reciben notificación.
5. Hito queda Cerrado.

### Regla

Hito no llega a 100% por reporte de campo sin validación.

El cierre requiere rol autorizado y queda registrado en bitácora.

## 14. Flujo I — Reporte del proyecto

### Ejemplos

- “Gamora, ¿cómo va Los Olivos?”
- “¿Qué hitos están pendientes de validación?”
- “¿Qué reportó Raúl hoy?”

### Respuesta debe distinguir

- Avance reportado.
- Avance validado.
- Evidencias pendientes.
- Hitos observados.
- Hitos cerrados.
- Próximos pasos.

### Regla

Los reportes largos deben dirigirse a web/PWA. WhatsApp debe entregar resumen breve, no tablero completo.

## 15. Estados usados en el flujo

| Objeto | Estado inicial | Estado intermedio | Estado final posible | Observación |
|---|---|---|---|---|
| Proyecto | No iniciado | En proceso, En revisión, Con observaciones | Completado, Cerrado, Suspendido, Cancelado | Agrupa hitos y reportes. |
| Hito | No iniciado | En proceso, Reporte parcial recibido, En revisión, Observado / corrección solicitada | Validado parcialmente, Validado 100%, Cerrado | No cierra sin supervisor. |
| Reporte parcial | Recibido | Pendiente de asociación, Asociado a hito, Pendiente de validación | Aprobado, Aprobado con ajuste, Corrección solicitada, Rechazado, Integrado al avance validado | Contiene avance reportado. |
| Evidencia | Recibida | Pendiente de asociación, Asociada, En revisión | Aprobada, Rechazada, Archivada | Debe vincularse al reporte correcto. |
| Validación | Sin revisión | Pendiente de revisión, En revisión | Aprobada, Aprobada con observación, Rechazada, Liberada | Cambia avance validado. |
| Notificación | Programado | Enviado, Reintentando, Agrupado en resumen | Entregado, Fallido, Reintentos agotados, Bloqueado por guardrail | Sin reintentos infinitos. |
| Guardrail | Normal | Cerca de límite, Límite alcanzado, Pausa automática por anomalía | Restablecido, Bloqueado por guardrail | Protege consumo y control. |

## 16. Bitácora requerida

El flujo debe registrar:

- Proyecto creado.
- Checklist asignado.
- Supervisor asignado.
- Jefe de cuadrilla asignado.
- Reporte parcial recibido.
- IA utilizada.
- Hito sugerido.
- Evidencia recibida.
- Evidencia asociada.
- Porcentaje reportado.
- Porcentaje aprobado.
- Ajuste de porcentaje.
- Corrección solicitada.
- Rechazo.
- Cierre de hito.
- Consulta de proyecto.
- Guardrail activado.
- Duplicado detectado, si aplica.
- Menú guiado ofrecido, si aplica.

## 17. Guardrails aplicables

- Límite de llamadas IA por conversación/proyecto.
- No análisis automático de fotos para calcular avance.
- No enviar evidencias completas a IA salvo necesidad justificada.
- Prevención de duplicados.
- No reintentos infinitos.
- Límite de evidencias por reporte como regla funcional futura.
- Fallback a menú guiado.
- Bloqueo si hay baja confianza.
- Pausa si hay comportamiento anómalo.
- No actualizar avance oficial sin validación humana.
- Registro de consumo WhatsApp/IA.
- Bloqueo de notificaciones a usuarios no enrolados.

## 18. Notificaciones clave

- Proyecto asignado.
- Reporte parcial recibido.
- Evidencia pendiente de validación.
- Corrección solicitada.
- Avance aprobado.
- Avance aprobado con ajuste.
- Hito validado 100%.
- Hito cerrado.
- Guardrail/límite alcanzado.
- Resumen diario del proyecto.
- Evidencia pendiente de asociación, si aplica.

## 19. Salidas posibles

- Reporte parcial pendiente de validación.
- Reporte aprobado.
- Reporte aprobado con ajuste.
- Corrección solicitada.
- Reporte rechazado.
- Evidencia pendiente de asociación.
- Hito validado parcialmente.
- Hito validado 100%.
- Hito cerrado.
- Proyecto con observaciones.
- Flujo bloqueado por guardrail.
- Menú guiado requerido por ambigüedad.

## 20. Criterios de aceptación funcional

- Raúl puede reportar avance sin memorizar claves.
- Gamora identifica proyecto/hito probable o pregunta.
- Evidencia queda asociada al reporte parcial correcto.
- Mario recibe notificación.
- Mario puede aprobar, ajustar, rechazar o pedir corrección.
- Avance reportado y avance validado quedan separados.
- Hitos paralelos se separan correctamente.
- Hito no cierra sin validación.
- Reportes largos se dirigen a web/PWA.
- Guardrails bloquean duplicados, loops y consumo excesivo.
- IA no calcula avance por imagen ni aprueba.
- Usuarios no enrolados no reciben notificaciones por WhatsApp.

## 21. Límites del flujo

- No es gestión total de proyectos.
- No calcula avance por visión computacional.
- No sustituye supervisor.
- No reemplaza software especializado de construcción.
- No automatiza decisiones técnicas.
- No valida calidad de instalación por foto.
- No pretende cubrir costos, presupuestos, compras, nómina, inventario ni planeación avanzada.

## 22. Cierre del flujo

Sunworks prueba la elasticidad de Gamora: puede partir de compromisos simples y crecer hacia escenarios por hitos y avances parciales sin perder control formal.

El caso confirma que Gamora puede mantener baja fricción para campo, mientras Gamora Core conserva estructura, estados, evidencias, bitácora, validación supervisora y guardrails. El usuario operativo reporta en lenguaje natural; el supervisor valida; el backend gobierna; la IA interpreta, pero no decide.
