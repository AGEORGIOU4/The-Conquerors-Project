const API_LIST = "https://codecyprus.org/th/api/list";
const API_START = "https://codecyprus.org/th/api/start";
const API_QUESTIONS = "https://codecyprus.org/th/api/question";
const API_ANSWER = "https://codecyprus.org/th/api/answer";
const API_SKIP = "https://codecyprus.org/th/api/skip";
const API_LEADERBOARD = "https://codecyprus.org/th/api/leaderboard?sorted&session=";

// Parameters
let sessionID = "";
let uuid = "";
let appName = "";
let answer = "";


// Create a list to add dynamically all the TH challenges
let list = document.getElementById("challenges");

// Get Challenges
function getChallenges() {
    fetch(API_LIST)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);      //Print on the console the object attributes

            // Give some alert messages if status is error
            status = jsonObject.status;
            if (status === "ERROR") {
                alert(jsonObject.errorMessages);
            } else {

                // Get Treasure Hunt array
                let treasureHuntsArray = jsonObject.treasureHunts;

                // Get challenges list from the app page
                const challengesList = document.getElementById("challenges");

                // Traverse the array to get needed data
                for (let i = 0; i < treasureHuntsArray.length; i++) {

                    // Get the Treasure Hunt uuid
                    let uuidLocal = treasureHuntsArray[i].uuid;

                    // Create a button for each TH challenge
                    let treasureHuntsBtn = document.createElement('input');
                    treasureHuntsBtn.type = "button";
                    treasureHuntsBtn.value = treasureHuntsArray[i].name;
                    treasureHuntsBtn.style.fontSize = "-webkit-xxx-large";
                    treasureHuntsBtn.style.margin = "15px 25px";

                    // The name of the button is the corresponding uuid
                    treasureHuntsBtn.name = treasureHuntsArray[i].uuid;
                    treasureHuntsBtn.id = "treasureHuntsBtn" + [i + 1];

                    // Define the uuid for each TH on click
                    treasureHuntsBtn.onclick = function () {
                        uuid = uuidLocal
                    };

                    //===============================CALL GET CREDENTIALS ON CLICK===================================//
                    treasureHuntsBtn.addEventListener("click", getCredentials);

                    // Add the TH challenges buttons on a list
                    challengesList.appendChild(treasureHuntsBtn);
                }
            }
        });
}

// Call the first function to start the quiz
getChallenges(list);

// Get the username and the app name and pass them to Start Session
function getCredentials() {
//============================================================================================//
    // Hide Treasure Hunt Instructions & Challenges
    document.getElementById("instructionsBox");
    document.getElementById("selectTH");
    document.getElementById("challenges");
    instructionsBox.style.display = "none";
    selectTH.style.display = "none";
    challenges.style.display = "none";
//============================================================================================//
    // Show username input
    let userInput = document.getElementById("usernameBox");
    userInput.style.display = "block";
}

function startSession(uuid) {
    // Get required parameters for START URL
    let playerName = document.getElementById("username").value;
    appName = "TheConquerors";

    fetch(API_START + "?player=" + playerName + "&app=" + appName + "&treasure-hunt-id=" + uuid)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            // Set sessionID to the current session
            sessionID = jsonObject.session;

            // Give some alert messages if the username is not valid
            status = jsonObject.status;
            if (status === "ERROR") {
                alert(jsonObject.errorMessages);
            } else {
                // If all params are correct (username, app name, session) call the questions and set (1)_(cookies!!!)
                getQuestions(sessionID);
                setCookies(sessionID);
            }
        });
}

function getQuestions(sessionID) {
//============================================================================================//
    // Hide username input
    document.getElementById("usernameBox");
    usernameBox.style.display = "none";

    // Retrieve a paragraph element named "question" to add the questions
    document.getElementById("question");
//============================================================================================//

    // Fetch a json formatted file from the API than requires the session ID and includes the questions
    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {              //Print on the console the object attributes

            // Give some alert messages if status is error
            status = jsonObject.status;
            if (status === "ERROR") {
                alert(jsonObject.errorMessages);
            } else {

            // Print on the console the json of questions
            console.log(jsonObject);

            // Change the questions paragraph content by adding the question from the server
            question.innerHTML = jsonObject.questionText;

            //====================QUESTION ATTRIBUTES==================//
            let typeOfQuestion = jsonObject.questionType;
            let skipQuestion = jsonObject.canBeSkipped;
            let currentQuestionIndex = jsonObject.currentQuestionIndex;
            let requiresLocation = jsonObject.requiresLocation;

            getTypeOfQuestion(typeOfQuestion);
            getLocation(requiresLocation);
            questionCanBeSkipped(skipQuestion, currentQuestionIndex);
            }
        });
}

function updateUI(currentQuestionIndex) {
    document.getElementById("question");



}

// Set cookie for session
function setCookies (sessionID) {
    let date = new Date();
    let milliseconds = 365 * 24 * 60 *  1000;
    let expireDateTime = date.getTime() + milliseconds;
    date.setTime(expireDateTime);
    document.cookie = sessionID + "session expires: " + date.toUTCString();

    //testing cookie
    var cookies = document.cookie;
    console.log(cookies);
}

// UNDEFINED SESSION!!!!!!!!
setCookies(sessionID);

// ============== QUESTION ATTRIBUTES FUNCTIONS ============== //

function getTypeOfQuestion(typeOfQuestion) {
    document.getElementById("booleanButtons");

    document.getElementById("mcqButtons");

    document.getElementById("integerBtn");
    document.getElementById("submitIntegerBtn");

    document.getElementById("numericBtn");
    document.getElementById("submitNumericBtn");

    document.getElementById("textBtn");
    document.getElementById("submitTextBtn");

    if (typeOfQuestion === "BOOLEAN") {
        booleanButtons.style.display = "block";
    }
    if (typeOfQuestion === "MCQ") {
        mcqButtons.style.display = "block";
    }
    if (typeOfQuestion === "INTEGER") {
        integerBtn.style.display = "block";
        submitIntegerBtn.style.display = "block";
    }
    if (typeOfQuestion === "NUMERIC") {
        numericBtn.style.display = "block";
        submitNumericBtn.style.display = "block";
    }
    if (typeOfQuestion === "TEXT") {
        textBtn.style.display = "block";
        submitTextBtn.style.display = "block";
    }
}

function questionCanBeSkipped(skipQuestion, currentQuestionIndex) {
    if (skipQuestion === true) {
    document.getElementById("skipButton");
    skipButton.style.display = "block";

    fetch(API_SKIP + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            skipButton.onclick = function () {
                currentQuestionIndex += 1;
                console.log(currentQuestionIndex)
                updateUI();
            };
            getLeaderboard(sessionID);

        });
}
}





function getAnswer() {
    let numericAnswer = document.getElementById("numericBtn").value;
    console.log(numericAnswer);

}




function getLeaderboard(sessionID) {
    fetch(API_LEADERBOARD + sessionID + "&sorted&limit=20")
        .then(response => response.json())
        .then(json => {
    console.log ("leaderboard " + sessionID);
    console.log(json);
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


//========================OTHER FUNCTIONS=========================//

//=========================QR CODE READER=========================//
function QRCodeReader() {
    //opts
    let opts = {
        // Whether to scan continuously for QR codes. If false, use scanner.scan() to
        // manually scan. If true, the scanner emits the "scan" event when a QR code is
        // scanned. Default true.
        continuous: true,

        // The HTML element to use for the camera's video preview. Must be a <video>
        // element. When the camera is active, this element will have the "active" CSS
        // class, otherwise, it will have the "inactive" class. By default, an invisible
        // element will be created to host the video.
        video: document.getElementById('preview'),

        // Whether to horizontally mirror the video preview. This is helpful when trying to
        // scan a QR code with a user-facing camera. Default true.
        mirror: false,

        // Whether to include the scanned image data as part of the scan result. See the
        // "scan" event for image format details. Default false.
        captureImage: false,

        // Only applies to continuous mode. Whether to actively scan when the tab is not
        // active.
        // When false, this reduces CPU usage when the tab is not active. Default true.
        backgroundScan: true,

        // Only applies to continuous mode. The period, in milliseconds, before the same QR
        // code will be recognized in succession. Default 5000 (5 seconds).
        refractoryPeriod: 5000,

        // Only applies to continuous mode. The period, in rendered frames, between scans. A
        // lower scan period increases CPU usage but makes scan response faster.
        // Default 1 (i.e. analyze every frame).
        scanPeriod: 1
    };


    let scanner = new Instascan.Scanner(opts);

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[1]);
        } else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);
    });

    scanner.addListener('scan', function (content) {
        console.log(content);
        document.getElementById("content").innerHTML = content;
    });
}

//=========================GET LOCATION=========================//
function getLocation(requiresLocation) {
    if (requiresLocation === true)
    {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }
}

function showPosition(position) {

    alert("Successfully Obtained Location");

}


