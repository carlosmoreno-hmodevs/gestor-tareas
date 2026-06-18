# Guardrails de Viabilidad — Conexión WhatsApp + Web/PWA

## Estado

Documento rector de viabilidad práctica para el enfoque de doble interfaz de Gamora Bot.

## Propósito

Este documento define qué parte de la experiencia WhatsApp + Web/PWA es viable, qué debe manejarse con cuidado y qué no debe prometerse en el prototipo para evitar diseñar una experiencia atractiva pero inviable en la práctica.

## Principio rector

La propuesta de Gamora Bot no es eliminar la Web/PWA.

La propuesta es reducir fricción operativa usando WhatsApp como interfaz natural, mientras la Web/PWA funciona como la capa estructurada de coordinación, control, historial y visualización.

## Frase rectora

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

## Decisión de producto

Gamora Bot se diseñará como una experiencia de doble interfaz:

1. WhatsApp para operar rápido.
    
2. Web/PWA para ordenar, visualizar, administrar y consultar.
    

El usuario debe poder moverse entre ambas interfaces sin sentir que está cambiando de sistema o empezando de nuevo.

## Qué sí debe poder hacerse desde WhatsApp

En el prototipo simulado, WhatsApp debe permitir:

- Dictar o escribir una instrucción en lenguaje natural.
    
- Crear un borrador de compromiso.
    
- Responder datos faltantes.
    
- Confirmar creación.
    
- Recibir un compromiso asignado.
    
- Aceptar compromiso.
    
- Enviar evidencia.
    
- Recibir solicitud de corrección.
    
- Reenviar evidencia corregida.
    
- Revisar evidencia.
    
- Aprobar y cerrar.
    
- Consultar estado básico.
    
- Abrir enlace a Web/PWA si se requiere vista estructurada.
    

## Qué debe hacer la Web/PWA

La Web/PWA debe ser la capa que:

- Ordena compromisos.
    
- Muestra tablero.
    
- Agrupa evidencias.
    
- Conserva historial.
    
- Permite filtros.
    
- Permite consulta por responsable.
    
- Muestra vencidos.
    
- Permite revisar muchos compromisos a la vez.
    
- Permite administración de usuarios.
    
- Permite control más amplio que el chat.
    
- Permite regresar al hilo de WhatsApp cuando convenga.
    

## Regla de no fricción

La Web/PWA no debe ser obligatoria para completar el flujo operativo básico.

Pero debe estar disponible cuando el usuario necesite más control visual o más contexto.

## Conexión desde WhatsApp hacia Web/PWA

Desde WhatsApp, Gamora Bot puede ofrecer acciones como:

- Abrir en Web/PWA.
    
- Ver detalle.
    
- Ver historial.
    
- Ver tablero.
    
- Ver mis compromisos.
    
- Revisar evidencia en vista ampliada.
    

Estas acciones deben abrir una vista relacionada con el compromiso específico, no una pantalla genérica que obligue al usuario a buscar de nuevo.

## Conexión desde Web/PWA hacia WhatsApp

Desde Web/PWA, Gamora puede ofrecer acciones como:

- Abrir conversación en WhatsApp.
    
- Continuar en WhatsApp.
    
- Enviar recordatorio por WhatsApp.
    
- Solicitar corrección por WhatsApp.
    
- Compartir resumen por WhatsApp.
    
- Notificar cierre por WhatsApp.
    

La Web/PWA debe permitir volver al canal operativo sin perder contexto.

## Principio de continuidad

El usuario no debe sentir que WhatsApp y Web/PWA son dos mundos separados.

Debe sentir que son dos vistas del mismo flujo.

La conversación, estado, responsable, evidencia e historial deben mantenerse sincronizados.

## Qué no debemos prometer

Gamora Bot no debe prometer:

- Leer chats personales.
    
- Leer grupos de WhatsApp.
    
- Analizar conversaciones privadas.
    
- Operar sin consentimiento.
    
- Enviar mensajes proactivos ilimitados sin reglas.
    
- Crear compromisos sin confirmación humana.
    
- Cerrar compromisos automáticamente sin autorización del solicitante.
    
- Conservar evidencia solo en WhatsApp sin respaldo propio.
    
- Ser un chatbot genérico de IA dentro de WhatsApp.
    

## Restricción crítica de privacidad

Gamora Bot solo debe procesar mensajes enviados directamente al canal formal de Gamora Bot.

No debe presentarse como un sistema que observa o interpreta chats privados.

## Restricción crítica de IA

La IA puede interpretar lenguaje natural, pero no debe actuar de manera definitiva sin confirmación.

Regla:

**Interpretar → estructurar → preguntar faltantes → presentar resumen → confirmar → ejecutar.**

## Restricción crítica de WhatsApp

En producto real, WhatsApp Business Platform tiene reglas sobre ventanas de atención, plantillas aprobadas, mensajes interactivos, medios y políticas de uso.

Por lo tanto, el prototipo puede simular el flujo ideal, pero el diseño del producto real deberá considerar:

- ventana de atención de 24 horas,
    
- plantillas aprobadas para mensajes iniciados por la empresa,
    
- uso correcto de botones y listas,
    
- uso de medios,
    
- almacenamiento propio de evidencias,
    
- consentimiento y opt-in,
    
- reglas de Meta/WhatsApp.
    

## Viabilidad de la doble interfaz

La doble interfaz es viable si se diseña como continuidad de contexto, no como dos productos separados.

## Patrón correcto

WhatsApp:

- rápido,
    
- conversacional,
    
- operativo,
    
- bajo esfuerzo,
    
- ideal para acción inmediata.
    

Web/PWA:

- estructurada,
    
- visual,
    
- ordenada,
    
- administrativa,
    
- ideal para control y consulta.
    

## Patrón incorrecto

No debe diseñarse así:

- WhatsApp solo avisa.
    
- Web/PWA obliga a operar todo.
    
- El usuario sale de WhatsApp para cada acción.
    
- Cada interfaz tiene información distinta.
    
- El usuario tiene que repetir datos.
    
- La Web/PWA se siente como una carga adicional.
    

## Patrón ideal

Debe diseñarse así:

- El usuario inicia en WhatsApp.
    
- Gamora estructura.
    
- La Web/PWA registra y visualiza.
    
- El usuario puede continuar en WhatsApp.
    
- Si necesita contexto amplio, abre Web/PWA.
    
- Desde Web/PWA puede regresar a WhatsApp.
    
- El flujo conserva estado y contexto en ambas interfaces.
    

## Criterio de diseño

Cada vez que diseñemos una pantalla o mensaje, debemos preguntar:

1. ¿Esta acción debe poder hacerse desde WhatsApp?
    
2. ¿La Web/PWA aporta valor estructural o solo agrega fricción?
    
3. ¿El usuario tendría que repetir información?
    
4. ¿La transición conserva el contexto?
    
5. ¿Se entiende que ambas interfaces pertenecen al mismo flujo?
    
6. ¿Estamos prometiendo algo que WhatsApp no permite?
    
7. ¿La IA está pidiendo confirmación antes de actuar?
    

## Decisión para el prototipo

El prototipo simulado deberá mostrar explícitamente la conexión entre ambas interfaces.

No basta con mostrar WhatsApp.

No basta con mostrar Web/PWA.

El valor está en demostrar que:

**lo que nace en WhatsApp queda ordenado en Web/PWA, y lo que se revisa en Web/PWA puede continuar en WhatsApp.**

## Ejemplo de transición WhatsApp → Web/PWA

Gamora Bot:

“Luisito, Panchito envió evidencia para revisión.

Puedes aprobarla aquí o abrirla en vista ampliada.”

Opciones:

- Aprobar y cerrar.
    
- Pedir corrección.
    
- Abrir en Web/PWA.
    

## Ejemplo de transición Web/PWA → WhatsApp

En Web/PWA:

Compromiso: Contar sacos de cemento.  
Estado: Necesita corrección.

Acciones:

- Ver historial.
    
- Revisar evidencia.
    
- Continuar corrección en WhatsApp.
    

## Mensaje de producto

Gamora Bot vive donde trabajas: WhatsApp para operar, Web/PWA para controlar.

## Mensaje comercial

Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp. Gamora los convierte en compromisos ordenados, con evidencia, seguimiento y cierre.

## Criterios de aprobación de futuros entregables

Todo entregable futuro debe cumplir estas reglas:

- WhatsApp debe ser suficiente para operar el flujo básico.
    
- Web/PWA debe aportar control, no fricción.
    
- Las transiciones entre interfaces deben conservar contexto.
    
- La IA debe confirmar antes de actuar.
    
- La privacidad debe ser explícita.
    
- No se debe prometer lectura de chats personales.
    
- No se debe depender de funciones no validadas de WhatsApp.
    
- No se debe convertir la demo en fantasía técnica.
    

## Próximo entregable relacionado

El siguiente entregable será:

**Mapa de Pantallas WhatsApp-first + Web/PWA Opcional — Ferretería Luisito**

Ese documento deberá rediseñar las pantallas del prototipo bajo esta regla de doble interfaz viable.