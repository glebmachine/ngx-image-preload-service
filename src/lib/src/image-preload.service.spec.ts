import { TestBed, inject } from '@angular/core/testing';
import { ImagePreloadService } from './image-preload.service';
import { PlatformService } from '@betadigitalproduction/ngx-platform-service';

describe('ImagePreloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImagePreloadService, PlatformService]
    });
  });

  it('should be created', inject([ImagePreloadService], (service: ImagePreloadService) => {
    expect(service).toBeTruthy();
  }));

  it('С не ретина окружением отбрасывает ретина картинку у пары',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = false;
    const images = [
      'logo.34234.png',
      'logo@2x.34234.png',
    ];
    expect(service.filter(images)).toEqual([images[0]]);
  }));

  it('С ретина окружением отбрасывает не ретина картинку у пары',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = true;
    const images = [
      'logo.34234.png',
      'logo@2x.123123123.png',
    ];
    expect(service.filter(images)).toEqual([images[1]]);
  }));

  it('С ретина окружением грузит не ретина картинку, в случае если нет ретина пары',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = true;
    const images = [
      'logo.34234.png',
      'image.34234.png',
      'image@2x.23423423.png',
    ];
    expect(service.filter(images)).toEqual([images[0], images[2]]);
  }));

  it('В случае если у картинки нет хеша, то она все равно попадает на загрузку',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = true;
    const images = [
      'logo.png',
    ];
    expect(service.filter(images)).toEqual(images);
  }));

  it('В случае если у картинки нет хеша, то выбор из пары все равно происходит',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = true;
    const images = [
      'logo.png',
      'logo@2x.png',
    ];
    expect(service.filter(images)).toEqual([images[1]]);
  }));

  it('В случае если у картинки указаны гет параметры, то они остаются в url',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = true;
    const images = [
      'logo.453242.png?v=2#chtototam',
      'logo@2x.4532423.png?v=2#chtototam2',
    ];
    expect(service.filter(images)).toEqual([images[1]]);
  }));

  it('Должен распарсить url в imageObject',
    inject([ImagePreloadService], (service: ImagePreloadService) => {
    ImagePreloadService.retina = true;
    const urls = [
      'logo.453242.png?v=2#chtototam',
      'logo@2x.123.png?v=2#chtototam',
      'logo2.png?v=2#chtototam',
      'logo3.png',
    ];

    expect(service.parseItem(urls[0])).toEqual({
      name: 'logo',
      hash: '453242',
      ext: 'png',
      isRetina: false,
      query: 'v=2#chtototam'
    });

    expect(service.parseItem(urls[1])).toEqual({
      name: 'logo',
      hash: '123',
      ext: 'png',
      isRetina: true,
      query: 'v=2#chtototam'
    });

    expect(service.parseItem(urls[2])).toEqual({
      name: 'logo2',
      hash: null,
      ext: 'png',
      isRetina: false,
      query: 'v=2#chtototam'
    });

    expect(service.parseItem(urls[3])).toEqual({
      name: 'logo3',
      hash: null,
      ext: 'png',
      isRetina: false,
      query: null
    });
  }));
});
