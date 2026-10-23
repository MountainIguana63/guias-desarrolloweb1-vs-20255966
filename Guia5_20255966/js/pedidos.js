// =====================================================
// DATOS
// =====================================================

// Arreglo donde se guardan todos los pedidos registrados
const pedidos = [];

// =====================================================
// ACCESO AL DOM
// =====================================================

const formPedido = document.querySelector("#idFormPedido");
const inputProducto = document.querySelector("#idProducto");
const inputPrecio = document.querySelector("#idPrecio");
const inputCantidad = document.querySelector("#idCantidad");
const inputPrecioMaximo = document.querySelector("#idPrecioMaximo");

const btnFiltrar = document.querySelector("#idBtnFiltrar");
const btnMostrarTodos = document.querySelector("#idBtnMostrarTodos");
const btnLimpiar = document.querySelector("#idBtnLimpiar");

const cuerpoTabla = document.querySelector("#idCuerpoTabla");
const spanTotalUnidades = document.querySelector("#idTotalUnidades");
const spanMontoTotal = document.querySelector("#idMontoTotal");
const parrafoEstadoFiltro = document.querySelector("#idEstadoFiltro");
const divMensaje = document.querySelector("#idMensaje");

// =====================================================
// FUNCIONES DE PROCESAMIENTO DE DATOS
// (no tocan el HTML, solo reciben y devuelven valores)
// =====================================================

// Crea el objeto pedido con la estructura solicitada
const crearPedido = (producto, precio, cantidad) => ({
  producto: producto,
  precio: precio,
  cantidad: cantidad,
});

// Devuelve un arreglo con los errores encontrados (vacío si todo está bien)
function validarPedido(pedido) {
  const errores = [];

  if (pedido.producto === "") {
    errores.push("El nombre del producto no puede estar vacío.");
  }
  // Si el precio no es un número (NaN) la comparación también es false
  if (!(pedido.precio > 0)) {
    errores.push("El precio unitario debe ser un número mayor que cero.");
  }
  // Un entero positivo es mayor que 0 y no tiene parte decimal (residuo de 1 igual a 0)
  if (!(pedido.cantidad > 0 && pedido.cantidad % 1 === 0)) {
    errores.push("La cantidad debe ser un número entero positivo.");
  }

  return errores;
}

const calcularSubtotal = (pedido) => pedido.precio * pedido.cantidad;

const calcularTotalUnidades = (lista) =>
  lista.reduce((acumulador, pedido) => acumulador + pedido.cantidad, 0);

const calcularMontoTotal = (lista) =>
  lista.reduce((acumulador, pedido) => acumulador + calcularSubtotal(pedido), 0);

// filter() devuelve un arreglo nuevo, el arreglo original no se modifica
const filtrarPorPrecioMaximo = (lista, precioMaximo) =>
  lista.filter((pedido) => pedido.precio <= precioMaximo);

const formatearMoneda = (valor) => `$${valor.toFixed(2)}`;

// Evita que el texto escrito por el usuario se interprete como HTML
const escaparHTML = (texto) =>
  texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// =====================================================
// FUNCIONES DE ACTUALIZACIÓN DEL HTML
// =====================================================

function mostrarTabla(lista) {
  if (lista.length === 0) {
    cuerpoTabla.innerHTML = `<tr>
        <td colspan="4" class="text-center text-muted">No hay pedidos para mostrar</td>
      </tr>`;
    return;
  }

  // map() transforma cada pedido en una fila <tr> y join() las une en una sola cadena
  cuerpoTabla.innerHTML = lista
    .map(
      (pedido) => `<tr>
        <td>${escaparHTML(pedido.producto)}</td>
        <td class="text-end">${formatearMoneda(pedido.precio)}</td>
        <td class="text-end">${pedido.cantidad}</td>
        <td class="text-end">${formatearMoneda(calcularSubtotal(pedido))}</td>
      </tr>`
    )
    .join("");
}

// Los indicadores siempre muestran los totales de todos los pedidos registrados
function mostrarIndicadores() {
  spanTotalUnidades.textContent = calcularTotalUnidades(pedidos);
  spanMontoTotal.textContent = formatearMoneda(calcularMontoTotal(pedidos));
}

function mostrarEstadoFiltro(texto) {
  parrafoEstadoFiltro.textContent = texto;
}

function mostrarMensaje(tipo, contenido) {
  divMensaje.innerHTML = `<div class="alert alert-${tipo} mb-0">${contenido}</div>`;
}

function limpiarMensaje() {
  divMensaje.innerHTML = "";
}

function limpiarFormulario() {
  formPedido.reset();
  inputProducto.focus();
}

// Quita el filtro, muestra todos los pedidos y actualiza los indicadores
function actualizarVista() {
  inputPrecioMaximo.value = "";
  mostrarTabla(pedidos);
  mostrarIndicadores();
  mostrarEstadoFiltro("");
}

// =====================================================
// MANEJADORES DE EVENTOS
// =====================================================

function agregarPedido(event) {
  // Evita que el formulario recargue la página
  event.preventDefault();

  const pedido = crearPedido(
    inputProducto.value.trim(),
    parseFloat(inputPrecio.value),
    Number(inputCantidad.value)
  );

  const errores = validarPedido(pedido);

  if (errores.length > 0) {
    const listaErrores = errores.map((error) => `<li>${error}</li>`).join("");
    mostrarMensaje("danger", `<ul class="mb-0">${listaErrores}</ul>`);
    return;
  }

  pedidos.push(pedido);
  actualizarVista();
  mostrarMensaje("success", `Pedido de "${escaparHTML(pedido.producto)}" agregado.`);
  limpiarFormulario();
}

function filtrarProductos() {
  const precioMaximo = parseFloat(inputPrecioMaximo.value);

  if (!(precioMaximo >= 0)) {
    mostrarMensaje("warning", "Ingrese un precio máximo válido para filtrar.");
    return;
  }

  const pedidosFiltrados = filtrarPorPrecioMaximo(pedidos, precioMaximo);
  limpiarMensaje();
  mostrarTabla(pedidosFiltrados);
  mostrarEstadoFiltro(
    `Mostrando ${pedidosFiltrados.length} de ${pedidos.length} pedidos con precio unitario menor o igual a ${formatearMoneda(precioMaximo)}.`
  );
}

function mostrarTodos() {
  limpiarMensaje();
  actualizarVista();
}

function limpiarPedidos() {
  // splice elimina todos los elementos del arreglo original
  pedidos.splice(0, pedidos.length);
  actualizarVista();
  mostrarMensaje("info", "Se han eliminado todos los pedidos.");
}

// =====================================================
// ASIGNACIÓN DE EVENTOS
// =====================================================

formPedido.addEventListener("submit", agregarPedido);
btnFiltrar.addEventListener("click", filtrarProductos);
btnMostrarTodos.addEventListener("click", mostrarTodos);
btnLimpiar.addEventListener("click", limpiarPedidos);

// Estado inicial de la página
actualizarVista();
