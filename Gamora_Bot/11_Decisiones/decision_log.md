# Decision Log â€” Gamora Bot

## D-001 â€” Gamora Bot como canal formal de compromisos operativos sobre WhatsApp

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n fundacional de producto / MVP

### DecisiÃ³n

Gamora Bot no intentarÃ¡ leer todos los chats existentes ni dependerÃ¡ de conversaciones personales sueltas.

Su funciÃ³n serÃ¡ convertirse en el canal formal controlado donde se registran, asignan, documentan, revisan y cierran los compromisos importantes.

La conversaciÃ³n informal puede seguir ocurriendo en WhatsApp personal, pero cuando un acuerdo se convierte en compromiso, tarea, entrega, evidencia, aprobaciÃ³n o seguimiento, debe ingresar al nÃºmero oficial de WhatsApp Business de Gamora Bot.

### RazÃ³n

Esta decisiÃ³n evita construir el producto sobre una premisa tÃ©cnicamente riesgosa, invasiva o difÃ­cil de escalar. Gamora Bot debe operar sobre un canal controlado, auditable y trazable.

### Implicaciones

- El MVP se diseÃ±arÃ¡ alrededor de un nÃºmero oficial de WhatsApp Business.
- Los usuarios enviarÃ¡n mensajes, archivos, audios y evidencias al nÃºmero de Gamora Bot.
- Gamora Bot enviarÃ¡ instrucciones, tareas, recordatorios y solicitudes desde ese mismo nÃºmero.
- WhatsApp personal seguirÃ¡ existiendo para conversaciÃ³n informal.
- Todo compromiso formal deberÃ¡ registrarse dentro de Gamora Bot.
- La interfaz web funcionarÃ¡ como tablero de control, revisiÃ³n, trazabilidad y reportes.

## D-002 â€” MÃ©todo de trabajo: Luis valida, ChatGPT diseÃ±a y Codex ejecuta

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n metodolÃ³gica / gobernanza del proyecto

### DecisiÃ³n

El proyecto Gamora Bot serÃ¡ construido bajo un esquema de trabajo guiado, incremental y validado fase por fase.

ChatGPT actuarÃ¡ como Arquitecto funcional, tÃ©cnico y metodolÃ³gico. Luis Felipe GarcÃ­a Duarte actuarÃ¡ como Validador del proyecto, revisando y aprobando cada fase, subfase, flujo y decisiÃ³n relevante. Codex actuarÃ¡ como Desarrollador Senior y ejecutor documental/tÃ©cnico dentro del repositorio de Obsidian y, posteriormente, dentro del repositorio de cÃ³digo del MVP.

Luis Felipe no construirÃ¡ manualmente la documentaciÃ³n dentro de Obsidian. Su responsabilidad serÃ¡ crear la carpeta principal del proyecto, dar acceso a Codex y validar los entregables. Codex serÃ¡ responsable de crear carpetas, archivos, Ã­ndices, documentos y actualizaciones siguiendo las instrucciones del Arquitecto.

### RazÃ³n

Esta metodologÃ­a evita dispersiÃ³n, pÃ©rdida de hilo y construcciÃ³n manual desordenada. TambiÃ©n permite mantener trazabilidad entre tesis, decisiones, customer journey, benchmark, arquitectura funcional, modelo tÃ©cnico, prompts de desarrollo y validaciones del MVP.

### Implicaciones

- Todo documento nuevo deberÃ¡ ser creado o actualizado por Codex.
- ChatGPT entregarÃ¡ instrucciones precisas para cada avance.
- Luis Felipe validarÃ¡ antes de pasar a la siguiente fase.
- No se avanzarÃ¡ a desarrollo tÃ©cnico sin documentaciÃ³n funcional previamente aprobada.
- Obsidian serÃ¡ el repositorio maestro del conocimiento del proyecto.
- El proyecto se desarrollarÃ¡ de forma incremental, evitando saltos prematuros al cÃ³digo.

## D-003 â€” AprobaciÃ³n de la tesis formal v0.3 de Gamora Bot

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n conceptual / cierre de fase

### DecisiÃ³n

Se aprueba la tesis formal v0.3 de Gamora Bot como base conceptual del proyecto.

La tesis establece que Gamora Bot no serÃ¡ un gestor de tareas tradicional, un vigilante de chats personales ni un WhatsApp interno para empleados. Gamora Bot serÃ¡ un motor de compromisos operativos para usuarios autorizados, con WhatsApp Business como canal operativo principal del MVP y web/PWA como capa formal de control.

El objeto central del producto serÃ¡ el compromiso operativo: una unidad mÃ­nima de seguimiento compuesta por responsable, fecha compromiso, evidencia esperada, estado, bitÃ¡cora y cierre.

### RazÃ³n

La versiÃ³n v0.3 fortalece la claridad estratÃ©gica del producto al incorporar:

- Gamora Core como nÃºcleo independiente de WhatsApp.
- WhatsApp Business como canal operativo principal del MVP.
- Web/PWA como capa formal de administraciÃ³n, revisiÃ³n y trazabilidad.
- Despliegue inmediato con fricciÃ³n mÃ­nima.
- Landing page, QR y click-to-chat como flujo futuro de adopciÃ³n.
- Usuario nuevo vs usuario recurrente.
- Onboarding web responsivo.
- InvitaciÃ³n vs enrolamiento.
- Usuarios autorizados como base del modelo.
- RestricciÃ³n de no posicionar Gamora como herramienta interna de empleados.
- IA auxiliar con confirmaciÃ³n humana.
- Trial futuro de costo controlado.

### Implicaciones

- La Fase 1 queda cerrada formalmente.
- La tesis v0.3 serÃ¡ la base para Customer Journey, Benchmark, arquitectura funcional, flujos MVP y modelo tÃ©cnico.
- El flujo de onboarding y enrolamiento queda reconocido como flujo fundacional del producto.
- No se debe cambiar el principio fundacional sin una nueva decisiÃ³n registrada.
- La siguiente fase activa serÃ¡ Fase 2 â€” Customer Journey PyME.

## D-004 â€” WhatsApp como canal operativo y enrolamiento obligatorio de usuarios

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n funcional / cumplimiento / adopciÃ³n

### DecisiÃ³n

Gamora Bot serÃ¡ diseÃ±ado como un motor de compromisos operativos con WhatsApp Business como canal operativo principal del MVP y web/PWA como capa formal de control.

El producto no se posicionarÃ¡ como herramienta de comunicaciÃ³n interna entre empleados ni como reemplazo de plataformas colaborativas empresariales. Gamora Bot operarÃ¡ con usuarios autorizados que hayan aceptado participar en un espacio de trabajo y recibir mensajes operativos relacionados con compromisos especÃ­ficos.

NingÃºn usuario recibirÃ¡ compromisos por WhatsApp hasta completar su enrolamiento.

### RazÃ³n

Esta decisiÃ³n reduce riesgos relacionados con privacidad, opt-in, mensajes no esperados, restricciones de Meta/WhatsApp Business, percepciÃ³n de vigilancia y escalabilidad del producto.

TambiÃ©n permite mantener la experiencia de baja fricciÃ³n sin depender de leer chats personales ni convertir WhatsApp en el Ãºnico sistema completo.

### Implicaciones

- La landing page y QR serÃ¡n parte del flujo futuro de adopciÃ³n.
- WhatsApp serÃ¡ la puerta de entrada y canal operativo principal.
- La web/PWA serÃ¡ necesaria para configuraciÃ³n, control, revisiÃ³n, permisos y reportes.
- La invitaciÃ³n de usuario no equivale a enrolamiento.
- El enrolamiento ocurre cuando el usuario acepta participar desde su propio WhatsApp.
- Gamora debe registrar consentimiento, estado del usuario y opciÃ³n de baja.
- Gamora Core deberÃ¡ ser independiente del canal WhatsApp.
- El MVP deberÃ¡ demostrar operaciÃ³n real por WhatsApp Business, pero sin depender de comunicaciÃ³n interna no consentida.

## D-005 â€” Soporte para escenarios operativos complejos y reportes parciales

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n funcional / arquitectura conceptual

### DecisiÃ³n

Gamora Bot deberÃ¡ diseÃ±arse para soportar tanto compromisos simples como escenarios operativos complejos.

AdemÃ¡s de compromisos individuales, Gamora Core deberÃ¡ contemplar proyectos, hitos, reportes parciales, evidencias, avance reportado, avance validado, correcciones, validaciones iterativas y bitÃ¡cora.

El caso Sunworks se adopta como caso de estrÃ©s funcional para validar esta capacidad.

### RazÃ³n

Los casos simples como FerreterÃ­a Luisito y Mina Mercedes validan la creaciÃ³n, asignaciÃ³n, evidencia, revisiÃ³n y cierre de compromisos. Sin embargo, operaciones reales mÃ¡s complejas pueden requerir seguimiento por etapas, porcentajes, evidencias repetidas y supervisiÃ³n parcial.

DiseÃ±ar Gamora Ãºnicamente para tareas simples limitarÃ­a su valor y podrÃ­a obligar a rediseÃ±os costosos.

### Implicaciones

- El objeto central seguirÃ¡ siendo el compromiso operativo.
- Algunos compromisos podrÃ¡n pertenecer a proyectos, hitos o ciclos de validaciÃ³n mÃ¡s largos.
- La IA serÃ¡ usada para interpretar lenguaje natural, audios, alias y contexto.
- El backend determinÃ­stico gobernarÃ¡ permisos, estados, porcentajes, evidencias, bitÃ¡coras y validaciones.
- El avance oficial deberÃ¡ ser el avance validado por un supervisor, no solo el avance reportado por campo.
- Los identificadores tÃ©cnicos serÃ¡n internos; el usuario operativo podrÃ¡ usar nombres naturales, alias o selecciÃ³n guiada.
- Sunworks se documentarÃ¡ como flujo de estrÃ©s funcional.
- Esta decisiÃ³n deberÃ¡ considerarse en arquitectura funcional, modelo de datos y prompts tÃ©cnicos futuros.

## D-006 â€” AprobaciÃ³n de Fase 2: Customer Journey PyME

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre de fase / experiencia de usuario

### DecisiÃ³n

Se aprueba la Fase 2 â€” Customer Journey PyME como base de experiencia de adopciÃ³n, dolor operativo y percepciÃ³n de valor de Gamora Bot.

Los documentos aprobados son:

- `02_Customer_Journey/customer_journey_pyme.md`
- `02_Customer_Journey/mapa_dolores_pyme.md`
- `02_Customer_Journey/momentos_de_valor.md`

### RazÃ³n

La Fase 2 permite entender cÃ³mo una PyME descubre, comprende, prueba, adopta y expande Gamora Bot. TambiÃ©n documenta los dolores operativos que justifican el producto y los momentos donde el usuario percibe valor real.

La fase confirma que Gamora debe venderse desde la pÃ©rdida de seguimiento operativo, no desde la categorÃ­a de task manager.

### Implicaciones

- El Customer Journey serÃ¡ base para marketing, onboarding, diseÃ±o funcional y validaciÃ³n comercial.
- El Mapa de Dolores serÃ¡ base para narrativa comercial, priorizaciÃ³n de funcionalidades y entrevistas con PyMEs.
- Los Momentos de Valor serÃ¡n base para diseÃ±o de MVP, mÃ©tricas de activaciÃ³n y demostraciones.
- La siguiente fase activa serÃ¡ Fase 3 â€” Benchmark.

## D-007 â€” AprobaciÃ³n de Fase 3: Benchmark competitivo

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre de fase / benchmark competitivo

### DecisiÃ³n

Se aprueba la Fase 3 â€” Benchmark competitivo de Gamora Bot.

Los documentos aprobados son:

- `03_Benchmark/benchmark_tasks_bot.md`
- `03_Benchmark/competidores_adicionales.md`
- `03_Benchmark/matriz_comparativa.md`

### RazÃ³n

La Fase 3 permitiÃ³ confirmar que la categorÃ­a â€œtareas por WhatsAppâ€ ya existe y estÃ¡ activa. Tasks.Bot se identifica como competidor directo principal; Any.do WhatsApp y Blueticks quedan como referencias principales adicionales; Briefmatic queda como candidato secundario a monitorear; y Meta Business Agent queda como amenaza estratÃ©gica / actor de plataforma.

El benchmark confirma que Gamora Bot no debe competir Ãºnicamente como â€œgestor de tareas por WhatsAppâ€, sino construir una categorÃ­a mÃ¡s robusta: compromisos operativos trazables con evidencia, validaciÃ³n, bitÃ¡cora, usuarios autorizados, enrolamiento, web/PWA de control y capacidad para escenarios simples y complejos.

### Implicaciones

- Gamora no debe usar como mensaje principal â€œgestor de tareas por WhatsAppâ€.
- La narrativa debe enfocarse en compromisos operativos trazables.
- WhatsApp serÃ¡ la puerta operativa; la web/PWA serÃ¡ la capa formal de control.
- El cumplimiento, opt-in, enrolamiento y baja deben tratarse como ventaja de diseÃ±o.
- Los casos Mina Mercedes, FerreterÃ­a Luisito y Sunworks deberÃ¡n usarse para demostrar diferenciaciÃ³n funcional.
- La siguiente fase activa serÃ¡ Fase 4 â€” RegulaciÃ³n, Meta y Riesgos.

## D-008 â€” AprobaciÃ³n de Fase 4: RegulaciÃ³n, Meta y Riesgos

**Fecha:** 2026-06-05  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre de fase / regulaciÃ³n funcional / gestiÃ³n de riesgos

### DecisiÃ³n

Se aprueba la Fase 4 â€” RegulaciÃ³n, Meta y Riesgos de Gamora Bot.

Los documentos aprobados son:

- `04_Regulatorio_y_Meta/restricciones_meta_whatsapp.md`
- `04_Regulatorio_y_Meta/privacidad_datos_mexico.md`
- `04_Regulatorio_y_Meta/riesgos_operativos_y_legales.md`

### RazÃ³n

La Fase 4 traduce restricciones de Meta/WhatsApp Business, principios de privacidad de datos en MÃ©xico y riesgos operativos-legales en reglas funcionales para el MVP.

La fase confirma que Gamora Bot debe diseÃ±arse con consentimiento, opt-in, opt-out, usuarios autorizados, enrolamiento obligatorio, evidencias protegidas, roles, permisos, bitÃ¡cora, separaciÃ³n por empresa, control humano sobre acciones crÃ­ticas y uso responsable de IA.

### Implicaciones

- Gamora no debe leer chats personales.
- Gamora no debe enviar compromisos por WhatsApp a usuarios no enrolados.
- Gamora no debe posicionarse como WhatsApp interno para empleados.
- El consentimiento, opt-in, opt-out y baja serÃ¡n reglas funcionales del MVP.
- La privacidad de evidencias debe tratarse como riesgo crÃ­tico.
- La IA interpretarÃ¡, pero no aprobarÃ¡, cerrarÃ¡ ni ejecutarÃ¡ acciones crÃ­ticas sin validaciÃ³n.
- El backend deberÃ¡ gobernar reglas, permisos, estados, bitÃ¡coras y validaciones.
- El avance reportado y avance validado deberÃ¡n mantenerse separados en escenarios complejos.
- La siguiente fase activa serÃ¡ Fase 5 â€” Arquitectura Funcional.

## D-009 â€” AI & API Guardrails como regla obligatoria del MVP

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n funcional / arquitectura / control de costos

### DecisiÃ³n

Gamora Bot deberÃ¡ incluir desde el diseÃ±o funcional una capa obligatoria de AI & API Guardrails.

Esta capa deberÃ¡ proteger el MVP contra alucinaciones, bucles conversacionales, reintentos infinitos, duplicaciÃ³n de mensajes, procesamiento repetido de eventos, acciones crÃ­ticas no autorizadas, uso excesivo de OpenAI API, uso excesivo de WhatsApp Business API y costos inesperados de APIs de pago.

### RazÃ³n

Gamora Bot dependerÃ¡ de APIs de pago y canales regulados. Una falla de diseÃ±o, una alucinaciÃ³n, un webhook duplicado, un loop conversacional o una automatizaciÃ³n sin lÃ­mites puede generar costos inesperados, mala experiencia, riesgo de bloqueo del canal y pÃ©rdida de confianza.

El MVP debe ser completamente funcional, pero no puede operar sin controles de consumo, lÃ­mites, trazabilidad y capacidad de apagado seguro.

### Implicaciones

- Toda llamada a IA debe tener propÃ³sito funcional claro.
- Toda acciÃ³n crÃ­tica debe pasar por backend y, cuando aplique, confirmaciÃ³n humana.
- Todo uso de API de pago debe registrarse.
- Deben existir lÃ­mites por empresa, usuario, conversaciÃ³n y periodo.
- Deben existir lÃ­mites de mensajes, recordatorios, reintentos y llamadas a IA.
- Debe existir prevenciÃ³n de loops conversacionales.
- Debe existir prevenciÃ³n de mensajes duplicados por eventos repetidos.
- Debe existir capacidad de pausar automatizaciones o apagar flujos ante comportamiento anÃ³malo.
- El diseÃ±o tÃ©cnico posterior deberÃ¡ incluir mediciÃ³n de consumo, logs, alertas, rate limits, idempotencia, circuit breakers y controles de costo.
- Esta decisiÃ³n deberÃ¡ reflejarse en mÃ³dulos MVP, modelo de estados, modelo tÃ©cnico, pruebas funcionales y backlog tÃ©cnico.

## D-010 â€” AprobaciÃ³n de Fase 5: Arquitectura Funcional

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre de fase / arquitectura funcional MVP

### DecisiÃ³n

Se aprueba la Fase 5 â€” Arquitectura Funcional de Gamora Bot.

Los documentos aprobados son:

- `05_Arquitectura_Funcional/arquitectura_funcional.md` v0.2
- `05_Arquitectura_Funcional/modulos_mvp.md` v0.2
- `05_Arquitectura_Funcional/modelo_de_estados.md` v0.1

### RazÃ³n

La Fase 5 convierte la tesis, el customer journey, el benchmark, las restricciones regulatorias y los riesgos en una arquitectura funcional clara para el MVP.

La fase define que Gamora Bot operarÃ¡ con WhatsApp Business como canal operativo, web/PWA como capa formal de control, Gamora Core como nÃºcleo funcional, IA auxiliar limitada, backend gobernando reglas, humano validando acciones crÃ­ticas y AI & API Guardrails como capa obligatoria para proteger consumo, costos, loops, duplicados y acciones no autorizadas.

### Implicaciones

- El MVP deberÃ¡ demostrar el ciclo completo: crear, asignar, aceptar, evidenciar, notificar evidencia recibida, revisar, aprobar/rechazar, cerrar, consultar y registrar bitÃ¡cora.
- NingÃºn usuario recibirÃ¡ compromisos por WhatsApp sin enrolamiento.
- Las evidencias deberÃ¡n asociarse al compromiso correcto y notificar al coordinador/validador cuando queden pendientes de revisiÃ³n.
- La IA interpretarÃ¡, pero no aprobarÃ¡, cerrarÃ¡ ni ejecutarÃ¡ acciones crÃ­ticas sin backend y humano autorizado.
- El modelo deberÃ¡ distinguir estados de usuario, invitaciÃ³n, compromiso, evidencia, validaciÃ³n, notificaciÃ³n, conversaciÃ³n WhatsApp, IA, guardrails, webhooks/eventos, proyectos, hitos y reportes parciales.
- AI & API Guardrails serÃ¡n obligatorios desde el MVP.
- El alcance MVP queda acotado a compromisos operativos trazables, evidencia, validaciÃ³n, bitÃ¡cora, notificaciones, consultas bÃ¡sicas y guardrails mÃ­nimos.
- Proyectos/hitos tipo Sunworks quedan como MVP+ o estrÃ©s funcional controlado, sin prometer gestiÃ³n total de proyectos.
- La siguiente fase activa serÃ¡ Fase 6 â€” Flujos MVP.

## D-011 â€” AprobaciÃ³n de Fase 6: Flujos MVP

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre de fase / flujos funcionales MVP

### DecisiÃ³n

Se aprueba la Fase 6 â€” Flujos MVP de Gamora Bot.

Los documentos aprobados son:

- `06_Flujos_MVP/flujo_creacion_pendiente.md` v0.1
- `06_Flujos_MVP/flujo_evidencia_aprobacion_cierre.md` v0.1
- `06_Flujos_MVP/flujo_reportes_y_resumenes.md` v0.1
- `06_Flujos_MVP/flujo_mina_mercedes.md` v0.1
- `06_Flujos_MVP/flujo_sunworks_hitos_avances_parciales.md` v0.2

### RazÃ³n

La Fase 6 convierte la arquitectura funcional y el modelo de estados en flujos operativos concretos para el MVP.

Los flujos documentan cÃ³mo Gamora Bot crea compromisos operativos, valida datos mÃ­nimos, maneja responsables no enrolados, recibe evidencias, las asocia al compromiso correcto, notifica al coordinador/validador, permite revisiÃ³n desde web/PWA, aprueba, solicita correcciÃ³n, rechaza, cierra, consulta estados y genera reportes/resÃºmenes.

TambiÃ©n documentan los casos operativos Mina Mercedes y Sunworks. Mina Mercedes valida un escenario multi-actor real con dependencias entre personas y contratistas. Sunworks valida el estrÃ©s funcional de proyectos por hitos, reportes parciales, evidencias iterativas, avance reportado vs avance validado y validaciÃ³n supervisora.

### Implicaciones

- El MVP deberÃ¡ demostrar el flujo completo: crear, asignar, aceptar, evidenciar, notificar, revisar, aprobar/rechazar, cerrar, consultar y reportar.
- Gamora deberÃ¡ bloquear mensajes a usuarios no enrolados.
- La evidencia deberÃ¡ asociarse al compromiso correcto antes de revisiÃ³n o cierre.
- La evidencia recibida no equivale a aprobaciÃ³n.
- El coordinador/validador deberÃ¡ recibir notificaciÃ³n cuando exista evidencia pendiente de revisiÃ³n.
- CorrecciÃ³n, rechazo y aprobaciÃ³n deberÃ¡n quedar diferenciados.
- Las dependencias entre compromisos deberÃ¡n distinguir bloqueo por insumo de incumplimiento.
- Los reportes deberÃ¡n basarse en estados reales y respetar permisos.
- Los guardrails deberÃ¡n proteger contra loops, duplicados, reintentos infinitos, consumo excesivo y acciones crÃ­ticas no autorizadas.
- Sunworks queda como MVP+ / estrÃ©s funcional controlado, no como promesa de gestiÃ³n total de proyectos.
- La siguiente fase activa serÃ¡ Fase 7 â€” Modelo TÃ©cnico.

## D-012 â€” AprobaciÃ³n de Fase 7: Modelo TÃ©cnico

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre de fase / modelo tÃ©cnico MVP

### DecisiÃ³n

Se aprueba la Fase 7 â€” Modelo TÃ©cnico de Gamora Bot.

Los documentos aprobados son:

- `07_Modelo_Tecnico/arquitectura_tecnica.md` v0.1
- `07_Modelo_Tecnico/modelo_datos.md` v0.1
- `07_Modelo_Tecnico/integracion_whatsapp_business_api.md` v0.1
- `07_Modelo_Tecnico/webhook_y_eventos.md` v0.1

### RazÃ³n

La Fase 7 traduce la arquitectura funcional, mÃ³dulos MVP, modelo de estados y flujos aprobados en una base tÃ©cnica de alto nivel para construir un MVP real, conectado y medible.

La fase define que Gamora Bot deberÃ¡ operar con WhatsApp Business Cloud API como canal oficial, OpenAI API como servicio auxiliar de interpretaciÃ³n, Gamora Core como backend central, PostgreSQL como base recomendada para MVP real, almacenamiento privado de evidencias, web/PWA de control, autenticaciÃ³n, logs, auditorÃ­a, observabilidad y AI & API Guardrails tÃ©cnicos mÃ­nimos.

### Implicaciones

- El MVP no serÃ¡ una simulaciÃ³n; deberÃ¡ contemplar integraciÃ³n real con WhatsApp Business API y OpenAI API.
- Gamora Core serÃ¡ la fuente de verdad, no WhatsApp.
- WhatsApp serÃ¡ canal operativo; web/PWA serÃ¡ capa de control.
- PostgreSQL queda como recomendaciÃ³n para MVP real.
- Las evidencias deberÃ¡n almacenarse en storage privado, no depender de WhatsApp como repositorio.
- El webhook deberÃ¡ ser liviano y delegar lÃ³gica a Event Processor / Gamora Core.
- Todo evento deberÃ¡ validarse, registrarse, deduplicarse y procesarse con idempotencia.
- Los mensajes salientes deberÃ¡n respetar opt-in, opt-out, enrolamiento, templates cuando aplique y guardrails.
- Los guardrails tÃ©cnicos deberÃ¡n incluir rate limits, lÃ­mites de IA, lÃ­mites de WhatsApp, reintentos limitados, deduplicaciÃ³n, circuit breaker, pausa manual, logging de consumo y bloqueo de acciones no autorizadas.
- Se deberÃ¡n registrar `webhook_events`, `messages`, `notifications`, `audit_logs`, `state_transitions`, `ai_usage_logs`, `api_usage_logs` y `guardrail_events`.
- Quedan pendientes de validaciÃ³n tÃ©cnica: WABA central vs WABA por cliente, BSP vs Cloud API directa, templates, costos, media, proveedor cloud, proveedor storage, proveedor auth y estrategia de monitoreo.
- La siguiente fase activa serÃ¡ Fase 8 â€” Prompts Codex.

## D-013 â€” Interfaz MVP neutral antes de identidad visual definitiva

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de producto / diseÃ±o / marca

### DecisiÃ³n

Durante las primeras etapas del MVP de Gamora Bot, la interfaz web/PWA deberÃ¡ construirse como una interfaz funcional, plana, neutral y sin identidad visual definitiva.

La interfaz no deberÃ¡ heredar estilos, paletas, componentes, patrones visuales ni estÃ©tica de proyectos anteriores como VerifyQA, Orkesta, NILO u otros.

### RazÃ³n

Gamora Bot es un producto nuevo y requiere una identidad visual propia.

Antes de diseÃ±ar la marca final, el MVP debe validar funcionalidad, navegaciÃ³n, datos, estados, acciones, trazabilidad y operaciÃ³n bÃ¡sica del motor de compromisos.

DiseÃ±ar demasiado pronto puede contaminar la identidad del producto con decisiones visuales provisionales o heredadas de otros proyectos.

### Implicaciones

- MVP 2 debe priorizar funcionalidad sobre estÃ©tica final.
- La interfaz debe ser limpia, clara, legible y ordenada.
- No debe usar diseÃ±o corporativo definitivo.
- No debe usar logotipo definitivo.
- No debe usar paleta definitiva de marca.
- No debe usar ilustraciones, avatares ni iconografÃ­a de marca.
- No debe parecer VerifyQA, Orkesta, NILO ni ningÃºn proyecto previo.
- Debe evitar estilos visuales excesivos, gradientes, fondos complejos, sombras pesadas o efectos innecesarios.
- Debe quedar preparada para recibir posteriormente un sistema de diseÃ±o propio.
- La identidad visual de Gamora Bot se desarrollarÃ¡ en una fase posterior dedicada a marca, producto y diseÃ±o UI/PWA.

### Regla prÃ¡ctica

MVP 2 debe verse como una consola funcional neutral o wireframe operativo, no como el producto visual final.

## D-014 â€” UI/UX guiado por Customer Journey y menor fricciÃ³n

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de producto / UX / experiencia de usuario

### DecisiÃ³n

Las interfaces futuras de Gamora Bot deberÃ¡n diseÃ±arse a partir del Customer Journey y de las necesidades reales del usuario, no a partir de la cantidad de informaciÃ³n disponible en el sistema.

El principio rector de UI/UX serÃ¡:

â€œMÃ¡s poder con menos fricciÃ³n.â€

### RazÃ³n

Gamora Bot busca resolver seguimiento operativo para usuarios PyME que necesitan rapidez, claridad e inmediatez.

Si la interfaz muestra demasiada informaciÃ³n al mismo tiempo, el usuario puede saturarse, confundirse o percibir Gamora como un sistema pesado.

El Customer Journey fue construido para entender cÃ³mo descubre, adopta, opera y valora el usuario el producto. Por lo tanto, la interfaz debe traducir ese recorrido en pantallas simples, guiadas y accionables.

### Implicaciones

- Las pantallas no deben mostrar todo al mismo tiempo.
- La experiencia debe priorizar la siguiente acciÃ³n Ãºtil.
- El usuario debe ver primero lo que requiere atenciÃ³n.
- La informaciÃ³n tÃ©cnica debe quedar en segundo nivel.
- Audit, timeline, logs y guardrails son importantes, pero no deben dominar la vista principal.
- Se debe usar divulgaciÃ³n progresiva: resumen primero, detalle despuÃ©s.
- Las vistas deben organizarse por intenciÃ³n del usuario, no solo por entidades tÃ©cnicas.
- La interfaz debe reducir carga mental.
- La navegaciÃ³n debe ser simple y directa.
- El usuario debe poder entender quÃ© pasÃ³, quÃ© falta y quÃ© debe hacer.
- La interfaz debe reforzar facilidad, inmediatez y control.
- El diseÃ±o final de marca deberÃ¡ respetar esta regla.

### Regla prÃ¡ctica

Antes de diseÃ±ar o modificar cualquier pantalla futura, se debe responder:

1. Â¿QuÃ© usuario estÃ¡ usando esta pantalla?
2. Â¿En quÃ© momento del Customer Journey se encuentra?
3. Â¿QuÃ© necesita resolver ahora?
4. Â¿CuÃ¡l es la acciÃ³n principal que debe tomar?
5. Â¿QuÃ© informaciÃ³n puede ocultarse hasta que la necesite?
6. Â¿La pantalla reduce o aumenta fricciÃ³n?
7. Â¿La pantalla da mÃ¡s poder sin saturar?

## D-015 â€” AprobaciÃ³n de MVP 2: Interfaz Web Inicial de Control

**Fecha:** 2026-06-06  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre tÃ©cnico / MVP

### DecisiÃ³n

Se aprueba MVP 2 â€” Interfaz Web Inicial de Control de Gamora Bot.

MVP 2 queda validado como una consola web neutral que permite operar visualmente el motor inicial de compromisos construido en MVP 1.

### Alcance aprobado

MVP 2 permite:

- visualizar estado backend/DB;
- listar workspaces;
- listar usuarios;
- listar compromisos;
- abrir detalle de compromiso;
- ejecutar acciones de compromiso;
- ver timeline;
- ver audit bÃ¡sico;
- ver guardrails;
- mostrar errores de transiciÃ³n;
- operar localmente el motor de compromisos desde web.

### RazÃ³n

MVP 2 cumple el objetivo de hacer visible y operable el motor persistente de compromisos sin depender de Postman, comandos manuales o inspecciÃ³n directa de base de datos.

El hito confirma que Gamora Bot ya cuenta con:

- motor backend funcional;
- persistencia real PostgreSQL;
- endpoints REST;
- interfaz web local;
- trazabilidad bÃ¡sica;
- acciones controladas;
- validaciÃ³n visual inicial.

### Implicaciones

- MVP 2 no representa la identidad visual final de Gamora Bot.
- MVP 2 no representa la UX final del producto.
- La interfaz actual debe entenderse como consola tÃ©cnica neutral.
- Las prÃ³ximas interfaces deberÃ¡n diseÃ±arse desde Customer Journey y menor fricciÃ³n.
- OpenAI y WhatsApp permanecen apagados.
- No se debe avanzar a canales externos hasta que la web permita control claro y no saturado.
- La siguiente evoluciÃ³n recomendada es trabajar una capa de UX orientada a intenciÃ³n del usuario antes de conectar WhatsApp real.

### Restricciones vigentes

- No conectar OpenAI real todavÃ­a.
- No conectar WhatsApp real todavÃ­a.
- No implementar identidad visual final todavÃ­a.
- No implementar Mina Mercedes ni Sunworks todavÃ­a.
- No tratar la consola MVP 2 como producto final.
- No saturar futuras pantallas con entidades tÃ©cnicas.

### Siguiente paso recomendado

Preparar una fase posterior enfocada en UX orientada a intenciÃ³n del usuario, manteniendo el principio:

â€œMÃ¡s poder con menos fricciÃ³n.â€

## D-016 â€” AprobaciÃ³n de MVP 2.1: Reordenamiento UX por IntenciÃ³n del Usuario

**Fecha:** 2026-06-07  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre tÃ©cnico / UX / MVP

### DecisiÃ³n

Se aprueba MVP 2.1 â€” Reordenamiento UX por IntenciÃ³n del Usuario de Gamora Bot.

MVP 2.1 queda validado como el primer paso prÃ¡ctico para transformar la consola tÃ©cnica de MVP 2 en una experiencia mÃ¡s alineada al Customer Journey y al principio:

â€œMÃ¡s poder con menos fricciÃ³n.â€

### Alcance aprobado

MVP 2.1 permite:

- iniciar la experiencia desde â€œMi dia operativoâ€;
- mostrar primero lo que requiere atenciÃ³n;
- agrupar compromisos por atenciÃ³n requerida;
- mostrar vencidos o en riesgo;
- mostrar pendientes por revisar;
- mostrar compromisos activos;
- mostrar responsables con pendientes;
- mostrar actividad reciente;
- filtrar acciones segÃºn estado;
- mantener detalle de compromiso como segundo nivel;
- mantener timeline, bitÃ¡cora y guardrails como informaciÃ³n secundaria;
- usar lenguaje mÃ¡s humano y menos tÃ©cnico.

### RazÃ³n

MVP 2 ya hacÃ­a visible el motor de compromisos, pero todavÃ­a podÃ­a sentirse como una consola tÃ©cnica saturada.

MVP 2.1 empieza a orientar la experiencia hacia la intenciÃ³n real del usuario: saber quÃ© pasÃ³, quÃ© falta, quÃ© requiere atenciÃ³n y quÃ© acciÃ³n debe tomar.

### Implicaciones

- MVP 2.1 no representa la UX final del producto.
- MVP 2.1 no representa identidad visual final.
- La interfaz sigue siendo neutral, plana y funcional.
- La experiencia debe seguir refinÃ¡ndose desde Customer Journey.
- No se debe avanzar todavÃ­a a WhatsApp real ni OpenAI real.
- No se debe avanzar todavÃ­a a marca final.
- La siguiente evoluciÃ³n recomendada es validar un caso de uso completo de punta a punta con FerreterÃ­a Luisito.

### Restricciones vigentes

- No conectar OpenAI real todavÃ­a.
- No conectar WhatsApp real todavÃ­a.
- No implementar identidad visual final todavÃ­a.
- No implementar Mina Mercedes ni Sunworks todavÃ­a.
- No tratar MVP 2.1 como producto final.
- No saturar futuras pantallas con entidades tÃ©cnicas.

### Siguiente paso recomendado

Preparar MVP 2.2 â€” Journey Simulado FerreterÃ­a Luisito, para validar una experiencia de punta a punta desde entrada simulada por QR/WhatsApp, onboarding, alta de empresa, tiendas, colaboradores y primer compromiso operativo.

## D-017 â€” CorrecciÃ³n de roadmap incremental: configuraciÃ³n operativa antes de creaciÃ³n de compromisos

**Fecha:** 2026-06-07  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de producto / roadmap / UX funcional

### DecisiÃ³n

Se descarta por ahora la bifurcaciÃ³n MVP 2.2 â€” Journey Simulado FerreterÃ­a Luisito.

La siguiente etapa incremental serÃ¡:

MVP 2.2 â€” ConfiguraciÃ³n mÃ­nima operativa.

DespuÃ©s vendrÃ¡:

MVP 2.3 â€” CreaciÃ³n guiada de compromisos desde web.

### RazÃ³n

Simular landing page, QR y entrada previa no genera suficiente valor en este momento y puede producir cÃ³digo desechable.

AdemÃ¡s, antes de crear compromisos, Gamora necesita conocer el contexto operativo mÃ­nimo del cliente:

- negocio o espacio operativo;
- tiendas, sucursales o frentes;
- personas responsables;
- roles operativos bÃ¡sicos;
- relaciÃ³n entre personas y espacio operativo.

Sin ese contexto, la creaciÃ³n de compromisos queda dÃ©bil, porque el usuario no puede seleccionar responsable, frente, fecha o evidencia de forma natural.

### Implicaciones

- MVP 2.2 se enfocarÃ¡ en configurar el entorno operativo mÃ­nimo.
- MVP 2.3 se enfocarÃ¡ en crear compromisos usando ese entorno.
- No se conectarÃ¡ WhatsApp real todavÃ­a.
- No se conectarÃ¡ OpenAI real todavÃ­a.
- No se implementarÃ¡ landing page ni QR simulado por ahora.
- No se avanzarÃ¡ a identidad visual final.
- La experiencia seguirÃ¡ basada en Customer Journey, benchmark, reglas, polÃ­ticas y UX por intenciÃ³n del usuario.
- La prioridad es construir funcionalidad reusable, no simulaciones desechables.

### Roadmap incremental corregido

1. MVP 2.2 â€” ConfiguraciÃ³n mÃ­nima operativa.
2. MVP 2.3 â€” CreaciÃ³n guiada de compromisos desde web.
3. MVP 2.4 â€” Evidencias simuladas/controladas desde web.
4. MVP 2.5 â€” Flujo completo web FerreterÃ­a Luisito.
5. MVP 3 â€” WhatsApp mock controlado.
6. MVP 4 â€” WhatsApp Cloud API real controlado.
7. MVP 5 â€” OpenAI controlado.
8. MVP 6 â€” Enrolamiento real.
9. MVP 7 â€” Evidencias reales por WhatsApp.
10. MVP 8 â€” Reportes operativos y resumen diario.
11. MVP 9 â€” Piloto local completo.
12. MVP 10 â€” PreparaciÃ³n staging / piloto real.

### Siguiente paso recomendado

Preparar y validar el prompt operativo de MVP 2.2 â€” ConfiguraciÃ³n mÃ­nima operativa.

## D-018 â€” AprobaciÃ³n de MVP 2.2: ConfiguraciÃ³n MÃ­nima Operativa

**Fecha:** 2026-06-07  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre tÃ©cnico / UX / MVP

### DecisiÃ³n

Se aprueba MVP 2.2 â€” ConfiguraciÃ³n MÃ­nima Operativa de Gamora Bot.

MVP 2.2 queda validado como el hito que permite configurar el contexto operativo mÃ­nimo de una PyME antes de crear compromisos.

### Alcance aprobado

MVP 2.2 permite:

- definir negocio o espacio operativo;
- administrar tiendas, sucursales o frentes;
- administrar personas responsables;
- asignar roles operativos bÃ¡sicos;
- relacionar personas con el espacio operativo;
- mostrar checklist de preparaciÃ³n;
- actualizar Mi dÃ­a operativo con el estado de preparaciÃ³n;
- preparar el contexto para crear compromisos en MVP 2.3.

### RazÃ³n

Antes de crear compromisos, Gamora necesita conocer el contexto operativo mÃ­nimo del cliente.

No tiene sentido seleccionar responsables, tiendas/frentes o contexto operativo si aÃºn no existen dentro de la plataforma.

MVP 2.2 consolida la lÃ³gica:

Primero configuro mi operaciÃ³n.
DespuÃ©s creo compromisos dentro de esa operaciÃ³n.

### Implicaciones

- MVP 2.2 no representa producto final.
- MVP 2.2 no representa identidad visual final.
- MVP 2.2 no conecta WhatsApp real.
- MVP 2.2 no conecta OpenAI real.
- MVP 2.2 prepara directamente MVP 2.3.
- La creaciÃ³n guiada de compromisos queda como siguiente bloque.
- FerreterÃ­a Luisito ya puede tener negocio, sucursales/frentes y personas responsables como contexto base.

### Restricciones vigentes

- No conectar OpenAI real todavÃ­a.
- No conectar WhatsApp real todavÃ­a.
- No implementar identidad visual final todavÃ­a.
- No implementar Mina Mercedes ni Sunworks todavÃ­a.
- No avanzar a MVP 3.
- No implementar evidencias reales todavÃ­a.
- No implementar autenticaciÃ³n final todavÃ­a.

### Siguiente paso recomendado

Preparar MVP 2.3 â€” CreaciÃ³n guiada de compromisos desde web.

## D-019 â€” AprobaciÃ³n de MVP 2.3: CreaciÃ³n Guiada de Compromisos desde Web

**Fecha:** 2026-06-07  
**Estado:** Aprobada  
**Tipo:** DecisiÃ³n de cierre tÃ©cnico / UX / MVP

### DecisiÃ³n

Se aprueba MVP 2.3 â€” CreaciÃ³n Guiada de Compromisos desde Web de Gamora Bot.

MVP 2.3 queda validado como el hito que permite convertir un pendiente operativo en un compromiso trazable desde la web/PWA, usando el contexto operativo configurado en MVP 2.2.

### Alcance aprobado

MVP 2.3 permite:

- crear compromisos desde web;
- usar el espacio operativo configurado;
- seleccionar tienda, sucursal o frente;
- seleccionar responsable;
- capturar descripciÃ³n del compromiso;
- definir fecha compromiso;
- capturar evidencia esperada;
- asignar prioridad;
- confirmar antes de crear;
- guardar el compromiso en PostgreSQL;
- mostrar el compromiso en Mi dÃ­a operativo;
- mostrar el compromiso en Compromisos;
- abrir detalle;
- validar estado PENDING_ACCEPTANCE;
- validar timeline;
- validar audit.

### RazÃ³n

DespuÃ©s de configurar la operaciÃ³n mÃ­nima en MVP 2.2, el siguiente paso lÃ³gico era permitir que el usuario creara compromisos usando ese contexto.

MVP 2.3 consolida la lÃ³gica:

Primero configuro mi operaciÃ³n.
DespuÃ©s convierto pendientes en compromisos trazables.

### Implicaciones

- MVP 2.3 no representa producto final.
- MVP 2.3 no representa identidad visual final.
- MVP 2.3 no conecta WhatsApp real.
- MVP 2.3 no conecta OpenAI real.
- MVP 2.3 no implementa evidencias reales.
- MVP 2.3 prepara directamente MVP 2.4.
- La siguiente evoluciÃ³n recomendada es permitir evidencias simuladas/controladas desde web para cerrar el ciclo operativo bÃ¡sico de compromiso â†’ avance/evidencia â†’ revisiÃ³n.

### Restricciones vigentes

- No conectar OpenAI real todavÃ­a.
- No conectar WhatsApp real todavÃ­a.
- No implementar identidad visual final todavÃ­a.
- No implementar Mina Mercedes ni Sunworks todavÃ­a.
- No avanzar a MVP 3.
- No implementar storage real todavÃ­a.
- No implementar evidencias reales por WhatsApp todavÃ­a.
- No implementar autenticaciÃ³n final todavÃ­a.

### Siguiente paso recomendado

Preparar MVP 2.4 â€” Evidencias simuladas/controladas desde web.

## D-020 â€” AprobaciÃ³n tÃ©cnica de MVP 2.4.2: SimplificaciÃ³n UX por actor y limpieza de datos demo

**Fecha:** 2026-06-12  
**Estado:** Aprobada tÃ©cnicamente / pendiente revisiÃ³n visual final  
**Tipo:** DecisiÃ³n de ajuste correctivo / UX / datos locales / MVP

### DecisiÃ³n

Se aprueba tÃ©cnicamente MVP 2.4.2 como ajuste correctivo de UX por actor y limpieza de datos demo locales.

MVP 2.4.2 no representa una nueva fase funcional mayor. Es un bloque de estabilizaciÃ³n para que la demo local de Gamora Bot sea mÃ¡s clara, menos saturada y revisable por actor.

### Alcance aprobado

MVP 2.4.2 incluye:

- selector de actor activo simulado;
- navegaciÃ³n por rol;
- Mi dÃ­a operativo simplificado por actor;
- detalle de compromiso separado en tabs: Resumen, Evidencia e Historial;
- limpieza real de datos demo locales;
- conservaciÃ³n de FerreterÃ­a Luisito;
- conservaciÃ³n de Dragon Ball Z;
- conservaciÃ³n de Super Admin global como actor simulado;
- aislamiento de datos por empresa.

### RazÃ³n

DespuÃ©s de MVP 2.4, la interfaz ya permitÃ­a operar compromisos y evidencias simuladas, pero podÃ­a sentirse cargada por navegaciÃ³n compleja, pantallas largas, scroll excesivo, detalle saturado y datos dummy residuales.

Para revisar correctamente la experiencia, era necesario separar la interfaz por actor y limpiar la base local.

### Implicaciones

- La demo local queda enfocada en FerreterÃ­a Luisito y Dragon Ball Z.
- Super Admin, Admin empresa y Colaborador tienen experiencias diferenciadas.
- Mi dÃ­a operativo queda como bandeja corta de acciones.
- El detalle de compromiso queda organizado por intenciÃ³n.
- Timeline y audit siguen disponibles, pero no dominan la vista inicial.
- Los datos demo residuales pueden recrearse si se ejecutan tests automatizados.
- Si los tests recrean datos dummy, se debe usar el script local `scripts/cleanup-local-demo-data.ts`.

### Restricciones vigentes

- No conectar OpenAI real todavÃ­a.
- No conectar WhatsApp real todavÃ­a.
- No implementar login real todavÃ­a.
- No mostrar ni versionar `.env`.
- No instalar Docker ni pnpm.
- No implementar storage real todavÃ­a.
- No subir archivos reales.
- No implementar identidad visual final todavÃ­a.
- No avanzar a MVP 2.5 todavÃ­a.
- No avanzar a MVP 3.

### Siguiente paso recomendado

Luis Felipe debe realizar revisiÃ³n visual final de MVP 2.4.2.

Si la revisiÃ³n visual confirma que la demo se entiende correctamente por actor y por empresa, se podrÃ¡ cerrar formalmente MVP 2.4.2 y decidir el siguiente bloque incremental.

## D-021 — Cierre integral y aprobacion de MVP 2.4

**Fecha:** 2026-06-12  
**Estado:** Aprobada  
**Tipo:** Decision de cierre tecnico / UX / MVP

### Decision

Se aprueba el cierre integral de MVP 2.4 de Gamora Bot.

MVP 2.4 queda validado como corte funcional de evidencias simuladas/controladas desde web, UX por actor y demo local limpia.

### Alcance aprobado

MVP 2.4 incluye:

- evidencias simuladas/controladas desde web;
- registro de evidencia;
- revision de evidencia;
- acciones de aprobar, pedir correccion y rechazar;
- Mi dia operativo por actor;
- selector de actor activo simulado;
- navegacion por rol;
- detalle de compromiso con tabs;
- limpieza local de datos demo;
- conservacion de Ferreteria Luisito;
- conservacion de Dragon Ball Z;
- conservacion de Super Admin global;
- aislamiento de datos por empresa.

### Ajustes correctivos incorporados

El cierre integral incorpora:

- MVP 2.4.1: Configuracion basica como CRUD de empresas.
- MVP 2.4.2-A: selector de actor activo.
- MVP 2.4.2-B: navegacion por rol.
- MVP 2.4.2-C: Mi dia operativo simplificado.
- MVP 2.4.2-D: detalle con tabs.
- MVP 2.4.2-E: limpieza de datos demo.

### Razon

MVP 2.4 permite cerrar el ciclo funcional basico de compromiso, evidencia simulada y revision desde web.

Los ajustes correctivos fueron necesarios para evitar una experiencia saturada, separar responsabilidades por actor, ordenar el detalle de compromiso y dejar la demo local limpia para validacion.

### Implicaciones

- MVP 2.4 queda cerrado como hito tecnico/UX.
- MVP 2.5 queda como siguiente paso recomendado.
- MVP 2.5 debera validar el flujo completo web Ferreteria Luisito.
- OpenAI permanece apagado.
- WhatsApp permanece apagado.
- No hay login real.
- No hay storage real.
- No hay archivos reales.
- No se avanza a MVP 3.

### Pendiente conocido

Los tests automatizados pueden recrear datos dummy.

Si ocurre, se debe usar `scripts/cleanup-local-demo-data.ts` despues de pruebas para volver a dejar la demo local limpia.

### Siguiente paso recomendado

Preparar MVP 2.5 — Flujo Completo Web Ferreteria Luisito, sin ejecutarlo todavia.

