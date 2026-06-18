# Tesis Formal — Gamora Bot

## Versión

v0.4

## Estatus

Borrador ampliado con escenarios de complejidad operativa para validación final de Luis Felipe García Duarte.

## 1. Planteamiento del problema

Las PyMEs y los equipos operativos coordinan una parte importante de su trabajo diario por WhatsApp. En la práctica, muchos pendientes nacen en conversaciones informales: un mensaje rápido, una nota de voz, una foto enviada desde campo, una cotización solicitada, una confirmación pendiente o una instrucción dada en medio de otros temas.

El problema aparece cuando esos acuerdos no se convierten en compromisos trazables. La conversación existe, pero el seguimiento queda disperso. La responsabilidad, la fecha compromiso, la evidencia esperada y el estado real del pendiente no siempre quedan claros para todos.

En muchos equipos, el cumplimiento depende de la memoria, disciplina o insistencia manual de una persona. Esa persona debe recordar qué se pidió, a quién se le pidió, cuándo debía entregarse, qué evidencia falta, qué ya se revisó y qué puede darse por cerrado.

Esto provoca olvidos, retrasos, pérdida de evidencias, responsables poco claros y baja rendición de cuentas. La comunicación no necesariamente falta; de hecho, suele haber demasiada conversación. El problema central es que la conversación no se transforma de manera consistente en control operativo.

Por eso, el problema no es falta de comunicación. El problema es falta de control operativo.

## 2. Saturación de herramientas tradicionales

Existen muchas plataformas de gestión de tareas y proyectos. Algunas son potentes, completas y adecuadas para equipos con hábitos digitales maduros. Sin embargo, muchas de estas herramientas exigen que el usuario cambie su flujo natural de trabajo: abrir otra aplicación, aprender una estructura nueva, capturar datos manualmente, actualizar estados y revisar tableros separados de la conversación diaria.

En PyMEs, operaciones en campo y equipos poco digitalizados, esa adopción puede generar fricción. No siempre existe tiempo, disciplina o incentivo suficiente para mover el seguimiento operativo a una herramienta adicional.

El reto, por lo tanto, no es crear otra plataforma más de tareas. El reto es reducir la distancia entre donde ocurre la conversación y donde debería vivir el seguimiento formal.

Gamora Bot parte de esa realidad: si los compromisos nacen en WhatsApp, el producto debe facilitar que esos compromisos entren a un flujo formal sin obligar al usuario operativo a abandonar por completo su entorno cotidiano.

## 3. WhatsApp como realidad operativa

WhatsApp ya funciona como oficina móvil informal para muchas personas y empresas. Ahí se piden reportes, cotizaciones, evidencias, avances, pagos, confirmaciones, reuniones y entregables. También se coordinan equipos, proveedores, contratistas, clientes y responsables internos.

Pero WhatsApp no fue diseñado como sistema formal de gestión. WhatsApp comunica, pero no estructura. Permite conversar, pero no garantiza seguimiento, vencimientos, evidencias, bitácora ni accountability.

Un mensaje puede contener una instrucción importante, pero quedar enterrado entre otros mensajes. Una evidencia puede enviarse, pero no quedar vinculada a un compromiso formal. Una fecha puede mencionarse, pero no convertirse en recordatorio. Una aprobación puede darse, pero no quedar registrada como cierre operativo.

WhatsApp es una realidad operativa, pero por sí solo no resuelve la trazabilidad.

## 4. Brecha de oportunidad

Entre la conversación informal y el control formal existe un vacío. En ese vacío se pierden acuerdos, se duplican seguimientos, se confunden responsabilidades y se vuelve difícil saber qué está abierto, qué está vencido, qué está esperando evidencia y qué ya fue aprobado.

Las PyMEs no necesariamente quieren un sistema complejo. Muchas veces necesitan algo más concreto: que los compromisos importantes no se pierdan.

La oportunidad de Gamora Bot está en formalizar el seguimiento sin obligar al usuario operativo a abandonar WhatsApp. El valor está en convertir conversaciones relevantes en compromisos trazables, con el menor cambio posible en el comportamiento diario del equipo.

## 5. Por qué ahora

El momento es oportuno porque WhatsApp ya está instalado como hábito operativo en muchas PyMEs. La operación diaria ya ocurre en mensajería: solicitudes, acuerdos, evidencias, instrucciones, avances y validaciones pasan por conversaciones rápidas.

Al mismo tiempo, la fatiga de adopción dificulta imponer nuevas plataformas. Muchos equipos necesitan control, pero no necesariamente quieren incorporar un sistema pesado que los obligue a cambiar de canal, aprender procesos complejos o duplicar capturas.

La IA permite interpretar mensajes, audios y acuerdos con menor carga manual. Esto abre la posibilidad de estructurar compromisos desde lenguaje natural, siempre bajo confirmación humana y con reglas claras de control.

Las empresas necesitan trazabilidad, evidencias y accountability sin abandonar sus canales cotidianos. La operación ya ocurre en mensajería, pero el control sigue quedando fuera. Esa brecha hace relevante construir una capa formal sobre WhatsApp Business.

## 6. Propuesta de valor

Gamora Bot es una plataforma de seguimiento operativo construida sobre Gamora Core, con WhatsApp Business como canal operativo principal del MVP y web/PWA como capa formal de control.

Su valor principal es crear una capa de accountability operativo sobre WhatsApp. No busca reemplazar toda la conversación, sino darle estructura a los compromisos que realmente importan.

Gamora Bot convierte mensajes, audios, archivos y acuerdos en compromisos trazables con responsable, fecha compromiso, evidencia, recordatorios, revisión, aprobación y cierre.

Gamora Bot debe permitir:

- Crear compromisos desde WhatsApp.
- Asignar responsables.
- Registrar fechas compromiso.
- Recibir evidencia.
- Avisar vencimientos.
- Permitir revisión y aprobación.
- Generar reportes.
- Mantener bitácora.
- Dar visibilidad por proyecto, frente, responsable y estado.

Con esto, el negocio puede conservar la velocidad de WhatsApp, pero añadir control, trazabilidad y rendición de cuentas donde antes solo había conversación dispersa.

## 7. Gamora Core como núcleo independiente

El núcleo del producto será Gamora Core: motor de compromisos, responsables, fechas, evidencias, estados, bitácora, reportes y permisos.

WhatsApp Business será el canal operativo principal del MVP, pero no la única base conceptual del sistema. La web/PWA será la capa formal de control, administración, revisión, reportes, configuración y auditoría.

Esto permite que Gamora no dependa de WhatsApp como único canal eterno, aunque WhatsApp siga siendo el canal inicial y principal del MVP. El producto debe diseñarse como un sistema de compromisos operativos que puede operar por distintos canales futuros, sin perder su núcleo de control.

## 8. Compromiso operativo como objeto central

El objeto central de Gamora Bot no será la tarea genérica, sino el compromiso operativo.

Un compromiso operativo es una unidad mínima de seguimiento compuesta por responsable, fecha compromiso, evidencia esperada, estado, bitácora y cierre.

Esta definición ayuda a diferenciar Gamora Bot de un task manager tradicional. Una tarea puede ser genérica; un compromiso operativo implica responsabilidad, trazabilidad y rendición de cuentas. No se trata solo de recordar que algo debe hacerse, sino de asegurar que exista claridad sobre quién responde, cuándo debe cumplirse, qué evidencia demuestra avance o cierre, quién revisa y cómo queda registrada la historia del compromiso.

## 9. Escenarios de complejidad operativa

Gamora Bot debe soportar distintos niveles de complejidad operativa. El producto no puede diseñarse solo para compromisos simples, porque muchas operaciones reales combinan evidencias, dependencias, revisiones parciales, avances por etapa y múltiples responsables.

### Compromiso simple

Ejemplo: Ferretería Luisito. Panchito cuenta sacos de cemento y envía fotos. Gamora registra responsable, fecha, evidencia, revisión y cierre.

### Compromiso con evidencia y validación

Ejemplo: Fermín entrega un reporte PDF, Luis revisa, aprueba y después se envía a Heriberto. El valor está en que la evidencia no queda suelta, sino asociada al compromiso y a su revisión.

### Compromiso dependiente

Ejemplo: Ariel necesita techos presupuestales de Heriberto antes de terminar una cotización. Gamora debe permitir que un compromiso dependa de una respuesta o insumo previo, evitando que el retraso se confunda con falta de ejecución del responsable final.

### Proyecto por hitos con avances parciales

Ejemplo: Sunworks, proyectos fotovoltaicos con checklist H1-H7, reportes parciales, evidencias, avance reportado, avance validado, correcciones y múltiples hitos activos en paralelo.

Esto no cambia el núcleo del producto; lo fortalece. El objeto central sigue siendo el compromiso operativo, pero Gamora Core debe permitir que algunos compromisos vivan dentro de proyectos, hitos o ciclos de validación más largos.

## 10. Regla arquitectónica: IA interpreta, backend gobierna, humano valida

Gamora Bot debe separar claramente el papel de la IA, el backend y el humano autorizado.

La IA puede interpretar lenguaje natural, audios, alias, nombres de proyectos, hitos probables, porcentajes reportados y evidencias esperadas. También puede proponer una estructura para convertir mensajes ambiguos en compromisos, reportes parciales o solicitudes de validación.

El backend debe validar usuarios, permisos, enrolamiento, proyectos, hitos, estados, evidencias, porcentajes, bitácoras y reglas de negocio. El backend determinístico gobierna qué puede registrarse, qué estado puede cambiar, quién puede aprobar y cómo se conserva trazabilidad.

El humano autorizado debe confirmar acciones críticas y validar avances. La IA no debe escribir directamente en registros finales sin validación del backend y, cuando corresponda, confirmación humana.

Esta regla permite que Gamora Bot sea inteligente sin perder control operativo.

## 11. Identificadores técnicos internos

El usuario operativo no debe memorizar claves como SW-LO-001 o H2 para poder trabajar con Gamora Bot.

Gamora debe aceptar nombres naturales, alias, contexto activo y selección guiada. Por ejemplo, un usuario debe poder decir “avance de Los Olivos” o “terminamos bases del lado norte” y Gamora debe ayudar a identificar el proyecto o hito correspondiente.

Las claves técnicas podrán existir internamente para trazabilidad, auditoría y consistencia del sistema, pero no deben convertirse en carga para el usuario operativo.

## 12. Relación WhatsApp e interfaz web/PWA

WhatsApp será la interfaz operativa principal para registrar compromisos, recibir instrucciones, aceptar tareas, enviar avances y subir evidencias. Es el canal donde el usuario operativo ya trabaja y donde Gamora Bot debe reducir la fricción de captura y seguimiento.

La interfaz web/PWA de Gamora Bot será la capa de control, revisión, administración, reportes, trazabilidad, filtros y configuración. Ahí se podrá observar el estado general de los compromisos, revisar evidencias, administrar usuarios, consultar bitácoras y generar visibilidad por proyecto, frente, responsable y estado.

El MVP necesita ambos componentes:

- WhatsApp para operar con mínima fricción.
- Web/PWA para controlar, revisar, auditar, configurar y administrar.

Esta relación evita que WhatsApp cargue con funciones para las que no fue diseñado, y evita que la web/PWA se convierta en una barrera para la operación cotidiana.

## 13. Principio de adopción: despliegue inmediato con fricción mínima

Gamora Bot deberá reducir al máximo la fricción de adopción. La puerta de entrada futura será una landing page sencilla con un código QR o botón de click-to-chat que abra directamente el número oficial de WhatsApp Business de Gamora Bot.

El usuario no deberá instalar una app móvil adicional para iniciar. El primer contacto ocurrirá en WhatsApp. Desde ahí, Gamora detectará si se trata de un usuario nuevo o recurrente.

No se prometerá “cero fricción” absoluta. El término correcto será:

**Despliegue inmediato con fricción mínima.**

Siempre existirán pasos mínimos necesarios:

- Aceptación de términos.
- Consentimiento para recibir mensajes operativos.
- Configuración básica.
- Invitación y enrolamiento de usuarios.
- Confirmación de acciones críticas.
- Revisión y cierre de compromisos.

La promesa real es que esa fricción sea menor que aprender, instalar y operar una plataforma compleja desde cero.

## 14. Usuario nuevo y usuario recurrente

Gamora Bot deberá distinguir entre usuario nuevo y usuario recurrente desde el primer contacto por WhatsApp.

Un usuario nuevo será recibido por Gamora, recibirá una explicación breve del propósito del producto y deberá aceptar condiciones básicas antes de avanzar. Después, Gamora lo guiará hacia la web/PWA responsiva para configurar empresa, equipo, unidades y espacio de trabajo.

Un usuario recurrente será identificado por su número. Si ya pertenece a un espacio de trabajo, Gamora lo pondrá directamente en modo operativo para crear compromisos, consultar pendientes, revisar evidencias o pedir resúmenes. Si pertenece a más de un espacio, Gamora deberá pedir contexto antes de operar.

Esta diferencia permite mantener la adopción simple para quien llega por primera vez y rápida para quien ya está enrolado.

## 15. Landing page y QR como embudo futuro

La landing page funcionará como embudo comercial y puerta de acceso. Permitirá explicar el problema, mostrar casos de uso, incluir una llamada a la acción y abrir el chat de Gamora mediante QR o botón.

La landing no será parte central del MVP técnico inicial, pero sí forma parte del flujo de adopción y de la experiencia futura del usuario. Su función será reducir la distancia entre descubrir Gamora Bot y comenzar el primer contacto operativo.

## 16. Onboarding web responsivo

WhatsApp será el punto de entrada, pero no toda la configuración debe ocurrir por chat.

La web/PWA responsiva permitirá:

- Crear empresa o espacio de trabajo.
- Configurar unidades, sucursales o frentes.
- Registrar usuarios.
- Generar invitaciones.
- Administrar permisos.
- Revisar evidencias.
- Consultar tableros.
- Gestionar configuración.

Esta separación ayuda a conservar WhatsApp como canal operativo ligero y a reservar la web/PWA para las funciones que requieren más contexto, visualización, control y administración.

## 17. Invitación vs enrolamiento

Gamora Bot deberá distinguir entre invitación y enrolamiento.

**Invitación** es el momento en que el administrador registra a una persona y genera un link, código o QR para invitarla a participar en Gamora Bot.

**Enrolamiento** es el momento en que la persona invitada abre el link, entra al WhatsApp de Gamora Bot, acepta participar, confirma su canal y queda activada como usuario autorizado dentro del espacio de trabajo.

La regla funcional es clara: nadie debe recibir compromisos por WhatsApp hasta que haya aceptado participar como usuario autorizado.

Esta distinción protege la experiencia del usuario, reduce percepción de vigilancia y ayuda a mantener control sobre consentimiento, opt-in y mensajes esperados.

## 18. Usuarios autorizados

Gamora podrá operar con usuarios internos o externos siempre que estén autorizados, hayan aceptado participar, reciban mensajes esperados relacionados con compromisos específicos y tengan opción de baja.

El eje no serán “empleados” como categoría única. Gamora Bot debe operar con distintos tipos de participantes autorizados:

- Usuarios autorizados.
- Responsables operativos.
- Responsables de campo.
- Contratistas.
- Proveedores.
- Clientes.
- Sucursales.
- Colaboradores autorizados.
- Equipos distribuidos.

Esta definición permite diseñar el producto para operaciones reales donde los compromisos involucran personas dentro y fuera de la empresa, sin convertir Gamora en una herramienta de comunicación interna general.

## 19. Restricciones Meta y posicionamiento de uso

Gamora Bot no deberá posicionarse como herramienta de comunicación interna entre empleados ni como reemplazo de Slack, Teams, Asana, Monday o una intranet.

El producto se posicionará como un motor de compromisos operativos con WhatsApp Business como canal de baja fricción para usuarios autorizados.

Esta decisión protege al producto frente a restricciones, privacidad, opt-in, mensajes esperados y escalabilidad. Gamora no debe depender de leer chats personales, enviar mensajes sorpresa o operar como canal informal paralelo para cualquier conversación.

El canal oficial de WhatsApp Business debe usarse para comunicaciones operativas esperadas, vinculadas a compromisos específicos y aceptadas por usuarios autorizados.

## 20. Rol auxiliar de la IA

La IA será una capacidad auxiliar, no el producto principal ni un decisor autónomo.

La IA podrá ayudar a:

- Interpretar mensajes.
- Transcribir audios.
- Detectar responsables.
- Sugerir fechas.
- Identificar evidencias esperadas.
- Separar múltiples compromisos.
- Preparar resúmenes.

Pero las acciones críticas deberán requerir confirmación humana:

- Crear compromisos.
- Asignar responsables.
- Aprobar evidencias.
- Rechazar entregables.
- Cerrar compromisos.
- Escalar asuntos críticos.

El objetivo es que Gamora Bot sea inteligente, pero controlado. La IA debe reducir carga operativa y mejorar estructura, no sustituir la responsabilidad humana ni tomar decisiones críticas sin validación.

## 21. Trial futuro de costo controlado

En fases posteriores podrá explorarse un trial gratuito para el usuario, por ejemplo de 30 días. Sin embargo, no se asumirá costo operativo cero para Gamora.

El diseño deberá buscar costo controlado mediante límites de uso, mensajes, usuarios, compromisos, evidencias y consumo de IA.

Esta tesis no desarrolla todavía el modelo comercial. Solo deja asentado que la baja fricción comercial deberá equilibrarse con control operativo y control de costos.

## 22. Principio fundacional

Gamora Bot no intentará leer todos los chats existentes ni dependerá de conversaciones personales sueltas. Su función será convertirse en el canal formal controlado donde se registran, asignan, documentan, revisan y cierran los compromisos importantes.

La conversación informal puede seguir ocurriendo en WhatsApp personal. No todo mensaje necesita convertirse en tarea, evidencia o seguimiento formal.

Pero cuando algo requiera control operativo, debe entrar al número oficial de WhatsApp Business de Gamora Bot. Ahí podrá registrarse como compromiso, asignarse a un responsable, recibir evidencia, revisarse, aprobarse y cerrarse con bitácora.

Este principio evita riesgos técnicos, legales, de privacidad y de escalabilidad. También hace que el producto opere sobre un canal claro, auditable y diseñado para compromisos formales.

## 23. Regla de oro del producto

La regla de oro de Gamora Bot es:

**Máximo control operativo con mínima fricción.**

No se usará “cero fricción” como promesa absoluta porque cualquier sistema formal exige una fricción mínima. Alguien debe confirmar, aceptar, evidenciar, aprobar o cerrar. Esa fricción es parte del control.

La promesa real es que esa fricción sea menor que aprender y usar una plataforma compleja. Gamora Bot debe pedir lo indispensable para convertir una conversación en seguimiento formal, sin imponer procesos pesados ni capturas innecesarias.

## 24. Qué es Gamora Bot

Gamora Bot es:

- Un canal formal de compromisos sobre WhatsApp.
- Una capa de accountability operativo.
- Una memoria operativa del negocio.
- Un sistema de seguimiento ligero.
- Un tablero de control auxiliar vía web/PWA.
- Un repositorio de evidencias.
- Un motor de recordatorios.
- Una bitácora de accountability.
- Un motor capaz de soportar compromisos simples, dependientes y proyectos por hitos.

Su función es ayudar a que los compromisos importantes tengan responsable, fecha, evidencia, estado y cierre.

## 25. Qué no es Gamora Bot

Gamora Bot no es:

- Un vigilante de chats personales.
- Un reemplazo total de WhatsApp personal.
- Un WhatsApp interno para empleados.
- Un clon de Asana, Monday, Trello o ClickUp.
- Un reemplazo de Slack, Teams o una intranet.
- Una IA conversacional genérica.
- Un sistema invasivo que lea todo lo que las personas conversan.
- Un ERP ni un sistema de gestión empresarial completo.

Esta definición negativa es importante para mantener el foco del producto. Gamora Bot no pretende abarcar toda la operación empresarial ni sustituir todas las herramientas existentes. Su lugar inicial es la capa formal de compromisos operativos sobre WhatsApp Business para usuarios autorizados.

## 26. Mercado meta inicial

El mercado meta inicial de Gamora Bot se concentra en organizaciones donde el seguimiento operativo ocurre de forma natural por WhatsApp y donde los compromisos suelen depender de conversaciones dispersas.

El enfoque inicial incluye:

- PyMEs operativas.
- Empresas de servicios.
- Negocios con sucursales.
- Contratistas.
- Mantenimiento.
- Construcción ligera.
- Ventas.
- Cobranza.
- Equipos administrativos.
- Operaciones donde el seguimiento ocurre por WhatsApp.
- Operaciones por proyecto, hitos, evidencias y validaciones parciales.

Esta es una hipótesis inicial. Deberá validarse en fases posteriores mediante customer journey, entrevistas y pilotos.

## 27. Actores principales del modelo operativo

El modelo operativo de Gamora Bot debe distinguir con claridad los actores que participan en la creación, seguimiento, validación y cierre de compromisos.

- **Comprador / decisor:** dueño, director operativo, gerente general, gerente administrativo, gerente de sucursal o responsable de operación que sufre la pérdida de seguimiento y decide adoptar Gamora Bot.
- **Coordinador:** persona que registra, asigna y da seguimiento a compromisos. En el caso Mina Mercedes, este rol puede ejemplificarse con Luis Felipe.
- **Responsable ejecutor:** persona que recibe el compromiso, acepta, ejecuta y envía evidencia. En el caso Mina Mercedes, este rol puede ejemplificarse con Fermín, Román, Ariel, César o Luis Adolfo.
- **Supervisor / validador:** persona autorizada para revisar evidencias, validar avances, solicitar correcciones y cerrar hitos o compromisos.
- **Solicitante o cliente interno/externo:** persona que origina una solicitud o valida un entregable. En el caso Mina Mercedes, este rol puede ejemplificarse con Heriberto.
- **Administrador del sistema:** persona que configura usuarios, frentes, permisos, catálogos y reglas básicas.
- **Gamora Bot:** canal formal que estructura, recuerda, recibe evidencias, notifica y mantiene bitácora.

Distinguir estos actores será clave para el Customer Journey, el diseño funcional y la validación del MVP. Cada actor tendrá necesidades, fricciones y responsabilidades distintas dentro del flujo operativo.

## 28. Casos rectores y casos de estrés funcional

El caso Mina Mercedes seguirá funcionando como caso rector de coordinación multi-actor.

En este caso, Luis Felipe coordina pendientes entre Heriberto y contratistas. Participan Fermín, Román y Ariel. Existen reportes, cotizaciones, techos presupuestales, evidencias y dependencias entre distintos frentes de trabajo.

El caso demuestra el dolor real que Gamora Bot busca resolver: muchos frentes, muchos chats y alto riesgo de olvido. En ese contexto, un acuerdo importante puede quedar perdido entre mensajes, audios, imágenes y seguimientos manuales.

Sunworks será el caso de estrés funcional para proyectos por hitos y avances parciales. Este caso valida que Gamora Bot pueda soportar checklist, reportes parciales, evidencias, avance reportado, avance validado, correcciones y múltiples hitos activos en paralelo.

Gamora Bot permite convertir pendientes, avances y evidencias en compromisos operativos trazables. Los flujos completos deberán documentarse posteriormente en [[06_Flujos_MVP/flujo_mina_mercedes|Flujo Mina Mercedes]] y [[06_Flujos_MVP/flujo_sunworks_hitos_avances_parciales|Flujo Sunworks: Hitos y Avances Parciales]].

## 29. Hipótesis principales a validar

Las principales hipótesis iniciales son:

- Las PyMEs pierden seguimiento de compromisos importantes en WhatsApp.
- Los usuarios sí aceptarían enviar compromisos formales a un número de WhatsApp Business.
- Los responsables sí responderían compromisos, evidencias y avances desde WhatsApp.
- Los gerentes valorarían reportes y trazabilidad.
- El costo de mensajes de WhatsApp Business puede ser absorbido por el modelo de negocio.
- El producto puede diferenciarse de task managers tradicionales.
- La IA puede ayudar a estructurar compromisos sin convertirse en el producto principal.
- El enrolamiento obligatorio puede reducir fricción legal, operativa y de percepción.
- La web/PWA puede complementar WhatsApp sin romper la adopción de baja fricción.
- Gamora Core puede soportar compromisos simples y escenarios complejos sin romper su modelo central.
- Los usuarios operativos podrán reportar avances con lenguaje natural sin memorizar identificadores técnicos.

Estas hipótesis deberán probarse antes de asumir que el producto está listo para escalar.

## 30. Riesgos iniciales

Los riesgos iniciales identificados son:

- Que el usuario no adopte el canal formal de Gamora.
- Que siga usando solo WhatsApp personal y no registre compromisos.
- Que los responsables perciban a Gamora como vigilancia.
- Que las notificaciones generen ruido.
- Que las restricciones de Meta limiten algunos flujos.
- Que la IA interprete mal mensajes o fechas.
- Que el producto sea percibido como un task manager más.
- Que el costo por mensaje afecte la rentabilidad.
- Que el onboarding agregue demasiada fricción si se diseña de forma pesada.
- Que no se distinga correctamente entre invitación, consentimiento y enrolamiento.
- Que los escenarios complejos vuelvan pesado el producto para casos simples.
- Que la IA sugiera estructuras incorrectas si el backend no valida reglas de negocio.
- Que avance reportado y avance validado se mezclen sin control.

Estos riesgos deberán ser gestionados desde el diseño funcional, la comunicación del producto y las pruebas del MVP.

## 31. Definición inicial de éxito del MVP

El MVP será exitoso si demuestra que:

- Luis puede crear compromisos desde WhatsApp.
- Gamora puede notificar responsables autorizados y enrolados.
- Los responsables pueden aceptar y enviar evidencias.
- Luis puede revisar, aprobar o rechazar.
- El sistema puede cerrar compromisos con bitácora.
- La web/PWA refleja el estado real.
- El caso Mina Mercedes puede operarse de punta a punta con comunicación real vía WhatsApp Business API.
- El onboarding permite activar un espacio de trabajo y enrolar usuarios sin instalar una app móvil adicional.
- El caso Sunworks puede representar hitos, avances parciales, evidencias, validación supervisora y avance validado sin exigir claves técnicas al usuario operativo.

Esta definición de éxito se enfoca en validar el flujo operativo completo, no en construir todas las capacidades futuras del producto.

## 32. Cierre de la tesis

Gamora Bot busca resolver la brecha entre conversación informal y seguimiento formal.

Su oportunidad no está en competir como otro gestor de tareas, ni en convertirse en un WhatsApp interno para empleados, sino en operar como el canal formal de compromisos operativos para empresas que ya trabajan por WhatsApp, pero necesitan control, evidencia, trazabilidad y rendición de cuentas.

La tesis central es que WhatsApp ya concentra una parte crítica de la operación diaria, pero necesita una capa formal que transforme acuerdos dispersos en compromisos operativos trazables. Gamora Bot propone ocupar ese espacio con Gamora Core como núcleo de control, WhatsApp Business como canal operativo principal del MVP y web/PWA como capa formal de administración, revisión y trazabilidad.

La validación del caso Sunworks refuerza que Gamora debe poder escalar de compromisos simples a escenarios operativos complejos, sin romper su premisa de mínima fricción. La complejidad debe vivir en Gamora Core, mientras el usuario operativo puede seguir usando lenguaje natural, alias y evidencias desde WhatsApp.
