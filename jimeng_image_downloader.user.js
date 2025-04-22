// ==UserScript==
// @name         即梦图片下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  免费无码下载即梦生成的图片
// @author       Your Name
// @match        https://jimeng.jianying.com/ai-tool/image/generate*
// @match        https://jimeng.jianying.com/ai-tool/image/detail*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .jimeng-download-btn {
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 36px;
            height: 36px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .jimeng-download-btn:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
        .jimeng-download-btn svg {
            width: 20px;
            height: 20px;
            fill: white;
        }
        .jimeng-img-container {
            position: relative;
            height: 100%;
        }
        .jimeng-img-container:hover .jimeng-download-btn {
            opacity: 1;
        }
        .jimeng-download-btn.loading {
            pointer-events: none;
        }
        .jimeng-download-btn.loading svg {
            animation: spin 1s linear infinite;
        }
        .jimeng-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            max-width: 300px;
        }
        .jimeng-notification.show {
            opacity: 1;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // 通知函数
    function showNotification(message, type = 'info') {
        // 如果支持油猴GM_notification就使用它
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: '即梦图片下载器',
                timeout: 3000
            });
            return;
        }

        // 否则使用自定义通知
        const notification = document.createElement('div');
        notification.className = 'jimeng-notification';
        notification.textContent = message;
        
        if (type === 'error') {
            notification.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
        } else if (type === 'success') {
            notification.style.backgroundColor = 'rgba(40, 167, 69, 0.9)';
        }
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 自动关闭通知
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 下载图片函数
    function downloadImage(imgUrl, button) {
        // 设置按钮为加载状态
        if (button) {
            button.classList.add('loading');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
            `;
        }

        // 生成文件名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `jimeng_${timestamp}.png`;
        
        fetch(imgUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误：${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                // 恢复按钮状态
                if (button) {
                    button.classList.remove('loading');
                    button.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                    `;
                }
                
                showNotification('图片下载成功！', 'success');
            })
            .catch(error => {
                console.error('下载图片失败:', error);
                
                // 恢复按钮状态
                if (button) {
                    button.classList.remove('loading');
                    button.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                    `;
                }
                
                showNotification('下载失败，请重试：' + error.message, 'error');
            });
    }

    // 创建下载按钮
    function createDownloadButton(imgUrl) {
        const btn = document.createElement('div');
        btn.className = 'jimeng-download-btn';
        btn.title = '下载图片';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            downloadImage(imgUrl, btn);
        });
        return btn;
    }

    // 获取当前图片的创意描述作为文件名（如果可能）
    function getImageDescription(imgElement) {
        // 尝试从页面中查找图片描述的元素
        // 由于网站结构可能变化，这里提供一个基础实现
        // 可能需要根据实际网站结构调整选择器
        try {
            const container = imgElement.closest('.image-item') || imgElement.closest('.image-container');
            if (container) {
                const descElement = container.querySelector('.prompt-text') || container.querySelector('.description');
                if (descElement && descElement.textContent.trim()) {
                    // 只取前20个字符作为文件名一部分
                    return descElement.textContent.trim().slice(0, 20);
                }
            }
        } catch (error) {
            console.error('获取图片描述失败', error);
        }
        return null;
    }

    // 处理图片
    function processImages() {
        const images = document.querySelectorAll('img');
        let count = 0;
        
        images.forEach(img => {
            // 修复：检查图片是否已加载完成且高度不为0
            if (img.src && 
                img.src.includes('dreamina-sign') && 
                !img.parentElement.classList.contains('jimeng-img-container') &&
                img.complete && 
                img.naturalHeight !== 0) {
                
                // 确保父容器有相对定位
                const parent = img.parentElement;
                parent.classList.add('jimeng-img-container');
                
                // 检查是否已经添加了下载按钮
                if (!parent.querySelector('.jimeng-download-btn')) {
                    const downloadBtn = createDownloadButton(img.src);
                    parent.appendChild(downloadBtn);
                    count++;
                }
            }
        });
        
        return count;
    }

    // 初始加载和处理图片
    function init() {
        // 延迟执行，确保图片加载完成
        setTimeout(() => {
            const initialCount = processImages();
            if (initialCount > 0) {
                console.log(`[即梦图片下载器] 已为${initialCount}张图片添加下载按钮`);
            }
        }, 1000);
        
        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(mutations => {
            let shouldProcess = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length || mutation.attributeName === 'src') {
                    shouldProcess = true;
                }
            });
            
            if (shouldProcess) {
                // 延迟处理，确保图片加载完成
                setTimeout(() => {
                    const newCount = processImages();
                    if (newCount > 0) {
                        console.log(`[即梦图片下载器] 发现新内容，已为${newCount}张图片添加下载按钮`);
                    }
                }, 500);
            }
        });
        
        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        // 监听图片加载事件
        document.addEventListener('load', function(e) {
            if (e.target.tagName === 'IMG' && e.target.src.includes('dreamina-sign')) {
                processImages();
            }
        }, true);
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果页面已经加载完成，延迟一点执行，以防有延迟加载的内容
        setTimeout(init, 500);
    }
})(); 