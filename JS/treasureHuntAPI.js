/*------------------------------------------------GET ELEMENTS BY ID--------------------------------------------------*/
document.getElementById("ask1");
document.getElementById("answerForm");
document.getElementById("answerNumberForm");
document.getElementById("challenges");
document.getElementById("continueButton");
document.getElementById("currentQuestionP");
document.getElementById("gameAttributes");
document.getElementById("hideLeaderBoard");
document.getElementById("instructionsH");
document.getElementById("instructionsPbox");
document.getElementById("leaderBoardTable");
document.getElementById("loading");
document.getElementById("locationButton");
document.getElementById("map");
document.getElementById("messageBoxP");
document.getElementById("messageBoxDiv");
document.getElementById("placeholderBox");
document.getElementById("placeholderNumberBox");
document.getElementById("playerNameP");
document.getElementById("qrButton");
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
document.getElementById("viewLeaderBoard");

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
let index = -1;

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
    usernameBox.style.display = "block";
    treasureHuntsDescriptionParagraph.style.display = "block";
}

/*--------------------------------------------------------------------------------------------------------------------*/
function startSession() {
    deleteCookie();
    loading.style.display = "block";
    messageBoxP.style.display = "block";


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
                messageBoxP.style.display = "none";
                messageBoxDiv.style.display = "block";
                // If all params are correct (username, app name, session) call the questions
                treasureHuntsDescriptionParagraph.style.display = "none";
                loading.style.display = "none";

                fetchQuestions(sessionID);


            }
        });
}

function fetchQuestions() {
    loading.style.display = "block";
    getScore();
    getLeaderBoard();

    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    usernameBox.style.display = "none";
    treasureHuntsDescriptionParagraph.style.display = "none";
    locationButton.style.display = "block";
    skipPopUp.style.display = "none";
    qrButton.style.display = "block";
    questionSection.style.display = "block";
    currentQuestionP.style.display = "block";
    answerForm.style.display = "block";
    answerNumberForm.style.display = "block";
    viewLeaderBoard.style.display = "block";
    /*----------------------------------------------------------------------------------------------------------------*/


    if(hideLeaderBoard.style.display === "block") {
        viewLeaderBoard.style.display = "none";
    }


    // Fetch a json formatted file from the API than requires the session ID and includes the questions
    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            index = JSON.parse(jsonObject.currentQuestionIndex);
            index += 1;
            let numOfQuestion = JSON.parse(jsonObject.numOfQuestions);
            if (index > numOfQuestion) {
                index = numOfQuestion;
            }

            loading.style.display = "none";
            currentQuestionP.innerText = "Question: " + index + " / " + jsonObject.numOfQuestions;

            if (jsonObject.status === "ERROR") {
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxP.style.display = "block";
            } else {
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

            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxP.style.display = "block";
            }
            if (jsonObject.correct === false) {
                score += scoreAdjustment;
                scoreP.innerText = "Score: " + score;
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.message + "  (" + scoreAdjustment + ")";
                messageBoxDiv.style.display = "block";
                messageBoxP.style.display = "block";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";

                setCookie("scoreCookie", score, 30);
            }
            if (jsonObject.correct === true) {
                score += scoreAdjustment;
                scoreP.innerText = "Score: " + score;
                messageBoxP.innerText = jsonObject.message + "  (+" + scoreAdjustment + ")";
                messageBoxDiv.style.display = "block";
                messageBoxP.style.display = "block";
                messageBoxP.style.color = "green";
                placeholderBox.value = "";
                placeholderNumberBox.value = "";
                setCookie("scoreCookie", score, 30);

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
            // Give some alert messages if the username is not valid
            if (jsonObject.status === "ERROR") {
                messageBoxP.style.color = "red";
                messageBoxP.innerText = jsonObject.errorMessages;
                messageBoxDiv.style.display = "block";
                messageBoxP.style.display = "block";
            } else {
                score += scoreAdjustment;
                messageBoxP.style.color = "yellow";
                messageBoxP.innerText = jsonObject.message + "  (" + scoreAdjustment + ")";
                messageBoxDiv.style.display = "block";
                messageBoxP.style.display = "block";
                scoreP.innerText = "Score: " + score;
                setCookie("scoreCookie", score, 30);
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
                viewLeaderBoard.style.display = "none";

                getLeaderBoard();
                deleteCookie();
            }
        });
}

let playerRank;

function getLeaderBoard() {
    viewLeaderBoard.style.display = "none";
    hideLeaderBoard.style.display = "block";
    loading.style.display = "block";
    treasureHuntsDescriptionParagraph.style.display = "none";
    fetch(API_LEADERBOARD + "?session=" + sessionID + "&sorted")
        .then(response => response.json())
        .then(jsonObject => {
            handleLeaderBoard(jsonObject);
            let rankings = jsonObject.leaderboard;
            for (let i = 1; i < rankings.length; i++) {
                if (playerName === rankings[i].player) {
                    playerRank = i;
                    ask1.innerText = "Congratulations for completing the Treasure Hunt. You scored " + score + " and" +
                        " finished in Position #" + i;
                }
                setCookie("playerRankCookie", playerRank, 10000);
            }
        });
}

function handleLeaderBoard(leaderboard) {
    leaderBoardTable.style.display = "none";
    let rank = 1;
    let options = {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        second: '2-digit'
    };

    leaderBoardTable.innerHTML = "";
    let html = "";
    html +=
        "<tr>" +
        "<th>" + "#" + "</th>" +
        "<th>" + "player" + "</th>" +
        "<th>" + "score" + "</th>" +
        "<th>" + "date" + "</th>" +
        "</tr>";


    let leaderBoardArray = leaderboard['leaderboard'];
    for (let i = 0; i < 20; i++) {
        let date = new Date(leaderBoardArray[i]['completionTime']);
        let formattedDate = date.toLocaleDateString("en-UK", options);

        if (i === 0) {
            html +=
                "<tr>" +
                "<td>"  + playerRank + "</td>" +
                "<td>"  + "YOU" + "</td>" +
                "<td>"  + score + "</td>" +
                "<td>" + formattedDate + "</td>" +
                "</tr>";
        }

        html +=
            "<tr>" +
            "<td>" + rank + "</td>" +
            "<td>" + leaderBoardArray[i]['player'] + "</td>" +
            "<td>" + leaderBoardArray[i]['score'] + "</td>" +
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
                messageBoxP.style.color = "#00a3e8";
                messageBoxP.innerText = jsonObject.message;
                messageBoxP.style.display = "block";

                // Update location every 60 seconds
                setInterval(function () {
                }, 60000);
            }
        });
}

function setCookie(cname, cvalue, exminutes) {
    let d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
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
    let cookie3 = Number(getCookie("scoreCookie"));
    let cookie4 = Number(getCookie("playerRankCookie"));

    if (cookie !== "" && cookie2 !== "") {
        username.style.display = "none";
        submitButton.style.display = "none";
        newGameButton.style.display = "block";
        sessionID = cookie;
        playerName = cookie2;
        score = cookie3;
        playerRank = cookie4;
        alert("Welcome back " + playerName);
        getChallenges();
    } else {
        // Call the first function to START THE QUIZ!
        getChallenges();
        document.getElementById("continueButton").style.display = "none";
    }
}

function deleteCookie() {
    document.cookie = "sessionCookie=; path=/;";
    document.cookie = "playerNameCookie=; path=/;";
    document.cookie = "scoreCookie=; path=/;";
    document.cookie = "playerRankCookie=; path=/;";
}

function startGame() {
    score = 0;
    startSession(uuid);

}

checkCookie();

let x = 1;

function reloadPage() {
    if (index < 0) {
        location.reload();
    } else {
        fetchQuestions(sessionID);
        x += 1;
        if (x === 4) {
            location.reload();
            x = 1;
        }
    }
}

function newGame() {
    deleteCookie();
    username.style.display = "block";
    submitButton.style.display = "block";
    messageBoxP.style.display = "block";
    newGameButton.style.display = "none";
    continueButton.style.display = "none";
}

function viewLeaderboard() {
    viewLeaderBoard.style.display= "none";
    hideLeaderBoard.style.display = "block";
    getLeaderBoard();
}

function hideLeaderboard() {
    viewLeaderBoard.style.display= "block";
    hideLeaderBoard.style.display = "none";
    leaderBoardTable.style.display = "none";
}

