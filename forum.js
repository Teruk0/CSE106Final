// Store question data including votes
// Store question data including votes
const questionsData = [];
const uservotes = []
let credentials = {}
let posts = {}
let responses = {}
let voteds = {}

function DisplayAllQuestions() {
    // const urlParams = new URLSearchParams(window.location.search);
    // const actualUsername = urlParams.get('username'); // Replace with the actual username
    // const replies;
    fetch(`http://localhost:3000/forum`)
    .then(response => response.json())
    .then(data => {
      if (data['message'].includes('Success')) {
        console.log(data)

        credentials = data.credential;
        posts = data.post;
        responses = data.response
        voteds = data.voted

        posts.forEach(post => {

            
            let actualUsername = '';

            credentials.forEach(credential => {
                if (credential.c_id == post.p_userId) {
                    actualUsername = credential.c_username
                }
            });
            if (actualUsername == '') {
                return;
            }
            const questionText = post.p_question;
            console.log(actualUsername)
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
            usernameDiv.innerHTML = `<p style="color: white;">${actualUsername}</p>`; // Replace 'Username' with the actual username
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
            replyButtonDiv.innerHTML = `<button class="reply-button" onclick="replyToQuestion(this)" data-index="${questionIndex}" question-text="${questionText}">Reply</button>`;

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
            
            question.replies = [];

            responses.forEach(response => {
                if (response.r_postId != post.p_id)  {
                    return;
                }
                
                credentials.forEach(credential => {
                    if (credential.c_id == response.r_userId) {
                        actualUsername = credential.c_username
                    }
                });
                

                // Create a new reply object
                const reply = {
                    text: response.r_response,
                    upvotes: response.r_upvotes,
                    downvotes: response.r_downvotes,
                    userVoted: false,
                };

                // Add the reply to the question's replies array
                question.replies.push(reply);

                // Display the reply within its own box
                displayReply(questionIndex, question.replies.length - 1, actualUsername);
            });
        });

      } else {
        alert(data['message'])
      }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    DisplayAllQuestions();
  });

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
    const urlParams = new URLSearchParams(window.location.search);
    const actualUsername = urlParams.get('username');; // Replace with the actual username
    
    let usernameId = ''
    credentials.forEach(credential => {
        if (credential.c_username == actualUsername) {
            usernameId = credential.c_id
        }
    });
        
    const data = {
        "usernameId": usernameId,
        "questionText": questionText
    };
    fetch('http://localhost:3000/forum/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
    if (data['message'].includes('UNIQUE')) {
        alert('Post already exists')
    }
    console.log('Data added:', data);
    })

    posts.push({
        p_id: posts.length,
        p_userId: usernameId,
        p_upvotes: 0,
        p_downvotes: 0
    })

    // console.log(actualUsername)
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
    row1.style.display = 'flex';
    row1.style.justifyContent = 'space-between'; // Align items to the right

    // Username div inside the question box
    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'username-div';
    usernameDiv.innerHTML = `<p style="color: white;">${actualUsername}</p>`; // Replace 'Username' with the actual username
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
    replyButtonDiv.innerHTML = `<button class="reply-button" onclick="replyToQuestion(this)" data-index="${questionIndex}" question-text="${questionText}">Reply</button>`;

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
    const urlParams = new URLSearchParams(window.location.search);
    const currentUsername = urlParams.get('username'); // Replace with the actual username
    
    // Get the question's username from the data
    // console.log(posts)
    const questionUserId = posts[index].p_userId;
    let questionUsername = ''
    credentials.forEach(credential => {
        if (credential.c_id == questionUserId) {
             questionUsername = credential.c_username
        }
    });
    // console.log(questionUsername)

    // Check if the current user is the original poster
    if (questionUsername === currentUsername) {
        // Prompt the user for confirmation before deleting
        const confirmation = confirm('Are you sure you want to delete this question?');
        if (confirmation) {
            let postId = ''
            // console.log( questionsData[index])
            // console.log( questionsData[index].text)
            posts.forEach(post => {
                if (post.p_question == questionsData[index].text) {
                    postId = post.p_id
                }
            });

            // Remove the question from the data array
            questionsData.splice(index, 1);
            // Remove the question box from the DOM
            const questionBox = document.getElementById(`question-box-${index}`);
            if (questionBox) {
                questionBox.remove();
            }
                        
            // let postId = ''
            // console.log(questionsData)
            // console.log(questionsData[Number(index)])
            // posts.forEach(post => {
            //     if (post.p_question == questionsData[index].text) {
            //         postId = post.c_id
            //     }
            // });
        
                

            fetch(`http://localhost:3000/forum?postId=${postId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
            if (!(data['message'].includes('Success'))) {
                // console.log(data);
                alert('Post alreadly deleted')
            }            
            })

        }
    } else {
        alert(`You cannot delete this post, as you are not the original poster! ${questionUsername} is!`);
    }
}



function replyToQuestion(replyButton) {
    const questionIndex = replyButton.getAttribute('data-index');
    const questionText = replyButton.getAttribute('question-text');
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
        const urlParams = new URLSearchParams(window.location.search);
        const actualUsername = urlParams.get('username');; // Replace with the actual username    
        
        fetch(`http://localhost:3000/forum`)
        .then(response => response.json())
        .then(data => {
        if (data['message'].includes('Success')) {
            console.log(data)
            console.log("Here")

            credentials = data.credential;
            posts = data.post;
            responses = data.response;
            voteds = data.voted;

            let usernameId = ''
            credentials.forEach(credential => {
                if (credential.c_username == actualUsername) {
                    usernameId = credential.c_id
                }
            });

            let qIndex = ''
            console.log(questionText)
            posts.forEach(post => {
                console.log(post.p_question)
                if (post.p_question == questionText) {
                    qIndex = post.p_id
                }
            });
                
            const replydata = {
                "usernameId": usernameId,
                "responseText": replyInput.value,
                "questionIndex": qIndex
            };
            fetch('http://localhost:3000/forum/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(replydata),
            })
            .then(response => response.json())
            .then(data => {
            if (data['message'].includes('UNIQUE')) {
                alert('Response already exists')
            }
            console.log('Data added:', data);
            console.log(questionsData[questionIndex])
            postReply(questionIndex, replyInput.value);
            // Remove the reply input and answer button after posting the reply
            replyContainer.remove();
            })
        } else {
            alert(data['message'])
          }
        })
    };
    replyContainer.appendChild(answerButton);

    // Append the reply container to the question box
    questionBox.appendChild(replyContainer);
}


function postReply(questionIndex, replyText) {
    const question = questionsData[questionIndex];
    // if (question)

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

    // Get the username
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');;

    // Display the reply within its own box
    displayReply(questionIndex, question.replies.length - 1, username);
}

function displayReply(questionIndex, replyIndex, username) {
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
    const actualUsername = username; // Replace with the actual username
    usernameDiv.innerHTML = `<p style="color: white;">${actualUsername}</p>`;    replyContainer.appendChild(usernameDiv);

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
        toggleReplyVote(username, reply.text, 'upvote');
    };
    votesDiv.appendChild(upvoteButton);

    // Downvote button for the reply
    const downvoteButton = document.createElement('button');
    downvoteButton.textContent = 'Downvote';
    downvoteButton.onclick = function () {
        toggleReplyVote(username, reply.text, 'downvote');
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

// function toggleReplyVote(username, text, type) {
    
// };

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

function toggleReplyVote(questionIndex, replyIndex, voteType) {
    const question = questionsData[questionIndex];
    const reply = question.replies[replyIndex];

    // Get the current user (replace with your actual method to get the user)
    const currentUser = "JohnDoe";

    // Check if the user has already voted on this reply
    const userVote = userVotes[`${currentUser}_${questionIndex}_${replyIndex}`];

    if (userVote) {
        // User has voted, so remove their previous vote
        removeUserVote(questionIndex, replyIndex, userVote);
        userVotes[`${currentUser}_${questionIndex}_${replyIndex}`] = null;
    }

    // Update the vote count based on the vote type
    if (voteType === 'upvote') {
        reply.upvotes += 1;
    } else if (voteType === 'downvote') {
        reply.downvotes += 1;
    }

    // Set user's new vote
    userVotes[`${currentUser}_${questionIndex}_${replyIndex}`] = voteType;

    // Update the displayed vote counts
    updateVoteCounts(questionIndex, replyIndex);
}

function removeUserVote(questionIndex, replyIndex, userVote) {
    const question = questionsData[questionIndex];
    const reply = question.replies[replyIndex];

    // Remove the user's previous vote
    if (userVote === 'upvote') {
        reply.upvotes -= 1;
    } else if (userVote === 'downvote') {
        reply.downvotes -= 1;
    }
}

function updateVoteCounts(questionIndex, replyIndex) {
    const questionBox = document.getElementById(`question-box-${questionIndex}`);
    const upvoteCountSpan = questionBox.querySelector('.upvote-count');
    const downvoteCountSpan = questionBox.querySelector('.downvote-count');

    if (!questionBox || !upvoteCountSpan || !downvoteCountSpan) {
        console.error('Error: Question box or vote count spans not found.');
        return;
    }

    const reply = questionsData[questionIndex].replies[replyIndex];

    // Update the displayed vote counts
    upvoteCountSpan.textContent = reply.upvotes;
    downvoteCountSpan.textContent = reply.downvotes;
}
