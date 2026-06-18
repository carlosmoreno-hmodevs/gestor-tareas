# Arquitectura UX Punta a Punta — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento traduce el Customer Journey de Gamora Bot a una arquitectura UX de producto.

No define identidad visual final, manual de marca, paleta, logo ni diseño comercial final.

Su objetivo es definir cómo debe navegar y experimentar el usuario Gamora Bot desde que toca las interfaces del producto hasta que obtiene valor recurrente.

## 2. Principio rector de experiencia

“Más poder con menos fricción.”

Gamora debe darle al usuario más control, trazabilidad, claridad y capacidad operativa, sin convertir la experiencia en una pantalla pesada, técnica o saturada.

La experiencia debe aumentar el control del negocio sin aumentar innecesariamente la carga mental del usuario.

## 3. Alcance del journey UX

Este documento no cubre descubrimiento comercial externo.

No cubre:

- anuncios;
- redes sociales;
- landing marketing;
- campañas;
- ventas.

Sí cubre:

- primer contacto operativo por WhatsApp o QR;
- aceptación básica;
- onboarding web/PWA;
- creación de workspace;
- configuración mínima;
- invitación y enrolamiento;
- primer compromiso;
- evidencia;
- revisión;
- aprobación/corrección;
- cierre;
- uso recurrente;
- resúmenes;
- retención;
- expansión gradual.

## 4. Usuario principal inicial

El usuario principal inicial es un dueño, gerente, coordinador o responsable operativo de una PyME que ya coordina pendientes por WhatsApp y necesita saber:

- qué se pidió;
- quién quedó responsable;
- cuándo debe cumplirse;
- dónde está la evidencia;
- qué está pendiente;
- qué está vencido;
- qué debe revisar;
- qué ya se cerró.

No necesariamente es un usuario técnico ni quiere aprender un sistema pesado.

## 5. Actores secundarios

### Administrador / dueño / coordinador

Necesita control, visibilidad, creación de compromisos, revisión, aprobación y reportes.

### Responsable operativo

Necesita saber qué le toca, aceptar, ejecutar, enviar evidencia y corregir si le piden.

### Validador / supervisor

Necesita revisar evidencia, aprobar, pedir corrección, rechazar o cerrar.

### Observador / gerente

Necesita vista general, vencidos, riesgos, responsables y resumen.

## 6. Dolor raíz traducido a UX

El problema no es que falte conversación. El problema es que los acuerdos importantes se pierden, las evidencias quedan dispersas, los responsables no son claros y el seguimiento depende de memoria humana.

Traducido a UX:

- la interfaz debe reducir búsqueda;
- la interfaz debe reducir persecución manual;
- la interfaz debe mostrar lo que requiere atención;
- la interfaz debe hacer visible qué pasó y qué sigue;
- la interfaz debe evitar que el usuario reconstruya conversaciones.

## 7. Mapa de journey UX desde que toca Gamora

| Etapa UX | Usuario principal | Pregunta del usuario | Dolor/fricción | Interfaz o canal | Acción principal | Información mínima visible | Información secundaria | Momento de valor esperado | Riesgo si falla |
|---|---|---|---|---|---|---|---|---|---|
| 1. Primer contacto operativo | Dueño / coordinador | ¿Qué es Gamora y para qué me sirve ahora? | Miedo a otra plataforma pesada | WhatsApp / QR / web inicial | Iniciar contacto | Propósito simple y canal oficial | Aviso de privacidad y consentimiento | “Puedo empezar sin aprender software pesado.” | El usuario abandona antes de probar. |
| 2. Aceptación básica y claridad de propósito | Dueño / coordinador | ¿Me va a vigilar o leer chats? | Riesgo de desconfianza | WhatsApp + web/PWA | Aceptar uso operativo | Qué hace, qué no hace, consentimiento | Términos, privacidad, baja | “No lee chats personales.” | Rechazo por percepción de vigilancia. |
| 3. Onboarding mínimo | Administrador | ¿Qué necesito configurar para empezar? | Configuración percibida como carga | Web/PWA | Completar pasos mínimos | Progreso, siguiente paso | Reglas avanzadas opcionales | “Puedo dejarlo listo rápido.” | Abandono por exceso de campos. |
| 4. Creación de workspace | Administrador | ¿Dónde vive mi operación? | Ambigüedad de empresa/sucursal/frente | Web/PWA | Crear espacio operativo | Nombre y estado | Zona horaria, país, unidades | “Ya tengo un espacio de control.” | Datos desordenados desde el inicio. |
| 5. Configuración básica | Administrador | ¿Qué regla mínima debo definir? | Miedo a configurar demasiado | Web/PWA | Definir reglas mínimas | Canal, roles básicos, recordatorios simples | Límites, guardrails, preferencias | “Solo configuré lo necesario.” | La configuración parece enterprise. |
| 6. Invitación de usuarios | Administrador | ¿A quién necesito sumar? | Alta fricción para activar equipo | Web/PWA | Invitar primer responsable | Nombre, rol, estado de invitación | Teléfono, unidad, permisos | “Puedo sumar usuarios con control.” | Usuarios quedan mal registrados. |
| 7. Enrolamiento de usuarios | Responsable | ¿Por qué recibo esto? | Temor a mensajes sorpresa | WhatsApp / enlace / QR | Aceptar participación | Propósito, consentimiento, qué recibirá | Privacidad, baja, términos | “Puedo participar sin sentir vigilancia.” | Baja adopción o rechazo del equipo. |
| 8. Primer compromiso operativo | Coordinador | ¿Cómo convierto un pendiente en compromiso? | Formularios pesados | WhatsApp futuro / web/PWA | Crear compromiso | Qué, quién, cuándo, evidencia | Prioridad, unidad, validador | “Ya no quedó solo en WhatsApp.” | Gamora se siente como task manager pesado. |
| 9. Aceptación del responsable | Responsable | ¿Esto me toca a mí? | Responsabilidad ambigua | WhatsApp futuro / web/PWA | Aceptar compromiso | Compromiso, fecha, evidencia esperada | Contexto, solicitante, prioridad | “Ya quedó claro quién lo tomó.” | Sigue la ambigüedad operativa. |
| 10. Evidencia recibida | Coordinador / responsable | ¿Dónde quedó la foto o PDF? | Evidencia dispersa | WhatsApp futuro / web/PWA | Asociar evidencia | Compromiso, archivo, responsable | Historial, sensibilidad, comentarios | “La evidencia ya no se perdió.” | Evidencia mezclada o sin contexto. |
| 11. Revisión/aprobación/corrección | Validador | ¿Puedo aprobar o debo pedir ajuste? | Cierre informal | Web/PWA | Decidir | Evidencia, estado, acción recomendada | Bitácora, detalle completo | “No solo se reportó; fue validado.” | Se confunde reporte con cumplimiento. |
| 12. Cierre con bitácora | Coordinador / gerente | ¿Quedó cerrado y trazado? | Falta de historia completa | Web/PWA | Cerrar/liberar | Estado final, evidencia, aprobación | Timeline, audit, comentarios | “Tengo historia completa.” | Cierre opinable o sin respaldo. |
| 13. Uso diario / Mi día operativo | Coordinador | ¿Qué necesita mi atención hoy? | Demasiados pendientes dispersos | Web/PWA / resumen futuro | Resolver prioridades | Pendientes clave, vencidos, revisiones | Filtros, detalle, actividad | “Entro y sé qué hacer.” | Saturación tipo dashboard técnico. |
| 14. Pendientes por revisar | Validador | ¿Qué me enviaron para validar? | Evidencias sin revisión | Web/PWA | Revisar cola | Evidencia pendiente, responsable, fecha | Historial y archivos | “Puedo aprobar/corregir sin buscar.” | Revisiones se atrasan. |
| 15. Vencidos o en riesgo | Coordinador / gerente | ¿Qué puede generar problema? | Falta de alerta temprana | Web/PWA / resumen futuro | Priorizar seguimiento | Vencidos, riesgo, responsable | Bitácora, último movimiento | “Sé dónde actuar antes de que escale.” | Vencidos se ocultan entre datos. |
| 16. Consulta por responsable | Coordinador | ¿Qué tiene pendiente esta persona? | Seguimiento manual persona por persona | Web/PWA / WhatsApp futuro | Ver carga y retrasos | Responsable, pendientes, vencidos | Cerrados recientes, evidencia | “Ya no tengo que perseguir a ciegas.” | Persecución manual continúa. |
| 17. Resumen diario | Dueño / gerente | ¿Qué pasó y qué sigue? | Cierre operativo disperso | WhatsApp futuro / web/PWA | Leer resumen | Cerrados, vencidos, revisiones, próximos | Detalle por responsable | “Termino el día con claridad.” | Resumen se vuelve ruido. |
| 18. Retención / memoria operativa | Dueño / coordinador | ¿Puedo confiar en Gamora como memoria? | Dependencia de memoria humana | Web/PWA + WhatsApp futuro | Consultar historial y estado | Pendientes, cierres, evidencias | Bitácora completa, audit | “Ya no dependo de acordarme de todo.” | El producto parece herramienta adicional. |
| 19. Expansión gradual | Administrador / gerente | ¿Puedo crecer sin complicarme? | Complejidad al sumar sucursales/frentes | Web/PWA | Activar más uso | Sucursales, usuarios, reglas básicas | Proyectos, hitos, reportes avanzados | “Puedo empezar simple y crecer.” | Complejidad avanzada aparece demasiado pronto. |

## 8. Arquitectura de navegación propuesta

La navegación futura debe basarse en intención del usuario, no en tablas técnicas.

### Inicio / Mi día operativo

Debe mostrar lo que requiere atención ahora.

### Crear compromiso

Flujo simple y guiado para crear compromiso sin formulario pesado.

### Pendientes por revisar

Evidencias, avances o cierres que requieren validación.

### Compromisos

Listado filtrable, pero no como primera experiencia saturada.

### Personas

Responsables, estado de enrolamiento y carga de pendientes.

### Resumen

Cerrados, vencidos, próximos pasos y actividad relevante.

### Configuración

Workspace, usuarios, reglas básicas, invitaciones.

### Detalle

Pantalla secundaria para compromiso, timeline, audit y evidencias.

## 9. Pantalla principal futura: Mi día operativo

La pantalla principal futura debe responder:

- ¿Qué necesita mi atención hoy?
- ¿Qué está vencido?
- ¿Qué me enviaron para revisar?
- ¿Quién está atorado?
- ¿Qué se cerró recientemente?
- ¿Qué sigue?

No debe responder de inicio:

- todos los usuarios;
- todos los workspaces;
- todos los audit logs;
- todos los guardrails;
- todas las transiciones técnicas.

Secciones sugeridas:

- Acciones pendientes para mí.
- Evidencias por revisar.
- Compromisos vencidos/en riesgo.
- Responsables con retrasos.
- Actividad reciente relevante.
- Resumen rápido del día.

## 10. Onboarding UX

Flujo de onboarding mínimo:

1. Bienvenida clara.
2. Crear espacio de trabajo.
3. Agregar primera sucursal/frente opcional.
4. Crear o confirmar administrador.
5. Invitar primer usuario.
6. Crear primer compromiso.
7. Mostrar primer checklist de valor.

Regla:

No pedir todo al inicio.

Solo pedir lo necesario para llegar al primer compromiso.

## 11. Enrolamiento UX

Experiencia del administrador:

- ve usuarios invitados;
- ve quién aceptó;
- ve quién sigue pendiente;
- puede reenviar invitación;
- entiende que no se mandan compromisos a no enrolados.

Experiencia del responsable:

- entiende qué es Gamora;
- acepta participar;
- sabe que no se leerán chats personales;
- queda autorizado;
- recibe solo compromisos específicos.

## 12. Primer compromiso UX

Flujo desde WhatsApp futuro:

- usuario escribe instrucción natural;
- Gamora detecta datos;
- pregunta lo mínimo faltante;
- confirma;
- crea compromiso.

Flujo desde web/PWA:

- formulario guiado mínimo;
- responsable;
- fecha;
- evidencia esperada;
- prioridad opcional;
- confirmación.

Regla:

No convertir creación de compromiso en formulario empresarial pesado.

## 13. Revisión y cierre UX

Experiencia del validador:

Debe ver:

- qué se reportó;
- quién lo reportó;
- evidencia recibida;
- estado actual;
- acción recomendada.

Acciones:

- aprobar;
- pedir corrección;
- rechazar;
- cerrar si corresponde.

Regla:

La evidencia recibida no equivale a cierre. La validación humana sigue siendo central.

## 14. Uso recurrente UX

El usuario no debe entrar a “administrar tablas”.

Debe entrar a resolver:

- pendientes de hoy;
- vencidos;
- evidencias recibidas;
- compromisos por responsable;
- resumen.

La interfaz debe convertir operación dispersa en foco.

## 15. Retención UX

La interfaz debe reforzar retención mediante:

- memoria operativa;
- historial consultable;
- menos persecución manual;
- evidencia ordenada;
- cierre con bitácora;
- reportes simples;
- control sin abandonar WhatsApp.

La retención ocurre cuando el usuario siente que Gamora reduce olvidos y evita reconstruir conversaciones.

## 16. Expansión UX

La expansión debe ser gradual:

- de un workspace a más sucursales;
- de un responsable a más usuarios;
- de compromisos simples a compromisos con evidencia;
- de seguimiento básico a reportes;
- de operación simple a proyectos/hitos en fases posteriores.

Regla:

No mostrar complejidad avanzada hasta que el usuario la necesite.

## 17. Capas de información

Nivel 1 — Acción

Qué debo hacer ahora.

Nivel 2 — Contexto

Por qué importa.

Nivel 3 — Detalle

Datos del compromiso, evidencia, fechas, responsable.

Nivel 4 — Trazabilidad

Timeline, audit, guardrails, logs.

Regla:

El usuario no debe aterrizar en Nivel 4 salvo que haya pedido detalle.

## 18. Traducción de entidades técnicas a lenguaje humano

| Entidad técnica | Cómo la ve el sistema | Cómo debe verla el usuario |
|---|---|---|
| Workspace | Contenedor multi-tenant de datos operativos | Mi negocio / espacio operativo |
| User | Registro individual de usuario | Persona / responsable |
| WorkspaceUser | Relación usuario-workspace-rol | Participante |
| Commitment | Objeto operativo con estado, responsable y fecha | Compromiso |
| StateTransition | Cambio formal de estado | Cambio de estado |
| AuditLog | Registro funcional de acciones | Historial / bitácora |
| GuardrailEvent | Evento de límite, bloqueo o pausa | Alerta de control |
| ApiUsageLog | Registro de consumo técnico | Consumo del sistema |
| Timeline | Secuencia de transiciones | Historia del compromiso |

## 19. Reglas para evitar saturación

- Una pantalla, una intención principal.
- Máximo una acción primaria visible por bloque.
- Tablas solo cuando aportan control.
- Timeline/audit colapsados por defecto.
- Guardrails en segundo nivel.
- Filtros simples antes que configuradores complejos.
- Mostrar contadores y prioridades antes que listas largas.
- Usar estados vacíos explicativos.
- No mostrar configuración si el usuario está en operación diaria.
- No mostrar operación diaria si el usuario está en onboarding.

## 20. Diferencia entre MVP 2 y MVP 2.1

### MVP 2

Consola técnica neutral para validar motor.

### MVP 2.1

Reordenamiento UX por intención del usuario, todavía sin identidad visual final.

MVP 2.1 no debe cambiar el motor por cambiarlo. Debe reorganizar la experiencia para que el usuario vea primero lo relevante.

## 21. Implicaciones para el prompt MVP 2.1

El futuro prompt MVP 2.1 deberá:

- reorganizar la home hacia “Mi día operativo”;
- reducir saturación inicial;
- ocultar audit/timeline/guardrails en detalle;
- mostrar compromisos por atención requerida;
- mostrar acciones disponibles según estado;
- crear navegación por intención;
- mantener diseño neutral;
- no conectar WhatsApp/OpenAI;
- no implementar marca final;
- no resetear base;
- no romper MVP 1/MVP 2.

## 22. Relación con benchmark

Gamora no debe competir como task manager superficial.

La UX debe reforzar:

- compromisos operativos;
- evidencia;
- aprobación;
- bitácora;
- enrolamiento;
- control formal;
- WhatsApp + web/PWA como par funcional.

No diseñar una lista genérica de tareas.

El benchmark confirma que la categoría “tareas por WhatsApp” ya existe. La oportunidad de Gamora está en convertir WhatsApp en puerta operativa de un sistema formal de compromisos, con web/PWA como capa de control y Gamora Core como motor de reglas, estados, evidencias y trazabilidad.

## 23. Criterios de aceptación de arquitectura UX

La arquitectura UX será válida si:

- sigue el Customer Journey desde primer contacto operativo;
- excluye descubrimiento comercial;
- reduce saturación;
- define pantallas por intención;
- distingue consola técnica de producto usable;
- prioriza acciones necesarias;
- mantiene audit/timeline/guardrails disponibles pero secundarios;
- evita diseño final de marca;
- prepara MVP 2.1;
- conserva “Más poder con menos fricción.”

## 24. Cierre

Gamora Bot debe evolucionar desde una consola técnica hacia una experiencia guiada de control operativo.

La interfaz debe ayudar al usuario a saber qué pasó, qué falta y qué debe hacer, sin hacerlo navegar por estructuras técnicas innecesarias.

El objetivo es que Gamora se sienta como memoria operativa y guía de acción, no como otro sistema pesado.
