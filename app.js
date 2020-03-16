var UiController = (function () {
  let DomSelector = {
    name: ['#name-0', '#name-1'],
    score: ['#score-0', '#score-1'],
    current: ['#current-0', '#current-1'],
    panel: ['.player-0-panel','.player-1-panel'],
    dice: '.dice',
    newgame: '.btn-new',
    roll: '.btn-roll',
    hold: '.btn-hold',
  }
  
  function setToZero(ele){
    document.querySelector(ele).innerHTML = '0';
  }
  
  return {
    getSelector: function () {
      return DomSelector;
    },

    resetGame: function(fullReset = true, activePlayer) {
      if(fullReset){
        DomSelector.score.map(setToZero);
        document.querySelector(DomSelector.dice).style.display = 'none';
        DomSelector.current.map(setToZero);
      }
      else{
        document.querySelector(DomSelector.current[activePlayer]).innerHTML = '0';
      }
    },

    setDice: function(number){
      console.log('Setting dice');
      document.querySelector(DomSelector.dice).style.display = 'block';
      document.querySelector(DomSelector.dice).src = `dice-${number}.png`
    },

    updateScore: function(data,activePlayer){
      let { totalScore, currentScore } = data;
      document.querySelector(DomSelector.current[activePlayer]).innerHTML = currentScore[activePlayer];
      document.querySelector(DomSelector.score[activePlayer]).innerHTML = totalScore[activePlayer];
    },

    switchPlayer: function(activePlayer,data) {
      DomSelector.panel.map(ele => document.querySelector(ele).classList.toggle('active'));
      data.preivousRoll[activePlayer] = 0;
      activePlayer ? activePlayer = 0 : activePlayer = 1;
      document.querySelector(DomSelector.dice).style.display = 'none';
      return activePlayer;
    },
    
  }
})();

var PigGame = (function () {
  let dice;
  let data = {
    totalScore: [0,0],
    currentScore: [0,0],
    preivousRoll:[0,0],
    twice6: false,
  };
  let { totalScore, currentScore, preivousRoll } = data;
  return {
    generateNumber: function(){
     dice = Math.floor(Math.random() * 3 )+ 4;
     return dice;
    },

    getData:  () => {
      return data;
    },

    addingScore: function(num,previousScore,activePlayer) {

      if(preivousRoll[activePlayer] === 6 && num ===6){
        totalScore[activePlayer] = 0;
        currentScore[activePlayer] = 0;
        data.twice6 = true;
      }
      else if(num != 1){
        currentScore[activePlayer] = currentScore[activePlayer] + num;
      }
      else{
        currentScore[activePlayer] = 0;
        totalScore[activePlayer] = previousScore + currentScore[activePlayer];
      }
      preivousRoll[activePlayer] = num;
      return data;
    },

    checkWinner(activePlayer) {
      (totalScore[activePlayer] >= 20) && alert(`Player-${activePlayer} is Winner`) 
    }
  }

})();

var Controller = (function (game, UiCtrl) {
  
  let num, activePlayer = 0;
  const selector = UiCtrl.getSelector();
  const { roll, score, hold } = selector;
  
  UiCtrl.resetGame();

  document.querySelector(roll).addEventListener('click',function(){
    num = game.generateNumber();
    console.log(num);
    UiCtrl.setDice(num);
    let previousScore = parseInt(document.querySelector(score[activePlayer]).innerHTML);
    const data = game.addingScore(num,previousScore,activePlayer);
    UiCtrl.updateScore(data,activePlayer);
    game.checkWinner(activePlayer);

    if ( num ===1 || data.twice6 ){
      activePlayer = UiCtrl.switchPlayer(activePlayer,data);
      data.twice6 = false;
    }
  });

  document.querySelector(hold).addEventListener('click', function(){
    const data = game.getData();
    let { totalScore, currentScore } = data;
    let previousScore = parseInt(document.querySelector(score[activePlayer]).innerHTML);
    totalScore[activePlayer] = previousScore + currentScore[activePlayer];
    UiCtrl.updateScore(data,activePlayer);
    UiCtrl.resetGame(false,activePlayer);
    currentScore[activePlayer] = 0;
    game.checkWinner(activePlayer);
    activePlayer = UiCtrl.switchPlayer(activePlayer,data);
  })

})(PigGame, UiController);

