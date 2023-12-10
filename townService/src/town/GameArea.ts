import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import { BoundingBox, GameArea as GameAreaModel, TownEmitter } from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class GameArea extends InteractableArea {
  /* The type of game being played. The default is chess. */
  public chosenGame?: string;

  /** The chess area is "active" when there are players inside of it */
  public get isActive(): boolean {
    return this._occupants.length > 0;
  }

  /**
   * Creates a new ChessArea
   *
   * @param gameAreaModel the ID if the current chess area
   * @param coordinates the bounding box that defines this chess area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { chosenGame, id }: GameAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this.chosenGame = chosenGame;
  }

  /**
   * Removes a player from this conversation area.
   *
   * Extends the base behavior of InteractableArea to set the topic of this ConversationArea to undefined and
   * emit an update to other players in the town when the last player leaves.
   *
   * @param player
   */
  public remove(player: Player) {
    super.remove(player);
    if (this._occupants.length === 0) {
      this.chosenGame = undefined;
      this._emitAreaChanged();
    }
  }

  /**
   * Convert this ChessArea instance to a simple ChessAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): GameAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
      chosenGame: this.chosenGame,
    };
  }

  /**
   * Creates a new ChessArea object that will represent a Chess Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this chess area exists
   * @param broadcastEmitter An emitter that can be used by this chess area to broadcast updates
   * @returns
   */
  public static fromMapObject(mapObject: ITiledMapObject, broadcastEmitter: TownEmitter): GameArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed chess area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new GameArea({ id: name, occupantsByID: [] }, rect, broadcastEmitter);
  }
}
