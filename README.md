# passaro

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.14.0.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Deployment

Currently this is deployed inside the "personal web" project, at /projects/play/passaro.
First, build personal web. Then make a directory called /projects/play/passaro within
the /build directory of personal web. Then go to passaro. Then `grunt build` passaro. Then
copy the contents of the /dist directory of passaro into /build/projects/play/passaro within
personal web. Then deploy personal web per the instructions in that project. Yes, it's a
clunky process.
