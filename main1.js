'use strict';
const playerSymbol = (nickname, choice) => {
  const getNickname = () => nickname;
  const getChoice = () => choice;
  return { getNickname, getChoice };
};


(() => {
  const gameMode = document.querySelector('.modal.game-mode');
  const nickNames = document.querySelector('.modal.nicknames');
  const gameOver = document.querySelector('.modal.game-over');
  const game = document.querySelector('.game');

   
  

  function _switchParentWrapper(from, to) {
    from.parentElement.style.display = 'none';
    to.parentElement.style.display = '';
  }

  function _startNewGame() {
    // create 2 players
    const [firstPlayer, secondPlayer] = (() => {
      // create nicknames for players
      const [firstNickname, secondNickname] = (() => {
        return (function _getNickNames() {
          function _validate(first, second) {
            if (first == '') {
              first = 'Player 1';
            }
            if (second == '') {
              second = 'Player 2';
            }
            
            return [first, second];
          }
          const first = document.getElementById('first-player-nickname').value;
          const second = document.getElementById('second-player-nickname').value;
          return [..._validate(first, second)];
        })();
      })();

      return (function _getPlayers() {
        let firstPl = playerSymbol(firstNickname, 'X');
        let secondPl = playerSymbol(secondNickname, 'O');
        
        return [firstPl, secondPl];
      })();
    })();

    _switchParentWrapper(nickNames, game);
    const gameBoard = ((firstPlayer, secondPlayer) => {
      let board = ['', '', '', '', '', '', '', '', ''];
      let winner = null;

      const firstPlCh = firstPlayer.getChoice();
      const secondPlCh = secondPlayer.getChoice();

      let currentPlCh = null;

      function ChangeTurn() {
        if (currentPlCh == firstPlCh) {
          currentPlCh = secondPlCh;
        } else {
          currentPlCh = firstPlCh;
        }
      }

     

      function GetAvailableMoves(game) {
         var possibleMoves = new Array();

         for (var i = 0; i < BOARD_SIZE; i++)
         {
             if (game[i] === UNOCCUPIED)
                 possibleMoves.push(i);
         }
         return possibleMoves;
      }
      
      
      
      function hasWinner() {
        if (winner) {
          return true;
        }
        return false;
      }

      function getWinnerName() {
        return winner;
      }

      function _checkForWinner(bd) {
        function _findW(condition) {
          function _getVal(i1, i2, i3) {
            return bd[i1] + bd[i2] + bd[i3];
          }
          function _win(val) {
            return val == condition;
          }

          if (
            _win(_getVal(0, 1, 2)) ||
            _win(_getVal(3, 4, 5)) ||
            _win(_getVal(6, 7, 8)) ||
            _win(_getVal(0, 3, 6)) ||
            _win(_getVal(1, 4, 7)) ||
            _win(_getVal(2, 5, 8)) ||
            _win(_getVal(0, 4, 8)) ||
            _win(_getVal(6, 4, 2))
          ) {
            return true;
          }
        }
        const fc = 'XXX';
        const sc = 'OOO';

        if (_findW(fc)) {
          return firstPlayer.getNickname();
        } else if (_findW(sc)) {
          return secondPlayer.getNickname();
        } else if (!bd.includes('')) {
          return 'draw';
        }
        return null;
      }

      function getCurrentPlayerCh() {
        ChangeTurn();
        return currentPlCh;
      }

      function getNameOfPlayer(player) {
        if (player == 'first') {
          return firstPlayer.getNickname();
        }
        if (player == 'second') {
          return secondPlayer.getNickname();
        }
      }

      function getValueOf(index) {
        return board[index];
      }

      function setValueOf(index) {
        board[index] = currentPlCh;
        winner = _checkForWinner(board);
      }
      return {
        getValueOf,
        setValueOf,
        getCurrentPlayerCh,
        getNameOfPlayer,
        hasWinner,
        getWinnerName,
       
      };
    })(firstPlayer, secondPlayer);

    const displayController = ((gb) => {
      const board = document.querySelector('.game-board');

      function _currentBoardHandler(e) {
        if (e.target.classList.contains('content-element')) {
          _setPlayerChoice(e.target);
        }
      }

       function _endGame(w) {
          const over = document.querySelector('.modal.game-over');
          _switchParentWrapper(game, over);
          const winDisplay = over.querySelector('.gg');
          if (w == 'draw') {
            winDisplay.textContent = `The Game is a ${w}`;
          } else {
            winDisplay.textContent = `${w} wins The Game!`;
          }
        }

      function _setPlayerChoice(element) {
       
        
        

        function _playGame(s) {
          
          const curCh = gb.getCurrentPlayerCh();
          s.textContent = curCh;
          _setChColor(s, curCh);
          _switchColorPanel(curCh);
          gb.setValueOf(element.dataset.id);
          
         
        }

        function _setChColor(span, ch) {
          if (ch == 'X') {
            span.style = 'color: rgb(60, 253, 76);';
          } else {
            span.style = 'color: rgb(192, 97, 247);';
          }
        }
        function _switchColorPanel(ch) {
          const fpl = document.querySelector('div.player-info.first-pl');
          const spl = document.querySelector('div.player-info.second-pl');
          if (ch == 'X') {
            spl.style = 'background: #23042C   ;';
            fpl.style = '';
          } else {
            fpl.style = 'background: #23042C   ;';
            spl.style = '';
          }
        }
        const span = element.querySelector('span');
        if (span.textContent == '') {
          _playGame(span);

          if (gb.hasWinner()) {
            _endGame(gb.getWinnerName());
          }
        }
      }

      function _renderNickNames() {
        const fName = document.querySelector(
          '.player-info.first-pl .nick-name'
        );
        const sName = document.querySelector(
          '.player-info.second-pl .nick-name'
        );
        fName.textContent = gb.getNameOfPlayer('first');
        sName.textContent = gb.getNameOfPlayer('second');
      }

      function _renderBoard() {
        board.querySelectorAll('.content-element').forEach((elm, i) => {
          elm.querySelector('span').textContent = gb.getValueOf(i);
        });
      }

      function _setClearGameHandler() {
        function _clearHandler(e) {
          board.removeEventListener('click', _currentBoardHandler);
          e.target.removeEventListener('click', _clearHandler);
        }

        document.querySelectorAll('.new-game').forEach((newGameBtn) => {
          newGameBtn.addEventListener('click', _clearHandler);
        });
        document.querySelectorAll('.reset-game').forEach((resetGameBtn) => {
          resetGameBtn.addEventListener('click', _clearHandler);
        });
      }

      function _createNewHandler() {
        _setClearGameHandler();
        board.addEventListener('click', _currentBoardHandler);
      }
      function _setDefaultColorPanel() {
        document.querySelector('div.player-info.first-pl').style =
          'background: #23042C ;';
        document.querySelector('div.player-info.second-pl').style = '';
      }



      function renderNewGame() {
        _createNewHandler();
        _renderNickNames();
        _renderBoard();
        _setDefaultColorPanel();
      }
      return { renderNewGame };
    })(gameBoard);

    displayController.renderNewGame();
  }

  gameMode.querySelector('.pvp-mode').addEventListener('click', () => {
    
   
    _switchParentWrapper(gameMode, nickNames);
  });
  
 
  nickNames.querySelector('.back').addEventListener('click', () => {
    _switchParentWrapper(nickNames, gameMode);
  });
  nickNames.querySelector('.next').addEventListener('click', _startNewGame);
  // reset current game
  document.querySelectorAll('.new-game').forEach((newGameBtn) => {
    newGameBtn.addEventListener('click', () => {
      _startNewGame();
      _switchParentWrapper(gameOver, game);
    });
  });
  // reset the game
  document.querySelectorAll('.reset-game').forEach((resetGameBtn) => {
    resetGameBtn.addEventListener('click', () => {
      _switchParentWrapper(gameOver, game);
      _switchParentWrapper(game, gameMode);
    });
  });
})();