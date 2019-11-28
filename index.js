"use strict";

const crypto = require("crypto");
const path = require("path");
const through = require("through");
const replace = require('replace-in-file');
const _ = require("lodash");

//
// ─── USAGE ──────────────────────────────────────────────────────────────────────
//

/*
gulp.task('appjs', function() {
    return gulp.src("src/app.js")
        .pipe(gulp.dest("dist/")) 
        .pipe(saveHash({hash: "md5", filename: "__config.asp", key: "APP_CSS_HASH"}))
});

hash (string): Type of hash to use (sha1) by default
filename (string): File to add hash to
key (string): Key in file to replace
shortHash (bool): Should hash key be shortened
*/

function saveHash(options){

  options = _.defaults(options || {}, {
      dest: process.cwd(),
      hash: "sha1",
      shortHash: false
  })

  let cfgName = path.resolve(options.dest, options.filename)

  function processFile(file){
      if(file.isNull()) return;

      let filePath = path.resolve(options.dest, file.path);
      let hash = crypto
          .createHash(options.hash)
          .update(file.contents, "binary")
          .digest("hex");

      if(options.shortHash) hash = hash.substring(0,7);

      let regExp = new RegExp(`^${options.key}.*=.*".*".*$`, "m");

      replace({
          files: cfgName,
          from: regExp,
          to: `${options.key}="${hash}"`
      })
      .catch(error => {
          console.error('Error occurred:', error);
      });
  }

  return through(processFile);
}

module.exports = saveHash;
