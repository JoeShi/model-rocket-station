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
   * @returns 翻译后的文本
   */
  public t(key: string): string {
    return translations[this.currentLanguage][key] || key;
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