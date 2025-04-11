let notas = JSON.parse(localStorage.getItem("notas")) || [];
const notasPorPagina = 5;
let paginaActual = 1;

// Guardar notas en localStorage
function guardarNotas() {
  localStorage.setItem("notas", JSON.stringify(notas));
}

// Mostrar notas en la tabla
function mostrarNotas() {
  const inicio = (paginaActual - 1) * notasPorPagina;
  const fin = inicio + notasPorPagina;

  const tablaBody = document.getElementById("listaNotasBody");
  tablaBody.innerHTML = "";

  notas.slice(inicio, fin).forEach((nota, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nota.titulo}</td>
      <td>${nota.descripcion}</td>
      <td>${nota.categoria}</td>
      <td>${nota.fecha}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2">Editar</button>
        <button class="btn btn-danger btn-sm">Eminar</button>
      </td>
    `;
    tablaBody.appendChild(fila);

    // Botón eliminar
    fila.querySelector(".btn-danger").addEventListener("click", () => {
      const indexReal = inicio + index;
      notas.splice(indexReal, 1);
      guardarNotas();
      mostrarNotas();

      Swal.fire({
        icon: "info",
        title: "Nota eliminada",
        text: "La nota se ha eliminado correctamente.",
      });
    });

    // Botón editar (aún no implementado)
    fila.querySelector(".btn-warning").addEventListener("click", () => {
      Swal.fire({
        icon: "question",
        title: "Funcionalidad pendiente",
        text: "La edición aún no está implementada.",
      });
    });
  });

  document.getElementById("btnAnterior").disabled = paginaActual === 1;
  document.getElementById("btnSiguiente").disabled = fin >= notas.length;
}

// Paginación
document.getElementById("btnAnterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarNotas();
  }
});

document.getElementById("btnSiguiente").addEventListener("click", () => {
  if (paginaActual * notasPorPagina < notas.length) {
    paginaActual++;
    mostrarNotas();
  }
});

// Agregar nueva nota
document.getElementById("formNotas").addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("nota").value.trim();
  const descripcion = document.getElementById("descripcionNota").value.trim();
  const categoria = document.getElementById("categoriaNota").value;

  if (!titulo || !descripcion || !categoria) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, completa todos los campos.",
    });
    return;
  }

  notas.push({
    titulo,
    descripcion,
    categoria,
    fecha: new Date().toLocaleDateString(),
  });

  guardarNotas();

  Swal.fire({
    icon: "success",
    title: "Nota agregada",
    text: "La nota se ha guardado correctamente.",
  });

  document.getElementById("formNotas").reset();
  document.getElementById("contadorDescripcion").textContent = "0 / 300";
  mostrarNotas();
});

// Contador de caracteres para descripción
const descripcionTextarea = document.getElementById("descripcionNota");
const contador = document.getElementById("contadorDescripcion");

descripcionTextarea.addEventListener("input", () => {
  const longitud = descripcionTextarea.value.length;
  contador.textContent = `${longitud} / 300`;
});

// Botón para eliminar todas las notas
document.getElementById("btnEliminarTodo").addEventListener("click", () => {
  if (notas.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Sin notas",
      text: "No hay notas para eliminar.",
    });
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Esta acción eliminará todas las notas!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar todo",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      notas = [];
      guardarNotas();
      paginaActual = 1;
      mostrarNotas();

      Swal.fire({
        icon: "success",
        title: "Eliminadas",
        text: "Todas las notas han sido eliminadas.",
      });
    }
  });
});

// Mostrar notas al iniciar
mostrarNotas();
