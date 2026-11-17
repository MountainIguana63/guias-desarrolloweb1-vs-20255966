// Obteniendo la referencia de los elementos
// por medio de arreglos asociativos
// aqui se esta utilizando el atributo name de cada elemento
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];
const buttonContar = document.forms["frmRegistro"].elements["btnContar"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
// PARA IMPRIMIR EL RESULTADO
const bodyModal = document.getElementById("idBodyModal");
const tituloModal = document.getElementById("modalLabel");

// Recorrer el formulario
const recorrerFormulario = function () {
  let totText = 0;
  let totRadio = 0;
  let totCheck = 0;
  let totDate = 0;
  let totSelect = 0;
  let totFile = 0;
  let totPass = 0;
  let totEmail = 0;

  // Recorriendo elementos del formulario
  let elementos = formulario.elements;
  let totalElementos = elementos.length;

  for (let index = 0; index < totalElementos; index++) {
    // Accediendo a cada hijo del formulario
    let elemento = elementos[index];

    // verificando el tipo de control en el formulario
    let tipoElemento = elemento.type;
    // verificando el tipo de nodo
    let tipoNode = elemento.nodeName;

    // Contabilizando el total de INPUT TYPE = TEXT
    if (tipoElemento == "text" && tipoNode == "INPUT") {
      console.log(elemento);
      totText++;
    }
    // Contabilizando el total de INPUT TYPE = PASSWORD
    else if (tipoElemento == "password" && tipoNode == "INPUT") {
      console.log(elemento);
      totPass++;
    }
    // Contabilizando el total de INPUT TYPE = EMAIL
    else if (tipoElemento == "email" && tipoNode == "INPUT") {
      console.log(elemento);
      totEmail++;
    }
    // Contabilizando el total de INPUT TYPE = RADIO
    else if (tipoElemento == "radio" && tipoNode == "INPUT") {
      console.log(elemento);
      totRadio++;
    }
    // Contabilizando el total de INPUT TYPE = CHECKBOX
    else if (tipoElemento == "checkbox" && tipoNode == "INPUT") {
      console.log(elemento);
      totCheck++;
    }
    // Contabilizando el total de INPUT TYPE = FILE
    else if (tipoElemento == "file" && tipoNode == "INPUT") {
      console.log(elemento);
      totFile++;
    }
    // Contabilizando el total de INPUT TYPE = DATE
    else if (tipoElemento == "date" && tipoNode == "INPUT") {
      console.log(elemento);
      totDate++;
    }
    // Contabilizando el total de SELECT
    else if (tipoNode == "SELECT") {
      console.log(elemento);
      totSelect++;
    }
  }

  let resultado = `
    Total de input[type="text"] = ${totText}<br>
    Total de input[type="password"] = ${totPass}<br>
    Total de input[type="radio"] = ${totRadio}<br>
    Total de input[type="checkbox"] = ${totCheck}<br>
    Total de input[type="date"] = ${totDate}<br>
    Total de input[type="email"] = ${totEmail}<br>
    Total de select = ${totSelect}<br>
  `;

  tituloModal.textContent = "Agregando un nuevo control";
  bodyModal.innerHTML = resultado;
  //Funcion que permite mostrar el modal de Bootstrap
  //Esta funcion es definida por Bootstrap
  modal.show();
};

// ============================================================
// EJERCICIO COMPLEMENTARIO 1
// Validacion del formulario y tabla de resultados creada con
// funciones del DOM (sin utilizar innerHTML)
// ============================================================

// Referencias a los controles del formulario
const txtNombre = document.getElementById("idNombre");
const txtApellidos = document.getElementById("idApellidos");
const txtFechaNac = document.getElementById("idFechaNac");
const txtCorreo = document.getElementById("idCorreo");
const txtPassword = document.getElementById("idPassword");
const txtPasswordRepetir = document.getElementById("idPasswordRepetir");
const cmbPais = document.getElementById("idCmPais");
const fileAvatar = document.getElementById("idArchivo");

// Colecciones de checkbox (intereses) y radio (carrera)
const intereses = formulario.querySelectorAll('input[type="checkbox"]');
const carreras = formulario.querySelectorAll('input[name="idRdCarrera"]');

// Expresion regular para validar el correo electronico
const regexCorreo = /^[\w.+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Devuelve el texto del <label> asociado a un control
const textoLabel = function (control) {
  const label = formulario.querySelector(`label[for="${control.id}"]`);
  return label ? label.textContent.trim() : "";
};

// Devuelve la fecha actual en formato AAAA-MM-DD (hora local)
const fechaActual = function () {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

// Elimina todos los nodos hijos de un elemento
const limpiarNodo = function (nodo) {
  while (nodo.hasChildNodes()) {
    nodo.removeChild(nodo.firstChild);
  }
};

// Quita las marcas de error de una validacion anterior
const limpiarErrores = function () {
  const marcados = formulario.querySelectorAll(".is-invalid");
  for (const control of marcados) {
    control.classList.remove("is-invalid");
  }

  const alerta = document.getElementById("idErrores");
  if (alerta) {
    alerta.parentNode.removeChild(alerta);
  }
};

// Muestra la lista de errores encima del formulario
const mostrarErrores = function (errores) {
  const alerta = document.createElement("div");
  alerta.setAttribute("id", "idErrores");
  alerta.setAttribute("class", "alert alert-danger");
  alerta.setAttribute("role", "alert");

  const titulo = document.createElement("strong");
  titulo.appendChild(
    document.createTextNode("Corrija los siguientes campos:")
  );
  alerta.appendChild(titulo);

  const lista = document.createElement("ul");
  lista.setAttribute("class", "mb-0");
  for (const error of errores) {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(error));
    lista.appendChild(item);
  }
  alerta.appendChild(lista);

  // Insertando la alerta antes del formulario
  formulario.parentNode.insertBefore(alerta, formulario);
  alerta.scrollIntoView({ behavior: "smooth", block: "center" });
};

// Valida el formulario. Devuelve un arreglo con los errores encontrados
const validarFormulario = function () {
  const errores = [];

  // a. Validando que los campos no esten vacios
  const obligatorios = [
    [txtNombre, "Nombres"],
    [txtApellidos, "Apellidos"],
    [txtFechaNac, "Fecha nacimiento"],
    [txtCorreo, "Correo electrónico"],
    [txtPassword, "Contraseña"],
    [txtPasswordRepetir, "Repetir Contraseña"],
  ];

  for (const [control, nombre] of obligatorios) {
    if (control.value.trim() == "") {
      control.classList.add("is-invalid");
      errores.push(`El campo "${nombre}" no puede estar vacío.`);
    }
  }

  // b. Validando que la fecha de nacimiento no supere la fecha actual
  if (txtFechaNac.value != "" && txtFechaNac.value > fechaActual()) {
    txtFechaNac.classList.add("is-invalid");
    errores.push("La fecha de nacimiento no puede superar la fecha actual.");
  }

  // c. Validando el correo electronico con una expresion regular
  if (txtCorreo.value.trim() != "" && !regexCorreo.test(txtCorreo.value.trim())) {
    txtCorreo.classList.add("is-invalid");
    errores.push("El correo electrónico no tiene un formato válido.");
  }

  // d. Validando que las contraseñas sean iguales
  if (
    txtPassword.value != "" &&
    txtPasswordRepetir.value != "" &&
    txtPassword.value != txtPasswordRepetir.value
  ) {
    txtPassword.classList.add("is-invalid");
    txtPasswordRepetir.classList.add("is-invalid");
    errores.push("Las contraseñas no coinciden.");
  }

  // e. Validando que se seleccione al menos un interes
  let totalIntereses = 0;
  for (const interes of intereses) {
    if (interes.checked) totalIntereses++;
  }
  if (totalIntereses == 0) {
    for (const interes of intereses) {
      interes.classList.add("is-invalid");
    }
    errores.push("Debe seleccionar al menos un interés.");
  }

  // f. Validando que se seleccione una carrera
  let carreraSeleccionada = false;
  for (const carrera of carreras) {
    if (carrera.checked) carreraSeleccionada = true;
  }
  if (!carreraSeleccionada) {
    for (const carrera of carreras) {
      carrera.classList.add("is-invalid");
    }
    errores.push("Debe seleccionar una carrera.");
  }

  // g. Validando que se seleccione un pais de origen
  // (la primera opcion es "Seleccione una opcion")
  if (cmbPais.selectedIndex <= 0) {
    cmbPais.classList.add("is-invalid");
    errores.push("Debe seleccionar un país de origen.");
  }

  return errores;
};

// Crea una fila <tr> con un encabezado y su valor
const crearFila = function (titulo, valor) {
  const fila = document.createElement("tr");

  const celdaTitulo = document.createElement("th");
  celdaTitulo.setAttribute("scope", "row");
  celdaTitulo.appendChild(document.createTextNode(titulo));

  const celdaValor = document.createElement("td");
  celdaValor.appendChild(document.createTextNode(valor));

  fila.appendChild(celdaTitulo);
  fila.appendChild(celdaValor);
  return fila;
};

// Crea la tabla con la informacion capturada y la muestra en el modal
const mostrarRegistro = function () {
  // Recuperando los intereses seleccionados
  const listaIntereses = [];
  for (const interes of intereses) {
    if (interes.checked) listaIntereses.push(textoLabel(interes));
  }

  // Recuperando la carrera seleccionada
  let carrera = "";
  for (const opcion of carreras) {
    if (opcion.checked) carrera = textoLabel(opcion);
  }

  const pais = cmbPais.options[cmbPais.selectedIndex].text;
  const avatar =
    fileAvatar.files.length > 0 ? fileAvatar.files[0].name : "No seleccionado";

  // Creando la tabla
  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered mb-0");

  const encabezado = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  for (const texto of ["Campo", "Información"]) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.appendChild(document.createTextNode(texto));
    filaEncabezado.appendChild(th);
  }
  encabezado.appendChild(filaEncabezado);
  tabla.appendChild(encabezado);

  const cuerpo = document.createElement("tbody");
  cuerpo.appendChild(crearFila("Nombres", txtNombre.value.trim()));
  cuerpo.appendChild(crearFila("Apellidos", txtApellidos.value.trim()));
  cuerpo.appendChild(crearFila("Fecha nacimiento", txtFechaNac.value));
  cuerpo.appendChild(crearFila("Correo electrónico", txtCorreo.value.trim()));
  cuerpo.appendChild(
    crearFila("Contraseña", "*".repeat(txtPassword.value.length))
  );
  cuerpo.appendChild(crearFila("Intereses", listaIntereses.join(", ")));
  cuerpo.appendChild(crearFila("Carrera", carrera));
  cuerpo.appendChild(crearFila("País de origen", pais));
  cuerpo.appendChild(crearFila("Avatar", avatar));
  tabla.appendChild(cuerpo);

  // Limpiando el modal y agregando la tabla
  limpiarNodo(bodyModal);
  tituloModal.textContent = "Información registrada";
  bodyModal.appendChild(tabla);
  modal.show();
};

// agregando eventos a los botones
// Boton del ejemplo de la guia: cuenta los elementos del formulario
buttonContar.onclick = () => {
  recorrerFormulario();
};

// Boton enviar: valida y muestra la informacion en el modal
button.onclick = () => {
  limpiarErrores();
  const errores = validarFormulario();

  if (errores.length == 0) {
    mostrarRegistro();
  } else {
    mostrarErrores(errores);
  }
};
