# NHS UK Banner
In house solution for managing the emergency banner and feedback banners on [nhs.uk](https://www.nhs.uk).

## Usage
This code should be consumed via NPM. You should already be using NPM to consume the [nhsuk-frontend library](https://github.com/nhsuk/nhsuk-frontend) via a build tool such as Gulp or Webpack.
```
npm install nhsuk-banner --save
```

### CSS
The styles for the banner are no longer included in nhsuk-frontend. You will need to add them to your relevant SCSS compilation task.

If you already include nhsuk-frontend core then you only need to add the following code to your main SCSS file:
```
@import 'node_modules/nhsuk-banner/src/scss/emergency-alert';
@import 'node_modules/nhsuk-banner/src/scss/feedback-banner';
```
If you do not include nhsuk-frontend core you will need to add the following code to your main SCSS file, this ensures you have the correct varaibles and mixins available:

```
@import 'node_modules/nhsuk-frontend/packages/core/settings/all';
@import 'node_modules/nhsuk-frontend/packages/core/tools/all';

@import 'node_modules/nhsuk-banner/src/scss/emergency-alert';
@import 'node_modules/nhsuk-banner/src/scss/feedback-banner';
```

### JavaScript
The JavaScript in this repository is written in ES6. For production use it must be transpiled to ES5. This process should be handled by your build tools.

Add the following file to your JavaScript build task
```
node_modules/nhsuk-banner/src/js/banner.js
```

## Development

### Application
```
git clone git@github.com:nhsuk/nhsuk-banner.git
npm install
npm start
```
Go to http://localhost:3000/ to open a small app which contains an example page for emergency banner and feedback banner.

### Tests
```
npm test
```
Tests are written in Jest and use JSDom to simulate browser behaviour.