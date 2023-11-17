import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../../lib/Player';
import {
  BoundingBox,
  GameArea as ChessAreaModel,
  TownEmitter,
} from '../../types/CoveyTownSocket';
import InteractableArea from '../InteractableArea';

export default class ChessArea extends InteractableArea {
    /* The players in the chess area, or undefined if there are no players */
    public playersByID?: string[];

    /* The spectators in the chess area, or undefined if there are no spectators */
    public spectatorsByID?: string[];

    /* The game ID of the current chess game of the chess area, or undefined if no game is in progress */
    public gameID?: string;

    /** The chess area is "active" when there are players inside of it */
    public get isActive(): boolean {
        return this._occupants.length > 0;
    }

    /**
     * Creates a new ChessArea
     * 
     * @param id the ID if the current chess area
     * @param coordinates the bounding box that defines this chess area
     * @param townEmitter a broadcast emitter that can be used to emit updates to players
     */
    public constructor(
        {id}: ChessAreaModel,
        coordinates: BoundingBox,
        townEmitter: TownEmitter,
    ) {
        super(id, coordinates, townEmitter);
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
      this.gameID = undefined;
      this.playersByID = undefined;
      this._emitAreaChanged();
    }
  }

  /**
   * Convert this ChessArea instance to a simple ChessAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): ChessAreaModel {
    return {
      id: this.id,
      playersByID: this.playersByID,
      spectatorsByID: this.spectatorsByID,
      gameID: this.gameID,
    };
  }
  
  /**
   * Creates a new ChessArea object that will represent a Chess Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this chess area exists
   * @param broadcastEmitter An emitter that can be used by this chess area to broadcast updates
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): ChessArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new ChessArea({ id: name, playersByID: [], spectatorsByID: [], gameID: undefined}, rect, broadcastEmitter);
  }
}
