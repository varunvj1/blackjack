let blackjackGame = {
    'you': {
        'scorespan': '#your-blackjack-result',
        'div': '#your-box',
        'score': 0
    },
    'dealer': {
        'scorespan': '#dealer-blackjack-result',
        'div': '#dealer-box',
        'score': 0
    },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'type': ['S', 'D', 'C', 'H'],
    'cardValue': {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'J': 10,
        'Q': 10,
        'K': 10,
        // 'A': [1, 11],
    },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'gameStarted': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];


//*************** Import sound effects *****************/
const hitSound = new Audio('assets/sound/card-flip.mp3');
const winSound = new Audio('assets/sound/win.mp3');
const loseSound = new Audio('assets/sound/lose.mp3');



/*******************************************
 ** Add an Event listener to the HIT button 
********************************************/
document.querySelector('#blackjack-hit-btn').addEventListener('click', blackjackHit);

//Callback funstion that gets executed once HIT button is pressed
function blackjackHit() {
    blackjackGame['gameStarted'] = true;
    //We should be able to click HIT only when STAND button has not been clicked
    // if (blackjackGame['isStand'] === false) {
    let cardVal = randomCardNumber(); //1,2,3,4,5,6,7,8,9,10,J,Q,K,A
    let cardType = randomCardType(); //D, H, C, S
    let card = cardVal + cardType; // Combinations like 2D, 6S

    showCard(YOU, card);
    updateScore(YOU, cardVal);
    showScore(YOU);
    // }

}

function randomCardNumber() {
    //Get a random number between 0 and 12 (13 cards of each type)
    let randomCardIndex = Math.floor(Math.random() * 13);

    //Get the random card number from the array
    let randomCardVal = blackjackGame['cards'][randomCardIndex];

    //Return Card value + card type
    return randomCardVal;
}

function randomCardType() {
    //Get the random type
    let randomTypeIndex = Math.floor(Math.random() * 4);
    let randomCardType = blackjackGame['type'][randomTypeIndex];

    return randomCardType;
}


function showCard(activePlayer, card) {
    //Show card ONLY if current score is <= 21
    if (activePlayer['score'] <= 21) {
        //Play the sound effect
        hitSound.play();

        //Create an image element
        let cardImage = document.createElement('img');

        //Add the image src
        cardImage.src = `assets/img/${card}.png`;
        cardImage.style.width = '15%';
        cardImage.style.padding = '10px';

        //Display it on the screen
        document.querySelector(activePlayer['div']).appendChild(cardImage);
    }
}

function updateScore(activePlayer, card) {
    //Check if card is 'A'
    if (card === 'A') {
        //if score + 11 <= 21, then value of A is 11. Else value is 1
        if (activePlayer['score'] + 11 <= 21) {
            activePlayer['score'] += 11;
        }
        else {
            activePlayer['score'] += 1;
        }
    }
    else {
        activePlayer['score'] += blackjackGame['cardValue'][card];
    }

}

function showScore(activePlayer) {
    //if current score >= 21, then show BUST. ELSE show the score
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
}



/**********************************************
 **  Add an Event listener to the STAND button 
***********************************************/
document.querySelector('#blackjack-stand-btn').addEventListener('click', dealerLogic);

function dealerLogic() {
    if (blackjackGame['gameStarted'] == true) {

        //Disable the HIT button
        document.querySelector('#blackjack-hit-btn').disabled = true;

        let cardVal = randomCardNumber(); //1,2,3,4,5,6,7,8,9,10,J,Q,K,A
        let cardType = randomCardType(); //D, H, C, S
        let card = cardVal + cardType; // Combinations like 2D, 6S

        showCard(DEALER, card);
        updateScore(DEALER, cardVal);
        showScore(DEALER);

        if (DEALER['score'] > 15) {
            //Disable HIT button 
            blackjackGame['turnsOver'] = true;

            setTimeout(showWinner(computeWinner()), 1000);
        }
        else {
            setTimeout(dealerLogic, 1000);

        }
    }
}



/*********************************************
 **  Add an Event listener to the DEAL button 
**********************************************/
document.querySelector('#blackjack-deal-btn').addEventListener('click', blackjackDeal);

//Callback funstion that gets executed once DEAL button is pressed
function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        //Select all images of both the boxes
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        //'yourImages' and 'dealerImages' returns an ARRAY of all the img elements
        //So, we will use a for loop and remove all img elements
        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        //Reset the score to 0
        YOU['score'] = 0;
        DEALER['score'] = 0;

        //Reset the score and style on DISPLAY
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

        //Reset the result display above and its color
        document.querySelector('#blackjack-result').textContent = "Let's Play!";
        document.querySelector('#blackjack-result').style.color = 'white';

        //Reset buttons
        document.querySelector('#blackjack-hit-btn').disabled = false;
        blackjackGame['gameStarted'] === false;
        blackjackGame['turnsOver'] === false;
    }
}


function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        //If you get a higher score OR the dealer busts
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = YOU;

            //Update the score table
            blackjackGame['wins']++;
        }

        //if you get a score lower than the dealer
        else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;

            //Update the score table
            blackjackGame['losses']++;
        }

        //Both get the same score
        else if (YOU['score'] === DEALER['score']) {
            winner = 0;

            //Update the score table
            blackjackGame['draws']++;
        }
    }

    //if your score is more than 21 and dealer's score is less than 21
    else if (You['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
    }

    //Both score above 21 and BUST
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        winner = "It is a Draw!";
    }

    return winner;
}

function showWinner(winner) {
    //Compute winner
    let message, messageColor;

    if (winner === YOU) {
        message = "You Won!";
        messageColor = "green";
        winSound.play();

        //Show the score in the table
        document.querySelector('#wins').textContent = blackjackGame['wins'];
    }
    else if (winner === DEALER) {
        message = "You Lost!";
        messageColor = "red";
        loseSound.play();

        //Show the score in the table
        document.querySelector('#losses').textContent = blackjackGame['losses'];
    }
    else {
        message = "It's a Draw!";
        messageColor = "#fff";

        //Show the score in the table
        document.querySelector('#draws').textContent = blackjackGame['draws'];
    }

    //Display the result
    let resultDisplayElem = document.querySelector('#blackjack-result');
    resultDisplayElem.textContent = message;
    resultDisplayElem.style.color = messageColor;
}