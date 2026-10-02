const SPREADSHEET_ID = '1jlYxWBha5-hDvt4BNX4QaDBOA_7NiFOTevQ01plnULE';

// 1. CATÁLOGO COMPLETO DE FIJA (Exactamente tus 41 planes)
let catalogoPlanesFija = [
  // ================= 1 PLAY — Solo Internet fijo =================
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 200.00', precioRegular: 'S/ 200.00', vigencia: 'Permanente' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '1000 Mbps', precioPromo: 'S/ 119.00', precioRegular: 'S/ 145.00', vigencia: '6 meses' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 100.00', precioRegular: 'S/ 100.00', vigencia: 'Permanente' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 69.00', precioRegular: 'S/ 89.00', vigencia: '6 meses' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 79.00', precioRegular: 'S/ 79.00', vigencia: 'Permanente' },
  { servicio: '1 Play', servicioIncluido: 'Internet fijo', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 69.00', precioRegular: 'S/ 69.00', vigencia: 'Permanente' },

  // ================= 2 PLAY — Internet + Telefonía 5000 =================
  { servicio: '2 Play', servicioIncluido: 'Telefonía 5000', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 205.00', precioRegular: 'S/ 205.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Telefonía 5000', plan: '1000 Mbps', precioPromo: 'S/ 150.00', precioRegular: 'S/ 150.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Telefonía 5000', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 105.00', precioRegular: 'S/ 105.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Telefonía 5000', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 74.00', precioRegular: 'S/ 94.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Telefonía 5000', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 64.00', precioRegular: 'S/ 84.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Telefonía 5000', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 74.00', precioRegular: 'S/ 74.00', vigencia: 'Permanente' },

  // ================= 2 PLAY — Internet + TV (Estándar Pro / Superior Pro) =================
  { servicio: '2 Play', servicioIncluido: 'Estándar Pro', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 285.00', precioRegular: 'S/ 285.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Superior Pro', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 255.00', precioRegular: 'S/ 325.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Estándar Pro', plan: '1000 Mbps', precioPromo: 'S/ 159.00', precioRegular: 'S/ 230.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Superior Pro', plan: '1000 Mbps', precioPromo: 'S/ 189.00', precioRegular: 'S/ 270.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Estándar Pro', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 185.00', precioRegular: 'S/ 185.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Superior Pro', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 155.00', precioRegular: 'S/ 225.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Estándar Pro', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 109.00', precioRegular: 'S/ 170.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Superior Pro', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 139.00', precioRegular: 'S/ 210.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Estándar Pro', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 99.00', precioRegular: 'S/ 160.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Superior Pro', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 200.00', precioRegular: 'S/ 200.00', vigencia: 'Permanente' },
  { servicio: '2 Play', servicioIncluido: 'Estándar Pro', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 89.00', precioRegular: 'S/ 150.00', vigencia: '6 meses' },
  { servicio: '2 Play', servicioIncluido: 'Superior Pro', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 119.00', precioRegular: 'S/ 190.00', vigencia: '6 meses' },

  // ================= 3 PLAY — Internet + TV + Telefonía =================
  { servicio: '3 Play', servicioIncluido: 'Estándar Pro', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 290.00', precioRegular: 'S/ 290.00', vigencia: 'Permanente' },
  { servicio: '3 Play', servicioIncluido: 'Superior Pro', plan: '1500 Mbps (Sólo FTTH)', precioPromo: 'S/ 260.00', precioRegular: 'S/ 330.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Estándar Pro', plan: '1000 Mbps', precioPromo: 'S/ 164.00', precioRegular: 'S/ 235.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Superior Pro', plan: '1000 Mbps', precioPromo: 'S/ 194.00', precioRegular: 'S/ 275.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Estándar Pro', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 190.00', precioRegular: 'S/ 190.00', vigencia: 'Permanente' },
  { servicio: '3 Play', servicioIncluido: 'Superior Pro', plan: '800 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 160.00', precioRegular: 'S/ 230.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Estándar Pro', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 114.00', precioRegular: 'S/ 175.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Superior Pro', plan: '400 Mbps (bono a 1000 Mbps x 12 meses)', precioPromo: 'S/ 144.00', precioRegular: 'S/ 215.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Estándar Pro', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 104.00', precioRegular: 'S/ 165.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Superior Pro', plan: '300 Mbps (bono a 600 Mbps x 6 meses)', precioPromo: 'S/ 205.00', precioRegular: 'S/ 205.00', vigencia: 'Permanente' },
  { servicio: '3 Play', servicioIncluido: 'Estándar Pro', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 94.00', precioRegular: 'S/ 155.00', vigencia: '6 meses' },
  { servicio: '3 Play', servicioIncluido: 'Superior Pro', plan: '200 Mbps (bono a 400 Mbps x 6 meses)', precioPromo: 'S/ 124.00', precioRegular: 'S/ 195.00', vigencia: '6 meses' },

  // ================= INTERNET DEDICADO =================
  { servicio: 'Internet Dedicado', servicioIncluido: 'Enlace dedicado simétrico 10 Mbps', plan: 'Internet Dedicado ADI 10', precioPromo: 'Cotizar', precioRegular: 'Cotizar', vigencia: 'Cotizar' },
  { servicio: 'Internet Dedicado', servicioIncluido: 'Enlace dedicado simétrico 20 Mbps', plan: 'Internet Dedicado ADI 20', precioPromo: 'Cotizar', precioRegular: 'Cotizar', vigencia: 'Cotizar' },
  { servicio: 'Internet Dedicado', servicioIncluido: 'Enlace dedicado simétrico 50 Mbps', plan: 'Internet Dedicado ADI 50', precioPromo: 'Cotizar', precioRegular: 'Cotizar', vigencia: 'Cotizar' },
  { servicio: 'Internet Dedicado', servicioIncluido: 'Enlace dedicado simétrico 100 Mbps', plan: 'Internet Dedicado ADI 100', precioPromo: 'Cotizar', precioRegular: 'Cotizar', vigencia: 'Cotizar' },
  { servicio: 'Internet Dedicado', servicioIncluido: 'Enlace dedicado a medida (>100 Mbps)', plan: 'Internet Dedicado ADI a medida', precioPromo: 'Cotizar', precioRegular: 'Cotizar', vigencia: 'Cotizar' }
];

// 2. ASESORES BASE (Para autocompletado y escritura libre)
const ASESORES_BASE = [
  'Correa Estela, Milagros Isabel',
  'Alvarez Rios, Carlos Alberto',
  'Mendoza Quispe, Juan Carlos',
  'Vargas Rojas, Ana Lucia',
  'Castro Sanchez, Pedro Luis'
];

// 3. PLANES MÓVIL BASE
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

// ==================== INICIALIZACIÓN ====================
window.onload = function() {
  // Llenar listas de inmediato (no se queda en blanco nunca)
  poblarDatalistAsesores(ASESORES_BASE);
  poblarDatalistPlanesMovil(catalogoPlanesMovil);
  poblarSelectorServicioFija();

  // Agregar 2 filas en tabla móvil
  agregarFilaLinea();
  agregarFilaLinea();

  // Intentar sincronizar asesores nuevos de Google Sheets en segundo plano
  cargarAsesoresDesdeGoogleSheets();
};

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
  
  // Extrae '1 Play', '2 Play', '3 Play', 'Internet Dedicado'
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

  // Si solo hay una opción (como en 1 Play o Dedicado), autoseleccionar y avanzar
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
async function cargarAsesoresDesdeGoogleSheets() {
  const sync = document.getElementById('syncText');
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=ASESORES`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const text = await res.text();
    const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonStr);

    let lista = [];
    (data.table.rows || []).forEach(r => {
      const val = r.c && r.c[0] ? r.c[0].v : null;
      if (val && String(val).trim() !== '' && String(val).trim().toUpperCase() !== 'ASESOR') {
        lista.push(String(val).trim());
      }
    });

    if (lista.length > 0) {
      poblarDatalistAsesores(lista);
      sync.innerHTML = '✅ <b>Conectado con Google Sheets:</b> Catálogo y Asesores sincronizados en vivo.';
    } else {
      sync.innerHTML = '⚡ <b>Catálogo activo:</b> Planes de Fija y Asesores listos.';
    }
  } catch (err) {
    sync.innerHTML = '⚡ <b>Catálogo activo:</b> 41 Planes de Fija y Asesores listos.';
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
