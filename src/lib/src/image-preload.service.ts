import { Injectable } from '@angular/core';
import { PlatformService } from '@betadigitalproduction/ngx-platform-service';

export interface ImageObject {
  name: string;
  isRetina: boolean;
  hash: string;
  query: string;
  ext: string;
}

@Injectable()
export class ImagePreloadService {
  static retina = false;
  retina: boolean;
  loadedImage = {};

  constructor(
    private platform: PlatformService,
  ) {
    this.platform.runOnClient(() => {
      this.retina = window.devicePixelRatio > 1;
    });
  }

  public load(urls: string[] = []): Promise<string[]> {
    if (this.platform.isPlatformServer) {
      return Promise.resolve([]);
    }

    const filteredUrl = this.filter(urls);

    return Promise.all(
      filteredUrl.map((url) => {
        if (!this.loadedImage[url]) {
          this.loadedImage[url] = this.loadImage(url);
        }
        return this.loadedImage[url];
      })
    );
  }

  private loadImage(url: string) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(url);
      };
      image.src = url;

      if (image.complete) {
        resolve(url);
      }

      image.onerror = (e) => {
        reject(e);
      };
    });
  }

  public filter(urls: string[] = []): string[] {
    return this.combine(this.parse(urls));
  }

  private parse(urls: string[] = []): ImageObject[]  {
    return urls.map(url => this.parseItem(url));
  }

  public parseItem(url: string): ImageObject {
    const splitedUrlByDots = url.split('.');
    const latestItem = splitedUrlByDots.length === 2 ? 1 : 2;

    const hash = splitedUrlByDots.length === 2 ? null : splitedUrlByDots[1];
    const isRetina = this.checkIsRetina(splitedUrlByDots[0]);
    const name = this.getImageName(splitedUrlByDots[0]);
    const ext = this.getExtension(splitedUrlByDots[latestItem]);
    const query = this.getQuery(splitedUrlByDots[latestItem]);

    return { hash, isRetina, name, ext, query };
  }

  private combine(imageObjects: ImageObject[]): string[] {
    const resultUrls: string[] = [];
    const imagesByName = {};

    imageObjects.forEach((imageObject) => {
      if (!imagesByName[imageObject.name]) {
        imagesByName[imageObject.name] = {};
      }
      imagesByName[imageObject.name][imageObject.isRetina ? 'retina' : 'default'] = imageObject;
    });

    return Object.keys(imagesByName)
      .map((key) => {
        if (ImagePreloadService.retina && imagesByName[key].retina) {
          return imagesByName[key].retina;
        } else {
          return imagesByName[key].default;
        }
      })
      .map(this.convertToUrl);
  }

  private convertToUrl(imageObject: ImageObject): string {
    const result = [];

    result.push(imageObject.name);

    if (imageObject.isRetina) {
      result[0] += '@2x';
    }

    if (imageObject.hash) {
      result.push(imageObject.hash);
    }

    result.push(imageObject.ext);

    if (imageObject.query) {
      result[result.length - 1] += `?${imageObject.query}`;
    }

    return result.join('.');
  }

  private checkIsRetina(string: string): boolean {
    return string.indexOf('@2x') !== -1;
  }

  private getImageName(string: string): string {
    return string.split('@2x')[0];
  }

  private getExtension(string: string): string {
    return string.split('?')[0];
  }

  private getQuery(string: string): string {
    return string.split('?')[1] || null;
  }
}
