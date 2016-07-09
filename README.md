npm install -g typescript webpack gulp
npm install

Building
--------

`webpack`


Uploading Built Code
--------------------

Copy `secrets.default.js` to `secrets.js` and fill out your username/password.  Obviously, this should stay
out of version control.

To actually perform the upload:

`gulp upload`
