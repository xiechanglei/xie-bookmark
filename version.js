import {fileURLToPath} from 'url'
import {dirname, resolve} from "path";
import {readFileSync} from "fs";

export const getVersion = () => {
    const im_url = import.meta.url;
    const base_path = dirname(fileURLToPath(im_url));
    const package_json_file = resolve(base_path, "package.json");
    const package_json = JSON.parse(readFileSync(package_json_file, "utf-8"))
    console.log(package_json.version);
}