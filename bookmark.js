import {homedir} from 'os';
import {resolve, dirname} from 'path';
import {existsSync, writeFileSync, mkdirSync, readFileSync} from 'fs';
import chalk from "chalk";
import http from "http";
import https from "https";
import {gzip, gunzip} from "zlib";
// 获取用户的主目录
const data_store = resolve(homedir(), ".xie_bookmark", ".bookmarks.json");

// 书签列表
let bookmarks = [];

// 加载书签
const loadBookmarks = () => {
    // 如果文件不存在，创建文件
    if (!existsSync(data_store)) {
        const dir = dirname(data_store);
        if (!existsSync(dir)) {
            mkdirSync(dir, {recursive: true});
        }
        writeBookmarks();
    } else {
        try {
            bookmarks = JSON.parse(readFileSync(data_store, "utf-8"));
        } catch (e) {
            console.log(chalk.yellow(`Error: Failed to load bookmarks from file ${chalk.red.underline.italic(data_store)} :`));
            console.log(chalk.yellow(`\t${e.message}`));
        }
    }
}

// 写入书签 编码utf-8
const writeBookmarks = () => {
    writeFileSync(data_store, JSON.stringify(bookmarks), "utf-8");
}

// 打印书签
const printBookmarks = (filter_word) => {
    let result = bookmarks;
    if (filter_word !== undefined) {
        filter_word = filter_word.toLocaleLowerCase();
        result = bookmarks.filter((item) => item.title.includes(filter_word) || item.url.includes(filter_word));
    }
    //打印总数
    console.log(`Total ${chalk.green.bold(result.length)} bookmarks${filter_word ? " with filter word " + chalk.green.bold(filter_word) + " " : ""}:`);
    result.forEach((item) => {
        const id = chalk.yellow.bold(item.id);
        const title = item.title;
        const url = chalk.green.bold.italic(item.url);
        console.log(`${id}: ${title} (${url})`)
    })
}

// write bookmarkwithConfirm
const writeBookmarksWithConfirm = (force, tip1, tip2) => {
    if (force) {
        writeBookmarks();
        console.log(tip1);
        return;
    }
    //确认是否删除
    console.log(tip2);
    console.log(`Press ${chalk.yellow.bold("n")} to cancel, or any other key to confirm.`);
    //用户输入y确认删除
    process.stdin.once("data", (data) => {
        const cmd = data.toString().trim();
        if (cmd === "n") {
            console.log("Operation canceled.");
        } else {
            writeBookmarks();
            console.log(tip1);
        }
        process.exit(0);
    });
}

// 统计书签数量
export const countBookmarks = () => {
    console.log(chalk.green.bold(`Total ${bookmarks.length} bookmarks.`));
}

/**
 * 获取指定书签
 * @param url 书签的url
 */
export const getByUrl = (url) => {
    const bookmark = bookmarks.find((item) => item.url === url);
    if (bookmark === undefined) {
        console.log(`Bookmark with url ${chalk.green.bold(url)} not found.`);
    } else {
        console.log(`Bookmark with url ${chalk.green.bold(url)} found: ${chalk.green.bold(bookmark.title)}.`);
    }

}

// 获取所有书签
export const getAllBookmarks = () => {
    // 如果命令行参数大于2个，则获取第三个参数作为搜索关键字
    const keyword = process.argv.length > 2 ? process.argv[2] : undefined;
    printBookmarks(keyword);
}

// 添加书签
export const addBookmark = async (url, title) => {
    // 去重复
    const bookmark = bookmarks.find((item) => item.url === url);
    if (bookmark !== undefined) {
        console.log(`Bookmark with url ${chalk.green.bold(url)} already exists with id ${chalk.green.bold(bookmark.id)}.`);
        return;
    }
    // 获取书签中的最大的id
    const max_id = bookmarks.reduce((max, item) => {
        return item.id > max ? item.id : max;
    }, 0);
    if (title === undefined) {
        title = await new Promise((resolve, reject) => {
            const protocol = url.startsWith("https") ? https : http
            try {
                protocol.get(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
                    }
                }, (res) => {
                    let data = "";
                    res.on("data", (chunk) => {
                        data += chunk;
                    });
                    res.on("end", () => {
                        const title = data.match(/<title.*?>(.*)<\/title>/)[1];
                        resolve(title);
                    });
                }).on("error", (e) => {
                    console.log(`cannot get title from url ${chalk.green.bold(url)}, please provide a title manually.`);
                    process.exit(0);
                });
            } catch (e) {
                console.log(`cannot get title from url ${chalk.green.bold(url)}, please provide a title manually. like: ${chalk.green.bold("bm add " + url + " your_title")}`);
                process.exit(0);
            }
        });
    }
    bookmarks.push({id: max_id + 1, url, title});
    console.log(`Bookmark ${chalk.green.bold(url)} has been added with title ${chalk.green.bold(title)}.`);
    writeBookmarks();
}

// 删除书签
export const removeBookmark = (id, {force}) => {
    // 判断id是否为数字
    if (isNaN(id)) {
        console.log(`Error: ${id} is not a number.`);
        return
    }
    id = parseInt(id);
    const bookmark = bookmarks.find((item) => item.id === id);
    if (bookmark === undefined) {
        console.log(`Bookmark with id ${id} not found.`);
    } else {
        bookmarks = bookmarks.filter((item) => item.id !== id);
        writeBookmarksWithConfirm(force,
            `Bookmark with title ${chalk.green.bold(bookmark.title)} has been removed.`,
            `Are you sure you want to remove the bookmark：${chalk.green.bold(bookmark.title)} ?`);
    }
}

export const removeAllBookmark = ({force}) => {
    bookmarks = [];
    writeBookmarksWithConfirm(force,
        "All bookmarks have been removed.",
        "Are you sure you want to remove all bookmarks?");
}

// 搜索书签
export const searchBookmark = printBookmarks

// 修改书签
export const renameBookmark = (id, title) => {
    // 判断id是否为数字
    if (isNaN(id)) {
        console.log(`Error: ${id} is not a number.`);
        return
    }
    id = parseInt(id);
    const bookmark = bookmarks.find((item) => item.id === id);
    if (bookmark === undefined) {
        console.log(`Bookmark with id ${id} not found.`);
    } else {
        const old_title = bookmark.title;
        bookmark.title = title;
        writeBookmarks();
        console.log(`Bookmark with old title: ${chalk.green.bold(old_title)} has been renamed to new title: ${chalk.green.bold(title)}.`);
    }
}

/**
 * 导出
 * todo 导出并且上传到一个指定的http地址
 */
export const exportBookmarks = (file) => {
    const data_json = JSON.stringify(bookmarks);
    // gzip压缩
    gzip(data_json, (err, data_gzip) => {
        if (err) {
            console.log(`Error: ${err.message}`);
            return;
        }
        //转base64
        const data_base64_gzip = Buffer.from(data_gzip).toString("base64");
        if (file === undefined) {
            console.log(`export data is below,you can use ${chalk.green.bold("bm import --data <data>")} to import bookmarks in other computer.`);
            console.log(data_base64_gzip);
        } else {
            const file_path = resolve(file);
            writeFileSync(file, data_base64_gzip);
            console.log(`Bookmarks have been exported to file: ${chalk.green.bold(file_path)}. you can use ${chalk.green.bold("bm import --file <file_name>")} to import bookmarks in other computer.`);
        }
    });
}

/**
 * 给导入和合并使用的读取数据的防范
 */

const _readDataFromProvider = async (data, file, url) => {
    if (data === undefined && file === undefined && url === undefined) {
        console.log("Please provide data or file or url to import bookmarks.");
        return;
    }
    // 只能有一个参数
    const count = [data, file, url].filter((item) => item !== undefined).length;
    if (count > 1) {
        console.log("Please provide only one parameter.");
        return;
    }
    let data_json;
    if (data !== undefined) {
        data_json = data
    }
    if (file !== undefined) {
        data_json = readFileSync(resolve(file), "utf-8");
    }
    if (url !== undefined) {
        data_json = await fetch(url).then((res) => res.text());
    }
    // gzip解压
    const data_gzip = Buffer.from(data_json, "base64");
    const data_json_str = await new Promise((resolve, reject) => {
        gunzip(data_gzip, (err, decompressed) => {
            if (err) {
                console.log(`decode data failed`);
                process.exit(0);
            } else {
                resolve(decompressed.toString("utf-8"));
            }
        });
    });
    return JSON.parse(data_json_str);
}

/**
 * 导入
 */
export const importBookmarks = async ({data, file, url, force}) => {
    bookmarks = await _readDataFromProvider(data, file, url);
    writeBookmarksWithConfirm(force,
        "Bookmarks have been imported.",
        `Are you sure you want to import bookmarks(total ${chalk.green.bold(bookmarks.length)})?`);
}

/**
 * merge
 */
export const mergeBookmarks = async ({data, file, url, force}) => {
    const data_json_obj = await _readDataFromProvider(data, file, url);
    data_json_obj.filter((item) => bookmarks.find((bm) => bm.url === item.url) === undefined).forEach(item => addBookmark(item.url, item.title));
    writeBookmarksWithConfirm(force,
        "Bookmarks have been merged.",
        `Are you sure you want to merge bookmarks(total ${chalk.green.bold(bookmarks.length)})?`);
}

loadBookmarks();