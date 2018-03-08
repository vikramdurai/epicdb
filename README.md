# epicdb
```bash
yarn install epicdb
```
the simple, modular database that doesn't clog your brain.

## Docs
Use `epicdb` like so:
```js
const epicdb = require("epicdb")
const db = epicdb()

// configure!
db.store("db.json")
db.schema({
	hello: String
})

// data management
db.create({ hello: "world!" })
db.remove({ hello: "world" })
```