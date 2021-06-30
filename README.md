# Sophize Md Renderer (Angular)

Angular renderer for Sophize Markdown. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4.

# Usage

This pacakge is compatible with angular 12 and above. To use in an angular application you also need to install katex and fontawesome:
```
    npm i @fortawesome/free-solid-svg-icons
    npm i katex
```
Then import these in styles.scss
```
@import '~katex/dist/katex.min.css';
@import '~@fortawesome/fontawesome-free/css/all.min.css';
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Publishing to npm
This library is published to npm at https://www.npmjs.com/package/ngx-sophize-md-renderer. To publish a new version of this library to npm, do the following:

* Update the version number in file `package.json`
* Compile using `ng build`, `cd dist\ngx-sophize-md-renderer` and publish using `npm publish`
* Publish a new release [here](https://github.com/Sophize/ngx-sophize-md-renderer/releases). Use the version number to set the `Tag version` and `Release Title` fields.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
