MagicMirror
===========

This could be the frontend of a [MagicMirror](http://michaelteeuw.nl/tagged/magicmirror) and is loosely based on [MagicMirror](https://github.com/MichMich/MagicMirror)

Currently it supports four widgets. Calendar, Time, News and Weather. The app is configurable over `app/config.ts` and you can change the layout in `app/components/app/app.html`.

## Dependencies

* [npm](https://www.npmjs.com/)
* [typings](https://npmjs.com/package/typings)
* any webserver like [http-server](https://www.npmjs.com/package/http-server) or [nginx](http://nginx.org/)

## Install
first you have to install all npm dependencies and the typings with
``` bash
$ npm install
```
then you can serve the project directory directly with a globally installed [http-server](https://www.npmjs.com/package/http-server) or nginx.

## Future Plans

It would be nice, if the position of widgets inside `app/components/app/app.html` could be set in a more powerful way.
More settings could be moved to `app/config.ts`.

### Calender
The calendar widget could be more intelligent regarding the display of start and end-dates, because you currently can't really see in which week the event starts/ends, if the start is in the past and the event is still ongoing, or if the event ends in more than a week.
Also I think an apple calender widget should be created, but as I don't own any apple stuff, it would be hard fro me to develop something for apple.
