import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import { BoundingBox, GameArea as GameAreaModel, TownEmitter } from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class GameArea extends InteractableArea {
  /* The topic of the conversation area, or undefined if it is not set */
  public game?: string;

  /** The conversation area is "active" when there are players inside of it  */
  public get isActive(): boolean {
    return this._occupants.length > 0;
  }

  /**
   * Creates a new GameArea
   *
   * @param GameAreaModel model containing this area's current topic and its ID
   * @param coordinates  the bounding box that defines this conversation area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { game, id }: GameAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this.game = game;
  }

  /**
   * Removes a player from this conversation area.
   *
   * Extends the base behavior of InteractableArea to set the topic of this GameArea to undefined and
   * emit an update to other players in the town when the last player leaves.
   *
   * @param player
   */
  public remove(player: Player) {
    super.remove(player);
    if (this._occupants.length === 0) {
      this.game = undefined;
      this._emitAreaChanged();
    }
  }

  /**
   * Convert this GameArea instance to a simple GameAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): GameAreaModel {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
      game: this.game,
    };
  }

  /**
   * Creates a new GameArea object that will represent a Conversation Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this conversation area exists
   * @param broadcastEmitter An emitter that can be used by this conversation area to broadcast updates
   * @returns
   */
  public static fromMapObject(mapObject: ITiledMapObject, broadcastEmitter: TownEmitter): GameArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new GameArea({ id: name, occupantsByID: [] }, rect, broadcastEmitter);
  }
}
