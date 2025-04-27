document.addEventListener("DOMContentLoaded", function () {
  const API_URL =
    "https://devhivespace.com/exercise16-api/alejandro/alejandro-restapi-endpoint.php";

  const bookForm = document.getElementById("book-form");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.getElementById("search-title");
  const submitButton = document.getElementById("submit");

  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const genreInput = document.getElementById("genre");
  const publicationInput = document.getElementById("publication");
  const statusInput = document.getElementById("status");

  const booksListContainer = document.createElement("div");
  booksListContainer.className = "books-list-container";
  document.body.appendChild(booksListContainer);

  const messageBox = document.createElement("div");
  messageBox.id = "message-box";
  messageBox.className = "message hidden";
  document.body.insertBefore(messageBox, booksListContainer);

  const booksListHeader = document.createElement("h2");
  booksListHeader.textContent = "My Books";
  booksListHeader.className = "books-list-title";
  booksListContainer.appendChild(booksListHeader);

  const booksList = document.createElement("div");
  booksList.id = "books-list";
  booksList.className = "books-list";
  booksListContainer.appendChild(booksList);

  const hiddenIdInput = document.createElement("input");
  hiddenIdInput.type = "hidden";
  hiddenIdInput.id = "hidden-book-id";
  bookForm.appendChild(hiddenIdInput);

  let currentMode = "add";

  submitButton.addEventListener("click", handleFormSubmit);
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBooks();
  });

  loadAllBooks();

  function loadAllBooks() {
    showMessage("Loading books...", "info");

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((books) => {
        displayBooks(books);
        showMessage("", "");
      })
      .catch((error) => {
        showMessage(`Error: ${error.message}`, "error");
        console.error("Error loading books:", error);
      });
  }

  function searchBooks() {
    const query = searchInput.value.trim();

    if (!query) {
      loadAllBooks();
      return;
    }

    showMessage(`Searching for "${query}"...`, "info");

    fetch(`${API_URL}?title=${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Search failed");
        }
        return response.json();
      })
      .then((books) => {
        displayBooks(books);
        showMessage("", "");
      })
      .catch((error) => {
        showMessage(`Error: ${error.message}`, "error");
        console.error("Error searching books:", error);
      });
  }

  function displayBooks(books) {
    booksList.innerHTML = "";

    if (books.length === 0) {
      booksList.innerHTML = `<p class="no-results">No books found</p>`;
      return;
    }

    books.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";

      let statusText = "";
      switch (book.status) {
        case "to_read":
          statusText = "To Read";
          break;
        case "current":
          statusText = "Currently Reading";
          break;
        case "completed":
          statusText = "Completed";
          break;
        default:
          statusText = "Unknown";
      }

      bookCard.innerHTML = `
                <h3>${book.title}</h3>
                <div class="book-info">
                    <p><span>Author:</span> ${book.author}</p>
                    <p><span>Genre:</span> ${book.genre}</p>
                    <p><span>Publication Year:</span> ${
                      book.publicationYear || book.publication
                    }</p>
                    <p><span>Status:</span> ${statusText}</p>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" data-id="${book.id}">Edit</button>
                    <button class="delete-btn" data-id="${
                      book.id
                    }">Delete</button>
                </div>
            `;

      booksList.appendChild(bookCard);

      bookCard
        .querySelector(".edit-btn")
        .addEventListener("click", () => editBook(book));
      bookCard
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteBook(book.id));
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const bookData = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      genre: genreInput.value.trim(),
      publicationYear: publicationInput.value.trim(),
      status: statusInput.value,
    };

    if (
      !bookData.title ||
      !bookData.author ||
      !bookData.genre ||
      !bookData.publicationYear ||
      !bookData.status
    ) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    if (currentMode === "add") {
      addBook(bookData);
    } else {
      updateBook(hiddenIdInput.value, bookData);
    }
  }

  function addBook(bookData) {
    showMessage("Adding new book...", "info");

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add book");
        }
        return response.json();
      })
      .then((data) => {
        showMessage("Book added successfully!", "success");
        resetForm();
        loadAllBooks();

        setTimeout(() => {
          showMessage("", "");
        }, 3000);
      })
      .catch((error) => {
        showMessage(`Error: ${error.message}`, "error");
        console.error("Error adding book:", error);
      });
  }

  function editBook(book) {
    currentMode = "edit";

    titleInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre;
    publicationInput.value = book.publicationYear || book.publication;
    statusInput.value = book.status;
    hiddenIdInput.value = book.id;

    submitButton.textContent = "Update";

    bookForm.scrollIntoView({ behavior: "smooth" });
  }

  function updateBook(id, bookData) {
    showMessage("Updating book...", "info");

    fetch(`${API_URL}?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update book");
        }
        return response.json();
      })
      .then((data) => {
        showMessage("Book updated successfully!", "success");
        resetForm();
        loadAllBooks();

        setTimeout(() => {
          showMessage("", "");
        }, 3000);
      })
      .catch((error) => {
        showMessage(`Error: ${error.message}`, "error");
        console.error("Error updating book:", error);
      });
  }

  function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    showMessage("Deleting book...", "info");

    fetch(`${API_URL}?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete book");
        }
        return response.json();
      })
      .then((data) => {
        showMessage("Book deleted successfully!", "success");
        loadAllBooks();

        setTimeout(() => {
          showMessage("", "");
        }, 3000);
      })
      .catch((error) => {
        showMessage(`Error: ${error.message}`, "error");
        console.error("Error deleting book:", error);
      });
  }

  function resetForm() {
    bookForm.reset();
    hiddenIdInput.value = "";
    submitButton.textContent = "Submit";
    currentMode = "add";
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
