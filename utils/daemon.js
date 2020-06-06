const {exec} = require("child_process");
const Txns = require("../transactions/txn-model");
const Sessions = require("../sessions/sessions-model");
const Zaddrs = require("../zaddrs/zaddrs-model");

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1014409',
  key: 'c7b887928299ea61ebff',
  secret: '01c685d24b3e53f8fcbc',
  cluster: 'us2',
  encrypted: true
});

function zaddrCheck() {
    exec("zecwallet-cli.exe balance", (err, stdout, stderr) => {
    let cursor = 0;
    const stdoutLines = stdout.split("\n")
    while (!stdoutLines[cursor].includes("{")) {
        cursor += 1
    }
    const addresses = JSON.parse(stdoutLines.slice(cursor).join(""))
    const zaddrs = addresses.z_addresses;
    if (zaddrs.length < 20) {
        for (let i = 0; i < 20-zaddrs.length; i++) {
            exec("zecwallet-cli.exe new z")
        }
    }
    console.log(addresses)
    })
    
}


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

        const txns = JSON.parse(stdout).filter(tx => tx.amount > 1 && tx.datetime > (Date.now()/1000) - ( 60 * 60) )
            for (let i= 0 ; i < txns.length; i++) {
                let saved = txns[i]
                let newTx = {};
                newTx.zaddr = saved.address;
                newTx.amount = Number(saved.amount) / 100000000;
                newTx.txid = saved.txid;
                Sessions.findBy({zaddr: newTx.zaddr}).then(session => {
                    Txns.add(newTx)
                    .then(tx => pusher.trigger('payment-made', 'payment-made', {
                        'message': session.hash
                    }))
                    .catch(err => null)
                }).catch(err => console.log(err))
            }
        console.log(txns)
        console.log(stderr)
        // check to see if it's related to a current content prompt
        // push an update with a hash to unlock content
    })
}

module.exports= {
    listen,
    zaddrCheck
}