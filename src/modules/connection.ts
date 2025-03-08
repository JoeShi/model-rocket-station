/**
 * 连接状态枚举
 */
enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

/**
 * 连接管理器类
 * 负责处理设备连接
 */
export class ConnectionManager {
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private connectButton: HTMLElement | null;

  constructor() {
    this.connectButton = document.getElementById('connect-button');
    this.updateConnectionUI();
  }

  /**
   * 切换连接状态
   */
  public toggleConnection(): void {
    if (this.state === ConnectionState.DISCONNECTED) {
      this.connect();
    } else if (this.state === ConnectionState.CONNECTED) {
      this.disconnect();
    }
  }

  /**
   * 连接到设备
   */
  private connect(): void {
    console.log('正在连接设备...');
    this.state = ConnectionState.CONNECTING;
    this.updateConnectionUI();

    // 模拟连接过程
    setTimeout(() => {
      // 80%的概率连接成功
      if (Math.random() > 0.2) {
        this.state = ConnectionState.CONNECTED;
        console.log('设备连接成功');
      } else {
        this.state = ConnectionState.ERROR;
        console.error('设备连接失败');
        
        // 3秒后重置为断开状态
        setTimeout(() => {
          this.state = ConnectionState.DISCONNECTED;
          this.updateConnectionUI();
        }, 3000);
      }
      
      this.updateConnectionUI();
    }, 2000);
  }

  /**
   * 断开设备连接
   */
  private disconnect(): void {
    console.log('正在断开设备连接...');
    
    // 模拟断开过程
    setTimeout(() => {
      this.state = ConnectionState.DISCONNECTED;
      console.log('设备已断开连接');
      this.updateConnectionUI();
    }, 1000);
  }

  /**
   * 更新连接UI
   */
  private updateConnectionUI(): void {
    if (!this.connectButton) return;

    switch (this.state) {
      case ConnectionState.DISCONNECTED:
        this.connectButton.textContent = '连接设备';
        this.updateStatusIndicator('offline', '未连接');
        break;
      
      case ConnectionState.CONNECTING:
        this.connectButton.textContent = '正在连接...';
        this.updateStatusIndicator('connecting', '正在连接');
        break;
      
      case ConnectionState.CONNECTED:
        this.connectButton.textContent = '断开连接';
        this.updateStatusIndicator('online', '已连接');
        break;
      
      case ConnectionState.ERROR:
        this.connectButton.textContent = '连接失败';
        this.updateStatusIndicator('error', '连接错误');
        break;
    }
  }

  /**
   * 更新状态指示器
   * @param className 状态类名
   * @param text 状态文本
   */
  private updateStatusIndicator(className: string, text: string): void {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-indicator span:last-child');
    
    if (statusIndicator && statusText) {
      // 移除所有状态类
      statusIndicator.classList.remove('online', 'offline', 'connecting', 'error');
      // 添加新状态类
      statusIndicator.classList.add(className);
      // 更新文本
      statusText.textContent = text;
    }
  }

  /**
   * 获取当前连接状态
   * @returns 当前连接状态
   */
  public getConnectionState(): ConnectionState {
    return this.state;
  }

  /**
   * 检查是否已连接
   * @returns 是否已连接
   */
  public isConnected(): boolean {
    return this.state === ConnectionState.CONNECTED;
  }
}