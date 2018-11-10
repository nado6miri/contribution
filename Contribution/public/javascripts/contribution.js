/*
var network = { blockchain: 'eos', protocol: 'http', host: 'api.eosnewyork.io', port: 80, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' };
//var network = { blockchain: 'eos', protocol: 'http', host: 'nodes.get-scatter.com', port: 443, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' };

// You can pass in any additional options you want into the eosjs reference.
const eosOptions = { expireInSeconds:60 };
const config = {
    expireInSeconds: 60,
    broadcast: true,
    debug: true,
    sign: true,
    httpEndpoint: 'https://api.eosnewyork.io',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};
*/

var network = { blockchain: 'eos', protocol: 'http', host: 'jungle.cryptolions.io', port: 18888, chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca' };
// You can pass in any additional options you want into the eosjs reference.
const eosOptions = { expireInSeconds: 60 };
const config = {
    expireInSeconds: 60,
    broadcast: true,
    debug: true,
    sign: true,
    httpEndpoint: 'http://jungle.cryptolions.io:18888',
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
};


// for Scatter Desktop
// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins(new ScatterEOS());
const scatter = ScatterJS.scatter;


const keyProvider = ['PrivateKey1', 'PrivateKey2'];
// We're also going to require an account that is connected to the network we're using.
const requiredFields = { accounts: [network] };

var account = {}; 
var persist_account = {};
var socket = 0;
var login_status = false;
const connectionOptions = { initTimeout: 10000 }

function Scatter_Login() {
    //alert("Scatter_Login");
    if (login_status)
    {
        alert("Already Scatter LogIn Status.");
        $(".close").click(function () {
            $("#myAlert").alert("close");
        });
    }
    else
    {
        scatter.connect("Contribution-donate Program", connectionOptions)
            .then(function (connected) {
                console.log('connected', connected);
                if (connected != true) {
                    alert("Can't find scatter - Not connected");
                    return;
                }
            })
            .catch(function (x) {
                console.log('x', x);
            });

        if (scatter.identity) {
            console.log("Already get identity");
            console.log("Account Info = " + persist_account.name + '@' + persist_account.authority);
            console.log("Blockchain Accounts = " + persist_account.blockchain);
        }

        // Now we need to get an identity from the user.
        scatter.getIdentity(requiredFields)
            .then(() => {
                // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
                // the user for their account name beforehand. They could still give you a different account.
                account = scatter.identity.accounts.find(x => x.blockchain === 'eos');

                console.log("Account Info = " + account.name + '@' + account.authority);
                console.log("Blockchain Accounts = " + account.blockchain);
                persist_account.name = account.name;
                persist_account.authority = account.authority;
                persist_account.blockchain = account.blockchain;
                let strtmp = "<strong> [" + account.name + '@' + account.authority + "]</strong>";
                $('#accname').html(strtmp);
                $('#scatterLogin').removeClass('btn-primary').addClass('btn-success');
                login_status = true;
            })
            .catch(error => {
                // The user rejected this request, or doesn't have the appropriate requirements.
                console.error(error.message);
                alert(error.message);
            });
    }
}

function Scatter_Logout() {
    //alert("Scatter_Logout");
    if (login_status) {
        scatter.forgetIdentity()
            .then((result) => {
                account.name = account.authority = account.blockchain = null;
                console.log("Account Info = " + account.name + '@' + account.authority);
                console.log("Blockchain Accounts = " + account.blockchain);
                persist_account.name = account.name;
                persist_account.authority = account.authority;
                persist_account.blockchain = account.blockchain;
                login_status = false;
                alert("Logout Success!!");
                let strtmp = "<strong>" + "[ ************@****** ]" + "</strong>";
                $('#accname').html(strtmp);
                $('#scatterLogin').removeClass('btn-success').addClass('btn-primary');
            })
            .catch(error => {
                console.error(error.message);
                alert(error.message);
            });
    }
    else
    {
        alert("Already Logout Status");
    }
}


function Contribution() {

    if (login_status == false)
    {
        Scatter_Login();
    }
    else
    {
        //Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        const eos = scatter.eos(network, Eos, config);

        // ----------------------------
        // Now that we have an identity, an EOSIO account, and a reference to an eosjs object we can send a transaction.
        // ----------------------------

        // Never assume the account's permission/authority. Always take it from the returned account.
        //const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };
        const transactionOptions = {
            authorization: [`${account.name}@${account.authority}`],
            broadcast: true,
            sign: true
        };

        var a = 0, b = 0, c = 0, d = 0, lucky = 0;
        a = $('#numa').val();
        b = $("#numb").val();
        c = $("#numc").val();
        d = $("#numd").val();
        lucky = parseInt(a) + (parseInt(b) * 10) + (parseInt(c) * 100) + (parseInt(d) * 1000);
        console.log("a = ", a);
        console.log("b = ", b);
        console.log("c = ", c);
        console.log("d = ", d);
        console.log("lucky=", lucky);

        var memo = 'Contribution-' + lucky.toString() + '-1000';
        alert(memo);
        eos.transfer(account.name, 'goldenbucket', '1.0000 EOS', memo, transactionOptions)
            .then(trx => {
                console.log(`Transaction ID: ${trx.transaction_id}`);
            })
            .catch(error => {
                let errorjson = JSON.parse(error);
                console.error("error =", error);
                alert("error code =" + errorjson['code'] + "\n" + "Message=" + errorjson['error']['details'][0]['message']);
            });
    }
}

function onlyNumber(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39)
        return;
    else
        return false;
}
function removeChar(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if (keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39)
        return;
    else
        event.target.value = event.target.value.replace(/[^0-9]/g, "");
}


function socket_communication() {
    if (socket == 0) {
        socket = io.connect('http://localhost:5555');
        var SYM = ['EOS', 'GOLD'];

        socket.on('insert_last', function (data) {
            console.log("Insert Table");
            $('#msgs').text(data.msg + '==Insert Table');
            //$('#donate_list > tbody:last').append('<tr><td>Last</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
            var my_tbody = document.getElementById('insert_sminfo_table');
            var row = my_tbody.insertRow(my_tbody.rows.length); // 하단에 추가
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            cell1.innerHTML = data.id;
            cell2.innerHTML = data.roundid;
            cell3.innerHTML = data.jointime;
            cell4.innerHTML = data.donator;
            cell5.innerHTML = data.donamteamt;
            cell6.innerHTML = SYM[data.donatetype];
            cell7.innerHTML = data.luckycode;
            cell8.innerHTML = "txid";
        });

        socket.on('insert_first', function (data) {
            console.log("Insert Table");
            $('#msgs').text(data.msg + '==Insert Table');
            //$('#donate_list > tbody').append('<tr><td>First</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
            var my_tbody = document.getElementById('insert_sminfo_table');
            var row = my_tbody.insertRow(0); // 상단에 추가
            //var row = my_tbody.insertRow(my_tbody.rows.length); // 하단에 추가
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            cell1.innerHTML = data.id;
            cell2.innerHTML = data.roundid;
            cell3.innerHTML = data.jointime;
            cell4.innerHTML = data.donator;
            cell5.innerHTML = data.donamteamt;
            cell6.innerHTML = SYM[data.donatetype];
            cell7.innerHTML = data.luckycode;
            cell8.innerHTML = "txid";
        });

        socket.on('update', function (data) {
            console.log("update / Insert Table");
            $('#msgs').text(data.msg + '==Insert Table');
            var my_tbody = document.getElementById('insert_sminfo_table');
            var row = my_tbody.insertRow(my_tbody.rows.length); // 하단에 추가
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            cell1.innerHTML = data.id;
            cell2.innerHTML = data.roundid;
            cell3.innerHTML = data.jointime;
            cell4.innerHTML = data.donator;
            cell5.innerHTML = data.donamteamt;
            cell6.innerHTML = SYM[data.donatetype];
            cell7.innerHTML = data.luckycode;
            cell8.innerHTML = "txid";
        });

        //===========================================================
        $("#cmdbox").keyup(function (event) {
            if (event.which == 13) {
                socket.emit('clientcmd', { msg: $('#cmdbox').val() });
                $('#cmdbox').val('');
            }
        });
    }
}