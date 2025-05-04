// =============================
// Script principal del formulario de landing inmobiliaria
// =============================

document.addEventListener('DOMContentLoaded', function() {
  // === Referencias a elementos principales del DOM ===
  const projectSelect = document.getElementById('project-select');
  const roomTypeGroup = document.getElementById('room-type-group');
  const roomTypeSelect = document.getElementById('room-type-select');
  const selectedProjects = new Set();
  const selectedRoomTypes = new Set();

  // === Inputs del formulario ===
  const nameInput = document.getElementById('name');
  const rutInput = document.getElementById('rut');
  const phoneInput = document.getElementById('phone');

  // === Validación de nombre: solo letras ===
  nameInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
  });

  // === Función para formatear y validar el RUT chileno ===
  function formatRUT(value) {
    // Elimina caracteres no válidos y convierte a minúsculas
    value = value.replace(/[^\dk]/gi, '').toLowerCase();
    if (!value) return '';
    if (value.length >= 2 && value.charAt(value.length - 2) === 'k') {
      value = value.slice(0, -2) + value.slice(-1);
    }
    // Extrae dígito verificador
    let verifier = '';
    if (value.endsWith('k')) {
      verifier = 'k';
      value = value.slice(0, -1);
    } else if (value.length > 0) {
      verifier = value.slice(-1);
      value = value.slice(0, -1);
    }
    // Limita a 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    // Formatea con puntos
    let formattedValue = '';
    for (let i = value.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formattedValue = '.' + formattedValue;
      }
      formattedValue = value[i] + formattedValue;
    }
    // Agrega verificador
    if (verifier) {
      formattedValue += '-' + verifier;
    }
    return formattedValue;
  }

  // === Validación y formateo en tiempo real del RUT ===
  rutInput.addEventListener('input', function(e) {
    const start = this.selectionStart;
    const oldValue = this.value;
    const currentDigitCount = oldValue.replace(/[^\dk]/gi, '').length;
    if (currentDigitCount >= 9) {
      if (this.value.length > oldValue.length) {
        e.preventDefault();
        this.value = oldValue;
        this.setSelectionRange(start, start);
        return;
      }
    }
    const newValue = formatRUT(this.value);
    const digitCount = newValue.replace(/[^\dk]/gi, '').length;
    if (digitCount <= 9 && oldValue !== newValue) {
      this.value = newValue;
      // Mantiene la posición del cursor
      if (start === oldValue.length) {
        this.setSelectionRange(newValue.length, newValue.length);
      } else {
        const dotsBeforeOld = (oldValue.slice(0, start).match(/\./g) || []).length;
        const dotsBeforeNew = (newValue.slice(0, start).match(/\./g) || []).length;
        const dashBeforeOld = (oldValue.slice(0, start).match(/-/g) || []).length;
        const dashBeforeNew = (newValue.slice(0, start).match(/-/g) || []).length;
        const newPosition = start + (dotsBeforeNew - dotsBeforeOld) + (dashBeforeNew - dashBeforeOld);
        this.setSelectionRange(newPosition, newPosition);
      }
    } else if (digitCount > 9) {
      this.value = oldValue;
      this.setSelectionRange(start, start);
    }
  });

  // === Validación y envío del formulario ===
  document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Limpia estados de error
    document.querySelectorAll('.form-group, .checkbox-group').forEach(group => {
        group.classList.remove('error');
    });
    let isValid = true;
    // Validación de nombre
    if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('error');
        isValid = false;
    }
    // Validación de RUT
    const rutValue = rutInput.value.replace(/[^\dk]/gi, '').toLowerCase();
    const digitCount = rutValue.length;
    if (digitCount < 8 || digitCount > 9 || (rutValue.includes('k') && rutValue.charAt(rutValue.length - 1) !== 'k')) {
        rutInput.closest('.form-group').classList.add('error');
        isValid = false;
    }
    // Validación de teléfono
    const phoneValue = phoneInput.value.replace(/\s/g, '');
    if (!phoneValue || phoneValue.length !== 8 || !/^\d+$/.test(phoneValue)) {
        phoneInput.closest('.form-group').classList.add('error');
        isValid = false;
    }
    // Validación de email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('error');
        isValid = false;
    }
    // Validación de selección de proyecto
    const projectSelect = document.getElementById('project-select');
    const selectedProjects = projectSelect.querySelector('.selected-projects').children.length;
    if (selectedProjects === 0) {
        projectSelect.closest('.form-group').classList.add('error');
        isValid = false;
    }
    // Validación de tipo de departamento si está visible
    const roomTypeGroup = document.getElementById('room-type-group');
    if (roomTypeGroup.style.display !== 'none') {
        const roomTypeSelect = document.getElementById('room-type-select');
        const selectedRoomTypes = roomTypeSelect.querySelector('.selected-projects').children.length;
        if (selectedRoomTypes === 0) {
            roomTypeGroup.classList.add('error');
            isValid = false;
        }
    }
    // Validación de términos
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        termsCheckbox.closest('.checkbox-group').classList.add('error');
        isValid = false;
    }
    // Si es válido, muestra mensaje de éxito y resetea
    if (isValid) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = '¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.';
        this.appendChild(successMessage);
        this.reset();
        document.getElementById('project-select').querySelector('.selected-projects').innerHTML = '';
        document.getElementById('project-select').querySelector('.select-btn').innerHTML = '<span class="select-btn-text">Selecciona uno o más proyectos</span>';
        document.getElementById('room-type-select').querySelector('.selected-projects').innerHTML = '';
        document.getElementById('room-type-select').querySelector('.select-btn').innerHTML = '<span class="select-btn-text">Selecciona uno o más tipos</span>';
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
  });

  // === Lógica para el prefijo del teléfono ===
  let lastPhoneValue = '';
  const prefixWrapper = document.querySelector('.phone-prefix-wrapper');
  const prefixBtn = prefixWrapper.querySelector('.select-btn');
  const prefixOptions = prefixWrapper.querySelectorAll('.option');
  let selectedPrefix = '569'; // Prefijo por defecto

  // Mostrar/ocultar el dropdown de prefijo
  prefixBtn.addEventListener('click', () => {
    prefixWrapper.classList.toggle('active');
  });

  // Selección de prefijo
  prefixOptions.forEach(option => {
    option.addEventListener('click', () => {
      selectedPrefix = option.dataset.value;
      prefixBtn.innerHTML = `<span class="select-btn-text">${option.textContent}</span>`;
      prefixWrapper.classList.remove('active');
    });
  });

  // Cierra el dropdown si se hace click fuera
  document.addEventListener('click', (e) => {
    if (!prefixWrapper.contains(e.target)) {
      prefixWrapper.classList.remove('active');
    }
  });

  // Formatea el número de teléfono en tiempo real
  function formatPhoneNumber(value) {
    value = value.replace(/[^0-9]/g, '');
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    if (value.length > 4) {
      value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    return value;
  }

  phoneInput.addEventListener('input', function(e) {
    const cursorPosition = this.selectionStart;
    let formattedValue = formatPhoneNumber(this.value);
    if (this.value !== formattedValue && lastPhoneValue !== formattedValue) {
      lastPhoneValue = formattedValue;
      this.value = formattedValue;
      let newCursorPosition = cursorPosition;
      if (cursorPosition === 5 && formattedValue.length > 4) {
        newCursorPosition = 6;
      } else if (cursorPosition > 4 && formattedValue.length > 4) {
        newCursorPosition = cursorPosition + 1;
      }
      setTimeout(() => {
        this.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  });

  // Al enviar el formulario, muestra el número completo en consola (puedes enviar al backend aquí)
  document.querySelector('form').addEventListener('submit', function(e) {
    const phoneValue = phoneInput.value.replace(/[^0-9]/g, '');
    if (phoneValue.length === 8) {
      const fullPhoneNumber = selectedPrefix + phoneValue;
      console.log('Full phone number:', fullPhoneNumber);
    }
  });

  // === Dropdowns personalizados para proyectos y tipos ===
  function setupSelect(selectWrapper) {
    const selectBtn = selectWrapper.querySelector('.select-btn');
    const selectContent = selectWrapper.querySelector('.select-content');
    const options = Array.from(selectWrapper.querySelectorAll('.option'));
    const selectedContainer = selectWrapper.querySelector('.selected-projects');
    const isProjectSelect = selectWrapper.id === 'project-select';
    const selectedSet = isProjectSelect ? selectedProjects : selectedRoomTypes;

    // Búsqueda en el dropdown de proyectos
    if (isProjectSelect) {
      const searchInput = selectWrapper.querySelector('.search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          options.forEach(option => {
            if (option.dataset.value === 'all') {
              option.style.display = searchTerm ? 'none' : '';
              return;
            }
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? '' : 'none';
          });
        });
        // Evita que se cierre el dropdown al hacer click en el buscador
        searchInput.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }

    // Abre/cierra el dropdown
    selectBtn.addEventListener('click', () => {
      selectWrapper.classList.toggle('active');
      if (isProjectSelect) {
        const searchInput = selectWrapper.querySelector('.search-input');
        if (searchInput && selectWrapper.classList.contains('active')) {
          searchInput.focus();
        }
      }
    });

    // Lógica para seleccionar "Todos"
    const allOption = options.find(opt => opt.dataset.value === 'all');
    if (allOption) {
      allOption.addEventListener('click', () => {
        const regularOptions = options.filter(opt => opt.dataset.value !== 'all');
        const isAllSelected = allOption.classList.contains('selected');
        if (isAllSelected) {
          // Deselecciona todo
          regularOptions.forEach(opt => {
            opt.classList.remove('selected');
            selectedSet.delete(opt.dataset.value);
          });
          allOption.classList.remove('selected');
        } else {
          // Selecciona todo
          regularOptions.forEach(opt => {
            if (opt.style.display !== 'none') {
              opt.classList.add('selected');
              selectedSet.add(opt.dataset.value);
            }
          });
          allOption.classList.add('selected');
        }
        updateDisplay(selectWrapper, selectedSet, options);
      });
    }

    // Lógica para seleccionar/deseleccionar opciones individuales
    options.forEach(option => {
      if (option.dataset.value !== 'all') {
        option.addEventListener('click', () => {
          const isSelected = option.classList.contains('selected');
          if (isSelected) {
            option.classList.remove('selected');
            selectedSet.delete(option.dataset.value);
            if (allOption) allOption.classList.remove('selected');
          } else {
            option.classList.add('selected');
            selectedSet.add(option.dataset.value);
            const regularOptions = options.filter(opt => opt.dataset.value !== 'all');
            const allRegularSelected = regularOptions.every(opt => opt.classList.contains('selected'));
            if (allRegularSelected && allOption) {
              allOption.classList.add('selected');
            }
          }
          updateDisplay(selectWrapper, selectedSet, options);
        });
      }
    });

    // Cierra el dropdown si se hace click fuera
    document.addEventListener('click', (e) => {
      if (!selectWrapper.contains(e.target)) {
        selectWrapper.classList.remove('active');
      }
    });

    // Texto inicial de los botones
    if (isProjectSelect) {
      selectBtn.innerHTML = '<span class="select-btn-text">Selecciona uno o más proyectos</span>';
    } else {
      selectBtn.innerHTML = '<span class="select-btn-text">Selecciona uno o más tipos</span>';
    }
    // Para el prefijo
    if (selectWrapper.classList.contains('phone-prefix-wrapper')) {
      selectBtn.innerHTML = '<span class="select-btn-text">+56 9</span>';
    }
  }

  // === Actualiza la visualización de los tags seleccionados y el botón ===
  function updateDisplay(selectWrapper, selectedSet, options) {
    const selectedContainer = selectWrapper.querySelector('.selected-projects');
    const selectBtn = selectWrapper.querySelector('.select-btn');
    const formGroup = selectWrapper.closest('.form-group');
    // Limpia y agrega los tags
    selectedContainer.innerHTML = '';
    let hasTags = false;
    options.forEach(option => {
      if (option.dataset.value !== 'all' && option.classList.contains('selected')) {
        hasTags = true;
        const tag = document.createElement('div');
        tag.className = 'selected-project';
        let projectName = option.childNodes[0].textContent.trim();
        tag.innerHTML = `${projectName}<span class="remove">×</span>`;
        tag.querySelector('.remove').addEventListener('click', (e) => {
          e.stopPropagation();
          option.classList.remove('selected');
          selectedSet.delete(option.dataset.value);
          const allOption = options.find(opt => opt.dataset.value === 'all');
          if (allOption) allOption.classList.remove('selected');
          updateDisplay(selectWrapper, selectedSet, options);
        });
        selectedContainer.appendChild(tag);
      }
    });
    // Fuerza el alto del form-group si hay tags
    if (formGroup) {
      if (hasTags) {
        formGroup.style.height = 'auto';
        formGroup.style.minHeight = '42.5px';
      } else {
        formGroup.style.height = '';
        formGroup.style.minHeight = '';
      }
    }
    // Actualiza el texto del botón
    const selectedCount = selectedSet.size;
    selectBtn.innerHTML = `<span class="select-btn-text">${selectedCount > 0 ? `${selectedCount} seleccionados` : 'Selecciona uno o más'}</span>`;
    // Muestra/oculta el grupo de tipos según selección de proyecto
    if (selectWrapper.id === 'project-select') {
      roomTypeGroup.style.display = selectedCount > 0 ? 'block' : 'none';
    }
  }

  // Inicializa los dropdowns personalizados
  setupSelect(projectSelect);
  setupSelect(roomTypeSelect);
});

// === Limpia errores al escribir o cambiar selección ===
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', function() {
        this.closest('.form-group, .checkbox-group')?.classList.remove('error');
    });
});

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        this.closest('.checkbox-group')?.classList.remove('error');
    });
});

document.querySelectorAll('.select-wrapper').forEach(select => {
    select.addEventListener('click', function() {
        this.closest('.form-group')?.classList.remove('error');
    });
});
// =============================
// Fin del script principal
// ============================= 