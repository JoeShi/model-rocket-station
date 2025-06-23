/**
 * VideoStreamManager 单元测试
 * 测试事件监听器内存泄漏修复和权限处理改进
 */

import { VideoStreamManager } from '../modules/videoStream';
import i18n from '../modules/i18n';

// Mock DOM elements
const mockVideoElement = {
  srcObject: null,
  play: jest.fn(),
} as any;

const mockPlayButton = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  querySelector: jest.fn(),
  setAttribute: jest.fn(),
} as any;

const mockCameraButtons = [
  {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    },
    removeAttribute: jest.fn(),
    setAttribute: jest.fn(),
    style: {},
    querySelector: jest.fn(),
  },
  {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    },
    removeAttribute: jest.fn(),
    setAttribute: jest.fn(),
    style: {},
    querySelector: jest.fn(),
  },
] as any;

const mockStatusIndicator = {
  textContent: '',
  style: {},
} as any;

// Mock navigator.mediaDevices
const mockGetUserMedia = jest.fn();
const mockEnumerateDevices = jest.fn();

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
  writable: true,
});

// Mock document methods
Object.defineProperty(global.document, 'getElementById', {
  value: jest.fn((id: string) => {
    switch (id) {
      case 'video-stream':
        return mockVideoElement;
      case 'video-play-button':
        return mockPlayButton;
      case 'video-status':
        return mockStatusIndicator;
      default:
        return null;
    }
  }),
  writable: true,
});

Object.defineProperty(global.document, 'querySelectorAll', {
  value: jest.fn((selector: string) => {
    if (selector === '.camera-switch-button') {
      return mockCameraButtons;
    }
    return [];
  }),
  writable: true,
});

describe('VideoStreamManager', () => {
  let videoManager: VideoStreamManager;

  beforeEach(() => {
    // 重置所有mock
    jest.clearAllMocks();
    
    // 设置默认的mock返回值
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    });
    
    mockEnumerateDevices.mockResolvedValue([
      { kind: 'videoinput', deviceId: 'camera1', label: 'Camera 1' },
      { kind: 'videoinput', deviceId: 'camera2', label: 'Camera 2' },
    ]);

    mockPlayButton.querySelector.mockReturnValue({ textContent: '' });
    mockCameraButtons.forEach(button => {
      button.querySelector.mockReturnValue({ textContent: '' });
    });
  });

  afterEach(() => {
    if (videoManager) {
      videoManager.destroy();
    }
  });

  describe('事件监听器内存泄漏修复', () => {
    test('应该正确添加事件监听器', async () => {
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 验证播放按钮事件监听器被添加
      expect(mockPlayButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      
      // 验证摄像头按钮事件监听器被添加
      mockCameraButtons.forEach(button => {
        expect(button.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      });
    });

    test('应该正确移除事件监听器', async () => {
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 销毁管理器
      videoManager.destroy();
      
      // 验证播放按钮事件监听器被移除
      expect(mockPlayButton.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      
      // 验证摄像头按钮事件监听器被移除
      mockCameraButtons.forEach(button => {
        expect(button.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      });
    });

    test('多次销毁不应该出错', async () => {
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 多次调用destroy不应该出错
      expect(() => {
        videoManager.destroy();
        videoManager.destroy();
        videoManager.destroy();
      }).not.toThrow();
    });
  });

  describe('权限处理改进', () => {
    test('应该检测浏览器支持', async () => {
      // 模拟不支持的浏览器
      Object.defineProperty(global.navigator, 'mediaDevices', {
        value: undefined,
        writable: true,
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 验证错误被正确处理
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(i18n.t('video.deviceAccessError')),
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    test('应该处理权限被拒绝的情况', async () => {
      const permissionError = new Error('Permission denied');
      permissionError.name = 'NotAllowedError';
      mockGetUserMedia.mockRejectedValue(permissionError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 验证权限错误被正确处理
      expect(mockStatusIndicator.textContent).toBe(i18n.t('video.error.permissionDenied'));
      
      consoleSpy.mockRestore();
    });

    test('应该处理设备未找到的情况', async () => {
      const deviceError = new Error('Device not found');
      deviceError.name = 'NotFoundError';
      mockGetUserMedia.mockRejectedValue(deviceError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 验证设备错误被正确处理
      expect(mockStatusIndicator.textContent).toBe(i18n.t('video.error.noDevicesFound'));
      
      consoleSpy.mockRestore();
    });

    test('应该处理设备被占用的情况', async () => {
      const deviceError = new Error('Device in use');
      deviceError.name = 'NotReadableError';
      mockGetUserMedia.mockRejectedValue(deviceError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 验证设备占用错误被正确处理
      expect(mockStatusIndicator.textContent).toBe(i18n.t('video.error.deviceInUse'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('国际化支持', () => {
    test('应该使用国际化文本', async () => {
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 验证状态文本使用了国际化
      expect(mockStatusIndicator.textContent).toBe(i18n.t('video.devicesDetected'));
    });

    test('应该支持参数替换', () => {
      const text = i18n.t('video.status.playing', { camera: 1 });
      expect(text).toContain('1');
    });
  });

  describe('DOM缓存优化', () => {
    test('应该缓存DOM元素查询', async () => {
      const getElementByIdSpy = jest.spyOn(document, 'getElementById');
      
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 初始化时应该查询DOM元素
      expect(getElementByIdSpy).toHaveBeenCalledWith('video-stream');
      expect(getElementByIdSpy).toHaveBeenCalledWith('video-play-button');
      expect(getElementByIdSpy).toHaveBeenCalledWith('video-status');
      
      getElementByIdSpy.mockRestore();
    });
  });

  describe('功能完整性', () => {
    test('应该正确切换播放状态', async () => {
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 测试播放功能
      await videoManager.startVideoStream();
      const status = videoManager.getStatus();
      expect(status.isPlaying).toBe(true);
      
      // 测试停止功能
      videoManager.stopVideoStream();
      const statusAfterStop = videoManager.getStatus();
      expect(statusAfterStop.isPlaying).toBe(false);
    });

    test('应该正确切换摄像头', async () => {
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 切换到第二个摄像头
      await videoManager.switchCamera(1);
      const status = videoManager.getStatus();
      expect(status.currentDevice).toBe(1);
    });

    test('应该处理无效的摄像头索引', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      videoManager = new VideoStreamManager();
      
      // 等待异步初始化完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 尝试切换到无效索引
      await videoManager.switchCamera(99);
      
      // 验证警告被记录
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(i18n.t('video.invalidCameraIndex')),
        99
      );
      
      consoleSpy.mockRestore();
    });
  });
});
