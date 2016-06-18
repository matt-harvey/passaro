# passaro

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.14.0.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Deployment

Passaro is hosted within my personal\_web project. So to deploy passaro, you need to
deploy personal\_web. To do this, first `grunt build` passaro. Then once build, go to
personal\_web, build that project, then do what is needed to make sure the built
passaro distribution ends up in the right place when you're ready to rsync personal\_web
up to production.
