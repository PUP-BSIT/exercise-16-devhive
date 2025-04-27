// Global variables
let countryData = [];
let currentUpdateId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadCountryData();
    setupFormListeners();
});

function loadCountryData() {
    const loadingElement = document.querySelector('.loading');
    loadingElement.style.display = 'block';
    
    fetch('https://devhivespace.com/exercise16-api/mejares/mejares-restapi-endpoint.php'
        , {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        countryData = data;
        displayCountryList();
        showMessage("Data loaded successfully", "success");
        loadingElement.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Error loading data: ' + error.message, "error");
        loadingElement.style.display = 'none';
    });
}

function displayCountryList() {
    const tbody = document.getElementById('countryList');
    
    // Clear existing list
    tbody.innerHTML = '';
    
    // table rows for countries
    if (countryData.length > 0) {
        countryData.forEach(item => {
            const row = document.createElement('tr');
            
            // data cells
            [item.country, item.city, item.continent, item.reason_to_visit, '$' 
                + item.estimated_budget].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            
            const actionCell = document.createElement('td');
            
            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Update';
            updateBtn.className = 'action-btn update-btn';
            updateBtn.addEventListener('click', 
                () => updateCountryForm(item.id));
            actionCell.appendChild(updateBtn);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.addEventListener('click', () => deleteCountry(item.id));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
        const noDataRow = document.querySelector('.no-data-row');
        if (noDataRow) {
            noDataRow.style.display = 'none';
        }
    } else {
        const noDataRow = document.createElement('tr');
        noDataRow.className = 'no-data-row';
        
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 6;
        noDataCell.className = 'no-data-message';
        noDataCell.textContent = 'Destination empty, add to bucket list now!';
        
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
    }
}

// Event listeners
function setupFormListeners() {
    const form = document.getElementById('countryForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Submit event
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (currentUpdateId) {
            updateCountryData(e);
        } else {
            createCountry(e);
        }
    });
    
    // Add cancel button if not present
    if (!document.getElementById('cancelUpdateBtn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.id = 'cancelUpdateBtn';
        cancelBtn.className = 'cancel-btn';
        cancelBtn.type = 'button';
        cancelBtn.style.display = 'none';
        
        cancelBtn.addEventListener('click', function() {
            form.reset();
            currentUpdateId = null;
            submitBtn.textContent = 'Add to Bucket List';
            cancelBtn.style.display = 'none';
        });
        
        submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
    }
}

function createCountry(e) {
    const form = e.target;
    const formData = new FormData(form);
    
    const loadingElement = document.querySelector('.loading');
    loadingElement.style.display = 'block';
    
    fetch('https://devhivespace.com/exercise16-api/mejares/mejares-restapi-endpoint.php'
        , {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showMessage('Success: ' + data.message, "success");
        form.reset();
        loadCountryData();
        loadingElement.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error: ' + error.message);
        loadingElement.style.display = 'none';
    });
}

function updateCountryForm(id) {
    // Find country by id
    const country = countryData.find(item => item.id === id);
    if (!country) return;
    
    // Fill form with country data
    const form = document.getElementById('countryForm');
    form.country.value = country.country;
    form.city.value = country.city;
    form.continent.value = country.continent;
    form.reason_to_visit.value = country.reason_to_visit;
    form.estimated_budget.value = country.estimated_budget;
    
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Destination';
    
    
    const cancelBtn = document.getElementById('cancelUpdateBtn');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';
    
    currentUpdateId = id;
    
    form.scrollIntoView({ behavior: 'smooth' });
    
    showMessage("Updating destination: " + country.country, "processing");
}

function updateCountryData(e) {
    const form = e.target;
    const formData = new FormData(form);
    
    // Add ID to form data
    formData.append('id', currentUpdateId);
    
    const loadingElement = document.querySelector('.loading');
    loadingElement.style.display = 'block';
    
    // Convert FormData to URL encoded string for PUT request
    const data = new URLSearchParams();
    for (const pair of formData) {
        data.append(pair[0], pair[1]);
    }
    
    fetch('https://devhivespace.com/exercise16-api/mejares/mejares-restapi-endpoint.php'
        , {
        method: 'PUT',
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showMessage('Success: ' + data.message, "success");
        form.reset();
        
        // Reset form state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add to Bucket List';
        
        const cancelBtn = document.getElementById('cancelUpdateBtn');
        if (cancelBtn) cancelBtn.style.display = 'none';
        
        currentUpdateId = null;
        
        loadCountryData();
        loadingElement.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error: ' + error.message);
        loadingElement.style.display = 'none';
    });
}

function deleteCountry(id) {
    if (!confirm('Confirm deletion of this destination from bucket list?')) {
        return;
    }
    
    const loadingElement = document.querySelector('.loading');
    loadingElement.style.display = 'block';
    
    // Create data with ID
    const data = new URLSearchParams();
    data.append('id', id);
    
    fetch('https://devhivespace.com/exercise16-api/mejares/mejares-restapi-endpoint.php'
        , {
        method: 'DELETE',
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showMessage('Success: ' + data.message, "success");
        loadCountryData();
        loadingElement.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error: ' + error.message);
        loadingElement.style.display = 'none';
    });
}

function showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `terminal-message ${type}`;
    messageElement.innerHTML = `> ${message}<span class="blink">_</span>`;
    
    const searchContainer = document.querySelector('.search-container');
    searchContainer.parentNode.insertBefore(messageElement, 
        searchContainer.nextSibling);
    
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 1000);
    }, 4000);
}

function showError(message) {
    const errorElement = document.querySelector('.error-message');
    errorElement.innerHTML = `<p>${message}</p>`;
    errorElement.style.display = 'block';

    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => {
            errorElement.style.display = 'none';
            errorElement.classList.remove('fade-out');
        }, 1000);
    }, 4000);
}