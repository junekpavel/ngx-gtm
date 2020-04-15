# ngx-gtm

Library for integrating Google Tag Manager into Angular application. Easy to use, SSR ready.

## Installation

First you need to install the npm module:

```bash
npm install ngx-gtm --save
```

## Usage

Import `GtmModule` in your `AppModule` with following configuration:

```typescript
@NgModule({
  imports: [
    // ...
    GtmModule.forRoot({
      gtmId: 'GTM-XXXXXXX',
    }),
  ],
})
```

That's it. Google Tag Manager is initialized and ready to use.

### Configuration

Configuration structure is following:
```typescript
{
  gtmId: string;
  isEnabled?: boolean;
}
```
- `gtmId` is your Google Tag Manager ID in format `GTM-XXXXXXX` and it's required
- `isEnabled` (optional, default `true`) - you can disable whole module by setting this option to `false` (useful eg. for dev environment)

### Using Data Layer

You can also inject `GtmService` in your component (or service or whatever) to push Google Tag Manager tags:

```typescript
constructor(
    // ...
    private gtm: GtmService,
) { }
```

To push to Data Layer, just call `push` method:
```typescript
this.gtm.push({event: 'event_name'});
```

For more information about Data Layer usage, follow [Google Developer Guide](https://developers.google.com/tag-manager/devguide#events).


Avoid direct usage of `window.dataLayer` or `dataLayer`. You should always access it only via `GtmService` (as described above). It's mainly because of SSR.

So instead `window.dataLayer.push({event: 'xxx'})`, it should always be `this.gtm.push({event: xxx})`.


## IE support

If you wan't to support IE browsers, you'll need `ParentNode.prepend` method polyfill. You can use [this one](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend#Polyfill) and include it into your `src/polyfills.ts` file.
