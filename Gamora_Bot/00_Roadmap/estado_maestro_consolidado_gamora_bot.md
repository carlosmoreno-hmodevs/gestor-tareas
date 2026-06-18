# Estado Maestro Consolidado — Gamora Bot

## Estado

Documento rector de recapitulación y alineación estratégica.

## Propósito del documento

Este documento consolida el estado actual de Gamora Bot para iniciar una nueva etapa de trabajo enfocada en prototipo simulado, validación de experiencia y validación comercial, sin ejecutar desarrollo técnico adicional.

Su función es servir como punto de partida antes de diseñar narrativa, flujos, pantallas, storyboard o prototipo visual.

## Fuentes rectoras

Para este estado maestro se consideran como fuentes principales:

- `00_Roadmap/roadmap_maestro_gamora_bot.md`
    
- `11_Decisiones/decision_log.md`
    
- `01_Tesis/tesis_gamora_bot.md`
    
- `02_Customer_Journey/momentos_de_valor.md`
    
- `05_Arquitectura_Funcional/modulos_mvp.md`
    
- `05_Arquitectura_Funcional/modelo_de_estados.md`
    
- `06_Flujos_MVP/flujo_creacion_pendiente.md`
    
- `06_Flujos_MVP/flujo_evidencia_aprobacion_cierre.md`
    
- `06_Flujos_MVP/flujo_onboarding_baja_friccion_y_enrolamiento.md`
    
- `12_DevOps_y_Ambientes/validacion_mvp_2_4_cierre_integral.md`
    
- `12_DevOps_y_Ambientes/validacion_mvp_2_4_2_simplificacion_ux_por_actor.md`
    
- `08_Prompts_Codex/prompt_mvp_2_5_flujo_completo_web_ferreteria_luisito.md`
    
- `00_Roadmap/cambio_de_metodo_prototipo_simulado.md`
    

## Definición consolidada de Gamora Bot

Gamora Bot es un canal formal de compromisos operativos sobre WhatsApp Business, apoyado por una capa web/PWA de control, trazabilidad, evidencia, revisión y cierre.

Gamora Bot no busca reemplazar la conversación natural de WhatsApp. Su función es capturar el momento en que una conversación informal se convierte en compromiso operativo, para darle responsable, fecha, evidencia esperada, estado, seguimiento y cierre.

## Objeto central del producto

El objeto central de Gamora Bot es el compromiso operativo.

Un compromiso operativo puede entenderse como una unidad mínima de seguimiento compuesta por:

- responsable,
    
- fecha compromiso,
    
- evidencia esperada,
    
- estado,
    
- bitácora,
    
- revisión,
    
- corrección si aplica,
    
- cierre.
    

## Qué es Gamora Bot

Gamora Bot es:

- Un sistema para convertir pendientes operativos en compromisos trazables.
    
- Un canal formal para seguimiento sobre WhatsApp Business.
    
- Una capa de control para dueños, administradores, coordinadores o responsables.
    
- Un mecanismo para solicitar, recibir y validar evidencias.
    
- Una forma de reducir persecución manual de pendientes.
    
- Una herramienta para generar visibilidad sobre lo que está pendiente, vencido, evidenciado, corregido o cerrado.
    

## Qué no es Gamora Bot

Gamora Bot no es:

- Un lector de chats personales.
    
- Un sistema para espiar conversaciones privadas.
    
- Un task manager genérico.
    
- Un ERP.
    
- Un CRM.
    
- Un sistema de auditoría interna.
    
- Una app compleja para cargar trabajo administrativo.
    
- Un reemplazo completo de WhatsApp.
    
- Un flujo donde la IA aprueba o cierra compromisos sin intervención humana autorizada.
    

## Principio rector de experiencia

La promesa correcta del producto no debe ser “cero fricción” absoluta, porque todo compromiso formal requiere cierto nivel mínimo de captura, aceptación, evidencia, revisión y cierre.

La promesa adecuada es:

**Máximo control operativo con mínima fricción.**

Para efectos del prototipo simulado, se buscará una experiencia de fricción casi invisible para el usuario final, especialmente para el responsable operativo que recibe y cumple compromisos.

## Estado documental cerrado

Se consideran cerradas o aprobadas documentalmente las siguientes fases:

### Fase 0 — Base documental

Estado: cerrada / aprobada.

Incluye estructura inicial del vault, roadmap, índice y decision log inicial.

### Fase 1 — Tesis y problema

Estado: cerrada / aprobada.

Incluye tesis formal, problema, propuesta de valor, objeto central del producto y posicionamiento del compromiso operativo como unidad base.

### Fase 2 — Customer Journey PyME

Estado: cerrada / aprobada.

Incluye customer journey, mapa de dolores y momentos de valor.

### Fase 3 — Benchmark

Estado: cerrada / aprobada.

Incluye análisis de Tasks.Bot, competidores adicionales y matriz comparativa.

### Fase 4 — Regulación, Meta y riesgos

Estado: cerrada / aprobada.

Incluye privacidad de datos en México, restricciones de Meta/WhatsApp y riesgos operativos/legales.

### Fase 5 — Arquitectura funcional

Estado: cerrada / aprobada.

Incluye arquitectura funcional, módulos MVP y modelo de estados.

### Fase 6 — Flujos MVP

Estado: cerrada / aprobada.

Incluye flujos de creación de pendiente, evidencia/aprobación/cierre, onboarding, reportes, Mina Mercedes y Sunworks.

### Fase 7 — Modelo técnico

Estado: cerrada / aprobada.

Incluye arquitectura técnica, modelo de datos, integración WhatsApp Business API y webhook/eventos.

## Estado técnico documentado en el vault

El vault documenta validaciones técnicas hasta:

- MVP 0 — Base del repositorio.
    
- MVP 1 — Motor de compromisos.
    
- MVP 2 — Interfaz web inicial.
    
- MVP 2.1 — UX por intención del usuario.
    
- MVP 2.2 — Configuración mínima operativa.
    
- MVP 2.3 — Creación guiada de compromisos.
    
- MVP 2.4 — Evidencias simuladas/controladas desde web.
    
- MVP 2.4.2 — Simplificación UX por actor y limpieza de datos demo.
    
- Cierre integral de MVP 2.4.
    

## Estado técnico declarado por Luis Felipe

Luis Felipe indica que el desarrollo técnico llegó hasta MVP 2.5.1.

Este dato se toma como estado operativo declarado del proyecto.

Sin embargo, dentro del vault revisado no se identifica todavía una validación formal documentada de MVP 2.5 ni MVP 2.5.1 equivalente a las validaciones existentes de MVP 2.4 y MVP 2.4.2.

Por lo tanto, MVP 2.5 y MVP 2.5.1 quedan como avance técnico declarado, pero pendientes de cierre documental formal dentro del vault.

## Brecha documental identificada

Existe una brecha entre:

1. El estado declarado por Luis Felipe: avance técnico hasta MVP 2.5.1.
    
2. El estado documental visible en el vault: cierre formal hasta MVP 2.4 / 2.4.2 y prompt preparado para MVP 2.5.
    

Esta brecha no invalida el proyecto, pero debe reconocerse para evitar confusión futura.

## Contradicciones o desalineaciones detectadas

### 1. Roadmap desactualizado frente al estado declarado

El roadmap maestro todavía presenta MVP 2.5 como siguiente paso sugerido, mientras que Luis Felipe declara que el desarrollo técnico llegó hasta MVP 2.5.1.

### 2. Decision log desactualizado frente al nuevo método

El decision log conserva la decisión D-002, donde Codex aparece como desarrollador senior.

Sin embargo, la nueva etapa establece que el trabajo será exclusivamente entre Luis Felipe y ChatGPT, sin Codex.

### 3. Falta de cierre formal de MVP 2.5 y MVP 2.5.1

No se identifica en el vault una validación formal equivalente a:

- `validacion_mvp_2_5.md`
    
- `validacion_mvp_2_5_1.md`
    
- decisión de cierre MVP 2.5
    
- decisión de cierre MVP 2.5.1
    

### 4. Carpeta de pruebas y validación poco desarrollada

La carpeta `09_Pruebas_y_Validacion` existe, pero la evidencia real de validación está principalmente en `12_DevOps_y_Ambientes`.

### 5. Cambio estratégico no reflejado todavía en todo el vault

El cambio hacia prototipo simulado sin código ya fue documentado en `00_Roadmap/cambio_de_metodo_prototipo_simulado.md`, pero todavía no se ha propagado a roadmap, decision log, backlog ni documentos de validación comercial.

## Decisión estratégica actual

Se decide pausar temporalmente la ruta de desarrollo técnico.

No se ejecutará MVP 3 — WhatsApp mock controlado.

No se involucrará Codex.

No se desarrollará código.

No se construirá integración real con WhatsApp.

No se construirá integración real con OpenAI.

No se desarrollará backend, base de datos, webhook ni automatización funcional.

El proyecto entra en una etapa de prototipo simulado, estático, ligero y orientado a validación de producto.

## Nueva etapa de trabajo

Nombre sugerido:

**Fase 8B — Prototipo Simulado de Validación Comercial**

Objetivo:

Diseñar una experiencia simulada de Gamora Bot que permita mostrar a usuarios reales o potenciales cómo una conversación operativa de WhatsApp puede convertirse en un compromiso trazable, con evidencia, revisión, corrección y cierre.

## Objetivo de la nueva etapa

El objetivo no es demostrar tecnología.

El objetivo es demostrar entendimiento, utilidad, claridad y deseo de uso.

La pregunta central de validación será:

**¿El usuario entiende en pocos minutos que Gamora Bot le ayuda a dejar de perseguir pendientes operativos por WhatsApp?**

## Alcance de la nueva etapa

La nueva etapa incluirá:

- Estado maestro consolidado.
    
- Reglas del prototipo simulado.
    
- Caso demo principal.
    
- Mapa de actores.
    
- Guion narrativo de demo.
    
- Flujo maestro.
    
- Mapa de estados simplificado.
    
- Identificación de puntos de fricción.
    
- Mensajes simulados de WhatsApp.
    
- Textos de pantallas.
    
- Wireframes textuales.
    
- Storyboard.
    
- Prototipo estático.
    
- Guion de validación con usuarios.
    
- Formato de captura de feedback.
    
- Criterios para decidir si la idea avanza, se ajusta o se descarta.
    

## Fuera de alcance de la nueva etapa

Queda fuera de alcance:

- Desarrollo técnico.
    
- Codex.
    
- MVP 3.
    
- WhatsApp mock controlado ejecutable.
    
- WhatsApp real.
    
- OpenAI real.
    
- Backend.
    
- Base de datos.
    
- Login real.
    
- Webhook.
    
- Storage real.
    
- Archivos reales.
    
- Automatizaciones reales.
    
- Producto funcional.
    

## Caso demo recomendado

El caso demo principal recomendado es:

**Ferretería Luisito**

Razones:

- Es fácil de entender.
    
- Representa una PyME operativa.
    
- Tiene actores claros.
    
- Permite mostrar compromisos sencillos.
    
- Permite mostrar evidencia fotográfica.
    
- Permite mostrar aprobación, corrección y cierre.
    
- Evita complejidad técnica o corporativa innecesaria.
    
- Ayuda a validar si Gamora Bot se entiende en escenarios cotidianos.
    

## Actores base del caso demo

Los actores base para la demo serán:

- Luisito: dueño, administrador o responsable de control.
    
- Panchito: responsable operativo que debe cumplir un compromiso.
    
- Rosita: apoyo, supervisora o colaboradora secundaria si el flujo lo requiere.
    
- Gamora Bot: canal formal que guía, registra y ordena.
    

## Flujo base a demostrar

El flujo base del prototipo simulado será:

1. Luisito detecta un pendiente operativo.
    
2. Luisito lo convierte en compromiso.
    
3. Gamora Bot registra responsable, fecha y evidencia esperada.
    
4. Panchito recibe el compromiso.
    
5. Panchito acepta o entiende lo que debe hacer.
    
6. Panchito cumple y manda evidencia.
    
7. Luisito revisa la evidencia.
    
8. Luisito aprueba o pide corrección.
    
9. Panchito corrige si aplica.
    
10. Luisito aprueba y cierra.
    
11. Gamora Bot muestra trazabilidad y estado final.
    

## Principio crítico de diseño

No se iniciará por diseño visual final.

La secuencia correcta será:

1. Claridad estratégica.
    
2. Narrativa.
    
3. Flujo.
    
4. Mensajes.
    
5. Pantallas base.
    
6. Validación.
    
7. Diseño visual.
    
8. Prototipo final presentable.
    

## Criterios de avance

No se avanzará a pantallas si la narrativa no está clara.

No se avanzará a diseño visual si el flujo no está claro.

No se avanzará a validación externa si el prototipo no se entiende internamente.

No se retomará desarrollo técnico hasta validar que el producto tiene claridad, utilidad y deseo de uso.

## Método de trabajo actualizado

A partir de esta etapa, el trabajo se realizará exclusivamente entre Luis Felipe y ChatGPT.

ChatGPT actuará como socio estratégico, mentor crítico, arquitecto de experiencia, estructurador de narrativa, diseñador funcional y copiloto documental.

Luis Felipe validará, corregirá, aprobará o rechazará cada entregable.

Si algo debe hacerse en Obsidian o fuera de la conversación, ChatGPT dará instrucciones claras, guiadas y fáciles de ejecutar manualmente.

Codex no participará en esta etapa.

## Próximos entregables

Los siguientes entregables serán:

1. Documento de decisión del nuevo método.
    
2. Caso demo principal — Ferretería Luisito.
    
3. Mapa de actores.
    
4. Guion narrativo de demo.
    
5. Flujo maestro del prototipo simulado.
    
6. Mensajes simulados de WhatsApp.
    
7. Textos base de pantallas.
    
8. Wireframes textuales.
    
9. Storyboard.
    
10. Guion de validación con usuarios.
    

## Dictamen estratégico

Gamora Bot tiene suficiente documentación estratégica y técnica para no seguir avanzando a ciegas en ingeniería.

El riesgo principal ya no es si se puede construir técnicamente.

El riesgo principal es si el usuario entiende, desea y adoptaría el producto.

Por eso, la siguiente etapa debe enfocarse en claridad, experiencia y validación comercial antes de volver a desarrollo.

## Cierre

Este documento establece el nuevo punto cero del proyecto.

A partir de aquí, Gamora Bot se trabajará como un prototipo simulado de validación, no como un desarrollo técnico incremental.

MVP 3 queda pausado.

La prioridad será demostrar valor de forma simple, clara y validable.