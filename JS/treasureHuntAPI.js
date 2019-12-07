const API_LIST = "https://codecyprus.org/th/api/list";
const API_START = "https://codecyprus.org/th/api/start";
const API_QUESTIONS = "https://codecyprus.org/th/api/question";
const API_ANSWER = "https://codecyprus.org/th/api/answer";
const API_LOCATION = "https://codecyprus.org/th/api/location";
const API_SKIP = "https://codecyprus.org/th/api/skip";
const API_LEADERBOARD = "https://codecyprus.org/th/api/leaderboard";
const API_SCORE = "https://codecyprus.org/th/api/score";

/*--------------------------------------------------------------------------------------------------------------------*/

// Parameters
let sessionID = "";
let uuid = "";
let description = "";
let playerName = "";
let appName = "";
let scoreAdjustment = 0;
let latitude = "";
let longitude = "";

/*--------------------------------------------------------------------------------------------------------------------*/

// Get Challenges
function getChallenges() {
    fetch(API_LIST)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            // Get Treasure Hunt Array
            let treasureHuntsArray = jsonObject.treasureHunts;
            // Get challenges list from the app page
            const challengesList = document.getElementById("challenges");
            // Traverse the array to get needed data
            for (let i = 0; i < treasureHuntsArray.length; i++) {
                // Get the Treasure Hunt uuid
                document.getElementById("treasureHuntsDescriptionParagraph").innerHTML = treasureHuntsArray[i].description;
                let uuidLocal = treasureHuntsArray[i].uuid;
                let descriptionLocal = treasureHuntsArray[i].description;
                // Create a button and style it for each TH challenge
                let treasureHuntsButton = document.createElement('input');
                treasureHuntsButton.type = "button";
                treasureHuntsButton.value = treasureHuntsArray[i].name;
                treasureHuntsButton.style.fontSize = "-webkit-xxx-large";
                treasureHuntsButton.style.marginTop = "25px";
                treasureHuntsButton.style.marginBottom = "0";
                treasureHuntsButton.style.padding = "20";
                treasureHuntsButton.style.width = "95%";
                treasureHuntsButton.id = "treasureHuntsButton" + [i + 1];
                // Define the uuid for each TH on click
                treasureHuntsButton.onclick = function () {
                    uuid = uuidLocal;
                    description = descriptionLocal;
                    document.getElementById("treasureHuntsDescriptionParagraph").innerText = description;
                };
                /*--------------------------------CALL GET CREDENTIALS ON CLICK-----------------------------------*/
                treasureHuntsButton.addEventListener("click", getCredentials);
                // Add the TH challenges buttons on a list
                challengesList.appendChild(treasureHuntsButton);
            }
        });
}

function showChallenges() {
    /*-----------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    document.getElementById("challenges");
    document.getElementById("selectTH");
    document.getElementById("selectTH2");
    challenges.style.display = "block";
    selectTH.style.display = "none";
    selectTH2.style.display = "block";
}

function hideChallenges() {
    document.getElementById("challenges");
    document.getElementById("selectTH");
    document.getElementById("selectTH2");
    challenges.style.display = "none";
    selectTH.style.display = "block";
    selectTH2.style.display = "none";
}

/*--------------------------------------------------------------------------------------------------------------------*/

// Call the first function to start the quiz
getChallenges();

// Get the username and the app name and pass them to Start Session
function getCredentials() {
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    document.getElementById("challenges");
    document.getElementById("selectTH");
    document.getElementById("selectTH2");
    document.getElementById("instructionsPbox");

    challenges.style.display = "none";
    selectTH.style.display = "none";
    selectTH2.style.display = "none";
    instructionsP.style.display = "none";
    instructionsH.style.display = "none";

    // Show username input
    document.getElementById("usernameMessage").style.display = "block";
    document.getElementById("usernameBox").style.display = "block";
    document.getElementById("treasureHuntsDescriptionParagraph").style.display = "block";
}

/*--------------------------------------------------------------------------------------------------------------------*/

function startSession() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("messageBoxP").style.display = "none";

    // Get required parameters for START URL
    playerName = document.getElementById("username").value;
    appName = "TheConquerors";

    fetch(API_START + "?player=" + playerName + "&app=" + appName + "&treasure-hunt-id=" + uuid)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            // Set sessionID to the current session
            sessionID = jsonObject.session;

            if (jsonObject.status === "ERROR") {
                loading.style.display = "none";
                messageBoxP.innerText = jsonObject.errorMessages;
                document.getElementById("messageBoxDiv").style.display = "block";
                messageBoxP.style.display = "block";
            } else {
                document.getElementById("messageBoxDiv").style.display = "block";
                document.getElementById("usernameMessage").style.display = "none";
                document.getElementById("messageBoxP").style.display = "none";
                // If all params are correct (username, app name, session) call the questions
                document.getElementById("treasureHuntsDescriptionParagraph").style.display = "none";
                document.getElementById("loading").style.display = "none";
                fetchQuestions(sessionID);
                getLocation();
            }
        });
}

function fetchQuestions() {
    getScore();
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    document.getElementById("usernameBox").style.display = "none";
    document.getElementById("locationButton").style.display = "none";
    document.getElementById("qrImg").style.display = "block";
    document.getElementById("questionSection").style.display = "block";
    document.getElementById("currentQuestionP").style.display = "block";
    document.getElementById("answerForm").style.display = "block";
    document.getElementById("answerNumberForm").style.display = "block";
    /*----------------------------------------------------------------------------------------------------------------*/

    // Retrieve a paragraph element named "question" to add the questions
    document.getElementById("question");
    // Fetch a json formatted file from the API than requires the session ID and includes the questions
    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            let index = JSON.parse(jsonObject.currentQuestionIndex);
            index += 1;
            let numOfQuestion = JSON.parse(jsonObject.numOfQuestions);
            if (index > numOfQuestion) {
                index = numOfQuestion;
            }

            currentQuestionP.innerText = "Question: " + index + " / " + jsonObject.numOfQuestions;

            if (jsonObject.status === "ERROR") {
                document.getElementById("messageBoxP").innerText = jsonObject.errorMessages;
            } else {
                messageBoxP.style.display = "none";
                // Change the questions paragraph content by adding the question from the server
                question.innerHTML = jsonObject.questionText;
                // Question attributes
                if (jsonObject.completed === true) {
                }
                if (jsonObject.requiresLocation === true) {
                    getLocation(latitude, longitude);
                }
                if (jsonObject.canBeSkipped === true) {
                    document.getElementById("skipButton").style.display = "block";
                }
                if (jsonObject.canBeSkipped === false) {
                    document.getElementById("skipButton").style.display = "none";
                }
                let typeOfQuestion = jsonObject.questionType;
                getTypeOfQuestion(typeOfQuestion);
            }
        });
}

function getTypeOfQuestion(typeOfQuestion) {
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    document.getElementById("booleanButtons").style.display = "none";
    document.getElementById("mcqButtons").style.display = "none";
    document.getElementById("placeholderBox").style.display = "none";
    document.getElementById("placeholderSubmit").style.display = "none";
    document.getElementById("placeholderNumberBox").style.display = "none";
    document.getElementById("placeholderNumberSubmit").style.display = "none";

    if (typeOfQuestion === "BOOLEAN") {
        booleanButtons.style.display = "block";
    }
    if (typeOfQuestion === "MCQ") {
        mcqButtons.style.display = "block";
    }
    if (typeOfQuestion === "TEXT") {
        placeholderBox.style.display = "block";
        placeholderSubmit.style.display = "block";
    }
    if (typeOfQuestion === "INTEGER" || typeOfQuestion === "NUMERIC") {
        placeholderNumberBox.style.display = "block";
        placeholderNumberSubmit.style.display = "block";
    }
}

function getAnswer(answer) {
    fetch(API_ANSWER + "?session=" + sessionID + "&answer=" + answer)
        .then(response => response.json())
        .then(jsonObject => {

            scoreAdjustment = jsonObject.scoreAdjustment;

            document.getElementById("placeholderBox");
            document.getElementById("placeholderNumberBox");
            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                document.getElementById("messageBoxP").style.display = "block";
            }
            if (jsonObject.correct === false) {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.message + "  " + scoreAdjustment;
                document.getElementById("messageBoxP").style.display = "block";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";
            }
            if (jsonObject.correct === true) {
                messageBoxP.style.color = "green";
                messageBoxP.innerText = jsonObject.message + "  +" + scoreAdjustment;
                document.getElementById("messageBoxP").style.display = "block";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";

                fetchQuestions();
            }
        });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function skipQuestion() {
    fetch(API_SKIP + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            scoreAdjustment = jsonObject.scoreAdjustment;

            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                document.getElementById("messageBoxP").style.display = "block";
            } else {
                messageBoxP.style.color = "yellow";
                messageBoxP.innerText = jsonObject.message + "  " + scoreAdjustment;
                document.getElementById("messageBoxP").style.display = "block";
                fetchQuestions(sessionID);
            }
        });
}

function getScore() {
    document.getElementById("theConquerorsLogo").style.display = "none";
    document.getElementById("gameAttributes").style.display = "block";
    document.getElementById("playerNameP").style.display = "block";
    document.getElementById("scoreP").style.display = "block";
    fetch(API_SCORE + "?session=" + sessionID)
        .then(response => response.json())
        .then(jsonObject => {

            playerNameP.innerText = "Player: " + jsonObject.player;
            scoreP.innerText = "Score: " + jsonObject.score;

            if (jsonObject.completed === true) {
                document.getElementById("messageBoxDiv").style.display = "none";
                document.getElementById("questionSection").style.display = "none";
                document.getElementById("answerButtons").style.display = "none";
                document.getElementById("messageBoxP").style.display = "none";
                document.getElementById("enjoyGame").style.display = "block";

                getLeaderBoard();
            }
        });
}

function getLeaderBoard() {
    document.getElementById("map").style.top = "100px";
    document.getElementById("loading").style.display = "block";
    fetch(API_LEADERBOARD + "?session=" + sessionID + "&sorted&limit=20")
        .then(response => response.json())
        .then(jsonObject => {

            handleLeaderBoard(jsonObject);
        });

}

function handleLeaderBoard(leaderboard) {
    let rank = 1;
    let options = {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        second: '2-digit'
    };
    let html = "";
    let leaderBoardArray = leaderboard['leaderboard'];
    for (const entry of leaderBoardArray) {
        let date = new Date(entry['completionTime']);
        let formattedDate = date.toLocaleDateString("en-UK", options);
        html +=
            "<tr>" +
            "<td>" + rank + "</td>" +
            "<td>" + entry['player'] + "</td>" +
            "<td>" + entry['score'] + "</td>" +
            "<td>" + formattedDate + "</td>" +
            "</tr>";
        rank += 1;
    }
    document.getElementById("leaderBoardTable").innerHTML += html;
    document.getElementById("loading").style.display = "none";
    document.getElementById("leaderBoardTable").style.display = "block";
}

//========================OTHER FUNCTIONS=========================//

//=========================GET LOCATION===========================//
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        messageBoxP.style.color = "red";
        messageBoxP.innerText = "Geolocation is not supported by your browser.";
        document.getElementById("messageBoxP").style.display = "block";
    }
}

function showPosition(position) {
    clearInterval();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initMap(latitude, longitude);
    fetch(API_LOCATION + "?session=" + sessionID + "&latitude=" + latitude + "&longitude=" + longitude)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                document.getElementById("messageBoxP").style.display = "block";
            } else {
                document.getElementById("map").style.display = "block";
                messageBoxP.style.color = "#00a3e8";
                messageBoxP.innerText = jsonObject.message;
                document.getElementById("messageBoxP").style.display = "block";
                document.getElementById("locationButton").style.display = "block";

                setInterval(function () {
                    showPosition(position)
                    initMap(latitude, longitude);
                }, 60000);
            }
        });
}