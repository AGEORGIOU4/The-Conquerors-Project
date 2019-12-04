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
let latitude = "";
let longitude = "";
const cookieSession = "cookieSession";
const cookiePlayerName = "cookiePlayerName";

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
                treasureHuntsButton.style.padding = "25px";
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


    // Show username input
    let userInput = document.getElementById("usernameBox");
    userInput.style.display = "block";
    document.getElementById("treasureHuntsDescriptionParagraph");
    treasureHuntsDescriptionParagraph.style.display = "block";
    document.getElementById("messageBoxDiv").style.display = "block";
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
                messageBoxP.style.display = "block";
                messageBoxP.innerText = jsonObject.errorMessages;
            } else {
                setCookie(cookieSession, sessionID, 1);
                setCookie(cookiePlayerName, playerName, 1)

                document.getElementById("messageBoxP").style.display = "none";
                // If all params are correct (username, app name, session) call the questions
                document.getElementById("treasureHuntsDescriptionParagraph").style.display = "none";
                document.getElementById("loading").style.display = "none";
                fetchQuestions(sessionID);
            }
        });
}

function resumeSession() {
playerName = cookiePlayerName;
   startSession(cookieSession,cookiePlayerName);

}

function fetchQuestions() {
    getScore();
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    document.getElementById("usernameBox").style.display = "none";
    document.getElementById("questionSection").style.display = "block";
    document.getElementById("answerForm").style.display = "block";
    /*----------------------------------------------------------------------------------------------------------------*/

    // Retrieve a paragraph element named "question" to add the questions
    document.getElementById("question");
    // Fetch a json formatted file from the API than requires the session ID and includes the questions
    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {              //Print on the console the object attributes
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
            document.getElementById("messageBoxP").style.display = "block";
            messageBoxP.style.color = "red";
            document.getElementById("placeholderBox");
            document.getElementById("placeholderNumberBox");
            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.innerText = jsonObject.errorMessages;
            } if (jsonObject.correct === false) {
                messageBoxP.innerText = jsonObject.message + " -3";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";
            } if (jsonObject.correct === true) {
                messageBoxP.innerText = jsonObject.message + " +10";
                messageBoxP.style.color = "green";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";

                fetchQuestions();
            }
        });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function skipQuestion() {
    messageBoxP.style.color = "red";
    fetch(API_SKIP + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            document.getElementById("messageBoxP").style.display = "block";
            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.innerText = jsonObject.errorMessages;
            } else {
                messageBoxP.style.color = "yellow";
                messageBoxP.innerText = jsonObject.message + " -5";
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
                document.getElementById("messageBoxDiv").style.display = "block";
                document.getElementById("messageBoxP").style.display = "block";
                document.getElementById("questionSection").style.display = "none";
                document.getElementById("answerButtons").style.display = "none";
                document.getElementById("messageBoxP").innerText = "Congratulations! You finished the " +
                    "Treasure Hunt";
                messageBoxP.style.color = "green";

                getLeaderboard();
            }
        });
}

function getLeaderboard() {
    fetch(API_LEADERBOARD + "?session=" +  sessionID + "&sorted&limit=10")
        .then(response => response.json())
        .then(jsonObject => {
            console.log("Leader board " + sessionID);
            console.log(jsonObject);
        });
}

function handleLeaderBoard(leaderboard) {
    let options = {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'};
    let html = "";
    let leaderboardArray = leaderboard['leaderboard'];
    for (const entry of leaderboardArray) {

        let date = new Date(entry['completionTime']);
        let formattedDate = date.toLocaleTimeString("en-uk", options);
        html += "<tr>" +
            "<td>" + entry['player'] + "</td>" +
            "<td>" + entry['score'] + "</td>" +
            "<td>" + entry[formattedDate] + "</td>" +
            "</tr>";

        let leaderboardElement = document.getElementById('test-results-table'); // table
        leaderboardElement.innerHTML += html;  // append generated HTML to existing

    }
}


// Set cookie for session
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


//========================OTHER FUNCTIONS=========================//


//=========================GET LOCATION=========================//
function getLocation() {
    document.getElementById("messageBoxDiv").style.display = "block";
    document.getElementById("messageBoxP").style.display = "block";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        messageBoxP.innerText = "Geolocation is not supported by your browser.";
    }
}


function showPosition(position) {
    clearInterval();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    fetch(API_LOCATION + "?session=" + sessionID + "&latitude=" + latitude + "&longitude=" + longitude)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            document.getElementById("messageBoxP").style.display = "block";
            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
            } else {
                messageBoxP.innerText = jsonObject.message;
                messageBoxP.style.color = "blue";
                setInterval(function () {
                    showPosition(position)}, 60000)
            }
        });
}


