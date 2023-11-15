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
          stockfish.set_fen_position(fenPos)
          move = stockfish.get_best_move(5000)
          return move
     return "Invalid Move"

def get_best_moves(fenPos):
     if stockfish.is_fen_valid(fen=fenPos):
          stockfish.set_fen_position(fenPos)
          moveList = stockfish.get_top_moves(num_top_moves=10)
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
   print(bestMove)
   bestMove = jsonify(bestMove)
   return bestMove

@app.route("/movelist", methods=["POST"])
def moveList():
    print(request.get_json())
    fen = request.get_json()
    move_list = get_best_moves(fen)
    move_list = jsonify(move_list)
    return move_list

if __name__ == "__main__": 
   app.run(debug=True)