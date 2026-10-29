# accenture-reto-2026

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
