/**
 * 国际化模块
 * 负责处理多语言支持
 */

// 支持的语言
export type Language = 'zh-CN' | 'zh-TW' | 'en-US';

// 翻译字典接口
interface Translations {
  [key: string]: string;
}

// 语言数据
const translations: Record<Language, Translations> = {
  'zh-CN': {
    // 导航
    'nav.home': '首页',
    'nav.sensors': '传感器',
    'nav.settings': '设置',
    
    // 页面标题
    'page.home': '控制面板',
    'page.sensors': '传感器数据',
    'page.settings': '系统设置',
    
    // 连接
    'connection.connect': '连接设备',
    'connection.disconnect': '断开连接',
    'connection.connecting': '正在连接...',
    'connection.error': '连接失败',
    'home.disconnected': '未连接',
    'home.connecting': '正在连接',
    'home.connectionError': '连接错误',
    
    // 首页
    'home.status': '火箭状态',
    'home.ready': '就绪',
    'home.battery': '电池电量',
    'home.signal': '信号强度',
    'home.gpsLock': 'GPS锁定',
    'home.launch': '发射准备',
    'home.systemCheck': '系统自检',
    'home.sensorCalibration': '传感器校准',
    'home.launchAreaConfirm': '发射区域确认',
    'home.weatherCheck': '天气条件检查',
    'home.startCountdown': '开始倒计时',
    'home.telemetry': '遥测数据',
    'home.altitude': '高度',
    'home.speed': '速度',
    'home.acceleration': '加速度',
    'home.temperature': '温度',
    'home.videoStream': '视频流监控',
    
    // 传感器
    'sensors.accelerometer': '加速度计',
    'sensors.barometer': '气压计',
    'sensors.gps': 'GPS',
    'sensors.gyroscope': '陀螺仪',
    'sensors.calibrate': '校准',
    'sensors.xAxis': 'X轴',
    'sensors.yAxis': 'Y轴',
    'sensors.zAxis': 'Z轴',
    'sensors.pressure': '气压',
    'sensors.altitude': '高度',
    'sensors.latitude': '纬度',
    'sensors.longitude': '经度',
    'sensors.satellites': '卫星数',
    'sensors.pitch': '俯仰角',
    'sensors.yaw': '偏航角',
    'sensors.roll': '滚转角',
    
    // 设置
    'settings.connection': '连接设置',
    'settings.deviceId': '设备ID',
    'settings.connectionType': '连接类型',
    'settings.bluetooth': '蓝牙',
    'settings.wifi': 'Wi-Fi',
    'settings.radio': '无线电',
    'settings.telemetry': '遥测设置',
    'settings.rate': '更新频率',
    'settings.logging': '数据记录',
    'settings.launch': '发射设置',
    'settings.countdownTime': '倒计时时间',
    'settings.safetyChecks': '安全检查',
    'settings.save': '保存设置',
    'settings.reset': '重置设置',
    
    // 视频流
    'video.play': '播放',
    'video.pause': '暂停',
    'video.cameraSelect': '机位选择',
    'video.camera1': '机位 1',
    'video.camera2': '机位 2',
    'video.camera': '摄像头 {number}',
    'video.cameraPosition': '机位 {number}',
    'video.devicesFound': '发现摄像头设备',
    'video.devicesDetected': '已检测到摄像头设备',
    'video.deviceAccessError': '无法访问摄像头设备',
    'video.streamStarted': '视频流已启动',
    'video.streamStopped': '视频流已停止',
    'video.streamStartError': '启动视频流失败',
    'video.invalidCameraIndex': '无效的摄像头索引',
    'video.switchedToCamera': '切换到摄像头 {camera}',
    'video.status.playing': '正在播放机位 {camera}',
    'video.status.stopped': '视频流已停止',
    'video.error.browserNotSupported': '浏览器不支持摄像头功能，请使用现代浏览器',
    'video.error.permissionDenied': '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问',
    'video.error.noDevicesFound': '未找到摄像头设备，请检查设备连接',
    'video.error.deviceInUse': '摄像头设备正被其他应用使用，请关闭其他应用后重试',
    'video.error.constraintsNotSatisfied': '摄像头不支持请求的分辨率或帧率',
    'video.error.securityError': '安全错误，请确保在HTTPS环境下使用',
    'video.error.operationAborted': '操作被中止',
    'video.error.unknown': '未知错误',
    'video.error.noDevicesAvailable': '未找到可用的摄像头设备',
    
    // 语言
    'language': '语言',
    'language.zh-CN': '简体中文',
    'language.zh-TW': '繁體中文',
    'language.en-US': 'English'
  },
  
  'zh-TW': {
    // 導航
    'nav.home': '首頁',
    'nav.sensors': '傳感器',
    'nav.settings': '設置',
    
    // 頁面標題
    'page.home': '控制面板',
    'page.sensors': '傳感器數據',
    'page.settings': '系統設置',
    
    // 連接
    'connection.connect': '連接設備',
    'connection.disconnect': '斷開連接',
    'connection.connecting': '正在連接...',
    'connection.error': '連接失敗',
    'home.disconnected': '未連接',
    'home.connecting': '正在連接',
    'home.connectionError': '連接錯誤',
    
    // 首頁
    'home.status': '火箭狀態',
    'home.ready': '就緒',
    'home.battery': '電池電量',
    'home.signal': '信號強度',
    'home.gpsLock': 'GPS鎖定',
    'home.launch': '發射準備',
    'home.systemCheck': '系統自檢',
    'home.sensorCalibration': '傳感器校準',
    'home.launchAreaConfirm': '發射區域確認',
    'home.weatherCheck': '天氣條件檢查',
    'home.startCountdown': '開始倒計時',
    'home.telemetry': '遙測數據',
    'home.altitude': '高度',
    'home.speed': '速度',
    'home.acceleration': '加速度',
    'home.temperature': '溫度',
    'home.videoStream': '視頻流監控',
    
    // 傳感器
    'sensors.accelerometer': '加速度計',
    'sensors.barometer': '氣壓計',
    'sensors.gps': 'GPS',
    'sensors.gyroscope': '陀螺儀',
    'sensors.calibrate': '校準',
    'sensors.xAxis': 'X軸',
    'sensors.yAxis': 'Y軸',
    'sensors.zAxis': 'Z軸',
    'sensors.pressure': '氣壓',
    'sensors.altitude': '高度',
    'sensors.latitude': '緯度',
    'sensors.longitude': '經度',
    'sensors.satellites': '衛星數',
    'sensors.pitch': '俯仰角',
    'sensors.yaw': '偏航角',
    'sensors.roll': '滾轉角',
    
    // 設置
    'settings.connection': '連接設置',
    'settings.deviceId': '設備ID',
    'settings.connectionType': '連接類型',
    'settings.bluetooth': '藍牙',
    'settings.wifi': 'Wi-Fi',
    'settings.radio': '無線電',
    'settings.telemetry': '遙測設置',
    'settings.rate': '更新頻率',
    'settings.logging': '數據記錄',
    'settings.launch': '發射設置',
    'settings.countdownTime': '倒計時時間',
    'settings.safetyChecks': '安全檢查',
    'settings.save': '保存設置',
    'settings.reset': '重置設置',
    
    // 視頻流
    'video.play': '播放',
    'video.pause': '暫停',
    'video.cameraSelect': '機位選擇',
    'video.camera1': '機位 1',
    'video.camera2': '機位 2',
    'video.camera': '攝像頭 {number}',
    'video.cameraPosition': '機位 {number}',
    'video.devicesFound': '發現攝像頭設備',
    'video.devicesDetected': '已檢測到攝像頭設備',
    'video.deviceAccessError': '無法訪問攝像頭設備',
    'video.streamStarted': '視頻流已啟動',
    'video.streamStopped': '視頻流已停止',
    'video.streamStartError': '啟動視頻流失敗',
    'video.invalidCameraIndex': '無效的攝像頭索引',
    'video.switchedToCamera': '切換到攝像頭 {camera}',
    'video.status.playing': '正在播放機位 {camera}',
    'video.status.stopped': '視頻流已停止',
    'video.error.browserNotSupported': '瀏覽器不支持攝像頭功能，請使用現代瀏覽器',
    'video.error.permissionDenied': '攝像頭權限被拒絕，請在瀏覽器設置中允許攝像頭訪問',
    'video.error.noDevicesFound': '未找到攝像頭設備，請檢查設備連接',
    'video.error.deviceInUse': '攝像頭設備正被其他應用使用，請關閉其他應用後重試',
    'video.error.constraintsNotSatisfied': '攝像頭不支持請求的分辨率或幀率',
    'video.error.securityError': '安全錯誤，請確保在HTTPS環境下使用',
    'video.error.operationAborted': '操作被中止',
    'video.error.unknown': '未知錯誤',
    'video.error.noDevicesAvailable': '未找到可用的攝像頭設備',
    
    // 語言
    'language': '語言',
    'language.zh-CN': '简体中文',
    'language.zh-TW': '繁體中文',
    'language.en-US': 'English'
  },
  
  'en-US': {
    // Navigation
    'nav.home': 'Home',
    'nav.sensors': 'Sensors',
    'nav.settings': 'Settings',
    
    // Page titles
    'page.home': 'Control Panel',
    'page.sensors': 'Sensor Data',
    'page.settings': 'System Settings',
    
    // Connection
    'connection.connect': 'Connect Device',
    'connection.disconnect': 'Disconnect',
    'connection.connecting': 'Connecting...',
    'connection.error': 'Connection Failed',
    'home.disconnected': 'Disconnected',
    'home.connecting': 'Connecting',
    'home.connectionError': 'Connection Error',
    
    // Home page
    'home.status': 'Rocket Status',
    'home.ready': 'Ready',
    'home.battery': 'Battery',
    'home.signal': 'Signal Strength',
    'home.gpsLock': 'GPS Lock',
    'home.launch': 'Launch Preparation',
    'home.systemCheck': 'System Check',
    'home.sensorCalibration': 'Sensor Calibration',
    'home.launchAreaConfirm': 'Launch Area Confirmation',
    'home.weatherCheck': 'Weather Conditions Check',
    'home.startCountdown': 'Start Countdown',
    'home.telemetry': 'Telemetry Data',
    'home.altitude': 'Altitude',
    'home.speed': 'Speed',
    'home.acceleration': 'Acceleration',
    'home.temperature': 'Temperature',
    'home.videoStream': 'Video Stream Monitor',
    
    // Sensors
    'sensors.accelerometer': 'Accelerometer',
    'sensors.barometer': 'Barometer',
    'sensors.gps': 'GPS',
    'sensors.gyroscope': 'Gyroscope',
    'sensors.calibrate': 'Calibrate',
    'sensors.xAxis': 'X-Axis',
    'sensors.yAxis': 'Y-Axis',
    'sensors.zAxis': 'Z-Axis',
    'sensors.pressure': 'Pressure',
    'sensors.altitude': 'Altitude',
    'sensors.latitude': 'Latitude',
    'sensors.longitude': 'Longitude',
    'sensors.satellites': 'Satellites',
    'sensors.pitch': 'Pitch',
    'sensors.yaw': 'Yaw',
    'sensors.roll': 'Roll',
    
    // Settings
    'settings.connection': 'Connection Settings',
    'settings.deviceId': 'Device ID',
    'settings.connectionType': 'Connection Type',
    'settings.bluetooth': 'Bluetooth',
    'settings.wifi': 'Wi-Fi',
    'settings.radio': 'Radio',
    'settings.telemetry': 'Telemetry Settings',
    'settings.rate': 'Update Rate',
    'settings.logging': 'Data Logging',
    'settings.launch': 'Launch Settings',
    'settings.countdownTime': 'Countdown Time',
    'settings.safetyChecks': 'Safety Checks',
    'settings.save': 'Save Settings',
    'settings.reset': 'Reset Settings',
    
    // Video Stream
    'video.play': 'Play',
    'video.pause': 'Pause',
    'video.cameraSelect': 'Camera Selection',
    'video.camera1': 'Camera 1',
    'video.camera2': 'Camera 2',
    'video.camera': 'Camera {number}',
    'video.cameraPosition': 'Position {number}',
    'video.devicesFound': 'Camera devices found',
    'video.devicesDetected': 'Camera devices detected',
    'video.deviceAccessError': 'Unable to access camera devices',
    'video.streamStarted': 'Video stream started',
    'video.streamStopped': 'Video stream stopped',
    'video.streamStartError': 'Failed to start video stream',
    'video.invalidCameraIndex': 'Invalid camera index',
    'video.switchedToCamera': 'Switched to camera {camera}',
    'video.status.playing': 'Playing camera {camera}',
    'video.status.stopped': 'Video stream stopped',
    'video.error.browserNotSupported': 'Browser does not support camera functionality, please use a modern browser',
    'video.error.permissionDenied': 'Camera permission denied, please allow camera access in browser settings',
    'video.error.noDevicesFound': 'No camera devices found, please check device connection',
    'video.error.deviceInUse': 'Camera device is being used by another application, please close other apps and try again',
    'video.error.constraintsNotSatisfied': 'Camera does not support the requested resolution or frame rate',
    'video.error.securityError': 'Security error, please ensure using HTTPS environment',
    'video.error.operationAborted': 'Operation aborted',
    'video.error.unknown': 'Unknown error',
    'video.error.noDevicesAvailable': 'No camera devices available',
    
    // Language
    'language': 'Language',
    'language.zh-CN': '简体中文',
    'language.zh-TW': '繁體中文',
    'language.en-US': 'English'
  }
};

/**
 * 国际化管理器类
 */
export class I18nManager {
  private currentLanguage: Language;
  private onLanguageChange: ((lang: Language) => void) | null = null;

  constructor() {
    // 尝试从本地存储加载语言设置
    const savedLanguage = localStorage.getItem('rocketLanguage') as Language;
    this.currentLanguage = savedLanguage || 'zh-CN';
  }

  /**
   * 获取翻译文本
   * @param key 翻译键
   * @param params 参数对象，用于替换模板中的占位符
   * @returns 翻译后的文本
   */
  public t(key: string, params?: Record<string, string | number>): string {
    let text = translations[this.currentLanguage][key] || key;
    
    // 如果有参数，进行模板替换
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const placeholder = `{${paramKey}}`;
        text = text.replace(new RegExp(placeholder, 'g'), String(params[paramKey]));
      });
    }
    
    return text;
  }

  /**
   * 切换语言
   * @param language 目标语言
   */
  public setLanguage(language: Language): void {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      localStorage.setItem('rocketLanguage', language);
      
      // 触发语言变更回调
      if (this.onLanguageChange) {
        this.onLanguageChange(language);
      }
      
      // 更新页面文本
      this.updatePageText();
    }
  }

  /**
   * 获取当前语言
   * @returns 当前语言代码
   */
  public getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * 设置语言变更回调
   * @param callback 语言变更时的回调函数
   */
  public setLanguageChangeCallback(callback: (lang: Language) => void): void {
    this.onLanguageChange = callback;
  }

  /**
   * 更新页面上的所有文本
   */
  public updatePageText(): void {
    // 更新所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = this.t(key);
      }
    });

    // 更新页面标题
    document.title = this.t('page.home') + ' - ' + this.t('home.status');
    
    // 更新HTML语言属性
    document.documentElement.lang = this.currentLanguage;
  }

  /**
   * 初始化语言选择器
   */
  public initLanguageSelector(): void {
    // 创建语言选择器
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      // 创建语言选择器容器
      const langSelector = document.createElement('div');
      langSelector.className = 'language-selector';
      
      // 创建下拉菜单
      const select = document.createElement('select');
      select.id = 'language-select';
      
      // 添加语言选项
      const languages: Language[] = ['zh-CN', 'zh-TW', 'en-US'];
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = this.t(`language.${lang}`);
        option.selected = lang === this.currentLanguage;
        select.appendChild(option);
      });
      
      // 添加变更事件
      select.addEventListener('change', () => {
        this.setLanguage(select.value as Language);
      });
      
      // 添加标签
      const label = document.createElement('span');
      label.className = 'language-label';
      label.setAttribute('data-i18n', 'language');
      label.textContent = this.t('language');
      
      // 组装语言选择器
      langSelector.appendChild(label);
      langSelector.appendChild(select);
      
      // 插入到页面
      headerActions.insertBefore(langSelector, headerActions.firstChild);
    }
  }
}

// 创建单例实例
const i18n = new I18nManager();
export default i18n;