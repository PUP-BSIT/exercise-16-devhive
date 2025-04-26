document.addEventListener("DOMContentLoaded", () => {
    const commentName = document.getElementById("comment_name");
    const commentMessage = document.getElementById("comment_message");
    const commentButton = document.querySelector("#comment_button button");
    const commentContainer = document.querySelector(".comment-container");
    const sortButton = document.getElementById("sort_button");
    
    let comments = [
        {
            date: '3/19/2025, 5:00:40 PM',
            username: 'Esparagoza',
            comment: 'Goodluck to your goals'
        },
        {
            date: '3/19/2025, 5:00:30 PM',
            username: 'Alejandro',
            comment: 'Nice goals, you`ve got this'
        },
        {
            date: '3/19/2025, 5:00:20 PM',
            username: 'Genandoy',
            comment: 'So many goals, hope you achieve that'
        }
    ];
    
    let isAscending = true;
    
    const toggleButtonState = () => {
        const isFormValid = commentName.value.trim() 
        && commentMessage.value.trim();
        commentButton.disabled = !isFormValid;
        commentButton.style.opacity = isFormValid ? "1" : "0.5";
        commentButton.style.cursor = isFormValid ? "pointer" : "not-allowed";
    };
    
    const addComment = () => {
        const timestamp = new Date().toLocaleString();
        const newComment = {
            date: timestamp,
            username: commentName.value.trim(),
            comment: commentMessage.value.trim()
        };
        comments.push(newComment);
        
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment-message");
        commentDiv.innerHTML = `${newComment.comment}
            <div class="comment-author">- ${newComment.username}</div>
            <div class="comment-date">${timestamp}</div>`;  
        commentContainer.appendChild(commentDiv);
        commentName.value = "";
        commentMessage.value = "";
        toggleButtonState();
    };
    
    const toggleSortOrder = () => {
        isAscending = !isAscending;
        sortButton.innerText = isAscending ? 
            "Sort Descending" : "Sort Ascending";
    
        comments.sort((a, b) => {
            const aTime = new Date(a.date);
            const bTime = new Date(b.date);
            return isAscending ? aTime - bTime : bTime - aTime;
        });
        commentContainer.innerHTML = "";

        comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment-message");
            commentDiv.innerHTML = `${comment.comment}
                <div class="comment-author">- ${comment.username}</div>
                <div class="comment-date">${comment.date}</div>`;
            commentContainer.appendChild(commentDiv);
        });
    };
    
    [commentName, commentMessage].forEach(input =>
        input.addEventListener("input", toggleButtonState)
    );
    commentButton.addEventListener("click", addComment);
    sortButton.addEventListener("click", toggleSortOrder);
    toggleButtonState();
});