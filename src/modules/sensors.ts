/**
 * 传感器数据接口
 */
export interface SensorData {
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    pitch: number;
    yaw: number;
    roll: number;
  };
  barometer: {
    pressure: number;
    altitude: number;
  };
  gps: {
    latitude: number;
    longitude: number;
    satellites: number;
  };
  timestamp: number;
}

/**
 * 传感器管理器类
 * 负责处理和显示传感器数据
 */
export class SensorManager {
  private sensorData: SensorData;
  private updateInterval: number | null = null;
  private onAccelerometerUpdate: ((x: number, y: number, z: number) => void) | null = null;
  private onGyroscopeUpdate: ((pitch: number, yaw: number, roll: number) => void) | null = null;
  private onBarometerUpdate: ((pressure: number, altitude: number) => void) | null = null;

  constructor() {
    // 初始化传感器数据
    this.sensorData = {
      accelerometer: { x: 0.02, y: 0.01, z: 1.00 },
      gyroscope: { pitch: 0.5, yaw: 1.2, roll: 0.3 },
      barometer: { pressure: 101.3, altitude: 0 },
      gps: { latitude: 39.9042, longitude: 116.4074, satellites: 8 },
      timestamp: Date.now()
    };

    // 初始化传感器校准按钮事件
    this.initCalibrationEvents();
  }

  /**
   * 设置加速度计数据更新回调
   * @param callback 数据更新时的回调函数
   */
  public setAccelerometerUpdateCallback(callback: (x: number, y: number, z: number) => void): void {
    this.onAccelerometerUpdate = callback;
  }

  /**
   * 设置陀螺仪数据更新回调
   * @param callback 数据更新时的回调函数
   */
  public setGyroscopeUpdateCallback(callback: (pitch: number, yaw: number, roll: number) => void): void {
    this.onGyroscopeUpdate = callback;
  }

  /**
   * 设置气压计数据更新回调
   * @param callback 数据更新时的回调函数
   */
  public setBarometerUpdateCallback(callback: (pressure: number, altitude: number) => void): void {
    this.onBarometerUpdate = callback;
  }

  /**
   * 初始化传感器校准按钮事件
   */
  private initCalibrationEvents(): void {
    // 获取所有校准按钮
    const calibrationButtons = document.querySelectorAll('.sensor-actions md-text-button');
    
    // 为每个按钮添加点击事件
    calibrationButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const sensorType = this.getSensorTypeFromButton(event.currentTarget as HTMLElement);
        this.calibrateSensor(sensorType);
      });
    });
  }

  /**
   * 根据按钮元素获取传感器类型
   * @param button 按钮元素
   * @returns 传感器类型
   */
  private getSensorTypeFromButton(button: HTMLElement): string {
    // 获取最近的卡片标题
    const cardHeader = button.closest('.dashboard-card')?.querySelector('.card-header h3');
    if (cardHeader) {
      return cardHeader.textContent?.toLowerCase() || '';
    }
    return '';
  }

  /**
   * 校准传感器
   * @param sensorType 传感器类型
   */
  public calibrateSensor(sensorType: string): void {
    console.log(`校准传感器: ${sensorType}`);
    
    // 显示校准中的提示
    alert(`正在校准${sensorType}，请保持设备静止...`);
    
    // 模拟校准过程
    setTimeout(() => {
      alert(`${sensorType}校准完成！`);
      
      // 根据传感器类型重置数据
      switch (sensorType) {
        case '加速度计':
          this.sensorData.accelerometer = { x: 0, y: 0, z: 1 };
          break;
        case '陀螺仪':
          this.sensorData.gyroscope = { pitch: 0, yaw: 0, roll: 0 };
          break;
        case '气压计':
          this.sensorData.barometer = { pressure: 101.3, altitude: 0 };
          break;
      }
      
      // 更新UI
      this.updateSensorUI();
    }, 2000);
  }

  /**
   * 更新传感器数据
   * @param data 新的传感器数据
   */
  public updateSensorData(data: Partial<SensorData>): void {
    // 深度合并数据
    if (data.accelerometer) {
      this.sensorData.accelerometer = {
        ...this.sensorData.accelerometer,
        ...data.accelerometer
      };
      
      // 调用加速度计更新回调
      if (this.onAccelerometerUpdate) {
        this.onAccelerometerUpdate(
          this.sensorData.accelerometer.x,
          this.sensorData.accelerometer.y,
          this.sensorData.accelerometer.z
        );
      }
    }
    
    if (data.gyroscope) {
      this.sensorData.gyroscope = {
        ...this.sensorData.gyroscope,
        ...data.gyroscope
      };
      
      // 调用陀螺仪更新回调
      if (this.onGyroscopeUpdate) {
        this.onGyroscopeUpdate(
          this.sensorData.gyroscope.pitch,
          this.sensorData.gyroscope.yaw,
          this.sensorData.gyroscope.roll
        );
      }
    }
    
    if (data.barometer) {
      this.sensorData.barometer = {
        ...this.sensorData.barometer,
        ...data.barometer
      };
      
      // 调用气压计更新回调
      if (this.onBarometerUpdate) {
        this.onBarometerUpdate(
          this.sensorData.barometer.pressure,
          this.sensorData.barometer.altitude
        );
      }
    }
    
    if (data.gps) {
      this.sensorData.gps = {
        ...this.sensorData.gps,
        ...data.gps
      };
    }
    
    this.sensorData.timestamp = Date.now();
    
    // 更新UI
    this.updateSensorUI();
  }

  /**
   * 更新传感器数据UI
   */
  private updateSensorUI(): void {
    // 更新加速度计数据
    const accelX = document.querySelector('#sensors-page .dashboard-card:nth-child(1) .sensor-axis:nth-child(1) .axis-value');
    const accelY = document.querySelector('#sensors-page .dashboard-card:nth-child(1) .sensor-axis:nth-child(2) .axis-value');
    const accelZ = document.querySelector('#sensors-page .dashboard-card:nth-child(1) .sensor-axis:nth-child(3) .axis-value');
    
    if (accelX && accelY && accelZ) {
      accelX.textContent = `${this.sensorData.accelerometer.x.toFixed(2)} g`;
      accelY.textContent = `${this.sensorData.accelerometer.y.toFixed(2)} g`;
      accelZ.textContent = `${this.sensorData.accelerometer.z.toFixed(2)} g`;
    }
    
    // 更新陀螺仪数据
    const gyroPitch = document.querySelector('#sensors-page .dashboard-card:nth-child(4) .sensor-axis:nth-child(1) .axis-value');
    const gyroYaw = document.querySelector('#sensors-page .dashboard-card:nth-child(4) .sensor-axis:nth-child(2) .axis-value');
    const gyroRoll = document.querySelector('#sensors-page .dashboard-card:nth-child(4) .sensor-axis:nth-child(3) .axis-value');
    
    if (gyroPitch && gyroYaw && gyroRoll) {
      gyroPitch.textContent = `${this.sensorData.gyroscope.pitch.toFixed(1)}°`;
      gyroYaw.textContent = `${this.sensorData.gyroscope.yaw.toFixed(1)}°`;
      gyroRoll.textContent = `${this.sensorData.gyroscope.roll.toFixed(1)}°`;
    }
    
    // 更新气压计数据
    const baroPressure = document.querySelector('#sensors-page .dashboard-card:nth-child(2) .sensor-reading:nth-child(1) .reading-value');
    const baroAltitude = document.querySelector('#sensors-page .dashboard-card:nth-child(2) .sensor-reading:nth-child(2) .reading-value');
    
    if (baroPressure && baroAltitude) {
      baroPressure.textContent = `${this.sensorData.barometer.pressure.toFixed(1)} kPa`;
      baroAltitude.textContent = `${this.sensorData.barometer.altitude.toFixed(1)} m`;
    }
    
    // 更新GPS数据
    const gpsLat = document.querySelector('#sensors-page .dashboard-card:nth-child(3) .sensor-reading:nth-child(1) .reading-value');
    const gpsLong = document.querySelector('#sensors-page .dashboard-card:nth-child(3) .sensor-reading:nth-child(2) .reading-value');
    const gpsSats = document.querySelector('#sensors-page .dashboard-card:nth-child(3) .sensor-reading:nth-child(3) .reading-value');
    
    if (gpsLat && gpsLong && gpsSats) {
      gpsLat.textContent = `${this.sensorData.gps.latitude.toFixed(4)}° N`;
      gpsLong.textContent = `${this.sensorData.gps.longitude.toFixed(4)}° E`;
      gpsSats.textContent = `${this.sensorData.gps.satellites}`;
    }
  }

  /**
   * 开始模拟传感器数据
   */
  public startSimulation(): void {
    if (this.updateInterval !== null) {
      return;
    }
    
    console.log('开始模拟传感器数据');
    
    // 每秒更新一次数据
    this.updateInterval = window.setInterval(() => {
      // 模拟小幅度随机变化
      this.updateSensorData({
        accelerometer: {
          x: this.sensorData.accelerometer.x + (Math.random() * 0.02 - 0.01),
          y: this.sensorData.accelerometer.y + (Math.random() * 0.02 - 0.01),
          z: this.sensorData.accelerometer.z + (Math.random() * 0.02 - 0.01)
        },
        gyroscope: {
          pitch: this.sensorData.gyroscope.pitch + (Math.random() * 0.4 - 0.2),
          yaw: this.sensorData.gyroscope.yaw + (Math.random() * 0.4 - 0.2),
          roll: this.sensorData.gyroscope.roll + (Math.random() * 0.4 - 0.2)
        },
        barometer: {
          pressure: this.sensorData.barometer.pressure + (Math.random() * 0.1 - 0.05),
          altitude: this.sensorData.barometer.altitude + (Math.random() * 0.2 - 0.1)
        }
      });
    }, 1000);
  }

  /**
   * 停止模拟传感器数据
   */
  public stopSimulation(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('停止模拟传感器数据');
    }
  }

  /**
   * 获取当前传感器数据
   * @returns 当前传感器数据
   */
  public getSensorData(): SensorData {
    return {...this.sensorData};
  }
}