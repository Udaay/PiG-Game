var UiController = (function () {
  let DomSelector = {
    name: ['#name-0', '#name-1'],
    score: ['#score-0', '#score-1'],
    current: ['#current-0', '#current-1'],
    panel: ['.player-0-panel','.player-1-panel'],
    dice: ['.dice1','.dice2'],
    newgame: '.btn-new',
    roll: '.btn-roll',
    hold: '.btn-hold',
  }
  
  function setToZero(ele){
    document.querySelector(ele).innerHTML = '0';
  }

  function toggleDice({style,imgSrc}) {
    DomSelector.dice.map((ele)=>{
      style && (document.querySelector(ele).style.display = style);
      // imgSrc && (document.querySelector(ele).src = imgSrc);
    })
  }
  
  return {
    getSelector: function () {
      return DomSelector;
    },

    resetGame: function(fullReset = true, activePlayer) {
      if(fullReset){
        DomSelector.score.map(setToZero);
        toggleDice({style:'none'});
        DomSelector.current.map(setToZero);
      }
      else{
        document.querySelector(DomSelector.current[activePlayer]).innerHTML = '0';
      }
    },

    setDice: function({dice1, dice2}){
      toggleDice({style:'block'});
      document.querySelector(DomSelector.dice[0]).src = `dice-${dice1}.png`;
      document.querySelector(DomSelector.dice[1]).src = `dice-${dice2}.png`;
    },

    updateScore: function(data,activePlayer){
      let { totalScore, currentScore } = data;
      document.querySelector(DomSelector.current[activePlayer]).innerHTML = currentScore[activePlayer];
      document.querySelector(DomSelector.score[activePlayer]).innerHTML = totalScore[activePlayer];
    },

    switchPlayer: function(activePlayer,data) {
      DomSelector.panel.map(ele => document.querySelector(ele).classList.toggle('active'));
      data.preivousRoll1[activePlayer] = 0;
      data.preivousRoll2[activePlayer] = 0;
      activePlayer ? activePlayer = 0 : activePlayer = 1;
      toggleDice({style:'none'});
      return activePlayer;
    },
    
  }
})();

var PigGame = (function () {
  let dice1, dice2;
  let data = {
    totalScore: [0,0],
    currentScore: [0,0],
    preivousRoll1:[0,0],
    preivousRoll2:[0,0],
    twice6: false,
  };
  let { totalScore, currentScore, preivousRoll1, preivousRoll2 } = data;
  return {
    generateNumber: function(){
     dice1 = Math.floor(Math.random() * 6 )+ 1;
     dice2 = Math.floor(Math.random() * 6 )+ 1;
     return {dice1, dice2};
    },

    getData:  () => {
      return data;
    },

    addingScore: function(number,previousScore,activePlayer) {
      let {dice1, dice2} = number;
      let num = dice1 + dice2;
      console.log(typeof number);
      if((preivousRoll1[activePlayer] === 6 && dice1 ===6) || (preivousRoll2[activePlayer] === 6 && dice2 ===6)){
        totalScore[activePlayer] = 0;
        currentScore[activePlayer] = 0;
        data.twice6 = true;
      }
      else if(dice1 == 1 || dice2 == 1){
        currentScore[activePlayer] = 0;
        totalScore[activePlayer] = previousScore + currentScore[activePlayer];
      }
      else{
        currentScore[activePlayer] = currentScore[activePlayer] + num;
      }
      preivousRoll1[activePlayer] = dice1;
      preivousRoll2[activePlayer] = dice2;
      return data;
    },

    checkWinner(activePlayer) {
      (totalScore[activePlayer] >= 50) && alert(`Player-${activePlayer} is Winner`);
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
    UiCtrl.setDice(num);
    let previousScore = parseInt(document.querySelector(score[activePlayer]).innerHTML);
    const data = game.addingScore(num,previousScore,activePlayer);
    console.log(data);
    UiCtrl.updateScore(data,activePlayer);
    let { currentScore } = data;
    game.checkWinner(activePlayer);
    console.log(num.dice1, num.dice2, currentScore[activePlayer]);
    if ( num.dice1 ===1 || data.twice6 || num.dice2 === 1){
      UiCtrl.resetGame(false,activePlayer);
      setTimeout(()=>{
        activePlayer = UiCtrl.switchPlayer(activePlayer,data);
      },1200);
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

