# passaro

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.14.0.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Deployment

Passaro is hosted within my personal\_web project. So to deploy passaro, you need to
deploy personal\_web.

First, `grunt build` passaro. Then copy the contents of the dist/ directory of
passaro into the src/projects/play/passaro/ directory within the personal\_web
project. Then go into the personal\_web project and publish and build personal\_web
as per the instructions for that project.
