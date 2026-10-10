# Fichas PDV · NETORA

Web para que los asesores llenen la ficha de venta (FIJA / MÓVIL), descarguen el `.xlsx` para el BO
y la venta quede registrada en **REGISTRO DE VENTA**.

```
netora-fichas/
├── apps-script/Codigo.gs   → backend (va dentro del Google Sheet FICHA NETORA)
└── web/                    → frontend estático (GitHub + Vercel)
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── config.js           → aquí va la URL del backend
    └── vercel.json
```

## 1. Backend (Apps Script)

1. Abre **FICHA NETORA → Extensiones → Apps Script**. Borra el código anterior y pega `apps-script/Codigo.gs`.
2. **⚙️ Configuración del proyecto → Propiedades del script → Agregar propiedad** (dos propiedades):
   - `CLAVE_ACCESO` = la clave que les darás a los asesores
   - `APISPERU_TOKEN` = tu token de apisperu.com (consulta RUC / DNI)
3. En el editor, selecciona la función `probarConfig` y pulsa **Ejecutar**. Acepta los permisos.
4. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
5. Copia la URL que termina en `/exec`.

> Cuando cambies el código: **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión**.
> Así se mantiene la misma URL.

## 2. Frontend (GitHub + Vercel)

1. Pega la URL `/exec` en `web/config.js`.
2. Sube la carpeta a un repositorio de GitHub.
3. En Vercel: **Add New → Project →** importa el repo.
   - **Root Directory:** `web`
   - Framework Preset: **Other** (no hay build)
4. **Deploy**. Comparte la URL de Vercel con los asesores.

## Cómo funciona

- El formulario se arma **leyendo las hojas `PDV - FIJA` y `PDV - MOVIL`**: si agregas o cambias filas,
  o las listas desplegables, la web se actualiza sola (sin tocar código).
- Al descargar, el backend llena una **copia temporal** de la ficha (para que corran las fórmulas de
  cargo fijo, CF, descuentos), exporta solo las hojas necesarias y **la elimina definitivamente**:
  no queda nada en Drive.
  - FIJA → `PDV - FIJA`
  - MÓVIL Portabilidad → `PDV - MOVIL` + `PORTABILIDAD`
  - MÓVIL Alta Nueva → `PDV - MOVIL` + `ALTA NUEVA`
- Registra en `REGISTRO DE VENTA` (hoja FIJA o MOVIL) y avisa si el N° de oportunidad ya existe.
- Como el backend corre con tu cuenta, **los asesores no necesitan acceso** a los Google Sheets.
- El borrador se guarda en el navegador del asesor: si cierra la pestaña no pierde lo escrito.

## Consulta SUNAT y RENIEC

- Al escribir los **11 dígitos del RUC**, se consulta SUNAT y se llena **Razón social**,
  **Dirección fiscal** y **Dirección de facturación** (estas dos solo si están vacías).
  Muestra el estado y condición; si no está **ACTIVO / HABIDO** aparece una advertencia.
- Al escribir los **8 dígitos de un DNI**, se consulta RENIEC y el nombre se pone en el campo de
  persona que está justo antes (Representante legal o Contacto).
- El token **solo vive en Apps Script** (propiedad `APISPERU_TOKEN`), nunca en la web ni en GitHub.
- Las consultas se guardan en caché 6 horas para no gastar el cupo del plan.

## Detección automática del producto

La ficha **MÓVIL** siempre se registra en la hoja **MOVIL**.
En la ficha **FIJA**, el sistema decide solo si la venta va a **FIJA**, **FIBRA** o **CLOUD**
según el servicio y el plan elegidos. La web lo muestra en la barra inferior antes de descargar.

Las reglas están en la hoja **REGLAS_PRODUCTO** de FICHA NETORA (se crea sola al ejecutar `probarConfig`):

| CAMPO | CONTIENE | PRODUCTO |
|---|---|---|
| PLAN | CLOUD | CLOUD |
| SERVICIO | CLOUD | CLOUD |
| SERVICIO | DEDICADO | FIJA |
| PLAN | DEDICADO | FIJA |
| SERVICIO INCLUIDO | ENLACE DEDICADO | FIJA |
| SERVICIO | PLAY | FIBRA |
| SERVICIO | * | FIJA |

Se aplica la **primera** regla que coincida. Puedes cambiarlas, agregar filas o reordenarlas
directamente en la hoja; no hace falta tocar el código ni volver a publicar.
El nombre del archivo también lleva el producto: `FICHA_FIBRA_<RUC>_...xlsx`.

## Seguridad

- La clave **no** está en el código del repo (el repo puede ser público). Cada asesor la escribe una vez.
- Para cambiarla, edita `CLAVE_ACCESO` en las propiedades del script: todos tendrán que volver a ingresarla.
