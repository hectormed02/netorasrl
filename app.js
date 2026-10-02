const SPREADSHEET_ID = '1jlYxWBha5-hDvt4BNX4QaDBOA_7NiFOTevQ01plnULE';

let catalogoPlanesFija = [];
let catalogoPlanesMovil = [];
let catalogoUbigeo = {}; // { Dep: { Prov: [Dist, Dist] } }
let contadorLineas = 0;

window.onload = function() {
  agregarFilaLinea();
  agregarFilaLinea();
  cargarDatosDesdeGoogleSheets();
};

// ==================== SINCRONIZACIÓN API GOOGLE SHEETS ====================
async function cargarDatosDesdeGoogleSheets() {
  const sync = document.getElementById('syncText');
  sync.textContent = '🔄 Conectando con Google Sheets para cargar Asesores, Planes y Ubigeo...';

  try {
    await Promise.all([
      actualizarAsesoresOnline(),
      actualizarPlanesFijaOnline(),
      actualizarPlanesMovilOnline(),
      actualizarUbigeoOnline()
    ]);
    sync.innerHTML = '✅ <b>Conectado:</b> Catálogos y Ubigeo sincronizados en tiempo real.';
  } catch (err) {
    console.warn('Error sincronizando Google Sheets:', err);
    sync.innerHTML = '⚠️ <b>Error de red o permisos:</b> Verifica que la hoja sea pública ("Cualquier persona con el enlace").';
  }
}

async function fetchSheetGViz(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al leer ${sheetName}`);
  const text = await res.text();
  const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(jsonStr);
}

// ---------------- Asesores ----------------
async function actualizarAsesoresOnline() {
  const data = await fetchSheetGViz('ASESORES');
  const rows = data.table.rows || [];
  const datalist = document.getElementById('listaAsesores');
  datalist.innerHTML = '';

  rows.forEach(r => {
    const val = r.c && r.c[0] ? r.c[0].v : null;
    if (val && String(val).trim() !== '' && String(val).trim().toUpperCase() !== 'ASESOR') {
      const opt = document.createElement('option');
      opt.value = String(val).trim();
      datalist.appendChild(opt);
    }
  });
}

// ---------------- Planes Fija ----------------
async function actualizarPlanesFijaOnline() {
  const data = await fetchSheetGViz('DATA FIJA');
  const rows = data.table.rows || [];
  catalogoPlanesFija = [];

  rows.forEach((r, idx) => {
    if (idx >= 3 && r.c) {
      const cat = r.c[0] ? String(r.c[0].v).trim() : '';
      const plan = r.c[1] ? String(r.c[1].v).trim() : '';
      const inc = r.c[2] ? String(r.c[2].v).trim() : '';
      const pPromo = r.c[10] ? r.c[10].v : '';
      const vig = r.c[11] ? r.c[11].v : '';
      const pReg = r.c[13] ? r.c[13].v : '';

      if (plan) {
        catalogoPlanesFija.push({
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

  const selServ = document.getElementById('fija_B15');
  selServ.innerHTML = '<option value="">Seleccione Servicio...</option>';
  const unicos = [...new Set(catalogoPlanesFija.map(p => p.servicio).filter(Boolean))];
  unicos.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    selServ.appendChild(opt);
  });
}

// ---------------- Planes Móvil ----------------
async function actualizarPlanesMovilOnline() {
  const data = await fetchSheetGViz('DATA MOVIL');
  const rows = data.table.rows || [];
  catalogoPlanesMovil = [];
  const datalist = document.getElementById('listaPlanesMovil');
  datalist.innerHTML = '';

  rows.forEach((r, idx) => {
    if (idx >= 1 && r.c) {
      const plan = r.c[0] ? String(r.c[0].v).trim() : '';
      const precio = r.c[1] ? r.c[1].v : '';
      if (plan && plan.toUpperCase() !== 'PLAN') {
        catalogoPlanesMovil.push({ nombre: plan, precio: precio });
        const opt = document.createElement('option');
        opt.value = plan;
        datalist.appendChild(opt);
      }
    }
  });
}

// ---------------- UBIGEO DEP_PROV_DIST ----------------
async function actualizarUbigeoOnline() {
  const data = await fetchSheetGViz('DEP_PROV_DIST');
  const rows = data.table.rows || [];
  catalogoUbigeo = {};

  rows.forEach((r, idx) => {
    if (idx >= 1 && r.c) {
      const dep = r.c[0] ? String(r.c[0].v).trim() : '';
      const prov = r.c[1] ? String(r.c[1].v).trim() : '';
      const dist = r.c[2] ? String(r.c[2].v).trim() : '';

      if (dep && prov && dist) {
        if (!catalogoUbigeo[dep]) catalogoUbigeo[dep] = {};
        if (!catalogoUbigeo[dep][prov]) catalogoUbigeo[dep][prov] = [];
        if (!catalogoUbigeo[dep][prov].includes(dist)) catalogoUbigeo[dep][prov].push(dist);
      }
    }
  });

  const deps = Object.keys(catalogoUbigeo).sort();
  const selDepFija = document.getElementById('fija_B25');
  const selDepMovil = document.getElementById('movil_B29');
  
  selDepFija.innerHTML = '<option value="">Seleccione Departamento...</option>';
  selDepMovil.innerHTML = '<option value="">Seleccione Departamento...</option>';

  deps.forEach(d => {
    const opt1 = document.createElement('option'); opt1.value = d; opt1.textContent = d;
    const opt2 = document.createElement('option'); opt2.value = d; opt2.textContent = d;
    selDepFija.appendChild(opt1);
    selDepMovil.appendChild(opt2);
  });
}

// ==================== CASCADA UBIGEO ====================
function actualizarProvincias(pestaña) {
  let idDep = pestaña === 'fija' ? 'fija_B25' : 'movil_B29';
  let idProv = pestaña === 'fija' ? 'fija_B26' : 'movil_B30';
  let idDist = pestaña === 'fija' ? 'fija_B27' : 'movil_B31';

  const dep = document.getElementById(idDep).value;
  const selProv = document.getElementById(idProv);
  const selDist = document.getElementById(idDist);
  
  selProv.innerHTML = '<option value="">Seleccione Provincia...</option>';
  selDist.innerHTML = '<option value="">Seleccione Distrito...</option>';

  if (catalogoUbigeo[dep]) {
    Object.keys(catalogoUbigeo[dep]).sort().forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      selProv.appendChild(opt);
    });
  }
}

function actualizarDistritos(pestaña) {
  let idDep = pestaña === 'fija' ? 'fija_B25' : 'movil_B29';
  let idProv = pestaña === 'fija' ? 'fija_B26' : 'movil_B30';
  let idDist = pestaña === 'fija' ? 'fija_B27' : 'movil_B31';

  const dep = document.getElementById(idDep).value;
  const prov = document.getElementById(idProv).value;
  const selDist = document.getElementById(idDist);
  
  selDist.innerHTML = '<option value="">Seleccione Distrito...</option>';

  if (catalogoUbigeo[dep] && catalogoUbigeo[dep][prov]) {
    catalogoUbigeo[dep][prov].sort().forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      selDist.appendChild(opt);
    });
  }
}

// ==================== CASCADA PLANES FIJA ====================
function alCambiarServicioFija() {
  const serv = document.getElementById('fija_B15').value;
  const selInc = document.getElementById('fija_B14');
  const selPlan = document.getElementById('fija_B16');

  selInc.innerHTML = '<option value="">Seleccione Servicio Incluido...</option>';
  selPlan.innerHTML = '<option value="">Seleccione Plan...</option>';
  document.getElementById('fija_B19').value = '';
  document.getElementById('fija_B20').value = '';
  document.getElementById('fija_B18').value = '';

  if (!serv) return;

  const incs = [...new Set(catalogoPlanesFija.filter(p => p.servicio === serv).map(p => p.servicioIncluido).filter(Boolean))];
  incs.forEach(inc => {
    const opt = document.createElement('option');
    opt.value = inc;
    opt.textContent = inc;
    selInc.appendChild(opt);
  });
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
  document.getElementById('fija_B19').value = '';
  document.getElementById('fija_B20').value = '';
  document.getElementById('fija_B18').value = '';

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
    document.getElementById('fija_B19').value = '';
    document.getElementById('fija_B20').value = '';
    document.getElementById('fija_B18').value = '';
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

// ==================== DESCARGA FIJA ====================
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
    if (!response.ok) throw new Error(`Error leyendo ${urlArchivo}`);

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

// ==================== DESCARGA MÓVIL ====================
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
    if (!response.ok) throw new Error(`Error leyendo ${nombreArchivoPlantilla}`);

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // Hoja PDV - MOVIL
    const sheetMovil = workbook.getWorksheet('PDV - MOVIL') || workbook.worksheets[0];
    const camposMovil = ['B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','B16','B17','B18','B20','B21','B22','B23','B24','B25','B26','B27','B28','B29','B30','B31','B32','B33','B34','B35','B36','B37','B38','B39','B40'];
    camposMovil.forEach(c => {
      const el = document.getElementById('movil_' + c);
      if (el) sheetMovil.getCell(c).value = el.value;
    });

    // Hoja PORTABILIDAD o ALTA NUEVA
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
