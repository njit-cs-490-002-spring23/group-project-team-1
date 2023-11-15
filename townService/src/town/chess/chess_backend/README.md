Andrew Dickman -- Chess Logic / Functionality Documentation

# Initialization
```import ChessGame from 'chess_app'```

```const game = new ChessGame(white_id, black_id)```

A third parameter, time_limit, is optional, and defaults to 999999 if not entered.

# Chess Class Attributes

## .gameID
Games ID.

## .winner
Player ID of player who won the game.

## .white_id
Player ID of player who is white.

## .black_id
Player ID of player who is black.

## .timer
Timer value.

# Outline of Chess functions

## .make_move(moveToMake: string, color: Colors) --> string:
This function takes in the move you're making, as well as the color of the player making the move.
The move must be in correct Chess Algebraic Notation, for example (Nc3+) means you're moving your knight to c3 and putting the king in check.
This function will return a FEN string of the new board layout.
NOTE: You must input a valid move for this to work.

```game.make_move('e4', Colors.White); // make move```


## .getFen() --> string:
Returns the current boards FEN string.


## .getMoves() --> string[]:
Returns an array of strings of all of the current possible moves for the players who's turn it is.


## .getPieceOnSquare(square: string) --> { Type: string, Color: string }:
Takes the square as a string (must be a valid board square, meaning one between a1-h8), and returns a string dictionary containing the Type (Piece Type), and the Color('w' or 'b').


## .matchMoves(moveToMake: string) --> string:
Takes in a move you want to make, and returns a move from the list of possible moves (.getMoves()), that correspondes closest to it. If no move corresponds to it, will return 'None'.


## .getTurn() --> string:
Returns the color of the current players turn.


## .getReasonForGameEnd() --> string:
Function to give direct reason for game ending. Can be called after every move to check if game is still ongoing.
'Not Over' if game is still in progress
'Checkmate - ['w'/'b']' if theres a checkmate
'Insufficient Material' if there's insufficient material
'Three Fold Repetition' for Three Fold Repetition
'Draw' for draw state


## .loadFen(fen: string) --> boolean:
Function to load the board to any state based on the passed FEN String parameter.
Returns true if successful, and false otherwise.


## .getHistory() --> { move (string): FEN String (string) }
Returns the current history of the game, starting from move one, with each move and the corresponding board state to it.


## .checkIfCheckmate() --> boolean:
Returns true if there is a checkmate, and false otherwise.
If there is a checkmate, this function will initialize the attribute .winner as the winner's playerID.





# Stockfish Initalization

## .env File
To begin, create a .env file located in the same directory as the stockfish.ts.
In this .env file, put 

```PATH_TO_STOCKFISH="path/to/stockfish/.exe"```

Note the path must have FORWARD SLASHES.
If you do not have Stockfish installed locally, you must download it and find a path to the .exe file within it for this to work.

## Initalize Stockfish in the Code
```import CallStockfish from 'stockfish.ts'```

```const stockfish = new CallStockfish(ELO_RATING)```

MIN ELO = 300, MAX ELO = 3000.

# Outline of Stockfish functions

.callStockfish and .getBestMovesList are async functions, you must use the await keyword with them in order to accurately get the results.

## await .callStockfish(fen: string) --> void
This function takes a FEN string, and calls stockfish in order to get the best move from this position. 
The return value is void, instead a private class object will be set with the move.
In succession to this call, you must call:
## .getMove() --> string
This function will return the previously generated move from stockfish from the .callStockfish() call.

NOTE: This best move will be calculated based on the elo stockfish was given. If using for best moves, give the elo 3000 on initialization.
If using as an AI opponent, give any elo and use the move stock gives to move for it.


## await .getBestMovesList(fen: string) --> void
Just like the previous function, this function takes a FEN string, and uses stockfish to generate a list of the top 10 moves from this position.
This function has no return value, instead you have to call:
## .getMoveList() --> string[]
This function will return the generate list of moves from the previous .getBestMovesList() call.


# stockfishAPI.py
## Ignore this file.
Do not touch it.