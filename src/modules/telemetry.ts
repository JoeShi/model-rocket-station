/**
 * 遥测数据接口
 */
export interface TelemetryData {
  altitude: number;
  velocity: number;
  acceleration: number;
  temperature: number;
  timestamp: number;
}

/**
 * 遥测数据管理器类
 * 负责处理和显示遥测数据
 */
export class TelemetryManager {
  private telemetryData: TelemetryData;
  private telemetryHistory: TelemetryData[] = [];
  private simulationInterval: number | null = null;
  private isLaunched: boolean = false;
  private launchTime: number = 0;
  private onDataUpdate: ((data: TelemetryData) => void) | null = null;

  constructor() {
    // 初始化遥测数据
    this.telemetryData = {
      altitude: 0,
      velocity: 0,
      acceleration: 0,
      temperature: 21.3,
      timestamp: Date.now()
    };

    // 添加初始数据到历史记录
    this.telemetryHistory.push({...this.telemetryData});
  }

  /**
   * 设置数据更新回调
   * @param callback 数据更新时的回调函数
   */
  public setDataUpdateCallback(callback: (data: TelemetryData) => void): void {
    this.onDataUpdate = callback;
  }

  /**
   * 更新遥测数据
   * @param data 新的遥测数据
   */
  public updateTelemetry(data: Partial<TelemetryData>): void {
    // 更新数据
    this.telemetryData = {
      ...this.telemetryData,
      ...data,
      timestamp: Date.now()
    };

    // 添加到历史记录
    this.telemetryHistory.push({...this.telemetryData});

    // 限制历史记录长度
    if (this.telemetryHistory.length > 100) {
      this.telemetryHistory.shift();
    }

    // 更新UI
    this.updateTelemetryUI();
    
    // 调用数据更新回调
    if (this.onDataUpdate) {
      this.onDataUpdate(this.telemetryData);
    }
  }

  /**
   * 更新遥测数据UI
   */
  private updateTelemetryUI(): void {
    // 更新高度显示
    const altitudeElement = document.querySelector('.telemetry-item:nth-child(1) .telemetry-value');
    if (altitudeElement) {
      altitudeElement.textContent = this.telemetryData.altitude.toFixed(1);
    }

    // 更新速度显示
    const velocityElement = document.querySelector('.telemetry-item:nth-child(2) .telemetry-value');
    if (velocityElement) {
      velocityElement.textContent = this.telemetryData.velocity.toFixed(1);
    }

    // 更新加速度显示
    const accelerationElement = document.querySelector('.telemetry-item:nth-child(3) .telemetry-value');
    if (accelerationElement) {
      accelerationElement.textContent = this.telemetryData.acceleration.toFixed(1);
    }

    // 更新温度显示
    const temperatureElement = document.querySelector('.telemetry-item:nth-child(4) .telemetry-value');
    if (temperatureElement) {
      temperatureElement.textContent = this.telemetryData.temperature.toFixed(1);
    }
  }

  /**
   * 开始模拟遥测数据
   */
  public startSimulation(): void {
    if (this.simulationInterval !== null) {
      return;
    }

    console.log('开始模拟遥测数据');

    // 每秒更新一次数据
    this.simulationInterval = window.setInterval(() => {
      if (!this.isLaunched) {
        // 未发射状态，数据波动很小
        this.updateTelemetry({
          altitude: 0,
          velocity: 0,
          acceleration: 0,
          temperature: 21.3 + (Math.random() * 0.2 - 0.1)
        });
      } else {
        // 已发射状态，根据时间计算数据
        const elapsedTime = (Date.now() - this.launchTime) / 1000; // 秒
        
        // 简单的物理模型
        let altitude = 0;
        let velocity = 0;
        let acceleration = 0;
        
        if (elapsedTime < 10) {
          // 上升阶段
          acceleration = 20 - elapsedTime; // 加速度逐渐减小
          velocity = 20 * elapsedTime - 0.5 * elapsedTime * elapsedTime; // v = v0 + at
          altitude = 10 * elapsedTime * elapsedTime - (1/6) * elapsedTime * elapsedTime * elapsedTime; // s = s0 + v0t + 0.5at^2
        } else if (elapsedTime < 60) {
          // 下降阶段
          const fallTime = elapsedTime - 10;
          acceleration = -9.8;
          const maxHeight = 10 * 10 * 10 - (1/6) * 10 * 10 * 10; // 最高点高度
          const maxVelocity = 20 * 10 - 0.5 * 10 * 10; // 最高点速度
          
          velocity = maxVelocity - 9.8 * fallTime;
          altitude = maxHeight + maxVelocity * fallTime - 0.5 * 9.8 * fallTime * fallTime;
          
          if (altitude < 0) {
            altitude = 0;
            velocity = 0;
            acceleration = 0;
            this.isLaunched = false;
          }
        }
        
        this.updateTelemetry({
          altitude: Math.max(0, altitude),
          velocity: velocity,
          acceleration: acceleration,
          temperature: 21.3 + elapsedTime * 0.1
        });
      }
    }, 1000);
  }

  /**
   * 停止模拟遥测数据
   */
  public stopSimulation(): void {
    if (this.simulationInterval !== null) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
      console.log('停止模拟遥测数据');
    }
  }

  /**
   * 模拟火箭发射
   */
  public simulateLaunch(): void {
    this.isLaunched = true;
    this.launchTime = Date.now();
    console.log('模拟火箭发射');
    
    // 启用发射按钮
    const launchButton = document.querySelector('.launch-controls md-filled-tonal-button') as HTMLElement;
    if (launchButton) {
      launchButton.removeAttribute('disabled');
    }
  }

  /**
   * 获取当前遥测数据
   * @returns 当前遥测数据
   */
  public getTelemetryData(): TelemetryData {
    return {...this.telemetryData};
  }

  /**
   * 获取遥测数据历史
   * @returns 遥测数据历史数组
   */
  public getTelemetryHistory(): TelemetryData[] {
    return [...this.telemetryHistory];
  }
}