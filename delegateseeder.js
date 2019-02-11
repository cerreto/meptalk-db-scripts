const fs = require("fs")
const readline = require("readline")
const mysql = require("mysql")
const config = require("./dbconfig.json")

const fs = require("fs")
const readline = require("readline")
const mysql = require("mysql")
const config = require("./dbconfig.json")

const pool = mysql.createPool({
  connectionLimit: 10,
  multipleStatements: true,
  ...config
})

async function processLineByLine() {
  const fileStream = fs.createReadStream("delegates.csv")

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ("\r\n") in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`line from file: ${line}`)
    pool.query(`INSERT INTO delegates(id, name, committee, school, speeches) VALUES(${line});`, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
        pool.end((err) => {
          if (err) {
            console.log(err)
          } else {
            console.log("closed")
          }
        })
      }
    })
  }
}

processLineByLine()