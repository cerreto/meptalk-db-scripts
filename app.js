const { _: [sqlfile] } = require("simple-argv")
if (!sqlfile) {
  throw new Error("devi specificare il nome del file sql da eseguire come primo argomento del comando")
}
console.log(`eseguo ${sqlfile}`)
const mysql = require("mysql")
const config = require("./dbconfig.json")
const { readFileSync } = require("fs")
const { join } = require("path")

const sql = readFileSync(join(__dirname, `${sqlfile}`), "utf8")

const pool = mysql.createPool({
  connectionLimit: 10,
  multipleStatements: true,
  ...config
})

pool.query(sql, (err, data) => {
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