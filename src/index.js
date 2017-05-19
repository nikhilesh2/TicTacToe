import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

    return (
      <button className="square" onClick={props.onClick} style={{background: props.theColor}}>
       {props.value}
      </button>
    );
}

class Board extends React.Component {
	
  renderSquare(i) {
    return (
    	<Square value={this.props.squares[i]} theColor={this.props.colors[i]}
    				onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
  
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor() {
		super();
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				colors: Array(9).fill('white'),
			}],
			stepNumber: 0,
			xIsNext: true,
		}
	}

	handleClick(i) {
    	const history = this.state.history.slice(0, this.state.stepNumber + 1);
    	const current = history[history.length - 1];
    	const squares = current.squares.slice();
    	const colors = current.colors.slice();
    	
    	if (calculateWinner(squares) || squares[i]) {
      		return;
    	}
    	squares[i] = this.state.xIsNext ? 'X' : 'O';
    	
    	this.setState({
      		history: history.concat([{
        	squares: squares,
        	colors: colors
      	}]),
      	stepNumber: history.length,
      	xIsNext: !this.state.xIsNext,
    	});
  	}

  	handleReset() {
  		//Reset State
  		this.state = {
			history: [{
				squares: Array(9).fill(null),
				colors: Array(9).fill('white'),
			}],
			stepNumber: 0,
			xIsNext: true,
		}
		//Jump to initial step
		this.jumpTo(0);
  	}

  	jumpTo(step) {
  		this.setState({
  			stepNumber: step,
  			xIsNext: (step % 2) ? false : true,
  		});
  	}

  	handleColor(finalState, winner){
  		const colors = finalState.colors.slice();
  		const theColor = (this.state.xIsNext ? 'blue' : 'red'); //Determine color based on winner  X->Red  O->Blue
  		
  		colors[winner[0]] = theColor;
  		colors[winner[1]] = theColor;
  		colors[winner[2]] = theColor;
		
		return colors;
  	}
  	
  render() {
  	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares); //try to recieve winning squares

    const moves = history.map((step, move) => {
    const desc = move ?
        'Move #' + move :
        'Game start';
    return (
        <li key={move}>
          <a href="#" 
          	onClick={() => this.jumpTo(move)}>
          	{desc}
          </a>
        </li>
      );
    });

    let status;
    //Check if there is a winner
    if (winner) {
	  current.colors = this.handleColor(current, winner); //Set winning squares to appropriate color
      status = 'Winner: ' + current.squares[winner[0]];
    } 
    //Check if game is a tie
    else if(this.state.stepNumber === 9){ 
    	status = 'Tie';
    	current.colors = Array(9).fill('gray'); 
    } 
    //Continue the game
    else{
      	status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}
    
  

    return (
      <div className="game">
        <div className="game-board">
          <Board  squares={current.squares}	colors={current.colors}
				  onClick={(i) => this.handleClick(i)}/>
		<a href="#" 
				onClick={() => this.handleReset()}>
				Reset
		</a>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    	return lines[i]; //Return winning squares
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
