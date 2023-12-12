from flask import Flask, request, jsonify
from flask_cors import CORS
from stockfish import Stockfish
import os #For finding .env
from dotenv import load_dotenv,find_dotenv 

'''
    *To make this work locally:
    *Donwload Stockfish on your local machine
    *Find the .exe file (stockfish-windows-x86-64-avx2.exe)
    *Create a .env file with a variable named PATH_TO_STOCKFISH
    *Set it equal to "PATH/TO/STOCKFISH/STOCKFISH.exe" <-- MAKE SURE YOUR SLASHES ARE FORWARD SLASHES. BACKWARD SLASHES WILL NOT WORK.
'''
load_dotenv(find_dotenv()) #Find .env file in directory
STOCKFISH_PATH= os.getenv('PATH_TO_STOCKFISH') #Grab the variable from .env file called 'discordkey' (API KEY)

app = Flask(__name__)
cors = CORS(app)
stockfish = Stockfish(path=STOCKFISH_PATH)
ELO_SET = False


def get_top_move(fenPos):
     print("IN FUNCTION:", fenPos)
     if stockfish.is_fen_valid(fen=fenPos):
          print("IN THE IF BEFORE SET")
          stockfish.set_fen_position(fenPos)
          print("IN IF TO GET MOVE")
          move = stockfish.get_best_move()
          print("GOT MOVE")
          return move
     print("IN FUNCTION BUT INVALID FEN")
     return "Invalid Move"

def get_best_moves(fenPos):
     print("LIST FUNCTION")
     if stockfish.is_fen_valid(fen=fenPos):
          print("IN IF FOR LIST")
          stockfish.set_fen_position(fenPos)
          moveList = stockfish.get_top_moves(num_top_moves=3)
          print("GOT MOVE LIST STOCKFISH")
          return moveList
     return "Invalid Move"

@app.route("/receiver", methods=["POST"])
def postME():
   print(request.get_json())
   if type(request.get_json()) == int or request.get_json().isdigit():
       stockfish.set_elo_rating(int(request.get_json()))
       print("ELO SET")
       return {
           "status": 200,
           "comment": "ELO SET",
           "NEW ELO": int(request.get_json())
       }
   data = request.get_json()
   bestMove = get_top_move(data)
   print("out of function in stockfish")
   print(bestMove)
   stockfish.make_moves_from_current_position([bestMove]) #added
   newFen = stockfish.get_fen_position() #added
   print(newFen) #added
   newFen = jsonify(newFen) #added
   return newFen #added
   #bestMove = jsonify(bestMove)
   #return bestMove

@app.route("/movelist", methods=["POST"])
def moveList():
    print(request.get_json())
    fen = request.get_json()
    move_list = get_best_moves(fen)
    move_list = jsonify(move_list)
    return move_list

@app.route("/real", methods=["POST"])
def realMove():
    print(request.get_json())
    fen = request.get_json()
    real_move = get_top_move(fen)
    print(real_move)
    real_move = jsonify(real_move)
    return real_move

if __name__ == "__main__": 
   print(get_top_move('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'))
   app.run(debug=True)