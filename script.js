let commentsParent = [];


const addComment = () => {
    let authorEle = document.querySelector("#author");
    let commentEle = document.querySelector("#comment");
    let comment = {
        author: authorEle.value,
        text: commentEle.value,
        id: `${authorEle.value}__original__${Math.floor(Math.random() * (999 + 100 - 1))}`,
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

//function to handle the input texts for the reply
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

//function to set the reply according to the id received from the replyButton trigerring the event
function setReply(e) {
    let commentNode = findCommentNode(e.target.id);
    commentNode.replies.push({
        author: document.querySelector("#" + e.target.id + "__user").value,
        text: document.querySelector("#" + e.target.id + "__reply").value,
        id: document.querySelector("#" + e.target.id + "__user").value + "__reply__" + Math.floor(Math.random() * (1000)),
        replies: [],
        parent: e.target.id,
        likes: 0
    })
    renderComments(commentsParent, true)

    let commentDiv = document.querySelector(`#${commentNode.id} .comment-controls`);
    commentDiv.remove();
}

//recursive function to find the comment with id == value inside the total list of comments, inefficient - need to optimize
function findCommentNode(value, currentArr = commentsParent) {
    for (let i = 0; i < currentArr.length; i++) {
        if (currentArr[i].id == value) {
            return currentArr[i];
        }
        else if (currentArr[i].replies.length) {
            let component = findCommentNode(value, currentArr[i].replies)
            if (component?.id == value) {
                return component
            }
            else
                continue;
        }
    }
}


function renderComments(commentNode) {
    //recursive function to render html for each comment and place it .comments-pane__list div or inside div of its parent comment
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
                // listItem.addEventListener("click", (e) => this.setReply.call(this, e))
                commentsNodeToAppendTo = document.querySelector(".comments-pane__list");
                commentsNodeToAppendTo.appendChild(listItem);
            }
            else {
                // listItem.addEventListener("click", (e) => this.setReply.call(this, e))
                commentsNodeToAppendTo = document.querySelector("#" + comment.parent);
                commentsNodeToAppendTo.appendChild(listItem);
            }
        }

        if (comment.replies.length) {
            renderComments(comment.replies) //recursively set comment for replies as well
        }

    })

}

