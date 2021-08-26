let commentsParent = [];


const addComment = () => {
    let authorEle = document.querySelector("#author");
    let commentEle = document.querySelector("#comment");
    let comment = {
        author: authorEle.value,
        text: commentEle.value,
        id: `${authorEle.value}__original__${commentsParent.length}`,
        replies: [],
        isParent: true,
        likes: 0
    }
    commentsParent.push(comment)
    renderComments(commentsParent, true);
    authorEle.value = "";
    commentEle.value = "";
}

function deleteHandler(commentToDelete) {
    let eleToDelete = document.querySelector(`#${commentToDelete.id}`);
    eleToDelete.remove()
    if (commentToDelete.isParent) {
        commentsParent = commentsParent.filter(comment => comment != commentToDelete)
    } else {
        let parentComment = findCommentNode(commentToDelete.parent, commentsParent)
        parentComment.replies = parentComment.replies.filter(comment => comment != commentToDelete)
    }
}

function likeHandler(comment) {
    comment.likes++;
    let likeEle = document.querySelector(".likes__" + comment.id);
    likeEle.innerHTML = comment.likes

}

function replyHandler(e) {
    let comment = commentsParent.find(comment => comment.id === e.target.id);
    let commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-controls");

    let userNameLabel = document.createElement("label")
    userNameLabel.setAttribute("for", e.target.id + "__reply__user")
    userNameLabel.innerHTML = "User";

    let userName = document.createElement("input");
    userName.setAttribute("type", "text");
    userName.setAttribute("id", e.target.id + "__user")

    let userCommentLabel = document.createElement("label")
    userCommentLabel.setAttribute("for", e.target.id + "__reply")
    userCommentLabel.innerHTML = "Comment"
    let userComment = document.createElement("input");
    userComment.setAttribute("type", "text");
    userComment.setAttribute("id", e.target.id + "__reply")
    let replyButton = document.createElement("input");
    replyButton.setAttribute("type", "button");
    replyButton.setAttribute("value", "Reply");
    replyButton.setAttribute("id", e.target.id);
    replyButton.addEventListener("click", (e) => this.setReply.call(this, e))

    commentDiv.appendChild(userNameLabel);
    commentDiv.appendChild(userName);
    commentDiv.appendChild(userCommentLabel);
    commentDiv.appendChild(userComment);
    commentDiv.appendChild(replyButton);
    let commentToAppendTo = document.querySelector("#" + e.target.id);
    commentToAppendTo.appendChild(commentDiv);

}

function setReply(e) {
    let commentNode = findCommentNode(e.target.id, commentsParent);
    commentNode.replies.push({
        author: document.querySelector("#" + e.target.id + "__user").value,
        text: document.querySelector("#" + e.target.id + "__reply").value,
        id: document.querySelector("#" + e.target.id + "__user").value + "__reply__" + commentNode.replies.length,
        replies: [],
        parent: e.target.id,
        likes: 0
    })
    renderComments(commentsParent, true)

    let commentDiv = document.querySelector(`#${commentNode.id} .comment-controls`);
    // console.log(commentDiv)
    commentDiv.remove();
}

function findCommentNode(value, arr) {
    for (let comment of arr) {
        if (comment.id == value) {
            return comment;
        }
        if (comment.replies.length) {
            return findCommentNode(value, comment.replies)
        }
    }
}

function renderComments(commentNode) {
    commentNode.forEach(comment => {
        if (!document.querySelector(`#${comment.id}`)) {
            let listItem = document.createElement("li");
            listItem.classList.add("comment");
            listItem.setAttribute("id", comment.id)
            let commentAuthor = document.createElement("h3");
            let commentAuthorNode = document.createTextNode(comment.author + ":");
            commentAuthor.appendChild(commentAuthorNode);

            let commentSpan = document.createElement("span");
            let commentSpanNode = document.createTextNode(comment.text.toString());
            commentSpan.appendChild(commentSpanNode);

            let commentControls = document.createElement("div");
            commentControls.classList.add("comment-actions")

            let replyControl = document.createElement("a");
            replyControl.innerHTML = "Reply";
            replyControl.setAttribute("id", comment.id);
            replyControl.addEventListener("click", (e) => this.replyHandler.call(this, e))
            let deleteControl = document.createElement("a");
            deleteControl.innerHTML = "Delete";
            deleteControl.addEventListener("click", () => this.deleteHandler.call(this, comment))
            let likeControl = document.createElement("a");
            likeControl.innerHTML = "Like"
            likeControl.addEventListener("click", () => this.likeHandler.call(this, comment))
            let likes = document.createElement("span");
            likes.classList.add("likes__" + comment.id)
            let likesTextNode = document.createTextNode(comment.likes)
            likes.appendChild(likesTextNode);

            commentControls.appendChild(replyControl);
            commentControls.appendChild(deleteControl);
            commentControls.appendChild(likeControl);
            commentControls.appendChild(likes);


            listItem.appendChild(commentAuthor);
            listItem.appendChild(commentSpan);
            listItem.appendChild(commentControls);

            if (comment.isParent) {
                commentsNodeToAppendTo = document.querySelector(".comments-pane__list");
                commentsNodeToAppendTo.appendChild(listItem);
            }
            else {
                commentsNodeToAppendTo = document.querySelector("#" + comment.parent);
                commentsNodeToAppendTo.appendChild(listItem);
            }
        }

        if (comment.replies.length) {
            renderComments(comment.replies)
        }

    })

}

