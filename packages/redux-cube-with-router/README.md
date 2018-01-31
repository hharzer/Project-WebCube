# redux-cube-with-router

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/redux-cube-withrouter.svg
[nodei-image]: https://nodei.co/npm/redux-cube-withrouter.png?downloads=true
[npm-url]: https://npmjs.org/package/redux-cube-withrouter
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/redux-cube-with-router/master.svg
[travis-url]: https://travis-ci.org/dexteryy/redux-cube-with-router
[dep-image]: https://david-dm.org/dexteryy/redux-cube-with-router.svg
[dep-url]: https://david-dm.org/dexteryy/redux-cube-with-router
-->

![iOS Safari](https://github.com/alrra/browser-logos/raw/master/src/safari-ios/safari-ios_48x48.png) | ![Android WebView](https://github.com/alrra/browser-logos/raw/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- |
iOS 7+ ✔ | Android 4+ ✔ | 11+ ✔ |

[redux-cube](https://www.npmjs.com/package/redux-cube)'s pluggable module for [react-router v4+](https://reacttraining.com/react-router/) and [react-router-redux v5+](https://github.com/reacttraining/react-router/tree/master/packages/react-router-redux)

```
npm install --save-dev redux-cube-withrouter
```

For [react-router v3](https://github.com/ReactTraining/react-router/tree/v3/docs), use [redux-cube-with-router3](https://github.com/dexteryy/Project-WebCube/tree/master/packages/redux-cube-with-router3)

## Get Started

```js
// xxx/App.jsx
import { createApp } from 'redux-cube';
import withRouter from 'redux-cube-withrouter';
import { Route } from 'react-router-dom';

@createApp(withRouter({
  reducers: {
    // ...
  },
  // optional
  // https://github.com/ReactTraining/history#usage
  supportHtml5History: false,
  // optional
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-redux/modules/ConnectedRouter.js#L8
  routerConfig: {},
  // ...
})))
class SubApp extends PureComponent {
  render() {
    return (
      <Route path="/" component={Home}>
        <Route path="foo" component={Foo}/>
        <Route path="bar" component={Bar}/>
      </Route>
    );
  }
}
```