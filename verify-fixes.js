/**
 * 验证代码修复的简单脚本
 * 检查修复后的代码是否符合预期
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始验证代码修复...\n');

// 检查文件是否存在
function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

// 检查文件内容是否包含特定字符串
function checkFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const contains = content.includes(searchString);
    console.log(`${contains ? '✅' : '❌'} ${description}`);
    return contains;
  } catch (error) {
    console.log(`❌ 无法读取文件: ${filePath}`);
    return false;
  }
}

// 验证修复项目
console.log('📁 文件存在性检查:');
checkFileExists('./src/modules/videoStream.ts', '视频流模块');
checkFileExists('./src/modules/i18n.ts', '国际化模块');
checkFileExists('./src/styles/main.css', '样式文件');
checkFileExists('./src/tests/videoStream.test.ts', '单元测试文件');
checkFileExists('./IMPROVEMENTS_SUMMARY.md', '改进总结文档');

console.log('\n🔧 严重问题修复验证:');

// 1. 事件监听器内存泄漏修复
checkFileContains('./src/modules/videoStream.ts', 'boundPlayHandler', '播放按钮事件处理器引用');
checkFileContains('./src/modules/videoStream.ts', 'boundCameraHandlers', '摄像头按钮事件处理器引用');
checkFileContains('./src/modules/videoStream.ts', 'removeEventListener', '事件监听器移除');

// 2. 权限处理改进
checkFileContains('./src/modules/videoStream.ts', 'getLocalizedErrorMessage', '本地化错误消息处理');
checkFileContains('./src/modules/videoStream.ts', 'NotAllowedError', '权限拒绝错误处理');
checkFileContains('./src/modules/videoStream.ts', 'BROWSER_NOT_SUPPORTED', '浏览器支持检查');

console.log('\n🌐 中等问题修复验证:');

// 3. 国际化支持
checkFileContains('./src/modules/videoStream.ts', "import i18n from './i18n.js'", '国际化模块导入');
checkFileContains('./src/modules/videoStream.ts', "i18n.t('video.", '国际化文本调用');
checkFileContains('./src/modules/i18n.ts', 'video.error.permissionDenied', '视频错误翻译键');

// 4. DOM缓存优化
checkFileContains('./src/modules/videoStream.ts', 'elementCache', 'DOM元素缓存');
checkFileContains('./src/modules/videoStream.ts', 'getElement', 'DOM元素获取方法');

console.log('\n📱 响应式设计改进验证:');
checkFileContains('./src/styles/main.css', '@media (max-width: 360px)', '超小屏幕适配');
checkFileContains('./src/styles/main.css', 'touch-action: manipulation', '触摸设备优化');
checkFileContains('./src/styles/main.css', 'orientation: landscape', '横屏模式适配');

console.log('\n🧪 测试文件验证:');
checkFileContains('./src/tests/videoStream.test.ts', 'describe(', '测试套件');
checkFileContains('./src/tests/videoStream.test.ts', '事件监听器内存泄漏', '内存泄漏测试');
checkFileContains('./src/tests/videoStream.test.ts', '权限处理改进', '权限处理测试');

console.log('\n📊 代码质量检查:');

// 检查是否还有硬编码中文
const videoStreamContent = fs.readFileSync('./src/modules/videoStream.ts', 'utf8');
const hardcodedChinese = /['"`][\u4e00-\u9fff]+['"`]/.test(videoStreamContent);
console.log(`${hardcodedChinese ? '❌' : '✅'} 硬编码中文文本检查 ${hardcodedChinese ? '(仍有硬编码中文)' : '(已全部国际化)'}`);

// 检查是否有箭头函数事件监听器
const arrowFunctionListeners = videoStreamContent.includes('addEventListener(\'click\', () =>');
console.log(`${arrowFunctionListeners ? '❌' : '✅'} 箭头函数事件监听器检查 ${arrowFunctionListeners ? '(仍有箭头函数监听器)' : '(已修复)'}`);

console.log('\n📈 修复统计:');
const fixes = [
  { name: '事件监听器内存泄漏', fixed: !arrowFunctionListeners },
  { name: '权限处理不完善', fixed: videoStreamContent.includes('getLocalizedErrorMessage') },
  { name: '国际化硬编码', fixed: !hardcodedChinese },
  { name: 'DOM查询优化', fixed: videoStreamContent.includes('elementCache') },
  { name: '响应式设计', fixed: fs.readFileSync('./src/styles/main.css', 'utf8').includes('@media (max-width: 360px)') }
];

const fixedCount = fixes.filter(fix => fix.fixed).length;
console.log(`总计修复: ${fixedCount}/${fixes.length} 个问题`);

fixes.forEach(fix => {
  console.log(`  ${fix.fixed ? '✅' : '❌'} ${fix.name}`);
});

if (fixedCount === fixes.length) {
  console.log('\n🎉 所有问题已成功修复！');
} else {
  console.log('\n⚠️  仍有问题需要修复');
}

console.log('\n✨ 验证完成');
