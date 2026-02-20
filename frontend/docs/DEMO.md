# Acceso directo a proyectos (demo)

## URL de enfoque en tareas vencidas

Para enlazar directamente a un proyecto y resaltar las tareas vencidas (útil en demos o seguimiento):

```
{BASE_URL}/proyectos/{id}?focus=vencidas
```

El **path** (`/proyectos/{id}`) y el **query** (`?focus=vencidas`) son los mismos en cualquier ambiente; solo cambia la parte del dominio según donde esté desplegada la app:

| Ambiente | Ejemplo de URL completa |
|----------|-------------------------|
| **Local** | `http://localhost:4200/proyectos/bsc-i-02?focus=vencidas` |
| **Pruebas / Staging** | `https://gestor-tareas-pruebas.tudominio.com/proyectos/bsc-i-02?focus=vencidas` |
| **Producción** | `https://tareas.tudominio.com/proyectos/bsc-i-02?focus=vencidas` |

En todos los casos el router de Angular lee la URL del navegador (path + query) y aplica el mismo comportamiento.

### Comportamiento (solo cuando hay más de 0 tareas vencidas)

- **Overview primero**: La página se muestra con el tab **Overview** activo durante ~1 segundo, para que se vea que se ha entrado al proyecto.
- **Cambio a Tareas**: Pasado ese segundo, se cambia automáticamente al tab **Tasks** (Tareas) con filtro "Vencida" y orden "Vencidas primero", de modo que se note que el acceso desde esta URL dirige a las tareas vencidas.
- **Animación**: La tarjeta KPI "Vencidas" hace un pulso de atención varias veces.
- **Orden**: Las tareas se muestran con las **vencidas primero**.
- **Filtrar**: El selector "Filtrar" queda en "Vencida"; puedes cambiarlo a "Todas" u otro estado.

Este comportamiento **solo se aplica** cuando:

1. La URL incluye el parámetro `focus=vencidas`, y  
2. El proyecto tiene al menos una tarea vencida.

Si se entra al mismo proyecto sin el parámetro, o sin tareas vencidas, la vista es la normal (Overview por defecto, sin orden ni filtro especial).

### Nota sobre base href

Si la app en pruebas está servida bajo un subpath (por ejemplo `https://pruebas.com/app/`), la URL quedaría:  
`https://pruebas.com/app/proyectos/bsc-i-02?focus=vencidas`. El parámetro `focus=vencidas` va siempre al final.
