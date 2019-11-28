var gulp = require("gulp");
var saveHash = require("../index");

gulp.task("default", function(){

	return gulp.src("*.js")
		.pipe(
			saveHash({
				hash: "md5", 
				filename: "test.txt", 
				key: "TEST_HASH",
				shortHash: false
			})
		)
})