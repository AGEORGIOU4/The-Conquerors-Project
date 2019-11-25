// Get Challenges
function getChallenges() {
    fetch("https://codecyprus.org/th/api/list?")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);

            // Get TH array
            let treasureHuntsArray = jsonObject.treasureHunts;
            // Get challenges list
            const challengesList = document.getElementById("challenges");

            for (let i = 0; i < treasureHuntsArray.length; i++) {
                let listItem = document.createElement("li");

                let uuid = treasureHuntsArray[i].uuid;
                let status = jsonObject.status;

                // Get credentials
                const params = new URLSearchParams(location.search);

                let playerName = params.get("player");
                let appName = params.get("app");

                listItem.innerHTML = "<a href='https://codecyprus.org/th/api/start?player=" + playerName + "&app=" + appName + "&treasure-hunt-id=" + uuid + "'>" + treasureHuntsArray[i].name + "</a>";
                challengesList.appendChild(listItem);

                let message =  document.getElementById("successMessage");
                let nameBox =  document.getElementById("name");
                let appNameBox =  document.getElementById("appName");

                /*if (status === "OK") {
                    message.style.display = "block";
                    nameBox.style.display = "none";
                    appNameBox.style.display = "none";
                }*/
            }
        });
}

function getQuestions() {
    fetch("https://codecyprus.org/th/api/question")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);

            // Get TH array
            let treasureHuntsArray = jsonObject.treasureHunts;
            let uuid = treasureHuntsArray[i].uuid;
        });
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
