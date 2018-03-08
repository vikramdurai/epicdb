const dataFactory = require("./epic");
const data = dataFactory();
data.store("hello.json");
data.schema({ hello: String });
data.create({ hello: "world"})
data.remove({ hello: "world" })