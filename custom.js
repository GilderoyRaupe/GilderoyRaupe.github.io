/*There are still some problems regarding the cache, so there can be errors and strange results for Blockchain operation, when the page is not loaded properly
The naming convetion for Identifier and Tags has been violated several times.
The program code could exploit more Modularity
At sveral points in the code, there could have been more elegant ways to code...
I wanted to do so much more, e.g. Jquery promises for an elegant way to wait for asynchronus calls
*/

//--Global Variables---
//I hate global variables but for the sake of simplicity....
var contractInstance; //has to be global in order to be adressed in the console for debuging purposes
var isCenter = false; //bool to know if the user is center

$(window).on('load', function() {
    var contractAddress = "0xdbbe6fbadeeca7a62f04cd474028d6a38d955b25"; //Ropsten
    var contractAbi =  [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "addressData",
            "outputs": [
                {
                    "name": "balanceOf",
                    "type": "uint256"
                },
                {
                    "name": "typeId",
                    "type": "int256"
                },
                {
                    "name": "beenVac",
                    "type": "int256"
                },
                {
                    "name": "pendPayoutAmt",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "canConfirm",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "conversionfactor",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "toll",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "myBalance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isKnown",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getTypeId",
            "outputs": [
                {
                    "name": "",
                    "type": "int256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "customer",
                    "type": "address"
                }
            ],
            "name": "gotVaccinated",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "cashOut",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "recip",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "setToll",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "incBalance",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "becomeVendor",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "hospital",
                    "type": "address"
                }
            ],
            "name": "getVaccinated",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "payIn",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "cnt",
                    "type": "address"
                }
            ],
            "name": "approveCenter",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "vnd",
                    "type": "address"
                }
            ],
            "name": "approveVendor",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "becomeCenter",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "becomePerson",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "setConversionfactor",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "initialSupply",
                    "type": "uint256"
                },
                {
                    "name": "tokenName",
                    "type": "string"
                },
                {
                    "name": "tokenSymbol",
                    "type": "string"
                },
                {
                    "name": "tokpereth",
                    "type": "uint256"
                }
            ],
            "name": "initvacTokenERC20",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "init",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "confVaccination",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        var errorMsg = 'I doesn\'t have web3 :( Please open in Google Chrome Browser and install the Metamask extension.';
        $('#content').text(errorMsg);
        alert("I doesn't have Web 3... Webpsite won't function properly.")
        console.log(errorMsg);
        return;
    }

    //Set default Account
    web3.eth.defaultAccount = web3.eth.accounts[0];
    // create instance of contract object that we use to interface the smart contract
    var Contract = web3.eth.contract(contractAbi);
    contractInstance = Contract.at(contractAddress);
    console.log(contractInstance);

    //Initialize Dialog for Service contract
    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 450,
        width: 350,
        modal: true,
        buttons: {
            "Accept": submitTransaction,
            Cancel: function() {
                dialog.dialog( "close" );
            }
        },
        close: function() {
        }
    });

    //Open Dialog event
    $( "#buyService" ).button().on( "click", function() {
        dialog.dialog( "open" );
        $('#customer').val(web3.eth.defaultAccount);
    });

    //Check if User isKnown and thus has already an account
    contractInstance.isKnown.call(function(error, result) {
        if (error) {
            alert("there was a problem with validating your Account. We're really sorry...");
            return;
        }
        if(result === false){
            initAccount(); //initialise Account
        }
        else{
            setBalanceText(); //Load Balance of User Account
        }
    });

    prepareCenterView(); //Check if user is Center

    //button click Event
    $('#registerbtn').on('click', function(e) {
        e.preventDefault(); // cancel the actual submit
        if(isCenter){
            //Center confirms Vaccination
            contractInstance.gotVaccinated($('#addressHospital').val(), function(error, result){
                if(error)
                    alert("there was a problem with confirming the Vaccination . We're really sorry...");
            });
        }
        else{
            //Customer registers for Vaccination
            contractInstance.getVaccinated($('#addressHospital').val(), function(error, result){
                if(error)
                    alert("there was a problem with confirming your Registration. We're really sorry...");
            });
        }
    });

    //button click Event
    $('#confirmVacc').on('click', function(e) {
        e.preventDefault(); // cancel the actual submit
        contractInstance.canConfirm.call(function(error, result) { //Has the Hospital approved the Vaccination
            if (error) {
                alert("there was a problem with validating your Vaccination. We're really sorry...");
                return;
            }
            if(result === false){
                alert("Confirmation failed: no completed Vaccancination found.");
                return;
            }
            else{
                contractInstance.confVaccination(function(error, result){ //If yes, confirm Vaccination and get 1 Token
                    if(error)
                        alert("there was a problem with your transaction. We're really sorry...");
                    else{
                        //TODO: Wait for the call to return via JQuery Promise
                        alert("Confirmation approved: 1 Healthcoin transferred.");
                        setBalanceText();
                    }
                });
            }
        });
    });

    //button click Event
    $('#Donate').on('click', function(e) {
        e.preventDefault(); // cancel the actual submit
        contractInstance.payIn(function(error){ //Donate
            if(error)
                console.log(error);
        });
    });

});

function submitTransaction(){
//TODO: Implement protocol to transfer tokens from Customer to public service provider in exchange for Service
// Due to Lack of time ommited
}

//Initialize Account
function initAccount(){
    contractInstance.init(function(error, txHash) {
        if (error) {
            var errorMsg = 'error writing new greeting to smart contract: ' + error;
            console.log(errorMsg);
            return;
        }
        console.log('submitted new greeting to blockchain, transaction hash: ' + txHash);
    });
}

//get and Set Balance
function setBalanceText(){
    contractInstance.myBalance(function(error, result) {
        if (error) {
            var errorMsg = 'error reading greeting from smart contract: ' + error;
            console.log(errorMsg);
            return;
        }
        $('#myBalance').html(""+ result + "  Healthcoins");
    });
}

//If its a Center, modify View
//Really dirty solution: I would rather work with 2 different html views, partial Views (if I've worked with ASP.Net MVC) or 2 divs
function prepareCenterView(){
    contractInstance.getTypeId.call(web3.eth.defaultAccount, function(error, result) {
        if (error) {
            alert("there was a problem with validating your Account. We're really sorry...");
            return;
        }
        if(result.toString() === "2"){
            //it is a Center
            isCenter = true;
            $('#OperationText').html("confirm Vaccination");
            $('#addressHospital').attr("placeholder", "Enter Patient Adress");
            $("#registerbtn").html('Confirm');
            $('#Welcome').text("Welcome dear Center...");
            $('#confirmVacc').hide(); //hide confirmation button
            $('#buyService').hide(); //hide service button
            $('#Donate').hide(); //hide donate button
            $('#balanceText').html("Vaccination Balance");
        }
        //else do nothing
    });
}
