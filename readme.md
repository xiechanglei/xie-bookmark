以女友名字（岚）命名的一个简单的网页书签管理器 
a simple web bookmark manager

#### 安装 install

```shell
npm install -g xie-bookmark
```

#### 添加书签 add bookmark

```shell
# 添加一个书签,会自动获取网页的标题 add a bookmark, will get the title of the web page automatically
lan add https://www.zhihu.com
# 添加一个书签,并指定标题 add a bookmark, and specify the title
lan add https://www.zhihu.com  zhihu
```
重复添加同一个url不会创建新的书签，而是更新已有的书签

#### 搜索书签 view bookmark

```shell
# 查看所有书签 view all bookmarks
lan
# 搜索书签 search bookmarks
lan search zhihu
# 当不存在任何匹配命令的时候也会被当作查寻指令 when there is no matching command, it will also be treated as a search command 
lan zhihu
```

#### 删除书签 remove bookmark

```shell
# 删除书签 remove bookmark
lan remove 1
# 删除书签,无需确认 remove bookmark, no need to confirm
lan remove 1 -f
# 删除指定url的书签 remove the bookmark of the specified url
lan remove http://www.google.com
# 删除所有书签 remove all bookmarks
lan empty
# 删除所有书签,无需确认 remove all bookmarks, no need to confirm
lan empty -f
```

#### 统计书签数量 count the number of bookmarks

```shell
lan count
```

#### 根据url获取书签内容 get bookmark content by url

```shell
# 查看指定url的书签，所以你也可以通过这个功能来保存一些非web的东西 view the bookmark of the specified url, so you can also use this feature to save some non-web things
lan add http://www.google.com 'google'
lan get http://www.google.com
```
利用这个特性，你可以把岚当作一个简单的基于命令行的参数存储工具
With this feature, you can use lan as a simple command line based parameter storage tool
```shell
lan add my_token '123456'
lan get my_token
```

#### 导出书签 export bookmark

```shell
# 导出书签 export bookmark
lan export
# 导出书签到指定文件 export bookmark to specified file
lan export bookmark.txt
```

#### 导入书签 import bookmark

```shell
# 导入书签 import bookmark
lan import --data <data>
# 导入书签，无需确认 import bookmark, no need to confirm
lan import --data <data> -f
# 从指定文件导入书签 import bookmark from specified file
lan import --file bookmark.txt
# 从指定的网络地址导入书签 import bookmark from specified url
lan import --url https://raw.githubusercontent.com/xieyezi/xie-bookmark/master/bookmark.txt
```

#### 合并书签 merge bookmark

```shell
# 合并书签 merge bookmark
lan merge --data <data>
# 合并书签，无需确认 merge bookmark, no need to confirm
lan merge --data <data> -f
# 从指定文件合并书签 merge bookmark from specified file
lan merge --file bookmark.txt
# 从指定的网络地址合并书签 merge bookmark from specified url
lan merge --url https://raw.githubusercontent.com/xieyezi/xie-bookmark/master/bookmark.txt
```
#### 重建索引 rebuild index
```shell
# 重建索引 rebuild index
lan reload
```

todo list:
1. --pass 对书签进行导出加密
2. 导出到url