#!/usr/bin/env node
import {program} from "commander";
import {
    addBookmark,
    getAllBookmarks,
    removeBookmark,
    searchBookmark,
    renameBookmark,
    removeAllBookmark,
    countBookmarks, getByUrl, exportBookmarks, importBookmarks, mergeBookmarks
} from "./bookmark.js";
import {getVersion} from "./version.js";

// 显示版本信息
program.command("version")
    .description("output the version number")
    .action(getVersion);

// 添加书签
program.command('add book_url [book_title]')
    .description('add a bookmark')
    .action(addBookmark);

// 删除书签
program.command('remove id')
    .description('remove a bookmark by id')
    .option("-f, --force", "force remove without confirmation", false)
    .action(removeBookmark);

// 删除所有的书签
program.command('empty')
    .description('remove all bookmarks')
    .option("-f, --force", "force remove without confirmation", false)
    .action(removeAllBookmark);

// 修改书签名称
program.command('rename id title')
    .description('rename a bookmark by id and new title')
    .action(renameBookmark);

// 搜索书签
program.command('search [keyword]')
    .description('search bookmarks by keyword')
    .action(searchBookmark);

// 统计书签数量
program.command("count").description("count the number of bookmarks").action(countBookmarks);

// 获取指定书签
program.command("get url").description("get the bookmark by url").action(getByUrl);

// export todo url
program.command("export [file]").description("export all bookmarks").action(exportBookmarks);

//import
program.command("import")
    .description("import bookmarks from file")
    .option("-data, --data <string>", "import bookmarks from data")
    .option("-file, --file <string>", "import bookmarks from file")
    .option("-url, --url <string>", "import bookmarks from url")
    .option("-f, --force", "force import without confirmation", false)
    .action(importBookmarks);

//merge
program.command("merge")
    .description("merge bookmarks from file")
    .option("-data, --data <string>", "merge bookmarks from data")
    .option("-file, --file <string>", "merge bookmarks from file")
    .option("-url, --url <string>", "merge bookmarks from url")
    .option("-f, --force", "force merge without confirmation", false)
    .action(mergeBookmarks);

// 默认显示所有书签
program.action(getAllBookmarks);

program.parse()