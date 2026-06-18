# Riesgos Operativos y Legales — Gamora Bot

## Versión

v0.1

## Estatus

Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento identifica riesgos que pueden afectar el diseño, operación, adopción, cumplimiento y escalabilidad del MVP de Gamora Bot.

El objetivo es convertir riesgos en reglas funcionales de diseño para evitar que el MVP avance sobre supuestos frágiles, especialmente en WhatsApp Business, privacidad, IA, evidencias, adopción y control operativo.

## 2. Advertencia de alcance

Este documento no es asesoría legal definitiva.

Es un análisis funcional de riesgos para diseño del MVP.

Debe validarse con asesor legal, BSP oficial y especialistas técnicos antes de comercialización, pilotos amplios o uso con clientes reales.

## 3. Mapa general de riesgos

Los riesgos principales se agrupan en:

- Riesgos Meta / WhatsApp.
- Riesgos de privacidad y datos personales.
- Riesgos de adopción.
- Riesgos de percepción de vigilancia.
- Riesgos de IA.
- Riesgos de evidencias y archivos.
- Riesgos operativos.
- Riesgos comerciales.
- Riesgos de costos.
- Riesgos de seguridad.
- Riesgos de escalabilidad.
- Riesgos de posicionamiento competitivo.

## 4. Riesgo 1 — Uso intra-company mal interpretado

**Riesgo:** Gamora puede ser interpretado como una herramienta de comunicación interna entre empleados.

**Causa:** Posicionar o usar Gamora como WhatsApp interno para empleados, control de personal o supervisión general de conversaciones.

**Impacto:** Fricción con términos de Meta, percepción de vigilancia, rechazo de usuarios, riesgo de suspensión del canal o de mala interpretación comercial.

**Mitigación funcional:** Operar con usuarios autorizados, enrolamiento individual, lenguaje comercial correcto y web/PWA como capa formal de control.

**Regla MVP:** No compromisos por WhatsApp sin enrolamiento.

**Validación pendiente:** Confirmar con BSP/asesor legal cómo interpretar uso intra-company cuando hay opt-in individual y compromisos operativos específicos.

## 5. Riesgo 2 — Mensajes no esperados o percibidos como spam

**Riesgo:** Los usuarios pueden bloquear, reportar o rechazar mensajes de Gamora.

**Causa:** Recordatorios excesivos, mensajes a usuarios no enrolados, mensajes genéricos o comunicaciones no vinculadas a compromisos específicos.

**Impacto:** Bloqueos, reportes, baja adopción, degradación de confianza y posible afectación del canal WhatsApp.

**Mitigación funcional:** Límites de notificaciones, opt-out, mensajes ligados a compromisos, resúmenes agrupados y frecuencia configurable.

**Regla MVP:** Recordatorios configurables y opción BAJA.

**Validación pendiente:** Definir umbrales de notificación por rol, empresa y tipo de compromiso.

## 6. Riesgo 3 — Falta de opt-in o consentimiento documentado

**Riesgo:** Gamora envía mensajes operativos sin consentimiento suficiente.

**Causa:** Activar usuarios desde administración sin aceptación individual.

**Impacto:** Incumplimiento funcional, quejas, baja confianza, percepción de vigilancia y riesgo de reportes.

**Mitigación funcional:** Separar invitación de enrolamiento. El administrador puede invitar, pero no activar WhatsApp por otra persona.

**Regla MVP:** Registrar fecha, hora, número, empresa, versión de aviso y texto aceptado.

**Validación pendiente:** Validar formato de consentimiento y aviso con asesor legal.

## 7. Riesgo 4 — Privacidad de evidencias

**Riesgo:** Evidencias operativas contienen datos personales o información confidencial.

**Causa:** Fotos, audios, PDFs, cotizaciones, cortes de caja o reportes con datos personales, financieros, patrimoniales o de terceros.

**Impacto:** Exposición indebida, uso fuera de finalidad, reclamos de usuarios o clientes y pérdida de confianza.

**Mitigación funcional:** Permisos por rol, clasificación de evidencia sensible y bitácora de acceso.

**Regla MVP:** Evidencias asociadas al compromiso y visibles solo para autorizados.

**Validación pendiente:** Definir política de manejo de evidencias sensibles y datos de terceros no usuarios.

## 8. Riesgo 5 — Datos sensibles accidentales

**Riesgo:** Gamora recibe datos sensibles sin haber sido diseñado para tratarlos.

**Causa:** Usuarios suben documentos, rostros, biométricos, datos de salud, documentos oficiales o información delicada sin control.

**Impacto:** Mayor carga legal, mayor riesgo reputacional y necesidad de protocolos de manejo especiales.

**Mitigación funcional:** Advertencias, clasificación sensible, restricciones de acceso y no solicitar datos sensibles por defecto.

**Regla MVP:** No pedir datos sensibles y permitir marcar evidencia como sensible.

**Validación pendiente:** Definir protocolo de datos sensibles accidentales con asesor legal.

## 9. Riesgo 6 — IA interpreta mal instrucciones

**Riesgo:** La IA estructura incorrectamente un compromiso, avance o evidencia.

**Causa:** Lenguaje ambiguo, audios confusos, alias incorrectos, múltiples hitos en un mensaje o contexto incompleto.

**Impacto:** Compromiso mal creado, responsable incorrecto, fecha errónea, evidencia mal asociada o reporte parcial equivocado.

**Mitigación funcional:** Backend valida, confirmación humana, selección guiada y preguntas aclaratorias cuando exista ambigüedad.

**Regla MVP:** IA interpreta, backend gobierna, humano valida.

**Validación pendiente:** Definir umbrales de confianza y casos donde Gamora debe preguntar antes de registrar.

## 10. Riesgo 7 — IA toma decisiones críticas sin control

**Riesgo:** La IA crea efectos operativos sin autorización humana o sin validación determinística.

**Causa:** Automatizar creación, aprobación, cierre o escalamiento sin confirmación.

**Impacto:** Errores operativos, pérdida de confianza, responsabilidad difusa y conflictos entre usuarios.

**Mitigación funcional:** Bloqueo de decisiones críticas sin humano autorizado y backend con reglas explícitas.

**Regla MVP:** No cierre automático por IA ni aprobación automática de evidencia.

**Validación pendiente:** Definir lista formal de acciones críticas y roles autorizados.

## 11. Riesgo 8 — Confundir avance reportado con avance validado

**Riesgo:** Un avance informado por campo se toma como avance oficial.

**Causa:** En casos como Sunworks, el avance de Raúl puede registrarse como oficial sin revisión de Mario.

**Impacto:** Reportes inflados, decisiones incorrectas, cierre prematuro de hitos y pérdida de confianza del supervisor.

**Mitigación funcional:** Separar avance reportado y avance validado.

**Regla MVP:** Avance oficial solo cambia por supervisor/validador.

**Validación pendiente:** Definir estados exactos de hito y reporte parcial en arquitectura funcional.

## 12. Riesgo 9 — Exceso de complejidad en el MVP

**Riesgo:** El MVP intenta resolver demasiados escenarios desde el inicio.

**Causa:** Incluir proyectos complejos, IA avanzada, cálculos automáticos, dashboards sofisticados y reglas de negocio amplias antes de validar el flujo básico.

**Impacto:** Retraso, confusión, pérdida de foco, costos altos y dificultad para probar valor temprano.

**Mitigación funcional:** MVP centrado en compromisos, evidencia, validación, bitácora y flujo Sunworks como estrés funcional controlado.

**Regla MVP:** No prometer gestión total de proyectos.

**Validación pendiente:** Separar alcance MVP, MVP+ y casos de estrés funcional.

## 13. Riesgo 10 — Producto percibido como “otro task manager”

**Riesgo:** Gamora queda atrapado en una categoría ya competida.

**Causa:** Comunicar “gestor de tareas por WhatsApp” o “bot de tareas” como mensaje principal.

**Impacto:** Competencia frontal con Tasks.Bot, Any.do, Blueticks y otros; menor diferenciación y riesgo de parecer copia.

**Mitigación funcional:** Reforzar compromisos operativos trazables, evidencia, validación, bitácora y web/PWA de control.

**Regla MVP:** Evitar mensaje principal “task manager”.

**Validación pendiente:** Probar narrativa comercial con usuarios PyME.

## 14. Riesgo 11 — Costos de WhatsApp e IA

**Riesgo:** El uso operativo genera costos mayores a los esperados.

**Causa:** Trial sin límites, recordatorios excesivos, evidencias pesadas o uso intensivo de IA.

**Impacto:** CAC alto, margen negativo, uso no rentable o necesidad de restringir funciones después de lanzarlas.

**Mitigación funcional:** Límites por trial, agrupación de mensajes, medición de consumo y control de uso de IA.

**Regla MVP:** Costo por empresa debe medirse desde el inicio.

**Validación pendiente:** Modelar costos con precios vigentes de WhatsApp, nube, almacenamiento e IA.

## 15. Riesgo 12 — Dependencia excesiva de WhatsApp

**Riesgo:** Gamora depende demasiado de un canal controlado por Meta.

**Causa:** Diseñar todo el sistema como si WhatsApp fuera el producto completo.

**Impacto:** Vulnerabilidad ante cambios de política, costos, límites, suspensión o condiciones técnicas del canal.

**Mitigación funcional:** Gamora Core independiente y web/PWA como capa formal.

**Regla MVP:** WhatsApp es canal operativo, no único sistema completo.

**Validación pendiente:** Definir desde arquitectura cómo desacoplar canal, core y web/PWA.

## 16. Riesgo 13 — Seguridad y accesos indebidos

**Riesgo:** Usuarios sin permiso ven, modifican, aprueban o cierran información.

**Causa:** Roles débiles, evidencia visible para todos, cierre por usuarios no autorizados o falta de separación por empresa.

**Impacto:** Exposición de datos, errores de operación, pérdida de confianza y conflictos entre participantes.

**Mitigación funcional:** Roles, permisos, bitácora, separación por empresa y control de evidencias sensibles.

**Regla MVP:** Solo usuarios autorizados pueden ver, aprobar o cerrar según rol.

**Validación pendiente:** Definir matriz formal de permisos por rol.

## 17. Riesgo 14 — Baja de WhatsApp confundida con eliminación de datos

**Riesgo:** Una solicitud de baja del canal se interpreta incorrectamente como eliminación total de datos.

**Causa:** Usuario escribe BAJA y el sistema no distingue baja de canal, suspensión, cancelación, bloqueo y eliminación.

**Impacto:** Pérdida de trazabilidad, incumplimiento de derechos o eliminación indebida de bitácora.

**Mitigación funcional:** Distinguir estados y solicitudes.

**Regla MVP:** Estado “WhatsApp desactivado” separado de eliminación/cancelación.

**Validación pendiente:** Definir procedimiento ARCO, retención y cancelación con asesor legal.

## 18. Riesgo 15 — Uso de datos para entrenamiento de IA

**Riesgo:** Datos del cliente se reutilizan sin autorización.

**Causa:** Enviar o reutilizar mensajes, evidencias, audios o archivos del cliente para entrenamiento, ajuste o mejora de modelos sin control.

**Impacto:** Riesgo legal, reputacional y comercial.

**Mitigación funcional:** No entrenamiento sin autorización, minimización de datos y proveedor controlado.

**Regla MVP:** No usar datos del cliente para entrenar IA.

**Validación pendiente:** Revisar términos del proveedor de IA, DPA y configuración de retención.

## 19. Riesgo 16 — Falta de claridad contractual

**Riesgo:** Gamora opera sin definir responsabilidades legales y operativas.

**Causa:** No definir responsable/encargado, avisos, términos, DPAs, proveedores, retención y responsabilidades del cliente.

**Impacto:** Incertidumbre legal y comercial, fricción en ventas B2B y riesgo ante incidentes.

**Mitigación funcional:** Preparar documentos contractuales antes de comercialización.

**Regla MVP:** Identificar desde ahora temas pendientes para asesor legal.

**Validación pendiente:** Definir paquete legal mínimo para piloto y comercialización.

## 20. Matriz general de riesgos

| Riesgo | Probabilidad inicial | Impacto | Severidad | Mitigación principal | Regla MVP | Responsable |
| --- | --- | --- | --- | --- | --- | --- |
| Uso intra-company mal interpretado | Media | Alto | Alta | Enrolamiento, lenguaje correcto y usuarios autorizados | No compromisos sin enrolamiento | Producto / Legal |
| Mensajes no esperados o spam | Media | Alto | Alta | Límites, opt-out y mensajes ligados a compromisos | Recordatorios configurables y BAJA | Producto / Operación |
| Falta de opt-in documentado | Media | Alto | Alta | Separar invitación y enrolamiento | Registrar consentimiento completo | Producto / Legal |
| Privacidad de evidencias | Alta | Alto | Alta | Permisos, evidencia sensible y bitácora | Evidencia visible solo para autorizados | Producto / Seguridad |
| Datos sensibles accidentales | Media | Alto | Alta | Advertencias y clasificación sensible | No pedir datos sensibles | Producto / Legal |
| IA interpreta mal instrucciones | Alta | Medio | Alta | Confirmación, backend y selección guiada | IA interpreta, backend gobierna, humano valida | Producto / IA |
| IA toma decisiones críticas | Media | Alto | Alta | Bloqueo de decisiones sin humano | No cierre/aprobación automática por IA | Producto / IA |
| Avance reportado vs validado | Media | Alto | Alta | Separación de estados y validación supervisora | Avance oficial solo por supervisor | Producto |
| Exceso de complejidad MVP | Media | Medio | Media | Alcance controlado y estrés funcional separado | No prometer gestión total de proyectos | Producto |
| Percibido como task manager | Alta | Medio | Alta | Narrativa de compromisos operativos | Evitar mensaje principal task manager | Producto / Marketing |
| Costos WhatsApp e IA | Media | Alto | Alta | Límites y medición de consumo | Medir costo por empresa | Producto / Finanzas |
| Dependencia excesiva de WhatsApp | Media | Alto | Alta | Gamora Core independiente | WhatsApp es canal, no único sistema | Producto / Arquitectura |
| Seguridad y accesos indebidos | Media | Alto | Alta | Roles, permisos y bitácora | Acceso según rol | Producto / Seguridad |
| Baja confundida con eliminación | Media | Medio | Media | Estados separados y procedimiento ARCO | WhatsApp desactivado separado de eliminación | Producto / Legal |
| Entrenamiento IA sin autorización | Media | Alto | Alta | No entrenamiento y minimización | No entrenar con datos del cliente | Producto / Legal / IA |
| Falta de claridad contractual | Alta | Alto | Alta | Paquete legal antes de comercialización | Identificar pendientes legales | Legal / Dirección |

## 21. Riesgos no aceptables para MVP

- Enviar mensajes a no enrolados.
- Leer chats personales.
- Usar Gamora como WhatsApp interno.
- Cierre automático por IA.
- Evidencia visible sin permisos.
- No registrar opt-in.
- No permitir baja.
- No separar empresas.
- No distinguir avance reportado vs validado en escenarios complejos.
- Usar datos para entrenamiento sin autorización.
- Mezclar evidencias entre compromisos o hitos.
- Permitir aprobación por usuarios sin rol autorizado.

## 22. Riesgos aceptables con control

- Ambigüedad en lenguaje natural si hay confirmación.
- Trial gratuito con límites.
- Uso de WhatsApp como canal principal si existe web/PWA.
- Escenarios complejos si se documentan como MVP+ o estrés funcional.
- Competencia con task managers si el posicionamiento es claro.
- Evidencias con datos de terceros si hay permisos, finalidad y manejo adecuado.
- Recordatorios operativos si son configurables y esperados.

## 23. Preguntas pendientes para asesor legal / BSP / arquitectura

- ¿Qué riesgos son bloqueantes antes de piloto?
- ¿Puede operar Gamora con usuarios internos bajo opt-in individual?
- ¿Número central de Gamora o WABA por cliente?
- ¿Qué categoría de templates aplicar?
- ¿Cómo documentar consentimiento y baja?
- ¿Qué nivel de cifrado/seguridad mínimo requiere evidencia?
- ¿Qué retención aplicar a bitácora?
- ¿Qué proveedor de IA usar y bajo qué condiciones?
- ¿Qué debe incluir contrato con cliente?
- ¿Cómo manejar evidencias con datos de terceros?
- ¿Qué roles mínimos exige el MVP?
- ¿Qué riesgos deben bloquear lanzamiento comercial?

## 24. Cierre del documento

Estos riesgos no detienen Gamora, pero definen el perímetro seguro del MVP.

El producto debe crecer desde reglas no negociables y no desde atajos que comprometan confianza, privacidad o continuidad del canal. Gamora solo puede cumplir su promesa de compromisos operativos trazables si protege consentimiento, datos, evidencias, usuarios autorizados, bitácora y validación humana.

La estrategia correcta no es evitar todo riesgo, sino convertir los riesgos principales en reglas de diseño desde el inicio.
