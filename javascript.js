//import start API

let playerName = document.getElementById("playerName");


console.log(playerName);




function getChallenges() {
    fetch("https://codecyprus.org/th/api/start?player=" + playerName + "&app=simpsons-app&treasure-hunt-id=ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw")
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
        })
}

console.log(getChallenges);