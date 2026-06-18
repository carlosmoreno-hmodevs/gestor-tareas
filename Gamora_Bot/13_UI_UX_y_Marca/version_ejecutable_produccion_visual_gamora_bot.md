# Versión Ejecutable de Producción Visual — Gamora Bot

## Estado

Documento operativo para ejecutar la producción visual V1 del prototipo estático de Gamora Bot.

## Propósito

Este documento convierte el prompt maestro en una instrucción práctica y accionable para producir las pantallas visuales V1.

Debe usarse cuando se vaya a crear el prototipo visual en una herramienta de diseño, herramienta de generación visual, presentación, mockup estático o prototipo no funcional.

---

# Objetivo de producción

Crear una demo visual estática de Gamora Bot que muestre, en una secuencia clara, cómo un pendiente operativo que nace en WhatsApp se convierte en un compromiso estructurado, evidenciable, corregible, cerrable e historizado en Web/PWA.

---

# Regla rectora obligatoria

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

---

# Frase central

**Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.**

---

# Estilo visual requerido

La demo debe verse:

- limpia,
    
- profesional,
    
- moderna,
    
- ligera,
    
- clara,
    
- confiable,
    
- cálida,
    
- orientada a operación.
    

No debe verse:

- infantil,
    
- futurista exagerada,
    
- saturada,
    
- técnica,
    
- robótica,
    
- como task manager,
    
- como dashboard corporativo pesado,
    
- como herramienta de vigilancia.
    

---

# Formato de salida

Crear una secuencia de **15 pantallas estáticas**.

Cada pantalla debe poder funcionar como slide o pantalla de prototipo.

No debe ser funcional.

No debe requerir backend.

No debe simular integración real.

Debe ser una demo visual.

---

# Paleta visual

Usar como base:

|Uso|Color|Hex|
|---|---|---|
|Acción principal|Verde operativo profundo|`#147A5A`|
|Plataforma / coordinación|Azul petróleo|`#123A4A`|
|Fondo general|Gris cálido claro|`#F5F7F6`|
|Superficie|Blanco suave|`#FFFFFF`|
|Texto principal|Negro suave|`#16211F`|
|Texto secundario|Gris verdoso|`#6B7A76`|
|Corrección|Ámbar operativo|`#C98218`|
|Cerrado|Verde de cierre|`#168A5E`|
|Informativo|Azul grisáceo|`#4E6E7E`|
|Bordes|Gris claro|`#DDE5E2`|

## Reglas de color

- No usar rojo para corrección.
    
- No saturar de verde.
    
- Usar el color para guiar estados y acciones.
    
- Mantener una sensación sobria y profesional.
    

---

# Tipografía

Usar una sans serif moderna y legible.

Preferencias:

- Inter,
    
- Geist,
    
- Manrope,
    
- Segoe UI,
    
- SF Pro como referencia.
    

No usar fuentes decorativas ni futuristas.

---

# Componentes mínimos

## WhatsApp simulado

Usar móvil vertical con:

- encabezado “Gamora Bot”,
    
- burbujas de chat,
    
- tarjetas conversacionales,
    
- botones simulados,
    
- badges de estado,
    
- adjuntos de evidencia.
    

## Web/PWA

Usar panel amplio tipo SaaS ligero con:

- encabezado simple,
    
- tarjeta de compromiso,
    
- estado visible,
    
- responsable,
    
- fecha,
    
- evidencia esperada,
    
- vista de evidencia,
    
- historial/timeline,
    
- botón de volver a WhatsApp.
    

## Conexión entre interfaces

En escenas combinadas, mostrar:

- móvil WhatsApp a un lado,
    
- Web/PWA al otro,
    
- conector visual sutil,
    
- frase breve de sincronización.
    

Ejemplos:

**Una acción. Dos vistas. Un solo compromiso.**

**Gamora mantiene el hilo.**

---

# Pantallas a producir

## Pantalla 1 — WhatsApp conversa, pero no controla

### Tipo

Dolor actual.

### Interfaz

WhatsApp tradicional sin Gamora.

### Contenido

Chat entre Luisito y Panchito:

```text
Luisito:
Panchito, porfa cuenta los sacos de cemento y me mandas foto.

Panchito:
Va, al rato lo reviso.

Luisito:
¿Ya lo hiciste?

Panchito:
Creo que sí eran 48.

Luisito:
¿Me mandaste foto?

Panchito:
Sí, creo que quedó arriba.
```

### Texto de apoyo

**El problema no es WhatsApp. El problema es que los pendientes quedan sin estructura, evidencia clara ni cierre.**

### Mensaje clave

**Los pendientes importantes se pierden entre mensajes.**

---

## Pantalla 2 — Luisito opera desde WhatsApp

### Tipo

Inicio del flujo.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido

```text
Luisito:
Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.
```

### Texto de apoyo

**Luisito no llena formularios. Solo escribe o dicta una instrucción natural.**

### Mensaje clave

**El pendiente nace desde WhatsApp.**

---

## Pantalla 3 — Gamora convierte conversación en compromiso

### Tipo

Estructuración.

### Interfaz

WhatsApp con tarjeta de Gamora.

### Contenido

```text
Gamora Bot:
Entendido, Luisito. Detecté este compromiso:
```

Tarjeta:

```text
Responsable: Panchito
Actividad: Contar los sacos de cemento disponibles
Ubicación: Sucursal Norte
Fecha compromiso: Hoy antes de las 5:00 p.m.
Evidencia esperada: Foto del área de cemento y cantidad total de sacos

¿Lo creo así?
```

Botones:

```text
[ Crear compromiso ]
[ Editar ]
[ Cancelar ]
```

### Estado

**Borrador**

### Mensaje clave

**Gamora interpreta y estructura. Luisito confirma.**

---

## Pantalla 4 — El mensaje ya es un compromiso

### Tipo

Formalización.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido

```text
Luisito selecciona:
[ Crear compromiso ]

Gamora Bot:
Listo, Luisito.
Creé el compromiso y se lo enviaré a Panchito por WhatsApp.

Te avisaré cuando lo acepte o cuando mande evidencia.
```

Botones:

```text
[ Ver resumen ]
[ Abrir en Web/PWA ]
[ Crear otro compromiso ]
```

### Estado

**Nuevo**

### Mensaje clave

**Ahora existe responsable, fecha, evidencia y estado.**

---

## Pantalla 5 — Lo que nace en WhatsApp queda ordenado en Gamora

### Tipo

Valor Web/PWA.

### Interfaz

Web/PWA.

### Contenido

Encabezado:

```text
Gamora
Compromisos
```

Tarjeta:

```text
Contar sacos de cemento

Estado: Nuevo

Responsable: Panchito
Ubicación: Sucursal Norte
Fecha compromiso: Hoy antes de las 5:00 p.m.
Evidencia esperada: Foto del área de cemento y cantidad total de sacos

Último evento:
Luisito creó este compromiso desde WhatsApp.
```

Botones:

```text
[ Volver a WhatsApp ]
[ Ver historial ]
[ Ver tablero ]
```

### Estado

**Nuevo**

### Mensaje clave

**La plataforma ordena lo que nació en la conversación.**

---

## Pantalla 6 — Panchito recibe una instrucción clara

### Tipo

Asignación.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido

```text
Gamora Bot:
Hola, Panchito.
Luisito te asignó un nuevo compromiso:

Qué hay que hacer:
Contar los sacos de cemento disponibles en Sucursal Norte.

Para cuándo:
Hoy antes de las 5:00 p.m.

Evidencia esperada:
Manda una foto del área de cemento y escribe la cantidad total de sacos.
```

Botones:

```text
[ Aceptar compromiso ]
[ Tengo una duda ]
[ No puedo atenderlo ]
```

### Estado

**Nuevo**

### Mensaje clave

**El responsable opera desde WhatsApp.**

---

## Pantalla 7 — Una acción actualiza todo el flujo

### Tipo

Sincronización.

### Interfaz

WhatsApp + Web/PWA.

### Contenido WhatsApp

```text
Panchito selecciona:
[ Aceptar compromiso ]

Gamora Bot:
Perfecto, Panchito.
El compromiso quedó aceptado.

Cuando termines el conteo, manda aquí mismo la foto del área de cemento y la cantidad total de sacos.
```

### Contenido Web/PWA

```text
Contar sacos de cemento

Estado: Aceptado

Último evento:
Panchito aceptó el compromiso desde WhatsApp.
```

### Notificación a Luisito

```text
Panchito ya aceptó el compromiso.
```

### Estado

**Aceptado**

### Mensaje clave

**Una acción. Dos vistas. Un solo compromiso.**

---

## Pantalla 8 — La evidencia queda asociada al compromiso

### Tipo

Evidencia.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido

```text
Panchito:
Listo, hay 48 sacos de cemento disponibles.

[ Foto del área de cemento ]

Gamora Bot:
Gracias, Panchito.
Envié la evidencia a Luisito para revisión.

Te avisaré si queda cerrada o si hace falta corregir algo.
```

Botones:

```text
[ Ver resumen ]
[ Abrir en Web/PWA ]
```

### Estado

**Evidencia enviada**

### Mensaje clave

**La evidencia queda ligada al compromiso correcto.**

---

## Pantalla 9 — Luisito decide desde donde le conviene

### Tipo

Revisión.

### Interfaz

WhatsApp + Web/PWA.

### Contenido WhatsApp

```text
Gamora Bot:
Luisito, Panchito envió evidencia del compromiso:

Contar los sacos de cemento disponibles en Sucursal Norte.

Cantidad reportada:
48 sacos

Evidencia:
Foto del área de cemento

¿Qué deseas hacer?
```

Botones:

```text
[ Aprobar y cerrar ]
[ Pedir corrección ]
[ Abrir en Web/PWA ]
```

### Contenido Web/PWA

```text
Revisar evidencia

Compromiso:
Contar sacos de cemento

Responsable:
Panchito

Cantidad reportada:
48 sacos

[ Imagen ampliada del área de cemento ]

Estado:
Evidencia enviada
```

Botones:

```text
[ Aprobar y cerrar ]
[ Pedir corrección ]
[ Volver a WhatsApp ]
```

### Estado

**Evidencia enviada**

### Mensaje clave

**El usuario opera donde le conviene; Gamora mantiene el hilo.**

---

## Pantalla 10 — La corrección no rompe el hilo

### Tipo

Corrección.

### Interfaz

WhatsApp + Web/PWA.

### Contenido WhatsApp

```text
Luisito:
La foto no muestra completo el espacio de cemento.
Que mande una foto más abierta y confirme otra vez la cantidad.

Gamora Bot:
Entendido, Luisito.
Enviaré esta corrección a Panchito:

Motivo:
La foto no muestra completo el espacio de cemento.

Qué debe enviar:
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.

¿La envío?
```

Botones:

```text
[ Enviar corrección ]
[ Editar ]
[ Cancelar ]
```

### Contenido Web/PWA

```text
Estado: Necesita corrección

Último evento:
Luisito solicitó corrección desde WhatsApp.
```

### Estado

**Necesita corrección**

### Mensaje clave

**Corregir no significa perder seguimiento.**

---

## Pantalla 11 — Panchito corrige sin empezar de nuevo

### Tipo

Corrección del responsable.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido

```text
Gamora Bot:
Panchito, Luisito necesita una corrección:

Qué falta corregir:
La foto no muestra completo el espacio de cemento.

Qué debes enviar:
Una foto más abierta del área y confirmar nuevamente la cantidad total de sacos.

[ Corregir y reenviar ]

Panchito:
Corregido. Son 48 sacos en total.

[ Foto completa del área de cemento ]

Gamora Bot:
Gracias, Panchito.
Envié la evidencia corregida a Luisito para revisión.
```

### Estado

**Corregido**

### Mensaje clave

**El hilo se conserva.**

---

## Pantalla 12 — El cierre requiere aprobación humana

### Tipo

Cierre.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido

```text
Gamora Bot:
Luisito, Panchito envió evidencia corregida.

Compromiso:
Contar los sacos de cemento disponibles en Sucursal Norte.

Cantidad confirmada:
48 sacos

Corrección:
Foto más abierta del área.

¿Qué deseas hacer?
```

Botones:

```text
[ Aprobar y cerrar ]
[ Pedir nueva corrección ]
[ Abrir en Web/PWA ]
```

Después:

```text
Gamora Bot:
Vas a cerrar este compromiso:

Responsable:
Panchito

Resultado:
48 sacos de cemento disponibles en Sucursal Norte.

Evidencia final:
Foto completa del área.

¿Confirmas el cierre?
```

Botones:

```text
[ Confirmar cierre ]
[ Volver a revisar ]
```

### Estado

**Pendiente de cierre**

### Mensaje clave

**La IA acompaña. El humano decide.**

---

## Pantalla 13 — El pendiente quedó cumplido, evidenciado y cerrado

### Tipo

Cierre operativo.

### Interfaz

WhatsApp con Gamora Bot.

### Contenido Luisito

```text
Gamora Bot:
Compromiso cerrado, Luisito.

El pendiente quedó cumplido, evidenciado y cerrado.

Resultado registrado:
48 sacos de cemento disponibles en Sucursal Norte.

Ya no tienes que dar seguimiento manual a este pendiente.
```

Botones:

```text
[ Ver historial ]
[ Abrir en Web/PWA ]
[ Crear otro compromiso ]
```

### Contenido Panchito

```text
Gamora Bot:
Listo, Panchito.

Luisito aprobó la evidencia y cerró el compromiso.

Resultado registrado:
48 sacos de cemento disponibles en Sucursal Norte.

Buen trabajo.
```

### Estado

**Cerrado**

### Mensaje clave

**El cierre queda claro para solicitante y responsable.**

---

## Pantalla 14 — La operación queda convertida en memoria

### Tipo

Historial final.

### Interfaz

Web/PWA.

### Contenido

```text
Historial del compromiso

Compromiso:
Contar sacos de cemento

Estado final:
Cerrado

Responsable:
Panchito

Resultado:
48 sacos de cemento disponibles

Evidencia final:
Foto completa del área
```

Timeline:

```text
9:15 a.m.  Luisito dictó la instrucción a Gamora.
9:16 a.m.  Gamora estructuró el compromiso.
9:17 a.m.  Luisito confirmó creación.
9:18 a.m.  Panchito recibió el compromiso.
9:20 a.m.  Panchito aceptó desde WhatsApp.
3:40 p.m.  Panchito envió evidencia.
3:50 p.m.  Luisito pidió corrección.
4:10 p.m.  Panchito envió evidencia corregida.
4:18 p.m.  Luisito aprobó y cerró.
```

Botones:

```text
[ Abrir conversación en WhatsApp ]
[ Crear compromiso similar ]
[ Volver al tablero ]
```

### Estado

**Cerrado**

### Mensaje clave

**WhatsApp fue la operación. Web/PWA es la memoria y el control.**

---

## Pantalla 15 — Gamora Bot

### Tipo

Cierre comercial.

### Interfaz

Slide final.

### Contenido

```text
Gamora Bot

Tus pendientes se atienden en WhatsApp,
pero no se pierden en WhatsApp.

Gamora Bot convierte conversaciones operativas en compromisos con evidencia, seguimiento y cierre.

Opera desde WhatsApp.
Controla desde Web/PWA.
Cierra con evidencia.

WhatsApp opera. Web/PWA controla. Gamora mantiene el hilo.
```

### Mensaje clave

**Conversación + estructura + cierre.**

---

# Criterios de aceptación visual

La producción visual será aceptable si:

- se entiende en menos de 5 minutos,
    
- las pantallas se ven profesionales,
    
- WhatsApp se siente natural,
    
- Web/PWA se siente valiosa,
    
- las dos interfaces se sienten conectadas,
    
- la evidencia tiene presencia visual,
    
- la corrección se ve amable,
    
- el cierre se ve contundente,
    
- no parece task manager,
    
- no parece vigilancia,
    
- no promete leer chats personales,
    
- no agrega funciones no aprobadas.
    

---

# Orden de producción recomendado

## Primero

Diseñar pantallas 2, 3 y 5.

Motivo:

Son el corazón del producto:

- WhatsApp-first,
    
- estructuración de Gamora,
    
- valor Web/PWA.
    

## Segundo

Diseñar pantallas 6, 8, 10, 12 y 14.

Motivo:

Son el ciclo operativo:

- asignación,
    
- evidencia,
    
- corrección,
    
- cierre,
    
- historial.
    

## Tercero

Diseñar pantallas 1, 7, 9, 11, 13 y 15.

Motivo:

Completan narrativa, sincronización y cierre comercial.

---

# Revisión antes de mostrar usuarios

Antes de mostrar el prototipo, responder:

1. ¿Se entiende qué problema resuelve?
    
2. ¿Se entiende que no reemplaza WhatsApp?
    
3. ¿Se entiende para qué sirve la Web/PWA?
    
4. ¿Se entiende que Gamora no lee chats personales?
    
5. ¿Se entiende que la evidencia queda asociada?
    
6. ¿Se entiende que Luisito decide el cierre?
    
7. ¿Se siente simple?
    
8. ¿Se siente profesional?
    
9. ¿Genera ganas de probarlo?
    

---

# Decisión final

Con este documento, Gamora Bot queda listo para entrar a producción visual V1.

La prioridad no será crear la versión más espectacular.

La prioridad será crear la versión más clara, profesional y validable.

El objetivo es que el usuario vea la demo y piense:

**“Esto sí resuelve el problema de los pendientes que se pierden en WhatsApp.”**