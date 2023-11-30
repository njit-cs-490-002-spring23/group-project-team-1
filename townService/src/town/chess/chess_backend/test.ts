import ChessGame from './chess_app';

const game = new ChessGame(12, 21);

const PIECE = 'Q';
const MOVESPACE = 'h4';

console.log('Qxh4+'.match(`^${PIECE}x?${MOVESPACE}[+#]?`));

console.log('abc'.match('^a'));
