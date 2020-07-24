
var board = [0,1,2,3,4,5,6,7,8];
var level = -1;
var human = "X";
var ai = "O";
var finished = false;
var clicked = [];
var w1,w2,w3;

function availablePositions(newboard) {
    return newboard.filter(function (elem) {return elem!="X" && elem!="O";})
}

function winUtil(newboard, player, x, y, z) {
    if (newboard[x]==player && newboard[y]==player && newboard[z]==player) {
        w1 = x, w2 = y, w3 = z;
        return true;
    }
    return false;
}
function winCondition(newboard, player) {
    return(winUtil(newboard,player,0,1,2) ||
        winUtil(newboard,player,3,4,5) ||
        winUtil(newboard,player,6,7,8) ||
        winUtil(newboard,player,0,3,6) ||
        winUtil(newboard,player,1,4,7) ||
        winUtil(newboard,player,2,5,8) ||
        winUtil(newboard,player,0,4,8) ||
        winUtil(newboard,player,2,4,6))
}

function minimax(newboard,player) {
    var nextBoard = availablePositions(newboard);
    
    var finalMove = {};

    if(winCondition(newboard,human)) {return {score : -10};}
    else if(winCondition(newboard,ai)){return {score : 10};}
    else if(nextBoard.length==0){return {score: 0}}


    if(player == "X")
    {
        var bestScore = +1000;
        var bestIndex = -1;
        for(var i=0;i<nextBoard.length;i++)
        {
            newboard[nextBoard[i]] = "X";
            var res = minimax(newboard,"O");
            if(res.score < bestScore){
              
                bestScore = res.score;
                bestIndex = nextBoard[i];
            }
            newboard[nextBoard[i]] = nextBoard[i];
          
        }
        finalMove.index = bestIndex;
        finalMove.score = bestScore;
    }
    else
    {
        var bestScore = -1000;
        var bestIndex = -1;
        for(var i=0;i<nextBoard.length;i++)
        {
            newboard[nextBoard[i]] = "O";
            var res = minimax(newboard,"X");
            if(res.score > bestScore){
                
                bestScore = res.score;
                bestIndex = nextBoard[i];
            }
            newboard[nextBoard[i]] = nextBoard[i];
        }
        finalMove.index = bestIndex;
        finalMove.score = bestScore;
    }
    return finalMove;
}

function makeLine(x,y,z) {
    document.getElementById("sq"+x).style.color = "red";
    document.getElementById("sq"+y).style.color = "red";
    document.getElementById("sq"+z).style.color = "red";
}

function makeMove(elem) {
    if(finished) return ;
    if(clicked.indexOf(elem.id) > -1) return ;
    clicked.push(elem.id);
    var eleID = elem.id;
    var position = parseInt(eleID[2]);
    board[position] = "X";
    elem.innerHTML+="X";

    if(winCondition(board,human)) {
        console.log("Okay! You are Smarter");
        finished =true;
        makeLine(w1,w2,w3);
        document.getElementById("footer").innerHTML+="Okay! You are Smarter";
        document.getElementById("refresh").style.visibility = "visible";
        return ;
    }
    var nextBoard = availablePositions(board);
    if(nextBoard.length==0) {
        console.log("You are as Smart as Me.");
        finished =true;
        document.getElementById("footer").innerHTML+="You are as Smart as Me.";
        document.getElementById("refresh").style.visibility = "visible";
        return ;
    }
    var aiPos = {};
    if(level == 1)
    {
        var chance = Math.floor(Math.random() * (9));
        if(chance <= 2) {
            aiPos.index = nextBoard[Math.floor(Math.random() * nextBoard.length)];
            console.log("Random aiPos = " + aiPos.index);
        }
        else
            aiPos = minimax(board, "O");
    }
    else
        aiPos = minimax(board, "O");
    
    board[aiPos.index] = "O";
    document.getElementById("sq"+aiPos.index).innerHTML+="O";
    if(winCondition(board,ai)) {
        console.log("See, You can't beat me");
        finished =true;
        makeLine(w1,w2,w3);
        document.getElementById("footer").innerHTML+="See, You can't beat me";
        document.getElementById("refresh").style.visibility = "visible";
        
    }
}