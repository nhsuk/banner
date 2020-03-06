# NHS UK Banner
![Master](https://github.com/tomdoughty/banner/workflows/Push%20to%20master/badge.svg?event=push)

In house solution for managing the emergency banner and feedback banners on [nhs.uk](https://www.nhs.uk).

## Standard usage
Add the compiled CSS and JS files to your application.
```
dist/banner.css
dist/banner.js
```

### SCSS Imports
If you already include nhsuk-frontend core then you only need to add the following files:
```
'/src/scss/emergency-alert';
'/src/scss/feedback-banner';
```
This will prevent you from including duplicate CSS in your application.

### No JavaScript solution
The NHS.UK policy for JavaScript is progressive enhancement. As a non JavaScript solution we display a link to a content managed page which makes the alert API request server side.
Include the following code below your header to include this functionality in your application.
```
<noscript>
	<div class="nhsuk-global-alert">
		<div class="nhsuk-width-container">
			<a href="http://www.nhs.uk/pages/NoJsAandE.aspx">Check here for alerts</a>
		</div>
	</div>
</noscript>
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
