# NHS.UK emergency banner

![Master](https://github.com/nhsuk/banner/workflows/Push%20to%20master/badge.svg?event=push)

In house solution for managing the emergency banner on [nhs.uk](https://www.nhs.uk).

## Usage
This code should be consumed via NPM. You should already be using NPM to consume the [nhsuk-frontend library](https://github.com/nhsuk/nhsuk-frontend) via a build tool such as Gulp or Webpack.
```
npm install @nhsuk/emergency-banner --save
```

### CSS
The styles for the banner are no longer included in nhsuk-frontend. You will need import the SCSS from NPM.
```
@import 'node_modules/@nhsuk/emergency-banner/dist/emergency-banner';
```

### JavaScript
The JavaScript in this repository is written in ES6. For production use it must be transpiled to ES5. This process should be handled by your build tools.
```
import '@nhsuk/emergency-banner';
```

## Development

### Application
```
npm install
npm start
```
Go to http://localhost:3000/ to open a small app which contains an example page for emergency banner and feedback banner.

### Tests
```
npm test
```
Tests are written in Jest and use JSDom to simulate browser behaviour.
