const clienteInput = document.querySelector("#cliente");
const tatuajeInput = document.querySelector("#tatuaje");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const anotacionesInput = document.querySelector("#anotaciones");

// Contenedor para las citas
const contenedorCitas = document.querySelector("#citas");

// Formulario nuevas citas
const formulario = document.querySelector("#nueva-cita");
formulario.addEventListener("submit", nuevaCita);

let editando = false;

// Eventos
eventListeners();
function eventListeners() {
  clienteInput.addEventListener("change", datosCita);
  tatuajeInput.addEventListener("change", datosCita);
  telefonoInput.addEventListener("change", datosCita);
  fechaInput.addEventListener("change", datosCita);
  horaInput.addEventListener("change", datosCita);
  anotacionesInput.addEventListener("change", datosCita);
}

const citaObj = {
  cliente: "",
  tatuaje: "",
  telefono: "",
  fecha: "",
  hora: "",
  anotaciones: "",
};

function datosCita(e) {
  //  console.log(e.target.name) // Obtener el Input
  citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
  constructor() {
    this.citas = [];
  }
  agregarCita(cita) {
    this.citas = [...this.citas, cita];
  }
  editarCita(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    // Crea el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    // Si es de tipo error agrega una clase
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    // Insertar en el DOM
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    // Quitar el alert despues de 3 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  imprimirCitas({ citas }) {
    // Se puede aplicar destructuring desde la funci??n...

    this.limpiarHTML();

    citas.forEach((cita) => {
      const { cliente, tatuaje, telefono, fecha, hora, anotaciones, id } = cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      // SCRIPTING DE LOS ELEMENTOS...
      const clienteParrafo = document.createElement("h2");
      clienteParrafo.classList.add("card-title", "font-weight-bolder");
      clienteParrafo.innerHTML = `${cliente}`;

      const tatuajeParrafo = document.createElement("p");
      tatuajeParrafo.innerHTML = `<span class="font-weight-bolder">Tatuaje: </span> ${tatuaje}`;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Tel??fono: </span> ${telefono}`;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

      const anotacionesParrafo = document.createElement("p");
      anotacionesParrafo.innerHTML = `<span class="font-weight-bolder">Anotaciones: </span> ${anotaciones}`;

      // Agregar un bot??n de eliminar...
      const btnEliminar = document.createElement("button");
      btnEliminar.onclick = () => eliminarCita(id); // a??ade la opci??n de eliminar
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML =
        'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

      // Agregar un bot??n de editar...
      const btnEditar = document.createElement("button");
      btnEditar.onclick = () => cargarEdicion(cita);

      btnEditar.classList.add("btn", "btn-info");
      btnEditar.innerHTML =
        'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

      // Agregar al HTML
      divCita.appendChild(clienteParrafo);
      divCita.appendChild(tatuajeParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(anotacionesParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const ui = new UI();
const administrarCitas = new Citas();

function nuevaCita(e) {
  e.preventDefault();

  const { cliente, tatuaje, telefono, fecha, hora, anotaciones } = citaObj;

  // Validar
  if (
    cliente === "" ||
    tatuaje === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    anotaciones === ""
  ) {
    ui.imprimirAlerta("Todos los mensajes son Obligatorios", "error");

    return;
  }

  if (editando) {
    // Estamos editando
    administrarCitas.editarCita({ ...citaObj });

    ui.imprimirAlerta("Guardado Correctamente");

    formulario.querySelector('button[type="submit"]').textContent =
      "Crear Cita";

    editando = false;
  } else {
    // Nuevo Registrando

    // Generar un ID ??nico
    citaObj.id = Date.now();

    // A??ade la nueva cita
    administrarCitas.agregarCita({ ...citaObj });

    // Mostrar mensaje de que todo esta bien...
    ui.imprimirAlerta("Se agreg?? correctamente");
  }

  // Imprimir el HTML de citas
  ui.imprimirCitas(administrarCitas);

  // Reinicia el objeto para evitar futuros problemas de validaci??n
  reiniciarObjeto();

  // Reiniciar Formulario
  formulario.reset();
}

function reiniciarObjeto() {
  // Reiniciar el objeto
  citaObj.cliente = "";
  citaObj.tatuaje = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.anotaciones = "";
}

function eliminarCita(id) {
  administrarCitas.eliminarCita(id);

  ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {
  const { cliente, tatuaje, telefono, fecha, hora, anotaciones, id } = cita;

  // Reiniciar el objeto
  citaObj.cliente = cliente;
  citaObj.tatuaje = tatuaje;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.anotaciones = anotaciones;
  citaObj.id = id;

  // Llenar los Inputs
  clienteInput.value = cliente;
  tatuajeInput.value = tatuaje;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  anotacionesInput.value = anotaciones;

  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar Cambios";

  editando = true;
}
