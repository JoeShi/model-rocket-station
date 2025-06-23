import i18n from './i18n.js';

/**
 * 视频流管理器
 * 负责管理摄像头视频流的获取、切换和控制
 */
export class VideoStreamManager {
  private videoElement: HTMLVideoElement | null = null;
  private currentStream: MediaStream | null = null;
  private availableDevices: MediaDeviceInfo[] = [];
  private currentDeviceIndex: number = 0;
  private isPlaying: boolean = false;
  private playButton: HTMLElement | null = null;
  private cameraButtons: NodeListOf<HTMLElement> | null = null;
  private statusIndicator: HTMLElement | null = null;
  
  // 事件处理器引用，用于正确移除监听器
  private boundPlayHandler: (() => void) | null = null;
  private boundCameraHandlers: Map<number, () => void> = new Map();
  
  // DOM元素缓存
  private elementCache = new Map<string, HTMLElement | null>();

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.enumerateDevices();
  }

  /**
   * 获取缓存的DOM元素
   * @param id 元素ID
   * @returns DOM元素或null
   */
  private getElement(id: string): HTMLElement | null {
    if (!this.elementCache.has(id)) {
      this.elementCache.set(id, document.getElementById(id));
    }
    return this.elementCache.get(id) || null;
  }

  /**
   * 初始化DOM元素引用
   */
  private initializeElements(): void {
    this.videoElement = this.getElement('video-stream') as HTMLVideoElement;
    this.playButton = this.getElement('video-play-button');
    this.cameraButtons = document.querySelectorAll('.camera-switch-button');
    this.statusIndicator = this.getElement('video-status');
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 播放/暂停按钮事件
    if (this.playButton) {
      this.boundPlayHandler = () => this.togglePlayback();
      this.playButton.addEventListener('click', this.boundPlayHandler);
    }

    // 摄像头切换按钮事件
    if (this.cameraButtons) {
      this.cameraButtons.forEach((button, index) => {
        const handler = () => this.switchCamera(index);
        this.boundCameraHandlers.set(index, handler);
        button.addEventListener('click', handler);
      });
    }
  }

  /**
   * 枚举可用的摄像头设备
   */
  private async enumerateDevices(): Promise<void> {
    try {
      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('BROWSER_NOT_SUPPORTED');
      }
      
      // 请求摄像头权限
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // 获取所有媒体设备
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // 筛选出视频输入设备
      this.availableDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log(`${i18n.t('video.devicesFound')}: ${this.availableDevices.length}`, this.availableDevices);
      
      // 更新UI状态
      this.updateCameraButtons();
      this.updateStatus(i18n.t('video.devicesDetected'));
      
    } catch (error: any) {
      console.error(i18n.t('video.deviceAccessError'), error);
      const errorMessage = this.getLocalizedErrorMessage(error);
      this.handleError(errorMessage);
    }
  }

  /**
   * 获取本地化的错误消息
   * @param error 错误对象
   * @returns 本地化的错误消息
   */
  private getLocalizedErrorMessage(error: any): string {
    const errorType = error.name || error.message || 'UNKNOWN_ERROR';
    
    switch (errorType) {
      case 'BROWSER_NOT_SUPPORTED':
        return i18n.t('video.error.browserNotSupported');
      case 'NotAllowedError':
        return i18n.t('video.error.permissionDenied');
      case 'NotFoundError':
        return i18n.t('video.error.noDevicesFound');
      case 'NotReadableError':
        return i18n.t('video.error.deviceInUse');
      case 'OverconstrainedError':
        return i18n.t('video.error.constraintsNotSatisfied');
      case 'SecurityError':
        return i18n.t('video.error.securityError');
      case 'AbortError':
        return i18n.t('video.error.operationAborted');
      default:
        return i18n.t('video.error.unknown') + `: ${errorType}`;
    }
  }

  /**
   * 开始视频流
   */
  public async startVideoStream(): Promise<void> {
    if (this.availableDevices.length === 0) {
      this.handleError(i18n.t('video.error.noDevicesAvailable'));
      return;
    }

    try {
      // 停止当前流
      this.stopVideoStream();

      // 获取当前选择的设备
      const deviceId = this.availableDevices[this.currentDeviceIndex]?.deviceId;
      
      // 设置视频约束
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      // 获取媒体流
      this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // 将流绑定到视频元素
      if (this.videoElement) {
        this.videoElement.srcObject = this.currentStream;
        this.videoElement.play();
      }

      this.isPlaying = true;
      this.updatePlayButton();
      this.updateStatus(i18n.t('video.status.playing', { camera: this.currentDeviceIndex + 1 }));
      
      console.log(i18n.t('video.streamStarted'));
      
    } catch (error: any) {
      console.error(i18n.t('video.streamStartError'), error);
      const errorMessage = this.getLocalizedErrorMessage(error);
      this.handleError(errorMessage);
    }
  }

  /**
   * 停止视频流
   */
  public stopVideoStream(): void {
    if (this.currentStream) {
      // 停止所有轨道
      this.currentStream.getTracks().forEach(track => {
        track.stop();
      });
      this.currentStream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }

    this.isPlaying = false;
    this.updatePlayButton();
    this.updateStatus(i18n.t('video.status.stopped'));
    
    console.log(i18n.t('video.streamStopped'));
  }

  /**
   * 切换播放/暂停状态
   */
  public togglePlayback(): void {
    if (this.isPlaying) {
      this.stopVideoStream();
    } else {
      this.startVideoStream();
    }
  }

  /**
   * 切换摄像头
   */
  public async switchCamera(deviceIndex: number): Promise<void> {
    if (deviceIndex < 0 || deviceIndex >= this.availableDevices.length) {
      console.warn(i18n.t('video.invalidCameraIndex'), deviceIndex);
      return;
    }

    this.currentDeviceIndex = deviceIndex;
    this.updateCameraButtons();

    // 如果当前正在播放，重新启动视频流
    if (this.isPlaying) {
      await this.startVideoStream();
    }

    console.log(i18n.t('video.switchedToCamera', { camera: deviceIndex + 1 }));
  }

  /**
   * 更新播放按钮状态
   */
  private updatePlayButton(): void {
    if (!this.playButton) return;

    const icon = this.playButton.querySelector('.material-icons');
    const text = this.playButton.querySelector('.button-text');

    if (this.isPlaying) {
      if (icon) icon.textContent = 'pause';
      if (text) text.textContent = i18n.t('video.pause');
      this.playButton.setAttribute('data-i18n', 'video.pause');
    } else {
      if (icon) icon.textContent = 'play_arrow';
      if (text) text.textContent = i18n.t('video.play');
      this.playButton.setAttribute('data-i18n', 'video.play');
    }
  }

  /**
   * 更新摄像头切换按钮状态
   */
  private updateCameraButtons(): void {
    if (!this.cameraButtons) return;

    this.cameraButtons.forEach((button, index) => {
      const isActive = index === this.currentDeviceIndex;
      const isAvailable = index < this.availableDevices.length;

      // 更新按钮状态
      if (isActive) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }

      // 禁用不可用的按钮
      if (isAvailable) {
        button.removeAttribute('disabled');
        button.style.opacity = '1';
      } else {
        button.setAttribute('disabled', 'true');
        button.style.opacity = '0.5';
      }

      // 更新按钮文本
      const buttonText = button.querySelector('.button-text');
      if (buttonText) {
        if (isAvailable) {
          const deviceLabel = this.availableDevices[index]?.label || i18n.t('video.camera', { number: index + 1 });
          buttonText.textContent = deviceLabel.length > 15 ? i18n.t('video.cameraPosition', { number: index + 1 }) : deviceLabel;
        } else {
          buttonText.textContent = i18n.t('video.cameraPosition', { number: index + 1 });
        }
      }
    });
  }

  /**
   * 更新状态指示器
   */
  private updateStatus(message: string): void {
    if (this.statusIndicator) {
      this.statusIndicator.textContent = message;
    }
  }

  /**
   * 处理错误
   */
  private handleError(message: string): void {
    console.error(message);
    this.updateStatus(message);
    
    // 显示错误提示
    if (this.statusIndicator) {
      this.statusIndicator.style.color = 'var(--md-sys-color-error)';
      setTimeout(() => {
        if (this.statusIndicator) {
          this.statusIndicator.style.color = '';
        }
      }, 5000);
    }
  }

  /**
   * 获取当前状态信息
   */
  public getStatus(): {
    isPlaying: boolean;
    currentDevice: number;
    availableDevices: number;
    deviceName: string;
  } {
    return {
      isPlaying: this.isPlaying,
      currentDevice: this.currentDeviceIndex,
      availableDevices: this.availableDevices.length,
      deviceName: this.availableDevices[this.currentDeviceIndex]?.label || i18n.t('video.camera', { number: this.currentDeviceIndex + 1 })
    };
  }

  /**
   * 销毁管理器，清理资源
   */
  public destroy(): void {
    this.stopVideoStream();
    
    // 正确移除事件监听器
    if (this.playButton && this.boundPlayHandler) {
      this.playButton.removeEventListener('click', this.boundPlayHandler);
      this.boundPlayHandler = null;
    }

    if (this.cameraButtons) {
      this.cameraButtons.forEach((button, index) => {
        const handler = this.boundCameraHandlers.get(index);
        if (handler) {
          button.removeEventListener('click', handler);
        }
      });
      this.boundCameraHandlers.clear();
    }
    
    // 清理缓存
    this.elementCache.clear();
  }
}
