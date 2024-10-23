function initStatEntry(statListEl, positionRadioEl, stats, positions, events) {

const listEl = statListEl.querySelector('ul');
const radioEl = positionRadioEl.querySelector('div');

// Initialize list and radio items
const statListItems = {};
const positionRadioItems = {};
positions = positions.sort((a, b) => {
    return a.localeCompare(b);
})

const orderedStats = [
  'Bench', 'Squat', 'Power Clean', '225lb Bench', 
  '10-Yard Dash', 'Vertical Jump (vertec)', 'Vertical Jump (mat)', 'Broad Jump', '60-Yard Shuttle', 'L Drill', 'Pro Agility', 'Flying 10', // Agility stats
  'Height', 'Weight', 'Wingspan'  
];

const unitMapping = {
  pounds: ['Bench', 'Squat', 'Power Clean', 'Weight'],
  reps: ['225lb Bench'],
  inches: ['Vertical Jump (vertec)', 'Vertical Jump (mat)', 'Broad Jump', 'Height', 'Wingspan'],
  seconds: ['10-Yard Dash', '60-Yard Shuttle', 'L Drill', 'Pro Agility', 'Flying 10']
};

  function getUnit(stat) {
    if (unitMapping.pounds.includes(stat)) {
      return 'pounds';
    } else if (unitMapping.reps.includes(stat)) {
      return 'reps';
    } else if (unitMapping.inches.includes(stat)) {
      return 'inches';
    } else if (unitMapping.seconds.includes(stat)) {
      return 'seconds';
    }
    return ''; 
  }

// Update position label
function updatePositionTitle(position) {
    const titleEl = document.getElementById('position-title');
    if (titleEl) {
        titleEl.textContent = `Position Group: ${position}`;
    }
} 

  function initListItems() {
    // Loop through orderedStats to ensure correct order
    for (const stat of orderedStats) {
      if (stats.includes(stat)) { 
        const unit = getUnit(stat); 
        const item = document.createElement('li');
        item.innerHTML = `
        <label>
        ${stat}
        <div class="input-wrapper">
        <input type="number" id="athlete-stat-${stat}" name="${stat}" max="1000">
        <span class="unit">${unit}</span>
        </div>
        </label>
        `;
        statListItems[stat] = item;
      }
    }
  }

// Initialize radio items
function initRadioItems() {
    for (const position of positions) {
        const label = document.createElement('label');
        const item = document.createElement('input');
        item.type = 'radio';
        item.name = 'position';
        item.value = position;

        label.appendChild(item);
        label.appendChild(document.createTextNode(` ${position}`));

        positionRadioItems[position] = label;
    }
}

initRadioItems();
initListItems();

// Populate list
function populateList(stats) {
    listEl.innerHTML = '';

    for (const stat of orderedStats) {
      if (stats.includes(stat)) { 
        const item = statListItems[stat];
        listEl.append(item);
      }
    }
  }

// Populate radio
function populateRadio(positions) {
    radioEl.innerHTML = '';

for (const position of positions) {
    const item = positionRadioItems[position];
    radioEl.append(item);
}
}

populateRadio(positions);
populateList(stats);

/*  function handleNumEntry(evt) {

    const numInput = evt.target;
    const statName = numInput.name;
    const filled = numInput.value !== '' && numInput.value !== null && numInput.value > 0;
    const statValue = filled ? parseFloat(numInput.value) : null;

    if (numInput.checkValidity() == false) {
      numInput.setCustomValidity('Please enter a valid number');
      numInput.reportValidity();
      return;
    }

    const event = new CustomEvent('statFilled', {
      detail: { statName, filled, statValue }
    });
    events.dispatchEvent(event);
  }
 */

  function handleNumEntry(evt) {
    const numInput = evt.target;
    const statName = numInput.name;
    const filled = numInput.value !== '' && numInput.value !== null && numInput.value > 0;
    const statValue = filled ? parseFloat(numInput.value) : null;
  
    numInput.setCustomValidity('');  
  
    // Check if the value is invalid (e.g., value <= 0 or empty)
    if (!numInput.checkValidity() || numInput.value <= 0) {
      numInput.setCustomValidity('That seems high. Please enter a valid number');
      numInput.reportValidity();
      return;
    }
  
    // Dispatch the custom event if the input is valid
    const event = new CustomEvent('statFilled', {
      detail: { statName, filled, statValue }
    });
    events.dispatchEvent(event);
  }

  function handleRadioEntry(evt) {
    const radioInput = evt.target;
    const position = radioInput.value;

    updatePositionTitle(position);

    const event = new CustomEvent('positionSelected', {
      detail: { position }
    });
    events.dispatchEvent(event);
  }

  for (const item of Object.values(statListItems)) {
    const numInput = item.querySelector('input');
    numInput.addEventListener('input', handleNumEntry);
  }

for (const item of Object.values(positionRadioItems)) {
    const radioInput = item.querySelector('input');
    radioInput.addEventListener('change', handleRadioEntry);
}
}

export { initStatEntry };