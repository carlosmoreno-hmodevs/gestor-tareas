# Wireframes Textuales WhatsApp-first + Web/PWA Opcional — Ferretería Luisito

## Estado

Documento base para validar los wireframes textuales del prototipo simulado de Gamora Bot bajo enfoque WhatsApp-first con Web/PWA opcional.

## Propósito

Este documento representa la experiencia principal del prototipo en formato textual, mostrando cómo se vería el flujo entre WhatsApp y Web/PWA.

No define diseño visual final.

No define colores.

No define tipografías.

No define código.

No define integración real con WhatsApp.

Su objetivo es validar la estructura, secuencia, información, acciones y transiciones entre ambas interfaces antes de construir storyboard o prototipo visual.

## Principio rector

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Regla de experiencia

El usuario debe poder completar el flujo operativo básico desde WhatsApp.

La Web/PWA debe aparecer como capa de valor, no como obligación.

La Web/PWA debe demostrar:

- orden,
    
- estructura,
    
- historial,
    
- evidencia agrupada,
    
- continuidad de contexto,
    
- control visual.
    

---

# Secuencia de wireframes V2

La demo se representará en 14 momentos:

1. Antes: WhatsApp desordenado.
    
2. Luisito dicta instrucción a Gamora Bot.
    
3. Gamora estructura y pide confirmación.
    
4. Luisito crea compromiso.
    
5. Web/PWA refleja compromiso creado.
    
6. Panchito recibe compromiso.
    
7. Panchito acepta y Web/PWA actualiza estado.
    
8. Panchito envía evidencia desde WhatsApp.
    
9. Luisito revisa evidencia desde WhatsApp o Web/PWA.
    
10. Luisito pide corrección.
    
11. Panchito recibe corrección y reenvía evidencia.
    
12. Luisito aprueba y confirma cierre.
    
13. Gamora confirma cierre a ambos.
    
14. Web/PWA muestra historial final.
    

---

# Wireframe 1 — Antes: WhatsApp desordenado

## Actor principal

Luisito.

## Interfaz

WhatsApp tradicional, sin Gamora Bot.

## Objetivo

Mostrar el dolor actual: los pendientes existen, pero se pierden entre mensajes.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Chat con Panchito               │
├────────────────────────────────────────────┤
│ Luisito: Panchito, porfa cuenta los sacos  │
│ de cemento y me mandas foto.               │
│                                            │
│ Panchito: Va, al rato lo reviso.           │
│                                            │
│ Luisito: ¿Ya lo hiciste?                   │
│                                            │
│ Panchito: Creo que sí eran 48.             │
│                                            │
│ Luisito: ¿Me mandaste foto?                │
│                                            │
│ Panchito: Sí, creo que quedó arriba.       │
│                                            │
│ Luisito: ¿Esa foto es de hoy?              │
└────────────────────────────────────────────┘
```

## Mensaje de apoyo

**WhatsApp ayuda a conversar, pero los pendientes importantes pueden perderse entre mensajes.**

## Qué debe transmitir

El problema no es WhatsApp.

El problema es que los pendientes operativos quedan sin estructura, evidencia clara ni cierre formal.

## Riesgo a evitar

No presentar WhatsApp como enemigo. WhatsApp es el canal natural; Gamora Bot lo convierte en flujo operativo.

---

# Wireframe 2 — Luisito dicta instrucción a Gamora Bot

## Actor principal

Luisito.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Mostrar que Luisito puede iniciar el flujo en lenguaje natural, sin llenar formularios.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Luisito:                                   │
│ Gamora, dile a Panchito que cuente los     │
│ sacos de cemento de la Sucursal Norte y    │
│ me mande foto hoy antes de las 5.          │
└────────────────────────────────────────────┘
```

## Estado

Sin compromiso formal todavía.

## Qué debe transmitir

Luisito opera como ya está acostumbrado: escribiendo o dictando en WhatsApp.

## Riesgo a evitar

No hacer que parezca un comando técnico. Debe sentirse como lenguaje natural.

---

# Wireframe 3 — Gamora estructura y pide confirmación

## Actor principal

Gamora Bot.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Mostrar que Gamora interpreta la instrucción y la convierte en un compromiso estructurado, pero no actúa sin confirmación.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Entendido, Luisito. Detecté este           │
│ compromiso:                                │
│                                            │
│ Responsable: Panchito                      │
│ Actividad: Contar los sacos de cemento     │
│ disponibles                                │
│ Ubicación: Sucursal Norte                  │
│ Fecha compromiso: Hoy antes de las 5:00 p.m│
│ Evidencia esperada: Foto del área de       │
│ cemento y cantidad total de sacos          │
│                                            │
│ ¿Lo creo así?                              │
│                                            │
│ [ Crear compromiso ]                       │
│ [ Editar ]                                 │
│ [ Cancelar ]                               │
└────────────────────────────────────────────┘
```

## Estado

**Borrador**

## Acción principal

**Crear compromiso**

## Qué debe transmitir

Gamora Bot no es solo chat. Es una capa que estructura lenguaje natural en datos operativos.

## Riesgo a evitar

No permitir que la IA cree compromisos sin confirmación humana.

---

# Wireframe 4 — Luisito crea compromiso

## Actor principal

Luisito.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Formalizar el compromiso desde WhatsApp y mostrar acceso opcional a Web/PWA.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Luisito selecciona:                        │
│ [ Crear compromiso ]                       │
│                                            │
│ Gamora Bot:                                │
│ Listo, Luisito.                            │
│ Creé el compromiso y se lo enviaré a       │
│ Panchito por WhatsApp.                     │
│                                            │
│ Te avisaré cuando lo acepte o cuando       │
│ mande evidencia.                           │
│                                            │
│ [ Ver resumen ]                            │
│ [ Abrir en Web/PWA ]                       │
│ [ Crear otro compromiso ]                  │
└────────────────────────────────────────────┘
```

## Estado

**Nuevo**

## Qué debe transmitir

El pendiente ya dejó de ser mensaje suelto y quedó formalizado.

## Transición clave

El botón **Abrir en Web/PWA** demuestra que la plataforma existe como vista estructurada, pero no obliga al usuario a salir de WhatsApp.

---

# Wireframe 5 — Web/PWA refleja compromiso creado

## Actor principal

Luisito.

## Interfaz

Web/PWA opcional.

## Objetivo

Mostrar que lo creado en WhatsApp queda ordenado en la plataforma.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ Gamora Web/PWA                             │
│ Compromiso creado                          │
├────────────────────────────────────────────┤
│ Contar sacos de cemento                    │
│                                            │
│ Estado: Nuevo                              │
│                                            │
│ Responsable                                │
│ Panchito                                   │
│                                            │
│ Ubicación                                  │
│ Sucursal Norte                             │
│                                            │
│ Fecha compromiso                           │
│ Hoy antes de las 5:00 p.m.                 │
│                                            │
│ Evidencia esperada                         │
│ Foto del área de cemento y cantidad total  │
│ de sacos                                   │
│                                            │
│ Último evento                              │
│ Luisito creó este compromiso desde         │
│ WhatsApp.                                  │
│                                            │
│ [ Volver a WhatsApp ]                      │
│ [ Ver historial ]                          │
│ [ Ver tablero ]                            │
└────────────────────────────────────────────┘
```

## Estado

**Nuevo**

## Acción principal

**Volver a WhatsApp**

## Qué debe transmitir

La Web/PWA no es otra app aislada; es la vista ordenada de lo que nació en WhatsApp.

## Riesgo a evitar

Que parezca una pantalla obligatoria para continuar.

---

# Wireframe 6 — Panchito recibe compromiso

## Actor principal

Panchito.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Mostrar que Panchito entiende la instrucción sin entrar a una plataforma compleja.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Hola, Panchito.                            │
│ Luisito te asignó un nuevo compromiso:     │
│                                            │
│ Qué hay que hacer:                         │
│ Contar los sacos de cemento disponibles    │
│ en Sucursal Norte.                         │
│                                            │
│ Para cuándo:                               │
│ Hoy antes de las 5:00 p.m.                 │
│                                            │
│ Evidencia esperada:                        │
│ Manda una foto del área de cemento y       │
│ escribe la cantidad total de sacos.        │
│                                            │
│ [ Aceptar compromiso ]                     │
│ [ Tengo una duda ]                         │
│ [ No puedo atenderlo ]                     │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Estado

**Nuevo**

## Acción principal

**Aceptar compromiso**

## Qué debe transmitir

Panchito puede operar desde WhatsApp. La Web/PWA es opcional.

## Riesgo a evitar

Que el mensaje parezca un formulario largo o una orden burocrática.

---

# Wireframe 7 — Panchito acepta y Web/PWA actualiza estado

## Actor principal

Panchito.

## Interfaz principal

WhatsApp.

## Interfaz secundaria

Web/PWA.

## Objetivo

Mostrar sincronización entre interfaces.

## Wireframe textual — WhatsApp Panchito

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Panchito selecciona:                       │
│ [ Aceptar compromiso ]                     │
│                                            │
│ Gamora Bot:                                │
│ Perfecto, Panchito.                        │
│ El compromiso quedó aceptado.              │
│                                            │
│ Cuando termines el conteo, manda aquí      │
│ mismo la foto del área de cemento y la     │
│ cantidad total de sacos.                   │
│                                            │
│ [ Enviar evidencia ]                       │
│ [ Ver resumen ]                            │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Wireframe textual — WhatsApp Luisito

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Luisito, Panchito ya aceptó el compromiso: │
│                                            │
│ Contar los sacos de cemento disponibles    │
│ en Sucursal Norte.                         │
│                                            │
│ Estado: Aceptado                           │
│                                            │
│ [ Ver estado ]                             │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Wireframe textual — Web/PWA

```text
┌────────────────────────────────────────────┐
│ Gamora Web/PWA                             │
│ Detalle del compromiso                     │
├────────────────────────────────────────────┤
│ Contar sacos de cemento                    │
│                                            │
│ Estado: Aceptado                           │
│                                            │
│ Responsable: Panchito                      │
│ Fecha compromiso: Hoy antes de las 5:00 p.m│
│                                            │
│ Último evento                              │
│ Panchito aceptó el compromiso desde        │
│ WhatsApp.                                  │
│                                            │
│ [ Abrir conversación en WhatsApp ]         │
│ [ Ver historial ]                          │
└────────────────────────────────────────────┘
```

## Estado

**Aceptado**

## Qué debe transmitir

Una acción en WhatsApp actualiza automáticamente la Web/PWA.

## Riesgo a evitar

Que el usuario sienta que debe actualizar manualmente la plataforma.

---

# Wireframe 8 — Panchito envía evidencia desde WhatsApp

## Actor principal

Panchito.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Mostrar que la evidencia se puede enviar sin salir de WhatsApp.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Panchito:                                  │
│ Listo, hay 48 sacos de cemento disponibles.│
│                                            │
│ [ Foto adjunta del área de cemento ]       │
│                                            │
│ Gamora Bot:                                │
│ Gracias, Panchito.                         │
│ Envié la evidencia a Luisito para revisión.│
│                                            │
│ Te avisaré si queda cerrada o si hace      │
│ falta corregir algo.                       │
│                                            │
│ [ Ver resumen ]                            │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Estado

**Evidencia enviada**

## Qué debe transmitir

La evidencia nace en WhatsApp, pero queda ligada al compromiso.

## Riesgo a evitar

No decir que el compromiso ya está cerrado. Solo fue enviada evidencia.

---

# Wireframe 9 — Luisito revisa evidencia desde WhatsApp o Web/PWA

## Actor principal

Luisito.

## Interfaz principal

WhatsApp.

## Interfaz opcional

Web/PWA.

## Objetivo

Mostrar que Luisito puede decidir desde WhatsApp, pero también abrir vista ampliada.

## Wireframe textual — WhatsApp

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Luisito, Panchito envió evidencia del      │
│ compromiso:                                │
│                                            │
│ Contar los sacos de cemento disponibles    │
│ en Sucursal Norte.                         │
│                                            │
│ Cantidad reportada: 48 sacos               │
│ Evidencia: Foto del área de cemento        │
│                                            │
│ ¿Qué deseas hacer?                         │
│                                            │
│ [ Aprobar y cerrar ]                       │
│ [ Pedir corrección ]                       │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Wireframe textual — Web/PWA vista ampliada

```text
┌────────────────────────────────────────────┐
│ Gamora Web/PWA                             │
│ Revisar evidencia                          │
├────────────────────────────────────────────┤
│ Compromiso                                 │
│ Contar sacos de cemento                    │
│                                            │
│ Responsable                                │
│ Panchito                                   │
│                                            │
│ Cantidad reportada                         │
│ 48 sacos                                   │
│                                            │
│ Evidencia enviada                          │
│ [ Imagen ampliada del área de cemento ]    │
│                                            │
│ Estado                                     │
│ Evidencia enviada                          │
│                                            │
│ [ Aprobar y cerrar ]                       │
│ [ Pedir corrección ]                       │
│ [ Volver a WhatsApp ]                      │
│ [ Ver historial ]                          │
└────────────────────────────────────────────┘
```

## Estado

**Evidencia enviada**

## Qué debe transmitir

La Web/PWA aporta valor cuando se necesita ver mejor la evidencia o revisar contexto.

## Riesgo a evitar

Que abrir Web/PWA se sienta obligatorio para decidir.

---

# Wireframe 10 — Luisito pide corrección

## Actor principal

Luisito.

## Interfaz principal

WhatsApp.

## Interfaz reflejo

Web/PWA.

## Objetivo

Mostrar que Luisito puede pedir corrección en lenguaje natural y Gamora la estructura.

## Wireframe textual — WhatsApp

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Luisito selecciona:                        │
│ [ Pedir corrección ]                       │
│                                            │
│ Luisito:                                   │
│ La foto no muestra completo el espacio de  │
│ cemento. Que mande una foto más abierta y │
│ confirme otra vez la cantidad.             │
│                                            │
│ Gamora Bot:                                │
│ Entendido, Luisito.                        │
│ Enviaré esta corrección a Panchito:        │
│                                            │
│ Motivo:                                    │
│ La foto no muestra completo el espacio de  │
│ cemento.                                   │
│                                            │
│ Qué debe enviar:                           │
│ Una foto más abierta del área y confirmar  │
│ nuevamente la cantidad total de sacos.     │
│                                            │
│ ¿La envío?                                 │
│                                            │
│ [ Enviar corrección ]                      │
│ [ Editar ]                                 │
│ [ Cancelar ]                               │
└────────────────────────────────────────────┘
```

## Wireframe textual — Web/PWA reflejo

```text
┌────────────────────────────────────────────┐
│ Gamora Web/PWA                             │
│ Detalle del compromiso                     │
├────────────────────────────────────────────┤
│ Contar sacos de cemento                    │
│                                            │
│ Estado: Necesita corrección                │
│                                            │
│ Corrección solicitada                      │
│ La foto no muestra completo el espacio de  │
│ cemento.                                   │
│                                            │
│ Qué debe reenviar Panchito                 │
│ Foto más abierta del área y cantidad total │
│ confirmada.                                │
│                                            │
│ Último evento                              │
│ Luisito solicitó corrección desde WhatsApp.│
│                                            │
│ [ Abrir conversación en WhatsApp ]         │
│ [ Ver historial ]                          │
└────────────────────────────────────────────┘
```

## Estado

**Necesita corrección**

## Qué debe transmitir

La corrección nace en WhatsApp, pero queda estructurada e historizada en Web/PWA.

## Riesgo a evitar

Usar lenguaje de rechazo o castigo.

---

# Wireframe 11 — Panchito recibe corrección y reenvía evidencia

## Actor principal

Panchito.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Mostrar que Panchito entiende qué corregir y puede reenviar evidencia sin salir del chat.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Panchito, Luisito necesita una corrección  │
│ en este compromiso:                        │
│                                            │
│ Contar los sacos de cemento disponibles    │
│ en Sucursal Norte.                         │
│                                            │
│ Qué falta corregir:                        │
│ La foto no muestra completo el espacio de  │
│ cemento.                                   │
│                                            │
│ Qué debes enviar:                          │
│ Una foto más abierta del área y confirmar  │
│ nuevamente la cantidad total de sacos.     │
│                                            │
│ [ Corregir y reenviar ]                    │
│ [ Tengo una duda ]                         │
│ [ Abrir en Web/PWA ]                       │
│                                            │
│ Panchito:                                  │
│ Corregido. Son 48 sacos en total.          │
│                                            │
│ [ Foto completa del área de cemento ]      │
│                                            │
│ Gamora Bot:                                │
│ Gracias, Panchito.                         │
│ Envié la evidencia corregida a Luisito     │
│ para revisión.                             │
└────────────────────────────────────────────┘
```

## Estado

**Corregido**

## Qué debe transmitir

Panchito no repite el proceso; solo corrige lo necesario.

## Riesgo a evitar

Que parezca que se creó un compromiso nuevo.

---

# Wireframe 12 — Luisito aprueba y confirma cierre

## Actor principal

Luisito.

## Interfaz principal

WhatsApp.

## Interfaz opcional

Web/PWA.

## Objetivo

Mostrar cierre con aprobación humana y continuidad de interfaces.

## Wireframe textual — WhatsApp

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Luisito, Panchito envió evidencia corregida│
│                                            │
│ Compromiso:                                │
│ Contar los sacos de cemento disponibles    │
│ en Sucursal Norte.                         │
│                                            │
│ Cantidad confirmada: 48 sacos              │
│ Corrección: Foto más abierta del área      │
│                                            │
│ ¿Qué deseas hacer?                         │
│                                            │
│ [ Aprobar y cerrar ]                       │
│ [ Pedir nueva corrección ]                 │
│ [ Abrir en Web/PWA ]                       │
│                                            │
│ Luisito selecciona:                        │
│ [ Aprobar y cerrar ]                       │
│                                            │
│ Gamora Bot:                                │
│ Vas a cerrar este compromiso:              │
│                                            │
│ Responsable: Panchito                      │
│ Resultado: 48 sacos de cemento disponibles │
│ en Sucursal Norte.                         │
│ Evidencia final: Foto completa del área    │
│                                            │
│ ¿Confirmas el cierre?                      │
│                                            │
│ [ Confirmar cierre ]                       │
│ [ Volver a revisar ]                       │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Wireframe textual — Web/PWA vista opcional

```text
┌────────────────────────────────────────────┐
│ Gamora Web/PWA                             │
│ Cierre del compromiso                      │
├────────────────────────────────────────────┤
│ Compromiso                                 │
│ Contar sacos de cemento                    │
│                                            │
│ Responsable                                │
│ Panchito                                   │
│                                            │
│ Resultado final                            │
│ 48 sacos                                   │
│                                            │
│ Evidencia final                            │
│ [ Foto completa del área de cemento ]      │
│                                            │
│ Estado                                     │
│ Pendiente de cierre                        │
│                                            │
│ [ Confirmar cierre ]                       │
│ [ Volver a WhatsApp ]                      │
│ [ Ver historial ]                          │
└────────────────────────────────────────────┘
```

## Estado

**Pendiente de cierre**

## Acción principal

**Confirmar cierre**

## Qué debe transmitir

Gamora Bot no cierra solo. Luisito mantiene control.

## Riesgo a evitar

Que el cierre parezca automático o decidido por IA.

---

# Wireframe 13 — Gamora confirma cierre a ambos

## Actores

Luisito y Panchito.

## Interfaz

WhatsApp con Gamora Bot.

## Objetivo

Cerrar la historia en la interfaz donde ambos operaron.

## Wireframe textual — Mensaje a Luisito

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Compromiso cerrado, Luisito.               │
│                                            │
│ El pendiente quedó cumplido, evidenciado   │
│ y cerrado.                                 │
│                                            │
│ Resultado registrado:                      │
│ 48 sacos de cemento disponibles en         │
│ Sucursal Norte.                            │
│                                            │
│ Ya no tienes que dar seguimiento manual    │
│ a este pendiente.                          │
│                                            │
│ [ Ver historial ]                          │
│ [ Abrir en Web/PWA ]                       │
│ [ Crear otro compromiso ]                  │
└────────────────────────────────────────────┘
```

## Wireframe textual — Mensaje a Panchito

```text
┌────────────────────────────────────────────┐
│ WhatsApp — Gamora Bot                      │
├────────────────────────────────────────────┤
│ Gamora Bot:                                │
│ Listo, Panchito.                           │
│                                            │
│ Luisito aprobó la evidencia y cerró el     │
│ compromiso.                                │
│                                            │
│ Resultado registrado:                      │
│ 48 sacos de cemento disponibles en         │
│ Sucursal Norte.                            │
│                                            │
│ Buen trabajo.                              │
│                                            │
│ [ Ver mis compromisos ]                    │
│ [ Abrir en Web/PWA ]                       │
└────────────────────────────────────────────┘
```

## Estado

**Cerrado**

## Qué debe transmitir

El ciclo terminó formalmente para ambos actores.

## Riesgo a evitar

Cerrar solo para Luisito y dejar a Panchito sin confirmación.

---

# Wireframe 14 — Web/PWA muestra historial final

## Actor principal

Luisito.

## Interfaz

Web/PWA opcional.

## Objetivo

Mostrar el valor estructural final de la plataforma.

## Wireframe textual

```text
┌────────────────────────────────────────────┐
│ Gamora Web/PWA                             │
│ Historial del compromiso                   │
├────────────────────────────────────────────┤
│ Compromiso                                 │
│ Contar sacos de cemento                    │
│                                            │
│ Estado final                               │
│ Cerrado                                    │
│                                            │
│ Responsable                                │
│ Panchito                                   │
│                                            │
│ Resultado                                  │
│ 48 sacos de cemento disponibles            │
│                                            │
│ Evidencia final                            │
│ [ Foto completa del área de cemento ]      │
│                                            │
│ Conversación relacionada                   │
│ [ Abrir conversación en WhatsApp ]         │
│                                            │
│ Historial                                  │
│ ┌────────────────────────────────────────┐ │
│ │ 9:15 a.m.                              │ │
│ │ Luisito dictó la instrucción a Gamora  │ │
│ ├────────────────────────────────────────┤ │
│ │ 9:16 a.m.                              │ │
│ │ Gamora estructuró el compromiso        │ │
│ ├────────────────────────────────────────┤ │
│ │ 9:17 a.m.                              │ │
│ │ Luisito confirmó creación              │ │
│ ├────────────────────────────────────────┤ │
│ │ 9:18 a.m.                              │ │
│ │ Panchito recibió el compromiso         │ │
│ ├────────────────────────────────────────┤ │
│ │ 9:20 a.m.                              │ │
│ │ Panchito aceptó desde WhatsApp         │ │
│ ├────────────────────────────────────────┤ │
│ │ 3:40 p.m.                              │ │
│ │ Panchito envió evidencia               │ │
│ ├────────────────────────────────────────┤ │
│ │ 3:50 p.m.                              │ │
│ │ Luisito pidió corrección               │ │
│ ├────────────────────────────────────────┤ │
│ │ 4:10 p.m.                              │ │
│ │ Panchito envió evidencia corregida     │ │
│ ├────────────────────────────────────────┤ │
│ │ 4:18 p.m.                              │ │
│ │ Luisito aprobó y cerró                 │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Este historial evita que el seguimiento    │
│ quede perdido entre mensajes sueltos de    │
│ WhatsApp.                                  │
│                                            │
│ [ Volver al tablero ]                      │
│ [ Crear compromiso similar ]               │
│ [ Abrir conversación en WhatsApp ]         │
└────────────────────────────────────────────┘
```

## Estado

**Cerrado**

## Acción principal

**Volver al tablero**

## Qué debe transmitir

La Web/PWA es la memoria operativa y visual de todo lo que ocurrió en WhatsApp.

## Riesgo a evitar

Que la Web/PWA parezca un simple espejo. Debe verse como el lugar donde el flujo se entiende, se consulta y se controla.

---

# Vista general de la secuencia

```text
WhatsApp desordenado
→ Luisito dicta a Gamora
→ Gamora estructura
→ Luisito confirma
→ Web/PWA ordena
→ Panchito recibe
→ Panchito acepta
→ Web/PWA actualiza
→ Panchito evidencia
→ Luisito revisa
→ Luisito corrige
→ Web/PWA registra
→ Panchito corrige
→ Luisito cierra
→ Gamora confirma
→ Web/PWA historiza
```

---

# Estados visibles usados

|Estado|Dónde aparece|Función|
|---|---|---|
|Borrador|WhatsApp Luisito|Confirmar estructura antes de crear|
|Nuevo|WhatsApp / Web/PWA|Compromiso creado|
|Aceptado|WhatsApp / Web/PWA|Responsable confirmó|
|Evidencia enviada|WhatsApp / Web/PWA|Evidencia lista para revisión|
|Necesita corrección|WhatsApp / Web/PWA|Evidencia requiere ajuste|
|Corregido|WhatsApp / Web/PWA|Evidencia corregida lista|
|Pendiente de cierre|WhatsApp / Web/PWA|Luisito está por cerrar|
|Cerrado|WhatsApp / Web/PWA|Compromiso aprobado y finalizado|

---

# Transiciones clave entre interfaces

## WhatsApp → Web/PWA

Aparece cuando el usuario quiere:

- ver detalle estructurado,
    
- revisar evidencia ampliada,
    
- consultar historial,
    
- ver tablero,
    
- revisar varios compromisos.
    

## Web/PWA → WhatsApp

Aparece cuando el usuario quiere:

- volver al flujo conversacional,
    
- continuar conversación,
    
- enviar corrección,
    
- abrir chat relacionado,
    
- crear otro compromiso desde WhatsApp.
    

---

# Regla de continuidad

Cada vez que se abra Web/PWA desde WhatsApp, debe abrirse el compromiso específico.

No debe mandar al usuario a una página genérica.

Cada vez que se vuelva a WhatsApp desde Web/PWA, debe volver al hilo o acción relacionada.

No debe obligar al usuario a explicar de nuevo qué estaba haciendo.

---

# Momentos donde Web/PWA debe aparecer en la demo

Para que Web/PWA no parezca innecesaria, debe aparecer en tres momentos:

## 1. Después de crear el compromiso

Demuestra estructura.

## 2. Al revisar evidencia

Demuestra vista ampliada y control.

## 3. Al final con historial

Demuestra memoria operativa.

---

# Momentos donde Web/PWA no debe interrumpir

Para conservar baja fricción, Web/PWA no debe ser obligatoria en:

- crear compromiso,
    
- aceptar compromiso,
    
- enviar evidencia,
    
- pedir corrección,
    
- reenviar evidencia,
    
- cerrar compromiso.
    

---

# Diferencia central frente al flujo anterior

## Flujo anterior

La Web/PWA era necesaria para varias acciones.

## Flujo actual

WhatsApp permite ejecutar.

Web/PWA permite entender, coordinar y controlar.

---

# Riesgos detectados

## Riesgo 1 — Web/PWA parece innecesaria

### Mitigación

Mostrarla como estructura, evidencia ampliada e historial.

## Riesgo 2 — WhatsApp se vuelve demasiado cargado

### Mitigación

Mensajes compactos, botones simples y opciones claras.

## Riesgo 3 — IA parece decidir sola

### Mitigación

Confirmación obligatoria antes de crear, corregir y cerrar.

## Riesgo 4 — Usuario siente cambio de sistema

### Mitigación

Transiciones con contexto: abrir compromiso específico y volver al chat relacionado.

## Riesgo 5 — Prometer más de lo viable

### Mitigación

El prototipo debe evitar afirmar que Gamora lee chats personales o grupos. Solo procesa el canal formal de Gamora Bot.

---

# Criterios de aprobación

Estos wireframes se considerarán aprobados si:

- La demo puede entenderse como una sola experiencia conectada.
    
- WhatsApp se entiende como interfaz de operación.
    
- Web/PWA se entiende como capa de estructura y control.
    
- Las transiciones no se sienten forzadas.
    
- La IA no actúa sin confirmación.
    
- Panchito tiene baja fricción.
    
- Luisito mantiene control.
    
- Evidencia, corrección y cierre quedan claros.
    
- La Web/PWA aporta valor real en los momentos donde aparece.
    
- El flujo no se siente como task manager genérico.
    
- El prototipo sigue siendo viable y no promete lectura de chats personales.
    

## Próximo paso después de aprobar este documento

Después de aprobar estos wireframes, el siguiente entregable será:

**Storyboard del Prototipo Simulado WhatsApp-first + Web/PWA Opcional — Ferretería Luisito**

Ese documento convertirá estos wireframes en una secuencia narrativa lista para presentarse como demo.