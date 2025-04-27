document.addEventListener("DOMContentLoaded", function () {
  const API_URL =
    "https://devhivespace.com/exercise16-api/esparagoza/local-bands.php";

  const bandsList = document.getElementById("bands-list");
  const bandForm = document.getElementById("band-form");
  const addBandForm = document.getElementById("add-band-form");
  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const closeBtn = document.querySelector(".close-btn");

  const bandNameInput = document.getElementById("band-name");
  const bandGenreInput = document.getElementById("band-genre");
  const bandYearInput = document.getElementById("band-year");
  const bandHometownInput = document.getElementById("band-hometown");
  const bandMembersInput = document.getElementById("band-members");
  const bandDescriptionInput = document.getElementById("band-description");

  const editIdInput = document.getElementById("edit-id");
  const editNameInput = document.getElementById("edit-name");
  const editGenreInput = document.getElementById("edit-genre");
  const editYearInput = document.getElementById("edit-year");
  const editHometownInput = document.getElementById("edit-hometown");
  const editMembersInput = document.getElementById("edit-members");
  const editDescriptionInput = document.getElementById("edit-description");

  bandForm.addEventListener("submit", handleAddBand);
  editForm.addEventListener("submit", handleUpdateBand);

  closeBtn.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  });

  loadAllBands();

  function loadAllBands() {
    showLoading(true);

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bands");
        }
        return response.json();
      })
      .then((bands) => {
        displayBands(bands);
        showLoading(false);
      })
      .catch((error) => {
        showError("Error loading bands: " + error.message);
        console.error("Error loading bands:", error);
        showLoading(false);
      });
  }

  function displayBands(bands) {
    bandsList.innerHTML = "";

    if (bands.length === 0) {
      bandsList.innerHTML = `<p class="no-results">No bands found</p>`;
      return;
    }

    bands.forEach((band) => {
      const bandCard = document.createElement("div");
      bandCard.className = "band-card";

      bandCard.innerHTML = `
        <h3>${band.name}</h3>
        <div class="band-info">
          <p><strong>Genre:</strong> ${band.genre}</p>
          <p><strong>Year Formed:</strong> ${band.year}</p>
          <p><strong>Hometown:</strong> ${band.hometown}</p>
          <p><strong>Members:</strong> ${band.members}</p>
          <div class="description">
            <p><strong>Description:</strong></p>
            <p>${band.description}</p>
          </div>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-id="${band.id}">Edit</button>
          <button class="delete-btn" data-id="${band.id}">Delete</button>
        </div>
      `;

      bandsList.appendChild(bandCard);

      bandCard.querySelector(".edit-btn").addEventListener(
        "click",
        () => openEditModal(band)
      );
      bandCard.querySelector(".delete-btn").addEventListener(
        "click",
        () => deleteBand(band.id)
      );
    });
  }

  function handleAddBand(event) {
    event.preventDefault();

    const bandData = {
      name: bandNameInput.value.trim(),
      genre: bandGenreInput.value.trim(),
      year: bandYearInput.value.trim(),
      hometown: bandHometownInput.value.trim(),
      members: bandMembersInput.value.trim(),
      description: bandDescriptionInput.value.trim(),
    };

    if (!validateBandData(bandData)) {
      showError("Please fill in all fields correctly");
      return;
    }

    addBand(bandData);
  }

  function addBand(bandData) {
    showLoading(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bandData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add band");
        }
        return response.json();
      })
      .then((data) => {
        showSuccess("Band added successfully!");
        resetForm(bandForm);
        loadAllBands();
      })
      .catch((error) => {
        showError("Error adding band: " + error.message);
        console.error("Error adding band:", error);
      })
      .finally(() => {
        showLoading(false);
      });
  }

  function openEditModal(band) {
    editIdInput.value = band.id;
    editNameInput.value = band.name;
    editGenreInput.value = band.genre;
    editYearInput.value = band.year;
    editHometownInput.value = band.hometown;
    editMembersInput.value = band.members;
    editDescriptionInput.value = band.description;

    editModal.style.display = "block";
  }

  function handleUpdateBand(event) {
    event.preventDefault();

    const bandId = editIdInput.value;
    const bandData = {
      name: editNameInput.value.trim(),
      genre: editGenreInput.value.trim(),
      year: editYearInput.value.trim(),
      hometown: editHometownInput.value.trim(),
      members: editMembersInput.value.trim(),
      description: editDescriptionInput.value.trim(),
    };

    if (!validateBandData(bandData)) {
      showError("Please fill in all fields correctly");
      return;
    }

    updateBand(bandId, bandData);
  }

  function updateBand(id, bandData) {
    showLoading(true);

    fetch(`${API_URL}?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bandData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update band");
        }
        return response.json();
      })
      .then((data) => {
        showSuccess("Band updated successfully!");
        editModal.style.display = "none";
        loadAllBands();
      })
      .catch((error) => {
        showError("Error updating band: " + error.message);
        console.error("Error updating band:", error);
      })
      .finally(() => {
        showLoading(false);
      });
  }

  function deleteBand(id) {
    if (!confirm("Are you sure you want to delete this band?")) {
      return;
    }

    showLoading(true);

    fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete band");
        }
        return response.json();
      })
      .then((data) => {
        showSuccess("Band deleted successfully!");
        loadAllBands();
      })
      .catch((error) => {
        showError("Error deleting band: " + error.message);
        console.error("Error deleting band:", error);
      })
      .finally(() => {
        showLoading(false);
      });
  }

  function validateBandData(bandData) {
    for (const [key, value] of Object.entries(bandData)) {
      if (!value) return false;
    }

    if (isNaN(bandData.year) || isNaN(bandData.members)) {
      return false;
    }

    return true;
  }

  function resetForm(form) {
    form.reset();
  }

  function showLoading(isLoading) {
    if (isLoading) {
      const loadingElement = document.createElement("div");
      loadingElement.id = "loading-indicator";
      loadingElement.textContent = "Loading...";
      document.body.appendChild(loadingElement);
    } else {
      const existingLoader = document.getElementById("loading-indicator");
      if (existingLoader) {
        existingLoader.remove();
      }
    }
  }

  function showError(message) {
    showNotification(message, "error");
  }

  function showSuccess(message) {
    showNotification(message, "success");
  }

  function showNotification(message, type) {
    const existingNotification = document.getElementById("notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.id = "notification";
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function initializeVisualEffects() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", createPixelDust);
    });
  }

  function createPixelDust(event) {
    const x = event.clientX;
    const y = event.clientY;

    for (let i = 0; i < 5; i++) {
      const pixel = document.createElement("div");
      pixel.className = "pixel-dust";

      const posX = x + (Math.random() * 20 - 10);
      const posY = y + (Math.random() * 20 - 10);

      pixel.style.left = `${posX}px`;
      pixel.style.top = `${posY}px`;

      const colors = [
        "#0038A8",
        "#CE1126",
        "#FCD116",
        "#FFFFFF",
        "#00A859",
      ];
      pixel.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      document.body.appendChild(pixel);

      setTimeout(() => {
        document.body.removeChild(pixel);
      }, 1000);
    }
  }

  initializeVisualEffects();
});
