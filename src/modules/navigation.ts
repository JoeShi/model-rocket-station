/**
 * 导航管理器类
 * 负责处理页面导航和菜单切换
 */
export class NavigationManager {
  private navItems: HTMLElement[];
  private pages: HTMLElement[];
  private currentPage: string = 'home';

  constructor() {
    // 获取所有导航项
    this.navItems = [
      document.getElementById('nav-home'),
      document.getElementById('nav-sensors'),
      document.getElementById('nav-settings')
    ].filter(item => item !== null) as HTMLElement[];

    // 获取所有页面
    this.pages = [
      document.getElementById('home-page'),
      document.getElementById('sensors-page'),
      document.getElementById('settings-page')
    ].filter(page => page !== null) as HTMLElement[];

    // 初始化导航事件
    this.initNavEvents();
  }

  /**
   * 初始化导航事件
   */
  private initNavEvents(): void {
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const pageId = item.id.replace('nav-', '');
        this.navigateTo(pageId);
      });
    });
  }

  /**
   * 导航到指定页面
   * @param pageId 页面ID
   */
  public navigateTo(pageId: string): void {
    // 更新当前页面
    this.currentPage = pageId;

    // 更新页面标题
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      switch (pageId) {
        case 'home':
          pageTitle.textContent = '控制面板';
          break;
        case 'sensors':
          pageTitle.textContent = '传感器数据';
          break;
        case 'settings':
          pageTitle.textContent = '系统设置';
          break;
      }
    }

    // 更新导航项状态
    this.navItems.forEach(item => {
      if (item.id === `nav-${pageId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 更新页面显示
    this.pages.forEach(page => {
      if (page.id === `${pageId}-page`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    console.log(`导航到: ${pageId}`);
  }

  /**
   * 获取当前页面ID
   * @returns 当前页面ID
   */
  public getCurrentPage(): string {
    return this.currentPage;
  }
}