import { readdirSync, readFileSync, unlinkSync } from "fs";
import { unlink } from "fs/promises";
import defaults from "lodash.defaults";
import { join } from "path";
import { IDatabaseOptions, ISearch } from "../interfaces";
import { makeDir } from "../utilities/createDir";
import { Secret } from "../utilities/Secret";
import Instance from "./Instance";
// Cache the memory

class Nuxonin {
  public options: IDatabaseOptions;
  public constructor(options: IDatabaseOptions) {
    this.options = defaults(options, { json: false, memoryCache: false });
    if (this.options.isJson) {
      makeDir(join(process.cwd(), "nuxonin_data"));
      makeDir(join(process.cwd(), "nuxonin_data", this.options.db_name));
    }
  }

  public instance(settings?: object): Instance {
    if (!settings) settings = {};
    return new Instance(settings, this);
  }
  /**
   * This function finding data from a object in database.
   * @param props {object} input any object with key. Also allow for notation following the key.
   * @returns {object} requested data
   */
  public find(props: object): {} {
    const response: Array<unknown> = [];
    if (this.options.isJson == true) {
      const fileArray = [
        ...readdirSync(
          join(process.cwd(), `nuxonin_data`, this.options.db_name)
        ).map((d) => [
          d.split(".json")[0],
          JSON.parse(
            readFileSync(
              join(process.cwd(), `nuxonin_data`, this.options.db_name, d)
            ).toString()
          ),
        ]),
      ];
      const entries = Object.entries(props);
      fileArray.filter((_data) => {
        const prop = _data[1];
        entries.map((e) => {
          if (!!(prop[e[0]] && prop[e[0]] == e[1])) {
            return response.push({
              ..._data[1],
              _: {
                key: _data[0],
              },
            });
          }
        });
      });
    } else if (
      this.options.memoryCache == true &&
      this.options.isJson == false
    ) {
      const cArray = [...Secret];
      const entries = Object.entries(props);
      cArray.filter((_data) => {
        const prop = _data[1];
        entries.map((e) => {
          if (!!(prop[e[0]] && prop[e[0]] == e[1])) {
            return response.push({ ..._data[1], _: { key: _data[0] } });
          }
        });
      });
    }
    return response;
  }
  /**
   * This function will **delete** an `object/property` in database.
   * @param value {object} input any object with key. Also allows for notation following the key, this will delete the prop in the object.
   * @param i
   */
  public delete(value: object, i?: number) {
    if (!i) i = 0;
    const _data: ISearch = this.find(value)[i];
    if (this.options.isJson) {
      unlinkSync(
        join(
          process.cwd(),
          "nuxonin_data",
          this.options.db_name,
          _data._.key + ".json"
        )
      );
      if (this.options.memoryCache) {
        Secret.delete(_data._.key);
      }
    }
  }
}

export { Nuxonin };
