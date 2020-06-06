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
    exec("zecwallet-cli.exe balance", async (err, stdout, stderr) => {
    let cursor = 0;
    const stdoutLines = stdout.split("\n")
    while (!stdoutLines[cursor].includes("{")) {
        cursor += 1
    }
    const addresses = JSON.parse(stdoutLines.slice(cursor).join(""))
    const zaddrs = addresses.z_addresses;
    for (let i in zaddrs) {
        try{
            await Zaddrs.add({zaddr: zaddrs[i].address})
        } catch {}
    }
    let count = 20 - zaddrs.length;
    if (count < 20) {
        exec("zecwallet-cli.exe new z", async (err, stdout, stderr) => {
                let cursor = 0;
                const stdoutLines = stdout.split("\n")
                while (!stdoutLines[cursor].includes("[")) {
                    cursor += 1
                }
                const [newAddr] = stdoutLines.slice(cursor).join("")
                try {
                await Zaddrs.add({zaddr: newAddr})
                }
                catch {}
                count += 1
            })
        }
    })
   
}

async function sessionCheck() {
    let unpaid = await Sessions.getSessionBy({paid: false});
    unpaid.forEach(async session => {
        if (Date.now() - (20 * 60 * 1000) > session.datetime) {
            await Sessions.remove(session.id)
            await Zaddrs.setAvailable(session.zaddr)
        }
        // Maybe push expiry notification? Or add timer on FE
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
                newTx.amount = +saved.amount;
                newTx.txid = saved.txid;
                Sessions.findBy({zaddr: newTx.zaddr}).first().then(session => {
                    Txns.add(newTx)
                    .then(async tx => {
                        await Zaddrs.setAvailable(newTx.zaddr)
                        await Sessions.setSessionPaid(session.id)
                        pusher.trigger('payment-made', 'payment-made', {
                        'message': session.hash
 
                }).catch(err => console.log(err))
            })
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
    zaddrCheck,
    sessionCheck
}