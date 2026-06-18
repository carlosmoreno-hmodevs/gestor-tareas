# Caso Demo Principal — Ferretería Luisito

## Estado

Documento base para validación del caso demo principal del prototipo simulado de Gamora Bot.

## Propósito

Este documento define el caso principal que se usará para construir la narrativa, flujo, mensajes simulados, pantallas base, storyboard y prototipo estático de Gamora Bot.

El objetivo no es documentar un caso real ni construir funcionalidad técnica, sino definir una historia simple, entendible y validable para mostrar el valor del producto.

## Caso seleccionado

El caso demo principal será:

**Ferretería Luisito**

## Razón de selección

Ferretería Luisito se elige como caso demo principal porque representa un negocio operativo fácil de entender, sin necesidad de explicar procesos complejos, regulaciones, sistemas empresariales o integraciones técnicas.

El caso permite mostrar con claridad el problema central que Gamora Bot busca resolver:

**Los pendientes operativos que se dan por WhatsApp se pierden, se olvidan, se confunden o no quedan correctamente cerrados con evidencia.**

## Enfoque del caso

El caso se enfocará en una situación sencilla:

Luisito necesita que Panchito realice una actividad operativa concreta en la ferretería y le mande evidencia.

En lugar de darle seguimiento manual por WhatsApp, Luisito usa Gamora Bot para convertir ese pendiente en un compromiso operativo trazable.

## Problema actual sin Gamora Bot

En el flujo actual, Luisito puede pedir algo por WhatsApp, pero después enfrenta varios problemas:

- No siempre queda claro quién es el responsable.
    
- El pendiente se mezcla con otros mensajes.
    
- El responsable puede olvidar la instrucción.
    
- No hay fecha compromiso claramente visible.
    
- No siempre se manda evidencia.
    
- Si se manda evidencia, puede quedar perdida en el chat.
    
- Luisito tiene que estar preguntando si ya se hizo.
    
- No hay cierre formal del pendiente.
    
- No hay historial ordenado para revisar después.
    

## Propuesta de valor en este caso

Gamora Bot convierte una instrucción operativa en un compromiso formal, sin obligar al usuario operativo a aprender una plataforma compleja.

La propuesta de valor específica del caso es:

**Luisito deja de perseguir pendientes por WhatsApp y puede ver qué está asignado, qué fue aceptado, qué tiene evidencia, qué necesita corrección y qué ya quedó cerrado.**

## Compromiso operativo de ejemplo

Para el prototipo simulado, el compromiso principal será:

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Datos del compromiso

|Elemento|Definición para la demo|
|---|---|
|Solicitante|Luisito|
|Responsable|Panchito|
|Negocio|Ferretería Luisito|
|Ubicación|Sucursal Norte|
|Compromiso|Contar los sacos de cemento disponibles|
|Fecha compromiso|Hoy antes de las 5:00 p.m.|
|Evidencia esperada|Foto del área de cemento y cantidad total reportada|
|Resultado esperado|Luisito puede validar si el conteo fue realizado correctamente|
|Posible corrección|La foto no muestra todos los sacos o falta indicar la cantidad total|

## Actores principales

### Luisito

Luisito representa al dueño, administrador o responsable operativo del negocio.

Necesita saber si los pendientes realmente se cumplieron, sin estar persiguiendo todo el día por WhatsApp.

### Panchito

Panchito representa al colaborador operativo.

Necesita recibir instrucciones claras, saber qué debe hacer, cuándo debe hacerlo y qué evidencia debe mandar.

No quiere usar una app complicada ni llenar formularios largos.

### Gamora Bot

Gamora Bot representa el canal formal que convierte el pendiente en compromiso, guía al responsable, solicita evidencia y mantiene trazabilidad.

No reemplaza a WhatsApp. Ordena el momento en que una instrucción se vuelve compromiso.

### Rosita

Rosita puede aparecer como actor secundario si necesitamos mostrar supervisión, consulta o apoyo operativo.

No será protagonista en la primera versión del flujo para evitar complejidad innecesaria.

## Mapa de actores

|Actor|Rol en la demo|Qué necesita|Qué no quiere|
|---|---|---|---|
|Luisito|Dueño / administrador|Ver pendientes, evidencias y cierres|Perseguir gente por WhatsApp|
|Panchito|Responsable operativo|Saber qué hacer y cómo cumplir|Usar una app complicada|
|Gamora Bot|Canal formal de seguimiento|Guiar el compromiso y registrar estados|Parecer un robot invasivo o burocrático|
|Rosita|Apoyo / supervisión secundaria|Consultar o apoyar si se requiere|Entrar a un flujo innecesario|

## Dolor principal que debe sentirse en la demo

El dolor principal no es “falta de tareas”.

El dolor principal es:

**Luisito ya usa WhatsApp para operar, pero WhatsApp solo conversa; no controla, no evidencia y no cierra compromisos.**

## Momento de valor principal

El momento de valor principal debe ocurrir cuando Luisito ve que un pendiente que antes estaría perdido en WhatsApp ahora aparece como compromiso con:

- responsable,
    
- fecha,
    
- evidencia,
    
- estado,
    
- historial,
    
- revisión,
    
- corrección si aplica,
    
- cierre.
    

Ese momento debe hacer que el usuario piense:

**“Esto sí me ayudaría a dejar de andar preguntando si ya hicieron las cosas.”**

## Qué debe demostrar el prototipo

El prototipo debe demostrar:

1. Que crear un compromiso puede ser simple.
    
2. Que el responsable puede entenderlo sin capacitación.
    
3. Que WhatsApp puede seguir siendo el punto natural de interacción.
    
4. Que la evidencia queda asociada al compromiso.
    
5. Que el solicitante puede aprobar o pedir corrección.
    
6. Que el cierre queda claro.
    
7. Que el sistema aporta control sin sentirse pesado.
    

## Qué no debe demostrar todavía

El prototipo no debe intentar demostrar:

- Integración real con WhatsApp.
    
- Automatización real.
    
- IA real.
    
- Base de datos.
    
- Login real.
    
- Configuraciones avanzadas.
    
- Reportes complejos.
    
- Multiempresa.
    
- Roles avanzados.
    
- Analítica ejecutiva.
    
- Marketplace.
    
- Auditoría.
    
- ERP.
    
- CRM.
    
- Casos corporativos complejos.
    

## Riesgo de confusión

El principal riesgo es que el usuario vea Gamora Bot como “otra app de tareas”.

Para evitarlo, el caso debe insistir en que Gamora Bot no nace como una lista genérica de tareas, sino como una forma de formalizar, evidenciar y cerrar pendientes que normalmente se persiguen por WhatsApp.

## Lenguaje recomendado

El lenguaje debe ser simple, operativo y humano.

Se deben favorecer palabras como:

- pendiente,
    
- compromiso,
    
- evidencia,
    
- revisar,
    
- corregir,
    
- cerrar,
    
- hoy,
    
- responsable,
    
- foto,
    
- listo.
    

Se deben evitar palabras demasiado técnicas como:

- workflow,
    
- trazabilidad avanzada,
    
- automatización agentiva,
    
- motor transaccional,
    
- orquestación,
    
- cumplimiento normativo,
    
- auditoría,
    
- gobernanza.
    

## Promesa de la demo

La promesa de la demo será:

**Gamora Bot ayuda a convertir pendientes de WhatsApp en compromisos claros, con evidencia y cierre, sin complicarle la vida al equipo operativo.**

## Pregunta de validación

La pregunta central que este caso debe ayudarnos a responder es:

**¿Un dueño o responsable de una PyME entiende rápidamente que Gamora Bot le puede ahorrar persecución, desorden y evidencia perdida en WhatsApp?**

## Criterio de aprobación del caso

Este caso se considerará aprobado si cumple con lo siguiente:

- Es fácil de explicar.
    
- Representa un dolor cotidiano.
    
- No requiere contexto técnico.
    
- Permite mostrar evidencia.
    
- Permite mostrar aprobación y corrección.
    
- Permite mostrar cierre.
    
- No se siente como software corporativo pesado.
    
- No se confunde con un task manager genérico.
    
- Permite construir una demo breve y clara.
    

## Decisión preliminar

Se propone aprobar Ferretería Luisito como caso demo principal para la primera versión del prototipo simulado de Gamora Bot.

Este caso será la base para los siguientes entregables:

1. Guion narrativo de demo.
    
2. Flujo maestro.
    
3. Mensajes simulados.
    
4. Pantallas base.
    
5. Wireframes.
    
6. Storyboard.
    
7. Prototipo estático.
    
8. Guion de validación con usuarios.