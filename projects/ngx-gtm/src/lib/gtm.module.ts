import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {GtmConfig} from './gtm-config';
import {GtmService} from './gtm.service';

/**
 * Defines Injection token of `GtmConfig` for configuring module
 */
export const gtmConfigService = new InjectionToken<GtmConfig>('GtmConfig');

/**
 * @usageNotes
 *
 * Import in your App Module as follows:
 *
 * ```
 *
 * @NgModule({
 *   imports: [
 *     // ...
 *     GtmModule.forRoot({
 *       gtmId: 'GTM-XXXXXXX',
 *     }),
 *   ],
 * })
 * class AppModule {}
 * ```
 *
 */
@NgModule()
export class GtmModule {

  /**
   * Creates and configures GTM module.
   *
   * @param config An `GtmModule` object that specifies library configuration
   */
  static forRoot(config: GtmConfig): ModuleWithProviders<GtmModule> {

    return {
      ngModule: GtmModule,
      providers: [
        GtmService,
        {
          provide: gtmConfigService,
          useValue: config,
        }
      ],
    };

  }

}
