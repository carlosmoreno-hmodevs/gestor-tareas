# Mapa de Dolores PyME — Gamora Bot

## Versión

v0.1

## Estatus

Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento identifica y ordena los dolores operativos que viven las PyMEs cuando gestionan compromisos importantes por WhatsApp sin una capa formal de control.

El mapa considera tanto casos simples, como Ferretería Luisito, como escenarios de mayor complejidad operativa, como Mina Mercedes y Sunworks, donde existen evidencias, validaciones, dependencias, hitos, reportes parciales y avances simultáneos.

## 2. Dolor raíz

El problema central no es falta de comunicación. El problema es que la comunicación informal no se transforma de manera consistente en compromisos operativos trazables.

Las PyMEs suelen comunicarse mucho: mensajes, audios, fotos, grupos, llamadas y recordatorios. Pero esa actividad no siempre genera control. Un acuerdo puede existir en la conversación, pero no tener responsable claro, fecha compromiso, evidencia esperada, estado, bitácora ni cierre.

Gamora Bot existe para cerrar esa brecha: convertir acuerdos importantes en compromisos operativos gestionables, sin obligar al usuario a abandonar WhatsApp como canal operativo principal.

## 3. Dolor 1 — Pendientes que se pierden en conversaciones

Muchos pendientes nacen dentro de conversaciones largas y mezcladas. Un mensaje importante puede quedar enterrado entre comentarios, fotos, saludos, cambios de tema o nuevas instrucciones.

Esto ocurre en chats personales, grupos de WhatsApp y conversaciones donde conviven temas operativos, urgencias, preguntas informales y acuerdos importantes.

El problema no es que el pendiente no haya sido comunicado. El problema es que no quedó registrado formalmente.

Ejemplo: “Luisito le pidió a Panchito contar sacos de cemento, pero el mensaje quedó perdido entre otros temas.”

## 4. Dolor 2 — Responsables poco claros

En muchas operaciones todos saben que algo se pidió, pero nadie sabe con claridad quién quedó responsable.

Esto pasa especialmente cuando una instrucción se manda en un grupo. Una persona puede asumir que alguien más la tomará. Otra puede pensar que solo estaba copiada. El solicitante puede creer que ya asignó la tarea, pero el responsable nunca la aceptó de forma explícita.

También puede haber ambigüedad entre quien solicita, quien ejecuta y quien valida. Sin roles claros, el seguimiento se vuelve frágil.

## 5. Dolor 3 — Fechas compromiso no formalizadas

Muchas fechas nacen con frases vagas:

- “Al rato”.
- “Hoy”.
- “Cuando puedas”.
- “Mañana temprano”.
- “Antes de que cierre”.

Estas expresiones pueden entenderse en la conversación, pero no siempre se convierten en vencimientos, recordatorios o alertas.

Cuando la fecha compromiso no queda formalizada, el seguimiento depende de memoria humana. Si nadie recuerda, el pendiente se enfría o se vence sin señal clara.

## 6. Dolor 4 — Evidencias dispersas

Las evidencias suelen llegar como fotos, PDFs, audios, capturas, archivos o mensajes sueltos dentro de WhatsApp.

El dolor aparece cuando esas evidencias no quedan vinculadas a un compromiso específico. Después, alguien pregunta por una foto, un reporte o un comprobante, y nadie sabe en qué chat quedó, a qué pendiente correspondía o si ya fue revisado.

Esto vuelve difícil auditar, aprobar o cerrar compromisos. También hace que la evidencia pierda valor operativo, porque existe como archivo enviado, pero no como parte de una bitácora formal.

## 7. Dolor 5 — Seguimiento manual excesivo

El dueño, gerente o coordinador termina persiguiendo avances uno por uno.

Pregunta varias veces, revisa chats, busca evidencias, recuerda fechas y vuelve a escribir para confirmar si algo ya se hizo. En la práctica, se convierte en el motor manual del seguimiento.

Esto consume tiempo y crea un cuello de botella. Si la persona deja de insistir, muchos pendientes dejan de avanzar.

## 8. Dolor 6 — Falta de bitácora y trazabilidad

Sin una capa formal de control, no queda claro:

- Cuándo se pidió.
- Quién aceptó.
- Cuándo entregó.
- Qué evidencia mandó.
- Quién aprobó.
- Cuándo se cerró.

La falta de bitácora vuelve difícil reconstruir la historia de un compromiso. Cuando aparece un problema, la empresa depende de capturas, memoria o búsqueda manual en chats.

## 9. Dolor 7 — Baja rendición de cuentas

Sin evidencia, fecha y responsable, los compromisos se vuelven opinables.

Aparecen frases como:

- “Yo sí lo mandé”.
- “No me dijeron”.
- “Eso no me tocaba”.
- “Yo pensé que alguien más lo iba a hacer”.
- “Sí lo hice, pero no tengo la foto aquí”.

La rendición de cuentas no debe depender de discusiones posteriores. Debe quedar integrada al flujo: responsable, aceptación, evidencia, revisión y cierre.

## 10. Dolor 8 — Demasiada dependencia de una persona

Muchas PyMEs funcionan porque una persona carga con la memoria operativa del negocio.

Puede ser el dueño, gerente, coordinador o supervisor. Esa persona recuerda pendientes, insiste, busca evidencias y mantiene la operación en movimiento.

El riesgo es claro: si se le olvida, el compromiso se cae. Si no insiste, nadie avanza. Si se ausenta, otros pierden visibilidad.

Gamora Bot debe reducir esa dependencia convirtiendo la memoria personal en memoria operativa compartida y trazable.

## 11. Dolor 9 — Resistencia a nuevas plataformas

Muchas PyMEs no quieren otra app. No quieren capacitar usuarios, llenar formularios complejos ni obligar a su equipo operativo a entrar a una plataforma adicional.

Prefieren seguir usando WhatsApp aunque sea desordenado, porque ya forma parte de su hábito diario.

Este dolor explica por qué Gamora Bot debe prometer despliegue inmediato con fricción mínima, no una migración pesada a otro sistema. WhatsApp debe seguir siendo el canal operativo principal del MVP, mientras web/PWA cumple la función de capa formal de control.

## 12. Dolor 10 — Riesgo de percepción de vigilancia

Si el sistema se diseña mal, los usuarios pueden sentir que los están vigilando.

Este riesgo aparece cuando se percibe que una herramienta monitorea conversaciones personales, envía mensajes sorpresa o controla a personas sin consentimiento.

Por eso, Gamora debe operar con usuarios autorizados, consentimiento y compromisos específicos. No debe leer chats personales ni mandar mensajes sorpresa. El enrolamiento obligatorio protege tanto al usuario como al producto.

Gamora Bot no debe posicionarse como WhatsApp interno para empleados. Debe posicionarse como motor de compromisos operativos para usuarios autorizados.

## 13. Dolor 11 — Avances parciales sin estructura

En escenarios como Sunworks, las cuadrillas pueden reportar avances fraccionados por WhatsApp.

Un avance puede ser 15%, 40% o 60%. Puede llegar acompañado de fotos, audios, observaciones o archivos. Si no hay estructura, el supervisor no sabe qué porcentaje es oficial, qué evidencia lo respalda o qué parte sigue pendiente.

Distinguir avance reportado vs avance validado es fundamental.

El avance reportado es lo que el responsable de campo informa. El avance validado es lo que el supervisor aprueba. El avance oficial del hito debe ser el validado, no solo el reportado.

## 14. Dolor 12 — Proyectos con hitos simultáneos

Un proyecto puede tener varios frentes activos al mismo tiempo.

En Sunworks, una cuadrilla puede avanzar en H2, H4 y H6 durante la misma jornada. Si todo llega en fotos, audios y mensajes mezclados, se pierde el orden.

Gamora debe estructurar por proyecto, hito, reporte parcial y evidencia. Esto permite que cada avance tenga su propio contexto, estado, validación y bitácora.

Sin esa estructura, la operación queda vulnerable a confusiones entre etapas, evidencias duplicadas, avances mal asignados y cierres prematuros.

## 15. Dolor 13 — Identificadores técnicos poco amigables

El usuario operativo no debe memorizar claves como SW-LO-001 o H2.

Si el sistema exige usar claves técnicas para reportar avances, se rompe la baja fricción. El usuario de campo debería poder escribir con lenguaje natural, alias o contexto activo.

Gamora debe aceptar nombres naturales, alias, contexto activo y selección guiada. Las claves técnicas pueden existir internamente para trazabilidad, pero no deben convertirse en carga para el usuario operativo.

## 16. Matriz de dolores por actor

| Actor | Dolor principal | Frase típica | Consecuencia | Cómo ayuda Gamora |
| --- | --- | --- | --- | --- |
| Dueño / gerente | Falta de visibilidad y seguimiento manual excesivo. | “Tengo que estar persiguiendo todo.” | Se vuelve cuello de botella y pierde control de pendientes. | Centraliza compromisos, estados, evidencias, vencimientos y reportes. |
| Coordinador | Pendientes dispersos y responsables ambiguos. | “No sé si ya lo tomó alguien.” | Duplica seguimiento y pierde tiempo reconstruyendo conversaciones. | Permite asignar responsable, fecha, evidencia esperada y seguimiento formal. |
| Responsable operativo | Instrucciones mezcladas y poca claridad de entrega. | “No sabía que eso me tocaba a mí.” | Retrasos, confusión y entregas incompletas. | Notifica compromisos específicos, permite aceptar y enviar evidencia por WhatsApp. |
| Supervisor / validador | Evidencias sin estructura y avances no oficiales. | “No sé si ese 60% ya está validado.” | Se confunden reportes de campo con avance oficial. | Distingue avance reportado vs avance validado y mantiene bitácora de revisión. |
| Solicitante / cliente interno o externo | Falta de claridad sobre estado y cierre. | “¿En qué va lo que pedí?” | Desconfianza, reprocesos y escalaciones manuales. | Da trazabilidad del compromiso, evidencia, aprobación y cierre. |
| Administrador del sistema | Riesgo de usuarios no autorizados o mala configuración. | “No quiero que le lleguen mensajes a quien no aceptó.” | Percepción de vigilancia, errores de permisos y ruido operativo. | Controla usuarios, permisos, invitación, enrolamiento y estados de participación. |

## 17. Matriz de dolores por etapa del journey

| Etapa del journey | Dolor | Riesgo de abandono | Respuesta de Gamora |
| --- | --- | --- | --- |
| Descubrimiento | El cliente no reconoce que tiene un problema de control. | Puede pensar que solo necesita “organizarse mejor”. | Mensaje centrado en que los compromisos importantes de WhatsApp no se pierdan. |
| Identificación del problema | Confunde comunicación con seguimiento. | Puede no ver valor en una capa formal. | Explica que el problema no es hablar más, sino convertir acuerdos en compromisos trazables. |
| Primer contacto | Miedo a instalar otra app o iniciar un proceso pesado. | Puede cerrar antes de probar. | Entrada por WhatsApp mediante QR o click-to-chat. |
| Onboarding | Configuración percibida como carga. | Puede abandonar si hay demasiados pasos. | Web/PWA responsiva para configuración básica y guiada. |
| Enrolamiento | Usuarios pueden rechazar mensajes si no entienden el propósito. | Puede percibirse como vigilancia. | Consentimiento, usuarios autorizados y mensajes operativos esperados. |
| Primer compromiso | Falta información como fecha, responsable o evidencia. | El usuario puede frustrarse si el flujo es rígido. | Gamora interpreta, pregunta lo mínimo necesario y confirma acciones críticas. |
| Primer momento de valor | El cliente aún no percibe diferencia frente a WhatsApp normal. | Puede no continuar si no ve resultado rápido. | Evidencia asociada, responsable claro, fecha y cierre con bitácora. |
| Uso recurrente | Ruido por notificaciones o reportes incompletos. | Puede dejar de usarlo si se siente pesado. | Recordatorios controlados, estados claros y consultas por WhatsApp/web. |
| Retención | Si no se vuelve memoria operativa, se percibe como herramienta adicional. | Vuelve al seguimiento manual. | Tablero, reportes, evidencias ordenadas y trazabilidad. |
| Expansión | Complejidad al crecer a más sucursales, frentes o hitos. | Puede romperse el orden inicial. | Estructura por espacio, usuarios, proyectos, hitos, evidencias y permisos. |

## 18. Dolores que Gamora NO debe prometer resolver todavía

Gamora Bot debe mantener foco y evitar promesas prematuras. En esta etapa no debe prometer resolver por completo:

- Gestión completa de proyectos complejos.
- ERP.
- Control financiero integral.
- Comunicación interna general.
- Lectura de todos los chats.
- Automatización total sin confirmación humana.
- Sustitución de Slack, Teams, Asana o Monday.
- Cumplimiento legal completo sin configuración adecuada.
- Evaluación automática de fotos con IA.
- Cálculo automático de avance por imagen.

Estas capacidades podrían explorarse o integrarse en fases futuras, pero no deben formar parte de la promesa central del MVP.

## 19. Cierre del documento

El mapa de dolores confirma que Gamora Bot debe venderse desde la pérdida de seguimiento operativo, no desde la categoría de task manager.

El dolor real de la PyME no es que falte conversación. El dolor es que los acuerdos importantes se pierden, las evidencias quedan dispersas, los responsables no siempre son claros y el seguimiento depende demasiado de memoria humana.

Gamora Bot debe estar preparado para casos simples e intermedios sin ignorar escenarios complejos. La oportunidad está en mantener mínima fricción para el usuario operativo, mientras Gamora Core absorbe la estructura necesaria para compromisos, evidencias, hitos, avances parciales, validaciones y bitácora.
