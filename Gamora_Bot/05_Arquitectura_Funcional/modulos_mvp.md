# Módulos MVP — Gamora Bot

## Versión
v0.2

## Estatus
Borrador ampliado con AI & API Guardrails para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define los módulos funcionales mínimos que deben existir en el MVP de Gamora Bot.

No es un modelo técnico, no define base de datos, endpoints, APIs ni integración con WhatsApp Business. Tampoco es un backlog de desarrollo. Su propósito es aclarar qué capacidades funcionales debe tener el MVP para demostrar el valor central del producto.

El documento separa módulos indispensables, módulos de soporte, capacidades MVP+ y elementos fuera de alcance para evitar que el MVP crezca de forma desordenada o se convierta prematuramente en una plataforma pesada.

## 2. Criterio rector del MVP

El MVP debe demostrar el ciclo completo de un compromiso operativo:

Crear → asignar → aceptar → evidenciar → revisar → aprobar/rechazar → cerrar → consultar.

Ese ciclo debe ocurrir con:

- WhatsApp Business como canal operativo principal.
- Web/PWA como capa formal de control.
- Usuarios autorizados.
- Enrolamiento obligatorio antes de recibir compromisos.
- Evidencia asociada al compromiso.
- Bitácora de acciones críticas.
- IA auxiliar limitada para reducir fricción.
- Backend gobernando reglas, permisos, estados y validaciones.
- AI & API Guardrails protegiendo consumo, loops, reintentos, costos, duplicados y acciones críticas.
- Registro básico de consumo de APIs de pago.
- Límites funcionales de mensajes, llamadas IA, recordatorios y reintentos.
- Capacidad de pausa manual o apagado seguro de automatizaciones.

El objetivo no es construir un gestor de tareas tradicional. El objetivo es demostrar que Gamora puede convertir una instrucción operativa enviada por WhatsApp en un compromiso trazable, con responsable, fecha, evidencia, revisión y cierre.

## 3. Clasificación de módulos

### Módulos indispensables MVP

Son los módulos que deben existir para demostrar el valor funcional mínimo de Gamora Bot. Sin ellos, el producto no podría probar su tesis central.

Incluyen espacio de trabajo, usuarios, enrolamiento, canal WhatsApp, web/PWA, motor de compromisos, evidencias, validación, recordatorios, consultas, IA auxiliar, AI & API Guardrails y bitácora.

### Módulos de soporte MVP

No son el centro visible del producto, pero habilitan seguridad, cumplimiento, privacidad, control de costos y operación confiable.

Incluyen permisos, opt-in, opt-out, límites funcionales, registro de uso, trazabilidad, control básico de notificaciones, AI & API Guardrails, control básico de consumo, prevención básica de loops, prevención de duplicados, límites por usuario, empresa, conversación y periodo, y pausa manual de automatizaciones.

### Módulos MVP+ / estrés funcional

Son capacidades que deben considerarse conceptualmente desde el diseño, pero que pueden implementarse de forma acotada o diferirse parcialmente si el MVP inicial necesita reducir alcance.

Incluyen proyectos, hitos, reportes parciales, avance reportado, avance validado y escenarios tipo Sunworks.

### Fuera de alcance MVP

Son capacidades que no deben prometerse todavía porque aumentan complejidad, riesgo técnico o dispersión funcional.

Incluyen ERP, gestión total de proyectos, app móvil nativa, integraciones complejas, analítica avanzada, FinOps avanzado y automatización total sin intervención humana.

## 4. Módulo 1 — Espacio de trabajo / empresa

**Propósito:** Crear y administrar el espacio donde vive la operación del cliente.

El espacio de trabajo representa la empresa, negocio, unidad operativa o cliente dentro del cual se registran usuarios, compromisos, evidencias, reglas y bitácoras.

### Capacidades mínimas

- Crear empresa o espacio de trabajo.
- Definir nombre comercial.
- Registrar unidades, sucursales o frentes básicos.
- Asociar usuarios al espacio de trabajo.
- Separar información por empresa.
- Configurar datos básicos del espacio.

### Ejemplo funcional

Ferretería Luisito puede crear su espacio de trabajo y registrar Tienda Norte y Tienda Sur como unidades operativas. Después puede asociar a Panchito como responsable de almacén de Tienda Sur y a Rosita como cajera de esa misma unidad.

### No debe incluir todavía

- Multiempresa complejo.
- Multi-WABA avanzado.
- Configuraciones corporativas sofisticadas.
- Jerarquías empresariales profundas.
- Administración avanzada de múltiples razones sociales.

## 5. Módulo 2 — Usuarios, roles y permisos

**Propósito:** Controlar quién participa, qué puede ver y qué puede hacer dentro de Gamora Bot.

Este módulo evita que Gamora funcione como un chat abierto o como una herramienta informal sin control. Todo usuario debe tener rol, permisos y relación clara con una empresa, unidad, frente o proyecto.

### Roles mínimos

- Administrador.
- Coordinador.
- Responsable operativo.
- Supervisor / validador.
- Observador / consulta.

### Capacidades mínimas

- Registrar usuario.
- Asignar rol.
- Asignar empresa, unidad, sucursal o frente.
- Activar usuario.
- Suspender usuario.
- Controlar permisos básicos.
- Impedir acciones no autorizadas.

### Reglas

- Nadie recibe compromisos por WhatsApp sin enrolamiento.
- Un responsable operativo no debe aprobar su propia evidencia si el compromiso requiere validación.
- La evidencia sensible solo debe ser visible para usuarios autorizados.
- Un observador no debe modificar compromisos ni cerrar pendientes.
- Un usuario suspendido no debe operar por WhatsApp ni por web/PWA.

## 6. Módulo 3 — Invitación y enrolamiento

**Propósito:** Convertir una persona invitada en usuario autorizado dentro de Gamora Bot.

Este módulo es clave para cumplimiento, privacidad y confianza. Registrar a una persona no significa que esa persona ya aceptó recibir compromisos por WhatsApp.

### Capacidades mínimas

- Generar invitación.
- Manejar estado invitado.
- Manejar estado pendiente de aceptación.
- Permitir aceptación desde WhatsApp.
- Registrar opt-in.
- Manejar estado activo / enrolado.
- Manejar estado WhatsApp desactivado.
- Manejar estado suspendido.
- Permitir baja por palabra BAJA, STOP o equivalente.

### Reglas

- La invitación no equivale a enrolamiento.
- El administrador no puede aceptar por el usuario.
- Gamora debe registrar fecha, hora, número, empresa, versión de aviso y texto aceptado.
- Un usuario sin opt-in no recibe compromisos por WhatsApp.
- Un usuario con WhatsApp desactivado puede existir en web/PWA, pero no debe recibir mensajes por WhatsApp.
- La baja del canal WhatsApp no debe confundirse automáticamente con eliminación total de datos.

## 7. Módulo 4 — Canal WhatsApp operativo

**Propósito:** Permitir operación de baja fricción desde WhatsApp.

WhatsApp será el canal operativo principal del MVP porque ahí ya ocurre gran parte de la coordinación diaria. Sin embargo, WhatsApp no será el sistema completo ni reemplazará la capa formal de control.

### Capacidades mínimas

- Recibir mensajes.
- Interpretar intención básica.
- Crear borrador de compromiso.
- Enviar confirmaciones.
- Notificar compromisos.
- Recibir aceptación.
- Recibir evidencias.
- Recibir consultas simples.
- Recibir BAJA, STOP o equivalente.

### Reglas

- Todo mensaje saliente debe tener intención válida.
- Los mensajes a usuarios no enrolados deben bloquearse.
- Los recordatorios deben tener límites.
- Debe respetar opt-out.
- Debe evitar duplicados.
- Debe registrar consumo de mensajes.
- No debe enviar mensajes ilimitados.

### No debe hacer

- Leer chats personales.
- Operar en grupos personales.
- Funcionar como comunicación interna general.
- Enviar mensajes sorpresa.
- Aprobar por IA.
- Cerrar compromisos por IA.
- Contactar usuarios no enrolados.

## 8. Módulo 5 — Web/PWA de control

**Propósito:** Dar control formal, administración y visibilidad al cliente.

La web/PWA será la capa donde administradores, coordinadores y supervisores podrán revisar, ordenar y controlar lo que ocurre en WhatsApp.

### Capacidades mínimas

- Dashboard de compromisos.
- Alta y edición de usuarios.
- Revisión de evidencias.
- Aprobación, rechazo o solicitud de corrección.
- Consulta de bitácora.
- Filtros básicos por estado, responsable, unidad o frente.
- Vista de usuario y estado de enrolamiento.
- Vista básica de consumo / guardrails.
- Pausa manual de automatizaciones.
- Visualización de límites alcanzados o alertas básicas.

### No debe convertirse en

- Sistema pesado de gestión de proyectos.
- ERP.
- App empresarial compleja.
- Intranet.
- Reemplazo total de WhatsApp.

## 9. Módulo 6 — Motor de compromisos operativos

**Propósito:** Crear y administrar el objeto central de Gamora Bot.

El compromiso operativo es la unidad mínima de seguimiento. No es una tarea genérica: implica responsable, fecha, evidencia esperada, estado, trazabilidad y cierre.

### Campos funcionales mínimos

- Título / descripción.
- Responsable.
- Solicitante / coordinador.
- Empresa / espacio.
- Unidad, frente o proyecto opcional.
- Fecha compromiso.
- Evidencia esperada.
- Prioridad.
- Estado.
- Mensajes asociados.
- Evidencias.
- Bitácora.

### Capacidades mínimas

- Crear compromiso.
- Confirmar datos faltantes.
- Asignar responsable.
- Aceptar compromiso.
- Actualizar estado.
- Marcar vencimiento.
- Cerrar con validación.

### Reglas

- No crear compromisos ambiguos sin confirmación.
- No cerrar compromisos sin rol autorizado.
- No enviar compromisos a usuario no enrolado.
- Todo compromiso debe pertenecer a un espacio de trabajo.
- Todo compromiso debe tener responsable y fecha compromiso antes de quedar activo.
- No crear compromisos en masa sin control.
- Toda creación vía IA debe pasar por validación del backend.
- Las acciones ambiguas o de baja confianza deben pasar a confirmación o menú guiado.

## 10. Módulo 7 — Evidencias

**Propósito:** Recibir, ordenar y proteger evidencias asociadas a compromisos.

La evidencia no debe tratarse como un simple adjunto. Es el material que permite verificar avance, cumplimiento o entrega.

### Capacidades mínimas

- Recibir fotos.
- Recibir audios.
- Recibir PDFs o archivos.
- Asociar evidencia al compromiso.
- Marcar evidencia sensible.
- Visualizar evidencia en web/PWA.
- Registrar quién subió evidencia.
- Registrar revisión de evidencia.

### Reglas

- Toda evidencia debe estar asociada a un compromiso.
- No deben mezclarse evidencias entre compromisos.
- La evidencia sensible requiere permisos.
- Debe registrarse quién subió, revisó, aprobó o rechazó evidencia.
- Gamora no debe usar evidencias para fines distintos al seguimiento operativo.
- No enviar archivos completos a IA salvo necesidad justificada.

## 11. Módulo 8 — Validación, rechazo, corrección y cierre

**Propósito:** Convertir un reporte en cumplimiento validado.

Gamora debe evitar que un compromiso se cierre solo porque alguien dijo "ya quedó". El cierre debe pasar por revisión cuando el flujo lo requiera.

### Capacidades mínimas

- Poner evidencia en revisión.
- Aprobar.
- Rechazar.
- Pedir corrección.
- Registrar motivo.
- Cerrar o liberar compromiso.
- Notificar resultado.

### Reglas

- IA no aprueba.
- IA no cierra.
- El cierre requiere usuario autorizado.
- Todo rechazo o corrección debe registrar motivo.
- Todo cierre queda en bitácora.
- El responsable debe poder conocer si su entrega fue aprobada, rechazada o corregida.

## 12. Módulo 9 — Recordatorios y notificaciones

**Propósito:** Reducir dependencia de memoria humana sin generar ruido.

Gamora debe recordar y notificar, pero no saturar. Un exceso de mensajes puede generar rechazo, opt-out, reportes o costos innecesarios.

### Capacidades mínimas

- Notificar nuevo compromiso.
- Recordar antes de vencimiento.
- Alertar vencido.
- Avisar evidencia recibida.
- Avisar aprobación, rechazo o corrección.
- Enviar resumen diario básico.

### Reglas

- Respetar opt-out.
- Limitar frecuencia.
- Agrupar cuando sea posible.
- Medir costo.
- Medir consumo de mensajes.
- No enviar mensajes promocionales desde el canal operativo.
- No notificar a usuarios suspendidos o con WhatsApp desactivado.
- No reintentar indefinidamente.
- Permitir pausa ante comportamiento anómalo.
- Agrupar notificaciones para reducir costo y ruido.

## 13. Módulo 10 — Consultas y reportes básicos

**Propósito:** Permitir visibilidad rápida desde WhatsApp y web/PWA.

Este módulo permite que el coordinador o gerente consulte el estado real de la operación sin buscar entre múltiples chats.

### Consultas mínimas

- Pendientes de hoy.
- Vencidos.
- Pendientes por responsable.
- Pendientes por unidad o frente.
- Evidencias en revisión.
- Compromisos cerrados recientes.

### Reportes mínimos

- Resumen diario.
- Tablero por estado.
- Tablero por responsable.
- Tablero por unidad o frente.
- Consumo básico de mensajes/IA por empresa.

### Reglas

- Las consultas deben filtrarse por permisos.
- No se deben exponer datos de otros espacios de trabajo.
- Los reportes deben basarse en estados reales.
- El resumen no debe mezclar avances reportados con avances validados.
- No generar resúmenes infinitos ni repetitivos.

## 14. Módulo 11 — IA auxiliar de interpretación

**Propósito:** Reducir fricción de captura.

La IA ayuda a entender mensajes, audios e instrucciones naturales. Su función es proponer estructura, no tomar decisiones finales.

### Capacidades mínimas

- Interpretar lenguaje natural.
- Detectar responsable.
- Detectar fecha.
- Detectar evidencia esperada.
- Sugerir título y descripción.
- Identificar si falta información.
- Transcribir o interpretar audio si aplica.
- Preparar borrador de respuesta o resumen.

### Reglas

- IA propone, no decide.
- Backend valida.
- Humano confirma acciones críticas.
- No enviar datos sensibles innecesarios a IA.
- Registrar uso de IA cuando aplique.
- Registrar uso de IA y consumo básico.
- No usar datos del cliente para entrenar IA sin autorización.
- Si hay ambigüedad, Gamora debe pedir confirmación o usar selección guiada.
- Toda llamada a IA debe tener propósito funcional.
- Aplicar límites por usuario, empresa, conversación y periodo.
- Fallback a menú guiado si hay baja confianza o ambigüedad.
- No ejecutar acciones críticas basadas solo en IA.

## 15. Módulo 12 — AI & API Guardrails

**Clasificación:** Módulo indispensable de soporte MVP.

**Propósito:** Proteger el MVP contra alucinaciones, loops, reintentos infinitos, duplicación de mensajes, eventos repetidos, acciones críticas no autorizadas, consumo excesivo de OpenAI API, consumo excesivo de WhatsApp Business API y costos inesperados.

### Capacidades mínimas

- Límite de llamadas IA por usuario, empresa, compromiso, conversación o periodo.
- Límite de mensajes salientes por WhatsApp por usuario, empresa, compromiso o periodo.
- Límite de recordatorios.
- Límite de reintentos.
- Prevención básica de loops conversacionales.
- Detección básica de eventos duplicados.
- Idempotencia funcional conceptual para eventos repetidos.
- Registro básico de consumo.
- Vista básica de consumo en web/PWA.
- Alertas internas al acercarse a límites.
- Pausa manual de automatizaciones.
- Bloqueo de acciones ambiguas o de baja confianza.
- Fallback a menú guiado.
- Condición de salida por flujo conversacional.

### Reglas

- No consumo ilimitado de APIs de pago.
- No reintentos infinitos.
- No loops sin salida.
- No mensajes duplicados por webhook repetido.
- No llamadas IA sin propósito funcional.
- No acciones críticas basadas solo en IA.
- Todo uso de API de pago se registra.
- Límites por empresa, usuario, conversación y periodo.
- Posibilidad de apagar o pausar flujo ante anomalías.

### No debe incluir todavía

- FinOps avanzado.
- Predicción automática de consumo.
- Monitoreo enterprise complejo.
- Autoescalamiento sofisticado.
- Análisis automático avanzado de anomalías.

## 16. Módulo 13 — Bitácora y trazabilidad

**Propósito:** Registrar la historia operativa de usuarios, compromisos, evidencias y acciones críticas.

La bitácora es una de las diferencias centrales entre un mensaje informal de WhatsApp y un compromiso operativo trazable.

### Eventos mínimos

- Usuario invitado.
- Usuario enrolado.
- Opt-in registrado.
- Baja / opt-out.
- Compromiso creado.
- Compromiso asignado.
- Compromiso aceptado.
- Evidencia recibida.
- Evidencia revisada.
- Rechazo.
- Corrección.
- Aprobación.
- Cierre.
- Cambio de fecha.
- Cambio de responsable.
- Uso de IA.
- Acceso a evidencia sensible.
- Consumo relevante de API.
- Límites alcanzados.
- Pausa de automatización.
- Evento duplicado detectado.
- Reintento agotado.

### Reglas

- La bitácora no debe ser editable libremente.
- Las acciones críticas siempre deben registrarse.
- La bitácora debe ser visible según permisos.
- Debe permitir reconstruir qué ocurrió, cuándo ocurrió, quién actuó y con qué evidencia.
- Debe registrar eventos relevantes de consumo, límites, pausas, duplicados y reintentos agotados.

## 17. Módulo 14 — Proyectos, hitos y reportes parciales

**Clasificación:** MVP+ / estrés funcional controlado.

**Propósito:** Preparar a Gamora para casos como Sunworks sin prometer gestión total de proyectos.

Este módulo permite validar que el modelo de compromiso operativo puede crecer hacia escenarios con proyectos, hitos, avances parciales, evidencias repetidas y validación supervisora.

### Capacidades mínimas a considerar

- Proyecto.
- Checklist / hitos.
- Reporte parcial.
- Avance reportado.
- Avance validado.
- Evidencia por hito.
- Supervisor valida avance.
- Alias o nombres naturales.

### Reglas

- No exigir claves técnicas al usuario operativo.
- Avance oficial = avance validado.
- IA interpreta, backend valida, supervisor aprueba.
- No cálculo automático por foto.
- La evidencia debe asociarse al reporte parcial correcto.
- El hito solo debe llegar a 100% cuando el supervisor lo valide.

### Aclaración de alcance

Este módulo puede documentarse y modelarse funcionalmente desde Fase 5. Sin embargo, su alcance de implementación puede quedar como MVP+ si el MVP inicial necesita acotarse para salir antes con el ciclo básico completo.

## 18. Módulos fuera de alcance MVP

Los siguientes módulos o capacidades no deben prometerse todavía:

- ERP.
- Gestión total de proyectos.
- Marketplace.
- App móvil nativa.
- Integraciones externas complejas.
- Multi-WABA avanzado.
- Analítica avanzada.
- Cálculo automático de avance por foto.
- Aprobación automática por IA.
- Comunicación interna general.
- Lectura de chats personales.
- Automatización total sin humano.
- Módulo financiero.
- RH / control laboral.
- FinOps avanzado.
- Predicción automática de consumo.
- Monitoreo enterprise complejo.
- Autoescalamiento sofisticado.
- Análisis automático avanzado de anomalías.

## 19. Priorización funcional

| Módulo | Prioridad | Razón | Riesgo si se omite | Dependencia |
|---|---|---|---|---|
| Módulo 1 — Espacio de trabajo / empresa | Alta | Permite separar operación por cliente y unidad. | Mezcla de datos y falta de estructura básica. | Base del sistema. |
| Módulo 2 — Usuarios, roles y permisos | Alta | Controla quién puede operar y ver información. | Exposición de datos, acciones no autorizadas y pérdida de confianza. | Espacio de trabajo. |
| Módulo 3 — Invitación y enrolamiento | Alta | Habilita opt-in, consentimiento y usuarios autorizados. | Mensajes a usuarios no enrolados y riesgo de cumplimiento. | Usuarios, roles y permisos. |
| Módulo 4 — Canal WhatsApp operativo | Alta | Es la interfaz principal de baja fricción. | El MVP no demostraría la propuesta central. | Enrolamiento y motor de compromisos. |
| Módulo 5 — Web/PWA de control | Alta | Da revisión, administración, visibilidad formal y control básico de guardrails. | WhatsApp quedaría sin capa de control ni capacidad visible de pausa o consumo. | Espacio, usuarios, compromisos, evidencias y guardrails. |
| Módulo 6 — Motor de compromisos operativos | Alta | Administra el objeto central del producto. | Gamora se reduciría a mensajes o tareas sueltas. | Espacio, usuarios y WhatsApp. |
| Módulo 7 — Evidencias | Alta | Permite comprobar avance o cumplimiento. | El compromiso quedaría sin soporte verificable. | Motor de compromisos y permisos. |
| Módulo 8 — Validación, rechazo, corrección y cierre | Alta | Convierte reporte en cumplimiento validado. | Cierres ambiguos y baja rendición de cuentas. | Evidencias, roles y bitácora. |
| Módulo 9 — Recordatorios y notificaciones | Media | Reduce dependencia de memoria humana. | Menor valor operativo, seguimiento manual, ruido o costo excesivo si no se controla. | WhatsApp, estados, opt-out y guardrails. |
| Módulo 10 — Consultas y reportes básicos | Media | Entrega visibilidad rápida al coordinador. | El usuario no percibe control ni estado operativo. | Compromisos, estados y permisos. |
| Módulo 11 — IA auxiliar de interpretación | Media | Reduce fricción de captura. | Captura más manual y menor fluidez. | WhatsApp, backend y guardrails. |
| Módulo 12 — AI & API Guardrails | Alta | Protege costos, continuidad del canal y confianza operativa. | Costos inesperados, loops, duplicados, consumo excesivo y acciones no autorizadas. | WhatsApp, IA auxiliar, notificaciones, bitácora. |
| Módulo 13 — Bitácora y trazabilidad | Alta | Registra historia operativa, accountability y eventos relevantes de control. | No habría evidencia de decisiones, cierres, límites, pausas o anomalías. | Todos los módulos críticos. |
| Módulo 14 — Proyectos, hitos y reportes parciales | MVP+ | Prepara escenarios complejos tipo Sunworks. | Gamora podría quedarse limitada a compromisos simples. | Compromisos, evidencias, validación y estados. |

## 20. MVP mínimo demostrable

Al final del MVP debe poder demostrarse el siguiente flujo:

1. Luis crea empresa.
2. Invita a Panchito.
3. Panchito se enrola.
4. Luis crea compromiso por WhatsApp.
5. Gamora confirma datos.
6. Panchito recibe y acepta.
7. Panchito envía evidencia.
8. Gamora asocia la evidencia al compromiso.
9. Gamora notifica a Luis, coordinador o validador que hay evidencia pendiente de revisión.
10. Luis revisa en web/PWA.
11. Luis aprueba o pide corrección.
12. Gamora notifica a Panchito el resultado.
13. Gamora cierra y deja bitácora cuando la evidencia queda aprobada.
14. Luis consulta pendientes o resumen.
15. Se registra consumo básico de WhatsApp/IA.
16. Se demuestra al menos un guardrail básico, por ejemplo: bloqueo de usuario no enrolado, prevención de mensaje duplicado, límite de reintentos, fallback a menú guiado por ambigüedad o pausa manual de automatización.

Este flujo mínimo debe probar la tesis central: un pendiente que antes vivía en WhatsApp informal puede convertirse en compromiso operativo trazable, sin abrir la puerta a consumo ilimitado, loops, duplicados o acciones críticas no controladas.

## 21. Dependencias técnicas obligatorias del MVP funcional

Aunque este documento no desarrolla arquitectura técnica, el MVP de Gamora Bot deberá ser completamente funcional y no solo conceptual.

Para considerarse funcional, el MVP deberá contemplar en fases técnicas posteriores:

- Integración real con WhatsApp Business API.
- Webhook para recibir mensajes, archivos, audios y eventos.
- Envío real de mensajes, recordatorios y notificaciones por WhatsApp.
- Manejo de templates cuando aplique.
- Integración real con API de IA para interpretación de lenguaje natural y audios, según alcance técnico definido.
- Persistencia de compromisos, usuarios, evidencias, estados y bitácora.
- Web/PWA operativa para administración, revisión, aprobación y reportes.
- Autenticación y control básico de roles.
- Almacenamiento seguro de evidencias.
- Variables de entorno y manejo seguro de credenciales.
- Logs técnicos y funcionales.
- Ambientes mínimos de desarrollo y prueba.
- Pruebas reales de extremo a extremo por WhatsApp.
- Guardrails técnicos: rate limits, idempotencia, circuit breakers, límites de reintentos, medición de consumo y alertas básicas.

Estas dependencias no se desarrollan en este documento porque pertenecen a Fase 7 — Modelo Técnico, Fase 8 — Prompts Codex y Fase 9 — Pruebas y Validación.

## 22. Relación con próximos documentos

Este documento será base para:

- `05_Arquitectura_Funcional/modelo_de_estados.md`
- Flujos MVP.
- Modelo técnico.
- Prompts Codex.
- Pruebas funcionales.

También servirá como referencia para acotar el backlog y evitar que el MVP se desvíe hacia módulos fuera de alcance.

## 23. Cierre del documento

El MVP de Gamora Bot debe ser lo suficientemente pequeño para construirse, pero lo suficientemente completo para demostrar valor real.

Ese valor no está en crear otra lista de tareas, sino en transformar mensajes de WhatsApp en compromisos operativos trazables con responsable, fecha, evidencia, revisión, cierre y bitácora.

La prioridad funcional es proteger el equilibrio del producto: mínima fricción para el usuario operativo, máximo control formal dentro de Gamora Core y límites claros para evitar costos inesperados, loops, duplicados o automatizaciones fuera de control.
