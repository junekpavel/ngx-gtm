import {TestBed} from '@angular/core/testing';
import {GtmService} from '../src/lib/gtm.service';
import {gtmConfigService} from '../src/lib/gtm.module';

describe('NgxGtmService', () => {

  it('should not be created when no config provided', () => {
    expect(() => TestBed.get(GtmService)).toThrowError();
  });

  it('should be created when config provided (event not-valid)', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: gtmConfigService, useValue: {} },
      ]
    });
    expect(TestBed.get(GtmService)).toBeTruthy();
  });

  it('should throw an error during initialization when no gtmId provided', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: gtmConfigService, useValue: {} },
      ]
    });
    const gtmService: GtmService = TestBed.get(GtmService);
    expect(gtmService.postponeInitialization).toThrow();
  });

  describe('with correct gtmId', () => {

    const gtmId = 'GTM-secretId';

    let service: GtmService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: gtmConfigService, useValue: gtmId },
        ],
      });
      service = TestBed.get(GtmService);
    });

    it('should be initialized', () => {
      expect(() => service.postponeInitialization()).toBeTruthy();
    });

    it('should not fail when pushing to dataLayer', () => {
      expect(() => service.push({foo: 'bar'})).toBeTruthy();
    });

  });

});
