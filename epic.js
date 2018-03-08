const fs = require("fs")

// helper function
// from https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
var isEqual = function (value, other) {

	// Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;

};

module.exports = function() {
	var config = {
		store: function(databasePath) {
			this.store = databasePath;
		},
		schema: function(scheme) {
			this.schema = scheme;
		},
		create: function(object) {
			//console.log("Creating new object..");
			if (!this.objects) {
				this.objects = [];
			}
			//console.log("Performing type check...");
			if (isEqual(Object.keys(object), Object.keys(this.schema))) {
				//console.log("Starting foreach")
				Object.values(object).forEach((i, a) => {
					//console.log("Inside foreach")
					Object.values(this.schema).forEach((j, b) => {
						//console.log(Object.values(this.schema))
						//console.log(j)
						let c = j.name;
						//console.log(c);
						//console.log("Inside the inside of foreach")
						//console.log("Starting the test..")
						let t = (typeof i).replace(/^\w/, (chr) => chr.toUpperCase());
						//console.log("test: t is", t, "and c is", c)
						if (t == c) {
							return;
						} else {
							throw Error("Object doesn't match the schema");
						}
					});
				});
				this.objects.push(object);
				//console.log("Objects:", this.objects)
				//console.log("Writing object to disk...");
				fs.writeFileSync(this.store, JSON.stringify(this.objects));
				return;
			}
			throw Error("Object doesn't match schema");
		},
		remove: function(object) {
			//console.log("Objects:", this.objects)
			if (!this.objects) {
				throw Error("Can't remove a nonexistent object");
			}
			var done = false;
			this.objects.forEach((i, a) => {
				//console.log("i is", i, "and a is", a)
				if (isEqual(i, object)) {
					//console.log("Splicing");
					this.objects.splice(a, 1);
					//console.log("spliced");
					done = true;
					return;
				}
			});
			if (!done) {
				throw Error("Can't remove a nonexistent object");
			}
			fs.writeFileSync(this.store, JSON.stringify(this.objects));
		}
	};
	return config;
}