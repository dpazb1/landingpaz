document.addEventListener('DOMContentLoaded', function() {
  const projectSelect = document.getElementById('project-select');
  const roomTypeGroup = document.getElementById('room-type-group');
  const roomTypeSelect = document.getElementById('room-type-select');
  const selectedProjects = new Set();
  const selectedRoomTypes = new Set();

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
      // Focus search input when opening project dropdown
      if (isProjectSelect) {
        const searchInput = selectWrapper.querySelector('.search-input');
        if (searchInput && selectWrapper.classList.contains('active')) {
          searchInput.focus();
        }
      }
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
  }

  function updateDisplay(selectWrapper, selectedSet, options) {
    const selectedContainer = selectWrapper.querySelector('.selected-projects');
    const selectBtn = selectWrapper.querySelector('.select-btn');
    
    // Clear and update selected tags
    selectedContainer.innerHTML = '';
    options.forEach(option => {
      if (option.dataset.value !== 'all' && option.classList.contains('selected')) {
        const tag = document.createElement('div');
        tag.className = 'selected-project';
        tag.innerHTML = `${option.textContent}<span class="remove">×</span>`;
        
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

    // Update button text
    const selectedCount = selectedSet.size;
    selectBtn.textContent = selectedCount > 0 ? `${selectedCount} seleccionados` : 'Selecciona uno o más';

    // Show/hide room type group for project select
    if (selectWrapper.id === 'project-select') {
      roomTypeGroup.style.display = selectedCount > 0 ? 'block' : 'none';
    }
  }

  setupSelect(projectSelect);
  setupSelect(roomTypeSelect);
}); 