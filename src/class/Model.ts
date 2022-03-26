import cjays from "cjays";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import defaults from "lodash.defaults";
import nanoid from "nanoid";
import { join } from "path";
import { Secret } from "../utilities/Secret";
import { Nuxonin } from "./Nuxonin";

class Model {
  private _props: object;
  private _defaults: object;
  private _instance: Nuxonin;
  private _key: string;
  private _isDeleted: boolean;
  private _obj: object;
  private _cpy: object;
  public constructor(props: object, defaultVal: object, instance: Nuxonin) {
    this._props = props;
    this._defaults = defaultVal;
    this._instance = instance;
    this._key = nanoid.nanoid();
    let _object: object = defaults(props, defaultVal);
    Object.entries(_object).map((_data) => {
      if (typeof _data[1] == "string") {
        _object[_data[0]] = cjays(_data[1], _object);
      }
    });
    this._obj = _object;
    if (instance.options.memoryCache) Secret.set(`${this._key}`, this._obj);
    if (instance.options.isJson) {
      writeFileSync(
        join(
          process.cwd(),
          "nuxonin_data",
          instance.options.db_name,
          `${this._key}.json`
        ),
        JSON.stringify(this._obj)
      );
    }
  }
  /**
   * This function will `delete` your `database`.
   */
  public delete() {
    if (this._instance.options.isJson) {
      unlinkSync(
        join(
          process.cwd(),
          "nuxonin_data",
          this._instance.options.db_name,
          `${this._key}.json`
        )
      );
      if (this._instance.options.memoryCache) {
        Secret.delete(`${this._instance.options.db_name}${this._key}`);
        this._isDeleted = true;
      }
    }
  }

  /**
   * This function `update` the new data in the database.
   * @param newValue {object} input any object with key. Also allows for notation following the key.
   */
  public update(newValue: object) {
    if (
      this._isDeleted == true ||
      (this._instance.options.isJson == true &&
        !existsSync(
          join(
            process.cwd(),
            "nuxonin_data",
            this._instance.options.db_name,
            `${this._key}.json`
          )
        )) ||
      (this._instance.options.memoryCache == true && !Secret.has(this._key))
    )
      throw new NuxoninError("DOCUMENT", `ALREADY`, `DELETED`);
    this._cpy = this._obj;
    let _object: object = defaults(newValue, this._cpy);
    Object.entries(_object).map((_data) => {
      if (typeof _data[1] == "string") {
        _object[_data[0]] = cjays(_data[1], _object);
      }
    });
    this._obj = _object;
    if (this._instance.options.memoryCache)
      Secret.set(`${this._key}`, this._obj);
    if (this._instance.options.isJson) {
      writeFileSync(
        join(
          process.cwd(),
          "nuxonin_data",
          this._instance.options.db_name,
          `${this._key}.json`
        ),
        JSON.stringify(this._obj)
      );
    }
  }
}

export default Model;
