# D-022 — WhatsApp-first como interfaz principal del prototipo simulado

## Estado

Aprobada para la etapa de prototipo simulado.

## Contexto

Durante la revisión de los wireframes textuales del prototipo simulado de Gamora Bot, se identificó una oportunidad crítica para reducir fricción en la experiencia del usuario final.

La versión inicial del flujo combinaba WhatsApp con Web/PWA de forma híbrida. En esa versión, algunas acciones clave del ciclo de vida del compromiso se ejecutaban desde la Web/PWA, como crear compromisos, enviar evidencia, revisar evidencia, pedir corrección o cerrar.

Sin embargo, esta dinámica puede generar fricción, ya que obliga al usuario a salir de la conversación de WhatsApp para completar acciones operativas.

Dado que la tesis central de Gamora Bot es aprovechar el canal donde los usuarios ya operan naturalmente, se decide ajustar el enfoque hacia una experiencia WhatsApp-first.

## Decisión

Gamora Bot adoptará un enfoque WhatsApp-first para el prototipo simulado.

Esto significa que el flujo principal de punta a punta deberá poder ejecutarse desde la conversación de WhatsApp con Gamora Bot.

La Web/PWA seguirá existiendo, pero como capa opcional de visualización, consulta, control estructurado e historial. No será obligatoria para iniciar, seguir ni cerrar el flujo principal.

## Nueva regla de experiencia

Todo flujo crítico del prototipo debe poder ejecutarse desde WhatsApp.

La Web/PWA debe funcionar como tablero opcional, no como canal obligatorio.

## Implicación principal

El usuario debe tener la sensación de que todo ocurre dentro de WhatsApp, aunque internamente el backend, los estados, la trazabilidad, la evidencia y la lógica del proceso vivan en Gamora Bot.

## Nuevo rol de WhatsApp

WhatsApp será la interfaz principal para:

- dictar o escribir instrucciones en lenguaje natural,
    
- crear compromisos,
    
- responder preguntas aclaratorias,
    
- confirmar compromisos estructurados,
    
- recibir compromisos asignados,
    
- aceptar compromisos,
    
- enviar evidencia,
    
- recibir solicitudes de corrección,
    
- reenviar evidencia corregida,
    
- revisar evidencia,
    
- aprobar,
    
- pedir corrección,
    
- cerrar compromisos,
    
- consultar estados básicos.
    

## Nuevo rol de la Web/PWA

La Web/PWA será opcional y servirá para:

- visualizar compromisos de forma estructurada,
    
- consultar tableros,
    
- revisar historial,
    
- buscar compromisos anteriores,
    
- ver evidencias agrupadas,
    
- administrar responsables,
    
- analizar carga operativa,
    
- revisar pendientes por estado,
    
- operar con mayor comodidad cuando haya muchos compromisos.
    

La Web/PWA no será el canal obligatorio para completar el flujo principal.

## Principio de IA en el flujo

Gamora Bot podrá recibir instrucciones en lenguaje natural y estructurarlas como compromiso formal.

Sin embargo, la IA no debe crear compromisos de forma definitiva sin confirmación humana.

La regla será:

**Gamora Bot interpreta, estructura y propone; el usuario confirma.**

## Flujo de creación con lenguaje natural

El usuario podrá escribir o dictar algo como:

“Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.”

Gamora Bot deberá estructurar la instrucción:

- Responsable: Panchito.
    
- Actividad: contar sacos de cemento.
    
- Ubicación: Sucursal Norte.
    
- Fecha compromiso: hoy antes de las 5:00 p.m.
    
- Evidencia esperada: foto y cantidad total.
    

Después deberá pedir confirmación:

“¿Creo el compromiso así?”

Opciones:

- Crear compromiso.
    
- Editar.
    
- Cancelar.
    

## Manejo de datos faltantes

Si la instrucción original no incluye un dato clave, Gamora Bot deberá preguntarlo dentro del chat.

Ejemplos:

Si falta fecha:

“¿Para cuándo debe quedar listo?”

Si falta responsable:

“¿Quién debe atender este compromiso?”

Si falta ubicación:

“¿En qué sucursal o lugar debe hacerse?”

Si falta evidencia:

“¿Qué evidencia debe mandar para confirmar que quedó hecho?”

## Campos mínimos del compromiso

Para la primera demo, Gamora Bot debe intentar capturar estos campos mínimos:

- responsable,
    
- actividad,
    
- ubicación si aplica,
    
- fecha compromiso,
    
- evidencia esperada.
    

## Confirmación obligatoria

Antes de crear el compromiso, Gamora Bot debe mostrar un resumen estructurado y pedir confirmación.

Esto evita errores por interpretación incorrecta del lenguaje natural.

## Flujo principal actualizado

El flujo principal del prototipo será:

1. Luisito escribe o dicta una instrucción a Gamora Bot en WhatsApp.
    
2. Gamora Bot interpreta la instrucción.
    
3. Gamora Bot identifica campos completos y faltantes.
    
4. Si falta información, Gamora Bot pregunta dentro del chat.
    
5. Luisito responde los datos faltantes.
    
6. Gamora Bot muestra resumen estructurado.
    
7. Luisito confirma.
    
8. Gamora Bot crea el compromiso.
    
9. Panchito recibe el compromiso por WhatsApp.
    
10. Panchito acepta desde WhatsApp.
    
11. Panchito manda evidencia desde WhatsApp.
    
12. Gamora Bot avisa a Luisito dentro de WhatsApp.
    
13. Luisito revisa desde WhatsApp.
    
14. Luisito aprueba o pide corrección desde WhatsApp.
    
15. Si hay corrección, Panchito recibe instrucción dentro de WhatsApp.
    
16. Panchito reenvía evidencia desde WhatsApp.
    
17. Luisito aprueba y cierra desde WhatsApp.
    
18. Gamora Bot confirma cierre a Luisito y Panchito.
    
19. La Web/PWA refleja todo como tablero e historial opcional.
    

## Cambio frente a la versión anterior

Antes:

- WhatsApp era canal operativo parcial.
    
- Web/PWA era necesaria para varias acciones clave.
    

Ahora:

- WhatsApp es la interfaz principal.
    
- Web/PWA es tablero opcional.
    

## Beneficio esperado

Este cambio reduce fricción porque el usuario no tiene que abandonar el entorno donde ya conversa y opera.

También refuerza la diferenciación de Gamora Bot frente a un task manager tradicional.

## Riesgos

### Riesgo 1 — Exceso de confianza en IA

La IA podría interpretar mal una instrucción.

Mitigación:

Siempre mostrar resumen y pedir confirmación antes de crear el compromiso.

### Riesgo 2 — Conversaciones largas

Si faltan muchos datos, el flujo puede sentirse lento.

Mitigación:

Solicitar solo campos mínimos y usar preguntas breves.

### Riesgo 3 — Saturación de WhatsApp

Si se envían demasiados mensajes, el usuario puede sentir ruido.

Mitigación:

Agrupar información, usar botones y evitar mensajes innecesarios.

### Riesgo 4 — Límites reales de WhatsApp Business

En producto real, algunas comunicaciones estarán sujetas a reglas de ventana de atención, plantillas aprobadas y políticas de WhatsApp Business.

Mitigación:

Para el prototipo simulado, representar el flujo ideal. Para producto real, diseñar templates y reglas de conversación conforme a Meta.

## Decisión sobre el prototipo actual

Los documentos anteriores no se descartan.

Se reclasifican como versión inicial híbrida.

A partir de esta decisión, los siguientes entregables deberán ajustarse al enfoque WhatsApp-first.

## Documentos que deben actualizarse

Deben actualizarse o crear versión nueva de:

- `06_Flujos_MVP/flujo_maestro_prototipo_simulado_ferreteria_luisito.md`
    
- `13_UI_UX_y_Marca/textos_base_pantallas_web_pwa_ferreteria_luisito.md`
    
- `13_UI_UX_y_Marca/mapa_pantallas_prototipo_simulado_ferreteria_luisito.md`
    
- `13_UI_UX_y_Marca/wireframes_textuales_prototipo_simulado_ferreteria_luisito.md`
    

## Nueva dirección

El siguiente entregable deberá ser:

**Flujo Maestro Conversacional WhatsApp-first — Ferretería Luisito**

Este documento reemplazará el flujo híbrido como base principal del prototipo simulado.

## Cierre

La decisión WhatsApp-first fortalece la tesis central de Gamora Bot:

No se trata de obligar al usuario a usar otra plataforma.

Se trata de convertir lo que ya ocurre en WhatsApp en compromisos claros, evidenciables y cerrables, con el menor cambio posible en el hábito del usuario.