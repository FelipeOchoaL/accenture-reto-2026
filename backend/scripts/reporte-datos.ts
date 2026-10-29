import { ColaTurnos, cargarTurnosDesdeArchivo } from '../src/turnos';

const carga = cargarTurnosDesdeArchivo(process.argv[2]);
const cola = new ColaTurnos(carga.turnos);

console.log(`\nTurnos válidos: ${carga.turnos.length} | rechazados: ${carga.rechazados.length}`);

if (carga.advertencias.length > 0) {
  console.log('\nAdvertencias:');
  carga.advertencias.forEach((a) => console.log(`  - ${a}`));
}
if (carga.rechazados.length > 0) {
  console.log('\nRechazados:');
  carga.rechazados.forEach((r) =>
    console.log(`  - registro #${r.indice + 1}: ${r.errores.map((e) => `${e.campo}: ${e.mensaje}`).join(' | ')}`),
  );
}

console.log('\nFila (orden en que serán llamados):');
cola.obtenerPendientes().forEach((t, i) => console.log(`  ${i + 1}. turno ${t.numero}  (llegó ${t.hora_solicitud})`));

console.log('\nEstadísticas:', cola.estadisticas(), '\n');
