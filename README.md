# accenture-reto-2026

Fila virtual de turnos. El front corre con los turnos de la mañana simulados. El back es el módulo de la fila y sus pruebas: todavía no levanta un servidor HTTP.

## Correr el sistema

Hace falta Node.js. Los comandos se ejecutan desde la raíz del repo, salvo donde se indica `cd frontend`.

### Datos

Pasa `documentation/turnos_hoy.xlsx` a `data/documentation.json`.

```bash
npm install
npm run extract:data
```

### Front

```bash
cd frontend
corepack pnpm install
corepack pnpm dev
```

Vite imprime la URL. Normalmente es http://localhost:5173.

- Cliente: http://localhost:5173/cliente/turno
- Asesor: http://localhost:5173/asesor/login

El asesor entra con `asesor@rowcenture.com` y `Asesor2026*`.

Sin archivo `.env` el front usa datos simulados. Para dejarlo escrito, en `frontend` copia `.env.template` a `.env` y conserva `VITE_USE_MOCKS=true`.

### Pruebas

Back, desde la raíz:

```bash
npx vitest run backend/src/turnos --globals --environment node
```

Front:

```bash
cd frontend
corepack pnpm test:run
```

## Extraer datos de `documentation`

El extractor lee todos los archivos `.xlsx`, `.xls` y `.xlsm` dentro de
`documentation`, transforma cada hoja en registros JSON y genera un resumen
por estado.

```bash
npm install
npm run extract:data
```

La salida queda en `data/documentation.json` con esta estructura:

```json
{
  "summary": {
    "files": 1,
    "sheets": 1,
    "records": 11,
    "byStatus": {
      "atendido": 5,
      "pendiente": 5,
      "cancelado": 1
    }
  },
  "workbooks": [
    {
      "file": "documentation/turnos_hoy.xlsx",
      "sheets": {
        "in": {
          "headers": ["numero", "hora_solicitud", "hora_atencion", "estado"],
          "records": []
        }
      }
    }
  ]
}
```

Para usar los datos desde Node:

```js
import data from "./data/documentation.json" with { type: "json" };

const turnos = data.workbooks[0].sheets.in.records;
const pendientes = turnos.filter(({ estado }) => estado === "pendiente");
```
