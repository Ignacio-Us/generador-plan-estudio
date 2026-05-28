# API - Generador de Planes de Estudios con Modelos LLM

API REST desarrollada en Node.js y Express que genera planes de estudio semanales estructurados utilizando la inteligencia artificial de OpenRouter (LLM).

## Tecnologías Utilizadas
* **Backend:** Node.js, Express
* **Validación:** Zod
* **Integración LLM:** OpenRouter API (Fetch nativo)
* **Testing:** Cypress (Smoke Tests de API)

## Instalación y Configuración Local

1. **Clonar repositorio:**

```bash
git clone <url>
```

2. **Instalar dependencias:**

```bash
cd generador-plan-estudio
```

```bash
npm install
```

3. **Configurar Variables de Entorno:**

Copiar el archivo de ejemplo y renómbrarlo a `.env`:

```bash
cp .env.example .env
```

Editar el archivo `.env` y añade tu clave real de OpenRouter:

```env
PORT=3000
LLM_API_KEY=tu_clave_aqui
NODE_ENV=development
```

4. **Levantar el servidor:**

```bash
npm run dev
```

## Ejecutar Pruebas de Humo (Cypress)

Con el servidor corriendo en una terminal, abre otra pestaña y ejecuta:

```bash
npx cypress open
```

## Endpoints Principales

### `GET /health`

Verifica el estado del servidor y la configuración de la conexión al LLM (existencia del API key).

### `POST /api/v1/study-plan`

Genera el plan de estudio.
**Payload esperado (JSON):**

```json
{
  "topics": ["Tema 1", "Tema 2"],
  "weeks": 4,
  "weekly_dedication": 10
}
```

## Evidencia de la Ejecucion de Pruebas

Las imagenes se encuentran en el directorio `docs/`

1. **Ejecución prueba de estado del servidor (HTTP 200 OK)**

![estado del servidor](https://github.com/Ignacio-Us/generador-plan-estudio/blob/develop/docs/prueba_salud_estado_servidor.png)

2. **Ejecución prueba solicitud invalida (HTTP 400 Bad Request)**

![bad request](https://github.com/Ignacio-Us/generador-plan-estudio/blob/develop/docs/prueba_solicitud_invalida.png)

3. **Ejecución prueba solicitud valida (HTTP 200 OK)**

![solicitud valida](https://github.com/Ignacio-Us/generador-plan-estudio/blob/develop/docs/vista_general_prueba_response_successful.png)

4. **Ejecución prueba solicitud valida en detalle**

![valida detalle](https://github.com/Ignacio-Us/generador-plan-estudio/blob/develop/docs/prueba_solicitud_valida_detalle.png)

5. **Ejecución prueba de coherencia en detalle**

![coherencia](https://github.com/Ignacio-Us/generador-plan-estudio/blob/develop/docs/prueba_coherencia_detalle.png)