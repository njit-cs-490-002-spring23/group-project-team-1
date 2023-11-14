class CallStockfish {
  _ELO: number;

  constructor(ELO_VALUE: number) {
    this._ELO = ELO_VALUE;
  }

  public gameStart() {
    fetch('http://127.0.0.1:5000/receiver', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      // Strigify the payload into JSON</strong>:
      body: JSON.stringify(this._ELO),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        alert('something is wrong');
        return {
          status: 400,
        };
      })
      .then(jsonResponse => {
        // Log the response data in the console
        console.log(jsonResponse);
      })
      .catch(err => console.error(err));
  }

  /*
    public callStockfish (fenString) {
        if(game.in_checkmate()) {
            checkmateFunction();
            return;
        }
        fetch("http://127.0.0.1:5000/receiver", 
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                // Strigify the payload into JSON</strong>:
                body:JSON.stringify(fenString)
            })
            .then(res=>{
                if(res.ok){
                    return res.json()
                }else{
                    alert("something is wrong")
                }
            })
            .then(jsonResponse=>{
                // Log the response data in the console
                console.log(jsonResponse)
                moveToMake = jsonResponse
                console.log("move to make", moveToMake);
                console.log(moveToMake.slice(2,4));
                console.log(game.moves());
                console.log(game.get(moveToMake.slice(0,2)).type.toUpperCase());
                if(game.move(moveToMake.slice(2,4)) === null) {
                    const piece = game.get(moveToMake.slice(0,2)).type.toUpperCase();
                    const correct_move_notation = piece + moveToMake.slice(2,4);
                    console.log(correct_move_notation);
                    if(game.move(correct_move_notation) === null) {
                        if (piece === 'P') {
                            const capture_pawn_notation = moveToMake.slice(0,1) + 'x' + moveToMake.slice(2,4);
                            if(game.move(capture_pawn_notation) === null) {
                                if(game.move(capture_pawn_notation + '+') === null) {
                                    if(game.move(capture_pawn_notation + '=Q') === null) {
                                        if(game.move(capture_pawn_notation + '=Q+') === null) {
                                            if(game.move(capture_pawn_notation + '=Q#') === null) {
                                                if(game.move(moveToMake.slice(2,4) + '=Q') === null) {
                                                    if(game.move(moveToMake.slice(2,4) + '=Q+') === null) {
                                                        game.move(moveToMake.slice(2,4) + '+');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            board.position(game.fen());
                            return;
                        }
                        const capture_notation = piece + 'x' + moveToMake.slice(2,4);
                        console.log(capture_notation);
                        if(game.move(capture_notation) === null) {
                            console.log(capture_notation + '+');
                            if(game.move(capture_notation + '+') === null) {
                                if(game.move(correct_move_notation + '+') === null) {
                                    if(piece === 'N') {
                                        console.log(piece + moveToMake.slice(0,1) + moveToMake.slice(2,4));
                                        if(game.move(piece + moveToMake.slice(0,1) + moveToMake.slice(2,4)) === null) {
                                            console.log(piece + moveToMake.slice(0,1) + moveToMake.slice(2,4) + '+');
                                            if(game.move(piece + moveToMake.slice(0,1) + moveToMake.slice(2,4) + '+') === null) {
                                                console.log(piece + moveToMake.slice(1,2) + moveToMake.slice(2,4));
                                                if(game.move(piece + moveToMake.slice(1,2) + moveToMake.slice(2,4)) === null) {
                                                    console.log(piece + moveToMake.slice(1,2) + moveToMake.slice(2,4) + '+');
                                                    if(game.move(piece + moveToMake.slice(1,2) + moveToMake.slice(2,4) + '+') === null) {
                                                        if(game.move(piece + moveToMake.slice(1,2) + moveToMake.slice(2,4) + '#') === null) {
                                                            if(game.move(piece + moveToMake.slice(0,1) + moveToMake.slice(2,4) + '#') === null) {
                                                                game.move(piece + moveToMake.slice(2,4) + '#')
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        console.log(capture_notation + '#');
                                        if(game.move(capture_notation + '#') === null) {
                                            console.log(correct_move_notation + '#');
                                            if(game.move(correct_move_notation + '#') === null) {
                                                if(piece === 'K' && moveToMake === 'e8g8'){
                                                    console.log("NOT QUEEN SIDE CASTLE");
                                                    game.move("O-O");
                                                } else if (piece === 'K' && moveToMake == 'e8c8') {
                                                    console.log("QUEEN SIDE CASTLE");
                                                    game.move("O-O-O");
                                                }
                                            }
                                        }
                                    }
                                    
                                }
                            }
                        }
                    } 
                }
                board.position(game.fen());
            })
            .catch((err) => console.error(err));
    } */
}

export default CallStockfish;
