const API_LIST = "https://codecyprus.org/th/api/list";
const API_START = "https://codecyprus.org/th/api/start";
const API_QUESTIONS = "https://codecyprus.org/th/api/question";

let sessionID = "";
let uuid="";
let playerName="";
let appName = "";


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
                uuid = treasureHuntsArray[i].uuid;

                // Create a button for each TH challenge
                let treasureHuntsBtn = document.createElement('input');
                treasureHuntsBtn.type = "button";
                treasureHuntsBtn.value = treasureHuntsArray[i].name;
                treasureHuntsBtn.name = "THList";
                treasureHuntsBtn.id = "treasureHuntsBtn";

//===============================CALL GET CREDENTIALS ON CLICK===================================//
                treasureHuntsBtn.addEventListener("click", getCredentials);

                challengesList.appendChild(treasureHuntsBtn);
            }
        });
}

function getCredentials() {
    let userForm = document.getElementById("usernameBox");
    userForm.style.display = "block";

    // Get required parameters
    const params = new URLSearchParams(location.search);
    playerName = params.get("player");
    appName = "TheConquerors";
    let submitBtn = document.getElementById("submitBtn");

    //PROBLEM!!!!!!
    submitBtn.addEventListener("click", startSession);


}


function startSession() {
    fetch(API_START + "?" +  playerName + "&app=" + appName + "&treasure-hunt-id=" + uuid)
            .then(response => response.json()) //Parse JSON text to JavaScript object
            .then(jsonObject => {

                console.log(jsonObject);

            });
}




/*
function getQuestions() {
    fetch(API_QUESTIONS + "?session=" + sessionID)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {

        });
}

*/



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


/*

function getLeaderBoard(url) {
// create and invoke the http request
    fetch("https://codecyprus.org/th/api/leaderboard?session="+ uuid, { method: "GET" })
        .then(response => response.json())
        .then(json => {

            let leaderBoard = json.leaderboard;
            console.log(leaderBoard);





            }
            );
}

*/

/*
//Leaderboard

const TH_API_URL = "https://codecyprus.org/th/api/";
// session of questions
let session  = "ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM";
let url = TH_API_URL + "leaderboard?sorted&session=" + session;
getLeaderBoard(url);


function handleLeaderboard(leaderboard) {
    let html = ""; // used to include HTML code for the table rows
    let leaderboardArray = leaderboard['leaderboard'];
    for(const entry of leaderboardArray) {
        html += "<tr>" +
            "<td>" + entry['player'] + "</td>" +
            "<td>" + entry['score'] + "</td>" +
            "<td>" + entry['completionTime'] + "</td>" +
            "</tr>";
    }
    let leaderboardElement = document.getElementById('test-results-table'); // table
    leaderboardElement.innerHTML += html; // append generated HTML to existing
}
*/
