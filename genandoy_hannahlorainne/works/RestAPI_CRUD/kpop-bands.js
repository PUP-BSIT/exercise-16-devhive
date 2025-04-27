document.addEventListener("DOMContentLoaded", function() {
    const API_URL = "https://devhivespace.com/exercise16-api/genandoy/genandoy-restapi-endpoint.php";
    
    const bandsList = document.getElementById("bands-list");
    const bandForm = document.getElementById("band-form");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const addBandBtn = document.getElementById("add-band-btn");
    const formTitle = document.getElementById("form-title");
    const messageBox = document.getElementById("message-box");
    const formCancel = document.getElementById("form-cancel");
    
    const bandNameInput = document.getElementById("band-name");
    const debutYearInput = document.getElementById("debut-year");
    const companyInput = document.getElementById("company");
    const membersInput = document.getElementById("members");
    const fandomNameInput = document.getElementById("fandom-name");
    const hiddenIdInput = document.getElementById("hidden-band-id");
    
    let currentMode = "add"; 

    addBandBtn.addEventListener("click", showAddBandForm);
    searchBtn.addEventListener("click", searchBands);
    bandForm.addEventListener("submit", handleFormSubmit);
    formCancel.addEventListener("click", function() {
        resetForm();
        bandForm.classList.add("hidden");
    });
    
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchBands();
        }
    });
    
    loadAllBands();
    
    function loadAllBands() {
        showMessage("Loading K-pop bands...", "info");
        
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch bands");
                }
                return response.json();
            })
            .then(bands => {
                displayBands(bands);
                showMessage("", "");
            })
            .catch(error => {
                showMessage(`Error: ${error.message}`, "error");
                console.error("Error loading bands:", error);
            });
    }
    
    function displayBands(bands) {
        bandsList.innerHTML = "";
        
        if (bands.length === 0) {
            bandsList.innerHTML = `<p class="no-results">K-pop bands empty</p>`;
            return;
        }
        
        bands.forEach(band => {
            const bandCard = document.createElement("div");
            bandCard.className = "band-card";
            
            bandCard.innerHTML = `
                <h3>${band.name}</h3>
                <div class="band-info">
                    <p><span>Debut Year:</span> ${band.debutYear}</p>
                    <p><span>Company:</span> ${band.company}</p>
                    <p><span>Members:</span> ${band.members}</p>
                    <p><span>Fandom Name:</span> ${band.fandomName}</p>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" data-id="${band.id}">Edit</button>
                    <button class="delete-btn" data-id="
                        ${band.id}">Delete</button>
                </div>
            `;
            
            bandsList.appendChild(bandCard);
            
            bandCard.querySelector(".edit-btn").addEventListener("click", 
                () => editBand(band));
            bandCard.querySelector(".delete-btn").addEventListener("click", 
                () => deleteBand(band.id));
        });
    }
    
    function searchBands() {
        const query = searchInput.value.trim();
        
        if (!query) {
            loadAllBands();
            return;
        }
        
        showMessage(`Searching for "${query}"...`, "info");
        
        fetch(`${API_URL}?name=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Search failed");
                }
                return response.json();
            })
            .then(bands => {
                displayBands(bands);
                showMessage("", "");
            })
            .catch(error => {
                showMessage(`Error: ${error.message}`, "error");
                console.error("Error searching bands:", error);
            });
    }
    
    function showAddBandForm() {
        currentMode = "add";
        formTitle.textContent = "Add New K-pop Band";
        resetForm();
        bandForm.classList.remove("hidden");
        document.getElementById("form-submit").textContent = "Add Band";
        
        bandForm.scrollIntoView({ behavior: "smooth" });
    }
    
    function editBand(band) {
        currentMode = "edit";
        formTitle.textContent = "Edit K-pop Band";

        bandNameInput.value = band.name;
        debutYearInput.value = band.debutYear;
        companyInput.value = band.company;
        membersInput.value = band.members;
        fandomNameInput.value = band.fandomName;
        hiddenIdInput.value = band.id;
        
        bandForm.classList.remove("hidden");
        document.getElementById("form-submit").textContent = "Update Band";

        bandForm.scrollIntoView({ behavior: "smooth" });
    }
    
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const bandData = {
            name: bandNameInput.value.trim(),
            debutYear: debutYearInput.value.trim(),
            company: companyInput.value.trim(),
            members: membersInput.value.trim(),
            fandomName: fandomNameInput.value.trim()
        };
        
        if (!bandData.name || !bandData.debutYear || !bandData.company || 
            !bandData.members || !bandData.fandomName) {
            showMessage("Please fill in all fields", "error");
            return;
        }
        
        if (currentMode === "add") {
            addBand(bandData);
        } else {
            updateBand(hiddenIdInput.value, bandData);
        }
    }
    
    function addBand(bandData) {
        showMessage("Adding new band...", "info");
        
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bandData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add band");
            }
            return response.json();
        })
        .then(data => {
            showMessage("Band added successfully!", "success");
            resetForm();
            bandForm.classList.add("hidden");
            loadAllBands();
            
            setTimeout(() => {
                showMessage("", "");
            }, 3000);
        })
        .catch(error => {
            showMessage(`Error: ${error.message}`, "error");
            console.error("Error adding band:", error);
        });
    }
    
    function updateBand(id, bandData) {
        showMessage("Updating band...", "info");
        
        fetch(`${API_URL}?id=${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bandData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update band");
            }
            return response.json();
        })
        .then(data => {
            showMessage("Band updated successfully!", "success");
            resetForm();
            bandForm.classList.add("hidden");
            loadAllBands();
            
            setTimeout(() => {
                showMessage("", "");
            }, 3000);
        })
        .catch(error => {
            showMessage(`Error: ${error.message}`, "error");
            console.error("Error updating band:", error);
        });
    }
    
    function deleteBand(id) {
        if (!confirm("Are you sure you want to delete this band?")) {
            return;
        }
        
        showMessage("Deleting band...", "info");
        
        fetch(`${API_URL}?id=${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete band");
            }
            return response.json();
        })
        .then(data => {
            showMessage("Band deleted successfully!", "success");
            loadAllBands();
            
            setTimeout(() => {
                showMessage("", "");
            }, 3000);
        })
        .catch(error => {
            showMessage(`Error: ${error.message}`, "error");
            console.error("Error deleting band:", error);
        });
    }
    
    function resetForm() {
        bandForm.reset();
        hiddenIdInput.value = "";
    }
    
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        
        if (message) {
            messageBox.classList.remove("hidden");
        } else {
            messageBox.classList.add("hidden");
        }
    }
});