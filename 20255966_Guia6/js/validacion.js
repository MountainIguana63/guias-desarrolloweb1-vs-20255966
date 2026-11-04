const LETRAS = "A-Za-zÁÉÍÓÚáéíóúÑñÜü";

const expresiones = {
  carnet: /^[A-Z]{2}[0-9]{3}$/,
  nombre: new RegExp(`^[${LETRAS}]+( [${LETRAS}]+)+$`),
  dui: /^\d{8}-\d$/,
  nit: /^\d{4}-\d{6}-\d{3}-\d$/,
  fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
  correo: /^[\w.+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
  edad: /^[0-9]{1,3}$/,
};

const campos = {
  carnet: document.getElementById("idTxtCarnet"),
  nombre: document.getElementById("idTxtNombreCompleto"),
  dui: document.getElementById("idTxtDui"),
  nit: document.getElementById("idTxtNit"),
  fecha: document.getElementById("idTxtFecha"),
  correo: document.getElementById("idTxtCorreo"),
  edad: document.getElementById("idTxtEdad"),
};

const btnValidar = document.getElementById("idBtnValidar");
const btnLimpiar = document.getElementById("idBtnLimpiarFicha");
const contenedorTabla = document.getElementById("idTablaEstudiantes");

let arrayEstudiantes = [];

const fechaReal = (texto) => {
  const [dia, mes, anio] = texto.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia &&
    fecha <= new Date()
  );
};

const validarCampo = (clave) => {
  const input = campos[clave];
  const valor = input.value.trim();
  let valido = expresiones[clave].test(valor);

  if (valido && clave === "fecha") valido = fechaReal(valor);

  input.classList.toggle("is-valid", valido);
  input.classList.toggle("is-invalid", !valido && valor !== "");
  return valido;
};

Object.keys(campos).forEach((clave) => {
  campos[clave].addEventListener("input", () => {
    if (clave === "carnet") {
      campos.carnet.value = campos.carnet.value.toUpperCase();
    }
    validarCampo(clave);
  });
});

const limpiarFicha = () => {
  Object.values(campos).forEach((input) => {
    input.value = "";
    input.classList.remove("is-valid", "is-invalid");
  });
  campos.carnet.focus();
};

const imprimirEstudiantes = () => {
  let filas = "";
  arrayEstudiantes.forEach((est, i) => {
    filas += `<tr>
                <td class="text-center fw-bold">${i + 1}</td>
                <td>${est.carnet}</td>
                <td>${est.nombre}</td>
                <td>${est.dui}</td>
                <td>${est.nit}</td>
                <td>${est.fecha}</td>
                <td>${est.correo}</td>
                <td class="text-center">${est.edad}</td>
              </tr>`;
  });

  contenedorTabla.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Carnet</th>
          <th class="text-center">Nombre</th>
          <th class="text-center">DUI</th>
          <th class="text-center">NIT</th>
          <th class="text-center">Fecha nacimiento</th>
          <th class="text-center">Correo</th>
          <th class="text-center">Edad</th>
        </tr>
        ${filas}
      </table>
    </div>`;
};

btnValidar.addEventListener("click", () => {
  const resultados = Object.keys(campos).map((clave) => {
    const valido = validarCampo(clave);
    if (!valido) campos[clave].classList.add("is-invalid");
    return valido;
  });

  if (resultados.every(Boolean)) {
    const estudiante = {};
    Object.keys(campos).forEach((clave) => {
      estudiante[clave] = campos[clave].value.trim();
    });
    arrayEstudiantes.push(estudiante);
    imprimirEstudiantes();
    alert("Ficha válida: estudiante registrado correctamente");
    limpiarFicha();
  } else {
    document.querySelector("#idFormEstudiante .is-invalid").focus();
  }
});

btnLimpiar.addEventListener("click", limpiarFicha);
