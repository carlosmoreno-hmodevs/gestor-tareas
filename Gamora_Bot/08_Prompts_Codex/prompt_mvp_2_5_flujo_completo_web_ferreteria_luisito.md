# Prompt MVP 2.5 — Flujo Completo Web Ferreteria Luisito

## Version
v0.1

## Estatus
Borrador inicial para validacion de Luis Felipe Garcia Duarte

## 1. Nota de uso

Este prompt no debe ejecutarse todavia.

Debe quedar preparado para que Luis Felipe lo use posteriormente cuando autorice MVP 2.5.

## 2. Objetivo del prompt

Este prompt instruira a Codex para ejecutar MVP 2.5 sobre el repositorio tecnico existente:

`C:\Users\Home\Documents\Gamora_Bot_MVP`

MVP 2.5 debe construir y validar el flujo completo web de Ferreteria Luisito, usando las capacidades ya desarrolladas en MVP 2.2, MVP 2.3, MVP 2.4, MVP 2.4.1 y MVP 2.4.2.

El objetivo es comprobar, de punta a punta, que Gamora Bot puede operar un ciclo completo desde web:

1. Empresa configurada.
2. Actor correcto.
3. Compromiso creado.
4. Colaborador acepta o inicia.
5. Colaborador registra evidencia simulada.
6. Admin revisa evidencia.
7. Admin aprueba, pide correccion o rechaza.
8. Detalle e historial quedan trazables.
9. La informacion no se mezcla con otra empresa.

## 3. Contexto que debe conocer Codex

Gamora Bot ya cuenta con:

- MVP 0 — base tecnica.
- MVP 1 — motor inicial de compromisos con PostgreSQL real.
- MVP 2 — interfaz web inicial.
- MVP 2.1 — UX por intencion del usuario.
- MVP 2.2 — configuracion minima operativa.
- MVP 2.3 — creacion guiada de compromisos desde web.
- MVP 2.4 — evidencias simuladas/controladas desde web.
- MVP 2.4.1 — configuracion basica como CRUD de empresas.
- MVP 2.4.2 — actor activo, navegacion por rol, Mi dia simplificado, detalle con tabs y limpieza de datos demo.

MVP 2.5 debe validar el flujo completo web usando Ferreteria Luisito como caso principal.

Principio rector:

“Mas poder con menos friccion.”

## 4. Precondiciones obligatorias

Antes de ejecutar MVP 2.5, Codex debera validar:

- existe el repo `C:\Users\Home\Documents\Gamora_Bot_MVP`;
- `apps/web` existe;
- `apps/api` existe;
- `npm.cmd` funciona;
- backend local responde `GET /health` con `status ok` y `db ok`;
- frontend local compila;
- base PostgreSQL local esta sincronizada;
- MVP 2.4 esta aplicado;
- MVP 2.4.2 esta aplicado;
- Ferreteria Luisito existe;
- Dragon Ball Z existe;
- Super Admin global existe como actor simulado;
- datos de Ferreteria Luisito y Dragon Ball Z estan aislados;
- `.env` esta ignorado por Git;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

Si falta una precondicion critica:

- detenerse;
- reportar claramente;
- no inventar exito.

## 5. Flujo funcional requerido

MVP 2.5 debe validar este flujo:

1. Super Admin confirma empresas.
2. Admin Ferreteria Luisito entra a Mi dia.
3. Admin crea compromiso para colaborador.
4. Colaborador acepta/inicia.
5. Colaborador registra evidencia simulada.
6. Admin revisa evidencia.
7. Admin aprueba, pide correccion o rechaza.
8. Se valida detalle, historial y aislamiento por empresa.

## 6. Actor 1 — Super Admin

El Super Admin debe poder:

- entrar a la vista Empresas;
- ver Ferreteria Luisito;
- ver Dragon Ball Z;
- confirmar que no hay empresas dummy adicionales visibles;
- confirmar que no se mezclan datos entre empresas;
- entrar a Control si aplica.

No debe operar compromisos como usuario principal del flujo.

## 7. Actor 2 — Admin Ferreteria Luisito

El Admin de Ferreteria Luisito debe poder:

- entrar a Mi dia;
- ver solo informacion de Ferreteria Luisito;
- crear compromiso para un colaborador de Ferreteria Luisito;
- seleccionar frente/sucursal de Ferreteria Luisito;
- seleccionar responsable de Ferreteria Luisito;
- revisar evidencias pendientes;
- aprobar, pedir correccion o rechazar;
- consultar detalle e historial.

No debe ver ni operar datos de Dragon Ball Z.

## 8. Actor 3 — Colaborador

El Colaborador debe poder:

- entrar a Mi dia;
- ver solo sus compromisos;
- aceptar o iniciar un compromiso asignado;
- registrar evidencia simulada;
- responder correccion si aplica;
- abrir el detalle del compromiso.

No debe ver Empresas, Control, datos administrativos ni compromisos de otros responsables.

## 9. Compromiso de prueba sugerido

Usar como caso principal:

- Empresa: Ferreteria Luisito.
- Frente/sucursal: Sucursal Sur.
- Responsable: Panchito.
- Descripcion: contar los sacos de cemento recibidos hoy en Sucursal Sur.
- Evidencia esperada: conteo o comentario.
- Prioridad: media.

Evidencia simulada:

- “Panchito reporta que conto 42 sacos de cemento.”

No usar datos personales reales.
No usar telefonos reales.
No conectar WhatsApp.

## 10. Validacion de aislamiento por empresa

MVP 2.5 debe verificar:

- Ferreteria Luisito no muestra compromisos de Dragon Ball Z.
- Dragon Ball Z no muestra compromisos de Ferreteria Luisito.
- Admin empresa solo ve su empresa activa.
- Colaborador solo ve sus compromisos.
- Crear compromiso usa personas y frentes de la empresa activa.
- Revisar evidencias no mezcla empresas.
- Detalle e historial pertenecen al compromiso y empresa correctos.

## 11. Alcance permitido

Codex puede:

- ajustar frontend para cerrar el flujo completo web;
- corregir microcopy;
- ajustar estados vacios;
- mejorar validaciones frontend;
- mejorar flujo entre vistas;
- agregar pruebas si el stack ya lo permite;
- tocar backend solo si hay bug minimo indispensable.

Codex no debe:

- conectar WhatsApp real;
- conectar OpenAI real;
- implementar storage real;
- subir archivos reales;
- implementar login real;
- crear identidad visual final;
- implementar MVP 3;
- modificar documentacion estrategica de Obsidian durante ejecucion;
- hacer refactor masivo.

## 12. Restricciones estrictas

Incluir en la ejecucion:

- No WhatsApp real.
- No OpenAI real.
- No storage real.
- No archivos reales.
- No login real.
- No MVP 3.
- No mostrar `.env`.
- No versionar `.env`.
- No documentar contrasenas.
- No instalar Docker.
- No instalar pnpm.
- No resetear base.
- No borrar datos sin autorizacion.
- No cambiar a SQLite.
- No implementar identidad visual final.
- No implementar Mina Mercedes.
- No implementar Sunworks.

## 13. Validaciones esperadas

Al ejecutar MVP 2.5, Codex debera validar:

- `npm.cmd run build`;
- `npm.cmd run test`;
- `npm.cmd run lint`;
- `GET /health`;
- UI local carga;
- Super Admin ve empresas correctas;
- Admin Ferreteria Luisito ve Mi dia operativo correcto;
- Admin crea compromiso para colaborador;
- Colaborador acepta/inicia;
- Colaborador registra evidencia simulada;
- Admin revisa evidencia;
- Admin aprueba, pide correccion o rechaza;
- detalle muestra Resumen, Evidencia e Historial;
- historial/audit/timeline quedan trazables;
- datos de Dragon Ball Z no aparecen en Ferreteria Luisito;
- datos de Ferreteria Luisito no aparecen en Dragon Ball Z;
- OpenAI sigue apagado;
- WhatsApp sigue apagado;
- `.env` no se muestra ni se versiona.

## 14. Criterios de aceptacion MVP 2.5

MVP 2.5 sera aceptado si:

- el flujo completo web Ferreteria Luisito funciona de punta a punta;
- los actores simulados guian correctamente la experiencia;
- el compromiso se crea, acepta/inicia, recibe evidencia y se revisa;
- el admin puede aprobar, pedir correccion o rechazar;
- el detalle e historial son consultables;
- no hay mezcla de datos entre empresas;
- no se rompe MVP 2.4;
- no se conecta WhatsApp;
- no se conecta OpenAI;
- no se implementa storage real;
- no se suben archivos reales;
- no hay login real;
- no se avanza a MVP 3;
- build/test/lint pasan.

## 15. Resultado esperado de Codex al ejecutar MVP 2.5

Codex debera entregar:

1. Resumen de archivos modificados en el repositorio tecnico.
2. Cambios frontend realizados.
3. Cambios backend realizados, si aplica.
4. Migraciones creadas, si aplica.
5. Validaciones realizadas.
6. Errores o pendientes.
7. Confirmacion de que no conecto OpenAI.
8. Confirmacion de que no conecto WhatsApp.
9. Confirmacion de que no implemento storage real ni archivos reales.
10. Confirmacion de que no implemento login real.
11. Confirmacion de que `.env` no fue mostrado ni versionado.
12. Confirmacion de que no avanzo a MVP 3.
13. Recomendacion del siguiente paso tecnico.

## 16. Cierre

MVP 2.5 debe comprobar que Ferreteria Luisito puede vivir un ciclo web completo dentro de Gamora Bot:

Empresa configurada, compromiso creado, colaborador actuando, evidencia reportada, admin revisando y trazabilidad disponible.

Este paso debe cerrar la validacion web local antes de considerar WhatsApp mock, WhatsApp real, OpenAI real o identidad visual final.
