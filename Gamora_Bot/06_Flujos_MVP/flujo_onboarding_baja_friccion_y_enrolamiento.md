# Flujo Fundacional — Onboarding de Baja Fricción y Enrolamiento de Usuarios

## Versión

v0.1

## Estatus

Borrador inicial para validación

## 1. Objetivo del flujo

Este flujo documenta cómo un nuevo cliente entra a Gamora Bot desde landing page, QR o botón de WhatsApp hasta crear su espacio de trabajo y enrolar usuarios autorizados.

El objetivo es definir la experiencia base de adopción de baja fricción, sin desarrollar todavía la arquitectura técnica detallada ni la integración específica con WhatsApp Business API.

## 2. Principio rector

Gamora Bot debe ofrecer despliegue inmediato con fricción mínima, sin instalación de app móvil adicional, usando WhatsApp como puerta de entrada y web/PWA como capa de configuración y control.

La baja fricción no elimina pasos obligatorios de consentimiento, configuración y confirmación. El objetivo es que esos pasos sean claros, breves y necesarios para operar de forma controlada.

## 3. Actores del flujo

- **Administrador / coordinador inicial:** persona que inicia el uso de Gamora Bot, crea el espacio de trabajo y registra usuarios.
- **Usuario autorizado invitado:** persona invitada a participar en el espacio de trabajo y recibir compromisos operativos.
- **Gamora Bot:** canal formal que guía, estructura, notifica, recibe evidencias y mantiene bitácora.
- **Web/PWA de Gamora:** capa de configuración, administración, revisión, reportes y control.
- **Espacio de trabajo / empresa:** entidad operativa donde se agrupan usuarios, unidades, sucursales, frentes, permisos y compromisos.

## 4. Flujo A — Nuevo cliente desde landing page

1. Prospecto entra a landing page.
2. Escanea QR o presiona botón de WhatsApp.
3. Se abre WhatsApp con número oficial de Gamora Bot.
4. Usuario envía primer mensaje.
5. Gamora detecta número desconocido.
6. Gamora explica propósito.
7. Gamora solicita aceptación de términos, aviso de privacidad y consentimiento para mensajes operativos.
8. Usuario acepta.
9. Gamora envía enlace a web/PWA.
10. Usuario configura empresa/espacio de trabajo.
11. Usuario registra unidades, sucursales o frentes.
12. Usuario queda activo como administrador.
13. Gamora confirma activación en WhatsApp.
14. Gamora sugiere crear primer compromiso o invitar usuarios.

## 5. Flujo B — Usuario recurrente

1. Usuario escribe a Gamora.
2. Gamora detecta número registrado.
3. Gamora identifica empresa o pregunta contexto si tiene más de una.
4. Gamora entra en modo operativo.
5. Usuario puede crear compromiso, consultar pendientes, revisar evidencias o pedir resumen.

## 6. Flujo C — Invitación de usuario autorizado

Ejemplo: Ferretería Luisito.

1. Luisito crea empresa Ferretería Luisito.
2. Configura Tienda Norte y Tienda Sur.
3. Registra a Panchito como encargado de almacén de Tienda Sur.
4. Registra a Rosita como cajera de Tienda Sur.
5. Gamora genera invitaciones únicas.
6. Estado de Panchito y Rosita: invitados / pendientes de aceptación.
7. Gamora no les envía compromisos todavía.
8. Luisito comparte link o QR de invitación.
9. Panchito abre link.
10. Se abre WhatsApp de Gamora con código de invitación.
11. Panchito acepta participar.
12. Gamora registra opt-in y lo activa.
13. Rosita realiza el mismo proceso.
14. Solo después del enrolamiento pueden recibir compromisos por WhatsApp.

## 7. Flujo D — Creación de primer compromiso para usuario enrolado

Ejemplo con Panchito.

1. Luisito escribe a Gamora: “ponle una tarea a Panchito para contar los sacos de cemento que llegaron hoy a la sucursal Sur”.
2. Gamora interpreta el compromiso.
3. Gamora detecta que falta fecha compromiso.
4. Gamora pregunta fecha.
5. Luisito responde.
6. Gamora confirma antes de crear.
7. Luisito confirma.
8. Gamora notifica a Panchito.
9. Panchito acepta.
10. Panchito ejecuta.
11. Panchito envía cantidad y fotos al WhatsApp de Gamora.
12. Gamora asocia evidencia al compromiso.
13. Gamora notifica a Luisito.
14. Luisito revisa y aprueba.
15. Gamora cierra con bitácora.

## 8. Flujo E — Compromiso sensible para Rosita

Ejemplo con corte de caja.

1. Luisito pide a Gamora que Rosita haga corte de caja a las 12.
2. Gamora identifica información sensible.
3. Gamora confirma con Luisito.
4. Gamora notifica a Rosita.
5. Rosita acepta.
6. Rosita envía fotos y archivo de corte.
7. Gamora marca evidencia como sensible.
8. Solo usuarios autorizados pueden verla.
9. Luisito revisa.
10. Luisito aprueba o pide corrección.
11. Gamora registra cierre o corrección.

## 9. Estados de usuario

| Estado | Descripción |
| --- | --- |
| Invitado | El administrador registró a la persona y generó una invitación. |
| Pendiente de aceptación | La invitación existe, pero la persona aún no ha aceptado participar. |
| Activo / enrolado | La persona aceptó participar, confirmó su canal y puede recibir compromisos. |
| WhatsApp desactivado | La persona no recibe mensajes por WhatsApp, pero puede operar por web/PWA si tiene acceso. |
| Suspendido | La persona está bloqueada temporal o permanentemente para operar dentro del espacio de trabajo. |

## 10. Reglas funcionales del enrolamiento

- Nadie recibe compromisos hasta aceptar.
- Todo usuario puede darse de baja.
- El administrador puede registrar usuarios, pero no activar WhatsApp por ellos.
- Gamora debe guardar evidencia de aceptación.
- Gamora debe distinguir invitación de enrolamiento.
- Gamora debe bloquear notificaciones a usuarios sin opt-in.
- Gamora debe permitir operación por web/PWA si WhatsApp está desactivado.

## 11. Restricciones y criterios de diseño

- No vender como WhatsApp interno de empleados.
- No leer chats personales.
- No enviar mensajes sorpresa.
- No usar WhatsApp como único sistema completo.
- Usar WhatsApp como canal operativo principal.
- Usar web/PWA como capa formal.
- Mantener Gamora Core independiente del canal.

## 12. Cierre del flujo

Este flujo define la experiencia base de adopción de Gamora Bot: entrada rápida por WhatsApp, configuración formal por web/PWA y enrolamiento obligatorio de usuarios autorizados.

La intención es reducir la fricción sin ignorar consentimiento, privacidad, opt-in y restricciones operativas. Gamora Bot debe ser fácil de iniciar, pero formal en la manera en que activa usuarios, envía compromisos, recibe evidencias y mantiene trazabilidad.
