import { SkinViewer, IdleAnimation } from 'skinview3d';

export type ModelType = 'steve' | 'alex';

export class SkinRenderer {
  private viewer: SkinViewer;
  private resizeObserver: ResizeObserver;
  private lastSkinUrl: string | null = null;
  private currentModel: ModelType = 'steve';

  constructor(container: HTMLElement) {
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;

    this.viewer = new SkinViewer({
      width: w,
      height: h,
      preserveDrawingBuffer: false,
      renderPaused: false,
    });

    container.appendChild(this.viewer.canvas);

    this.viewer.camera.position.set(0, 2, 35);
    this.viewer.controls.target.set(0, 0, 0);
    this.viewer.controls.enableDamping = true;
    this.viewer.controls.dampingFactor = 0.08;
    this.viewer.controls.minDistance = 15;
    this.viewer.controls.maxDistance = 80;
    this.viewer.controls.update();

    this.viewer.zoom = 1.0;
    this.viewer.fov = 50;

    this.viewer.animation = new IdleAnimation();

    this.resizeObserver = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw && nh) {
        this.viewer.width = nw;
        this.viewer.height = nh;
      }
    });
    this.resizeObserver.observe(container);
  }

  loadSkin(dataUrl: string): void {
    this.lastSkinUrl = dataUrl;
    this.viewer.loadSkin(dataUrl, {
      model: this.currentModel === 'alex' ? 'slim' : 'default',
      makeVisible: true,
    });
  }

  loadCape(capeUrl: string): void {
    this.viewer.loadCape(capeUrl, {
      makeVisible: true,
      backEquipment: 'cape',
    });
  }

  setModelType(type: ModelType): void {
    this.currentModel = type;
    if (this.lastSkinUrl) {
      this.viewer.loadSkin(this.lastSkinUrl, {
        model: type === 'alex' ? 'slim' : 'default',
        makeVisible: true,
      });
    }
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.viewer.dispose();
    if (this.viewer.canvas.parentElement) {
      this.viewer.canvas.parentElement.removeChild(this.viewer.canvas);
    }
  }
}
