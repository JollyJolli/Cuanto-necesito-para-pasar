// Manejo del modo oscuro
const themeToggle = document.getElementById('theme-toggle');

// Verificar si hay una preferencia guardada
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.checked = savedTheme === 'dark';
}

themeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

function contarNotas() {
  return document.querySelectorAll(".input-group").length;
}

function agregarNota() {
  const notasContainer = document.getElementById("notas-container");
  const cantidadNotas = contarNotas();
  
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");
  
  // Crear wrapper para nota
  const notaWrapper = document.createElement("div");
  notaWrapper.classList.add("input-wrapper");
  
  const notaIcon = document.createElement("i");
  notaIcon.classList.add("fas", "fa-star");
  
  const notaInput = document.createElement("input");
  notaInput.type = "number";
  notaInput.step = "0.01";
  notaInput.min = "0";
  notaInput.max = "10";
  notaInput.placeholder = `Nota ${cantidadNotas + 1} (0-10)`;
  notaInput.classList.add("nota-input");
  
  notaWrapper.appendChild(notaIcon);
  notaWrapper.appendChild(notaInput);
  
  // Crear wrapper para porcentaje
  const porcentajeWrapper = document.createElement("div");
  porcentajeWrapper.classList.add("input-wrapper");
  
  const porcentajeIcon = document.createElement("i");
  porcentajeIcon.classList.add("fas", "fa-percent");
  
  const porcentajeInput = document.createElement("input");
  porcentajeInput.type = "number";
  porcentajeInput.step = "1";
  porcentajeInput.min = "1";
  porcentajeInput.max = "100";
  porcentajeInput.placeholder = `Porcentaje ${cantidadNotas + 1} (1-100%)`;
  porcentajeInput.classList.add("porcentaje-input");
  
  porcentajeWrapper.appendChild(porcentajeIcon);
  porcentajeWrapper.appendChild(porcentajeInput);
  
  // Crear botón de eliminar
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("delete-nota");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.onclick = function() {
    inputGroup.remove();
    renumerarNotas();
  };
  
  inputGroup.appendChild(notaWrapper);
  inputGroup.appendChild(porcentajeWrapper);
  inputGroup.appendChild(deleteButton);
  
  // Agregar efecto de entrada
  inputGroup.classList.add("fade-in");
  
  notasContainer.appendChild(inputGroup);

  // Hacer scroll a la nueva nota
  inputGroup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renumerarNotas() {
  const notasInputs = document.querySelectorAll(".nota-input");
  const porcentajesInputs = document.querySelectorAll(".porcentaje-input");
  
  notasInputs.forEach((input, index) => {
    input.placeholder = `Nota ${index + 1} (0-10)`;
  });
  
  porcentajesInputs.forEach((input, index) => {
    input.placeholder = `Porcentaje ${index + 1} (1-100%)`;
  });
}

function calcularNota() {
  const notas = document.querySelectorAll(".nota-input");
  const porcentajes = document.querySelectorAll(".porcentaje-input");
  const resultadoElement = document.getElementById("resultado");
  let resultado = 0;
  let porcentajeTotal = 0;

  for (let i = 0; i < notas.length; i++) {
    const nota = parseFloat(notas[i].value);
    const porcentaje = parseFloat(porcentajes[i].value);

    // Validar valores de entrada
    if (isNaN(nota) || nota < 0 || nota > 10) {
      resultadoElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> La nota ${i + 1} debe estar entre 0 y 10.`;
      resultadoElement.className = "error";
      notas[i].focus();
      return;
    }

    if (isNaN(porcentaje) || porcentaje < 1 || porcentaje > 100) {
      resultadoElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> El porcentaje ${i + 1} debe estar entre 1% y 100%.`;
      resultadoElement.className = "error";
      porcentajes[i].focus();
      return;
    }

    resultado += nota * (porcentaje / 100);
    porcentajeTotal += porcentaje;
  }

  const restante = 100 - porcentajeTotal;

  if (restante <= 0) {
    resultadoElement.innerHTML = 
      '<i class="fas fa-exclamation-circle"></i> El porcentaje total ya es 100% o mayor. No hay porcentaje restante para calcular.';
    resultadoElement.className = "error";
    return;
  }

  // Calcular la nota necesaria para alcanzar un 6 final
  const notaNecesaria = (6 - resultado) / (restante / 100);

  if (notaNecesaria > 10) {
    resultadoElement.innerHTML = 
      `<i class="fas fa-times-circle"></i> No es posible aprobar. Necesitarías más de un 10 (${notaNecesaria.toFixed(2)}).`;
    resultadoElement.className = "error";
  } else if (notaNecesaria < 0) {
    resultadoElement.innerHTML = 
      '<i class="fas fa-check-circle"></i> ¡Ya tienes suficiente para aprobar con un 6!';
    resultadoElement.className = "success";
  } else {
    resultadoElement.innerHTML = 
      `<i class="fas fa-info-circle"></i> Necesitas al menos un ${notaNecesaria.toFixed(2)} en el ${restante}% restante para aprobar.`;
    resultadoElement.className = "";
  }
}