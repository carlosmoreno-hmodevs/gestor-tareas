# UI Kit Inicial — Gamora Bot

## Estado

Documento base del UI Kit inicial para el prototipo visual simulado de Gamora Bot.

## Propósito

Este documento define los componentes visuales básicos que deberán usarse para construir el primer prototipo visual estático de Gamora Bot.

No es un sistema de diseño definitivo.

No es código.

No es una guía técnica de implementación.

Es una guía visual inicial para asegurar coherencia, claridad y profesionalismo en las pantallas del prototipo.

---

# Principio rector

**WhatsApp opera. Web/PWA estructura, coordina y visualiza. Gamora mantiene el hilo entre ambas.**

Todo componente visual debe reforzar este principio.

---

# Frase central

**Tus pendientes se atienden en WhatsApp, pero no se pierden en WhatsApp.**

Esta frase debe orientar el tono visual y narrativo del prototipo.

---

# Objetivo del UI Kit

El UI Kit debe permitir construir pantallas que comuniquen:

- baja fricción,
    
- operación desde WhatsApp,
    
- estructura desde Web/PWA,
    
- evidencia asociada,
    
- corrección clara,
    
- cierre humano,
    
- historial consultable,
    
- continuidad entre interfaces.
    

---

# Tokens visuales iniciales

## Colores principales

|Uso|Nombre|Hex sugerido|
|---|---|---|
|Acción principal|Verde operativo profundo|`#147A5A`|
|Coordinación / plataforma|Azul petróleo|`#123A4A`|
|Fondo general|Gris cálido claro|`#F5F7F6`|
|Superficie|Blanco suave|`#FFFFFF`|
|Texto principal|Negro suave|`#16211F`|
|Texto secundario|Gris verdoso|`#6B7A76`|
|Corrección / atención|Ámbar operativo|`#C98218`|
|Cierre / aprobado|Verde de cierre|`#168A5E`|
|Estado informativo|Azul grisáceo|`#4E6E7E`|
|Línea / borde|Gris claro|`#DDE5E2`|

## Regla de uso del color

El color debe guiar la acción, no decorar.

No llenar la interfaz de verde.

No usar rojo para corrección.

No usar colores neón.

No usar una paleta excesivamente corporativa.

---

# Tipografía

## Tipografía recomendada

Usar una sans serif moderna y legible.

Opciones recomendadas:

- Inter.
    
- Geist.
    
- Manrope.
    
- Segoe UI.
    
- SF Pro como referencia estética.
    

## Jerarquía tipográfica sugerida

|Elemento|Tamaño sugerido|Peso|
|---|--:|---|
|Título de pantalla|24–28 px|700|
|Título de tarjeta|18–20 px|650|
|Subtítulo|15–16 px|500|
|Texto base|14–16 px|400|
|Metadatos|12–13 px|400|
|Badge / estado|12 px|600|
|Botón|14–15 px|600|

## Regla

La tipografía debe desaparecer a favor de la claridad.

No usar fuentes decorativas ni futuristas.

---

# Espaciado y forma

## Espaciado

|Uso|Valor sugerido|
|---|--:|
|Espaciado mínimo|8 px|
|Espaciado entre elementos relacionados|12 px|
|Espaciado entre bloques|16–24 px|
|Margen de pantalla móvil|16 px|
|Margen de panel Web/PWA|24–32 px|

## Bordes redondeados

|Elemento|Radio sugerido|
|---|--:|
|Tarjetas|16 px|
|Botones|12 px|
|Burbujas de chat|18–20 px|
|Badges|999 px|
|Contenedores grandes|20 px|

## Sombras

Usar sombras suaves.

Ejemplo conceptual:

- sombra baja,
    
- poca opacidad,
    
- sin efecto flotante exagerado.
    

La interfaz debe sentirse ligera, no inflada.

---

# Componentes base

## 1. Botón primario

### Uso

Acciones principales del flujo:

- Crear compromiso.
    
- Aceptar compromiso.
    
- Enviar corrección.
    
- Aprobar y cerrar.
    
- Confirmar cierre.
    

### Estilo

- Fondo: verde operativo profundo.
    
- Texto: blanco.
    
- Radio: 12 px.
    
- Altura: 44–48 px.
    
- Peso de texto: 600.
    

### Ejemplo

```text
[ Crear compromiso ]
```

## 2. Botón secundario

### Uso

Acciones de apoyo:

- Editar.
    
- Ver resumen.
    
- Ver historial.
    
- Volver a WhatsApp.
    

### Estilo

- Fondo: blanco.
    
- Borde: gris claro.
    
- Texto: negro suave o azul petróleo.
    
- Radio: 12 px.
    

### Ejemplo

```text
[ Ver historial ]
```

## 3. Botón de transición

### Uso

Conectar interfaces.

### Ejemplos

```text
[ Abrir en Web/PWA ]
[ Volver a WhatsApp ]
[ Abrir conversación en WhatsApp ]
```

### Estilo recomendado

- Fondo: blanco.
    
- Borde: verde operativo suave.
    
- Texto: verde operativo profundo.
    
- Ícono opcional de enlace o conversación.
    

### Regla

Debe sentirse como continuidad, no como salida del sistema.

---

# Componentes de WhatsApp simulado

## 1. Contenedor móvil

### Uso

Representar la experiencia WhatsApp-first.

### Estilo

- Formato vertical.
    
- Fondo claro.
    
- Encabezado simple.
    
- Chat limpio.
    
- Mensajes con espacio amplio.
    
- Pocas burbujas por escena.
    

### Encabezado sugerido

```text
Gamora Bot
En línea
```

o

```text
Gamora Bot
Asistente de compromisos
```

## 2. Burbuja de usuario

### Uso

Mensajes de Luisito o Panchito.

### Estilo

- Alineación a la derecha.
    
- Fondo verde muy suave o blanco con borde sutil.
    
- Texto negro suave.
    
- Radio amplio.
    
- Mensaje corto.
    

### Ejemplo

```text
Gamora, dile a Panchito que cuente los sacos de cemento de la Sucursal Norte y me mande foto hoy antes de las 5.
```

## 3. Burbuja de Gamora Bot

### Uso

Respuestas normales del bot.

### Estilo

- Alineación a la izquierda.
    
- Fondo blanco.
    
- Borde gris claro.
    
- Texto negro suave.
    
- Radio amplio.
    

### Ejemplo

```text
Entendido, Luisito.
Detecté este compromiso.
```

## 4. Tarjeta conversacional de Gamora

### Uso

Cuando Gamora estructura información.

### Estilo

- Fondo blanco.
    
- Borde gris claro.
    
- Radio 16 px.
    
- Encabezado breve.
    
- Campos en lista.
    
- Botones al final.
    

### Estructura

```text
Detecté este compromiso

Responsable: Panchito
Actividad: Contar sacos de cemento
Ubicación: Sucursal Norte
Fecha: Hoy antes de las 5:00 p.m.
Evidencia: Foto del área y cantidad total

¿Lo creo así?

[ Crear compromiso ]
[ Editar ]
[ Cancelar ]
```

### Regla

Esta tarjeta es clave. Debe mostrar que Gamora no solo conversa: estructura.

## 5. Botones dentro del chat

### Uso

Acciones rápidas.

### Estilo

- Botones apilados.
    
- Texto claro.
    
- No más de 3 o 4 opciones por bloque.
    
- Principal destacado.
    
- Secundarios discretos.
    

### Ejemplo

```text
[ Aprobar y cerrar ]
[ Pedir corrección ]
[ Abrir en Web/PWA ]
```

## 6. Adjuntos de evidencia

### Uso

Mostrar fotos enviadas por Panchito.

### Estilo

- Miniatura de imagen.
    
- Etiqueta breve.
    
- Metadato opcional.
    
- Asociada visualmente al compromiso.
    

### Ejemplo

```text
[ Foto del área de cemento ]
Cantidad reportada: 48 sacos
```

---

# Componentes Web/PWA

## 1. Layout general Web/PWA

### Uso

Mostrar la capa estructurada.

### Estilo

- Fondo gris cálido claro.
    
- Panel central blanco.
    
- Sidebar mínima opcional.
    
- Encabezado limpio.
    
- Tarjetas con información clara.
    

### Estructura recomendada

```text
Gamora
Compromisos

[ Tarjeta de compromiso ]
[ Historial ]
[ Evidencia ]
```

## 2. Tarjeta de compromiso

### Uso

Mostrar compromiso creado o detalle del compromiso.

### Contenido mínimo

- Título del compromiso.
    
- Estado.
    
- Responsable.
    
- Fecha compromiso.
    
- Evidencia esperada.
    
- Último evento.
    

### Ejemplo

```text
Contar sacos de cemento

Estado: Nuevo

Responsable: Panchito
Ubicación: Sucursal Norte
Fecha compromiso: Hoy antes de las 5:00 p.m.
Evidencia esperada: Foto del área y cantidad total

Último evento:
Luisito creó este compromiso desde WhatsApp.

[ Volver a WhatsApp ]
[ Ver historial ]
```

## 3. Panel de evidencia

### Uso

Revisión ampliada de evidencia.

### Contenido mínimo

- Imagen.
    
- Cantidad reportada.
    
- Responsable.
    
- Estado.
    
- Acciones.
    

### Ejemplo

```text
Revisar evidencia

Compromiso: Contar sacos de cemento
Responsable: Panchito
Cantidad reportada: 48 sacos

[ Imagen ampliada ]

[ Aprobar y cerrar ]
[ Pedir corrección ]
[ Volver a WhatsApp ]
```

## 4. Historial del compromiso

### Uso

Mostrar trazabilidad final.

### Estilo

- Timeline vertical.
    
- Eventos claros.
    
- Hora simulada.
    
- Actor.
    
- Acción.
    

### Ejemplo

```text
9:15 a.m.  Luisito dictó la instrucción
9:16 a.m.  Gamora estructuró el compromiso
9:17 a.m.  Luisito confirmó creación
9:20 a.m.  Panchito aceptó
3:40 p.m.  Panchito envió evidencia
3:50 p.m.  Luisito pidió corrección
4:10 p.m.  Panchito envió evidencia corregida
4:18 p.m.  Luisito aprobó y cerró
```

## 5. Botón de continuidad Web/PWA → WhatsApp

### Uso

No perder el hilo.

### Ejemplo

```text
[ Abrir conversación en WhatsApp ]
```

### Regla

Debe estar visible en las vistas clave.

---

# Badges de estado

## Lista de estados visuales

|Estado|Color sugerido|Tono|
|---|---|---|
|Borrador|Gris|Pendiente de confirmación|
|Nuevo|Azul grisáceo|Compromiso creado|
|Aceptado|Azul suave|Responsable enterado|
|Evidencia enviada|Azul petróleo|En revisión|
|Necesita corrección|Ámbar|Ajuste requerido|
|Corregido|Verde suave|Corrección enviada|
|Pendiente de cierre|Ámbar suave|Falta confirmación|
|Cerrado|Verde sólido|Finalizado|

## Ejemplo visual textual

```text
[ Cerrado ]
[ Necesita corrección ]
[ Evidencia enviada ]
```

## Regla crítica

No usar rojo para “Necesita corrección”.

La corrección debe sentirse como ajuste, no como castigo.

---

# Componentes de corrección

## Tarjeta de corrección

### Uso

Mostrar motivo y acción requerida.

### Contenido

- Estado: Necesita corrección.
    
- Motivo.
    
- Qué debe reenviar.
    
- Acción principal.
    

### Ejemplo

```text
Necesita corrección

Motivo:
La foto no muestra completo el espacio de cemento.

Qué debe enviar Panchito:
Una foto más abierta del área y confirmar la cantidad total.

[ Corregir y reenviar ]
```

## Tono

Claro, amable y operativo.

## Evitar

- Evidencia rechazada.
    
- Error.
    
- Incumplimiento.
    
- No válido.
    

---

# Componentes de cierre

## Tarjeta de cierre

### Uso

Confirmar cierre humano.

### Contenido

- Responsable.
    
- Resultado.
    
- Evidencia final.
    
- Confirmación.
    

### Ejemplo

```text
Vas a cerrar este compromiso

Responsable: Panchito
Resultado: 48 sacos de cemento disponibles
Evidencia final: Foto completa del área

¿Confirmas el cierre?

[ Confirmar cierre ]
[ Volver a revisar ]
```

## Estado final

```text
[ Cerrado ]
```

## Frase de cierre

```text
Ya no tienes que dar seguimiento manual a este pendiente.
```

---

# Componentes de sincronización

## Indicador de sincronización

### Uso

Mostrar que una acción en WhatsApp impacta Web/PWA.

### Ejemplo

```text
Actualizado desde WhatsApp
```

o

```text
Último evento: Panchito aceptó desde WhatsApp.
```

## Conector visual

En slides o escenas comparativas puede usarse:

```text
WhatsApp  →  Gamora  →  Web/PWA
```

o

```text
Una acción. Dos vistas. Un solo compromiso.
```

## Regla

No exagerar la animación o metáfora.

La sincronización debe sentirse natural y clara.

---

# Componentes de privacidad

## Mensaje de confianza

Debe aparecer en material de demo o validación cuando se explique privacidad.

### Texto sugerido

```text
Gamora Bot no lee tus chats personales ni tus grupos.
Solo procesa los mensajes que envías directamente al canal formal de Gamora Bot.
```

## Uso

- Pantalla de explicación.
    
- Preguntas frecuentes.
    
- Demo comercial.
    
- Respuesta ante objeciones.
    

## Regla

No saturar cada pantalla con privacidad, pero tenerlo listo y visible cuando haga falta.

---

# Componentes por actor

## Luisito

### Necesita ver

- compromiso,
    
- responsable,
    
- evidencia,
    
- estado,
    
- corrección,
    
- cierre,
    
- historial.
    

### Componentes principales

- tarjeta de resumen,
    
- panel de revisión,
    
- botones de decisión,
    
- historial.
    

## Panchito

### Necesita ver

- qué hacer,
    
- para cuándo,
    
- qué evidencia mandar,
    
- qué corregir.
    

### Componentes principales

- mensaje de asignación,
    
- botón aceptar,
    
- bloque de evidencia,
    
- tarjeta de corrección,
    
- confirmación de cierre.
    

## Gamora Bot

### Necesita comunicar

- entendí,
    
- estructuré,
    
- necesito confirmación,
    
- envié,
    
- actualicé,
    
- falta corregir,
    
- quedó cerrado.
    

### Componentes principales

- burbuja de bot,
    
- tarjeta estructurada,
    
- botones de acción,
    
- mensajes de confirmación.
    

---

# Patrones de pantalla

## Patrón 1 — Creación desde WhatsApp

```text
Usuario escribe instrucción
↓
Gamora estructura
↓
Usuario confirma
↓
Compromiso creado
```

Componentes:

- burbuja usuario,
    
- tarjeta conversacional,
    
- botón primario,
    
- estado Borrador/Nuevo.
    

## Patrón 2 — Operación del responsable

```text
Gamora asigna
↓
Panchito acepta
↓
Panchito evidencia
```

Componentes:

- mensaje de asignación,
    
- botón aceptar,
    
- adjunto de evidencia,
    
- confirmación.
    

## Patrón 3 — Revisión y corrección

```text
Evidencia enviada
↓
Luisito revisa
↓
Pide corrección
↓
Gamora estructura corrección
```

Componentes:

- tarjeta de evidencia,
    
- botones de decisión,
    
- tarjeta de corrección,
    
- badge ámbar.
    

## Patrón 4 — Cierre

```text
Evidencia corregida
↓
Luisito aprueba
↓
Gamora pide confirmación
↓
Compromiso cerrado
```

Componentes:

- tarjeta de cierre,
    
- botón confirmar cierre,
    
- badge cerrado,
    
- mensaje de alivio.
    

## Patrón 5 — Web/PWA como memoria

```text
Compromiso
↓
Evidencia
↓
Corrección
↓
Cierre
↓
Historial
```

Componentes:

- tarjeta de compromiso,
    
- panel de evidencia,
    
- timeline,
    
- botón abrir WhatsApp.
    

---

# Pantallas mínimas para prototipo visual V1

## Escena 1

WhatsApp desordenado.

## Escena 2

Luisito dicta instrucción a Gamora.

## Escena 3

Gamora estructura y pide confirmación.

## Escena 4

Web/PWA muestra compromiso creado.

## Escena 5

Panchito recibe y acepta.

## Escena 6

Panchito manda evidencia.

## Escena 7

Luisito revisa evidencia.

## Escena 8

Luisito pide corrección y Panchito corrige.

## Escena 9

Luisito aprueba y cierra.

## Escena 10

Web/PWA muestra historial final.

---

# Reglas de composición visual

## Para escenas WhatsApp

- Mostrar móvil vertical.
    
- Máximo 3 bloques de conversación por escena.
    
- Acción principal visible.
    
- Mensajes cortos.
    
- Espacio suficiente.
    
- Evitar saturación.
    

## Para escenas Web/PWA

- Mostrar panel amplio.
    
- Tarjetas claras.
    
- Estado visible.
    
- Evidencia destacada.
    
- Historial ordenado.
    
- Botón de regreso a WhatsApp.
    

## Para escenas de doble interfaz

- Mostrar WhatsApp y Web/PWA lado a lado.
    
- Usar una línea o flecha sutil.
    
- Frase de sincronización breve.
    
- No saturar con explicación.
    

---

# Microcopy base

## Confirmación de estructura

```text
Detecté este compromiso.
¿Lo creo así?
```

## Confirmación de creación

```text
Listo, Luisito. Creé el compromiso.
```

## Aceptación

```text
Perfecto, Panchito. El compromiso quedó aceptado.
```

## Evidencia

```text
Gracias, Panchito. Envié la evidencia a Luisito para revisión.
```

## Corrección

```text
Se necesita una corrección.
```

## Reenvío

```text
Gracias, Panchito. Envié la evidencia corregida a Luisito.
```

## Cierre

```text
Compromiso cerrado.
```

## Valor final

```text
Ya no tienes que dar seguimiento manual a este pendiente.
```

---

# Do / Don’t

## Do

- Mostrar acciones claras.
    
- Usar lenguaje humano.
    
- Mostrar estados visibles.
    
- Mostrar evidencia.
    
- Mostrar historial.
    
- Mostrar continuidad entre interfaces.
    
- Mantener pantallas limpias.
    
- Reforzar que Web/PWA aporta control.
    

## Don’t

- Hacerlo parecer task manager.
    
- Usar lenguaje de auditoría pesada.
    
- Usar rojo para correcciones.
    
- Llenar Web/PWA de métricas.
    
- Meter IA como protagonista visual.
    
- Mostrar lectura de grupos o chats personales.
    
- Hacer que Panchito use pantallas complejas.
    
- Repetir datos entre interfaces.
    
- Crear escenas fuera del storyboard aprobado.
    

---

# Checklist de aprobación de componentes

Antes de usar un componente en el prototipo visual, revisar:

|Pregunta|Sí / No|
|---|---|
|¿Ayuda a entender el flujo?||
|¿Reduce fricción visible?||
|¿Refuerza WhatsApp como operación?||
|¿Refuerza Web/PWA como control?||
|¿Mantiene continuidad entre interfaces?||
|¿Evita parecer task manager?||
|¿Evita parecer vigilancia?||
|¿Usa lenguaje claro?||
|¿Muestra estado o acción relevante?||
|¿Puede explicarse en menos de 5 segundos?||

---

# Criterios de aprobación del UI Kit inicial

Este UI Kit se considerará aprobado si:

- traduce la dirección visual en componentes concretos,
    
- permite construir las escenas del prototipo visual,
    
- mantiene coherencia WhatsApp-first,
    
- da valor claro a Web/PWA,
    
- define estados, botones y tarjetas,
    
- cuida evidencia, corrección y cierre,
    
- evita sobrecargar la experiencia,
    
- evita promesas inviables,
    
- mantiene una estética profesional y limpia.
    

## Próximo paso después de aprobar este documento

Después de aprobar este UI Kit, el siguiente entregable será:

**Plan de Construcción del Prototipo Visual Estático — Gamora Bot**

Ese documento definirá la secuencia exacta de pantallas visuales a producir, el orden de construcción, qué debe contener cada escena y cómo validar la primera versión visual.