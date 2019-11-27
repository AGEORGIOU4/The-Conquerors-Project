const API_LIST = "https://codecyprus.org/th/api/list";
const API_START = "https://codecyprus.org/th/api/start";
const API_QUESTIONS = "https://codecyprus.org/th/api/question";

// Parameters
let sessionID = "";
let uuid="";
let playerName="";
let appName = "";

// Create a list to add dynamically all the TH challenges
let list = document.getElementById("challenges");

// Get Challenges
function getChallenges() {
    fetch(API_LIST)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);

            // Get Treasure Hunt array
            let treasureHuntsArray = jsonObject.treasureHunts;

            // Get challenges list from the app page
            const challengesList = document.getElementById("challenges");

            // Traverse the array to get needed data
            for (let i = 0; i < treasureHuntsArray.length; i++) {

                // Get the TH uuid
                let uuidLocal = treasureHuntsArray[i].uuid;

                // Create a button for each TH challenge
                let treasureHuntsBtn = document.createElement('input');
                treasureHuntsBtn.type = "button";
                treasureHuntsBtn.value = treasureHuntsArray[i].name;

                // The name of the button is the corresponding uuid
                treasureHuntsBtn.name = treasureHuntsArray[i].uuid;
                treasureHuntsBtn.id = "treasureHuntsBtn" + [i];

                // Define the uuid for each TH on click
                treasureHuntsBtn.onclick =  function () {

                    uuid = uuidLocal
                };

                    //===============================CALL GET CREDENTIALS ON CLICK===================================//
                    treasureHuntsBtn.addEventListener("click", getCredentials);

                        // Add the TH challenges buttons on a list
                        challengesList.appendChild(treasureHuntsBtn);

                }
        });
}

// Call the first function to start the quiz
getChallenges(list);

function getCredentials() {
    // Hide Treasure Hunt challenges
    document.getElementById("selectTH");
    document.getElementById("challenges");
    challenges.style.display = "none";
    selectTH.style.display = "none";

    // Show username input
    let userInput = document.getElementById("usernameBox");
    userInput.style.display = "block";

    // Get required parameters for START URL
    appName = "TheConquerors";
}

function startSession(uuid) {
    let playerName = document.getElementById("username").value;
    fetch(API_START + "?player=" +  playerName + "&app=" + appName +  "&treasure-hunt-id=" + uuid)
            .then(response => response.json()) //Parse JSON text to JavaScript object
            .then(jsonObject => {
                sessionID = jsonObject.session;

                status = jsonObject.status;
                if (status === "ERROR") {
                    alert(jsonObject.errorMessages);
                }
                else {
                    getQuestions(sessionID);
                }
            });
}

function getQuestions(sessionID) {
    // Hide username input
    document.getElementById("usernameBox");
    usernameBox.style.display = "none";

    //Show Questions
    document.getElementById("question");




    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

            console.log(jsonObject);
            question.innerHTML = jsonObject.questionText;
        });
}

function getAnswers () {


}




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



//=========================GET LOCATION=========================//
function getLocation(){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by your browser.");
    }
}

function showPosition(position){

    alert("Successfully Obtained Location");

}

// cookies
let cookies = document.cookie;
console.log(cookies);


function getLeaderBoard() {

    fetch("https://codecyprus.org/th/api/leaderboard?session="+ uuid +"&sorted&limit=20", )
        .then(response => response.json())
        .then(json => {

                let leaderBoard = json.leaderboard;
                let limit = json.limit;
                console.log(leaderBoard);


                let tableScores = "<table>" // used to include HTML code for the table rows

                for(let i=0; i < limit; i++) {
                    tableScores += "<tr>" +
                        "<td>" + leaderBoard[i].player + "</td>" +
                        "<td>" + leaderBoard[i].completionTime + "</td>" +
                        "<td>" + leaderBoard[i].score + "</td>" +
                        "</tr>";

                    tableScores=+ "</table>";
                    document.body = document.createElement("body");
                    document.body.innerHTML = (tableScores);

                }
            }
        );
}

/*
function handleLeaderboard(leaderboard){
    let options = {
        day:'numeric', month:'short', hour:'2-digit',
    }
}

 */