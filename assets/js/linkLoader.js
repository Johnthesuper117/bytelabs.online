var rareUrl = './rick/roll.html'; 

function checkChance(intendedUrl) {
    
    var randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber === 1) { //for now it's 0% chance, but will change to 1% when ready
        location.href = rareUrl; 
    } else {
        location.href = intendedUrl; 
    }
}
