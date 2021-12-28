let data = {
    'you':{'scoreSpan': '#your-black','div': '#your-box','score': 0},
    'dealer':{'scoreSpan': '#dealer-black','div': '#dealer-box','score': 0},
    'cards':['2', '3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap':{'2':2, '3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = data['you']
const DEALER = data['dealer']

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click',start);
document.querySelector('#stand').addEventListener('click',dealerLogic);
document.querySelector('#deal').addEventListener('click',deal);

function start() {
    if(data['isStand'] === false){
        let card = randomCard();
        showCard(card,YOU);
        updateScore(card,YOU);
        showSore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random()*13)
    return data['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if (activePlayer['score']<=21) {
    let cardImge = document.createElement('img');
    cardImge.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImge);
    hitSound.play();
    }
}

function deal(){
    if(data['turnsOver'] === true) {
        data['isStand'] = false;
        let yourImages =document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages =document.querySelector('#dealer-box').querySelectorAll('img');

        for (i=0; i<yourImages.length;i++){
            yourImages[i].remove();
        }

        for (i=0; i<dealerImages.length;i++){
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-black').textContent = 0;
        document.querySelector('#your-black').style.color = 'white';

        document.querySelector('#dealer-black').textContent = 0;
        document.querySelector('#dealer-black').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = `Let's play`;
        document.querySelector('#blackjack-result').style.color = 'black';
        data['turnsOver'] = true;
    }
}
function updateScore(card,activePlayer) {
    if(card === 'A') {
    //if adding 11 keeps me below 21,add 11 ,otherwise add 1
    if (activePlayer['score'] + data['cardsMap'][card][1] <= 21) {
        activePlayer['score'] += data['cardsMap'][card][1];
    }
    else {
        activePlayer['score'] += data['cardsMap'][card][0];
    }
      }
    else {
        activePlayer['score'] += data['cardsMap'][card];
    }
    
}

function showSore(activePlayer) {
    if(activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    data['isStand'] = true;

    while (DEALER['score'] < 16 && data['isStand'] === true) {
        let card = randomCard();
        showCard(card,DEALER);
        updateScore(card, DEALER);
        showSore(DEALER);
        await sleep(1000);
    }

         data['turnsOver'] = true;
         let winner = findWinner();
         showResult(winner);

}

function findWinner() {
    let winner;
    if(YOU['score'] <= 21) {

        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            console.log('you won!');
            data['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            console.log('you lost!');
            data['losses']++;
            winner = DEALER;
        }
        else if(YOU['score'] === DEALER['score']) {
            console.log('drew!');
            data['draws']++;
        }

    } else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
            console.log('you lost');
            data['losses']++;
            winner = DEALER;

    } else if(YOU['score'] > 21 && DEALER['score'] > 21) {
            console.log('you drew!');
            data['draws']++;
    }

    console.log(data);
    return winner;
}

function showResult(winner) {
    let message, messageColor;
    if(data['turnsOver'] === true) {
        if(winner === YOU) {
            document.querySelector('#wins').textContent = data['wins'];
            message = 'you won!';
            messageColor = 'green';
            winSound.play();

        } else if(winner === DEALER) {
            document.querySelector('#losses').textContent = data['losses'];
            message = 'you lost!';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = data['draws'];
            message = 'you drew';
            messageColor = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}