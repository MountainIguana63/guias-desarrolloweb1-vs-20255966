// ============================================================
// EJERCICIO COMPLEMENTARIO 2
// Consumo de una API de RapidAPI con Fetch API y async/await
// API: Free-to-Play Games Database (plan gratuito)
// https://rapidapi.com/digiwalls/api/free-to-play-games-database
// ============================================================

// CONFIGURACION DE LA API
// Pegue aqui la llave (X-RapidAPI-Key) que le entrega RapidAPI
// al suscribirse al plan gratuito de la API
const RAPIDAPI_KEY = "ca0e259528msh57fcc16f3ff9703p1b9309jsn6d841242ea40";
const RAPIDAPI_HOST = "free-to-play-games-database.p.rapidapi.com";
const API_URL = `https://${RAPIDAPI_HOST}/api`;

// Cantidad maxima de juegos que se muestran en el listado
const MAX_JUEGOS = 24;

// REFERENCIAS A ELEMENTOS HTML
const listado = document.querySelector("#idListado");
const estado = document.querySelector("#idEstado");
const cmbCategoria = document.querySelector("#idCmbCategoria");
const bodyModal = document.querySelector("#idBodyModal");
const tituloModal = document.querySelector("#modalLabel");

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// ---------- FUNCIONES DE APOYO PARA EL DOM ----------

// Elimina todos los nodos hijos de un elemento
const limpiarNodo = function (nodo) {
  while (nodo.hasChildNodes()) {
    nodo.removeChild(nodo.firstChild);
  }
};

// Crea un elemento con sus clases y (opcionalmente) un texto
const crearElemento = function (etiqueta, clases, texto) {
  const elemento = document.createElement(etiqueta);
  if (clases) elemento.setAttribute("class", clases);
  if (texto) elemento.appendChild(document.createTextNode(texto));
  return elemento;
};

// Crea el indicador de carga (spinner de Bootstrap) con un mensaje
const crearCargando = function (mensaje) {
  const contenedor = crearElemento("div", "text-center py-4");
  const spinner = crearElemento("div", "spinner-border text-primary");
  spinner.setAttribute("role", "status");
  contenedor.appendChild(spinner);
  contenedor.appendChild(crearElemento("p", "mt-2 mb-0", mensaje));
  return contenedor;
};

// Crea un mensaje de error con un boton para reintentar
const crearError = function (mensaje, reintentar) {
  const alerta = crearElemento("div", "alert alert-danger");
  alerta.setAttribute("role", "alert");
  alerta.appendChild(crearElemento("p", "mb-2", mensaje));

  if (reintentar) {
    const boton = crearElemento("button", "btn btn-outline-danger btn-sm", "Reintentar");
    boton.setAttribute("type", "button");
    boton.addEventListener("click", reintentar);
    alerta.appendChild(boton);
  }
  return alerta;
};

// ---------- SOLICITUDES A LA API ----------

// Realiza una solicitud GET a la API y devuelve el JSON de la respuesta
const consultarAPI = async function (ruta) {
  if (RAPIDAPI_KEY == "" || RAPIDAPI_KEY == "PEGUE_AQUI_SU_API_KEY") {
    throw new Error(
      "Falta configurar la llave de RapidAPI en el archivo js/ejemplo5.js"
    );
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });
  } catch (error) {
    // fetch solo rechaza la promesa cuando falla la red
    throw new Error("No se pudo conectar con la API. Revise su conexión a internet.");
  }

  // Los errores HTTP (401, 403, 404, 429...) no rechazan la promesa,
  // por eso se verifica la propiedad ok de la respuesta
  if (!respuesta.ok) {
    if (respuesta.status == 401 || respuesta.status == 403) {
      throw new Error("La llave de RapidAPI no es válida o no está suscrita a esta API.");
    }
    if (respuesta.status == 404) {
      throw new Error("No se encontró información para la consulta realizada.");
    }
    if (respuesta.status == 429) {
      throw new Error("Se superó el límite de solicitudes del plan gratuito. Intente más tarde.");
    }
    throw new Error(`La API respondió con un error (código ${respuesta.status}).`);
  }

  return await respuesta.json();
};

// ---------- ENDPOINT 1: LISTADO DE RECURSOS ----------

// Crea la tarjeta (card) de un juego para el listado
const crearTarjeta = function (juego) {
  const columna = crearElemento("div", "col");
  const tarjeta = crearElemento("div", "card h-100 shadow-sm");

  const imagen = crearElemento("img", "card-img-top");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("alt", `Portada de ${juego.title}`);
  imagen.setAttribute("loading", "lazy");

  const cuerpo = crearElemento("div", "card-body d-flex flex-column");
  cuerpo.appendChild(crearElemento("h2", "card-title fs-5", juego.title));
  cuerpo.appendChild(crearElemento("span", "badge text-bg-secondary align-self-start mb-2", juego.genre));
  cuerpo.appendChild(crearElemento("p", "card-text small", juego.short_description));

  const boton = crearElemento("button", "btn btn-primary mt-auto", "Ver detalle");
  boton.setAttribute("type", "button");
  // Al seleccionar un juego se consulta su detalle sin recargar la pagina
  boton.addEventListener("click", () => {
    cargarDetalle(juego.id);
  });
  cuerpo.appendChild(boton);

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpo);
  columna.appendChild(tarjeta);
  return columna;
};

// Consulta el listado de juegos y lo muestra en la pagina
const cargarListado = async function () {
  const categoria = cmbCategoria.value;
  const ruta = categoria == "" ? "/games" : `/games?category=${encodeURIComponent(categoria)}`;

  limpiarNodo(listado);
  limpiarNodo(estado);
  estado.appendChild(crearCargando("Cargando listado de juegos..."));
  cmbCategoria.disabled = true;

  try {
    const juegos = await consultarAPI(ruta);
    limpiarNodo(estado);

    if (!Array.isArray(juegos) || juegos.length == 0) {
      estado.appendChild(
        crearElemento("p", "text-muted", "No se encontraron juegos para esta categoría.")
      );
      return;
    }

    const mostrados = juegos.slice(0, MAX_JUEGOS);
    for (const juego of mostrados) {
      listado.appendChild(crearTarjeta(juego));
    }
    estado.appendChild(
      crearElemento("p", "text-muted small", `Mostrando ${mostrados.length} de ${juegos.length} juegos.`)
    );
  } catch (error) {
    console.error(error);
    limpiarNodo(estado);
    estado.appendChild(crearError(error.message, cargarListado));
  } finally {
    cmbCategoria.disabled = false;
  }
};

// ---------- ENDPOINT 2: DETALLE DE UN RECURSO ----------

// Crea una fila de la tabla de detalle
const crearFila = function (titulo, valor) {
  const fila = document.createElement("tr");
  const celdaTitulo = crearElemento("th", null, titulo);
  celdaTitulo.setAttribute("scope", "row");
  fila.appendChild(celdaTitulo);
  fila.appendChild(crearElemento("td", null, valor || "No disponible"));
  return fila;
};

// Construye el contenido del modal con la informacion del juego
const mostrarDetalle = function (juego) {
  limpiarNodo(bodyModal);
  tituloModal.textContent = juego.title;

  const imagen = crearElemento("img", "img-fluid rounded mb-3 d-block mx-auto");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("alt", `Portada de ${juego.title}`);
  bodyModal.appendChild(imagen);

  bodyModal.appendChild(crearElemento("p", null, juego.description));

  // Tabla con los datos generales
  const tabla = crearElemento("table", "table table-striped table-bordered");
  const cuerpo = document.createElement("tbody");
  cuerpo.appendChild(crearFila("Género", juego.genre));
  cuerpo.appendChild(crearFila("Plataforma", juego.platform));
  cuerpo.appendChild(crearFila("Desarrollador", juego.developer));
  cuerpo.appendChild(crearFila("Distribuidor", juego.publisher));
  cuerpo.appendChild(crearFila("Fecha de lanzamiento", juego.release_date));
  cuerpo.appendChild(crearFila("Estado", juego.status));
  tabla.appendChild(cuerpo);
  bodyModal.appendChild(tabla);

  // Requisitos minimos (no todos los juegos los tienen)
  const requisitos = juego.minimum_system_requirements;
  if (requisitos) {
    bodyModal.appendChild(crearElemento("h2", "fs-5 fw-bold", "Requisitos mínimos"));
    const tablaReq = crearElemento("table", "table table-sm table-bordered");
    const cuerpoReq = document.createElement("tbody");
    cuerpoReq.appendChild(crearFila("Sistema operativo", requisitos.os));
    cuerpoReq.appendChild(crearFila("Procesador", requisitos.processor));
    cuerpoReq.appendChild(crearFila("Memoria", requisitos.memory));
    cuerpoReq.appendChild(crearFila("Gráficos", requisitos.graphics));
    cuerpoReq.appendChild(crearFila("Almacenamiento", requisitos.storage));
    tablaReq.appendChild(cuerpoReq);
    bodyModal.appendChild(tablaReq);
  }

  // Capturas de pantalla
  if (Array.isArray(juego.screenshots) && juego.screenshots.length > 0) {
    bodyModal.appendChild(crearElemento("h2", "fs-5 fw-bold", "Capturas"));
    const fila = crearElemento("div", "row g-2 mb-3");
    for (const captura of juego.screenshots) {
      const columna = crearElemento("div", "col-12 col-md-4");
      const img = crearElemento("img", "img-fluid rounded");
      img.setAttribute("src", captura.image);
      img.setAttribute("alt", `Captura de ${juego.title}`);
      img.setAttribute("loading", "lazy");
      columna.appendChild(img);
      fila.appendChild(columna);
    }
    bodyModal.appendChild(fila);
  }

  // Enlace al sitio del juego
  if (juego.game_url) {
    const enlace = crearElemento("a", "btn btn-success", "Ir al sitio del juego");
    enlace.setAttribute("href", juego.game_url);
    enlace.setAttribute("target", "_blank");
    enlace.setAttribute("rel", "noopener noreferrer");
    bodyModal.appendChild(enlace);
  }
};

// Consulta el detalle de un juego y lo muestra en el modal
const cargarDetalle = async function (id) {
  limpiarNodo(bodyModal);
  tituloModal.textContent = "Detalle del juego";
  bodyModal.appendChild(crearCargando("Cargando detalle del juego..."));
  modal.show();

  try {
    const juego = await consultarAPI(`/game?id=${encodeURIComponent(id)}`);
    mostrarDetalle(juego);
  } catch (error) {
    console.error(error);
    limpiarNodo(bodyModal);
    bodyModal.appendChild(
      crearError(error.message, () => {
        cargarDetalle(id);
      })
    );
  }
};

// ---------- EVENTOS ----------

// Al cambiar la categoria se vuelve a consultar el listado
cmbCategoria.addEventListener("change", cargarListado);

// Carga inicial del listado
cargarListado();
