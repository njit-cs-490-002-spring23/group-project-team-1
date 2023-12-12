import axios from 'axios';

const BASEURL = 'http://localhost:5757';

let fen: string;
let history;
fen = '';

await axios
  .post(`${BASEURL}/initialize?player1=1&player2=2`)
  .then(httpresponse => httpresponse.data)
  .then(data => {
    console.log(data);
  })
  .catch(e => console.log(e));

await axios
  .post(`${BASEURL}/move/e4?color=w`)
  .then(response => response.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.code === 200 ? (fen = data.fen) : console.log('error');
  })
  .catch(e => console.log(e));

console.log(`NEW FEN: ${fen}`);

await axios
  .get(`${BASEURL}/moves`)
  .then(response => response.data)
  .then(data => console.log(data))
  .catch(e => console.log(e));

await axios
  .post(`${BASEURL}/move/Nc6?color=b`)
  .then(response => response.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.code === 200 ? (fen = data.fen) : console.log('error');
  })
  .catch(e => console.log(e));

console.log(`NEW FEN: ${fen}`);

await axios
  .get(`${BASEURL}/history`)
  .then(httpresponse => httpresponse.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.code === 200 ? (history = data.history) : console.log('error');
  })
  .catch(e => console.log(e));

console.log('\nHistory:');
for (const [key, value] of Object.entries(history)) {
  console.log(`${key}: ${value}`);
}

await axios
  .post(`${BASEURL}/load`, { fen: history.e4 })
  .then(httpresponse => httpresponse.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (data.code === 200) {
      console.log(data);
      fen = data.newFen;
    } else {
      console.log('error');
    }
  })
  .catch(e => console.log(e));

console.log(`FINAL FEN: ${fen}`);

let elo: number;
let move: string;
let moveList;
elo = 2000;
move = 'not set';
await axios
  .post(`${BASEURL}/stockfishinit/3000`)
  .then(response => response.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.status === 200 ? (elo = data.stockfish_elo) : console.log('error');
  })
  .catch(e => console.log(e));

if (elo) console.log(`elo set to ${elo}`);

await axios
  // eslint-disable-next-line object-shorthand
  .get(`${BASEURL}/stockfishmove`, { data: { fen: fen } })
  .then(response => response.data)
  // eslint-disable-next-line no-return-assign
  .then(data => (move = data.move))
  .catch(e => console.log(e));

console.log(`Move: ${move}`);

await axios
  // eslint-disable-next-line object-shorthand
  .get(`${BASEURL}/stockfishlist`, { data: { fen: fen } })
  .then(response => response.data)
  // eslint-disable-next-line no-return-assign
  .then(data => (moveList = data.moveList))
  .catch(e => console.log(e));

for (let i = 0; i < moveList.length; i++) {
  console.log(moveList[i]);
}
await axios
  .get(`${BASEURL}/turn`)
  .then(httpresponse => httpresponse.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.code === 200 ? console.log(data.turn) : console.log('error');
  })
  .catch(e => console.log(e));

await axios
  .post(`${BASEURL}/load`, { fen: move })
  .then(httpresponse => httpresponse.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (data.code === 200) {
      console.log(data);
      fen = data.newFen;
    } else {
      console.log('error');
    }
  })
  .catch(e => console.log(e));

console.log(`LOADED FEN: ${fen}`);

await axios
  .get(`${BASEURL}/turn`)
  .then(httpresponse => httpresponse.data)
  .then(data => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    data.code === 200 ? console.log(data.turn) : console.log('error');
  })
  .catch(e => console.log(e));
