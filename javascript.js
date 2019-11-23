// Get Challenges
function getChallenges () {
    fetch("https://codecyprus.org/th/api/list?")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);


            let playerName = "AndreasGeorgiou";
            let appName = "TheConquerorsApp";
            let challengesList = document.getElementById("challenges");
            let treasureHuntsArray = jsonObject.treasureHunts;

            for (let i = 0; i < treasureHuntsArray.length; i++) {
                let listItem = document.createElement("li");
                let uuid = treasureHuntsArray[i].uuid;
                listItem.innerHTML = "<a href='https://codecyprus.org/th/api/start?player=" + playerName + "&app=" + appName + "&treasure-hunt-id=" + uuid + "'>" + treasureHuntsArray[i].name + "</a>";
                challengesList.appendChild(listItem);

            }
        });
}

function getQuestions() {
    fetch("https://codecyprus.org/th/api/question?session=ag9nfmNvZGVjeXBydXNvcmdyFAsSB1Nlc3Npb24YgICAoMa0gQoM")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);

        });
}
