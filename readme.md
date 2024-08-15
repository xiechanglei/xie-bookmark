一个简单的网页书签管理器 a simple web bookmark manager

#### 1.安装 install

```shell
npm install -g xie-bookmark
```

#### 2.添加书签 add bookmark

```shell
# 添加一个书签,会自动获取网页的标题 add a bookmark, will get the title of the web page automatically
bm add https://www.zhihu.com
# 添加一个书签,并指定标题 add a bookmark, and specify the title
bm add https://www.zhihu.com  zhihu
```

#### 3.查看书签 view bookmark

```shell
# 查看所有书签 view all bookmarks
bm
# 搜索书签 search bookmarks
bm search zhihu
# 当不存在任何匹配命令的时候也会被当作查寻指令 when there is no matching command, it will also be treated as a search command 
bm zhihu
```

#### 4.重命名书签 rename bookmark

```shell
# 重命名书签 rename bookmark
bm rename 1 zhihu_new 
```

#### 5.删除书签 remove bookmark

```shell
# 删除书签 remove bookmark
bm remove 1
# 删除书签,无需确认 remove bookmark, no need to confirm
bm remove 1 -f
# 删除所有书签 remove all bookmarks
bm empty
# 删除所有书签,无需确认 remove all bookmarks, no need to confirm
bm empty -f
```

#### 6.统计书签数量 count the number of bookmarks

```shell
bm count
```

#### 7.根据url获取书签内容 get bookmark content by url

```shell
# 查看指定url的书签，所以你也可以通过这个功能来保存一些非web的东西 view the bookmark of the specified url, so you can also use this feature to save some non-web things
bm add book_name 'my love is gone'
bm get book_name
```

#### 8.导出书签 export bookmark

```shell
# 导出书签 export bookmark
bm export
# 导出书签到指定文件 export bookmark to specified file
bm export bookmark.txt
```

#### 9.导入书签 import bookmark

```shell
# 导入书签 import bookmark
bm import --data <data>
# 导入书签，无需确认 import bookmark, no need to confirm
bm import --data <data> -f
# 从指定文件导入书签 import bookmark from specified file
bm import --file bookmark.txt
# 从指定的网络地址导入书签 import bookmark from specified url
bm import --url https://raw.githubusercontent.com/xieyezi/xie-bookmark/master/bookmark.txt
```

#### 10.合并书签 merge bookmark

```shell
# 合并书签 merge bookmark
bm merge --data <data>
# 合并书签，无需确认 merge bookmark, no need to confirm
bm merge --data <data> -f
# 从指定文件合并书签 merge bookmark from specified file
bm merge --file bookmark.txt
# 从指定的网络地址合并书签 merge bookmark from specified url
bm merge --url https://raw.githubusercontent.com/xieyezi/xie-bookmark/master/bookmark.txt
```

todo list:

1. --pass 对书签进行导出加密
2. 导出到url