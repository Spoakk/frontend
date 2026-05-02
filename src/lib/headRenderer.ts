import { SkinViewer } from 'skinview3d';

export class SkinHeadRenderer {
  private viewer: SkinViewer;

  constructor(container: HTMLElement) {
    const w = Math.max(container.clientWidth || 128, 128);
    const h = Math.max(container.clientHeight || 128, 128);

    this.viewer = new SkinViewer({
      width: w,
      height: h,
      preserveDrawingBuffer: false,
      renderPaused: false,
    });

    container.appendChild(this.viewer.canvas);

    this.viewer.camera.position.set(2, 0, 4);
    this.viewer.controls.target.set(0, 12, 0);
    this.viewer.controls.enableZoom = true;
    this.viewer.controls.enablePan = false;
    this.viewer.controls.minDistance = 8;
    this.viewer.controls.maxDistance = 20;
    this.viewer.controls.update();

    this.viewer.zoom = 0.5;
    this.viewer.fov = 35;

    this.viewer.playerObject.skin.body.visible = false;
    this.viewer.playerObject.skin.rightArm.visible = false;
    this.viewer.playerObject.skin.leftArm.visible = false;
    this.viewer.playerObject.skin.rightLeg.visible = false;
    this.viewer.playerObject.skin.leftLeg.visible = false;
  }

  loadSkin(dataUrl: string): void {
    this.viewer.loadSkin(dataUrl, {
      model: 'auto-detect',
      makeVisible: true,
    }).then(() => {
      setTimeout(() => {
        this.viewer.playerObject.skin.head.visible = true;
        this.viewer.playerObject.skin.body.visible = false;
        this.viewer.playerObject.skin.rightArm.visible = false;
        this.viewer.playerObject.skin.leftArm.visible = false;
        this.viewer.playerObject.skin.rightLeg.visible = false;
        this.viewer.playerObject.skin.leftLeg.visible = false;
        
        this.viewer.playerObject.rotation.y = Math.PI * 0.15;
      }, 100);
    });
  }

  dispose(): void {
    this.viewer.dispose();
    if (this.viewer.canvas.parentElement) {
      this.viewer.canvas.parentElement.removeChild(this.viewer.canvas);
    }
  }
}
