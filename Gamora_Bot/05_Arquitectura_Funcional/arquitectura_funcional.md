# Arquitectura Funcional — Gamora Bot

## Versión

v0.2

## Estatus

Borrador ampliado con AI & API Guardrails para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define la arquitectura funcional general de Gamora Bot: qué componentes funcionales existirán, cómo se relacionan y qué reglas deberán respetar.

No es arquitectura técnica. No define base de datos, endpoints, APIs, infraestructura, integración WhatsApp ni código.

Su propósito es establecer el mapa funcional del producto antes de pasar a módulos MVP, modelo de estados, flujos, modelo técnico y prompts de desarrollo.

## 2. Principio rector de arquitectura funcional

Gamora Bot no será un simple bot de tareas ni un WhatsApp interno para empleados.

Será un motor de compromisos operativos trazables para usuarios autorizados, con:

- WhatsApp Business como canal operativo principal.
- Web/PWA como capa formal de control.
- Gamora Core como núcleo funcional.
- IA como capa auxiliar de interpretación.
- Backend determinístico gobernando reglas, permisos, estados y bitácora.
- Humano autorizado validando acciones críticas.

La regla funcional central es:

**IA interpreta, backend gobierna, humano valida.**

## 3. Visión funcional de alto nivel

La arquitectura funcional se puede representar así:

Usuario / WhatsApp  
↓  
Canal operativo Gamora  
↓  
Interpretación IA auxiliar  
↓  
Gamora Core  
↓  
Reglas, estados, permisos, compromisos, evidencias, bitácora  
↓  
Web/PWA de control  
↓  
Reportes, revisión, validación, administración

WhatsApp reduce fricción operativa. Gamora Core absorbe la lógica de compromisos. La web/PWA entrega control formal. La IA ayuda a interpretar, pero no decide por sí sola.

## 4. Componentes funcionales principales

### 1. Canal WhatsApp Business

**Propósito:** Ser el canal operativo principal del MVP.

**Qué hace:**

- Recibe mensajes de usuarios autorizados.
- Permite crear compromisos.
- Permite aceptar compromisos.
- Recibe avances y evidencias.
- Envía recordatorios, notificaciones y resúmenes.
- Permite consultas simples de estado.

**Qué no debe hacer:**

- Leer chats personales.
- Operar como WhatsApp interno para empleados.
- Sustituir toda la web/PWA.
- Enviar mensajes sorpresa.

**Reglas principales:**

- Solo usuarios enrolados reciben compromisos.
- Debe respetar opt-in, opt-out y baja.
- Los mensajes deben estar ligados a compromisos o reportes esperados.

### 2. Web/PWA de control

**Propósito:** Ser la capa formal de administración, revisión, trazabilidad y control.

**Qué hace:**

- Configura empresa o espacio de trabajo.
- Administra usuarios, roles y permisos.
- Muestra tablero de compromisos.
- Permite revisar evidencias.
- Permite aprobar, rechazar o solicitar corrección.
- Permite consultar bitácora y reportes.
- Permite controlar evidencias sensibles.

**Qué no debe hacer:**

- Convertirse en una barrera pesada para la operación diaria.
- Reemplazar por completo la interacción operativa de WhatsApp.

**Reglas principales:**

- Acceso por rol.
- Separación por empresa.
- Evidencias visibles solo para autorizados.
- Acciones críticas registradas en bitácora.

### 3. Gamora Core

**Propósito:** Ser el núcleo funcional independiente del canal.

**Qué hace:**

- Gobierna compromisos, usuarios, permisos, estados y bitácora.
- Aplica reglas de negocio.
- Separa avance reportado y avance validado.
- Controla evidencias y cierres.
- Permite que WhatsApp sea canal, no dependencia total.

**Qué no debe hacer:**

- Delegar decisiones críticas a la IA sin reglas.
- Depender de WhatsApp como único canal eterno.

**Reglas principales:**

- Backend gobierna reglas y estados.
- Toda acción crítica debe pasar por validación funcional.
- La trazabilidad vive en Gamora Core, no en el chat.

### 4. Motor de compromisos operativos

**Propósito:** Crear, asignar, actualizar y cerrar compromisos operativos.

**Qué hace:**

- Registra responsable, fecha, evidencia esperada y estado.
- Permite aceptación del responsable.
- Relaciona mensajes y evidencias.
- Soporta compromisos simples, dependientes, recurrentes y por hito.

**Qué no debe hacer:**

- Tratar cualquier mensaje como compromiso sin confirmación.
- Crear compromisos ambiguos sin datos mínimos.

**Reglas principales:**

- Todo compromiso debe tener responsable.
- Debe existir fecha compromiso o regla de seguimiento.
- Debe quedar bitácora de creación, aceptación, cambios y cierre.

### 5. Motor de usuarios, roles y enrolamiento

**Propósito:** Controlar quién puede operar, recibir mensajes y ejecutar acciones.

**Qué hace:**

- Registra usuarios.
- Genera invitaciones.
- Controla enrolamiento.
- Gestiona roles y permisos.
- Controla estados de usuario.

**Qué no debe hacer:**

- Activar WhatsApp por el usuario sin aceptación individual.
- Permitir compromisos a usuarios no enrolados.

**Reglas principales:**

- Invitación no equivale a enrolamiento.
- El administrador no puede aceptar por el usuario.
- WhatsApp desactivado bloquea mensajes por ese canal.

### 6. Motor de evidencias

**Propósito:** Asociar evidencias a compromisos, hitos o reportes parciales.

**Qué hace:**

- Recibe fotos, audios, PDFs, archivos y mensajes.
- Asocia evidencia al compromiso correcto.
- Permite clasificar evidencia sensible.
- Registra quién subió, vio, aprobó o rechazó evidencia.

**Qué no debe hacer:**

- Tratar evidencia como simple adjunto sin contexto.
- Mezclar evidencias entre compromisos o hitos.
- Exponer evidencias a usuarios no autorizados.

**Reglas principales:**

- Toda evidencia debe tener contexto.
- Evidencia sensible requiere permisos.
- La evidencia debe quedar ligada a bitácora.

### 7. Motor de validación y cierre

**Propósito:** Controlar revisión, aprobación, rechazo, corrección y cierre.

**Qué hace:**

- Pone evidencias en revisión.
- Permite aprobar, rechazar o pedir corrección.
- Controla cierre formal del compromiso.
- Registra validación humana.

**Qué no debe hacer:**

- Aprobar automáticamente por IA.
- Cerrar compromisos sin rol autorizado.

**Reglas principales:**

- Responsable reporta.
- Supervisor o coordinador valida.
- Todo cierre debe quedar en bitácora.

### 8. Motor de recordatorios y notificaciones

**Propósito:** Mantener seguimiento sin depender de memoria manual.

**Qué hace:**

- Envía recordatorios antes de vencimiento.
- Notifica vencidos.
- Avisa evidencia recibida.
- Avisa aprobaciones, rechazos y correcciones.
- Envía resúmenes diarios o agrupados.

**Qué no debe hacer:**

- Saturar usuarios.
- Enviar mensajes no esperados.
- Ignorar opt-out.

**Reglas principales:**

- Frecuencia configurable.
- Mensajes vinculados a compromisos.
- Agrupar cuando sea posible.
- Medir costo de mensajes.

### 9. Motor de reportes y consultas

**Propósito:** Dar visibilidad operativa.

**Qué hace:**

- Responde consultas por WhatsApp.
- Muestra tableros en web/PWA.
- Genera resúmenes.
- Permite consultar pendientes por responsable, proyecto, frente, sucursal o estado.

**Qué no debe hacer:**

- Mostrar datos sin permisos.
- Mezclar información entre empresas.

**Reglas principales:**

- Respuestas filtradas por rol.
- Reportes basados en estados reales.
- Separar reportado, validado, cerrado y vencido.

### 10. Motor de proyectos/hitos para escenarios complejos

**Propósito:** Soportar casos como Sunworks sin convertir el MVP en gestión total de proyectos.

**Qué hace:**

- Representa proyectos.
- Permite checklist e hitos.
- Recibe reportes parciales.
- Separa avance reportado y avance validado.
- Asocia evidencias por hito.

**Qué no debe hacer:**

- Prometer gestión total de proyectos.
- Exigir claves técnicas al usuario operativo.

**Reglas principales:**

- Usuario puede usar nombres naturales y alias.
- IA interpreta proyecto/hito probable.
- Backend valida.
- Supervisor aprueba avance oficial.

### 11. Capa IA auxiliar

**Propósito:** Reducir fricción de captura e interpretación.

**Qué hace:**

- Interpreta lenguaje natural.
- Transcribe audios.
- Detecta responsables, fechas y evidencias esperadas.
- Sugiere hito probable.
- Separa múltiples compromisos.
- Prepara resúmenes.

**Qué no debe hacer:**

- Aprobar evidencias.
- Cerrar compromisos.
- Activar usuarios.
- Saltarse opt-in.
- Modificar estados críticos sin backend y humano.

**Reglas principales:**

- IA propone.
- Backend valida.
- Humano confirma acciones críticas.

### 12. Bitácora y trazabilidad

**Propósito:** Mantener historia formal de acciones y decisiones.

**Qué hace:**

- Registra creación, aceptación, evidencias, revisión, cambios, aprobaciones y cierres.
- Registra baja de WhatsApp, cambios de usuario y cambios de fecha.
- Registra uso de IA cuando aplique.

**Qué no debe hacer:**

- Ser editable libremente por usuarios.
- Omitir acciones críticas.

**Reglas principales:**

- Toda acción crítica queda registrada.
- Bitácora consultable según permisos.
- La bitácora sostiene accountability operativo.

### 13. AI & API Guardrails

**Propósito:** Proteger a Gamora Bot contra alucinaciones, bucles conversacionales, consumo excesivo de APIs de pago, reintentos infinitos, mensajes duplicados, acciones no autorizadas y costos inesperados.

**Qué hace:**

- Limita llamadas a OpenAI API por usuario, empresa, compromiso, conversación o periodo.
- Limita mensajes salientes por WhatsApp por usuario, empresa, compromiso o periodo.
- Controla reintentos de mensajes fallidos.
- Evita loops conversacionales.
- Detecta repetición de eventos o webhooks duplicados.
- Exige confirmación humana antes de acciones críticas.
- Bloquea acciones ambiguas o de baja confianza.
- Registra uso de IA, mensajes, reintentos y eventos relevantes.
- Permite suspender temporalmente automatizaciones ante comportamiento anómalo.
- Permite configurar límites por plan, trial, empresa o ambiente.
- Genera alertas internas cuando se acercan umbrales de consumo.

**Qué no debe hacer:**

- No debe sustituir la lógica de negocio.
- No debe decidir aprobaciones o cierres.
- No debe ocultar errores críticos.
- No debe permitir que una alucinación de IA se convierta en acción final.
- No debe permitir consumo ilimitado por estar en modo prueba o trial.

**Reglas principales:**

- Toda llamada a IA debe tener propósito funcional claro.
- Toda respuesta de IA que implique acción debe pasar por validación del backend.
- Toda acción crítica debe requerir confirmación humana o rol autorizado.
- Todo reintento debe tener límite.
- Todo flujo conversacional debe tener condición de salida.
- Todo webhook debe poder procesarse de forma idempotente.
- Todo mensaje saliente debe estar vinculado a una intención válida.
- Todo uso de API de pago debe registrarse para medición de costo.
- Deben existir límites por empresa, usuario, conversación y periodo.
- Debe existir capacidad de apagado seguro o pausa de automatización.

## 5. Objeto central: compromiso operativo

El compromiso operativo es la unidad mínima de seguimiento de Gamora Bot.

Está compuesto por:

- Empresa / espacio de trabajo.
- Frente, sucursal, proyecto o unidad.
- Responsable.
- Solicitante o coordinador.
- Fecha compromiso.
- Evidencia esperada.
- Estado.
- Prioridad.
- Mensajes asociados.
- Evidencias.
- Validación.
- Bitácora.
- Cierre.

No toda tarea es compromiso operativo. El compromiso implica responsabilidad, trazabilidad, evidencia y cierre.

El compromiso operativo es el objeto que permite diferenciar Gamora de un task manager tradicional.

## 6. Tipos funcionales de compromiso

### Compromiso simple

Ejemplo: Panchito cuenta sacos de cemento.

Este tipo valida creación, asignación, aceptación, evidencia simple y cierre.

### Compromiso con evidencia y validación

Ejemplo: Fermín entrega reporte PDF y Luis lo aprueba.

Este tipo requiere evidencia asociada, revisión y aprobación antes de cerrar.

### Compromiso dependiente

Ejemplo: Ariel necesita techos presupuestales de Heriberto antes de cotizar.

Este tipo requiere distinguir ejecución pendiente de insumo pendiente.

### Compromiso de seguimiento recurrente

Ejemplo: corte de caja diario o resumen semanal.

Este tipo requiere repetición, recordatorio y cierre periódico.

### Compromiso dentro de proyecto/hito

Ejemplo: Sunworks, avance parcial de H2 con evidencia y validación supervisora.

Este tipo requiere proyecto, hito, reporte parcial, evidencia y avance validado.

El MVP debe iniciar simple, pero sin cerrar la puerta a complejidad.

## 7. Espacio de trabajo / empresa

El espacio de trabajo representa la unidad funcional donde vive la operación de un cliente.

Puede incluir:

- Empresa.
- Sucursales.
- Unidades.
- Frentes.
- Proyectos.
- Usuarios.
- Reglas.
- Permisos.
- Configuración.

Ejemplos:

- Ferretería Luisito con Tienda Norte y Tienda Sur.
- Sunworks con proyectos fotovoltaicos.
- Mina Mercedes con frente de infraestructura tecnológica.

El espacio de trabajo debe separar información, permisos, evidencias y reportes entre empresas.

## 8. Usuarios y roles funcionales

### Administrador

**Puede hacer:** configurar empresa, registrar usuarios, generar invitaciones, administrar permisos y consultar configuración.

**No puede hacer:** aceptar enrolamiento por otra persona.

**Ejemplo:** Luisito crea Ferretería Luisito y registra Tienda Sur.

### Coordinador

**Puede hacer:** crear compromisos, asignar responsables, dar seguimiento y consultar estados.

**No puede hacer:** aprobar evidencias si no tiene rol de validador.

**Ejemplo:** Luis Felipe coordinando pendientes de Mina Mercedes.

### Responsable operativo

**Puede hacer:** aceptar compromisos, reportar avance y enviar evidencias.

**No puede hacer:** aprobar su propia evidencia si el flujo requiere validación.

**Ejemplo:** Panchito, Raúl o Fermín.

### Supervisor / validador

**Puede hacer:** revisar evidencias, aprobar, rechazar, solicitar corrección y validar avances.

**No puede hacer:** saltarse bitácora ni cerrar sin evidencia cuando el flujo la exige.

**Ejemplo:** Mario validando avance de Sunworks.

### Solicitante / cliente interno o externo

**Puede hacer:** originar solicitudes, consultar ciertos estados o validar entregables si tiene permiso.

**No puede hacer:** acceder a toda la operación sin autorización.

**Ejemplo:** Heriberto solicitando o validando entregables.

### Usuario solo evidencia

**Puede hacer:** subir evidencia o responder a compromisos asignados.

**No puede hacer:** ver tableros completos ni aprobar cierres.

**Ejemplo:** colaborador de campo que solo reporta fotos.

### Observador / consulta

**Puede hacer:** consultar estados o reportes permitidos.

**No puede hacer:** modificar compromisos ni evidencias.

**Ejemplo:** gerente que revisa avance sin operar el flujo.

Regla general: ningún usuario recibe compromisos por WhatsApp sin enrolamiento.

## 9. Invitación, enrolamiento y estados de usuario

### Invitación

El administrador registra a una persona y genera link, código o QR.

La invitación no activa mensajes operativos por WhatsApp.

### Enrolamiento

El usuario acepta participar desde su propio WhatsApp y queda activo.

El enrolamiento registra consentimiento, número, fecha, empresa y versión de aviso aceptado.

Estados mínimos:

- Invitado.
- Pendiente de aceptación.
- Activo / enrolado.
- WhatsApp desactivado.
- Suspendido.

Reglas:

- Invitado no recibe compromisos.
- WhatsApp desactivado no recibe mensajes por WhatsApp.
- Usuario suspendido no opera.
- El administrador no puede aceptar por el usuario.
- La baja de WhatsApp no equivale automáticamente a eliminación de datos.

## 10. Canales funcionales

### WhatsApp Business

Sirve para:

- Crear compromisos.
- Aceptar.
- Responder.
- Enviar evidencia.
- Consultar estado.
- Recibir recordatorios.
- Recibir resúmenes.

No sirve para:

- Comunicación interna general.
- Leer chats personales.
- Sustituir toda la web/PWA.
- Aprobar automáticamente por IA.

### Web/PWA

Sirve para:

- Configurar empresa.
- Administrar usuarios.
- Revisar evidencias.
- Aprobar/rechazar.
- Ver tablero.
- Configurar permisos.
- Consultar bitácora.
- Reportes.
- Control de evidencias sensibles.

WhatsApp permite operar con mínima fricción. Web/PWA permite controlar con formalidad.

## 11. Evidencias

Evidencia es cualquier archivo, mensaje, foto, audio, PDF o documento asociado a un compromiso, hito o reporte parcial.

Reglas:

- Toda evidencia debe estar asociada a un compromiso.
- Evidencias sensibles deben tener permisos.
- Debe registrarse quién subió, vio, aprobó o rechazó.
- No deben mezclarse evidencias entre compromisos.
- Evidencias no son simples adjuntos.
- Una evidencia puede requerir corrección o reemplazo.

## 12. Validación, aprobación, rechazo y cierre

Estados funcionales de validación:

- Reportado.
- Recibido.
- En revisión.
- Aprobado.
- Rechazado.
- Corrección solicitada.
- Cerrado/liberado.

Reglas:

- Responsable reporta.
- Supervisor o coordinador valida.
- IA no aprueba.
- IA no cierra.
- Backend controla estados.
- Todo cierre debe quedar en bitácora.
- Rechazo y corrección deben registrar motivo.

## 13. Recordatorios y notificaciones

Gamora debe permitir:

- Recordatorios antes de vencimiento.
- Alertas de vencidos.
- Notificaciones de evidencia recibida.
- Notificaciones de aprobación/rechazo.
- Resúmenes diarios.

Reglas:

- No saturar.
- Mensajes esperados.
- Opt-out respetado.
- Agrupar cuando sea posible.
- Costos medidos.
- Frecuencia configurable por empresa o rol.
- No usar notificaciones para comunicación general.

## 14. Proyectos, hitos y reportes parciales

El caso Sunworks representa la capacidad de complejidad.

Definiciones:

- **Proyecto:** unidad operativa de mayor alcance.
- **Checklist:** conjunto de hitos o pasos esperados.
- **Hito:** etapa funcional dentro de un proyecto.
- **Reporte parcial:** avance enviado por responsable operativo.
- **Avance reportado:** avance informado por campo.
- **Avance validado:** avance aprobado por supervisor.
- **Evidencia por hito:** archivos asociados a un hito específico.
- **Corrección:** observación que requiere ajuste o evidencia adicional.
- **Cierre de hito:** cierre formal de una etapa validada.

Reglas:

- Usuario operativo no debe memorizar claves.
- Aceptar nombres naturales y alias.
- IA interpreta.
- Backend valida.
- Supervisor aprueba.
- Avance oficial = avance validado.
- Evidencias deben separarse por hito o reporte parcial.

## 15. IA auxiliar

La IA puede:

- Interpretar lenguaje natural.
- Transcribir audios.
- Detectar responsables.
- Detectar fechas.
- Sugerir hito probable.
- Detectar evidencia esperada.
- Separar compromisos múltiples.
- Preparar resúmenes.

La IA no puede:

- Aprobar evidencia.
- Cerrar compromisos.
- Activar usuarios.
- Saltarse opt-in.
- Enviar mensajes no autorizados.
- Modificar estados críticos sin backend y humano.

La IA reduce fricción, pero no sustituye responsabilidad.

## 15.1 AI & API Guardrails

Gamora Bot deberá contar con guardrails funcionales desde el MVP porque operará sobre APIs de pago y canales regulados. La IA no solo puede equivocarse; también puede generar costos inesperados si entra en bucles, reintentos, interpretaciones repetidas o consumo excesivo de tokens.

Los guardrails deben cubrir:

### Guardrails de IA

- Límite de llamadas por conversación.
- Límite de llamadas por compromiso.
- Límite de tokens o costo estimado.
- Bloqueo de acciones críticas sin confirmación.
- Umbral de confianza mínimo.
- Fallback a menú guiado cuando haya ambigüedad.
- Registro de uso de IA.
- No enviar archivos completos a IA salvo necesidad justificada.
- No entrenar con datos de cliente.
- Humano valida acciones críticas.

### Guardrails de WhatsApp Business API

- Límite de mensajes salientes por usuario.
- Límite de mensajes por compromiso.
- Límite de recordatorios.
- Agrupación de notificaciones.
- Control de plantillas.
- Prevención de mensajes duplicados.
- Control de reintentos.
- Respeto a opt-out.
- Bloqueo de mensajes a usuarios no enrolados.
- Monitoreo de consumo y costo por empresa.

### Guardrails contra loops

- Cada flujo conversacional debe tener estado y salida.
- Si el usuario no responde después de cierto número de intentos, pausar.
- Si la IA no entiende después de cierto número de intentos, pasar a menú guiado.
- Si hay error repetido, escalar a humano o suspender flujo.
- No reintentar indefinidamente webhooks, mensajes o interpretaciones.

### Guardrails de trial y planes

- Limitar usuarios.
- Limitar compromisos.
- Limitar mensajes.
- Limitar evidencias.
- Limitar uso de IA.
- Limitar recordatorios.
- Medir costo por cliente.
- Alertar cuando el cliente se acerque a límites.

### Guardrails de anomalías

- Detectar picos de mensajes.
- Detectar duplicación de eventos.
- Detectar conversaciones repetitivas.
- Detectar compromisos creados en masa.
- Detectar errores de webhook.
- Activar pausa segura si hay comportamiento anómalo.

Estos guardrails no son opcionales. Son parte de la arquitectura funcional mínima porque protegen continuidad del canal, costos operativos, confianza del usuario y viabilidad financiera del MVP.

## 16. Bitácora y trazabilidad

Toda acción crítica debe quedar registrada:

- Creación.
- Asignación.
- Aceptación.
- Evidencia recibida.
- Revisión.
- Rechazo.
- Corrección.
- Aprobación.
- Cierre.
- Baja de WhatsApp.
- Cambio de usuario.
- Cambio de fecha.
- Uso de IA cuando aplique.

La bitácora es el fundamento de accountability operativo. Sin bitácora, Gamora pierde una parte central de su diferenciación.

## 17. Reglas funcionales no negociables

- No leer chats personales.
- No mensajes sorpresa.
- No compromisos por WhatsApp sin enrolamiento.
- No posicionar como WhatsApp interno.
- No cierre automático por IA.
- No aprobación automática de evidencia.
- Registrar opt-in y opt-out.
- Permitir baja.
- Separar empresas.
- Separar avance reportado de avance validado.
- Evidencias visibles solo para autorizados.
- WhatsApp es canal operativo, no único sistema.
- Web/PWA es necesaria para control formal.
- No consumo ilimitado de APIs de pago.
- No reintentos infinitos.
- No loops conversacionales sin salida.
- No envío duplicado de mensajes por error de webhook.
- No llamadas a IA sin propósito funcional.
- No ejecución de acciones críticas basadas solo en respuesta de IA.
- Todo uso de API de pago debe registrarse.
- Deben existir límites de uso por empresa, usuario y periodo.
- Debe existir pausa o apagado seguro ante comportamiento anómalo.

## 18. Alcance funcional MVP

El MVP sí debe incluir:

- Espacio de trabajo.
- Usuarios.
- Invitación/enrolamiento.
- Compromisos.
- Evidencia.
- Aceptación.
- Revisión.
- Aprobación/rechazo.
- Cierre.
- Bitácora básica.
- WhatsApp como canal.
- Web/PWA básica.
- Recordatorios básicos.
- Consultas simples.
- Guardrails básicos para IA y APIs de pago.
- Registro básico de consumo.
- Límites funcionales de mensajes, IA, recordatorios y reintentos.
- Prevención básica de bucles.
- Pausa manual de automatizaciones.

El MVP debe validar el ciclo completo: crear, asignar, aceptar, evidenciar, revisar, aprobar/rechazar, cerrar y consultar.

## 19. Fuera de alcance MVP

El MVP no debe prometer todavía:

- ERP.
- Gestión total de proyectos.
- Cálculo automático de avance por foto.
- Aprobación automática por IA.
- Lectura de todos los chats.
- Comunicación interna general.
- Analítica avanzada.
- Integraciones externas complejas.
- App móvil nativa.
- Marketplace.
- Multi-WABA avanzado.
- Automatización total.
- Optimización avanzada de costos por IA.
- Predicción automática de consumo.
- FinOps avanzado.
- Monitoreo enterprise complejo.
- Autoescalamiento sofisticado.
- Análisis automático avanzado de anomalías.

Estos elementos pueden evaluarse después, pero no deben contaminar el foco inicial.

## 20. Dependencias hacia documentos siguientes

Este documento será base para:

- `05_Arquitectura_Funcional/modulos_mvp.md`
- `05_Arquitectura_Funcional/modelo_de_estados.md`
- Flujos MVP.
- Modelo técnico.
- Prompts Codex.
- Pruebas funcionales.

Los guardrails deberán desarrollarse con detalle en:

- `05_Arquitectura_Funcional/modulos_mvp.md`
- `05_Arquitectura_Funcional/modelo_de_estados.md`
- `07_Modelo_Tecnico/arquitectura_tecnica.md`
- `07_Modelo_Tecnico/webhook_y_eventos.md`
- `09_Pruebas_y_Validacion/checklist_funcional_mvp.md`
- `10_Backlog/backlog_tecnico.md`

La arquitectura funcional define qué debe existir. Los documentos siguientes definirán cómo se organiza, en qué estados vive y cómo se prueba.

## 21. Cierre del documento

La arquitectura funcional debe proteger el equilibrio de Gamora: mínima fricción para el usuario operativo y máximo control formal dentro de Gamora Core.

WhatsApp debe facilitar la operación cotidiana. La web/PWA debe dar control. Gamora Core debe gobernar compromisos, permisos, evidencias, estados y bitácora. La IA debe ayudar a interpretar, pero el backend y el humano autorizado deben preservar la confianza del sistema.
