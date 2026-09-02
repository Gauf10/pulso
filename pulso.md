# PROMPT MAESTRO — PULSO MVP

Quiero construir una PWA llamada provisoriamente **Pulso**.

## 1. CONCEPTO

Pulso es una capa de ejecución sobre Google Calendar.

**No es un nuevo calendario.**
**No busca reemplazar Google Calendar.**
**No es inicialmente un gestor de proyectos.**
**No es Notion.**
**No es un sistema complejo de productividad.**

La idea central es:

Yo uso Google Calendar como agenda personal y laboral. Allí pongo reuniones, tareas, actividades personales y familiares. Para este MVP Pulso se conectará únicamente con:

gauf10@gmail.com

La arquitectura debe quedar preparada para agregar posteriormente otras cuentas Google, pero no implementar múltiples cuentas en este MVP.

En esta primera versión, **los movimientos y modificaciones deben ser manuales y confirmados por el usuario**.

---

# 2. OBJETIVO DEL MVP

El MVP debe permitir:

1. Conectar Google Calendar.
2. Conectar dos cuentas Google diferentes.
3. Seleccionar qué calendarios mostrar o mostrar todos.
4. Ver los eventos del día como una lista.
5. Ver claramente hora, título, calendario, duración, descripción, links y ubicación si existen.
6. Marcar un evento como realizado.
7. Marcarlo como no realizado.
8. Mover manualmente un evento a otro día y/o horario.
9. Dividir un evento/tarea en subtareas.
10. Marcar subtareas como realizadas.
11. Registrar duración estimada.
12. Registrar duración real.
13. Permitir una sugerencia automática de duración.
14. Permitir IA opcional para sugerir subtareas.
15. Mostrar al final del día qué quedó pendiente.
16. Permitir decidir qué hacer con cada pendiente:

* mover
* mantener pendiente
* dividir
* descartar de Pulso

17. Mantener historial básico de reprogramaciones.
18. Funcionar perfectamente en mobile como PWA.
19. Tener una interfaz extremadamente simple y rápida.

---

# 3. PRINCIPIO FUNDAMENTAL

Google Calendar sigue siendo la **fuente de verdad de la agenda**.

Pulso agrega una capa propia de ejecución.

### Google Calendar contiene:

* título
* fecha
* hora
* duración
* calendario
* descripción
* ubicación
* links
* invitados
* evento original

### Pulso puede almacenar:

* estado de ejecución
* subtareas
* duración estimada propia
* duración real
* cantidad de reprogramaciones
* historial de movimientos
* sugerencias de IA
* preferencias

No duplicar innecesariamente información de Google Calendar.

---

# 4. STACK

Usar preferentemente:

* React
* TypeScript
* Vite
* Firebase
* Firestore
* Firebase Authentication
* Google OAuth
* Google Calendar API
* PWA

Si el entorno existente del proyecto ya utiliza una tecnología equivalente y funcional, conservarla en lugar de reescribir innecesariamente.

La aplicación debe poder desplegarse fácilmente en:

* Vercel
* Firebase Hosting

Elegir una sola opción para el primer despliegue y documentar cómo cambiarla.

---

# 5. AUTENTICACIÓN

Necesito poder autenticarme con Google.

`gauf10@gmail.com`

La UI debe permitir:

### Cuentas conectadas

* Cuenta personal — conectada
* Cuenta 5SEIS — conectada

Botón:

**+ Conectar otra cuenta**

Cada cuenta puede tener múltiples calendarios.

No asumir que todos los calendarios pertenecen exclusivamente al usuario.

Puede haber:

* calendarios propios
* calendarios compartidos
* calendarios de equipos
* calendarios familiares

Pulso debe poder leerlos si Google concede los permisos correspondientes.

---

# 6. PRIVACIDAD

La aplicación debe pedir únicamente los permisos necesarios.

Explicar claramente al usuario qué acceso solicita Google.

No enviar datos de calendario a ningún servicio externo salvo que el usuario active funciones de IA que lo requieran.

La IA debe ser una función opcional:

### IA: ON / OFF

Cuando está OFF:

* no hacer llamadas a modelos de IA
* no enviar información de eventos a ningún proveedor de IA

Cuando está ON:

* utilizar únicamente los datos necesarios
* nunca modificar automáticamente el calendario
* siempre presentar las sugerencias antes de aplicarlas

No almacenar secretos ni API keys en frontend.

---

# 7. PANTALLA PRINCIPAL

La pantalla principal debe ser:

# HOY

Arriba:

**Hoy — [fecha]**

Controles:

* Hoy
* < día anterior
* > día siguiente

Filtro:

**Todos**
**Personal**
**5SEIS**
**Calendario específico**

Opcionalmente:

**Todos los calendarios**

---

# 8. EVENTOS DEL DÍA

Mostrar los eventos cronológicamente.

Ejemplo:

---

### 09:00

**Gimnasio**

Personal
30 min

[✓ Hecho] [Mover]

---

### 10:30

**Preparar propuesta Aleph**

5SEIS
30 min

3 subtareas

* ☐ Revisar brief
* ☑ Buscar referencias
* ☐ Armar propuesta

[Completar] [Mover] [Dividir]

---

### 15:00

**Reunión con Martín**

5SEIS
60 min

Descripción:
"Hablar sobre Converge..."

Links:

[convergecipe.com]

[Ver detalle]

---

# 9. INFORMACIÓN DEL EVENTO

Al tocar un evento abrir un panel/modal/detalle.

Mostrar:

* título
* fecha
* hora de inicio
* hora de finalización
* duración
* calendario
* cuenta Google de origen
* descripción completa
* links detectados
* ubicación
* invitados, si corresponde
* subtareas
* duración estimada
* duración real
* historial de reprogramaciones

Los links deben ser clickeables.

No perder nunca la descripción original del evento.

---

# 10. MARCAR COMO HECHO

Cada evento debe poder marcarse:

### Pendiente

### En progreso

### Hecho

No complicar más los estados inicialmente.

Cuando se marca como hecho:

Preguntar opcionalmente:

> ¿Cuánto te llevó?

Opciones rápidas:

* 5 min
* 10 min
* 15 min
* 20 min
* 30 min
* 45 min
* 60 min
* 90 min
* Otro

También permitir introducir un valor manual.

Guardar:

`actualDurationMinutes`

No modificar automáticamente la duración del evento original de Google Calendar.

---

# 11. DURACIÓN ESTIMADA

Cada evento puede tener:

`estimatedDurationMinutes`

Si Google Calendar tiene una duración, usarla inicialmente como estimación.

Ejemplo:

Evento 10:00–10:30:

**Estimado: 30 min**

Pero permitir modificarla sin modificar necesariamente el evento original.

Si el usuario cambia:

30 → 60 min

Pulso puede mostrar:

**Estimación Pulso: 60 min**

Google Calendar sigue teniendo 30 min salvo que el usuario decida modificarlo manualmente.

---

# 12. SUGERENCIA DE DURACIÓN

La IA puede sugerir una duración.

Ejemplo:

Evento:

> "Preparar presentación para cliente"

Pulso:

> **Duración sugerida: 90 min**

Opciones:

[Usar 90 min]

[30 min]

[60 min]

[120 min]

[Editar]

La sugerencia debe ser claramente una sugerencia.

Nunca cambiar automáticamente el calendario.

En una primera versión, si todavía no existe suficiente historial del usuario, utilizar una heurística simple.

Por ejemplo:

* título contiene "reunión" → usar duración de Calendar
* "responder", "mensaje", "mail" → 10–20 min
* "preparar", "armar", "crear", "presentación" → 45–90 min
* "investigar" → 30–60 min
* "escribir" → 30–60 min

Estas heurísticas deben estar encapsuladas para poder reemplazarlas posteriormente por IA.

---

# 13. DURACIÓN REAL

Cuando una tarea se completa:

Preguntar opcionalmente:

> ¿Cuánto te llevó realmente?

Guardar:

`actualDurationMinutes`

Mostrar luego:

**Estimado: 30 min**
**Real: 47 min**

No convertir todavía esto en un sistema complejo de tracking.

---

# 14. SUBTAREAS

Cualquier evento puede convertirse en una tarea con subtareas.

Botón:

**+ Subtarea**

Ejemplo:

Evento:

> Preparar presentación

Subtareas:

* ☐ Revisar información
* ☐ Definir estructura
* ☐ Seleccionar referencias
* ☐ Armar slides
* ☐ Revisar
* ☐ Enviar

Cada subtarea debe tener:

* id
* título
* completed
* orden
* duración estimada opcional
* duración real opcional

Permitir:

* crear
* editar
* eliminar
* reordenar
* completar

---

# 15. IA PARA SUBTAREAS

Agregar un botón:

### ✨ Sugerir subtareas

Cuando IA está OFF:

No mostrar la función o mostrarla deshabilitada.

Cuando IA está ON:

Enviar a la IA únicamente la información necesaria:

* título
* descripción
* contexto mínimo disponible

Solicitar una lista de subtareas concretas.

Ejemplo:

Input:

> "Preparar charla para Converge"

Output esperado:

1. Definir objetivo de la charla
2. Armar estructura
3. Seleccionar ejemplos
4. Preparar material
5. Revisar duración
6. Ensayar

Mostrar antes de guardar:

**La IA sugiere:**

☑ Definir objetivo
☑ Armar estructura
☑ Seleccionar ejemplos
☑ Preparar material
☑ Revisar duración
☑ Ensayar

Botones:

**Aceptar seleccionadas**

**Editar**

**Cancelar**

Nunca crear subtareas automáticamente sin confirmación.

---

# 16. MOVER EVENTOS

Botón:

**Mover**

Abrir selector:

### Nueva fecha

### Nuevo horario

Mostrar:

**Actual**
Martes 10:30–11:00

**Nuevo**
Miércoles 15:00–15:30

Botón:

**Confirmar movimiento**

Cuando se confirma:

1. modificar Google Calendar
2. actualizar Pulso
3. registrar historial

No hacer movimientos silenciosos.

---

# 17. HISTORIAL

Cada vez que un evento se mueve, registrar:

* fecha anterior
* hora anterior
* nueva fecha
* nueva hora
* timestamp
* origen del movimiento

Ejemplo:

**Reprogramaciones**

1. Lun 10:00 → Mar 15:00
2. Mar 15:00 → Jue 11:00
3. Jue 11:00 → Vie 10:30

Mostrar:

**Movido 3 veces**

Esto permitirá posteriormente detectar tareas que se están postergando demasiado.

---

# 18. CIERRE DEL DÍA

Agregar una vista:

# CIERRE

Mostrar solamente eventos/tareas no completados.

Ejemplo:

### Te quedaron 3 cosas

**Preparar propuesta**
30 min

→ Mañana
→ Elegir fecha
→ Dividir
→ Dejar pendiente

---

**Responder mail**
10 min

→ Mañana 09:30
→ Elegir fecha

---

**Leer artículo**
30 min

→ Fin de semana
→ Guardar
→ Eliminar de Pulso

---

No mover nada automáticamente.

El usuario decide.

---

# 19. "PENDIENTES QUE SE REPITEN"

Si una tarea/evento fue reprogramado varias veces, mostrar una alerta suave.

Ejemplo:

> Esta tarea fue reprogramada 4 veces.

Opciones:

**Seguir**

**Dividir**

**Eliminar**

**Convertir en idea**

La opción "Convertir en idea" puede existir visualmente pero NO necesita integrarse todavía con ECOS.

Por ahora puede simplemente cambiar el estado a:

`parked`

y dejarlo fuera de la vista principal.

Diseñar el modelo para poder integrar ECOS posteriormente.

---

# 20. NO HACER AUTOMATIZACIONES TODAVÍA

NO implementar todavía:

* movimiento automático de tareas
* planificación automática del día
* calendario propio
* proyectos complejos
* equipos
* colaboración
* chat con IA
* notificaciones complejas
* integración con ECOS
* integración con Telegram
* integración con WhatsApp
* métricas avanzadas
* gamificación
* time tracking permanente
* Pomodoro
* hábitos
* objetivos
* OKRs

Todo eso queda fuera del MVP.

---

# 21. MÉTRICAS BÁSICAS INTERNAS

Aunque no haya todavía una pantalla de métricas, guardar información suficiente para poder calcular posteriormente:

* eventos completados
* eventos reprogramados
* cantidad de reprogramaciones por evento
* duración estimada
* duración real
* diferencia estimado vs real
* tareas con subtareas
* tareas abandonadas/archivadas

Esto será importante para una futura versión.

---

# 22. FUTURA INTELIGENCIA

Diseñar el código para que posteriormente podamos implementar:

### Aprendizaje personal

Ejemplo:

"Preparar presentación"

Estimado por usuario:
30 min

Real promedio:
57 min

Pulso podría sugerir:

> Habitualmente este tipo de tarea te lleva unos 55 min.

---

### Planificación inteligente

Futuro:

> Tengo 5 tareas pendientes y mañana tengo estos espacios libres.

Pulso podría proponer:

10:00–10:30 → Responder mails
11:30–12:30 → Preparar propuesta
16:00–16:10 → Llamar a X

Pero esto NO debe formar parte del MVP.

---

# 23. DISEÑO

Quiero una interfaz:

* minimalista
* limpia
* rápida
* mobile-first
* sin exceso de información
* sin dashboards innecesarios
* sin tarjetas gigantes
* sin estética corporativa
* sin gamificación

Prioridad:

**contenido > decoración**

Usar tipografía clara.

Fondo preferentemente claro.

Inspiración conceptual:

* calendario
* lista
* diario
* herramienta personal

No copiar visualmente ninguna aplicación existente.

---

# 24. NAVEGACIÓN

MVP con muy pocas secciones:

### Hoy

Agenda del día.

### Pendientes

Eventos/tareas pendientes.

### Cierre

Revisión del día.

### Configuración

* cuentas Google
* calendarios
* IA ON/OFF
* preferencias

Nada más.

---

# 25. PWA

Debe:

* instalarse en Android/iOS/desktop
* tener manifest
* icono
* splash apropiado
* funcionar correctamente en mobile
* ser responsive
* permitir navegación rápida

Si no hay conexión:

Mostrar claramente:

> Sin conexión. Los cambios de Google Calendar no pueden sincronizarse ahora.

No inventar sincronización offline compleja en el MVP.

---

# 26. SINCRONIZACIÓN

Google Calendar es externo y puede cambiar independientemente de Pulso.

Implementar:

* carga inicial
* refresh manual
* refresh al volver a abrir la app
* manejo de eventos modificados/eliminados

Si un evento fue eliminado en Google Calendar:

Pulso debe detectarlo y no mostrarlo como activo.

Si fue modificado externamente:

Google Calendar tiene prioridad sobre los datos originales del evento.

Los datos propios de Pulso deben conservarse siempre que sea posible mediante el `googleEventId`.

---

# 27. DUPLICADOS

Como puede haber calendarios compartidos y dos cuentas conectadas, prestar especial atención a duplicados.

Usar:

* account identifier
* calendar ID
* event ID

como identificadores.

No asumir que el título + fecha identifica un evento.

Si el mismo evento aparece desde dos cuentas diferentes, no duplicarlo visualmente si corresponde al mismo recurso de Google.

Si no puede determinarse con seguridad que son el mismo evento, mantenerlos separados.

---

# 28. DATOS / MODELO

Crear una estructura clara.

Ejemplo conceptual:

User

* id
* settings

GoogleAccount

* id
* userId
* email
* provider
* status

Calendar

* id
* googleAccountId
* googleCalendarId
* name
* color
* selected

Task/Event

* id
* userId
* googleAccountId
* googleCalendarId
* googleEventId
* title
* start
* end
* calendarName
* description
* location
* links
* status
* estimatedDurationMinutes
* actualDurationMinutes
* createdAt
* updatedAt

Subtask

* id
* taskId
* title
* completed
* order
* estimatedDurationMinutes
* actualDurationMinutes

RescheduleHistory

* id
* taskId
* previousStart
* previousEnd
* newStart
* newEnd
* createdAt

AISettings

* enabled

La implementación concreta puede adaptarse a Firebase/Firestore.

---

# 29. ERROR HANDLING

La aplicación debe manejar correctamente:

* OAuth cancelado
* permisos insuficientes
* token expirado
* Calendar API temporalmente no disponible
* calendario sin acceso
* evento eliminado
* error al mover evento
* error de IA
* ausencia de conexión

Nunca mostrar errores técnicos crudos al usuario.

Ejemplo:

En lugar de:

`403 calendar.events.update`

mostrar:

> No pudimos mover este evento. Verificá que Pulso tenga acceso a este calendario.

---

# 30. IA: ARQUITECTURA

No colocar la API key de ningún modelo en el frontend.

Crear una capa:

`aiService`

con funciones conceptuales:

* `suggestSubtasks(event)`
* `suggestDuration(event)`
* `analyzeTask(event)`

La implementación puede inicialmente quedar preparada para OpenAI u otro proveedor.

Usar variables de entorno.

Ejemplo conceptual:

`AI_ENABLED=true`

No hardcodear API keys.

La aplicación debe funcionar perfectamente aunque:

`AI_ENABLED=false`

---

# 31. IMPORTANTE: NO SOBREINGENIERIZAR

Este es un MVP personal.

No quiero:

* arquitectura empresarial
* microservicios
* Kubernetes
* sistemas innecesarios
* abstracciones excesivas
* decenas de componentes para una funcionalidad simple

Priorizar:

**simpleza + estabilidad + facilidad para iterar.**

---

# 32. README

Crear README con:

1. descripción
2. stack
3. instalación
4. variables de entorno
5. configuración de Google OAuth
6. configuración de Google Calendar API
7. configuración Firebase
8. configuración IA
9. desarrollo local
10. build
11. deploy
12. problemas conocidos
13. roadmap

Documentar especialmente cómo agregar:

* `gauf10@gmail.com`

y cómo configurar OAuth para múltiples cuentas Google.

---

# 33. CRITERIOS DE ÉXITO DEL MVP

Considerar que el MVP está terminado cuando pueda hacer esta secuencia sin fricción:

1. Abrir Pulso.
2. Conectar `gauf10@gmail.com`.
4. Ver todos mis calendarios.
5. Elegir los que quiero visualizar.
6. Ver mi agenda de hoy.
7. Abrir un evento.
8. Ver descripción y links.
9. Convertirlo en una tarea.
10. Dividirlo en subtareas.
11. Marcar algunas subtareas como hechas.
12. Marcar el evento completo como hecho.
13. Registrar cuánto tardé.
14. Tomar otro evento no realizado.
15. Moverlo manualmente a mañana.
16. Verificar que realmente se haya movido en Google Calendar.
17. Ver el historial de movimiento.
18. Llegar al cierre del día.
19. Ver qué quedó pendiente.
20. Decidir manualmente qué hacer con cada pendiente.

Todo esto debe funcionar correctamente **desde el celular**.

---

# 34. PRINCIPIO DE PRODUCTO

Recordar siempre:

> **Pulso no intenta que haga más cosas.**
>
> **Pulso intenta que no pierda de vista lo que decidí hacer.**

La experiencia debe sentirse como:

**Planifiqué → hice → terminé**

o:

**Planifiqué → no hice → decidí qué hacer con eso**

Nunca:

**Planifiqué → no hice → la aplicación decidió por mí.**

---

# 35. ROADMAP POST-MVP

NO implementar ahora, solamente dejar documentado:

### V1.1

* mejores sugerencias de duración
* aprendizaje de estimaciones
* detección de tareas reprogramadas
* resumen semanal

### V1.2

* planificación inteligente
* detección de sobrecarga
* sugerencias de horarios

### V2

* integración ECOS
* personas
* organizaciones
* oportunidades
* ideas

### V3

* Telegram
* voz
* captura rápida
* "Pulso, agregá esto mañana a las 10"

### Futuro

* análisis de patrones
* planificación personal asistida por IA
* conexión con A diario
* memoria personal de trabajo

---

# 36. FORMA DE TRABAJO

Antes de escribir código:

1. Inspeccionar el proyecto existente.
2. Determinar si ya existe infraestructura Firebase/React reutilizable.
3. No destruir funcionalidades existentes.
4. Proponer brevemente la arquitectura.
5. Crear primero el esqueleto funcional.
6. Implementar autenticación.
7. Implementar lectura de Calendar.
8. Implementar pantalla Hoy.
9. Implementar estados.
10. Implementar movimiento.
11. Implementar subtareas.
12. Implementar duración.
13. Implementar Cierre.
14. Implementar IA opcional.
15. Probar.
16. Documentar.
17. Preparar deploy.

Después de cada bloque importante, comprobar que la aplicación sigue compilando.

No avanzar acumulando errores.

---

# 37. DEFINICIÓN FINAL DEL PRODUCTO

El producto se llama provisoriamente:

# PULSO

Tagline provisional:

> **Tu agenda, llevada a la realidad.**

No considerar el nombre definitivo todavía.

El foco absoluto de esta primera versión es:

> **Abrir Pulso, mirar qué tengo hoy, hacer cosas, marcar lo que terminé y decidir qué hacer con lo que no hice.**

Construir eso primero.

No agregar funcionalidades solamente porque "podrían estar buenas".

Si una funcionalidad no ayuda directamente a ese ciclo, dejarla fuera del MVP.
