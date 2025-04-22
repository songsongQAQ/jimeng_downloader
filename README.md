# 即梦图片下载器 - 油猴脚本

## 项目介绍
这是一个油猴脚本，用于在即梦AI图片生成网站（https://jimeng.jianying.com/ai-tool/image/generate） 上免费下载无水印图片。

## 功能特点
- 自动检测页面上由即梦生成的图片（URL包含dreamina-sign）
- 在每张图片的右下角添加下载按钮
- 点击按钮可以直接下载原始图片，无需付费，无水印
- 下载图片格式为WebP，兼容性更好，支持系统预览
- 下载时显示加载状态和成功/失败通知
- 自动为下载的图片添加时间戳，避免文件名冲突
- 悬停显示下载按钮，不干扰正常浏览体验

## 安装方法
1. 首先确保你已安装了油猴扩展（Tampermonkey）
   - Chrome浏览器：[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox浏览器：[Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge浏览器：[Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. 选择以下任意一种方式安装脚本：

   - **方式一**：访问我们的[安装页面](install.html)，获取更详细的安装指导和功能演示
   - **方式二**：直接点击[安装脚本](jimeng_image_downloader.user.js)进行快速安装
   - **方式三**：手动安装
     - 打开Tampermonkey面板
     - 点击"添加新脚本"
     - 将`jimeng_image_downloader.user.js`文件中的内容复制粘贴到编辑器中
     - 保存

## 使用方法
1. 安装脚本后，访问[即梦AI图片生成页面](https://jimeng.jianying.com/ai-tool/image/generate)
2. 生成图片后，你会在每张图片的右下角看到一个下载图标
3. 点击下载图标即可保存原始图片到本地，保存格式为WebP

## 项目文件结构
- `README.md` - 项目说明文档
- `jimeng_image_downloader.user.js` - 油猴脚本源代码
- `index.html` - 项目首页
- `install.html` - 安装指导页面
- `demo.svg` - 功能演示图片

## 技术原理
脚本通过识别URL中包含"dreamina-sign"的图片元素，然后在图片容器中添加下载按钮。使用原生的下载API实现直接下载图片功能。主要技术点：

1. 使用MutationObserver监听DOM变化，自动处理动态加载的图片
2. 自定义CSS样式实现美观的下载按钮和通知
3. 使用fetch API请求图片资源并转换为Blob对象下载
4. 错误处理和加载状态反馈，提高用户体验
5. 检查图片是否已完全加载和有效，避免高度为0的图片处理错误
6. 将下载格式设置为WebP格式，确保图片可以被系统正常预览

## 注意事项
- 此脚本仅供学习和研究使用
- 请尊重创作者的权益，下载的图片请勿用于商业用途
- 脚本可能因网站更新而失效，如遇问题请提交issue

## 更新日志

- v1.0.0 (2025-04-22): 
  - 首次发布，实现基本下载功能
  - 添加下载状态和通知功能
  - 优化用户界面和交互体验
  - 使用WebP格式保存图片，支持系统预览