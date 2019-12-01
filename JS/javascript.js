const API_LIST = "https://codecyprus.org/th/api/list";
const API_START = "https://codecyprus.org/th/api/start";
const API_QUESTIONS = "https://codecyprus.org/th/api/question";
const API_ANSWER = "https://codecyprus.org/th/api/answer";
const API_LOCATION = "https://codecyprus.org/th/api/location";
const API_SKIP = "https://codecyprus.org/th/api/skip";
/*--------------------------------------------------------------------------------------------------------------------*/

// Parameters
let sessionID = "";
let uuid = "";
let appName = "";
let skipQuestion = "";
let latitude = "";
let longitude = "";

/*--------------------------------------------------------------------------------------------------------------------*/

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
                // Get Treasure Hunt Array
                let treasureHuntsArray = jsonObject.treasureHunts;
                // Get challenges list from the app page
                const challengesList = document.getElementById("challenges");
                // Traverse the array to get needed data
                for (let i = 0; i < treasureHuntsArray.length; i++) {
                    // Get the Treasure Hunt uuid
                    let uuidLocal = treasureHuntsArray[i].uuid;
                    // Create a button and style it for each TH challenge
                    let treasureHuntsBtn = document.createElement('input');
                    treasureHuntsBtn.type = "button";
                    treasureHuntsBtn.value = treasureHuntsArray[i].name;
                    treasureHuntsBtn.style.fontSize = "-webkit-xxx-large";
                    treasureHuntsBtn.style.margin = "15px 25px";
                    // The name of the button is the corresponding uuid
                    treasureHuntsBtn.id = "treasureHuntsBtn" + [i + 1];
                    // Define the uuid for each TH on click
                    treasureHuntsBtn.onclick = function () {
                        uuid = uuidLocal
                    };
                    /*--------------------------------CALL GET CREDENTIALS ON CLICK-----------------------------------*/
                    treasureHuntsBtn.addEventListener("click", getCredentials);

                    // Add the TH challenges buttons on a list
                    challengesList.appendChild(treasureHuntsBtn);

                    /* List attributes */

                }
            }
        });
}

/*-----------------------------------------------SHOW / HIDE ELEMENTS-------------------------------------------------*/
function showChallenges() {
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
    document.getElementById("instructionsBox");
    document.getElementById("selectTH");
    document.getElementById("challenges");
    challenges.style.display = "none";
    selectTH.style.display = "none";
    selectTH2.style.display = "none";
    instructionsBox.style.display = "none";
    selectTH.style.display = "none";
    challenges.style.display = "none";
    // Show username input
    let userInput = document.getElementById("usernameBox");
    userInput.style.display = "block";
}
/*--------------------------------------------------------------------------------------------------------------------*/

function startSession(uuid) {
    // Get required parameters for START URL
    let playerName = document.getElementById("username").value;
    appName = "TheConquerors";

    console.log("Player Name: " + playerName);
    console.log("App Name: " + appName);
    console.log("uuid: " + uuid);

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
                fetchQuestions(sessionID);
                setCookies(sessionID);
            }
        });
}

function fetchQuestions() {
    /*---------------------------------------------SHOW / HIDE ELEMENTS-----------------------------------------------*/
    document.getElementById("usernameBox");
    usernameBox.style.display = "none";
    document.getElementById("questionSection");
    questionSection.style.display = "block";
    document.getElementById("answerForm");
    answerForm.style.display = "block";
    /*----------------------------------------------------------------------------------------------------------------*/

    // Retrieve a paragraph element named "question" to add the questions
    document.getElementById("question");

    // Fetch a json formatted file from the API than requires the session ID and includes the questions
    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {              //Print on the console the object attributes

            console.log(jsonObject);

            // Give some alert messages if status is error
            status = jsonObject.status;
            if (status === "ERROR") {
                alert(jsonObject.errorMessages);
            } else {
                // Change the questions paragraph content by adding the question from the server
                question.innerHTML = jsonObject.questionText;
                // Question attributes
                let typeOfQuestion = jsonObject.questionType;
                skipQuestion = jsonObject.canBeSkipped;

                let requiresLocation = jsonObject.requiresLocation;
                if (requiresLocation === true) {
                    getLocation(latitude, longitude);
                }

                getTypeOfQuestion(typeOfQuestion);

                questionCanBeSkipped(skipQuestion);
            }
        });
}

function getAnswer(answer) {
    console.log(answer);
    checkAnswer(answer);
}

function checkAnswer(answer) {
    fetch(API_ANSWER + "?session=" + sessionID + "&answer=" + answer)
        .then(response => response.json())
        .then(jsonObject => {

            let correct = jsonObject.correct;
            // Give some alert messages if the username is not valid
            status = jsonObject.status;
            if (status === "ERROR") {
                alert(jsonObject.errorMessages);
            } else {
                console.log(jsonObject);
                if (correct === true) {
                    document.getElementById("placeholderBox");
                    placeholderBox.value = "";
                    fetchQuestions(sessionID);
                }
            }
        });
}


// UNDEFINED SESSION!!!!!!!!
setCookies(sessionID);


function getTypeOfQuestion(typeOfQuestion) {
//==============================================SHOW/HIDE ELEMENTS==============================================//
    document.getElementById("booleanButtons");
    document.getElementById("mcqButtons");
    document.getElementById("placeholderBox");
    document.getElementById("placeholderSubmit");

    if (typeOfQuestion === "BOOLEAN") {
        booleanButtons.style.display = "block";

        mcqButtons.style.display = "none";
        placeholderBox.style.display = "none";
        placeholderSubmit.style.display = "none";
    }
    if (typeOfQuestion === "MCQ") {
        mcqButtons.style.display = "block";

        booleanButtons.style.display = "none";
        placeholderBox.style.display = "none";
        placeholderSubmit.style.display = "none";
    }
    if (typeOfQuestion === "INTEGER" || typeOfQuestion === "NUMERIC" || typeOfQuestion === "TEXT") {
        placeholderBox.style.display = "block";
        placeholderSubmit.style.display = "block";

        booleanButtons.style.display = "none";
        mcqButtons.style.display = "none";
    }
}
//==============================================================================================================//


function questionCanBeSkipped(skipQuestion) {
//==============================================SHOW/HIDE ELEMENTS==============================================//

    if (skipQuestion === false) {
        document.getElementById("skipButton");
        skipButton.style.display = "none";
    } else {
        document.getElementById("skipButton");
        skipButton.style.display = "block";
    }
}
//==============================================================================================================//
function skipIt() {
fetch(API_SKIP + "?session=" + sessionID)
    .then(response => response.json()) //Parse JSON text to JavaScript object
    .then(jsonObject => {
        document.getElementById("skipButton");
        console.log(jsonObject);

        // Give some alert messages if the username is not valid
        status = jsonObject.status;
        if (status === "ERROR") {
            alert(jsonObject.errorMessages);
        } else {
                fetchQuestions(sessionID);
        }
    });
}



/*function getLeaderboard(sessionID) {
    fetch(API_LEADERBOARD + sessionID + "&sorted&limit=20")
        .then(response => response.json())
        .then(json => {
            console.log("leaderboard " + sessionID);
            console.log(json);
        });
}*/

/*function handleLeaderBoard(leaderboard) {
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
}*/


// Set cookie for session
function setCookies(sessionID) {
    let date = new Date();
    let milliseconds = 365 * 24 * 60 * 1000;
    let expireDateTime = date.getTime() + milliseconds;
    date.setTime(expireDateTime);
    document.cookie = sessionID + " session expires: " + date.toUTCString();

    //testing cookie
    let cookies = document.cookie;
    console.log(cookies);
}


//========================OTHER FUNCTIONS=========================//


//=========================GET LOCATION=========================//
function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);

        } else {
            alert("Geolocation is not supported by your browser.");
        }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    fetch(API_LOCATION + "?session=" + sessionID + "&latitude=" + latitude + "&longitude=" + longitude)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);
            // Give some alert messages if the username is not valid
            status = jsonObject.status;
            if (status === "ERROR") {
                alert(jsonObject.errorMessages);
            } else {
                alert("Location Received!");
            }
        });
}

//=========================QR CODE READER=========================//
function QRCodeReader() {
    document.getElementById("preview");
    preview.style.display = "block";

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
            scanner.start(cameras[0]);
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

//=========================QR CODE READER=========================//
function QRCodeReader2() {
    document.getElementById("preview");
    preview.style.display = "block";

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

