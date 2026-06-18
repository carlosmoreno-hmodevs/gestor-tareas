# Restricciones Meta / WhatsApp Business — Gamora Bot

## Versión

v0.1

## Estatus

Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento identifica restricciones relevantes de Meta/WhatsApp Business y las traduce en reglas funcionales para Gamora Bot.

La intención es que el diseño del MVP respete desde el inicio principios de consentimiento, opt-in, opt-out, mensajes esperados, seguridad, costos y uso autorizado del canal.

Fuentes oficiales base:

- WhatsApp Business Terms of Service: `https://www.whatsapp.com/legal/business-terms`
- Meta for Developers — Get opt-in for WhatsApp: `https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in`
- WhatsApp Business Platform Pricing: `https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing`
- Meta for Developers — Send messages: `https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages`
- Meta for Developers — Template messages: `https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview`

## 2. Advertencia de alcance

Este documento no es asesoría legal definitiva.

Es un análisis funcional-regulatorio para diseño del MVP de Gamora Bot.

Deberá validarse posteriormente con asesor legal, BSP oficial, Meta Tech Provider o especialista en WhatsApp Business Platform si el producto avanza a comercialización.

## 3. Principio rector para Gamora

Gamora Bot no debe diseñarse ni comunicarse como “WhatsApp interno para empleados”.

Debe diseñarse como motor de compromisos operativos para usuarios autorizados, con WhatsApp Business como canal operativo principal y web/PWA como capa formal de control.

Esto implica que WhatsApp no será un canal libre para comunicación interna general, sino el punto operativo para compromisos específicos, esperados, consentidos y trazables.

## 4. Restricción 1 — Uso intra-company

**Restricción oficial:** WhatsApp Business Terms indica que los Business Services no están destinados para uso intra-company.

**Interpretación funcional para Gamora:** Esto no significa que Gamora no pueda operar con usuarios internos, pero sí impide posicionarlo como herramienta de comunicación interna entre empleados.

Gamora debe evitar narrativas como:

- “Controla a tus empleados por WhatsApp”.
- “WhatsApp interno para tu empresa”.
- “Supervisa todo lo que habla tu equipo”.

El posicionamiento correcto debe ser compromisos operativos con usuarios autorizados. Esos usuarios pueden incluir internos, externos, proveedores, contratistas, sucursales, responsables de campo o clientes, siempre bajo consentimiento y contexto operativo específico.

**Decisión de diseño recomendada:** Gamora debe ser un canal formal de compromisos operativos, no una intranet ni un chat interno.

**Regla funcional MVP:** Todo usuario debe estar registrado, autorizado y enrolado antes de recibir compromisos por WhatsApp.

## 5. Restricción 2 — Consentimiento, opt-in y permisos

**Restricción oficial:** WhatsApp Business Terms establece que la empresa debe asegurar los derechos, consentimientos y permisos necesarios, incluyendo opt-in, para comunicarse con usuarios vía WhatsApp.

**Interpretación funcional para Gamora:** La invitación no equivale a enrolamiento. Registrar a una persona en la web/PWA no debe activar automáticamente mensajes por WhatsApp.

El enrolamiento ocurre cuando el usuario acepta participar desde su propio WhatsApp o mediante un flujo equivalente que deje evidencia clara del consentimiento.

Gamora debe registrar evidencia del consentimiento porque el opt-in es parte central del modelo, no una pantalla administrativa secundaria.

**Reglas funcionales MVP:**

- No enviar compromisos a usuarios sin opt-in.
- Registrar fecha, hora, número, empresa, versión de aviso y texto aceptado.
- Permitir revocar consentimiento.
- Diferenciar estado “invitado” de estado “activo / enrolado”.
- Bloquear mensajes operativos a usuarios pendientes de aceptación.

## 6. Restricción 3 — Opt-out / baja

**Restricción oficial:** WhatsApp Business Terms indica que la empresa debe respetar solicitudes de stop u opt-out de usuarios.

**Interpretación funcional para Gamora:** El usuario debe poder escribir BAJA, STOP o equivalente. Gamora debe reconocer esa intención y desactivar el canal WhatsApp para ese usuario.

La baja de WhatsApp no necesariamente elimina a la persona del espacio de trabajo. Puede seguir existiendo en web/PWA si la empresa lo requiere y si el marco legal/operativo lo permite.

**Reglas funcionales MVP:**

- Usuario con WhatsApp desactivado no recibe compromisos por WhatsApp.
- Puede seguir existiendo en web/PWA si la empresa lo requiere.
- Administrador debe ver estado “WhatsApp desactivado”.
- Gamora debe registrar fecha, hora y texto de baja.
- Gamora debe confirmar la baja al usuario cuando sea posible.

## 7. Restricción 4 — Mensajes esperados y no spam

**Restricción oficial:** WhatsApp Business Terms indica que usuarios pueden bloquear, marcar spam o reportar mensajes. WhatsApp puede tomar acciones ante incumplimientos, incluyendo limitar, suspender o terminar el servicio.

**Interpretación funcional para Gamora:** Los mensajes de Gamora deben ser útiles, esperados y ligados a compromisos específicos.

Gamora debe evitar saturar usuarios con recordatorios, mensajes genéricos o comunicaciones no relacionadas con un compromiso operativo concreto.

**Reglas funcionales MVP:**

- Notificaciones con límite.
- Recordatorios configurables.
- Resúmenes agrupados cuando sea posible.
- No usar Gamora para comunicación general.
- No enviar mensajes promocionales desde el canal operativo.
- Permitir configuración de frecuencia por empresa o tipo de usuario.

## 8. Restricción 5 — Plantillas y ventanas de conversación

**Restricción oficial:** La documentación de WhatsApp Business Platform diferencia entre mensajes iniciados por usuario dentro de una ventana de conversación y mensajes iniciados por la empresa mediante plantillas.

**Interpretación funcional para Gamora:** Onboarding y activación deben procurar que el usuario inicie conversación. Esto reduce fricción, refuerza consentimiento y abre una interacción esperada.

Recordatorios, invitaciones, compromisos y resúmenes fuera de una ventana activa pueden requerir plantillas aprobadas.

Este documento no desarrolla el detalle técnico de ventanas, categorías o APIs. Solo deja identificado que afecta el diseño funcional.

**Reglas funcionales MVP:**

- Diseñar templates para invitaciones, compromisos, recordatorios y resúmenes.
- Evitar depender solo de mensajes libres.
- Considerar costos por mensajes según categoría.
- Redactar plantillas con lenguaje operativo, no promocional.
- Validar templates con BSP o consola oficial antes de producción.

## 9. Restricción 6 — Costos de mensajería

**Restricción oficial:** WhatsApp Business Platform tiene un esquema de cobro por mensajes/categorías según reglas vigentes y documentación oficial de pricing.

**Interpretación funcional para Gamora:** Trial gratuito para el usuario no significa costo cero para Gamora.

Cada recordatorio, invitación, resumen o notificación puede tener impacto de costo según categoría, país, ventana de conversación y reglas vigentes.

**Reglas funcionales MVP:**

- Límite de usuarios trial.
- Límite de compromisos.
- Límite de recordatorios.
- Límite de evidencias.
- Agrupación de notificaciones.
- Medición de costo por cliente.
- Reporte interno de consumo por empresa.

## 10. Restricción 7 — Seguridad y acceso autorizado

**Restricción oficial:** WhatsApp Business Terms establece que la empresa debe proteger credenciales, prevenir uso no autorizado y permitir acceso solo a individuos autorizados para fines permitidos.

**Interpretación funcional para Gamora:** No todos los usuarios deben poder configurar, invitar, aprobar o cerrar.

La web/PWA debe tener roles y permisos para evitar que acciones críticas queden disponibles para usuarios sin autorización.

**Reglas funcionales MVP:**

- Administrador.
- Coordinador.
- Responsable operativo.
- Supervisor/validador.
- Usuario solo evidencia.
- Bitácora de acciones críticas.
- Control de acceso a evidencias sensibles.
- Separación entre quien reporta y quien valida.

## 11. Matriz de restricciones y reglas Gamora

| Restricción Meta / WhatsApp | Riesgo para Gamora | Decisión funcional | Regla MVP | Prioridad |
| --- | --- | --- | --- | --- |
| Uso intra-company | Ser percibido como WhatsApp interno para empleados. | Posicionar como motor de compromisos operativos. | No usar narrativa de comunicación interna general. | Alta |
| Opt-in | Mensajes no consentidos o inesperados. | Enrolamiento obligatorio. | No enviar compromisos sin opt-in registrado. | Alta |
| Opt-out | Usuarios bloquean/reportan o se incumple baja. | Baja reconocida por WhatsApp. | BAJA/STOP desactiva canal WhatsApp. | Alta |
| Spam/reportes | Riesgo de bloqueo, reportes, limitación o suspensión. | Mensajes útiles y esperados. | Recordatorios limitados y configurables. | Alta |
| Plantillas | Mensajes fuera de ventana rechazados o mal clasificados. | Diseñar templates operativos. | Templates para invitaciones, compromisos, recordatorios y resúmenes. | Alta |
| Costos | Trial o uso intensivo no rentable. | Control de consumo. | Límites de usuarios, compromisos, recordatorios y evidencias. | Media |
| Seguridad | Acciones críticas por usuarios no autorizados. | Roles y permisos. | Administrador, coordinador, responsable y supervisor. | Alta |
| Privacidad | Evidencias o datos visibles a quien no corresponde. | Acceso autorizado y bitácora. | Control de permisos sobre evidencias y reportes. | Alta |
| Mensajes a usuarios no enrolados | Percepción de vigilancia y violación de consentimiento. | Diferenciar invitación y enrolamiento. | Invitado no recibe compromisos hasta aceptar. | Alta |

## 12. Lenguaje comercial permitido vs lenguaje riesgoso

| Lenguaje riesgoso | Lenguaje recomendado |
| --- | --- |
| WhatsApp interno para empleados. | Compromisos operativos trazables. |
| Controla a tus empleados por WhatsApp. | Usuarios autorizados. |
| Supervisa todo lo que habla tu equipo. | WhatsApp para operar, web/PWA para controlar. |
| Convierte todos tus chats en tareas. | Sin leer chats personales. |
| Automatiza seguimiento sin intervención humana. | Evidencia, validación y bitácora. |
| Vigila pendientes en todos los grupos. | Máxima visibilidad operativa con mínima fricción. |

## 13. Reglas no negociables para el MVP

- No leer chats personales.
- No mensajes sorpresa.
- No compromisos por WhatsApp sin enrolamiento.
- No posicionar como WhatsApp interno.
- No cierre automático por IA.
- No aprobación automática de evidencia.
- Registrar opt-in y opt-out.
- Mantener bitácora.
- Permitir operación web/PWA cuando WhatsApp esté desactivado.
- Separar invitación de enrolamiento.
- Separar avance reportado de avance validado.

## 14. Preguntas pendientes para BSP / asesor legal

- ¿Puede un SaaS como Gamora operar usuarios internos si hay opt-in individual?
- ¿Cuál es la interpretación práctica de “not intended for intra-company usage”?
- ¿Cada cliente debe tener su propia WABA o Gamora puede operar con número central?
- ¿Qué templates serían aceptables para compromisos y recordatorios?
- ¿Qué límites aplican a recordatorios operativos?
- ¿Cómo manejar opt-out por usuario y por empresa?
- ¿Qué categoría de mensajes aplica: utility, service, marketing u otra?
- ¿Qué prácticas reducen riesgo de suspensión?
- ¿Qué implicaciones hay para evidencias, fotos y documentos?
- ¿Qué responsabilidades corresponden a Gamora, al cliente y al BSP?

## 15. Cierre del documento

Estas restricciones no matan Gamora Bot, pero obligan a diseñarlo con mayor precisión.

El cumplimiento, enrolamiento y control de mensajes deben ser ventajas de diseño, no fricción innecesaria. Gamora puede operar con baja fricción si limita su promesa: no leer chats personales, no actuar como WhatsApp interno, no enviar mensajes sorpresa y no permitir acciones críticas sin autorización.

La oportunidad sigue siendo clara: usar WhatsApp Business como puerta operativa para compromisos específicos y web/PWA como capa formal de control, con usuarios autorizados, evidencia, validación, bitácora y reglas de negocio bien definidas.
