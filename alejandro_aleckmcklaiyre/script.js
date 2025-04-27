let commentForm = document.querySelector(".comment-form");
let nameInput = document.getElementById("name");
let commentInput = document.getElementById("comment-text");
let submitBtn = document.getElementById("submit_btn");
let commentsSection = document.querySelector(".comment-list ul");
let ascendBtn = document.querySelector(".assend");
let descendBtn = document.querySelector(".descend");
let initialComments = commentsSection.querySelectorAll("li");
let comments = [];

function addTimestampsToExistingComments() {
  initialComments.forEach((comment, index) => {
    let text = comment.textContent;
    let parts = text.split(" - ");
    let baseTime = new Date("2025-03-19T22:35:09").getTime();
    let commentDate = new Date(baseTime + index * 60000);

    comments.push({
      text: parts[0],
      name: parts[1],
      date: commentDate,
      element: comment,
    });

    comment.textContent = `${parts[0]} - ${parts[1]} (${formatDate(
      commentDate
    )})`;
    comment.setAttribute("data-date", commentDate.getTime());
  });
}

function validateForm() {
  let isValid = nameInput.value.trim() && commentInput.value.trim();
  submitBtn.disabled = !isValid;
  submitBtn.style.backgroundColor = isValid ? "#2d3e42" : "";
}

function formatDate(date) {
  return date.toLocaleString([]);
}

function sortComments(direction) {
  comments.sort((a, b) =>
    direction === "asc" ? a.date - b.date : b.date - a.date
  );
  comments.forEach((item) => commentsSection.appendChild(item.element));
}

function addComment(event) {
  event.preventDefault();
  let name = nameInput.value.trim();
  let text = commentInput.value.trim();
  if (!name || !text) return;
  let currentDate = new Date();
  let newComment = document.createElement("li");
  newComment.textContent = `${text} - ${name} (${formatDate(currentDate)})`;
  newComment.setAttribute("data-date", currentDate.getTime());
  commentsSection.appendChild(newComment);
  comments.push({
    text,
    name,
    date: currentDate,
    element: newComment,
  });
  commentForm.reset();
  validateForm();
}

[nameInput, commentInput].forEach((input) =>
  input.addEventListener("input", validateForm)
);
commentForm.addEventListener("submit", addComment);
ascendBtn.addEventListener("click", () => sortComments("asc"));
descendBtn.addEventListener("click", () => sortComments("desc"));

addTimestampsToExistingComments();
validateForm();
