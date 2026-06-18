# Mapa de Pantallas del Prototipo Simulado — Ferretería Luisito

## Estado

Documento base para validar la estructura de pantallas del prototipo simulado de Gamora Bot.

## Propósito

Este documento define las pantallas necesarias para mostrar el flujo principal del caso Ferretería Luisito, sin diseñar todavía la interfaz visual final.

Su objetivo es decidir:

- qué pantallas existirán,
    
- quién verá cada pantalla,
    
- en qué orden aparecerán,
    
- qué objetivo cumple cada pantalla,
    
- qué información mínima debe mostrar,
    
- qué acción principal debe permitir,
    
- qué pantallas deben omitirse para evitar complejidad.
    

Este documento servirá como base para construir los wireframes textuales y posteriormente el storyboard.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Principio rector

El prototipo debe sentirse como una demo corta, clara y fácil de seguir.

No debe parecer una plataforma completa.

No debe mostrar todas las posibilidades futuras de Gamora Bot.

Debe mostrar un solo flujo bien contado:

**del pendiente suelto al compromiso cerrado.**

## Regla principal de pantallas

Cada pantalla debe responder una sola pregunta:

- ¿Qué está pasando?
    
- ¿Qué debe hacer el usuario?
    
- ¿Qué sigue?
    

Si una pantalla intenta responder demasiadas cosas, se debe simplificar.

---

# Estructura general del prototipo

El prototipo se dividirá en tres capas simuladas:

## 1. Capa tipo WhatsApp

Muestra la interacción natural entre Gamora Bot, Luisito y Panchito.

Función:

- comunicar el compromiso,
    
- confirmar aceptación,
    
- solicitar evidencia,
    
- avisar corrección,
    
- confirmar cierre.
    

## 2. Capa web/PWA de Luisito

Muestra el control operativo del solicitante.

Función:

- crear compromiso,
    
- revisar evidencia,
    
- pedir corrección,
    
- aprobar y cerrar,
    
- consultar historial.
    

## 3. Capa web/PWA de Panchito

Muestra la experiencia mínima del responsable operativo.

Función:

- ver sus compromisos,
    
- entender qué debe hacer,
    
- enviar evidencia,
    
- corregir y reenviar.
    

---

# Pantallas recomendadas para la demo

## Pantalla 1 — Problema actual: WhatsApp desordenado

### Tipo

Pantalla conceptual / apertura de demo.

### Actor principal

Luisito.

### Objetivo

Mostrar el dolor antes de Gamora Bot.

### Qué debe comunicar

Luisito opera por WhatsApp, pero los pendientes se mezclan con mensajes, audios, fotos y recordatorios.

### Información mínima

- Mensajes sueltos.
    
- Pendiente sin responsable formal.
    
- Evidencia perdida.
    
- Preguntas repetidas.
    
- Falta de cierre.
    

### Acción principal

Ninguna.

### Función dentro de la demo

Crear contraste entre el antes y el después.

### Nota crítica

Esta pantalla debe ser breve. No debe convertirse en explicación larga del problema.

---

## Pantalla 2 — Inicio de Luisito

### Tipo

Web/PWA simulada.

### Actor principal

Luisito.

### Objetivo

Mostrar que Luisito tiene un lugar simple para controlar compromisos.

### Qué debe comunicar

Luisito puede ver compromisos activos, evidencias por revisar, correcciones y cerrados.

### Información mínima

- Saludo: “Hola, Luisito”.
    
- Compromisos activos.
    
- Evidencias por revisar.
    
- Necesitan corrección.
    
- Cerrados hoy.
    
- Botón “Crear compromiso”.
    

### Acción principal

**Crear compromiso**

### Estado asociado

Vista general.

### Función dentro de la demo

Presentar a Gamora Bot como capa de control, no como chat suelto.

---

## Pantalla 3 — Crear compromiso

### Tipo

Web/PWA simulada.

### Actor principal

Luisito.

### Objetivo

Convertir un pendiente operativo en compromiso formal.

### Qué debe comunicar

Crear un compromiso debe ser simple y rápido.

### Información mínima

- Responsable: Panchito.
    
- Qué debe hacer: contar sacos de cemento.
    
- Dónde aplica: Sucursal Norte.
    
- Para cuándo: hoy antes de las 5:00 p.m.
    
- Evidencia esperada: foto del área y cantidad total.
    

### Acción principal

**Crear compromiso**

### Acción secundaria

Cancelar.

### Estado asociado

Nuevo.

### Función dentro de la demo

Mostrar el nacimiento del compromiso.

### Nota crítica

Esta pantalla no debe parecer un formulario pesado. Debe tener solo los campos esenciales.

---

## Pantalla 4 — Confirmación de compromiso creado

### Tipo

Web/PWA o mensaje tipo WhatsApp.

### Actor principal

Luisito.

### Objetivo

Confirmar que el compromiso fue creado y que Panchito será notificado.

### Qué debe comunicar

El pendiente ya no está suelto. Ahora tiene estructura.

### Información mínima

- Compromiso creado.
    
- Responsable.
    
- Fecha compromiso.
    
- Evidencia esperada.
    
- Aviso de notificación a Panchito.
    

### Acción principal

**Ver compromiso**

### Acción secundaria

Crear otro compromiso.

### Estado asociado

Nuevo.

### Función dentro de la demo

Dar certeza a Luisito.

---

## Pantalla 5 — WhatsApp simulado: Panchito recibe compromiso

### Tipo

WhatsApp simulado.

### Actor principal

Panchito.

### Objetivo

Mostrar cómo recibe el compromiso el responsable operativo.

### Qué debe comunicar

Panchito entiende en segundos qué debe hacer.

### Información mínima

- Luisito te asignó un nuevo compromiso.
    
- Qué hay que hacer.
    
- Para cuándo.
    
- Evidencia esperada.
    
- Botones: aceptar, tengo duda, no puedo atenderlo.
    

### Acción principal

**Aceptar compromiso**

### Estado asociado

Nuevo.

### Función dentro de la demo

Demostrar baja fricción para Panchito.

### Nota crítica

Esta es una de las pantallas más importantes. Si esta pantalla se siente complicada, la demo falla.

---

## Pantalla 6 — WhatsApp simulado: Panchito acepta

### Tipo

WhatsApp simulado.

### Actor principal

Panchito.

### Objetivo

Confirmar que Panchito aceptó el compromiso.

### Qué debe comunicar

El responsable entendió y confirmó que lo atenderá.

### Información mínima

- Compromiso aceptado.
    
- Recordatorio de evidencia esperada.
    
- Botón para enviar evidencia.
    

### Acción principal

**Enviar evidencia**

### Estado asociado

Aceptado.

### Función dentro de la demo

Mostrar que Luisito ya no necesita adivinar si Panchito vio el mensaje.

---

## Pantalla 7 — Aviso a Luisito: compromiso aceptado

### Tipo

WhatsApp simulado o notificación web/PWA.

### Actor principal

Luisito.

### Objetivo

Mostrar a Luisito que Panchito ya aceptó.

### Qué debe comunicar

El compromiso ya fue visto y aceptado.

### Información mínima

- Panchito ya aceptó.
    
- Compromiso.
    
- Fecha compromiso.
    
- Estado: aceptado.
    

### Acción principal

**Ver estado**

### Estado asociado

Aceptado.

### Función dentro de la demo

Eliminar incertidumbre.

---

## Pantalla 8 — Mi día de Panchito

### Tipo

Web/PWA simulada.

### Actor principal

Panchito.

### Objetivo

Mostrar la vista mínima del responsable operativo.

### Qué debe comunicar

Panchito solo ve lo que necesita atender.

### Información mínima

- Título: “Mi día”.
    
- Compromiso pendiente.
    
- Sucursal Norte.
    
- Fecha compromiso.
    
- Estado.
    
- Evidencia esperada.
    
- Botón “Enviar evidencia”.
    

### Acción principal

**Enviar evidencia**

### Estado asociado

En proceso.

### Función dentro de la demo

Demostrar que Panchito no tiene que usar un tablero complejo.

---

## Pantalla 9 — Enviar evidencia

### Tipo

Web/PWA simulada.

### Actor principal

Panchito.

### Objetivo

Permitir que Panchito reporte cumplimiento.

### Qué debe comunicar

Enviar evidencia debe ser tan simple como agregar foto y cantidad.

### Información mínima

- Foto de evidencia.
    
- Cantidad total de sacos.
    
- Comentario opcional.
    
- Botón enviar evidencia.
    

### Acción principal

**Enviar evidencia**

### Estado asociado

Evidencia enviada.

### Función dentro de la demo

Mostrar que la evidencia queda asociada al compromiso.

---

## Pantalla 10 — Confirmación a Panchito: evidencia enviada

### Tipo

Web/PWA o WhatsApp simulado.

### Actor principal

Panchito.

### Objetivo

Confirmar que la evidencia fue enviada a Luisito.

### Qué debe comunicar

El compromiso todavía no está cerrado; queda en revisión.

### Información mínima

- Evidencia enviada.
    
- Luisito la revisará.
    
- Aviso de posible cierre o corrección.
    

### Acción principal

**Ver compromiso**

### Estado asociado

Evidencia enviada.

### Función dentro de la demo

Evitar confundir evidencia enviada con compromiso cerrado.

---

## Pantalla 11 — Aviso a Luisito: evidencia por revisar

### Tipo

WhatsApp simulado o web/PWA.

### Actor principal

Luisito.

### Objetivo

Avisar que Panchito envió evidencia.

### Qué debe comunicar

Luisito ya tiene algo que revisar.

### Información mínima

- Panchito envió evidencia.
    
- Cantidad reportada: 48 sacos.
    
- Foto adjunta simulada.
    
- Botón revisar evidencia.
    

### Acción principal

**Revisar evidencia**

### Estado asociado

Evidencia enviada.

### Función dentro de la demo

Mostrar que Gamora Bot trae la evidencia al punto de decisión.

---

## Pantalla 12 — Revisar evidencia

### Tipo

Web/PWA simulada.

### Actor principal

Luisito.

### Objetivo

Permitir que Luisito apruebe o pida corrección.

### Qué debe comunicar

La decisión es simple: cerrar o corregir.

### Información mínima

- Compromiso.
    
- Responsable.
    
- Cantidad reportada.
    
- Evidencia enviada.
    
- Botón aprobar y cerrar.
    
- Botón pedir corrección.
    

### Acción principal

**Pedir corrección**

### Acción secundaria

Aprobar y cerrar.

### Estado asociado

Evidencia enviada.

### Función dentro de la demo

Mostrar control del solicitante sobre la evidencia.

### Nota crítica

En la demo principal, Luisito debe elegir “Pedir corrección” para mostrar el valor del ciclo completo.

---

## Pantalla 13 — Pedir corrección

### Tipo

Web/PWA simulada.

### Actor principal

Luisito.

### Objetivo

Explicar qué falta corregir.

### Qué debe comunicar

La corrección es específica y amable.

### Información mínima

- Motivo de corrección.
    
- Texto: la foto no muestra completo el espacio de cemento.
    
- Instrucción: mandar foto más abierta y confirmar cantidad.
    
- Botón enviar corrección.
    

### Acción principal

**Enviar corrección**

### Estado asociado

Necesita corrección.

### Función dentro de la demo

Mostrar que el producto evita ambigüedad.

---

## Pantalla 14 — WhatsApp simulado: Panchito recibe corrección

### Tipo

WhatsApp simulado.

### Actor principal

Panchito.

### Objetivo

Mostrar a Panchito qué debe corregir.

### Qué debe comunicar

Panchito no está regañado; solo tiene una instrucción clara para completar bien.

### Información mínima

- Luisito necesita una corrección.
    
- Qué falta corregir.
    
- Qué debe enviar.
    
- Botón corregir y reenviar.
    

### Acción principal

**Corregir y reenviar**

### Estado asociado

Necesita corrección.

### Función dentro de la demo

Mostrar corrección sin fricción emocional.

---

## Pantalla 15 — Enviar evidencia corregida

### Tipo

Web/PWA simulada.

### Actor principal

Panchito.

### Objetivo

Permitir que Panchito reenvíe evidencia corregida.

### Qué debe comunicar

No tiene que empezar de cero; solo corregir lo que falta.

### Información mínima

- Nueva foto.
    
- Cantidad total confirmada.
    
- Comentario.
    
- Botón reenviar evidencia.
    

### Acción principal

**Reenviar evidencia**

### Estado asociado

Corregido.

### Función dentro de la demo

Mostrar que el ciclo de corrección conserva el hilo del compromiso.

---

## Pantalla 16 — Aviso a Luisito: evidencia corregida

### Tipo

WhatsApp simulado o web/PWA.

### Actor principal

Luisito.

### Objetivo

Avisar que Panchito ya corrigió.

### Qué debe comunicar

La evidencia corregida está lista para decisión final.

### Información mínima

- Evidencia corregida enviada.
    
- Cantidad confirmada: 48 sacos.
    
- Foto completa del área.
    
- Botón aprobar y cerrar.
    

### Acción principal

**Aprobar y cerrar**

### Estado asociado

Corregido.

### Función dentro de la demo

Llevar a Luisito al cierre.

---

## Pantalla 17 — Aprobar y cerrar

### Tipo

Web/PWA simulada.

### Actor principal

Luisito.

### Objetivo

Confirmar el cierre formal del compromiso.

### Qué debe comunicar

El compromiso quedará cumplido, evidenciado y cerrado.

### Información mínima

- Compromiso.
    
- Responsable.
    
- Resultado: 48 sacos.
    
- Evidencia final.
    
- Botón cerrar compromiso.
    

### Acción principal

**Cerrar compromiso**

### Estado asociado

Cerrado.

### Función dentro de la demo

Mostrar el momento de valor principal.

---

## Pantalla 18 — Confirmación final: compromiso cerrado

### Tipo

Web/PWA o WhatsApp simulado.

### Actor principal

Luisito.

### Objetivo

Mostrar cierre claro y satisfactorio.

### Qué debe comunicar

El pendiente ya no está suelto ni pendiente de persecución.

### Información mínima

- Compromiso cerrado.
    
- Responsable.
    
- Resultado.
    
- Evidencia.
    
- Cierre.
    
- Botones: ver historial, crear otro compromiso.
    

### Acción principal

**Ver historial**

### Acción secundaria

Crear otro compromiso.

### Estado asociado

Cerrado.

### Función dentro de la demo

Cerrar la historia con sensación de control.

---

## Pantalla 19 — Confirmación a Panchito: compromiso cerrado

### Tipo

WhatsApp simulado.

### Actor principal

Panchito.

### Objetivo

Informar que Luisito aprobó y cerró el compromiso.

### Qué debe comunicar

Panchito ya cumplió correctamente.

### Información mínima

- Luisito aprobó la evidencia.
    
- Compromiso cerrado.
    
- Resultado registrado: 48 sacos.
    

### Acción principal

**Ver mis compromisos**

### Estado asociado

Cerrado.

### Función dentro de la demo

Dar cierre también al responsable operativo.

---

## Pantalla 20 — Historial del compromiso

### Tipo

Web/PWA simulada.

### Actor principal

Luisito.

### Objetivo

Mostrar trazabilidad simple.

### Qué debe comunicar

El compromiso tuvo seguimiento ordenado de principio a fin.

### Información mínima

- Creado.
    
- Recibido.
    
- Aceptado.
    
- Evidencia enviada.
    
- Corrección solicitada.
    
- Evidencia corregida.
    
- Aprobado y cerrado.
    

### Acción principal

**Volver al compromiso**

### Acción secundaria

Crear otro compromiso.

### Estado asociado

Cerrado.

### Función dentro de la demo

Mostrar que la evidencia y el cierre no quedaron perdidos en WhatsApp.

---

# Secuencia recomendada para la demo completa

La secuencia ideal de pantallas será:

1. Problema actual: WhatsApp desordenado.
    
2. Inicio de Luisito.
    
3. Crear compromiso.
    
4. Confirmación de compromiso creado.
    
5. WhatsApp simulado: Panchito recibe compromiso.
    
6. WhatsApp simulado: Panchito acepta.
    
7. Aviso a Luisito: compromiso aceptado.
    
8. Mi día de Panchito.
    
9. Enviar evidencia.
    
10. Confirmación a Panchito: evidencia enviada.
    
11. Aviso a Luisito: evidencia por revisar.
    
12. Revisar evidencia.
    
13. Pedir corrección.
    
14. WhatsApp simulado: Panchito recibe corrección.
    
15. Enviar evidencia corregida.
    
16. Aviso a Luisito: evidencia corregida.
    
17. Aprobar y cerrar.
    
18. Confirmación final: compromiso cerrado.
    
19. Confirmación a Panchito: compromiso cerrado.
    
20. Historial del compromiso.
    

## Secuencia compacta para demo corta

Si se requiere una demo más breve, se puede reducir a 12 pantallas:

1. Problema actual: WhatsApp desordenado.
    
2. Crear compromiso.
    
3. Panchito recibe compromiso.
    
4. Panchito acepta.
    
5. Mi día de Panchito.
    
6. Enviar evidencia.
    
7. Luisito revisa evidencia.
    
8. Luisito pide corrección.
    
9. Panchito recibe corrección.
    
10. Panchito reenvía evidencia.
    
11. Luisito aprueba y cierra.
    
12. Historial final.
    

## Secuencia mínima para validar idea

Si se quiere validar la idea en menos de 3 minutos, se puede reducir a 8 momentos:

1. Antes: pendiente perdido en WhatsApp.
    
2. Luisito crea compromiso.
    
3. Panchito recibe y acepta.
    
4. Panchito manda evidencia.
    
5. Luisito revisa.
    
6. Luisito pide corrección.
    
7. Panchito corrige.
    
8. Luisito cierra con historial.
    

---

# Pantallas por actor

## Luisito

Luisito participa en:

- Problema actual.
    
- Inicio.
    
- Crear compromiso.
    
- Confirmación.
    
- Aviso de aceptación.
    
- Aviso de evidencia.
    
- Revisión.
    
- Corrección.
    
- Aviso de evidencia corregida.
    
- Aprobar y cerrar.
    
- Confirmación final.
    
- Historial.
    

## Panchito

Panchito participa en:

- Recibir compromiso.
    
- Aceptar compromiso.
    
- Mi día.
    
- Enviar evidencia.
    
- Recibir corrección.
    
- Enviar evidencia corregida.
    
- Confirmación de cierre.
    

## Gamora Bot

Gamora Bot aparece como guía en:

- Confirmaciones.
    
- Avisos.
    
- Mensajes tipo WhatsApp.
    
- Cambios de estado.
    
- Cierre.
    

---

# Pantallas que no deben existir todavía

Para evitar complejidad, esta primera versión no debe incluir:

- Login.
    
- Registro.
    
- Configuración de empresa.
    
- Administración de usuarios.
    
- Invitación de contactos.
    
- Enrolamiento.
    
- Reportes avanzados.
    
- Dashboard ejecutivo.
    
- Analítica.
    
- IA.
    
- Chat libre con bot.
    
- Integración real con WhatsApp.
    
- Historial técnico completo.
    
- Notificaciones configurables.
    
- Roles avanzados.
    
- Multiempresa.
    
- Marketplace.
    
- Cobranza.
    
- Suscripción.
    

## Justificación

Estas pantallas podrían ser necesarias en un producto real, pero no son necesarias para validar la idea principal.

La demo debe enfocarse en el ciclo:

**crear → aceptar → evidenciar → corregir → cerrar.**

---

# Pantallas críticas

Las pantallas más importantes son:

1. Panchito recibe compromiso.
    
2. Crear compromiso.
    
3. Enviar evidencia.
    
4. Revisar evidencia.
    
5. Pedir corrección.
    
6. Confirmación de cierre.
    
7. Historial.
    

Si estas pantallas se entienden, la demo funciona.

Si estas pantallas no se entienden, el diseño visual no resolverá el problema.

---

# Criterios de aprobación del mapa de pantallas

Este mapa se considerará aprobado si:

- La secuencia se entiende de principio a fin.
    
- No hay pantallas innecesarias.
    
- La experiencia de Panchito se mantiene simple.
    
- Luisito recibe suficiente control sin saturación.
    
- WhatsApp aparece como canal natural.
    
- La web/PWA aparece como capa de control.
    
- El flujo no parece task manager genérico.
    
- El ciclo evidencia-corrección-cierre queda claro.
    
- El mapa puede convertirse en wireframes textuales.
    

## Próximo paso después de aprobar este documento

Después de aprobar este documento, el siguiente entregable será:

**Wireframes Textuales del Prototipo Simulado — Ferretería Luisito**

Ese documento ya comenzará a representar cada pantalla en formato simple, usando cajas, textos y acciones, todavía sin diseño visual final.