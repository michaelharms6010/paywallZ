const {exec} = require("child_process");

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1014409',
  key: 'c7b887928299ea61ebff',
  secret: '01c685d24b3e53f8fcbc',
  cluster: 'us2',
  encrypted: true
});

function listen() {
    exec("zecwallet-cli.exe list", (err, stdout, stderr) => {
        // if there's a new transaction
        if (err) {
            console.log(err)
            return
        }
        let cursor = 0;
        const stdoutLines = stdout.split("\n")
        while (!stdoutLines[cursor].includes("[")) {
            cursor += 1
        }
        stdout = stdoutLines.slice(cursor).join("")
        const txns = JSON.parse(stdout)
        console.log(txns)
        console.log(stderr)
        // check to see if it's related to a current content prompt
        // push an update with a hash to unlock content
    })
}

module.exports= {
    listen
}