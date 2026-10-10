/* Fichas PDV · NETORA — frontend estático (GitHub + Vercel)
 * Habla con la Aplicación web de Apps Script definida en config.js
 */
(function () {
  'use strict';

  const API = (window.NETORA_CONFIG || {}).API_URL;
  const $ = (s, el = document) => el.querySelector(s);
  const norm = s => String(s == null ? '' : s).trim().toUpperCase();
  const soles = n => 'S/ ' + (Number(n) || 0).toFixed(2);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = v => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? 0 : (n > 1 ? n / 100 : n); };

  // ---------- almacenamiento local (borradores, clave, historial) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('netora_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('netora_' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
    del(k) { try { localStorage.removeItem('netora_' + k); } catch (e) { /* */ } }
  };

  // ---------- estado ----------
  let CFG = null;
  let producto = store.get('producto', 'FIJA');
  let datos = store.get('borrador', { FIJA: {}, MOVIL: {} });
  let lineas = store.get('lineas', { Portabilidad: [], 'Alta Nueva': [] });
  let campania = store.get('campania', '');
  const guardar = () => { store.set('borrador', datos); store.set('lineas', lineas); store.set('campania', campania); store.set('producto', producto); };

  // ---------- API ----------
  async function apiGet(params) {
    const url = API + '?' + new URLSearchParams(params).toString();
    const r = await fetch(url, { redirect: 'follow' });
    return r.json();
  }
  async function apiPost(body) {
    const r = await fetch(API, {
      method: 'POST', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS
      body: JSON.stringify(body)
    });
    return r.json();
  }

  // ---------- inicio ----------
  async function iniciar() {
    if (!API || API.includes('PEGA_AQUI')) {
      mostrarLogin('Falta configurar API_URL en config.js');
      return;
    }
    const clave = store.get('clave', '');
    if (!clave) { mostrarLogin(''); return; }
    $('#app').classList.remove('oculto');
    $('#login').classList.add('oculto');
    try {
      const r = await apiGet({ action: 'config', clave });
      if (!r.ok) {
        if (r.error === 'CLAVE_INVALIDA') { store.del('clave'); mostrarLogin('Clave incorrecta.'); return; }
        throw new Error(r.error);
      }
      CFG = r;
      $('#cargando').classList.add('oculto');
      cambiarProducto(producto);
      pintarHistorial();
    } catch (e) {
      $('#cargando').innerHTML = 'No se pudo cargar la ficha: ' + esc(e.message) + ' <button class="link" onclick="location.reload()">Reintentar</button>';
    }
  }

  function mostrarLogin(msg) {
    $('#app').classList.add('oculto');
    $('#login').classList.remove('oculto');
    $('#loginError').textContent = msg || '';
    $('#clave').focus();
  }

  $('#formLogin').addEventListener('submit', e => {
    e.preventDefault();
    store.set('clave', $('#clave').value.trim());
    $('#cargando').classList.remove('oculto');
    iniciar();
  });
  $('#btnSalir').onclick = () => { store.del('clave'); location.reload(); };

  // ---------- tabs ----------
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => cambiarProducto(t.dataset.p));
  function cambiarProducto(p) {
    producto = p; guardar();
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('activo', t.dataset.p === p));
    pintarFormulario();
  }

  $('#btnNueva').onclick = () => confirmar('Nueva venta', '¿Borrar los datos de la ficha ' + (producto === 'FIJA' ? 'FIJA' : 'MÓVIL') + '? (se mantiene el asesor)', [
    { txt: 'Cancelar' },
    { txt: 'Borrar', principal: true, fn: () => limpiar() }
  ]);

  function limpiar() {
    const defs = CFG.formularios[producto];
    const asesor = defs.find(d => /^(ASESOR|FFVV)$/.test(norm(d.label)));
    const conservar = asesor ? { [asesor.fila]: datos[producto][asesor.fila] } : {};
    datos[producto] = conservar;
    if (producto === 'MOVIL') { lineas = { Portabilidad: [], 'Alta Nueva': [] }; campania = ''; }
    guardar(); pintarFormulario();
  }

  // ---------- helpers de campos ----------
  const defsDe = p => CFG.formularios[p];
  const campoPor = (p, etiqueta) => defsDe(p).find(d => norm(d.label) === norm(etiqueta));
  const valor = (p, etiqueta) => { const d = campoPor(p, etiqueta); return d ? (datos[p][d.fila] || '') : ''; };
  const esReq = (p, label) => (CFG.requeridos[p] || []).some(r => norm(r) === norm(label));

  function tipoMovil() {
    const v = norm(valor('MOVIL', 'TIPO OPERACIÓN'));
    if (v.includes('PORTA')) return 'Portabilidad';
    if (v.includes('ALTA') || v.includes('NUEVA')) return 'Alta Nueva';
    return '';
  }

  // ---------- formulario ----------
  function pintarFormulario() {
    const form = $('#ficha');
    const defs = defsDe(producto);
    const vals = datos[producto];

    // valores por defecto de la hoja (p.ej. Servicio Incluido = Internet fijo) y último asesor
    defs.forEach(d => {
      if (vals[d.fila] === undefined && d.valor && d.tipo === 'lista') vals[d.fila] = d.valor;
      if (/^(ASESOR|FFVV)$/.test(norm(d.label)) && !vals[d.fila]) vals[d.fila] = store.get('asesor', '');
    });

    let html = '', abierta = false;
    const abrir = t => { if (abierta) html += '</div></section>'; html += '<section class="card"><h2>' + esc(t) + '</h2><div class="grid">'; abierta = true; };
    abrir(producto === 'FIJA' ? 'Datos de la venta' : 'Datos de la venta');

    defs.forEach(d => {
      if (d.tipo === 'seccion') { abrir(d.label); return; }
      html += campoHTML(d);
    });
    if (abierta) html += '</div></section>';
    if (producto === 'MOVIL') html += lineasHTML();
    form.innerHTML = html;

    // eventos
    form.querySelectorAll('[data-fila]').forEach(el => {
      const ev = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, () => {
        datos[producto][el.dataset.fila] = el.value;
        el.classList.remove('invalido');
        limpiarDependientes(+el.dataset.fila);
        if (/^(ASESOR|FFVV)$/.test(norm(el.dataset.label))) store.set('asesor', el.value);
        guardar();
        if (el.dataset.refresca) pintarFormulario();
        else actualizarCalculos();
        const L = norm(el.dataset.label);
        const num = el.value.replace(/\D/g, '');
        if (L === 'RUC' && num.length === 11) buscarRuc(+el.dataset.fila, num);
        if (L === 'DNI' && num.length === 8) buscarDni(+el.dataset.fila, num);
      });
    });
    form.querySelectorAll('.seg').forEach(b => b.onclick = () => {
      const d = campoPor('MOVIL', 'TIPO OPERACIÓN');
      datos.MOVIL[d.fila] = b.dataset.v; guardar(); pintarFormulario();
    });
    if (producto === 'MOVIL') enlazarLineas();
    actualizarCalculos();
  }

  function campoHTML(d) {
    const v = datos[producto][d.fila] || '';
    const L = norm(d.label);
    const req = esReq(producto, d.label) ? ' <span class="req">*</span>' : '';
    const lab = '<label for="f' + d.fila + '">' + esc(d.label) + req + '</label>';
    const base = 'id="f' + d.fila + '" data-fila="' + d.fila + '" data-label="' + esc(d.label) + '"';
    let ancho = /OBSERVACIONES|COMENTARIOS|DIRECCION|REFERENCIA|COORDENADAS/.test(L);

    // Tipo de operación MÓVIL → selector grande
    if (producto === 'MOVIL' && L === 'TIPO OPERACIÓN') {
      const t = tipoMovil();
      return '<div class="campo ancho">' + lab + '<div class="segmento">' +
        segBtn('PORTABILIDAD', 'Portabilidad', 'Traer líneas de otro operador', t === 'Portabilidad') +
        segBtn('ALTA NUEVA', 'Alta Nueva', 'Líneas nuevas Claro', t === 'Alta Nueva') + '</div></div>';
    }

    if (d.tipo === 'calc') {
      return '<div class="campo">' + '<label>' + esc(d.label) + '</label><div class="calc" data-calc="' + esc(L) + '">—</div></div>';
    }

    if (d.tipo === 'lista' || d.tipo === 'ubigeo') {
      let ops = d.opciones || [];
      let refresca = false;
      if (d.tipo === 'ubigeo') { ops = opcionesUbigeo(d); refresca = true; }
      if (producto === 'FIJA' && L === 'PLAN') ops = planesFiltrados(ops);
      if (producto === 'FIJA' && (L === 'SERVICIO' || L === 'SERVICIO INCLUIDO')) refresca = true;
      if (v && ops.indexOf(v) < 0) ops = [v].concat(ops);
      return '<div class="campo' + (ancho ? ' ancho' : '') + '">' + lab + '<select ' + base + (refresca ? ' data-refresca="1"' : '') + '>' +
        '<option value="">Seleccionar…</option>' +
        ops.map(o => '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select></div>';
    }

    if (d.tipo === 'sugerido') {
      return '<div class="campo">' + lab + '<input ' + base + ' list="dl' + d.fila + '" value="' + esc(v) + '" autocomplete="off">' +
        '<datalist id="dl' + d.fila + '">' + d.opciones.map(o => '<option value="' + esc(o) + '">').join('') + '</datalist></div>';
    }

    // texto
    if (/OBSERVACIONES|COMENTARIOS/.test(L)) {
      return '<div class="campo ancho">' + lab + '<textarea ' + base + '>' + esc(v) + '</textarea></div>';
    }
    let attrs = ' type="text"';
    if (L === 'RUC') attrs = ' inputmode="numeric" maxlength="11" pattern="\\d{11}" placeholder="11 dígitos"';
    else if (L === 'DNI') attrs = ' inputmode="numeric" maxlength="12"';
    else if (/TELEFONO/.test(L)) attrs = ' type="tel" inputmode="tel" maxlength="12"';
    else if (L === 'CORREO') attrs = ' type="email"';
    else if (/CANTIDAD/.test(L)) attrs = ' inputmode="numeric"';
    const consulta = (L === 'RUC' || L === 'DNI') ? '<small class="consulta" data-consulta="' + d.fila + '"></small>' : '';
    if (L === 'DNI') attrs = ' inputmode="numeric" maxlength="8" placeholder="8 dígitos"';
    return '<div class="campo' + (ancho ? ' ancho' : '') + '">' + lab + '<input ' + base + attrs + ' value="' + esc(v) + '">' + consulta + '</div>';
  }

  // Al cambiar Departamento/Provincia o Servicio, borra lo que dependía de ellos
  function limpiarDependientes(fila) {
    const defs = defsDe(producto);
    const idx = defs.findIndex(x => x.fila === fila);
    const d = defs[idx];
    if (d.tipo === 'ubigeo') {
      for (let j = idx + 1; j < defs.length; j++) {
        const x = defs[j];
        if (x.tipo !== 'ubigeo') continue;
        if (x.nivel <= d.nivel) break;
        delete datos[producto][x.fila];
      }
    }
    if (producto === 'FIJA' && /^SERVICIO( INCLUIDO)?$/.test(norm(d.label))) {
      const plan = campoPor('FIJA', 'PLAN');
      if (plan && planesFiltrados([]).indexOf(datos.FIJA[plan.fila]) < 0) delete datos.FIJA[plan.fila];
    }
  }

  // ---------- Consulta SUNAT (RUC) y RENIEC (DNI) ----------
  const consultando = {};
  function estadoConsulta(fila, html, tipo) {
    const el = document.querySelector('[data-consulta="' + fila + '"]');
    if (el) { el.innerHTML = html; el.className = 'consulta ' + (tipo || ''); }
  }
  // Escribe un valor en un campo de la ficha (estado + pantalla).
  // soloSiVacio: no pisa lo que el asesor ya escribió a mano.
  function poner(fila, valorNuevo, soloSiVacio) {
    if (!fila || !valorNuevo) return false;
    const actual = String(datos[producto][fila] || '').trim();
    const auto = (store.get('auto', {}))[producto + fila];
    if (soloSiVacio && actual && actual !== auto) return false;
    datos[producto][fila] = valorNuevo;
    const a = store.get('auto', {}); a[producto + fila] = valorNuevo; store.set('auto', a);
    const el = document.getElementById('f' + fila);
    if (el) { el.value = valorNuevo; el.classList.remove('invalido'); el.classList.add('autollenado'); setTimeout(() => el.classList.remove('autollenado'), 1500); }
    return true;
  }

  async function buscarRuc(fila, ruc) {
    const k = 'ruc' + ruc; if (consultando[k]) return; consultando[k] = true;
    estadoConsulta(fila, '<span class="spin"></span> Consultando SUNAT…');
    try {
      const r = await apiGet({ action: 'ruc', numero: ruc, clave: store.get('clave', '') });
      if (!r.ok) throw new Error(r.error);
      if (!r.encontrado) { estadoConsulta(fila, 'RUC no encontrado en SUNAT', 'err'); return; }
      const f = l => (campoPor(producto, l) || {}).fila;
      poner(f('RAZON SOCIAL'), r.razonSocial, false);
      poner(f('DIRECCION FISCAL'), r.direccionCompleta || r.direccion, true);
      poner(f('DIRECCION DE FACTURACION'), r.direccionCompleta || r.direccion, true);
      guardar();
      const okEstado = /ACTIVO/i.test(r.estado), okCond = /^HABIDO/i.test(r.condicion);
      const txt = '✓ ' + esc(r.razonSocial) + ' · ' + esc(r.estado || '¿?') + ' · ' + esc(r.condicion || '¿?');
      estadoConsulta(fila, txt + (okEstado && okCond ? '' : '<br>⚠️ Revisa: el cliente no está ACTIVO / HABIDO'), okEstado && okCond ? 'ok' : 'warn');
    } catch (e) {
      estadoConsulta(fila, 'No se pudo consultar: ' + esc(e.message), 'err');
    } finally { consultando[k] = false; }
  }

  async function buscarDni(fila, dni) {
    const k = 'dni' + dni + fila; if (consultando[k]) return; consultando[k] = true;
    estadoConsulta(fila, '<span class="spin"></span> Consultando RENIEC…');
    try {
      const r = await apiGet({ action: 'dni', numero: dni, clave: store.get('clave', '') });
      if (!r.ok) throw new Error(r.error);
      if (!r.encontrado) { estadoConsulta(fila, 'DNI no encontrado', 'err'); return; }
      // El nombre va en el campo de persona más cercano ANTES del DNI (Representante legal / Contacto)
      const defs = defsDe(producto);
      const idx = defs.findIndex(d => d.fila === fila);
      let destino = null;
      for (let j = idx - 1; j >= 0 && j >= idx - 4; j--) {
        const L = norm(defs[j].label);
        if (defs[j].tipo === 'texto' && /REPRESENTANTE|CONTACTO|NOMBRE|TITULAR/.test(L)) { destino = defs[j]; break; }
      }
      if (destino) poner(destino.fila, r.nombreCompleto, false);
      guardar();
      estadoConsulta(fila, '✓ ' + esc(r.nombreCompleto) + (destino ? ' → ' + esc(destino.label.toLowerCase()) : ''), 'ok');
    } catch (e) {
      estadoConsulta(fila, 'No se pudo consultar: ' + esc(e.message), 'err');
    } finally { consultando[k] = false; }
  }

  const segBtn = (v, t, s, sel) => '<button type="button" class="seg' + (sel ? ' sel' : '') + '" data-v="' + v + '"><b>' + t + '</b><small>' + s + '</small></button>';

  // Ubigeo en cascada: usa el departamento/provincia anterior más cercano
  function opcionesUbigeo(d) {
    const defs = defsDe(producto);
    const idx = defs.indexOf(d);
    const previo = nivel => { for (let i = idx - 1; i >= 0; i--) if (defs[i].tipo === 'ubigeo' && defs[i].nivel === nivel) return datos[producto][defs[i].fila] || ''; return ''; };
    const U = CFG.ubigeo;
    let ops;
    if (d.nivel === 0) ops = U.map(r => r[0]);
    else if (d.nivel === 1) { const dep = previo(0); ops = U.filter(r => !dep || r[0] === dep).map(r => r[1]); }
    else { const dep = previo(0), prov = previo(1); ops = U.filter(r => (!dep || r[0] === dep) && (!prov || r[1] === prov)).map(r => r[2]); }
    return [...new Set(ops)].sort((a, b) => a.localeCompare(b, 'es'));
  }

  function planesFiltrados(todos) {
    const serv = valor('FIJA', 'SERVICIO'), inc = valor('FIJA', 'SERVICIO INCLUIDO');
    let f = CFG.planesFija.filter(p => (!serv || p.cat === serv) && (!inc || p.inc === inc));
    if (!f.length) f = CFG.planesFija.filter(p => !serv || p.cat === serv);
    const lista = [...new Set(f.map(p => p.plan))];
    return lista.length ? lista : todos;
  }

  function planFija() {
    const serv = valor('FIJA', 'SERVICIO'), inc = valor('FIJA', 'SERVICIO INCLUIDO'), plan = valor('FIJA', 'PLAN');
    if (!plan) return null;
    return CFG.planesFija.find(p => p.plan === plan && (!serv || p.cat === serv) && (!inc || p.inc === inc))
        || CFG.planesFija.find(p => p.plan === plan && (!serv || p.cat === serv))
        || CFG.planesFija.find(p => p.plan === plan) || null;
  }

  // ---------- líneas móviles ----------
  function lineasHTML() {
    const t = tipoMovil();
    if (!t) return '<section class="card"><h2>Líneas</h2><p style="color:var(--gris);margin:0">Elige <b>Portabilidad</b> o <b>Alta Nueva</b> para cargar las líneas.</p></section>';
    const max = CFG.detalle[t].max;
    const ls = lineas[t];
    if (!ls.length) ls.push({});
    const planes = CFG.planesMovil.map(p => p.plan);
    const descs = CFG.descuentos.length ? CFG.descuentos : ['0%'];
    const filas = ls.map((l, i) => '<tr data-i="' + i + '">' +
      '<td>' + (i + 1) + '</td>' +
      '<td><input data-k="linea" value="' + esc(l.linea || '') + '" inputmode="tel" placeholder="' + (t === 'Portabilidad' ? 'N° a portar' : 'Opcional') + '"></td>' +
      '<td><select data-k="plan"><option value="">Plan…</option>' + planes.map(p => '<option' + (p === l.plan ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select></td>' +
      '<td class="num" data-cf>—</td>' +
      '<td><select data-k="descuento">' + descs.map(p => '<option' + (p === (l.descuento || descs[0]) ? ' selected' : '') + '>' + esc(p) + '</option>').join('') + '</select></td>' +
      '<td class="num" data-cff>—</td>' +
      '<td><input data-k="equipo" value="' + esc(l.equipo || '') + '" placeholder="Equipo"></td>' +
      '<td><input data-k="precio" value="' + esc(l.precio || '') + '" inputmode="decimal" placeholder="0.00" style="width:90px"></td>' +
      '<td><button type="button" class="quitar" title="Quitar línea" data-quitar>&times;</button></td></tr>').join('');

    return '<section class="card" id="cardLineas"><h2>Líneas · ' + t + ' (máx. ' + max + ')</h2>' +
      '<div class="lineas-top"><div class="campo"><label for="campania">Campaña</label><input id="campania" value="' + esc(campania) + '"></div></div>' +
      '<div class="tabla-wrap"><table><thead><tr><th>#</th><th>Línea</th><th>Plan</th><th>CF</th><th>% Desc.</th><th>CF Final</th><th>Equipo</th><th>Precio</th><th></th></tr></thead>' +
      '<tbody>' + filas + '</tbody><tfoot><tr><td colspan="5" id="totLineas"></td><td class="num" id="totCF"></td><td colspan="3"></td></tr></tfoot></table></div>' +
      '<div class="acciones-lineas">' +
      '<button type="button" class="btn-sec" id="addLinea"' + (ls.length >= max ? ' disabled' : '') + '>+ Agregar línea</button>' +
      '<button type="button" class="btn-sec" id="pegarLineas">Pegar varios números</button>' +
      '<button type="button" class="btn-sec" id="copiarPlan">Copiar plan/desc. de la 1ª a todas</button>' +
      '</div></section>';
  }

  function enlazarLineas() {
    const t = tipoMovil(); if (!t) return;
    const card = $('#cardLineas');
    $('#campania').oninput = e => { campania = e.target.value; guardar(); };
    card.querySelectorAll('tbody tr').forEach(tr => {
      const i = +tr.dataset.i;
      tr.querySelectorAll('[data-k]').forEach(el => {
        el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
          lineas[t][i][el.dataset.k] = el.value; guardar(); actualizarCalculos();
        });
      });
      tr.querySelector('[data-quitar]').onclick = () => { lineas[t].splice(i, 1); guardar(); pintarFormulario(); };
    });
    $('#addLinea').onclick = () => { lineas[t].push({ plan: (lineas[t][0] || {}).plan || '', descuento: (lineas[t][0] || {}).descuento || '' }); guardar(); pintarFormulario(); };
    $('#copiarPlan').onclick = () => { const p = lineas[t][0] || {}; lineas[t].forEach(l => { l.plan = p.plan; l.descuento = p.descuento; }); guardar(); pintarFormulario(); };
    $('#pegarLineas').onclick = () => {
      const txt = prompt('Pega los números (uno por línea o separados por coma):');
      if (!txt) return;
      const nums = txt.split(/[\s,;]+/).map(s => s.replace(/\D/g, '')).filter(Boolean);
      const max = CFG.detalle[t].max;
      const base = lineas[t].filter(l => l.linea || l.plan);
      const p = base[0] || {};
      nums.forEach(n => { if (base.length < max) base.push({ linea: n, plan: p.plan || '', descuento: p.descuento || '' }); });
      lineas[t] = base;
      if (nums.length + 0 > max) toast('Solo se agregaron hasta ' + max + ' líneas.', 'err');
      guardar(); pintarFormulario();
    };
  }

  function calcLineas(t) {
    let n = 0, total = 0;
    (lineas[t] || []).forEach(l => {
      const p = CFG.planesMovil.find(x => x.plan === l.plan);
      const cf = p ? p.precio : 0;
      const fin = Math.round(cf * (1 - pct(l.descuento)) * 100) / 100;
      if (t === 'Portabilidad' ? l.linea : l.plan) n++;
      total += l.plan ? fin : 0;
      l._cf = cf; l._fin = fin;
    });
    return { n, total };
  }

  // ---------- cálculos en pantalla ----------
  // Mismas reglas que el backend (hoja REGLAS_PRODUCTO): decide FIJA / FIBRA / CLOUD según servicio y plan
  function detectarProducto() {
    if (producto === 'MOVIL') return 'MOVIL';
    const f = {};
    defsDe('FIJA').forEach(d => { if (!(norm(d.label) in f)) f[norm(d.label)] = norm(datos.FIJA[d.fila]); });
    for (const r of (CFG.reglas || [])) {
      const v = f[r.campo] || '';
      if (r.contiene === '*' ? v !== '' : v.indexOf(r.contiene) >= 0) return r.producto;
    }
    return valor('FIJA', 'SERVICIO') ? 'FIJA' : '';
  }

  function actualizarCalculos() {
    let res = '';
    if (producto === 'FIJA') {
      const p = planFija();
      document.querySelectorAll('[data-calc]').forEach(el => {
        const L = el.dataset.calc;
        if (!p) { el.textContent = '—'; return; }
        el.textContent = /PROMO/.test(L) ? soles(p.promo) : /CARGO FIJO/.test(L) ? soles(p.regular) : 'Se calcula al generar';
      });
      const prod = detectarProducto();
      const chip = prod ? '<span class="chip">' + prod + '</span>' : '';
      res = p ? chip + soles(p.regular) + '<small>' + esc(valor('FIJA', 'SERVICIO')) + ' · ' + esc(p.plan) + (prod ? ' · se registra en ' + prod : '') + '</small>'
              : chip + 'Ficha FIJA<small>' + (prod ? 'Se registra en ' + prod + ' · elige el plan' : 'Elige servicio y plan') + '</small>';
    } else {
      document.querySelectorAll('[data-calc]').forEach(el => { el.textContent = 'Se calcula al generar'; });
      const t = tipoMovil();
      if (t) {
        const c = calcLineas(t);
        document.querySelectorAll('#cardLineas tbody tr').forEach(tr => {
          const l = lineas[t][+tr.dataset.i];
          tr.querySelector('[data-cf]').textContent = l.plan ? soles(l._cf) : '—';
          tr.querySelector('[data-cff]').textContent = l.plan ? soles(l._fin) : '—';
        });
        const tl = $('#totLineas'), tc = $('#totCF');
        if (tl) tl.textContent = c.n + ' línea(s)';
        if (tc) tc.textContent = soles(c.total);
        res = '<span class="chip">MOVIL</span>' + soles(c.total) + '<small>' + t + ' · ' + c.n + ' línea(s)</small>';
      } else res = 'Ficha MÓVIL<small>Elige Portabilidad o Alta Nueva</small>';
    }
    $('#resumen').innerHTML = res;
  }

  // ---------- validación ----------
  function validar() {
    const faltan = [];
    document.querySelectorAll('.invalido').forEach(e => e.classList.remove('invalido'));
    (CFG.requeridos[producto] || []).forEach(lbl => {
      const d = campoPor(producto, lbl);
      if (d && !String(datos[producto][d.fila] || '').trim()) {
        faltan.push(lbl);
        const el = document.getElementById('f' + d.fila); if (el) el.classList.add('invalido');
      }
    });
    if (faltan.length) return 'Completa: ' + faltan.join(', ');
    const ruc = String(valor(producto, 'RUC')).replace(/\D/g, '');
    if (ruc.length !== 11) { const d = campoPor(producto, 'RUC'); const el = d && document.getElementById('f' + d.fila); if (el) el.classList.add('invalido'); return 'El RUC debe tener 11 dígitos.'; }
    if (producto === 'MOVIL') {
      const t = tipoMovil();
      if (!t) return 'Elige Portabilidad o Alta Nueva.';
      const ls = lineas[t].filter(l => l.linea || l.plan);
      if (!ls.length) return 'Agrega al menos una línea.';
      if (ls.some(l => !l.plan)) return 'Cada línea debe tener un plan.';
      if (t === 'Portabilidad' && ls.some(l => !l.linea)) return 'En portabilidad cada fila necesita el número a portar.';
    }
    return '';
  }

  /** Autocompleta campos derivados de las líneas si el asesor los dejó vacíos. */
  function autocompletarMovil(campos) {
    const t = tipoMovil();
    const ls = lineas[t].filter(l => l.linea || l.plan);
    const set = (lbl, v) => { const d = campoPor('MOVIL', lbl); if (d && !String(campos[d.fila] || '').trim()) campos[d.fila] = v; };
    set('CANTIDAD LINEAS', String(ls.length));
    if (t === 'Portabilidad') set('LINEAS A PORTAR', ls.map(l => l.linea).join(', '));
    const cuenta = {};
    ls.forEach(l => { cuenta[l.plan] = (cuenta[l.plan] || 0) + 1; });
    set('PLANES', Object.keys(cuenta).map(p => cuenta[p] + 'x ' + p).join(' / '));
    if (campania) set('CAMPAÑA', campania);
  }

  // ---------- generar ----------
  $('#btnGenerar').onclick = () => generar(false);

  async function generar(forzar) {
    const err = validar();
    if (err) { toast(err, 'err'); const inv = $('.invalido'); if (inv) inv.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    const campos = Object.assign({}, datos[producto]);
    const t = producto === 'MOVIL' ? tipoMovil() : '';
    if (producto === 'MOVIL') autocompletarMovil(campos);
    const body = {
      action: 'generar', clave: store.get('clave', ''), producto, tipo: t, campos,
      campania: producto === 'MOVIL' ? campania : '',
      lineas: producto === 'MOVIL' ? lineas[t].filter(l => l.linea || l.plan).map(l => ({ linea: l.linea || '', plan: l.plan || '', descuento: l.descuento || '0%', equipo: l.equipo || '', precio: l.precio || '' })) : [],
      registrar: $('#registrar').checked, forzar: !!forzar
    };

    cargando(true, producto === 'MOVIL' ? 'Generando ficha MÓVIL – ' + t + '…' : 'Generando ficha FIJA…');
    try {
      const r = await apiPost(body);
      cargando(false);
      if (!r.ok) {
        if (r.error === 'CLAVE_INVALIDA') { store.del('clave'); mostrarLogin('Tu clave cambió. Ingrésala de nuevo.'); return; }
        throw new Error(r.error);
      }
      if (r.duplicado) {
        confirmar('Oportunidad ya registrada', 'La oportunidad ' + r.oportunidad + ' ya existe en ' + r.hoja + '. ¿Qué deseas hacer?', [
          { txt: 'Cancelar' },
          { txt: 'Solo descargar', fn: () => { $('#registrar').checked = false; generar(false); } },
          { txt: 'Registrar igual', principal: true, fn: () => generar(true) }
        ]);
        return;
      }
      descargar(r.base64, r.nombre);
      agregarHistorial(r);
      toast(r.fila ? '✓ Ficha descargada y registrada en ' + r.hoja + ' (fila ' + r.fila + ')' : '✓ Ficha descargada', 'ok');
      $('#registrar').checked = true;
      setTimeout(() => confirmar('Ficha lista', 'Se descargó ' + r.nombre + '. Envíala al BO. ¿Empezar una nueva venta?', [
        { txt: 'Seguir editando' },
        { txt: 'Nueva venta', principal: true, fn: limpiar }
      ]), 600);
    } catch (e) {
      cargando(false);
      toast('No se pudo generar: ' + e.message, 'err');
    }
  }

  function descargar(b64, nombre) {
    const bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const a = document.createElement('a');
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  // ---------- historial (solo metadatos, en este navegador) ----------
  function agregarHistorial(r) {
    const h = store.get('historial', []);
    h.unshift({ nombre: r.nombre, fecha: new Date().toISOString(), fila: r.fila, hoja: r.hoja });
    store.set('historial', h.slice(0, 15));
    pintarHistorial();
  }
  function pintarHistorial() {
    const h = store.get('historial', []);
    $('#historial').classList.toggle('oculto', !h.length);
    $('#histLista').innerHTML = h.map(x => '<li><span>' + esc(x.nombre) + '</span><small>' +
      new Date(x.fecha).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }) +
      (x.fila ? ' · ' + esc(x.hoja) + ' fila ' + x.fila : ' · sin registrar') + '</small></li>').join('');
  }

  // ---------- UI ----------
  function cargando(on, txt) {
    $('#overlay').classList.toggle('oculto', !on);
    $('#btnGenerar').disabled = on;
    if (txt) $('#overlayTxt').textContent = txt;
  }
  let tt;
  function toast(msg, tipo) {
    const el = $('#toast');
    el.textContent = msg; el.className = 'toast ver ' + (tipo || '');
    clearTimeout(tt); tt = setTimeout(() => { el.className = 'toast'; }, 4000);
  }
  function confirmar(tit, txt, botones) {
    $('#modalTit').textContent = tit; $('#modalTxt').textContent = txt;
    const acc = $('#modalAcc'); acc.innerHTML = '';
    botones.forEach(b => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = b.principal ? 'btn' : 'btn-sec'; el.textContent = b.txt;
      el.onclick = () => { $('#modal').classList.add('oculto'); if (b.fn) b.fn(); };
      acc.appendChild(el);
    });
    $('#modal').classList.remove('oculto');
  }

  iniciar();
})();
