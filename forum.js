// Store question data including votes and whether the user has voted
const questionsData = [];

function postQuestion() {
    // Get the question text from the input
    const questionInput = document.getElementById('question-text');
    const questionText = questionInput.value.trim(); // Trim leading and trailing whitespace

    // Check if the question is empty
    if (questionText === "") {
        alert('Error: Please enter a question before posting.');
        return;
    }    

    // Check if the question exceeds the character limit
    const characterLimit = 300;
    if (questionText.length > characterLimit) {
        alert('Error: The question cannot exceed 300 characters.');
        return;
    }

    // Assuming you have a way to get the actual username
    const actualUsername = "JohnDoe"; // Replace with the actual username

    const question = {
        text: questionText,
        replies: [] // Initialize the replies array
    };

    // Add the question to the data array
    questionsData.push(question);

    const questionElement = document.createElement('div');
    questionElement.className = 'question-box';
    questionElement.id = `question-box-${questionsData.length - 1}`;
    questionElement.style.width = 'calc(100% - 20px)'; // Adjust the width as needed

    // Row 1: Username and Delete
    const row1 = document.createElement('div');
    row1.className = 'row1';

    // Username div inside the question box
    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'username-div';
    usernameDiv.innerHTML = `<p>${actualUsername}</p>`; // Replace 'Username' with the actual username
    row1.appendChild(usernameDiv);

    // Delete button div inside the question box
    const deleteButtonDiv = document.createElement('div');
    deleteButtonDiv.className = 'delete-button-div';
    deleteButtonDiv.innerHTML = `<button class="delete-button" onclick="deleteQuestion(${questionsData.length - 1})">Delete</button>`;
    row1.appendChild(deleteButtonDiv);

    questionElement.appendChild(row1);

    // Row 2: Question text
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-div';
    questionTextDiv.innerHTML = `<p>${questionText}</p>`;
    questionElement.appendChild(questionTextDiv);

    // Row 3: Reply button div
    const replyButtonDiv = document.createElement('div');
    replyButtonDiv.className = 'reply-button-div';

    // Set the data-index attribute
    const questionIndex = questionsData.length - 1; // Assuming this is the index of the current question
    replyButtonDiv.innerHTML = `<button class="reply-button" onclick="replyToQuestion(this)" data-index="${questionIndex}">Reply</button>`;

    questionElement.appendChild(replyButtonDiv);

    // Row 4: Response div
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response-div';
    responseDiv.style.maxHeight = '200px'; // Set a maximum height for the scrollable container
    responseDiv.style.overflowY = 'auto'; // Enable vertical scrolling

    // Add the response div to the question box
    questionElement.appendChild(responseDiv);

    // Add the question element to the questions list
    document.getElementById('questions-list').appendChild(questionElement);

    // Clear the input field after posting
    questionInput.value = '';
    
    question.replies = [];
}

function deleteQuestion(index) {
    // Assuming you have a way to get the actual username
    const currentUsername = "JohnDoe"; // Replace with the actual username

    // Get the question's username from the data
    const questionUsername = questionsData[index]?.username;

    // Check if the current user is the original poster
    if (questionUsername === currentUsername) {
        // Prompt the user for confirmation before deleting
        const confirmation = confirm('Are you sure you want to delete this question?');
        if (confirmation) {
            // Remove the question from the data array
            questionsData.splice(index, 1);
            // Remove the question box from the DOM
            const questionBox = document.getElementById(`question-box-${index}`);
            if (questionBox) {
                questionBox.remove();
            }
        }
    } else {
        alert("You cannot delete this post, as you are not the original poster!");
    }
}



function replyToQuestion(replyButton) {
    const questionIndex = replyButton.getAttribute('data-index');
    const questionBox = document.getElementById(`question-box-${questionIndex}`);

    if (!questionBox) {
        console.error('Error: Question box not found.');
        return;
    }

    // Create a container for the reply input and answer button
    const replyContainer = document.createElement('div');
    replyContainer.className = 'reply-container';
    replyContainer.style.backgroundColor = 'rgba(192, 192, 192, 0.5)';

    // Reply input
    const replyInput = document.createElement('textarea');
    replyInput.className = 'reply-input';
    replyInput.placeholder = 'Type your reply...';
    replyContainer.appendChild(replyInput);

    // Answer button
    const answerButton = document.createElement('button');
    answerButton.className = 'answer-button';
    answerButton.textContent = 'Answer';
    answerButton.onclick = function() {
        postReply(questionIndex, replyInput.value);
        // Remove the reply input and answer button after posting the reply
        replyContainer.remove();
    };
    replyContainer.appendChild(answerButton);

    // Append the reply container to the question box
    questionBox.appendChild(replyContainer);
}


function postReply(questionIndex, replyText) {
    const question = questionsData[questionIndex];

    // Check if the reply exceeds the character limit
    const characterLimit = 300;
    if (replyText.length > characterLimit) {
        alert('Error: The reply cannot exceed 300 characters.');
        return;
    }

    // Create a new reply object
    const reply = {
        text: replyText,
        upvotes: 0,
        downvotes: 0,
        userVoted: false,
    };

    // Add the reply to the question's replies array
    question.replies.push(reply);

    // Display the reply within its own box
    displayReply(questionIndex, question.replies.length - 1);
}

function displayReply(questionIndex, replyIndex) {
    const questionBox = document.getElementById(`question-box-${questionIndex}`);
    const responseDiv = questionBox.querySelector('.response-div');

    if (!questionBox || !responseDiv) {
        console.error('Error: Question box or response div not found.');
        return;
    }

    const reply = questionsData[questionIndex].replies[replyIndex];

    // Create a container for the reply
    const replyContainer = document.createElement('div');
    replyContainer.className = 'reply-container';

    // Username div for the reply
    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'username-div';
    // Assuming you have a way to get the actual username for the reply
    const actualUsername = "JohnDoe"; // Replace with the actual username
    usernameDiv.innerHTML = `<p>${actualUsername}</p>`;
    replyContainer.appendChild(usernameDiv);

    // Display the reply text
    const replyTextDiv = document.createElement('div');
    replyTextDiv.className = 'reply-text';
    replyTextDiv.innerHTML = `<p>${reply.text}</p>`;
    replyContainer.appendChild(replyTextDiv);

    // Votes div for the reply
    const votesDiv = document.createElement('div');
    votesDiv.className = 'votes-div';

    // Upvote button for the reply
    const upvoteButton = document.createElement('button');
    upvoteButton.textContent = 'Upvote';
    upvoteButton.onclick = function () {
        toggleReplyVote(questionIndex, replyIndex, 'upvote');
    };
    votesDiv.appendChild(upvoteButton);

    // Downvote button for the reply
    const downvoteButton = document.createElement('button');
    downvoteButton.textContent = 'Downvote';
    downvoteButton.onclick = function () {
        toggleReplyVote(questionIndex, replyIndex, 'downvote');
    };
    votesDiv.appendChild(downvoteButton);

    // Upvote and downvote count spans for the reply
    const upvoteCountSpan = document.createElement('span');
    upvoteCountSpan.className = 'vote-count upvote';
    upvoteCountSpan.textContent = reply.upvotes;
    votesDiv.appendChild(upvoteCountSpan);

    const downvoteCountSpan = document.createElement('span');
    downvoteCountSpan.className = 'vote-count downvote';
    downvoteCountSpan.textContent = reply.downvotes;
    votesDiv.appendChild(downvoteCountSpan);

    replyContainer.appendChild(votesDiv);

    // Append the reply container to the response div
    responseDiv.appendChild(replyContainer);
}


function search() {
    const filterInput = document.getElementById('filter-text');
    const filterText = filterInput.value.trim().toLowerCase(); // Trim leading and trailing whitespace

    // Loop through questionsData and show/hide questions based on the filterText
    questionsData.forEach((question, index) => {
        const questionElement = document.getElementById(`question-box-${index}`);

        if (question.text.toLowerCase().includes(filterText)) {
            // Show the question
            questionElement.style.display = 'block';
        } else {
            // Hide the question
            questionElement.style.display = 'none';
        }
    });
}
