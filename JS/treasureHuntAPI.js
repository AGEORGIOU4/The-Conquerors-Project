/*------------------------------------------------GET ELEMENTS BY ID--------------------------------------------------*/

document.getElementById("answerForm");
document.getElementById("answerNumberForm");
document.getElementById("challenges");
document.getElementById("continueButton");
document.getElementById("currentQuestionP");
document.getElementById("gameAttributes");
document.getElementById("instructionsH");
document.getElementById("instructionsPbox");
document.getElementById("loading");
document.getElementById("locationButton");
document.getElementById("map");
document.getElementById("messageBoxP");
document.getElementById("messageBoxDiv");
document.getElementById("placeholderBox");
document.getElementById("placeholderNumberBox");
document.getElementById("playerNameP");
document.getElementById("qrImg");
document.getElementById("question");
document.getElementById("questionSection");
document.getElementById("scoreP");
document.getElementById("selectTH");
document.getElementById("selectTH2");
document.getElementById("skipButton");
document.getElementById("skipPopUp");
document.getElementById("theConquerorsLogo");
document.getElementById("treasureHuntsDescriptionParagraph");
document.getElementById("username");
document.getElementById("usernameBox");
document.getElementById("usernameMessage");
document.getElementById("leaderBoardTable");

/*Answer Buttons*/
document.getElementById("booleanButtons");
document.getElementById("mcqButtons");
document.getElementById("placeholderBox");
document.getElementById("placeholderSubmit");
document.getElementById("placeholderNumberBox");
document.getElementById("placeholderNumberSubmit");


/*--------------------------------------------------------------------------------------------------------------------*/

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
let score = 0;

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
                treasureHuntsDescriptionParagraph.innerHTML = treasureHuntsArray[i].description;
                let uuidLocal = treasureHuntsArray[i].uuid;
                let descriptionLocal = treasureHuntsArray[i].description;

/*====================================================================================================================*/
                // Create a button and style it for each TH challenge
                let treasureHuntsButton = document.createElement('input');
                //Treasure Hunts Buttons styles
                treasureHuntsButton.type = "button";
                treasureHuntsButton.value = treasureHuntsArray[i].name;
                treasureHuntsButton.style.fontSize = "-webkit-xxx-large";
                treasureHuntsButton.style.marginTop = "25px";
                treasureHuntsButton.style.marginBottom = "0";
                treasureHuntsButton.style.padding = "20";
                treasureHuntsButton.style.width = "95%";
                treasureHuntsButton.id = "treasureHuntsButton" + [i + 1];
/*====================================================================================================================*/
                // Define the UUID for each TH on click
                treasureHuntsButton.onclick = function () {
                    uuid = uuidLocal;
                    description = descriptionLocal;
                    treasureHuntsDescriptionParagraph.innerText = description;
                };
                /*--------------------------------CALL GET CREDENTIALS ON CLICK---------------------------------------*/
                treasureHuntsButton.addEventListener("click", getCredentials);
                // Add the TH challenges buttons on a list
                challengesList.appendChild(treasureHuntsButton);
            }
        });
}
/*====================================================================================================================*/
function showChallenges() {
    challenges.style.display = "block";
    selectTH.style.display = "none";
    selectTH2.style.display = "block";
}
function hideChallenges() {
    challenges.style.display = "none";
    selectTH.style.display = "block";
    selectTH2.style.display = "none";
}
/*====================================================================================================================*/


// Get the username and the app name and pass them to Start Session
function getCredentials() {
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    challenges.style.display = "none";
    selectTH.style.display = "none";
    selectTH2.style.display = "none";
    instructionsPbox.style.display = "none";
    instructionsH.style.display = "none";
    usernameMessage.style.display = "block";
    usernameBox.style.display = "block";
    treasureHuntsDescriptionParagraph.style.display = "block";
}
/*--------------------------------------------------------------------------------------------------------------------*/
function startSession() {
    loading.style.display = "block";
    messageBoxP.style.display = "none";

    // Get required parameters for START URL
    playerName = username.value;
    setCookie("playerNameCookie", playerName, 30);
    appName = "TheConquerors";

    fetch(API_START + "?player=" + playerName + "&app=" + appName + "&treasure-hunt-id=" + uuid)
        .then(response => response.json()) //Parse JSON text
        .then(jsonObject => {

            // Set sessionID to the current session
            sessionID = jsonObject.session;
            setCookie("sessionCookie", sessionID, 30);

            if (jsonObject.status === "ERROR") {
                loading.style.display = "none";
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxP.style.display = "block";
                messageBoxDiv.style.display = "block";
            } else {
                messageBoxDiv.style.display = "block";
                usernameMessage.style.display = "none";
                messageBoxP.style.display = "none";
                // If all params are correct (username, app name, session) call the questions
                treasureHuntsDescriptionParagraph.style.display = "none";
                loading.style.display = "none";

                fetchQuestions(sessionID);
                getLocation();
            }
        });
}

function fetchQuestions() {
    loading.style.display = "block";
    getScore();

    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    usernameBox.style.display = "none";
    usernameMessage.style.display = "none";
    treasureHuntsDescriptionParagraph.style.display = "none";
    locationButton.style.display = "none";
    skipPopUp.style.display = "none";
    qrImg.style.display = "block";
    questionSection.style.display = "block";
    currentQuestionP.style.display = "block";
    answerForm.style.display = "block";
    answerNumberForm.style.display = "block";
    /*----------------------------------------------------------------------------------------------------------------*/

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
            loading.style.display = "none";
            currentQuestionP.innerText = "Question: " + index + " / " + jsonObject.numOfQuestions;

            if (jsonObject.status === "ERROR") {
                messageBoxP.innerText = jsonObject.errorMessages;
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
                    skipButton.style.display = "block";
                }
                if (jsonObject.canBeSkipped === false) {
                    skipButton.style.display = "none";
                }
                let typeOfQuestion = jsonObject.questionType;

                getTypeOfQuestion(typeOfQuestion);
            }
        });
}

function getTypeOfQuestion(typeOfQuestion) {
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    booleanButtons.style.display = "none";
    mcqButtons.style.display = "none";
    placeholderBox.style.display = "none";
    placeholderSubmit.style.display = "none";
    placeholderNumberBox.style.display = "none";
    placeholderNumberSubmit.style.display = "none";
    /*----------------------------------------------------------------------------------------------------------------*/

    if (typeOfQuestion === "BOOLEAN") {
        booleanButtons.style.display = "block";
    }
    if (typeOfQuestion === "MCQ") {
        mcqButtons.style.display = "block";
    }
    if (typeOfQuestion === "TEXT" || typeOfQuestion === "NUMERIC") {
        placeholderBox.style.display = "block";
        placeholderSubmit.style.display = "block";
    }
    if (typeOfQuestion === "INTEGER") {
        placeholderNumberBox.style.display = "block";
        placeholderNumberSubmit.style.display = "block";
    }
}

function getAnswer(answer) {
    fetch(API_ANSWER + "?session=" + sessionID + "&answer=" + answer)
        .then(response => response.json())
        .then(jsonObject => {

            scoreAdjustment = jsonObject.scoreAdjustment;
            let obj = JSON.parse(scoreAdjustment);

            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxP.style.display = "block";
            }
            if (jsonObject.correct === false) {
                score += obj;
                scoreP.innerText = "Score: " + score;
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.message + "  (" + scoreAdjustment + ")";
                messageBoxP.style.display = "block";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";
            }
            if (jsonObject.correct === true) {
                score += obj;
                scoreP.innerText = "Score: " + score;
                messageBoxP.style.color = "green";
                messageBoxP.innerText = jsonObject.message + "  (+" + scoreAdjustment + ")";
                messageBoxP.style.display = "block";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";

                setCookie("scoreCookie", score, 30);
                fetchQuestions();
            }
        });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function askSkip(answerSkip) {
   skipPopUp.style.display = "block";
    if (answerSkip === true) {
        skipQuestion();
    }
    if (answerSkip === false) {
        skipPopUp.style.display = "none";
    }

}

function skipQuestion() {
    fetch(API_SKIP + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            scoreAdjustment = jsonObject.scoreAdjustment;
            let obj = JSON.parse(scoreAdjustment);
            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxP.style.display = "block";
            } else {
                score += obj;
                messageBoxP.style.color = "yellow";
                messageBoxP.innerText = jsonObject.message + "  (" + scoreAdjustment + ")";
                messageBoxP.style.display = "block";
                scoreP.innerText = "Score: " + score;
                fetchQuestions(sessionID);
            }
        });
}

function getScore() {
    theConquerorsLogo.style.display = "none";
    gameAttributes.style.display = "block";
    playerNameP.style.display = "block";
    scoreP.style.display = "block";

    fetch(API_SCORE + "?session=" + sessionID)
        .then(response => response.json())
        .then(jsonObject => {

            playerNameP.innerText = "Player: " + jsonObject.player;
            scoreP.innerText = "Score: " + score;

            if (jsonObject.completed === true) {
                messageBoxDiv.style.display = "none";
                questionSection.style.display = "none";
                answerButtons.style.display = "none";
                messageBoxP.style.display = "none";
                enjoyGame.style.display = "block";

                getLeaderBoard();
                deleteCookie();
            }
        });
}

function getLeaderBoard() {
    loading.style.display = "block";
    treasureHuntsDescriptionParagraph.style.display = "none";
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
    leaderBoardTable.innerHTML += html;
    loading.style.display = "none";
    leaderBoardTable.style.display = "block";
}

//========================OTHER FUNCTIONS=========================//

//=========================GET LOCATION===========================//
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        messageBoxP.style.color = "red";
        messageBoxP.innerText = "Geolocation is not supported by your browser.";
        messageBoxP.style.display = "block";
    }
}

function showPosition(position) {
    clearInterval();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initMap();

    fetch(API_LOCATION + "?session=" + sessionID + "&latitude=" + latitude + "&longitude=" + longitude)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxP.style.display = "block";
            } else {
                map.style.display = "block";
                messageBoxP.style.color = "#00a3e8";
                messageBoxP.innerText = jsonObject.message;
                messageBoxP.style.display = "block";
                locationButton.style.display = "block";

                setInterval(function () {
                    showPosition(position);
                }, 45000);
            }
        });
}

function setCookie(cname, cvalue, exminutes) {
    var d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let cookie = getCookie("sessionCookie");
    let cookie2 = getCookie("playerNameCookie");
    let cookie3 = getCookie("scoreCookie");

    if (cookie !=="" && cookie2 !=="" && cookie3!=="") {
        sessionID = cookie;
        playerName = cookie2;
        score = cookie3;
        alert("Welcome back " + playerName);
        getChallenges();
    }
    else {
        // Call the first function to START THE QUIZ!
        getChallenges();
        }
    }

function deleteCookie() {
document.cookie = "sessionCookie = ; path=/;";
document.cookie = "playerNameCookie =; path=/;";
document.cookie = "scoreCookie =; path=/;";
}

checkCookie();