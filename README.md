# 游戏技术美术作品集基础框架

这是一个纯 HTML / CSS / JavaScript 的双语静态网站，不需要安装任何依赖。

## 本地预览

最简单的方法：双击 `打开本地预览.bat` 或 `index.html`。

推荐方法：在此文件夹打开 PowerShell，运行：

```powershell
python -m http.server 8000
```

然后在浏览器打开 `http://localhost:8000`。按 `Ctrl + C` 停止服务器。

## 管理作品

1. 打开 `项目清单.xlsx`，在“项目”工作表中修改、增加、删除或排序作品。
2. “启用”填写“是”才会显示；“排序”数字越小越靠前。
3. 保存并关闭工作簿。
4. 双击 `更新网站数据.bat`。
5. 刷新首页。项目卡片和详情页都会从表格自动生成。

`projects-data.js` 是自动生成文件，不需要手动修改。更新器直接读取 xlsx，不依赖 Microsoft Excel；用 Excel、WPS 或 LibreOffice 保存都可以。

## 常用修改位置

- 项目内容、顺序和素材路径：`项目清单.xlsx`
- 页面结构：`index.html` 和 `project.html`
- 配色：`styles.css` 顶部的 `:root` 变量
- 强调色：将 `--accent:#e44b28` 改成你喜欢的颜色

## 添加真实素材

1. 将视频放入 `assets/videos`，使用 `project-01.mp4` 至 `project-06.mp4` 命名。
2. 首页鼠标悬停时会静音循环预览；点击项目后在详情页使用播放器观看。
3. 将封面放入 `assets/images/project-01/cover.jpg` 等对应位置。
4. 项目名称、介绍、工具和图片列表统一在 `项目清单.xlsx` 中修改。
5. 多张详情图片路径使用英文分号 `;` 隔开。

## 发布到 GitHub

建议使用 GitHub Desktop 管理整个文件夹。每次更新时：编辑表格、放入素材、双击更新数据，然后在 GitHub Desktop 中 Commit 并 Push。GitHub Pages 发布来源选择 `main` 分支的根目录。

视频尽量压缩。首页悬停预览建议使用 5～15 秒的小体积 MP4；超大完整视频建议使用外部视频托管地址。

网站目前预留 6 个项目。项目详情页通过 `project.html?id=01` 至 `06` 共用同一套模板。
