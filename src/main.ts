// 导入 Material Web 组件
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/text-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/icon/icon.js';
import '@material/web/switch/switch.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';

// 导入自定义模块
import { NavigationManager } from './modules/navigation';
import { TelemetryManager } from './modules/telemetry';
import { SensorManager } from './modules/sensors';
import { SettingsManager } from './modules/settings';
import { ConnectionManager } from './modules/connection';
import { ChartManager } from './modules/charts';

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('模型火箭控制站应用已加载');
  
  // 初始化导航管理器
  const navigationManager = new NavigationManager();
  
  // 初始化图表管理器
  const chartManager = new ChartManager();
  
  // 初始化遥测数据管理器
  const telemetryManager = new TelemetryManager();
  
  // 初始化传感器管理器
  const sensorManager = new SensorManager();
  
  // 初始化设置管理器
  const settingsManager = new SettingsManager();
  
  // 初始化连接管理器
  const connectionManager = new ConnectionManager();
  
  // 设置连接按钮事件
  const connectButton = document.getElementById('connect-button');
  if (connectButton) {
    connectButton.addEventListener('click', () => {
      connectionManager.toggleConnection();
    });
  }
  
  // 设置保存设置按钮事件
  const saveSettingsButton = document.getElementById('save-settings');
  if (saveSettingsButton) {
    saveSettingsButton.addEventListener('click', () => {
      settingsManager.saveSettings();
    });
  }
  
  // 设置重置设置按钮事件
  const resetSettingsButton = document.getElementById('reset-settings');
  if (resetSettingsButton) {
    resetSettingsButton.addEventListener('click', () => {
      settingsManager.resetSettings();
    });
  }
  
  // 设置发射按钮事件
  const launchButton = document.querySelector('.launch-controls md-filled-tonal-button');
  if (launchButton) {
    launchButton.addEventListener('click', () => {
      if (confirm('确定要开始发射倒计时吗？')) {
        startLaunchCountdown();
      }
    });
  }
  
  // 初始化图表
  chartManager.initCharts();
  
  // 设置数据更新回调
  telemetryManager.setDataUpdateCallback((data) => {
    chartManager.updateTelemetryChart(data);
  });
  
  sensorManager.setAccelerometerUpdateCallback((x, y, z) => {
    chartManager.updateAccelerometerChart(x, y, z);
  });
  
  sensorManager.setGyroscopeUpdateCallback((pitch, yaw, roll) => {
    chartManager.updateGyroscopeChart(pitch, yaw, roll);
  });
  
  // 模拟遥测数据更新
  telemetryManager.startSimulation();
  
  // 模拟传感器数据更新
  sensorManager.startSimulation();
  
  /**
   * 开始发射倒计时
   */
  function startLaunchCountdown(): void {
    const countdownTime = parseInt((document.getElementById('countdown-time') as HTMLInputElement)?.value || '10');
    let remainingTime = countdownTime;
    
    // 创建倒计时元素
    const countdownOverlay = document.createElement('div');
    countdownOverlay.className = 'countdown-overlay';
    
    const countdownContent = document.createElement('div');
    countdownContent.className = 'countdown-content';
    
    const countdownTitle = document.createElement('h2');
    countdownTitle.textContent = '发射倒计时';
    
    const countdownTimer = document.createElement('div');
    countdownTimer.className = 'countdown-timer';
    countdownTimer.textContent = remainingTime.toString();
    
    const countdownAbort = document.createElement('md-filled-button');
    countdownAbort.textContent = '中止发射';
    countdownAbort.addEventListener('click', () => {
      clearInterval(countdownInterval);
      document.body.removeChild(countdownOverlay);
      alert('发射已中止');
    });
    
    countdownContent.appendChild(countdownTitle);
    countdownContent.appendChild(countdownTimer);
    countdownContent.appendChild(countdownAbort);
    countdownOverlay.appendChild(countdownContent);
    document.body.appendChild(countdownOverlay);
    
    // 开始倒计时
    const countdownInterval = setInterval(() => {
      remainingTime--;
      countdownTimer.textContent = remainingTime.toString();
      
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        document.body.removeChild(countdownOverlay);
        
        // 模拟火箭发射
        telemetryManager.simulateLaunch();
        
        // 显示发射成功消息
        alert('火箭发射成功！');
      }
    }, 1000);
  }
});