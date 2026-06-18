# Roadmap de Preparación de Ambientes — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define qué herramientas, cuentas, ambientes y responsabilidades deben prepararse antes de empezar a generar código del MVP de Gamora Bot.

La idea es ordenar el terreno antes de construir. Gamora no será solamente una pantalla o un formulario: necesitará servidor, base de datos, conexión real con WhatsApp Business, OpenAI, almacenamiento de evidencias, logs, límites de consumo y ambientes separados para pruebas.

Este documento sirve para que Luis Felipe, ChatGPT, Codex y cualquier perfil DevOps entiendan qué debe estar listo antes de pedirle a Codex que empiece a programar.

## 2. Por qué esta fase es necesaria

Gamora no será solo una app.

Será un sistema conectado a varios servicios:

- WhatsApp Business API para enviar y recibir mensajes reales.
- OpenAI API para interpretar texto, audios o instrucciones.
- Un backend que gobierne compromisos, usuarios, evidencias, estados y guardrails.
- Una base de datos para guardar información real.
- Un storage para fotos, PDFs, audios y evidencias.
- Un webhook público para recibir eventos de WhatsApp.
- Una web/PWA para controlar, revisar y administrar.
- Logs y monitoreo para saber qué pasó cuando algo falle.
- Guardrails para evitar loops, duplicados, reintentos infinitos y costos inesperados.

Programar sin preparar ambientes puede generar:

- Errores difíciles de rastrear.
- Claves pegadas en lugares inseguros.
- Costos inesperados de WhatsApp u OpenAI.
- Mezcla de datos de prueba con datos reales.
- Webhooks mal configurados.
- Mensajes duplicados.
- Desorden técnico desde el inicio.

Por eso esta fase es necesaria: antes de construir, hay que saber dónde va a vivir el MVP, qué cuentas se usarán, quién administra cada cosa y cómo se controlan los costos.

## 3. Mapa simple del ecosistema técnico

En lenguaje simple, Gamora funcionará así:

Usuario WhatsApp → WhatsApp Business API → Webhook Gamora → Backend Gamora Core → Base de datos / Storage / OpenAI → Web/PWA → Respuesta WhatsApp.

Explicado con peras y manzanas:

- El usuario escribe por WhatsApp.
- WhatsApp le avisa a Gamora mediante un webhook.
- Gamora recibe el mensaje en su backend.
- Gamora revisa quién escribió, si está enrolado y qué quiere hacer.
- Si necesita IA, Gamora consulta OpenAI con el mínimo contexto necesario.
- Gamora guarda compromisos, evidencias, estados y bitácora en base de datos.
- Si hay archivos, los guarda en storage privado.
- La web/PWA muestra tablero, evidencias y administración.
- Si hace falta responder, Gamora manda un mensaje de regreso por WhatsApp.

## 4. Ambientes necesarios

### Ambiente local / desarrollo

Es el ambiente en la computadora del desarrollador.

Sirve para programar, probar pantallas, probar lógica básica y simular flujos sin poner en riesgo datos reales ni generar costos innecesarios.

Aquí se instala:

- Node.js.
- Dependencias del backend.
- Dependencias del frontend.
- Base de datos local o conexión de prueba.
- Variables `.env` de desarrollo.

No debe usar:

- Tokens productivos.
- Datos reales sensibles.
- Número oficial productivo de WhatsApp.
- Credenciales de producción.

### Ambiente staging / laboratorio

Es el ambiente real de pruebas controladas.

Sirve para probar con APIs reales, pero con usuarios limitados, datos de prueba y costos controlados.

Aquí se prueba:

- Webhook HTTPS real.
- WhatsApp Business test o número controlado.
- OpenAI API con límites.
- Base de datos staging.
- Storage staging.
- Logs reales.
- Guardrails básicos.

Staging es donde se descubre si lo que funcionaba localmente realmente funciona conectado al mundo.

### Ambiente producción

Es el ambiente real para clientes o pilotos.

Debe usarse solo cuando:

- El flujo ya fue probado en local.
- El flujo ya fue probado en staging.
- Los costos están controlados.
- Los usuarios están enrolados.
- Las claves están protegidas.
- Hay logs y monitoreo mínimo.

Producción no debe ser el lugar para experimentar sin control.

| Ambiente | Para qué sirve | Qué herramientas usa | Qué credenciales maneja | Quién lo administra | Riesgos |
|---|---|---|---|---|---|
| Local / desarrollo | Programar y probar lógica básica. | Node.js, backend, frontend, DB local o de prueba, `.env` local. | Credenciales de desarrollo o mocks. | Codex/desarrollador. | Mezclar claves reales, depender de simulaciones irreales. |
| Staging / laboratorio | Probar con APIs reales de forma controlada. | Hosting staging, DB staging, storage staging, webhook HTTPS, WhatsApp test, OpenAI con límites. | Tokens y claves de prueba/staging. | DevOps + Codex/desarrollador. | Costos no controlados, webhooks mal configurados, datos de prueba mal separados. |
| Producción | Operar pilotos/clientes reales. | Hosting productivo, DB productiva, storage privado, dominio, HTTPS, logs, backups. | Credenciales productivas. | DevOps + responsable técnico. | Exposición de datos, costos, caídas, errores visibles para clientes. |

## 5. Herramientas necesarias

### Repositorio de código

Se necesita un lugar donde viva el código del MVP.

Opciones típicas:

- GitHub.
- GitLab.

El repositorio permite:

- Guardar historial de cambios.
- Crear ramas.
- Revisar avances.
- Automatizar despliegues.
- Separar código de documentación.

### Backend

Recomendación inicial:

- Node.js + TypeScript.

El backend será Gamora Core: usuarios, compromisos, evidencias, estados, permisos, guardrails, webhooks y conexión con APIs.

### Frontend

Recomendación inicial:

- React/Next.js.

La web/PWA será la capa de control para administradores, coordinadores y validadores.

### Base de datos

Recomendación:

- PostgreSQL para MVP real.
- SQLite solo local opcional.

PostgreSQL conviene porque Gamora tendrá relaciones entre usuarios, empresas, compromisos, evidencias, bitácoras, eventos y guardrails.

### ORM

Recomendación:

- Prisma.

Prisma ayuda a trabajar con la base de datos desde TypeScript de forma más ordenada.

### WhatsApp Business Cloud API

Se necesitará:

- Cuenta Meta Business.
- WhatsApp Business Account, WABA.
- Número de WhatsApp Business.
- Phone Number ID.
- Access token.
- Webhook público HTTPS.
- Templates cuando aplique.

Esto queda sujeto a validación técnica y configuración real con Meta/BSP.

### OpenAI API

Se necesitará:

- Cuenta OpenAI Platform.
- API key.
- Billing configurado.
- Límites de uso.
- Reglas de consumo.

OpenAI debe usarse como IA auxiliar, no como sistema que decide solo.

### Storage de evidencias

Opciones:

- AWS S3.
- Azure Blob Storage.
- Supabase Storage.
- O equivalente.

Sirve para guardar fotos, PDFs, audios y documentos. WhatsApp no debe ser el repositorio permanente de evidencias.

### Hosting / servidor

Opciones posibles:

- Railway.
- Render.
- Vercel.
- VPS.
- Opción equivalente.

El backend necesita vivir en un servidor con HTTPS para recibir webhooks.

### Dominio y HTTPS

Se necesita un dominio o subdominio para:

- Web/PWA.
- Webhook.
- Ambiente staging.
- Ambiente producción.

HTTPS es obligatorio para operar webhooks reales con seguridad.

### Logs y monitoreo

Desde el MVP debe existir monitoreo básico:

- Errores.
- Webhooks recibidos.
- Duplicados.
- Reintentos agotados.
- Consumo WhatsApp.
- Consumo OpenAI.
- Guardrails activados.

### Guardrails

Los guardrails deben existir desde el inicio:

- Límites de mensajes.
- Límites de IA.
- Reintentos con tope.
- Deduplicación.
- Circuit breaker.
- Pausa manual.
- Registro de consumo.

## 6. Matriz de costos iniciales

| Herramienta | Tipo de costo | Cuándo se paga | Riesgo de costo | Recomendación |
|---|---|---|---|---|
| GitHub/GitLab | Gratis / bajo costo | Cuando se requiere plan privado avanzado o equipo mayor. | Bajo. | Iniciar con plan gratuito o bajo costo. |
| OpenAI API | Pago por uso | Cada vez que se consumen tokens, transcripción o modelos. | Medio/alto si no hay límites. | Configurar presupuesto y guardrails desde el inicio. |
| WhatsApp Business API | Pago por uso | Según reglas vigentes de Meta y tipo/categoría de mensajes. | Medio/alto si hay muchos mensajes o loops. | Medir consumo desde staging. |
| Hosting | Gratis / bajo costo / pago por uso | Cuando se despliega backend/frontend. | Medio si escala sin control. | Empezar administrado y simple. |
| PostgreSQL | Gratis / bajo costo / pago por uso | Según proveedor y tamaño. | Medio si crece almacenamiento. | Usar proveedor administrado para MVP. |
| Storage | Bajo costo / pago por uso | Por almacenamiento y transferencia de evidencias. | Medio si se suben muchos archivos. | Limitar tamaño y cantidad de evidencias. |
| Dominio | Bajo costo | Compra/renovación anual. | Bajo. | Definir dominio o subdominio desde staging. |
| Logs/monitoreo | Gratis / bajo costo / pendiente | Según proveedor y volumen. | Medio si logs crecen mucho. | Iniciar con monitoreo básico. |
| DevOps | Pendiente de cotización/validación | Según quién configure ambientes y despliegues. | Medio/alto si falta responsable. | Definir responsable antes de programar. |

## 7. Cuentas que Luis Felipe debe preparar

Luis Felipe deberá preparar o decidir acceso a:

- Cuenta GitHub/GitLab.
- Cuenta Meta Business.
- Cuenta WhatsApp Business Platform.
- Cuenta OpenAI Platform.
- Cuenta proveedor hosting.
- Cuenta proveedor DB/storage.
- Dominio.
- Método de pago controlado.

### Regla importante

No pegar claves reales en Obsidian ni en prompts.

Las claves reales deben manejarse como secretos, variables de entorno o configuración segura del proveedor.

## 8. Credenciales y secretos

Una API key es una llave que permite que Gamora use un servicio externo, como OpenAI.

Un token es una credencial temporal o permanente que autoriza llamadas a una API, como WhatsApp Business Cloud API.

Un secret es cualquier dato que no debe exponerse: claves, tokens, contraseñas, webhooks privados o credenciales.

### Por qué no se deben compartir en texto plano

Porque alguien podría:

- Usar las APIs sin permiso.
- Generar costos.
- Leer datos.
- Enviar mensajes.
- Romper la seguridad del proyecto.

### Manejo con `.env`

En desarrollo se usarán archivos `.env` locales para variables como:

- OPENAI_API_KEY
- WHATSAPP_ACCESS_TOKEN
- DATABASE_URL
- STORAGE_SECRET
- WEBHOOK_VERIFY_TOKEN

El repositorio debe incluir un `.env.example` sin claves reales.

### Diferencia por ambiente

- Dev/local: claves de prueba o simuladas.
- Staging: claves reales controladas, con límites.
- Producción: claves productivas, protegidas y administradas.

## 9. Roadmap de preparación

### Fase A — Decidir stack inicial

**Objetivo:** Confirmar herramientas principales.

**Responsable:** Luis Felipe + ChatGPT + Codex/desarrollador.

**Entregables:**

- Stack elegido.
- Proveedor tentativo de hosting.
- Proveedor tentativo de DB/storage.

**Criterios de salida:**

- Stack aprobado para MVP.
- No hay dudas bloqueantes sobre herramientas principales.

### Fase B — Crear cuentas

**Objetivo:** Tener cuentas base listas.

**Responsable:** Luis Felipe.

**Entregables:**

- GitHub/GitLab.
- Meta Business.
- OpenAI Platform.
- Hosting/DB/storage.
- Dominio si aplica.

**Criterios de salida:**

- Cuentas creadas.
- Método de pago controlado.
- Accesos disponibles para configuración.

### Fase C — Preparar repositorio

**Objetivo:** Crear repositorio de código del MVP.

**Responsable:** Codex/desarrollador.

**Entregables:**

- Repositorio creado.
- README inicial.
- Estructura base.
- `.env.example`.

**Criterios de salida:**

- Repositorio listo para desarrollo.
- No contiene secretos reales.

### Fase D — Preparar ambiente local

**Objetivo:** Permitir desarrollo seguro en computadora local.

**Responsable:** Codex/desarrollador.

**Entregables:**

- Backend local.
- Frontend local.
- DB local o conexión dev.
- Variables `.env` locales.

**Criterios de salida:**

- La app corre localmente.
- No usa credenciales productivas.

### Fase E — Preparar staging

**Objetivo:** Tener laboratorio real para probar APIs.

**Responsable:** DevOps + Codex/desarrollador.

**Entregables:**

- Backend staging.
- Frontend staging.
- DB staging.
- Storage staging.
- Webhook HTTPS.

**Criterios de salida:**

- Staging accesible.
- Webhook disponible.
- Logs básicos funcionando.

### Fase F — Probar WhatsApp real controlado

**Objetivo:** Confirmar que WhatsApp puede enviar eventos y recibir respuestas.

**Responsable:** DevOps + Codex/desarrollador + Luis Felipe.

**Entregables:**

- Número de prueba o controlado.
- Webhook verificado.
- Mensaje entrante registrado.
- Mensaje saliente enviado.

**Criterios de salida:**

- Flujo mínimo WhatsApp probado.
- No hay mensajes duplicados.
- Consumo registrado.

### Fase G — Probar OpenAI controlado

**Objetivo:** Confirmar interpretación básica con límites.

**Responsable:** Codex/desarrollador.

**Entregables:**

- API key configurada en staging.
- Prueba de interpretación.
- Registro de consumo.
- Límite básico.

**Criterios de salida:**

- IA responde dentro de flujo controlado.
- Guardrail básico de consumo activo.

### Fase H — Preparar producción inicial

**Objetivo:** Dejar ambiente listo para piloto real.

**Responsable:** DevOps + Luis Felipe + Codex/desarrollador.

**Entregables:**

- Producción desplegada.
- Dominio/HTTPS.
- DB productiva.
- Storage productivo.
- Variables seguras.
- Backups básicos.

**Criterios de salida:**

- Producción separada de staging.
- Sin secretos en repositorio.
- Monitoreo mínimo activo.

### Fase I — Activar piloto controlado

**Objetivo:** Probar con usuarios reales limitados.

**Responsable:** Luis Felipe + Codex/desarrollador + ChatGPT.

**Entregables:**

- Usuarios enrolados.
- Flujo de compromiso real.
- Evidencia real controlada.
- Reporte básico.
- Registro de consumo.

**Criterios de salida:**

- Piloto demuestra ciclo MVP.
- Costos controlados.
- Errores documentados.

## 10. Rol DevOps

DevOps en este proyecto significa preparar y cuidar el lugar donde vive Gamora.

No es solo “subir la app”. Incluye:

- Ambientes.
- Variables.
- Secretos.
- Deploy.
- Logs.
- Webhooks.
- Dominios.
- HTTPS.
- Backups.
- Monitoreo.
- Separación dev/staging/prod.

### Qué tareas debe cubrir

- Configurar hosting.
- Configurar base de datos.
- Configurar storage.
- Configurar variables y secretos.
- Configurar dominio/HTTPS.
- Verificar webhook.
- Preparar deploy.
- Configurar logs básicos.
- Asegurar separación de ambientes.

### Qué tareas no debe hacer Luis manualmente

- Pegar tokens en código.
- Editar archivos técnicos sin guía.
- Configurar webhooks sin validación.
- Mover datos entre ambientes manualmente.
- Usar producción para pruebas riesgosas.

### Qué puede hacer Codex

- Crear estructura de proyecto.
- Crear documentación técnica.
- Crear `.env.example`.
- Implementar lógica.
- Preparar scripts.
- Ayudar a configurar despliegue.
- Revisar errores.

### Qué requiere criterio humano

- Elegir proveedores.
- Aprobar costos.
- Crear cuentas.
- Manejar métodos de pago.
- Decidir dominio.
- Aprobar producción.
- Dar acceso a cuentas sensibles.

## 11. Decisiones pendientes

- GitHub o GitLab.
- Railway/Render/VPS.
- Supabase vs storage separado.
- WABA central vs WABA por cliente.
- BSP vs Cloud API directa.
- OpenAI modelo inicial.
- Dominio.
- Quién hará DevOps.
- Presupuesto mensual inicial.
- Política de límites para staging y producción.

## 12. Recomendación inicial

Stack recomendado para MVP:

- Repositorio GitHub o GitLab.
- Backend Node.js + TypeScript.
- Frontend Next.js.
- PostgreSQL.
- Prisma.
- Hosting administrado tipo Railway/Render.
- Vercel o mismo proveedor para frontend.
- Storage administrado.
- OpenAI API con presupuesto limitado.
- WhatsApp Business Cloud API.
- Guardrails desde el inicio.

### Razón

Este stack permite construir un MVP real sin operar infraestructura demasiado compleja desde el día uno.

La recomendación busca equilibrio: suficiente seriedad técnica para conectar APIs reales, pero sin cargar al proyecto con DevOps enterprise prematuro.

## 13. Checklist antes de programar

- [ ] Repositorio creado.
- [ ] Cuentas creadas.
- [ ] Ambiente local listo.
- [ ] Proveedor hosting elegido.
- [ ] DB staging lista.
- [ ] Storage staging listo.
- [ ] Dominio/subdominio definido.
- [ ] OpenAI billing con límite.
- [ ] Meta Business configurado.
- [ ] WhatsApp test listo.
- [ ] Variables `.env.example` definidas.
- [ ] Responsable DevOps definido.
- [ ] Política básica de secretos definida.
- [ ] Separación dev/staging/prod acordada.
- [ ] Guardrails mínimos definidos para staging.

## 14. Cierre

Este roadmap debe aprobarse antes de continuar con los prompts de código.

Gamora Bot ya tiene tesis, arquitectura funcional, flujos y modelo técnico. El siguiente paso no debe ser correr a programar sin preparar el terreno. Primero hay que definir cuentas, ambientes, costos, responsables y secretos.

Preparar bien los ambientes evita que el MVP nazca desordenado, caro o inseguro. Con esta base, Codex podrá empezar a generar código con menos improvisación y más control.
