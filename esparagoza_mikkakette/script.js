document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("commenter-name");
    const commentInput = document.getElementById("commenter-comment");
    const commentBtn = document.getElementById("comment-button");
    const commentPage = document.getElementById("comment_page");
    const commentsHeading = commentPage.querySelector("h2");

    const commentsContainer = document.createElement("div");
    commentsContainer.className = "comments-container";
    commentPage.appendChild(commentsContainer);

    const sortControls = document.createElement("div");
    sortControls.className = "sort-controls";
    sortControls.innerHTML = `
        <span>Sort by: </span>
        <button id="sort-newest" class="active">Newest First</button>
        <button id="sort-oldest">Oldest First</button>
    `;
    commentsHeading.after(sortControls);

    const fixedDate = new Date(2025, 2, 19, 17, 0).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "numeric",
        minute: "2-digit", hour12: true,
    });
    const fixedTimestamp = new Date(2025, 2, 19, 17, 0).getTime();

    const commentItems = commentPage.querySelectorAll("li");
    commentItems.forEach((li) => {
        if (li.parentElement === commentPage) {
            const p = document.createElement("p");
            p.textContent = `${li.textContent} (${fixedDate})`;
            p.dataset.timestamp = fixedTimestamp;
            commentsContainer.appendChild(p);
            li.remove();
        }
    });

    function toggleButton() {
        commentBtn.disabled = !(nameInput.value.trim() 
            && commentInput.value.trim());
        commentBtn.style.opacity = commentBtn.disabled ? "0.5" : "1";
        commentBtn.style.cursor = commentBtn.disabled ? 
            "not-allowed" : "pointer";
    }
    nameInput.addEventListener("input", toggleButton);
    commentInput.addEventListener("input", toggleButton);

    commentBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const now = new Date();
        const formattedDate = now.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        const newComment = document.createElement("p");
        newComment.textContent = `${nameInput.value}: 
            ${commentInput.value} (${formattedDate})`;
        newComment.dataset.timestamp = now.getTime();
        commentsContainer.prepend(newComment);

        nameInput.value = "";
        commentInput.value = "";
        commentBtn.disabled = true;
        commentsContainer.classList.remove("empty");
    });

    document.getElementById("sort-newest").addEventListener("click", function(){
        this.classList.add("active");
        document.getElementById("sort-oldest").classList.remove("active");
        sortComments("desc");
    });

    document.getElementById("sort-oldest").addEventListener("click", function(){
        this.classList.add("active");
        document.getElementById("sort-newest").classList.remove("active");
        sortComments("asc");
    });

    if (commentsContainer.children.length === 0) {
        commentsContainer.classList.add("empty");
    }

    sortComments("desc");

    function sortComments(direction) {
        const container = document.querySelector(".comments-container");
        const comments = Array.from(container.children);

        comments.sort((a, b) => {
            const timeA = parseInt(a.dataset.timestamp);
            const timeB = parseInt(b.dataset.timestamp);
            return direction === "asc" ? timeA - timeB : timeB - timeA;
        });

        container.innerHTML = "";
        comments.forEach((comment) => container.appendChild(comment));
    }
    toggleButton();
});