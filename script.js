document.addEventListener('DOMContentLoaded', function() {
  const projectSelect = document.getElementById('project-select');
  const roomTypeGroup = document.getElementById('room-type-group');
  const roomTypeSelect = document.getElementById('room-type-select');
  const selectedProjects = new Set();
  const selectedRoomTypes = new Set();

  // Input validation setup
  const nameInput = document.getElementById('name');
  const rutInput = document.getElementById('rut');
  const phoneInput = document.getElementById('phone');

  // Name validation - only letters
  nameInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, '');
  });

  // RUT validation
  function formatRUT(value) {
    // Remove all non-alphanumeric characters and convert to lowercase
    value = value.replace(/[^\dk]/gi, '').toLowerCase();
    
    // If empty, return empty
    if (!value) return '';
    
    // Check for 'k' in second to last position and remove it
    if (value.length >= 2 && value.charAt(value.length - 2) === 'k') {
      value = value.slice(0, -2) + value.slice(-1);
    }
    
    // Extract the verifier digit (last character)
    let verifier = '';
    if (value.endsWith('k')) {
      verifier = 'k';
      value = value.slice(0, -1);
    } else if (value.length > 0) {
      verifier = value.slice(-1);
      value = value.slice(0, -1);
    }
    
    // Limit to 8 digits for the main number
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    // Format the main number with dots
    let formattedValue = '';
    for (let i = value.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formattedValue = '.' + formattedValue;
      }
      formattedValue = value[i] + formattedValue;
    }
    
    // Add the verifier with a dash
    if (verifier) {
      formattedValue += '-' + verifier;
    }
    
    return formattedValue;
  }

  rutInput.addEventListener('input', function(e) {
    const start = this.selectionStart;
    const oldValue = this.value;
    
    // Count actual digits (numbers and k) in the current value, ignoring dots and dashes
    const currentDigitCount = oldValue.replace(/[^\dk]/gi, '').length;
    
    // If we're at 9 digits and trying to add more, prevent it
    if (currentDigitCount >= 9) {
      // If the user is trying to add a character (not delete)
      if (this.value.length > oldValue.length) {
        e.preventDefault();
        this.value = oldValue;
        this.setSelectionRange(start, start);
        return;
      }
    }
    
    const newValue = formatRUT(this.value);
    
    // Count actual digits (numbers and k), ignoring dots and dashes
    const digitCount = newValue.replace(/[^\dk]/gi, '').length;
    
    // Only update if within valid length (8-9 digits) and value has changed
    if (digitCount <= 9 && oldValue !== newValue) {
      this.value = newValue;
      
      // Calculate new cursor position
      if (start === oldValue.length) {
        // If cursor was at the end, keep it at the end
        this.setSelectionRange(newValue.length, newValue.length);
      } else {
        // Otherwise, try to maintain the cursor position
        const dotsBeforeOld = (oldValue.slice(0, start).match(/\./g) || []).length;
        const dotsBeforeNew = (newValue.slice(0, start).match(/\./g) || []).length;
        const dashBeforeOld = (oldValue.slice(0, start).match(/-/g) || []).length;
        const dashBeforeNew = (newValue.slice(0, start).match(/-/g) || []).length;
        
        const newPosition = start + (dotsBeforeNew - dotsBeforeOld) + (dashBeforeNew - dashBeforeOld);
        this.setSelectionRange(newPosition, newPosition);
      }
    } else if (digitCount > 9) {
      // If we exceed 9 digits, revert to the old value
      this.value = oldValue;
      this.setSelectionRange(start, start);
    }
  });

  // Add form validation for RUT
  document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset all error states
    document.querySelectorAll('.form-group, .checkbox-group').forEach(group => {
        group.classList.remove('error');
    });
    
    let isValid = true;

    // Validate name
    if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('error');
        isValid = false;
    }

    // Validate RUT
    const rutValue = rutInput.value.replace(/[^\dk]/gi, '').toLowerCase();
    const digitCount = rutValue.length;
    
    if (digitCount < 8 || digitCount > 9 || (rutValue.includes('k') && rutValue.charAt(rutValue.length - 1) !== 'k')) {
        rutInput.closest('.form-group').classList.add('error');
        isValid = false;
    }

    // Validate phone
    const phoneValue = phoneInput.value.replace(/\s/g, '');
    if (!phoneValue || phoneValue.length !== 8 || !/^\d+$/.test(phoneValue)) {
        phoneInput.closest('.form-group').classList.add('error');
        isValid = false;
    }

    // Validate email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('error');
        isValid = false;
    }

    // Validate project selection
    const projectSelect = document.getElementById('project-select');
    const selectedProjects = projectSelect.querySelector('.selected-projects').children.length;
    if (selectedProjects === 0) {
        projectSelect.closest('.form-group').classList.add('error');
        isValid = false;
    }

    // Validate room type if visible
    const roomTypeGroup = document.getElementById('room-type-group');
    if (roomTypeGroup.style.display !== 'none') {
        const roomTypeSelect = document.getElementById('room-type-select');
        const selectedRoomTypes = roomTypeSelect.querySelector('.selected-projects').children.length;
        if (selectedRoomTypes === 0) {
            roomTypeGroup.classList.add('error');
            isValid = false;
        }
    }

    // Validate terms
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        termsCheckbox.closest('.checkbox-group').classList.add('error');
        isValid = false;
    }

    if (isValid) {
        const formContainer = this.closest('.form-container');
        if (formContainer) {
            formContainer.innerHTML = `
                <h3 class="form-title">Inscríbete aquí</h3>
                <div class="success-message">
                    ¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.
                </div>
            `;
            formContainer.style.height = 'auto';
            formContainer.style.maxHeight = 'none';
            formContainer.style.minHeight = '200px';
            setTimeout(() => {
                formContainer.scrollTo({ top: formContainer.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
        return;
    }
    // If there are errors, scroll to the first error field inside the form
    const formContainer = this.closest('.form-container');
    const firstError = this.querySelector('.form-group.error, .checkbox-group.error');
    if (formContainer && firstError) {
      const formRect = formContainer.getBoundingClientRect();
      const errorRect = firstError.getBoundingClientRect();
      // Calculate the scroll position relative to the form container
      const scrollTop = formContainer.scrollTop + (errorRect.top - formRect.top) - 20; // 20px offset for padding
      formContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  });

  // Phone number validation with prefix
  let lastPhoneValue = '';
  const prefixWrapper = document.querySelector('.phone-prefix-wrapper');
  const prefixBtn = prefixWrapper.querySelector('.select-btn');
  const prefixOptions = prefixWrapper.querySelectorAll('.option');
  let selectedPrefix = '569'; // Default prefix

  // Handle prefix selection
  prefixBtn.addEventListener('click', () => {
    prefixWrapper.classList.toggle('active');
  });

  prefixOptions.forEach(option => {
    option.addEventListener('click', () => {
      selectedPrefix = option.dataset.value;
      prefixBtn.innerHTML = `<span class="select-btn-text">${option.textContent}</span>`;
      prefixWrapper.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!prefixWrapper.contains(e.target)) {
      prefixWrapper.classList.remove('active');
    }
  });

  function formatPhoneNumber(value) {
    // Remove all non-numeric characters
    value = value.replace(/[^0-9]/g, '');
    
    // Limit to 8 digits
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    // Format as XXXX XXXX
    if (value.length > 4) {
      value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    
    return value;
  }

  phoneInput.addEventListener('input', function(e) {
    // Get the current cursor position
    const cursorPosition = this.selectionStart;
    
    // Format the number
    let formattedValue = formatPhoneNumber(this.value);
    
    // Only update if the value has actually changed and is different from the last value
    if (this.value !== formattedValue && lastPhoneValue !== formattedValue) {
      lastPhoneValue = formattedValue;
      this.value = formattedValue;
      
      // Calculate new cursor position
      let newCursorPosition = cursorPosition;
      if (cursorPosition === 5 && formattedValue.length > 4) {
        newCursorPosition = 6; // Move cursor after the space
      } else if (cursorPosition > 4 && formattedValue.length > 4) {
        newCursorPosition = cursorPosition + 1; // Adjust for the space
      }
      
      // Restore cursor position
      setTimeout(() => {
        this.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  });

  // Handle form submission to add the prefix
  document.querySelector('form').addEventListener('submit', function(e) {
    const phoneValue = phoneInput.value.replace(/[^0-9]/g, '');
    if (phoneValue.length === 8) {
      const fullPhoneNumber = selectedPrefix + phoneValue;
      // You can store this value or send it to your backend
      console.log('Full phone number:', fullPhoneNumber);
    }
  });

  function setupSelect(selectWrapper) {
    const selectBtn = selectWrapper.querySelector('.select-btn');
    const selectContent = selectWrapper.querySelector('.select-content');
    const options = Array.from(selectWrapper.querySelectorAll('.option'));
    const selectedContainer = selectWrapper.querySelector('.selected-projects');
    const isProjectSelect = selectWrapper.id === 'project-select';
    const selectedSet = isProjectSelect ? selectedProjects : selectedRoomTypes;

    // Setup search functionality for project select only
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

        // Prevent dropdown from closing when clicking search
        searchInput.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    }

    selectBtn.addEventListener('click', () => {
      selectWrapper.classList.toggle('active');
      // Do NOT auto-focus the search input anymore
      // if (isProjectSelect) {
      //   const searchInput = selectWrapper.querySelector('.search-input');
      //   if (searchInput && selectWrapper.classList.contains('active')) {
      //     searchInput.focus();
      //   }
      // }
    });

    // Handle "Todos" option
    const allOption = options.find(opt => opt.dataset.value === 'all');
    if (allOption) {
      allOption.addEventListener('click', () => {
        const regularOptions = options.filter(opt => opt.dataset.value !== 'all');
        const isAllSelected = allOption.classList.contains('selected');

        if (isAllSelected) {
          // Deselect everything
          regularOptions.forEach(opt => {
            opt.classList.remove('selected');
            selectedSet.delete(opt.dataset.value);
          });
          allOption.classList.remove('selected');
        } else {
          // Select all regular options
          regularOptions.forEach(opt => {
            if (opt.style.display !== 'none') { // Only select visible options
              opt.classList.add('selected');
              selectedSet.add(opt.dataset.value);
            }
          });
          allOption.classList.add('selected');
        }
        updateDisplay(selectWrapper, selectedSet, options);
      });
    }

    // Handle individual options
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
            
            // Check if all regular options are selected
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

    document.addEventListener('click', (e) => {
      if (!selectWrapper.contains(e.target)) {
        selectWrapper.classList.remove('active');
      }
    });

    // For project select
    if (isProjectSelect) {
      selectBtn.innerHTML = '<span class="select-btn-text">Selecciona uno o más proyectos</span>';
    } else {
      selectBtn.innerHTML = '<span class="select-btn-text">Selecciona uno o más tipos</span>';
    }

    // In setupSelect, update the initial button text for prefix select as well
    if (selectWrapper.classList.contains('phone-prefix-wrapper')) {
      selectBtn.innerHTML = '<span class="select-btn-text">+56 9</span>';
    }
  }

  function updateDisplay(selectWrapper, selectedSet, options) {
    const selectedContainer = selectWrapper.querySelector('.selected-projects');
    const selectBtn = selectWrapper.querySelector('.select-btn');
    const formGroup = selectWrapper.closest('.form-group');

    // Clear and update selected tags
    selectedContainer.innerHTML = '';
    let hasTags = false;
    options.forEach(option => {
      if (option.dataset.value !== 'all' && option.classList.contains('selected')) {
        hasTags = true;
        const tag = document.createElement('div');
        tag.className = 'selected-project';
        // Only use the project name (text before the comuna span)
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

    // Force .form-group to auto height if tags are present
    if (formGroup) {
      if (hasTags) {
        formGroup.style.height = 'auto';
        formGroup.style.minHeight = '42.5px';
      } else {
        formGroup.style.height = '';
        formGroup.style.minHeight = '';
      }
    }

    // Update button text
    const selectedCount = selectedSet.size;
    selectBtn.innerHTML = `<span class="select-btn-text">${selectedCount > 0 ? `${selectedCount} seleccionados` : 'Selecciona uno o más'}</span>`;

    // Show/hide room type group for project select
    if (selectWrapper.id === 'project-select') {
      roomTypeGroup.style.display = selectedCount > 0 ? 'block' : 'none';
    }
  }

  setupSelect(projectSelect);
  setupSelect(roomTypeSelect);
});

// Add input event listeners to clear error states
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', function() {
        this.closest('.form-group, .checkbox-group')?.classList.remove('error');
    });
});

// Add change event listeners for checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        this.closest('.checkbox-group')?.classList.remove('error');
    });
});

// Add change event listeners for project and room type selects
document.querySelectorAll('.select-wrapper').forEach(select => {
    select.addEventListener('click', function() {
        this.closest('.form-group')?.classList.remove('error');
    });
}); 