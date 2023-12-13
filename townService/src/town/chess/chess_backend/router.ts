import Express from 'express';
import ChessGame from './chess_app';
// eslint-disable-next-line import/no-named-as-default
import ChessHandler from './chess_handler';
import StockfishHandler from './stockfish_handler';
import EloHandler from '../database/elo_handler';

const router = Express.Router();
// const chess = new ChessGame(1, 2);

// console.log(chess.getFen());

router.route('/initialize').post(ChessHandler.initialize);
router.route('/fen').get(ChessHandler.getFen);
router.route('/move/:move').post(ChessHandler.makeMove);
router.route('/history').get(ChessHandler.getHistory);
router.route('/turn').get(ChessHandler.getTurn);
router.route('/load').post(ChessHandler.loadFen);
router.route('/reason').get(ChessHandler.getReason);
router.route('/piece/:square').get(ChessHandler.pieceOnSquare);
router.route('/moves').get(ChessHandler.getMoves);
router.route('/checkmate').get(ChessHandler.checkCheckmate);
router.route('/concede/:color').post(ChessHandler.concede);
router.route('/winner').get(ChessHandler.winner);

router.route('/stockfishinit/:elo').post(StockfishHandler.initialize);
router.route('/stockfishmove').post(StockfishHandler.getBestMove);
router.route('/stockfishlist').post(StockfishHandler.getBestMoveList);
router.route('/stockfishreal').post(StockfishHandler.getRealMove);

router.route('/eloInitialize').get(EloHandler.eloInitialize);
router.route('/eloAddToList').post(EloHandler.eloAddToList);
router.route('/eloSetScore/:score').post(EloHandler.eloSetScore);
router.route('/eloUpdate').get(EloHandler.eloUpdate);
router.route('/eloGetLeaderboard').get(EloHandler.eloGetLeaderboard);

export default router;
