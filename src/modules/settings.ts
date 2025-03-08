/**
 * 设置接口
 */
interface Settings {
  connection: {
    deviceId: string;
    connectionType: 'bluetooth' | 'wifi' | 'radio';
  };
  telemetry: {
    rate: number;
    logging: boolean;
  };
  launch: {
    countdownTime: number;
    safetyChecks: boolean;
  };
}

/**
 * 设置管理器类
 * 负责处理系统设置
 */
export class SettingsManager {
  private settings: Settings;
  private defaultSettings: Settings;

  constructor() {
    // 默认设置
    this.defaultSettings = {
      connection: {
        deviceId: 'ROCKET-001',
        connectionType: 'bluetooth'
      },
      telemetry: {
        rate: 10,
        logging: true
      },
      launch: {
        countdownTime: 10,
        safetyChecks: true
      }
    };

    // 尝试从本地存储加载设置
    const savedSettings = localStorage.getItem('rocketSettings');
    if (savedSettings) {
      try {
        this.settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error('无法解析保存的设置，使用默认设置', e);
        this.settings = {...this.defaultSettings};
      }
    } else {
      // 使用默认设置
      this.settings = {...this.defaultSettings};
    }

    // 初始化设置UI
    this.updateSettingsUI();
  }

  /**
   * 更新设置UI
   */
  private updateSettingsUI(): void {
    // 设备ID
    const deviceIdField = document.getElementById('device-id') as HTMLInputElement;
    if (deviceIdField) {
      deviceIdField.value = this.settings.connection.deviceId;
    }

    // 连接类型
    const connectionTypeSelect = document.getElementById('connection-type') as HTMLSelectElement;
    if (connectionTypeSelect) {
      connectionTypeSelect.value = this.settings.connection.connectionType;
    }

    // 遥测频率
    const telemetryRateField = document.getElementById('telemetry-rate') as HTMLInputElement;
    if (telemetryRateField) {
      telemetryRateField.value = this.settings.telemetry.rate.toString();
    }

    // 数据记录
    const dataLoggingSwitch = document.getElementById('data-logging') as HTMLInputElement;
    if (dataLoggingSwitch) {
      dataLoggingSwitch.checked = this.settings.telemetry.logging;
    }

    // 倒计时时间
    const countdownTimeField = document.getElementById('countdown-time') as HTMLInputElement;
    if (countdownTimeField) {
      countdownTimeField.value = this.settings.launch.countdownTime.toString();
    }

    // 安全检查
    const safetyChecksSwitch = document.getElementById('safety-checks') as HTMLInputElement;
    if (safetyChecksSwitch) {
      safetyChecksSwitch.checked = this.settings.launch.safetyChecks;
    }
  }

  /**
   * 从UI读取设置
   */
  private readSettingsFromUI(): Settings {
    const settings = {...this.settings};

    // 设备ID
    const deviceIdField = document.getElementById('device-id') as HTMLInputElement;
    if (deviceIdField) {
      settings.connection.deviceId = deviceIdField.value;
    }

    // 连接类型
    const connectionTypeSelect = document.getElementById('connection-type') as HTMLSelectElement;
    if (connectionTypeSelect) {
      settings.connection.connectionType = connectionTypeSelect.value as 'bluetooth' | 'wifi' | 'radio';
    }

    // 遥测频率
    const telemetryRateField = document.getElementById('telemetry-rate') as HTMLInputElement;
    if (telemetryRateField) {
      settings.telemetry.rate = parseInt(telemetryRateField.value) || 10;
    }

    // 数据记录
    const dataLoggingSwitch = document.getElementById('data-logging') as HTMLInputElement;
    if (dataLoggingSwitch) {
      settings.telemetry.logging = dataLoggingSwitch.checked;
    }

    // 倒计时时间
    const countdownTimeField = document.getElementById('countdown-time') as HTMLInputElement;
    if (countdownTimeField) {
      settings.launch.countdownTime = parseInt(countdownTimeField.value) || 10;
    }

    // 安全检查
    const safetyChecksSwitch = document.getElementById('safety-checks') as HTMLInputElement;
    if (safetyChecksSwitch) {
      settings.launch.safetyChecks = safetyChecksSwitch.checked;
    }

    return settings;
  }

  /**
   * 保存设置
   */
  public saveSettings(): void {
    // 从UI读取设置
    this.settings = this.readSettingsFromUI();

    // 保存到本地存储
    localStorage.setItem('rocketSettings', JSON.stringify(this.settings));

    console.log('设置已保存', this.settings);
    alert('设置已保存');
  }

  /**
   * 重置设置
   */
  public resetSettings(): void {
    // 重置为默认设置
    this.settings = {...this.defaultSettings};

    // 更新UI
    this.updateSettingsUI();

    // 保存到本地存储
    localStorage.setItem('rocketSettings', JSON.stringify(this.settings));

    console.log('设置已重置为默认值');
    alert('设置已重置为默认值');
  }

  /**
   * 获取当前设置
   * @returns 当前设置
   */
  public getSettings(): Settings {
    return {...this.settings};
  }
}