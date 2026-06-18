# Wireframes Textuales del Prototipo Simulado — Ferretería Luisito

## Estado

Documento base para validar los wireframes textuales del prototipo simulado de Gamora Bot.

## Propósito

Este documento convierte el mapa de pantallas en una primera representación simple de la experiencia.

No es diseño visual final.

No define colores.

No define tipografías.

No define componentes definitivos.

No define código.

Su función es validar la estructura, secuencia, información y acciones principales de cada pantalla antes de diseñar una interfaz visual más cuidada.

## Caso base

**Ferretería Luisito**

## Compromiso operativo principal

**Contar los sacos de cemento disponibles en Sucursal Norte y mandar evidencia fotográfica del conteo.**

## Principio rector

Estos wireframes deben mostrar la historia completa con la menor fricción posible.

La demo debe contar el flujo:

**pendiente suelto → compromiso creado → responsable acepta → evidencia enviada → corrección → evidencia corregida → cierre con historial.**

## Enfoque de esta versión

Para la primera versión de wireframes se usará la **secuencia compacta de 12 pantallas**.

La secuencia completa de 20 pantallas existe como referencia, pero para validar la idea necesitamos una demo más ligera.

## Secuencia seleccionada para wireframes V1

1. Antes: pendiente perdido en WhatsApp.
    
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
    

## Criterio de diseño de baja fidelidad

Cada wireframe debe mostrar:

- título de la pantalla,
    
- actor principal,
    
- información mínima,
    
- acción principal,
    
- acción secundaria si aplica,
    
- estado visible,
    
- nota de intención.
    

No debe mostrar elementos visuales complejos.

---

# Wireframe 1 — Antes: pendiente perdido en WhatsApp

## Actor principal

Luisito.

## Tipo de pantalla

Pantalla conceptual de apertura.

## Objetivo

Mostrar el problema antes de Gamora Bot.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ WhatsApp de Luisito                  │
├──────────────────────────────────────┤
│ Luisito: Panchito, porfa cuenta los  │
│ sacos de cemento y me mandas foto.   │
│                                      │
│ Panchito: Va, al rato lo reviso.     │
│                                      │
│ Luisito: ¿Ya lo hiciste?             │
│                                      │
│ Panchito: Creo que sí eran 48.       │
│                                      │
│ Luisito: ¿Me mandaste foto?          │
│                                      │
│ Panchito: Sí, creo que arriba quedó. │
│                                      │
│ Luisito: ¿Esa foto es de hoy?        │
└──────────────────────────────────────┘
```

## Mensaje de apoyo

**WhatsApp ayuda a conversar, pero no siempre ayuda a controlar pendientes.**

## Qué debe transmitir

El pendiente existe, pero está mezclado con mensajes sueltos.

## Riesgo a evitar

No hacer esta pantalla demasiado dramática ni larga. Solo debe mostrar el dolor de forma rápida.

---

# Wireframe 2 — Crear compromiso

## Actor principal

Luisito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Mostrar cómo Luisito convierte un pendiente en compromiso formal.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Crear compromiso                     │
├──────────────────────────────────────┤
│ Convierte un pendiente operativo en │
│ un compromiso claro.                 │
│                                      │
│ Responsable                          │
│ [ Panchito                    ▾ ]    │
│                                      │
│ Qué debe hacer                       │
│ [ Contar los sacos de cemento      ] │
│                                      │
│ Dónde aplica                         │
│ [ Sucursal Norte                   ] │
│                                      │
│ Para cuándo                          │
│ [ Hoy antes de las 5:00 p.m.       ] │
│                                      │
│ Qué evidencia debe mandar            │
│ [ Foto del área de cemento y       ] │
│ [ cantidad total de sacos          ] │
│                                      │
│ Mientras más clara sea la evidencia, │
│ más fácil será cerrar el compromiso. │
│                                      │
│ [ Crear compromiso ]                 │
│ [ Cancelar ]                         │
└──────────────────────────────────────┘
```

## Estado visible

**Nuevo**

## Acción principal

**Crear compromiso**

## Qué debe transmitir

Crear un compromiso no debe sentirse como llenar un sistema pesado.

## Riesgo a evitar

Agregar campos innecesarios como prioridad, categoría, etiquetas, aprobadores o recordatorios avanzados.

---

# Wireframe 3 — Panchito recibe compromiso

## Actor principal

Panchito.

## Tipo de pantalla

WhatsApp simulado.

## Objetivo

Mostrar cómo recibe Panchito el compromiso con mínima fricción.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ WhatsApp — Gamora Bot                │
├──────────────────────────────────────┤
│ Hola, Panchito.                      │
│ Luisito te asignó un nuevo           │
│ compromiso:                          │
│                                      │
│ Qué hay que hacer:                   │
│ Contar los sacos de cemento          │
│ disponibles en Sucursal Norte.       │
│                                      │
│ Para cuándo:                         │
│ Hoy antes de las 5:00 p.m.           │
│                                      │
│ Evidencia esperada:                  │
│ Manda una foto del área de cemento   │
│ y escribe la cantidad total de sacos.│
│                                      │
│ [ Aceptar compromiso ]               │
│ [ Tengo una duda ]                   │
│ [ No puedo atenderlo ]               │
└──────────────────────────────────────┘
```

## Estado visible

**Nuevo**

## Acción principal

**Aceptar compromiso**

## Qué debe transmitir

Panchito entiende en segundos qué tiene que hacer.

## Riesgo a evitar

Que parezca una notificación corporativa o un formulario disfrazado de WhatsApp.

---

# Wireframe 4 — Panchito acepta

## Actor principal

Panchito.

## Tipo de pantalla

WhatsApp simulado.

## Objetivo

Confirmar que Panchito recibió y aceptó el compromiso.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ WhatsApp — Gamora Bot                │
├──────────────────────────────────────┤
│ Perfecto, Panchito.                  │
│ El compromiso quedó aceptado.        │
│                                      │
│ Cuando termines el conteo, manda:    │
│                                      │
│ • Foto del área de cemento           │
│ • Cantidad total de sacos            │
│                                      │
│ [ Enviar evidencia ]                 │
│ [ Ver compromiso ]                   │
└──────────────────────────────────────┘
```

## Estado visible

**Aceptado**

## Acción principal

**Enviar evidencia**

## Qué debe transmitir

Panchito no tiene que aprender una app completa. Solo acepta y sigue la instrucción.

## Mensaje paralelo para Luisito

Este aviso puede mostrarse como una pequeña notificación:

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
├──────────────────────────────────────┤
│ Luisito, Panchito ya aceptó el       │
│ compromiso:                          │
│                                      │
│ Contar los sacos de cemento          │
│ disponibles en Sucursal Norte.       │
│                                      │
│ Estado: Aceptado                     │
│                                      │
│ [ Ver estado ]                       │
└──────────────────────────────────────┘
```

## Riesgo a evitar

No sobreexplicar el concepto de aceptación.

---

# Wireframe 5 — Mi día de Panchito

## Actor principal

Panchito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Mostrar la vista mínima del responsable operativo.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Mi día                               │
├──────────────────────────────────────┤
│ Estos son tus compromisos pendientes.│
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Contar sacos de cemento          │ │
│ │ Sucursal Norte                   │ │
│ │                                  │ │
│ │ Para cuándo:                     │ │
│ │ Hoy antes de las 5:00 p.m.       │ │
│ │                                  │ │
│ │ Estado: Aceptado                 │ │
│ │                                  │ │
│ │ Evidencia esperada:              │ │
│ │ Foto del área de cemento y       │ │
│ │ cantidad total de sacos.         │ │
│ │                                  │ │
│ │ [ Enviar evidencia ]             │ │
│ │ [ Ver detalle ]                  │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## Estado visible

**Aceptado / En proceso**

## Acción principal

**Enviar evidencia**

## Qué debe transmitir

Panchito solo ve lo que debe hacer. Nada más.

## Riesgo a evitar

Mostrarle tablero, analítica, reportes, historial completo o información de otros usuarios.

---

# Wireframe 6 — Enviar evidencia

## Actor principal

Panchito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Permitir que Panchito reporte cumplimiento con foto y cantidad.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Enviar evidencia                     │
├──────────────────────────────────────┤
│ Agrega la foto y confirma la         │
│ cantidad total de sacos.             │
│                                      │
│ Compromiso:                          │
│ Contar sacos de cemento              │
│                                      │
│ Foto de evidencia                    │
│ [ Agregar foto ]                     │
│                                      │
│ La foto debe mostrar el área de      │
│ cemento lo más completa posible.     │
│                                      │
│ Cantidad total de sacos              │
│ [ 48                               ] │
│                                      │
│ Comentario                           │
│ [ Listo, hay 48 sacos de cemento   ] │
│ [ disponibles.                     ] │
│                                      │
│ [ Enviar evidencia ]                 │
│ [ Cancelar ]                         │
└──────────────────────────────────────┘
```

## Estado visible

**Evidencia enviada**

## Acción principal

**Enviar evidencia**

## Confirmación posterior

```text
┌──────────────────────────────────────┐
│ Evidencia enviada                    │
├──────────────────────────────────────┤
│ Luisito recibirá la evidencia para   │
│ revisión.                            │
│                                      │
│ Te avisaremos si queda cerrada o si  │
│ hace falta corregir algo.            │
│                                      │
│ [ Ver compromiso ]                   │
└──────────────────────────────────────┘
```

## Qué debe transmitir

Enviar evidencia es simple, pero no significa cerrar automáticamente.

## Riesgo a evitar

No decir “compromiso cerrado” en este momento.

---

# Wireframe 7 — Luisito revisa evidencia

## Actor principal

Luisito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Permitir que Luisito revise evidencia y decida si aprueba o pide corrección.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Revisar evidencia                    │
├──────────────────────────────────────┤
│ Panchito envió evidencia para este   │
│ compromiso.                          │
│                                      │
│ Compromiso:                          │
│ Contar los sacos de cemento          │
│ disponibles en Sucursal Norte.       │
│                                      │
│ Responsable:                         │
│ Panchito                             │
│                                      │
│ Para cuándo:                         │
│ Hoy antes de las 5:00 p.m.           │
│                                      │
│ Cantidad reportada:                  │
│ 48 sacos                             │
│                                      │
│ Evidencia enviada:                   │
│ [ Foto del área de cemento ]         │
│                                      │
│ ¿Qué deseas hacer con esta evidencia?│
│                                      │
│ [ Aprobar y cerrar ]                 │
│ [ Pedir corrección ]                 │
└──────────────────────────────────────┘
```

## Estado visible

**Evidencia enviada**

## Acción principal en la demo

**Pedir corrección**

## Acción secundaria

**Aprobar y cerrar**

## Qué debe transmitir

Luisito tiene control y puede decidir.

## Riesgo a evitar

Mostrar demasiadas acciones. Aquí solo importan dos: aprobar o corregir.

---

# Wireframe 8 — Luisito pide corrección

## Actor principal

Luisito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Permitir que Luisito explique qué falta corregir.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Pedir corrección                     │
├──────────────────────────────────────┤
│ Explica qué debe ajustar Panchito    │
│ para poder cerrar el compromiso.     │
│                                      │
│ Compromiso:                          │
│ Contar sacos de cemento              │
│                                      │
│ Qué falta corregir                   │
│ ┌──────────────────────────────────┐ │
│ │ La foto no muestra completo el   │ │
│ │ espacio de cemento. Por favor    │ │
│ │ manda una foto más abierta y     │ │
│ │ confirma nuevamente la cantidad  │ │
│ │ total.                           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Sé específico para que Panchito sepa │
│ exactamente qué debe reenviar.       │
│                                      │
│ [ Enviar corrección ]                │
│ [ Cancelar ]                         │
└──────────────────────────────────────┘
```

## Estado visible

**Necesita corrección**

## Acción principal

**Enviar corrección**

## Confirmación posterior

```text
┌──────────────────────────────────────┐
│ Corrección enviada                   │
├──────────────────────────────────────┤
│ Panchito recibirá el motivo y podrá  │
│ reenviar la evidencia corregida.     │
│                                      │
│ [ Ver compromiso ]                   │
│ [ Ver historial ]                    │
└──────────────────────────────────────┘
```

## Qué debe transmitir

La corrección es una guía clara, no un castigo.

## Riesgo a evitar

Usar frases como “evidencia rechazada” o “incumplimiento”.

---

# Wireframe 9 — Panchito recibe corrección

## Actor principal

Panchito.

## Tipo de pantalla

WhatsApp simulado.

## Objetivo

Mostrar que Panchito entiende exactamente qué debe corregir.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ WhatsApp — Gamora Bot                │
├──────────────────────────────────────┤
│ Panchito, Luisito necesita una       │
│ corrección en este compromiso:       │
│                                      │
│ Contar los sacos de cemento          │
│ disponibles en Sucursal Norte.       │
│                                      │
│ Qué falta corregir:                  │
│ La foto no muestra completo el       │
│ espacio de cemento.                  │
│                                      │
│ Qué debes enviar:                    │
│ Una foto más abierta del área y      │
│ confirmar nuevamente la cantidad     │
│ total de sacos.                      │
│                                      │
│ [ Corregir y reenviar ]              │
│ [ Tengo una duda ]                   │
└──────────────────────────────────────┘
```

## Estado visible

**Necesita corrección**

## Acción principal

**Corregir y reenviar**

## Qué debe transmitir

Panchito sabe qué debe hacer sin sentirse regañado.

## Riesgo a evitar

Que la corrección parezca sanción.

---

# Wireframe 10 — Panchito reenvía evidencia

## Actor principal

Panchito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Permitir que Panchito mande la evidencia corregida.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Corregir y reenviar                  │
├──────────────────────────────────────┤
│ Agrega la nueva foto y confirma la   │
│ cantidad total.                      │
│                                      │
│ Motivo de corrección:                │
│ La foto anterior no mostraba completo│
│ el espacio de cemento.               │
│                                      │
│ Foto corregida                       │
│ [ Agregar nueva foto ]               │
│                                      │
│ Cantidad total confirmada            │
│ [ 48                               ] │
│                                      │
│ Comentario                           │
│ [ Corregido. Son 48 sacos en total.] │
│ [ Te mando foto completa del área. ] │
│                                      │
│ [ Reenviar evidencia ]               │
│ [ Cancelar ]                         │
└──────────────────────────────────────┘
```

## Estado visible

**Corregido**

## Acción principal

**Reenviar evidencia**

## Confirmación posterior

```text
┌──────────────────────────────────────┐
│ Evidencia corregida enviada          │
├──────────────────────────────────────┤
│ Luisito recibirá la nueva evidencia  │
│ para revisión.                       │
│                                      │
│ [ Ver compromiso ]                   │
└──────────────────────────────────────┘
```

## Qué debe transmitir

Panchito no empieza de cero; solo corrige lo necesario.

## Riesgo a evitar

Que el usuario piense que se duplicó el compromiso.

---

# Wireframe 11 — Luisito aprueba y cierra

## Actor principal

Luisito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Confirmar el cierre formal del compromiso.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Aprobar y cerrar                     │
├──────────────────────────────────────┤
│ La evidencia será aprobada y el      │
│ compromiso quedará cerrado.          │
│                                      │
│ Compromiso:                          │
│ Contar los sacos de cemento          │
│ disponibles en Sucursal Norte.       │
│                                      │
│ Responsable:                         │
│ Panchito                             │
│                                      │
│ Resultado registrado:                │
│ 48 sacos                             │
│                                      │
│ Evidencia final:                     │
│ [ Foto completa del área de cemento] │
│                                      │
│ [ Cerrar compromiso ]                │
│ [ Volver a revisar ]                 │
└──────────────────────────────────────┘
```

## Estado visible

**Cerrado**

## Acción principal

**Cerrar compromiso**

## Confirmación final para Luisito

```text
┌──────────────────────────────────────┐
│ Compromiso cerrado                   │
├──────────────────────────────────────┤
│ El compromiso quedó cumplido,        │
│ evidenciado y cerrado.               │
│                                      │
│ Responsable: Panchito                │
│ Resultado: 48 sacos                  │
│ Cierre: Hoy, 4:18 p.m.               │
│                                      │
│ Ya no tienes que dar seguimiento     │
│ manual a este pendiente.             │
│                                      │
│ [ Ver historial ]                    │
│ [ Crear otro compromiso ]            │
│ [ Volver al inicio ]                 │
└──────────────────────────────────────┘
```

## Confirmación para Panchito

```text
┌──────────────────────────────────────┐
│ WhatsApp — Gamora Bot                │
├──────────────────────────────────────┤
│ Listo, Panchito.                     │
│ Luisito aprobó la evidencia y cerró  │
│ el compromiso.                       │
│                                      │
│ Resultado registrado:                │
│ 48 sacos de cemento disponibles en   │
│ Sucursal Norte.                      │
│                                      │
│ Buen trabajo.                        │
│                                      │
│ [ Ver mis compromisos ]              │
└──────────────────────────────────────┘
```

## Qué debe transmitir

El cierre es el momento de valor. El pendiente ya no está perdido ni ambiguo.

## Riesgo a evitar

Que el cierre se sienta automático. Debe quedar claro que Luisito aprueba.

---

# Wireframe 12 — Historial final

## Actor principal

Luisito.

## Tipo de pantalla

Web/PWA simulada.

## Objetivo

Mostrar trazabilidad simple y cerrar la demo con valor.

## Wireframe textual

```text
┌──────────────────────────────────────┐
│ Gamora Bot                           │
│ Historial del compromiso             │
├──────────────────────────────────────┤
│ Aquí puedes ver cómo avanzó este     │
│ compromiso hasta quedar cerrado.     │
│                                      │
│ Compromiso:                          │
│ Contar sacos de cemento              │
│                                      │
│ Estado final: Cerrado                │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 9:15 a.m.                        │ │
│ │ Luisito creó el compromiso       │ │
│ ├──────────────────────────────────┤ │
│ │ 9:16 a.m.                        │ │
│ │ Panchito recibió la instrucción  │ │
│ ├──────────────────────────────────┤ │
│ │ 9:18 a.m.                        │ │
│ │ Panchito aceptó el compromiso    │ │
│ ├──────────────────────────────────┤ │
│ │ 3:40 p.m.                        │ │
│ │ Panchito envió evidencia         │ │
│ ├──────────────────────────────────┤ │
│ │ 3:50 p.m.                        │ │
│ │ Luisito pidió una corrección     │ │
│ ├──────────────────────────────────┤ │
│ │ 4:10 p.m.                        │ │
│ │ Panchito envió evidencia         │ │
│ │ corregida                       │ │
│ ├──────────────────────────────────┤ │
│ │ 4:18 p.m.                        │ │
│ │ Luisito aprobó y cerró           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Este historial evita que el          │
│ seguimiento quede perdido entre      │
│ mensajes sueltos de WhatsApp.        │
│                                      │
│ [ Volver al compromiso ]             │
│ [ Crear otro compromiso ]            │
└──────────────────────────────────────┘
```

## Estado visible

**Cerrado**

## Acción principal

**Volver al compromiso**

## Qué debe transmitir

Gamora Bot no solo pide tareas. Construye memoria operativa del compromiso.

## Riesgo a evitar

Hacer el historial demasiado técnico o auditivo.

---

# Vista general del prototipo

## Secuencia completa en una línea

```text
WhatsApp desordenado
→ Crear compromiso
→ Panchito recibe
→ Panchito acepta
→ Mi día
→ Enviar evidencia
→ Luisito revisa
→ Pedir corrección
→ Panchito corrige
→ Reenviar evidencia
→ Aprobar y cerrar
→ Historial final
```

## Estados visibles usados

|Pantalla|Estado visible|
|---|---|
|Crear compromiso|Nuevo|
|Panchito recibe|Nuevo|
|Panchito acepta|Aceptado|
|Mi día|Aceptado / En proceso|
|Enviar evidencia|Evidencia enviada|
|Luisito revisa|Evidencia enviada|
|Pedir corrección|Necesita corrección|
|Panchito recibe corrección|Necesita corrección|
|Reenviar evidencia|Corregido|
|Aprobar y cerrar|Cerrado|
|Historial final|Cerrado|

## Momentos de valor

|Momento|Valor demostrado|
|---|---|
|Crear compromiso|El pendiente deja de ser mensaje suelto|
|Panchito recibe|El responsable entiende rápido|
|Panchito acepta|Luisito sabe que sí fue recibido|
|Enviar evidencia|La prueba queda asociada al compromiso|
|Pedir corrección|La evidencia puede ajustarse sin perder el hilo|
|Aprobar y cerrar|El compromiso termina formalmente|
|Historial final|Todo queda ordenado y consultable|

---

# Pantallas descartadas para esta versión

Para mantener la demo ligera, se descartan temporalmente:

- Login.
    
- Inicio completo de Luisito.
    
- Dashboard de métricas.
    
- Configuración.
    
- Administración de contactos.
    
- Enrolamiento.
    
- Reportes.
    
- Recordatorios.
    
- Reasignación.
    
- Cambios de fecha.
    
- Chat libre con IA.
    
- Vista de Rosita.
    
- Multiempresa.
    
- Cobranza.
    
- Suscripción.
    

## Razón

Estas pantallas pueden ser útiles después, pero no son necesarias para validar la idea principal.

La primera demo debe demostrar:

**crear → aceptar → evidenciar → corregir → cerrar.**

---

# Observaciones críticas

## 1. La demo no debe sentirse como task manager

Para evitarlo, se debe insistir en:

- WhatsApp como punto natural.
    
- Evidencia asociada al compromiso.
    
- Revisión humana.
    
- Corrección.
    
- Cierre formal.
    
- Historial.
    

## 2. Panchito debe tener mínima fricción

Panchito no debe ver:

- tablero,
    
- configuración,
    
- métricas,
    
- historial completo,
    
- otros responsables,
    
- permisos,
    
- reportes.
    

Panchito solo debe ver:

- qué hacer,
    
- para cuándo,
    
- qué evidencia mandar,
    
- cómo corregir,
    
- si ya quedó cerrado.
    

## 3. Luisito debe sentir control, no carga

Luisito debe poder:

- crear rápido,
    
- ver evidencia,
    
- pedir corrección,
    
- cerrar,
    
- consultar historial.
    

Pero no debe sentir que administra un sistema complejo.

## 4. La corrección debe ser amable

La corrección debe sonar como:

**“Falta una foto más abierta para confirmar el conteo.”**

No como:

**“Evidencia rechazada por incumplimiento.”**

## 5. El cierre debe ser contundente

El cierre debe mostrar que el pendiente ya no requiere persecución.

Frase clave:

**Ya no tienes que dar seguimiento manual a este pendiente.**

---

# Criterios de aprobación

Estos wireframes se considerarán aprobados si:

- La secuencia se entiende de principio a fin.
    
- La demo no se siente pesada.
    
- Las pantallas son suficientes para explicar el valor.
    
- Panchito tiene baja fricción.
    
- Luisito tiene control claro.
    
- WhatsApp se entiende como canal natural.
    
- Gamora Bot se entiende como capa de compromiso, evidencia y cierre.
    
- La corrección aporta valor sin sentirse negativa.
    
- El historial final refuerza la diferencia frente a WhatsApp normal.
    
- La estructura puede convertirse después en storyboard y prototipo visual.
    

## Próximo paso después de aprobar este documento

Después de aprobar estos wireframes, el siguiente entregable será:

**Storyboard del Prototipo Simulado — Ferretería Luisito**

Ese documento convertirá estas pantallas en una secuencia narrativa visual para presentar la demo como una historia completa.