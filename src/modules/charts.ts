import * as echarts from 'echarts';
import { TelemetryData } from './telemetry';

/**
 * 图表管理器类
 * 负责创建和更新各种数据可视化图表
 */
export class ChartManager {
  private telemetryChart: echarts.ECharts | null = null;
  private accelerometerChart: echarts.ECharts | null = null;
  private gyroscopeChart: echarts.ECharts | null = null;
  private altitudeChart: echarts.ECharts | null = null;
  
  // 存储历史数据
  private timeData: string[] = [];
  private altitudeData: number[] = [];
  private velocityData: number[] = [];
  private accelerationData: number[] = [];
  private temperatureData: number[] = [];
  
  // 加速度计数据
  private accelXData: number[] = [];
  private accelYData: number[] = [];
  private accelZData: number[] = [];
  
  // 陀螺仪数据
  private gyroPitchData: number[] = [];
  private gyroYawData: number[] = [];
  private gyroRollData: number[] = [];
  
  constructor() {
    // 初始化时间轴数据（最近30个数据点）
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const time = new Date(now.getTime() - (29 - i) * 1000);
      this.timeData.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // 初始化所有数据为0
      this.altitudeData.push(0);
      this.velocityData.push(0);
      this.accelerationData.push(0);
      this.temperatureData.push(20 + Math.random());
      
      this.accelXData.push(0);
      this.accelYData.push(0);
      this.accelZData.push(1);
      
      this.gyroPitchData.push(0);
      this.gyroYawData.push(0);
      this.gyroRollData.push(0);
    }
  }
  
  /**
   * 初始化所有图表
   */
  public initCharts(): void {
    this.initTelemetryChart();
    this.initAccelerometerChart();
    this.initGyroscopeChart();
    this.initAltitudeChart();
    
    // 设置图表响应式
    window.addEventListener('resize', () => {
      this.telemetryChart?.resize();
      this.accelerometerChart?.resize();
      this.gyroscopeChart?.resize();
      this.altitudeChart?.resize();
    });
  }
  
  /**
   * 初始化遥测数据图表
   */
  private initTelemetryChart(): void {
    const chartDom = document.getElementById('telemetry-chart');
    if (!chartDom) return;
    
    // 清除占位文本
    chartDom.innerHTML = '';
    
    this.telemetryChart = echarts.init(chartDom);
    
    const option: echarts.EChartsOption = {
      title: {
        text: '实时遥测数据',
        left: 'center',
        textStyle: {
          fontSize: 14,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['高度 (m)', '速度 (m/s)', '加速度 (m/s²)'],
        bottom: '0%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.timeData,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '高度 (m)',
          type: 'line',
          data: this.altitudeData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: '速度 (m/s)',
          type: 'line',
          data: this.velocityData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          }
        },
        {
          name: '加速度 (m/s²)',
          type: 'line',
          data: this.accelerationData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          }
        }
      ]
    };
    
    this.telemetryChart.setOption(option);
  }
  
  /**
   * 初始化加速度计图表
   */
  private initAccelerometerChart(): void {
    const chartDom = document.getElementById('accelerometer-chart');
    if (!chartDom) return;
    
    this.accelerometerChart = echarts.init(chartDom);
    
    const option: echarts.EChartsOption = {
      title: {
        text: '加速度数据',
        left: 'center',
        textStyle: {
          fontSize: 14,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['X轴', 'Y轴', 'Z轴'],
        bottom: '0%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.timeData,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: 'g',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'X轴',
          type: 'line',
          data: this.accelXData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#ff4d4f'
          }
        },
        {
          name: 'Y轴',
          type: 'line',
          data: this.accelYData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#52c41a'
          }
        },
        {
          name: 'Z轴',
          type: 'line',
          data: this.accelZData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#1890ff'
          }
        }
      ]
    };
    
    this.accelerometerChart.setOption(option);
  }
  
  /**
   * 初始化陀螺仪图表
   */
  private initGyroscopeChart(): void {
    const chartDom = document.getElementById('gyroscope-chart');
    if (!chartDom) return;
    
    this.gyroscopeChart = echarts.init(chartDom);
    
    const option: echarts.EChartsOption = {
      title: {
        text: '姿态数据',
        left: 'center',
        textStyle: {
          fontSize: 14,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['俯仰角', '偏航角', '滚转角'],
        bottom: '0%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.timeData,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '角度 (°)',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '俯仰角',
          type: 'line',
          data: this.gyroPitchData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#722ed1'
          }
        },
        {
          name: '偏航角',
          type: 'line',
          data: this.gyroYawData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#13c2c2'
          }
        },
        {
          name: '滚转角',
          type: 'line',
          data: this.gyroRollData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#fa8c16'
          }
        }
      ]
    };
    
    this.gyroscopeChart.setOption(option);
  }
  
  /**
   * 初始化高度图表
   */
  private initAltitudeChart(): void {
    const chartDom = document.getElementById('altitude-chart');
    if (!chartDom) return;
    
    this.altitudeChart = echarts.init(chartDom);
    
    const option: echarts.EChartsOption = {
      title: {
        text: '高度与气压',
        left: 'center',
        textStyle: {
          fontSize: 14,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['高度 (m)', '温度 (°C)'],
        bottom: '0%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.timeData,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '高度',
          position: 'left',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '温度',
          position: 'right',
          offset: 0,
          splitLine: {
            show: false
          },
          min: 0,
          max: 50
        }
      ],
      series: [
        {
          name: '高度 (m)',
          type: 'line',
          data: this.altitudeData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#1890ff'
          },
          areaStyle: {
            opacity: 0.1
          }
        },
        {
          name: '温度 (°C)',
          type: 'line',
          yAxisIndex: 1,
          data: this.temperatureData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#ff7a45'
          }
        }
      ]
    };
    
    this.altitudeChart.setOption(option);
  }
  
  /**
   * 更新遥测数据图表
   * @param data 遥测数据
   */
  public updateTelemetryChart(data: TelemetryData): void {
    if (!this.telemetryChart) return;
    
    // 添加新的时间点
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // 更新数据数组
    this.timeData.push(timeStr);
    this.altitudeData.push(data.altitude);
    this.velocityData.push(data.velocity);
    this.accelerationData.push(data.acceleration);
    this.temperatureData.push(data.temperature);
    
    // 保持数组长度为30
    if (this.timeData.length > 30) {
      this.timeData.shift();
      this.altitudeData.shift();
      this.velocityData.shift();
      this.accelerationData.shift();
      this.temperatureData.shift();
    }
    
    // 更新图表
    this.telemetryChart.setOption({
      xAxis: {
        data: this.timeData
      },
      series: [
        {
          data: this.altitudeData
        },
        {
          data: this.velocityData
        },
        {
          data: this.accelerationData
        }
      ]
    });
    
    // 如果高度图表存在，也更新它
    if (this.altitudeChart) {
      this.altitudeChart.setOption({
        xAxis: {
          data: this.timeData
        },
        series: [
          {
            data: this.altitudeData
          },
          {
            data: this.temperatureData
          }
        ]
      });
    }
  }
  
  /**
   * 更新加速度计图表
   * @param x X轴加速度
   * @param y Y轴加速度
   * @param z Z轴加速度
   */
  public updateAccelerometerChart(x: number, y: number, z: number): void {
    if (!this.accelerometerChart) return;
    
    // 更新数据数组
    this.accelXData.push(x);
    this.accelYData.push(y);
    this.accelZData.push(z);
    
    // 保持数组长度为30
    if (this.accelXData.length > 30) {
      this.accelXData.shift();
      this.accelYData.shift();
      this.accelZData.shift();
    }
    
    // 更新图表
    this.accelerometerChart.setOption({
      xAxis: {
        data: this.timeData
      },
      series: [
        {
          data: this.accelXData
        },
        {
          data: this.accelYData
        },
        {
          data: this.accelZData
        }
      ]
    });
  }
  
  /**
   * 更新陀螺仪图表
   * @param pitch 俯仰角
   * @param yaw 偏航角
   * @param roll 滚转角
   */
  public updateGyroscopeChart(pitch: number, yaw: number, roll: number): void {
    if (!this.gyroscopeChart) return;
    
    // 更新数据数组
    this.gyroPitchData.push(pitch);
    this.gyroYawData.push(yaw);
    this.gyroRollData.push(roll);
    
    // 保持数组长度为30
    if (this.gyroPitchData.length > 30) {
      this.gyroPitchData.shift();
      this.gyroYawData.shift();
      this.gyroRollData.shift();
    }
    
    // 更新图表
    this.gyroscopeChart.setOption({
      xAxis: {
        data: this.timeData
      },
      series: [
        {
          data: this.gyroPitchData
        },
        {
          data: this.gyroYawData
        },
        {
          data: this.gyroRollData
        }
      ]
    });
  }
}