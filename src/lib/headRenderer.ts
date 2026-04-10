import { SkinViewer } from 'skinview3d';

export class SkinHeadRenderer {
  private viewer: SkinViewer;

  constructor(container: HTMLElement) {
    const w = container.clientWidth || 128;
    const h = container.clientHeight || 128;

    this.viewer = new SkinViewer({
      width: w,
      height: h,
      preserveDrawingBuffer: false,
      renderPaused: false,
    });

    container.appendChild(this.viewer.canvas);

    this.viewer.controls.target.set(0, 12, 0);
    this.viewer.controls.minDistance = 10;
    this.viewer.controls.maxDistance = 30;
    this.viewer.controls.update();

    this.viewer.zoom = 1.5;
    this.viewer.fov = 45;

    this.viewer.playerObject.skin.body.visible = false;
    this.viewer.playerObject.skin.rightArm.visible = false;
    this.viewer.playerObject.skin.leftArm.visible = false;
    this.viewer.playerObject.skin.rightLeg.visible = false;
    this.viewer.playerObject.skin.leftLeg.visible = false;

    this.viewer.playerObject.skin.head.rotation.y = Math.PI * 0.2;
  }

  loadSkin(dataUrl: string): void {
    this.viewer.loadSkin(dataUrl, {
      model: 'auto-detect',
      makeVisible: false,
    });

    requestAnimationFrame(() => {
      this.viewer.playerObject.skin.head.visible = true;
      this.viewer.playerObject.skin.body.visible = false;
      this.viewer.playerObject.skin.rightArm.visible = false;
      this.viewer.playerObject.skin.leftArm.visible = false;
      this.viewer.playerObject.skin.rightLeg.visible = false;
      this.viewer.playerObject.skin.leftLeg.visible = false;
    });
  }

  dispose(): void {
    this.viewer.dispose();
    if (this.viewer.canvas.parentElement) {
      this.viewer.canvas.parentElement.removeChild(this.viewer.canvas);
    }
  }
}
