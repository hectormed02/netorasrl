const SPREADSHEET_ID = '1jlYxWBha5-hDvt4BNX4QaDBOA_7NiFOTevQ01plnULE';

// 1. CATÁLOGOS BASE PRECARGADOS (Garantizan que las listas SIEMPRE carguen al instante)
const ASESORES_BASE = [
  'Correa Estela, Milagros Isabel',
  'Alvarez Rios, Carlos Alberto',
  'Mendoza Quispe, Juan Carlos',
  'Vargas Rojas, Ana Lucia',
  'Castro Sanchez, Pedro Luis'
];

let catalogoPlanesFija = [
  // 1 PLAY - Internet fijo
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 200.00', precioRegular: 'S/ 200.00', vigencia: 'Permanente' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '1000 Mbps', precioPromo: 'S/ 119.00', precioRegular: 'S/ 145.00', vigencia: '6 meses' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 100.00', precioRegular: 'S/ 100.00', vigencia: 'Permanente' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 69.00', precioRegular: 'S/ 89.00', vigencia: '6 meses' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 79.00', precioRegular: 'S/ 79.00', vigencia: 'Permanente' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 69.00', precioRegular: 'S/ 69.00', vigencia: 'Permanente' },
  
  // 2 PLAY - Internet + Telefonía
  { servicio: '2 Play', servicioIncluido: 'Internet + Telefonía', plan: '1000 Mbps + Tel Ilimitado', precioPromo: 'S/ 135.00', precioRegular: 'S/ 160.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Internet + Telefonía', plan: '800 Mbps + Tel Ilimitado', precioPromo: 'S/ 115.00', precioRegular: 'S/ 115.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Internet + Telefonía', plan: '400 Mbps + Tel Ilimitado', precioPromo: 'S/ 85.00', precioRegular: 'S/ 105.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Internet + Telefonía', plan: '300 Mbps + Tel Ilimitado', precioPromo: 'S/ 95.00', precioRegular: 'S/ 95.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Internet + Telefonía', plan: '200 Mbps + Tel Ilimitado', precioPromo: 'S/ 85.00', precioRegular: 'S/ 85.00', vigencia: 'Permanente' },

  // 3 PLAY - Internet + Telefonía + TV
  { servicio: '3 Play', servicioIncluido: 'Internet + Telefonía + TV', plan: '1000 Mbps + TV Superior', precioPromo: 'S/ 195.00', precioRegular: 'S/ 230.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Internet + Telefonía + TV', plan: '800 Mbps + TV Superior', precioPromo: 'S/ 175.00', precioRegular: 'S/ 175.00', vigencia: 'Permanente' },
  { servicio: '3 Play', servicioIncluido: 'Internet + Telefonía + TV', plan: '400 Mbps + TV Avanzado', precioPromo: 'S/ 140.00', precioRegular: 'S/ 165.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Internet + Telefonía + TV', plan: '300 Mbps + TV Avanzado', precioPromo: 'S/ 150.00', precioRegular: 'S/ 150.00', vigencia: 'Permanente' },
  { servicio: '3 Play', servicioIncluido: 'Internet + Telefonía + TV', plan: '200 Mbps + TV Estándar', precioPromo: 'S/ 135.00', precioRegular: 'S/ 135.00', vigencia: 'Permanente' },

  // INTERNET INALÁMBRICO
  { servicio: 'Internet Inalámbrico', servicioIncluido: 'Internet Inalámbrico', plan: 'Inalámbrico 20 Mbps', precioPromo: 'S/ 59.00', precioRegular: 'S/ 69.00', vigencia: 'Permanente' },
  { servicio: 'Internet Inalámbrico', servicioIncluido: 'Internet Inalámbrico', plan: 'Inalámbrico 30 Mbps', precioPromo: 'S/ 69.00', precioRegular: 'S/ 79.00', vigencia: 'Permanente' }
];

let catalogoPlanesMovil = [
  { nombre: 'Max Negocios + 29.90', precio: 'S/ 29.90' },
  { nombre: 'Max Negocios + 39.90', precio: 'S/ 39.90' },
  { nombre: 'Max Negocios + 49.90', precio: 'S/ 49.90' },
  { nombre: 'Max Negocios + 55.90', precio: 'S/ 55.90' },
  { nombre: 'Max Negocios Ilimitado + 69.90', precio: 'S/ 69.90' },
  { nombre: 'Max Negocios Ilimitado + 79.90', precio: 'S/ 79.90' },
  { nombre: 'Max Negocios Ilimitado + 95.90', precio: 'S/ 95.90' },
  { nombre: 'Max Negocios Ilimitado + 109.90', precio: 'S/ 109.90' }
];

let contadorLineas = 0;

window.onload = function() {
  // 1. Inicializar interfaz de inmediato con datos base
  poblarDatalistAsesores(ASESORES_BASE);
  poblarDatalistPlanesMovil(catalogoPlanesMovil);
  poblarSelectorServicioFija();

  // Iniciar con 2 líneas por defecto en la tabla móvil
  agregarFilaLinea();
  agregarFilaLinea();

  // 2. Intentar actualización en segundo plano desde Google Sheets
  cargarDatosDesdeGoogleSheets();
};

// ==================== POBLAR SELECTORES INMEDIATAMENTE ====================
function poblarDatalistAsesores(lista) {
  const datalist = document.getElementById('listaAsesores');
  datalist.innerHTML = '';
  lista.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    datalist.appendChild(opt);
  });
}

function poblarDatalistPlanesMovil(lista) {
  const datalist = document.getElementById('listaPlanesMovil');
  datalist.innerHTML = '';
  lista.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.nombre;
    datalist.appendChild(opt);
  });
}

function poblarSelectorServicioFija() {
  const selServ = document.getElementById('fija_B15');
  selServ.innerHTML = '<option value="">Seleccione Servicio...</option>';
  
  const serviciosUnicos = [...new Set(catalogoPlanesFija.map(p => p.servicio).filter(Boolean))];
  serviciosUnicos.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    selServ.appendChild(opt);
  });
}

// ==================== CASCADA FIJA ====================
function alCambiarServicioFija() {
  const serv = document.getElementById('fija_B15').value;
  const selInc = document.getElementById('fija_B14');
  const selPlan = document.getElementById('fija_B16');

  selInc.innerHTML = '<option value="">Seleccione Servicio Incluido...</option>';
  selPlan.innerHTML = '<option value="">Seleccione Plan...</option>';
  limpiarPreciosFija();

  if (!serv) return;

  const incs = [...new Set(catalogoPlanesFija.filter(p => p.servicio === serv).map(p => p.servicioIncluido).filter(Boolean))];
  incs.forEach(inc => {
    const opt = document.createElement('option');
    opt.value = inc;
    opt.textContent = inc;
    selInc.appendChild(opt);
  });

  // Si solo hay una opción disponible, seleccionarla y avanzar
  if (incs.length === 1) {
    selInc.value = incs[0];
    alCambiarServicioIncluidoFija();
  }
}

function alCambiarServicioIncluidoFija() {
  const serv = document.getElementById('fija_B15').value;
  const servInc = document.getElementById('fija_B14').value;
  const selPlan = document.getElementById('fija_B16');

  selPlan.innerHTML = '<option value="">Seleccione Plan...</option>';
  limpiarPreciosFija();

  if (!serv || !servInc) return;

  const planes = catalogoPlanesFija.filter(p => p.servicio === serv && p.servicioIncluido === servInc);
  planes.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.plan;
    opt.textContent = p.plan;
    selPlan.appendChild(opt);
  });
}

function alCambiarPlanFija() {
  const serv = document.getElementById('fija_B15').value;
  const servInc = document.getElementById('fija_B14').value;
  const plan = document.getElementById('fija_B16').value;

  const enc = catalogoPlanesFija.find(p => p.servicio === serv && p.servicioIncluido === servInc && p.plan === plan);
  if (enc) {
    document.getElementById('fija_B19').value = enc.precioPromo || '';
    document.getElementById('fija_B20').value = enc.precioRegular || '';
    document.getElementById('fija_B18').value = enc.vigencia || '';
  } else {
    limpiarPreciosFija();
  }
}

function limpiarPreciosFija() {
  document.getElementById('fija_B19').value = '';
  document.getElementById('fija_B20').value = '';
  document.getElementById('fija_B18').value = '';
}

// ==================== SINCRONIZACIÓN EN SEGUNDO PLANO ====================
async function cargarDatosDesdeGoogleSheets() {
  const sync = document.getElementById('syncText');
  sync.textContent = '🔄 Verificando actualizaciones con Google Sheets...';

  try {
    await Promise.all([
      actualizarAsesoresOnline(),
      actualizarPlanesFijaOnline(),
      actualizarPlanesMovilOnline()
    ]);
    sync.innerHTML = '✅ <b>Conectado con Google Sheets:</b> Catálogos sincronizados en tiempo real.';
  } catch (err) {
    console.log('Trabajando con catálogo local precargado:', err);
    sync.innerHTML = '⚡ <b>Catálogo activo:</b> Planes y Asesores listos para usar.';
  }
}

async function fetchSheetGViz(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Respuesta no válida');
  const text = await res.text();
  const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(jsonStr);
}

async function actualizarAsesoresOnline() {
  const data = await fetchSheetGViz('ASESORES');
  const rows = data.table.rows || [];
  let listaOnline = [];

  rows.forEach(r => {
    const val = r.c && r.c[0] ? r.c[0].v : null;
    if (val && String(val).trim() !== '' && String(val).trim().toUpperCase() !== 'ASESOR') {
      listaOnline.push(String(val).trim());
    }
  });

  if (listaOnline.length > 0) {
    poblarDatalistAsesores(listaOnline);
  }
}

async function actualizarPlanesFijaOnline() {
  const data = await fetchSheetGViz('DATA FIJA');
  const rows = data.table.rows || [];
  let listaOnline = [];

  rows.forEach((r, idx) => {
    if (idx >= 3 && r.c) {
      const cat = r.c[0] ? String(r.c[0].v).trim() : '';
      const plan = r.c[1] ? String(r.c[1].v).trim() : '';
      const inc = r.c[2] ? String(r.c[2].v).trim() : '';
      const pPromo = r.c[10] ? r.c[10].v : '';
      const vig = r.c[11] ? r.c[11].v : '';
      const pReg = r.c[13] ? r.c[13].v : '';

      if (plan) {
        listaOnline.push({
          servicio: cat,
          servicioIncluido: inc,
          plan: plan,
          precioPromo: pPromo,
          vigencia: vig,
          precioRegular: pReg
        });
      }
    }
  });

  if (listaOnline.length > 0) {
    catalogoPlanesFija = listaOnline;
    poblarSelectorServicioFija();
  }
}

async function actualizarPlanesMovilOnline() {
  const data = await fetchSheetGViz('DATA MOVIL');
  const rows = data.table.rows || [];
  let listaOnline = [];

  rows.forEach((r, idx) => {
    if (idx >= 1 && r.c) {
      const plan = r.c[0] ? String(r.c[0].v).trim() : '';
      const precio = r.c[1] ? r.c[1].v : '';
      if (plan && plan.toUpperCase() !== 'PLAN') {
        listaOnline.push({ nombre: plan, precio: precio });
      }
    }
  });

  if (listaOnline.length > 0) {
    catalogoPlanesMovil = listaOnline;
    poblarDatalistPlanesMovil(catalogoPlanesMovil);
  }
}

// ==================== LÍNEAS MÓVILES DINÁMICAS ====================
function agregarFilaLinea() {
  contadorLineas++;
  const tbody = document.getElementById('tbodyLineas');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${tbody.children.length + 1}</td>
    <td><input type="tel" class="col-linea" maxlength="9" placeholder="9XXXXXXXX" required></td>
    <td><input type="text" class="col-plan" list="listaPlanesMovil" placeholder="Escribe o elige..." required onchange="alElegirPlanMovilLinea(this)"></td>
    <td><input type="number" step="0.01" class="col-cf" placeholder="0.00" oninput="recalcularFila(this)"></td>
    <td><input type="number" class="col-desc" value="0" min="0" max="100" oninput="recalcularFila(this)"></td>
    <td><input type="number" step="0.01" class="col-cffinal readonly-field" readonly placeholder="0.00"></td>
    <td><input type="text" class="col-equipo" value="SOLO CHIP"></td>
    <td><input type="number" step="0.01" class="col-precio" value="0.00"></td>
    <td><button type="button" class="btn-row" onclick="eliminarFila(this)">✖</button></td>
  `;
  tbody.appendChild(tr);
  renumerar();
}

function alElegirPlanMovilLinea(inputElem) {
  const planNombre = inputElem.value;
  const row = inputElem.closest('tr');
  const enc = catalogoPlanesMovil.find(p => p.nombre.toLowerCase() === planNombre.toLowerCase());
  if (enc) {
    const num = parseFloat(String(enc.precio).replace(/[^0-9.]/g, '')) || 0;
    row.querySelector('.col-cf').value = num.toFixed(2);
  }
  recalcularFila(inputElem);
}

function eliminarFila(btn) {
  const tbody = document.getElementById('tbodyLineas');
  if (tbody.children.length > 1) {
    btn.closest('tr').remove();
    renumerar();
  } else {
    alert('Debe haber al menos 1 línea.');
  }
}

function renumerar() {
  document.querySelectorAll('#tbodyLineas tr').forEach((r, idx) => {
    r.children[0].textContent = idx + 1;
  });
  const inputCant = document.getElementById('movil_B15');
  if (inputCant) {
    inputCant.value = document.querySelectorAll('#tbodyLineas tr').length;
  }
}

function recalcularFila(elem) {
  const row = elem.closest('tr');
  const cf = parseFloat(row.querySelector('.col-cf').value) || 0;
  const desc = parseFloat(row.querySelector('.col-desc').value) || 0;
  const final = cf - (cf * (desc / 100));
  row.querySelector('.col-cffinal').value = final > 0 ? final.toFixed(2) : '0.00';
}

function cambiarTab(tabId, ev) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  ev.currentTarget.classList.add('active');
}

function actualizarModoMovil() {
  const subtipo = document.querySelector('input[name="subtipoPlantilla"]:checked').value;
  const btn = document.getElementById('btnMovil');
  const tit = document.getElementById('tituloTablaLineas');
  const tipoOp = document.getElementById('movil_B13');

  if (subtipo === 'PORTABILIDAD') {
    btn.textContent = '💾 DESCARGAR EXCEL (PDV - MOVIL - PORTABILIDAD.xlsx)';
    tit.textContent = 'DETALLE DE LÍNEAS (HOJA PORTABILIDAD)';
    tipoOp.value = 'PORTABILIDAD';
  } else {
    btn.textContent = '💾 DESCARGAR EXCEL (PDV - MOVIL - ALTA NUEVA.xlsx)';
    tit.textContent = 'DETALLE DE LÍNEAS (HOJA ALTA NUEVA)';
    tipoOp.value = 'ALTA NUEVA';
  }
}

// ==================== DESCARGA DIRECTA FIJA ====================
async function descargarFija(e) {
  e.preventDefault();
  const btn = document.getElementById('btnFija');
  const alertBox = document.getElementById('alertaFija');
  btn.disabled = true;
  btn.textContent = '⏳ Llenando plantilla y descargando...';
  alertBox.style.display = 'none';

  try {
    const urlArchivo = './PDV - FIJA.xlsx';
    const response = await fetch(urlArchivo);
    if (!response.ok) throw new Error(`No se pudo cargar "${urlArchivo}". Verifica que esté en la raíz de tu proyecto.`);

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const sheet = workbook.getWorksheet('PDV - FIJA') || workbook.worksheets[0];

    const campos = ['B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B14','B15','B16','B17','B18','B19','B20','B21','B22','B23','B24','B25','B26','B27','B28','B29','B30','B31','B32','B34','B35','B36','B37','B38'];
    campos.forEach(c => {
      const el = document.getElementById('fija_' + c);
      if (el) sheet.getCell(c).value = el.value;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const ruc = document.getElementById('fija_B6').value || 'SIN_RUC';
    saveAs(new Blob([buffer]), `PDV_FIJA_${ruc}.xlsx`);

    alertBox.className = 'alert alert-success';
    alertBox.textContent = `¡Excel descargado exitosamente! (PDV_FIJA_${ruc}.xlsx)`;
    alertBox.style.display = 'block';

  } catch (err) {
    alertBox.className = 'alert alert-error';
    alertBox.textContent = 'Error: ' + err.message;
    alertBox.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '💾 DESCARGAR EXCEL (PDV - FIJA.xlsx)';
  }
}

// ==================== DESCARGA DIRECTA MÓVIL ====================
async function descargarMovil(e) {
  e.preventDefault();
  const btn = document.getElementById('btnMovil');
  const alertBox = document.getElementById('alertaMovil');
  btn.disabled = true;
  btn.textContent = '⏳ Llenando plantilla y descargando...';
  alertBox.style.display = 'none';

  try {
    const subtipo = document.querySelector('input[name="subtipoPlantilla"]:checked').value;
    const nombreArchivoPlantilla = (subtipo === 'PORTABILIDAD') 
      ? 'PDV - MOVIL - PORTABILIDAD.xlsx' 
      : 'PDV - MOVIL - ALTA NUEVA.xlsx';

    const response = await fetch(`./${encodeURIComponent(nombreArchivoPlantilla)}`);
    if (!response.ok) throw new Error(`No se pudo cargar "${nombreArchivoPlantilla}". Verifica que esté en la raíz de tu proyecto.`);

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // 1. Llenar Hoja PDV - MOVIL (B3 a B40)
    const sheetMovil = workbook.getWorksheet('PDV - MOVIL') || workbook.worksheets[0];
    const camposMovil = ['B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','B16','B17','B18','B20','B21','B22','B23','B24','B25','B26','B27','B28','B29','B30','B31','B32','B33','B34','B35','B36','B37','B38','B39','B40'];
    camposMovil.forEach(c => {
      const el = document.getElementById('movil_' + c);
      if (el) sheetMovil.getCell(c).value = el.value;
    });

    // 2. Llenar la segunda hoja (PORTABILIDAD o ALTA NUEVA)
    const nombreSegundaHoja = (subtipo === 'PORTABILIDAD') ? 'PORTABILIDAD' : 'ALTA NUEVA';
    const sheetLineas = workbook.getWorksheet(nombreSegundaHoja) || workbook.worksheets[1];

    if (sheetLineas) {
      const campana = document.getElementById('lineas_E1_campana').value;
      if (campana) sheetLineas.getCell('E1').value = campana;

      let fila = 3;
      document.querySelectorAll('#tbodyLineas tr').forEach(r => {
        const linea = r.querySelector('.col-linea').value.trim();
        if (linea) {
          const cf = parseFloat(r.querySelector('.col-cf').value) || 0;
          const desc = parseFloat(r.querySelector('.col-desc').value) || 0;
          const cfFinal = cf - (cf * (desc / 100));

          sheetLineas.getCell(`B${fila}`).value = linea;
          sheetLineas.getCell(`C${fila}`).value = r.querySelector('.col-plan').value;
          sheetLineas.getCell(`D${fila}`).value = cf;
          sheetLineas.getCell(`E${fila}`).value = desc / 100;
          sheetLineas.getCell(`F${fila}`).value = cfFinal;
          sheetLineas.getCell(`G${fila}`).value = r.querySelector('.col-equipo').value || 'SOLO CHIP';
          sheetLineas.getCell(`H${fila}`).value = parseFloat(r.querySelector('.col-precio').value) || 0;
          fila++;
        }
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const ruc = document.getElementById('movil_B9').value || 'SIN_RUC';
    const nombreSalida = (subtipo === 'PORTABILIDAD') ? `PDV_MOVIL_PORTABILIDAD_${ruc}.xlsx` : `PDV_MOVIL_ALTA_NUEVA_${ruc}.xlsx`;
    saveAs(new Blob([buffer]), nombreSalida);

    alertBox.className = 'alert alert-success';
    alertBox.textContent = `¡Excel descargado exitosamente! (${nombreSalida})`;
    alertBox.style.display = 'block';

  } catch (err) {
    alertBox.className = 'alert alert-error';
    alertBox.textContent = 'Error: ' + err.message;
    alertBox.style.display = 'block';
  } finally {
    btn.disabled = false;
    actualizarModoMovil();
  }
}
