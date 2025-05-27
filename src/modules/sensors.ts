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
 * 模拟状态枚举
 */
export enum SimulationState {
  IDLE = 'IDLE',           // 静止状态
  PRE_LAUNCH = 'PRE_LAUNCH', // 发射前准备
  LAUNCH = 'LAUNCH',       // 发射状态
  ASCENT = 'ASCENT',       // 上升状态
  APOGEE = 'APOGEE',       // 最高点
  DESCENT = 'DESCENT',     // 下降状态
  LANDING = 'LANDING',     // 着陆状态
  POST_LANDING = 'POST_LANDING' // 着陆后
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
  
  // 模拟状态相关属性
  private simulationState: SimulationState = SimulationState.IDLE;
  private simulationTime: number = 0;
  private simulationStartTime: number = 0;
  private launchTime: number | null = null;
  private maxAltitude: number = 500; // 最大高度（米）
  private seaLevelPressure: number = 101.325; // 海平面标准气压 (kPa)
  private pressureScaleHeight: number = 8400; // 气压标高（米）
  
  // 振动和噪声模拟参数
  private vibrationAmplitude: number = 0.01;
  private turbulenceIntensity: number = 0;

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
   * 设置模拟状态
   * @param state 新的模拟状态
   */
  public setSimulationState(state: SimulationState): void {
    console.log(`模拟状态变更: ${this.simulationState} -> ${state}`);
    this.simulationState = state;
    
    // 如果是发射状态，记录发射时间
    if (state === SimulationState.LAUNCH) {
      this.launchTime = Date.now();
      this.simulationStartTime = Date.now();
      this.simulationTime = 0;
    }
    
    // 根据状态调整振动和湍流强度
    switch (state) {
      case SimulationState.IDLE:
        this.vibrationAmplitude = 0.01;
        this.turbulenceIntensity = 0;
        break;
      case SimulationState.PRE_LAUNCH:
        this.vibrationAmplitude = 0.03;
        this.turbulenceIntensity = 0;
        break;
      case SimulationState.LAUNCH:
        this.vibrationAmplitude = 0.2;
        this.turbulenceIntensity = 0.05;
        break;
      case SimulationState.ASCENT:
        this.vibrationAmplitude = 0.1;
        this.turbulenceIntensity = 0.1;
        break;
      case SimulationState.APOGEE:
        this.vibrationAmplitude = 0.05;
        this.turbulenceIntensity = 0.02;
        break;
      case SimulationState.DESCENT:
        this.vibrationAmplitude = 0.08;
        this.turbulenceIntensity = 0.15;
        break;
      case SimulationState.LANDING:
        this.vibrationAmplitude = 0.3;
        this.turbulenceIntensity = 0.05;
        break;
      case SimulationState.POST_LANDING:
        this.vibrationAmplitude = 0.01;
        this.turbulenceIntensity = 0;
        break;
    }
  }
  
  /**
   * 获取当前模拟状态
   * @returns 当前模拟状态
   */
  public getSimulationState(): SimulationState {
    return this.simulationState;
  }
  
  /**
   * 模拟火箭发射
   */
  public simulateLaunch(): void {
    this.setSimulationState(SimulationState.PRE_LAUNCH);
    
    // 3秒后开始发射
    setTimeout(() => {
      this.setSimulationState(SimulationState.LAUNCH);
    }, 3000);
  }
  
  /**
   * 计算基于高度的气压值
   * @param altitude 高度（米）
   * @returns 气压值（kPa）
   */
  private calculatePressureFromAltitude(altitude: number): number {
    // 使用气压公式: P = P0 * exp(-h/H)
    // P0 是海平面气压，h是高度，H是气压标高
    return this.seaLevelPressure * Math.exp(-altitude / this.pressureScaleHeight);
  }
  
  /**
   * 生成加速度计数据
   * @returns 加速度计数据对象
   */
  private generateAccelerometerData(): {x: number, y: number, z: number} {
    // 基础振动 - 所有状态都有的随机振动
    const baseNoiseX = (Math.random() * 2 - 1) * this.vibrationAmplitude;
    const baseNoiseY = (Math.random() * 2 - 1) * this.vibrationAmplitude;
    const baseNoiseZ = (Math.random() * 2 - 1) * this.vibrationAmplitude;
    
    // 默认值（静止状态）
    let x = baseNoiseX;
    let y = baseNoiseY;
    let z = 1.0 + baseNoiseZ; // Z轴默认为1g（地球重力）
    
    // 根据不同状态生成不同的加速度数据
    switch (this.simulationState) {
      case SimulationState.IDLE:
        // 静止状态，只有微小振动
        break;
        
      case SimulationState.PRE_LAUNCH:
        // 发射前，发动机预热，有轻微振动
        x += 0.05 * Math.sin(this.simulationTime * 10);
        y += 0.05 * Math.cos(this.simulationTime * 12);
        z += 0.03 * Math.sin(this.simulationTime * 15);
        break;
        
      case SimulationState.LAUNCH:
        // 发射状态，Z轴加速度急剧增加
        z += 5.0 + 3.0 * Math.random(); // 5-8g的加速度
        x += 0.3 * Math.sin(this.simulationTime * 20); // 较大的横向振动
        y += 0.3 * Math.cos(this.simulationTime * 22);
        break;
        
      case SimulationState.ASCENT:
        // 上升状态，Z轴保持较高加速度，但逐渐降低
        const ascentProgress = Math.min(this.simulationTime / 10, 1); // 0-1之间的上升进度
        z += 3.0 * (1 - ascentProgress) + 0.5; // 从3.5g降至1.5g
        
        // 添加一些湍流和振动
        x += this.turbulenceIntensity * Math.sin(this.simulationTime * 5);
        y += this.turbulenceIntensity * Math.cos(this.simulationTime * 7);
        break;
        
      case SimulationState.APOGEE:
        // 最高点，接近失重状态
        z = 0.1 + baseNoiseZ; // 接近失重
        x += 0.1 * Math.sin(this.simulationTime * 3);
        y += 0.1 * Math.cos(this.simulationTime * 4);
        break;
        
      case SimulationState.DESCENT:
        // 下降状态，有降落伞减速，Z轴加速度小于1g
        z = 0.7 + 0.2 * Math.sin(this.simulationTime) + baseNoiseZ;
        
        // 添加降落伞摆动效果
        x += 0.3 * Math.sin(this.simulationTime * 0.8);
        y += 0.3 * Math.cos(this.simulationTime * 0.7);
        break;
        
      case SimulationState.LANDING:
        // 着陆状态，短暂的冲击加速度
        const landingProgress = Math.min(this.simulationTime / 2, 1); // 0-1之间的着陆进度
        if (landingProgress < 0.2) {
          // 着陆冲击
          z = 3.0 * (1 - landingProgress * 5) + 1.0;
          x += 0.5 * Math.sin(this.simulationTime * 30);
          y += 0.5 * Math.cos(this.simulationTime * 30);
        } else {
          // 着陆后振动衰减
          z = 1.0 + 0.5 * Math.exp(-landingProgress * 5) * Math.sin(this.simulationTime * 10);
          x += 0.3 * Math.exp(-landingProgress * 5) * Math.sin(this.simulationTime * 15);
          y += 0.3 * Math.exp(-landingProgress * 5) * Math.cos(this.simulationTime * 15);
        }
        break;
        
      case SimulationState.POST_LANDING:
        // 着陆后，恢复正常重力，微小振动
        break;
    }
    
    return { x, y, z };
  }
  
  /**
   * 生成气压计数据
   * @returns 气压计数据对象
   */
  private generateBarometerData(): {pressure: number, altitude: number} {
    // 根据当前模拟状态计算高度
    let altitude = 0;
    
    switch (this.simulationState) {
      case SimulationState.IDLE:
      case SimulationState.PRE_LAUNCH:
      case SimulationState.POST_LANDING:
        // 地面高度，添加微小波动
        altitude = 0 + (Math.random() * 0.2 - 0.1);
        break;
        
      case SimulationState.LAUNCH:
        // 发射初始阶段，高度开始增加
        altitude = Math.min(this.simulationTime * this.simulationTime * 2, 50); // 二次曲线上升
        break;
        
      case SimulationState.ASCENT:
        // 上升阶段，高度快速增加
        const ascentDuration = 20; // 上升持续20秒
        const ascentProgress = Math.min(this.simulationTime / ascentDuration, 1);
        altitude = this.maxAltitude * Math.pow(ascentProgress, 0.8); // 非线性上升曲线
        
        // 添加一些湍流波动
        altitude += (Math.random() * 2 - 1) * this.turbulenceIntensity * 10;
        break;
        
      case SimulationState.APOGEE:
        // 最高点，高度接近最大值并有微小波动
        altitude = this.maxAltitude + (Math.random() * 2 - 1) * 5;
        break;
        
      case SimulationState.DESCENT:
        // 下降阶段，高度逐渐减小
        const descentStart = this.maxAltitude;
        const descentDuration = 40; // 下降持续40秒
        const descentProgress = Math.min(this.simulationTime / descentDuration, 1);
        
        // 使用平方根函数模拟降落伞减速下降
        altitude = descentStart * (1 - Math.pow(descentProgress, 0.5));
        
        // 添加降落伞摆动引起的高度波动
        altitude += 5 * Math.sin(this.simulationTime * 0.5);
        break;
        
      case SimulationState.LANDING:
        // 着陆阶段，高度接近0
        const landingProgress = Math.min(this.simulationTime / 2, 1);
        altitude = 10 * (1 - landingProgress);
        break;
    }
    
    // 确保高度不为负
    altitude = Math.max(0, altitude);
    
    // 根据高度计算气压
    const pressure = this.calculatePressureFromAltitude(altitude);
    
    // 添加一些随机波动模拟气压传感器噪声
    const pressureNoise = (Math.random() * 0.1 - 0.05);
    
    return {
      pressure: pressure + pressureNoise,
      altitude: altitude
    };
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
    
    // 记录模拟开始时间
    this.simulationStartTime = Date.now();
    this.simulationTime = 0;
    
    // 更频繁地更新数据，使图表更平滑（200毫秒一次）
    this.updateInterval = window.setInterval(() => {
      // 更新模拟时间（秒）
      this.simulationTime = (Date.now() - this.simulationStartTime) / 1000;
      
      // 根据当前状态生成传感器数据
      const accelData = this.generateAccelerometerData();
      const baroData = this.generateBarometerData();
      
      // 更新传感器数据
      this.updateSensorData({
        accelerometer: accelData,
        barometer: baroData,
        gyroscope: {
          // 陀螺仪数据也可以根据状态生成更真实的数据
          pitch: this.sensorData.gyroscope.pitch + (Math.random() * 0.4 - 0.2),
          yaw: this.sensorData.gyroscope.yaw + (Math.random() * 0.4 - 0.2),
          roll: this.sensorData.gyroscope.roll + (Math.random() * 0.4 - 0.2)
        }
      });
      
      // 根据模拟时间和当前状态，自动转换状态
      this.updateSimulationState();
      
    }, 200); // 200毫秒更新一次
  }
  
  /**
   * 根据模拟时间更新模拟状态
   */
  private updateSimulationState(): void {
    // 只有在发射后才进行状态自动转换
    if (this.launchTime === null) {
      return;
    }
    
    const elapsedSinceLaunch = (Date.now() - this.launchTime) / 1000; // 秒
    
    // 状态转换逻辑
    switch (this.simulationState) {
      case SimulationState.LAUNCH:
        if (elapsedSinceLaunch > 3) {
          this.setSimulationState(SimulationState.ASCENT);
          this.simulationStartTime = Date.now();
          this.simulationTime = 0;
        }
        break;
        
      case SimulationState.ASCENT:
        if (this.simulationTime > 20) { // 上升20秒后到达最高点
          this.setSimulationState(SimulationState.APOGEE);
          this.simulationStartTime = Date.now();
          this.simulationTime = 0;
        }
        break;
        
      case SimulationState.APOGEE:
        if (this.simulationTime > 5) { // 在最高点停留5秒
          this.setSimulationState(SimulationState.DESCENT);
          this.simulationStartTime = Date.now();
          this.simulationTime = 0;
        }
        break;
        
      case SimulationState.DESCENT:
        if (this.simulationTime > 40) { // 下降40秒
          this.setSimulationState(SimulationState.LANDING);
          this.simulationStartTime = Date.now();
          this.simulationTime = 0;
        }
        break;
        
      case SimulationState.LANDING:
        if (this.simulationTime > 3) { // 着陆过程3秒
          this.setSimulationState(SimulationState.POST_LANDING);
          this.simulationStartTime = Date.now();
          this.simulationTime = 0;
          
          // 重置发射时间，表示发射结束
          this.launchTime = null;
        }
        break;
    }
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