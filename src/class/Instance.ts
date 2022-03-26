import Model from "./Model";
import { Nuxonin } from "./Nuxonin";

class Instance {
  private _settings: object;
  private _instance: Nuxonin;
  public constructor(settings: object, inst: Nuxonin) {
    this._settings = settings;
    this._instance = inst;
  }
  /**
   * This function will make an Model in the database.
   * @param settings {object} input any object with key, Also allow for notation following the key.
   * @returns **`Model`**
   */
  public make(settings: object): Model {
    return new Model(settings, this._settings, this._instance);
  }
}

export default Instance;
