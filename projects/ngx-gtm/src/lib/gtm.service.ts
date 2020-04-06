import {ApplicationInitStatus, Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {gtmConfigService} from './gtm.module';
import {GtmConfig} from './gtm-config';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GtmService {

  /**
   * Indicates whenever GTM was initialized
   */
  private initialized = false;

  /**
   * Stores pushes to dataLayer that will be added to dataLayer once the app will be initialized
   */
  private postponedPushes = [];

  private domDocument: Document;

  constructor(
    @Inject(gtmConfigService) private config: GtmConfig,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) domDocument: any,
    private applicationInitStatus: ApplicationInitStatus,
  ) {
    this.domDocument = domDocument;
  }

  /**
   * Push any object do GTM dataLayer
   *
   * @param obj - object that will be pushed to dataLayer
   */
  public push(obj: {[key: string]: any}): void {
    if (this.initialized) {
      this.pushToDataLayer(obj);
    } else {
      this.postponedPushes.push(obj);
    }
  }

  /**
   * Waits for app initialization and then initialize module
   */
  public postponeInitialization(): void {

    if (!this.config || (this.config && !(!!this.config.gtmId || this.config.isEnabled === false))) {
      throw new Error('gtmId must be provided');
    }

    this.applicationInitStatus.donePromise
      .then(() => {
        this.init();
      });
  }

  /**
   * Initialize service - create dataLayer and setup necessary HTML code
   */
  private init(): void {
    if (!this.initialized && this.config.isEnabled !== false) {
      this.initDataLayer();
      this.pushToDataLayer({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      this.appendGtmTags();
      this.pushPostponed();
    }
    this.initialized = true;
  }

  /**
   * Initialize global dataLayer variable
   */
  private initDataLayer(): void {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).dataLayer = [];
    }
  }

  /**
   * Provide dataLayer (or noop one for server platform)
   */
  private getDataLayer(): {[key: string]: any}[] {
    return isPlatformBrowser(this.platformId) ? (window as any).dataLayer : [];
  }

  /**
   * Push all postponed pushes to dataLayer
   */
  private pushPostponed(): void {
    this.postponedPushes.forEach(obj => this.pushToDataLayer(obj));
    this.postponedPushes = [];
  }

  /**
   * Push object do dataLayer
   * @param obj - object to be pushed
   */
  private pushToDataLayer(obj: {[key: string]: any}): void {
    if (this.config.isEnabled !== false) {
      const dataLayer = this.getDataLayer();
      dataLayer.push(obj);
    }
  }

  /**
   * Append necessary elements to DOM
   */
  private appendGtmTags(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.domDocument.head.prepend(this.buildGtmScript());
      this.domDocument.body.prepend(this.buildGthIframe());
    }
  }

  /**
   * Create GTM initialization script
   */
  private buildGtmScript(): HTMLElement {
    const gtmScript = this.domDocument.createElement('script');
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${this.config.gtmId}`;
    gtmScript.async = true;
    return gtmScript;
  }

  /**
   * Create GTM noscript iframe
   */
  private buildGthIframe(): HTMLElement {
    const gtmIframe = this.domDocument.createElement('iframe');
    gtmIframe.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=${this.config.gtmId}`);
    gtmIframe.style.width = '0';
    gtmIframe.style.height = '0';
    gtmIframe.style.display = 'none';
    gtmIframe.style.visibility = 'hidden';

    const gtmNoscript = this.domDocument.createElement('noscript');
    gtmNoscript.innerHTML = gtmIframe.outerHTML;

    return gtmNoscript;
  }

}
