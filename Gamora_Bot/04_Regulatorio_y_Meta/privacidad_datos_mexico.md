# Privacidad de Datos México — Gamora Bot

## Versión

v0.1

## Estatus

Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento traduce obligaciones y principios de privacidad de datos personales en reglas funcionales para Gamora Bot.

El objetivo es que el MVP considere desde el inicio consentimiento, aviso de privacidad, minimización de datos, seguridad, derechos ARCO, retención, evidencias, terceros tecnológicos e IA.

Fuentes oficiales base:

- Ley Federal de Protección de Datos Personales en Posesión de los Particulares: `https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf`
- Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares: `https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFPDPPP.pdf`
- Referencia DOF / reformas 2025 a verificar: `https://www.dof.gob.mx/nota_to_pdf.php?edicion=VES&fecha=20%2F03%2F2025`

## 2. Advertencia de alcance

Este documento no es asesoría legal definitiva.

Es un análisis funcional para diseño del MVP de Gamora Bot.

Deberá validarse con asesor legal antes de comercialización, especialmente en temas de aviso de privacidad, roles de responsable/encargado, transferencias, tratamiento por IA, evidencias con terceros y retención.

Las referencias institucionales en México deberán verificarse por cambios derivados de reformas recientes. La versión consultada de la Ley Federal en Cámara de Diputados indica reforma reciente y menciona a la Secretaría Anticorrupción y Buen Gobierno como referencia institucional; esto debe confirmarse para cualquier aviso o contrato futuro.

## 3. Marco normativo base

El marco funcional inicial para Gamora Bot considera:

- Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
- Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
- Marco institucional vigente y autoridad competente a verificar por reformas 2025.
- Derechos ARCO: acceso, rectificación, cancelación y oposición.

La Ley define datos personales como cualquier información concerniente a una persona identificada o identificable. También reconoce datos personales sensibles, derechos ARCO, aviso de privacidad, consentimiento, responsable, encargado, transferencia y tratamiento.

Para Gamora Bot, el enfoque funcional es claro: si el sistema registra usuarios, teléfonos, mensajes, evidencias, acciones, fechas y archivos, está tratando datos personales y debe diseñarse con reglas de privacidad desde el inicio.

## 4. Datos personales que podría tratar Gamora Bot

Gamora Bot podría tratar:

- Nombre.
- Teléfono.
- Empresa.
- Rol.
- Sucursal, unidad o frente.
- Mensajes operativos.
- Evidencias.
- Fotos.
- Audios.
- Archivos PDF.
- Ubicación, si se captura en el futuro.
- Bitácora de acciones.
- Estados de compromisos.
- Fechas y horarios.
- Datos de terceros contenidos en evidencias.

Algunos datos pueden volverse sensibles por contexto, aunque no siempre sean sensibles por naturaleza.

Ejemplos:

- Una foto de campo puede mostrar rostros, placas, domicilios o instalaciones.
- Un corte de caja puede contener información financiera sensible por contexto.
- Un audio puede revelar datos personales de terceros.
- Un PDF puede incluir datos fiscales, patrimoniales o comerciales.

## 5. Principio de licitud

**Obligación / principio legal:** El tratamiento de datos personales debe realizarse de forma lícita y conforme a la ley aplicable.

**Interpretación funcional para Gamora:** Gamora debe tratar datos con base legítima y finalidad clara. No debe recolectar información simplemente porque el canal lo permite.

**Regla de diseño MVP:**

- No recolectar datos fuera del flujo de compromisos.
- No leer chats personales.
- No usar evidencias para fines distintos al seguimiento operativo.
- No convertir WhatsApp en fuente general de monitoreo.

**Tema pendiente de validación legal:** Definir base jurídica y textos contractuales para cada tipo de dato, cada tipo de usuario y cada finalidad.

## 6. Principio de consentimiento

**Obligación / principio legal:** El consentimiento debe ser claro para el tratamiento de datos personales, salvo excepciones aplicables que deben validarse legalmente.

**Interpretación funcional para Gamora:** El consentimiento para tratamiento de datos y el opt-in para usar WhatsApp como canal operativo deben tratarse como piezas relacionadas, pero no idénticas.

El administrador de una empresa no debe poder activar por sí solo el canal WhatsApp de otra persona. Cada usuario enrolado debe aceptar participar desde su propio canal o mediante mecanismo verificable.

**Regla de diseño MVP:**

- Registrar aceptación de aviso / términos.
- Registrar opt-in de WhatsApp.
- Separar consentimiento de administrador y consentimiento de usuario enrolado.
- Distinguir invitado, pendiente de aceptación, activo/enrolado y WhatsApp desactivado.

**Tema pendiente de validación legal:** Confirmar si el consentimiento requerido debe ser tácito, expreso o expreso por escrito según datos tratados, evidencias y contexto.

## 7. Principio de información / aviso de privacidad

**Obligación / principio legal:** Los usuarios deben conocer qué datos se tratan, para qué, con quién se comparten y cómo ejercer derechos.

**Interpretación funcional para Gamora:** El aviso de privacidad no debe quedar escondido. Debe formar parte del onboarding, del enrolamiento y del acceso web/PWA.

**Regla de diseño MVP:**

- Tener aviso de privacidad accesible desde onboarding, web/PWA y WhatsApp.
- Mostrar versión del aviso aceptado.
- Registrar fecha de aceptación.
- Registrar empresa o espacio de trabajo asociado a la aceptación.
- Permitir consultar el aviso vigente desde WhatsApp con una instrucción simple.

**Tema pendiente de validación legal:** Redactar aviso de privacidad integral y, si aplica, aviso simplificado para flujo WhatsApp.

## 8. Principio de finalidad

**Obligación / principio legal:** Los datos deben usarse para finalidades específicas, informadas y compatibles con el servicio.

**Interpretación funcional para Gamora:** Gamora no debe reutilizar datos operativos para finalidades secundarias sin consentimiento o base adecuada.

Finalidades iniciales Gamora:

- Registrar usuarios.
- Crear compromisos.
- Notificar responsables.
- Recibir evidencias.
- Validar avances.
- Mantener bitácora.
- Generar reportes operativos.
- Administrar permisos.

**Regla de diseño MVP:**

- No usar datos para marketing sin consentimiento separado.
- No entrenar modelos con datos del cliente sin autorización expresa.
- No analizar evidencias para fines distintos al compromiso asociado.
- No compartir datos entre empresas/espacios de trabajo.

**Tema pendiente de validación legal:** Definir finalidades primarias y secundarias en el aviso de privacidad.

## 9. Principio de proporcionalidad / minimización

**Obligación / principio legal:** El tratamiento debe limitarse a datos necesarios para las finalidades informadas.

**Interpretación funcional para Gamora:** Gamora debe pedir lo mínimo necesario para operar compromisos. La baja fricción también protege privacidad.

**Regla de diseño MVP:**

- No pedir CURP, domicilio personal, identificación oficial o datos sensibles si no son indispensables.
- No capturar ubicación por defecto.
- Limitar evidencias al compromiso correspondiente.
- Evitar formularios extensos en onboarding.
- No solicitar documentos personales para usuarios operativos salvo caso futuro justificado.

**Tema pendiente de validación legal:** Determinar si algún cliente o caso de uso requiere datos adicionales y cómo justificarlo.

## 10. Principio de calidad

**Obligación / principio legal:** Los datos deben ser correctos y actualizados en lo razonable.

**Interpretación funcional para Gamora:** Si un usuario cambia de teléfono, rol, sucursal o estado, el sistema debe reflejarlo para evitar notificaciones equivocadas o accesos indebidos.

**Regla de diseño MVP:**

- Permitir actualizar nombre, teléfono, rol, sucursal y estado de usuario.
- Mantener estados claros: invitado, enrolado, WhatsApp desactivado, suspendido.
- Permitir corrección de datos básicos por administrador autorizado.
- Registrar cambios relevantes en bitácora.

**Tema pendiente de validación legal:** Definir procedimiento para rectificación formal dentro de derechos ARCO.

## 11. Principio de responsabilidad

**Obligación / principio legal:** Quien trata datos debe asumir obligaciones sobre el tratamiento y demostrar cumplimiento razonable.

**Interpretación funcional para Gamora:** Gamora y el cliente pueden tener roles distintos según el dato y la finalidad.

Distinción funcional inicial:

- **Cliente / empresa:** responsable de decidir usuarios, finalidades internas, compromisos y evidencias.
- **Gamora:** posible encargado/proveedor tecnológico que procesa datos conforme instrucciones del cliente, sujeto a validación legal.
- **Gamora como responsable en ciertos escenarios:** podría ser responsable de datos propios como cuenta, facturación, soporte, seguridad, analítica del servicio y relación comercial.

**Regla de diseño MVP:**

- Documentar roles contractuales después.
- No asumir automáticamente que Gamora siempre es solo encargado.
- Separar datos operativos del cliente y datos propios de la plataforma.
- Preparar bases para contratos, DPA o cláusulas de encargado.

**Tema pendiente de validación legal:** Definir formalmente si Gamora será responsable, encargado o ambos según el tipo de dato.

## 12. Seguridad de datos

**Obligación / principio legal:** Deben implementarse medidas para proteger los datos personales contra daño, pérdida, alteración, destrucción, uso, acceso o tratamiento no autorizado.

**Interpretación funcional para Gamora:** La privacidad no se resuelve solo con aviso. Debe reflejarse en permisos, bitácora y separación de información.

Medidas funcionales a considerar:

- Control de acceso.
- Roles y permisos.
- Evidencia sensible.
- Bitácora.
- Separación por empresa.
- Bloqueo de usuarios.
- Baja de canal WhatsApp.
- Medidas técnicas futuras: cifrado, backups, control de sesiones, almacenamiento seguro.

**Regla de diseño MVP:**

- La evidencia no debe ser visible para todos.
- Solo usuarios autorizados pueden revisar o aprobar.
- El supervisor/validador debe tener permisos distintos del responsable operativo.
- Los espacios de trabajo deben estar separados.

**Tema pendiente de validación legal:** Definir medidas administrativas, técnicas y físicas mínimas exigibles según alcance comercial.

## 13. Evidencias y archivos

**Obligación / principio legal:** Las evidencias y archivos pueden contener datos personales y deben tratarse conforme a finalidad, consentimiento, seguridad y acceso autorizado.

**Interpretación funcional para Gamora:** Fotos, audios y PDFs no son simples adjuntos. Son datos operativos que pueden contener información personal, confidencial o sensible por contexto.

Ejemplos:

- En Sunworks, evidencias de campo pueden mostrar personas, placas, domicilios, equipo, instalaciones o información del cliente.
- En Ferretería Luisito, corte de caja puede contener información financiera o sensible por contexto.
- En Mina Mercedes, reportes, cotizaciones y documentos pueden contener datos de proveedores, contratistas o clientes.

**Regla de diseño MVP:**

- Clasificar evidencias como normales o sensibles.
- Permitir permisos por tipo de evidencia.
- Registrar quién subió, vio, aprobó o descargó evidencia.
- Asociar evidencia al compromiso, hito o reporte parcial correcto.
- Evitar que evidencias se compartan fuera del espacio de trabajo sin control.

**Tema pendiente de validación legal:** Definir tratamiento de evidencias con datos de terceros no usuarios de Gamora.

## 14. Datos personales sensibles

**Obligación / principio legal:** Los datos personales sensibles requieren mayor cuidado y, en términos generales, consentimiento expreso y reglas estrictas para su tratamiento.

**Interpretación funcional para Gamora:** Gamora no debe buscar tratar datos sensibles en el MVP. Sin embargo, podría recibirlos accidentalmente dentro de evidencias.

Ejemplos de riesgo:

- Rostros visibles.
- Documentos oficiales.
- Datos de salud.
- Datos biométricos.
- Información patrimonial o financiera.
- Información delicada de clientes o proveedores.

**Regla de diseño MVP:**

- No pedir biométricos.
- No pedir datos de salud.
- No pedir documentos oficiales salvo caso futuro justificado.
- Permitir marcar evidencia como sensible.
- Restringir acceso a evidencia sensible.
- Incluir advertencias de no enviar datos sensibles salvo que sea necesario para el compromiso y esté autorizado.

**Tema pendiente de validación legal:** Definir protocolo para datos sensibles capturados accidentalmente.

## 15. Derechos ARCO

**Obligación / principio legal:** Los titulares pueden ejercer acceso, rectificación, cancelación y oposición al tratamiento de datos personales.

**Interpretación funcional para Gamora:** Gamora debe poder localizar datos por usuario y distinguir entre baja de WhatsApp, suspensión operativa, bloqueo, cancelación y eliminación.

**Regla de diseño MVP:**

- Documentar canal de contacto para derechos.
- Permitir ubicar datos por usuario.
- Tener procedimiento interno futuro para exportar, rectificar, bloquear o eliminar datos cuando aplique.
- Distinguir baja de WhatsApp de cancelación/eliminación de datos.
- Registrar solicitudes y respuestas.

**Tema pendiente de validación legal:** Diseñar procedimiento ARCO formal, plazos, responsables y excepciones aplicables.

## 16. Retención y eliminación

**Obligación / principio legal:** La conservación de datos debe estar justificada por finalidades, obligaciones y periodos razonables.

**Interpretación funcional para Gamora:** Gamora debe definir cuánto tiempo conservar compromisos, evidencias y bitácoras. La trazabilidad operativa no debe convertirse automáticamente en retención indefinida.

**Regla de diseño MVP:**

- No definir retención indefinida sin justificación.
- Definir política inicial por empresa.
- Permitir cierre, archivo y eventual eliminación.
- Mantener bitácora cuando sea necesaria para trazabilidad, sujeta a política legal.
- Distinguir eliminación de evidencia, bloqueo de datos y conservación por responsabilidades.

**Tema pendiente de validación legal:** Determinar plazos por tipo de dato, contrato, evidencia, bitácora y obligaciones comerciales.

## 17. Transferencias y terceros

**Obligación / principio legal:** Debe documentarse si los datos se comunican a terceros y bajo qué condiciones.

**Interpretación funcional para Gamora:** WhatsApp/Meta, proveedores de nube, IA, almacenamiento, correo, soporte y analítica pueden intervenir como terceros tecnológicos.

**Regla de diseño MVP:**

- No enviar datos a proveedores de IA sin control.
- Evitar usar evidencias reales para entrenamiento.
- Documentar proveedores.
- Revisar contratos/DPA cuando avance comercialmente.
- Separar proveedores necesarios para operar de proveedores opcionales.

**Tema pendiente de validación legal:** Definir si cada proveedor actúa como encargado, subencargado, tercero o responsable independiente.

## 18. IA y datos personales

**Obligación / principio legal:** El uso de IA no elimina obligaciones de privacidad, finalidad, consentimiento, seguridad y responsabilidad.

**Interpretación funcional para Gamora:** La IA puede interpretar mensajes, audios, alias y compromisos. Pero existe riesgo al enviar datos personales o confidenciales a un proveedor de IA.

**Regla de diseño MVP:**

- Minimizar datos enviados a IA.
- No enviar archivos completos si no es necesario.
- Usar extracción estructurada con contexto mínimo.
- Registrar cuándo se usó IA para interpretar.
- Humano valida acciones críticas.
- No entrenar con datos del cliente sin autorización.
- Evitar enviar datos sensibles a IA salvo autorización y justificación.

**Tema pendiente de validación legal:** Definir base, aviso, contrato y controles específicos para tratamiento por IA.

## 19. Matriz de privacidad para Gamora

| Tema | Riesgo | Regla MVP | Responsable inicial | Prioridad |
| --- | --- | --- | --- | --- |
| Datos de usuario | Uso sin finalidad clara. | Solo registrar datos necesarios para operar compromisos. | Gamora + cliente | Alta |
| Teléfono | Contacto no autorizado o número incorrecto. | Opt-in individual y estado de enrolamiento. | Gamora | Alta |
| Mensajes | Recolección excesiva o fuera de contexto. | Solo mensajes enviados al canal formal de Gamora. | Gamora | Alta |
| Evidencias | Acceso indebido o uso fuera de finalidad. | Asociar evidencia al compromiso y limitar permisos. | Gamora + cliente | Alta |
| Fotos/audio/PDF | Datos de terceros o información sensible por contexto. | Clasificación normal/sensible y control de acceso. | Cliente + Gamora | Alta |
| Datos sensibles accidentales | Tratamiento no previsto. | No solicitarlos y permitir marcar evidencia sensible. | Cliente + Gamora | Alta |
| IA | Envío excesivo de datos a proveedor externo. | Minimización, registro de uso y no entrenamiento sin autorización. | Gamora | Alta |
| WhatsApp/Meta | Canal externo con reglas propias. | Opt-in, opt-out y mensajes esperados. | Gamora + cliente | Alta |
| Nube | Acceso o almacenamiento inseguro. | Proveedores documentados y controles futuros. | Gamora | Alta |
| Roles/permisos | Usuarios ven evidencias no autorizadas. | Roles por administrador, coordinador, responsable y supervisor. | Gamora | Alta |
| ARCO | No localizar o atender solicitudes. | Procedimiento interno y datos localizables por usuario. | Gamora + cliente | Media |
| Retención | Conservación indefinida. | Política por empresa y archivo/eliminación futura. | Cliente + Gamora | Media |
| Eliminación | Borrado que rompe trazabilidad o incumple solicitud. | Distinguir cancelación, bloqueo, archivo y eliminación. | Gamora + asesor legal | Media |
| Baja de canal | Confundir baja WhatsApp con eliminación total. | Estado “WhatsApp desactivado” separado de cancelación de datos. | Gamora | Alta |

## 20. Reglas no negociables de privacidad para el MVP

- No leer chats personales.
- No capturar más datos de los necesarios.
- No enviar mensajes a no enrolados.
- No exponer evidencias a usuarios no autorizados.
- No usar datos del cliente para entrenar IA sin autorización.
- No pedir datos sensibles por defecto.
- Registrar consentimiento y opt-in.
- Permitir baja de WhatsApp.
- Mantener bitácora de acciones críticas.
- Separar empresas/espacios de trabajo.
- Distinguir baja de WhatsApp de eliminación/cancelación de datos.
- Restringir evidencias sensibles.

## 21. Preguntas pendientes para asesor legal

- ¿Gamora será responsable, encargado o ambos según el dato?
- ¿Qué debe incluir el aviso de privacidad?
- ¿Cómo documentar consentimiento de usuarios invitados?
- ¿Qué retención mínima/máxima conviene?
- ¿Cómo manejar evidencia con terceros no usuarios?
- ¿Qué proveedores requieren contrato de encargado/DPA?
- ¿Cómo tratar datos enviados a IA?
- ¿Qué pasa si un cliente solicita borrar evidencia usada como bitácora?
- ¿Qué autoridad competente debe referirse en el aviso vigente tras reformas 2025?
- ¿Qué tratamiento requiere un corte de caja, cotización o evidencia con datos patrimoniales?
- ¿Qué protocolo aplicar ante datos sensibles accidentales?

## 22. Cierre del documento

Privacidad no debe verse como fricción, sino como base de confianza.

Gamora solo puede operar como canal formal si protege datos, evidencias y trazabilidad con reglas claras. El producto no debe leer chats personales, no debe capturar más datos de los necesarios y no debe usar datos operativos para finalidades ajenas al seguimiento de compromisos.

La privacidad también es parte de la propuesta de valor: usuarios autorizados, evidencias con permisos, bitácora de acciones críticas, separación por empresa y control humano sobre decisiones relevantes.
