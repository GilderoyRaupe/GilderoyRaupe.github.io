pragma solidity ^0.4.19;

contract vacTokenERC20 {
	// Public variables of the token
	address public owner = msg.sender; // replaces constructor
	string public name;
	string public symbol;
	uint8 public decimals = 18;
	// 18 decimals is the strongly suggested default, avoid changing it
	uint256 public totalSupply;
	uint256 public toll=1;     //could be used to deincentivize the cashOut
	uint256 public conversionfactor; //can be used to give sonme special value to the Tokens



	function setConversionfactor(uint256 amount) public { //change conversion factor(only by owner)
		require(owner==msg.sender);
		conversionfactor=amount;
	}

	//struct used to contain all information of addresses
	struct aData {
		uint256 balanceOf; //amount of token an address owns
		int typeId; // what kind of user the address is: 0 -> person, 1 -> vendor, 2 -> center
		int beenVac; // if the user is a person, this stores the vaccination status: 0 -> person, 1 -> registered, 2 -> vaccinated
		uint256 pendPayoutAmt; //used for paying out tokens later
	}

	mapping (address => bool) known;
	mapping (address => aData) public addressData;

	// checks if user is already known to the service
	function isKnown () public view returns (bool) {
		return known[msg.sender];
	}
	function init() public {
		addressData[msg.sender] = aData(0,0,0,0);
		known[msg.sender]=true;
	}

	// Debugging/testing functions - would not be present in a real version
	/*function addFunds(uint256 amount) public {
        addressData[msg.sender].balanceOf += amount;
    }*/


	function becomeCenter() public { //sets usertype to Center
		addressData[msg.sender].typeId = 2;
	}

	function incBalance() public { //increases Token Balance by 1
		addressData[msg.sender].balanceOf += 1;
	}
	//end of debu/testing functions

	//prints balance of current user
	function myBalance() view public returns (uint256) {
		return addressData[msg.sender].balanceOf;
	}

	function getTypeId(address user) view public returns (int) { //returns typeId of user
		return addressData[user].typeId;
	}

	//approves a user as Center type.
	function approveCenter(address cnt) public {
		require(msg.sender == owner);
		addressData[cnt].typeId = 2;
	}

	//called by user to register for an appointment to vaccinate.
	function getVaccinated(address hospital) public {
		require(0 == addressData[msg.sender].beenVac); //checks whether user has been vaccinated already
		require(addressData[hospital].typeId==2); //checks whether the target address is actually of type center
		//require(eth.getBalance(owner)>=totalSupply/conversionfactor); //will it be displayed as ether?
		addressData[msg.sender].beenVac=1; //sets users status to "registered for vaccination"
		// no buying process of the vaccination
		addressData[hospital].balanceOf+=1; //the token the user will receive later is created
	}

	//function called by the center after the vaccination has been done
	function gotVaccinated(address customer) public {
		require(1 == addressData[customer].beenVac); //checks to make sure user has been registered for vaccination
		addressData[customer].pendPayoutAmt = 1; //sets the amount of tokens to be payed out (only "1" for simplified example)
		addressData[msg.sender].balanceOf-=1; //the User can clame the token
	}

	//A viewfunction to check, before calling confVaccination
	function canConfirm() view public returns (bool){
		return (0!=addressData[msg.sender].pendPayoutAmt); //checks to make sure users vaccination has been confirmed by hospital
	}

	function confVaccination() public {
		require(0!=addressData[msg.sender].pendPayoutAmt); //checks to make sure users vaccination has been confirmed by hospital
		addressData[msg.sender].beenVac=2; //sets users stats to "been vaccinated"
		addressData[msg.sender].balanceOf += addressData[msg.sender].pendPayoutAmt; //hands the user the token
		addressData[msg.sender].pendPayoutAmt=0; //resets the pending payout of the user
	}

	//pay in function, to be used by donors
	function payIn() public payable {
		totalSupply+=msg.value*conversionfactor;
		addressData[this].balanceOf+=msg.value*conversionfactor;
	}

	/**
     * Constructor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
	function initvacTokenERC20(uint256 initialSupply,string tokenName,string tokenSymbol, uint256 tokpereth) public {
		// Defines how many Tokens get created per ether
		require(owner==msg.sender);
		if (tokpereth!=0) {
			conversionfactor = tokpereth;
		}
		else {
			conversionfactor = 10 ** uint256(decimals);        //// Defines how many Tokens get created per ether
		}
		totalSupply = initialSupply * conversionfactor;  // Update total supply with the decimal amount
		addressData[msg.sender].balanceOf = totalSupply;                // Give the creator all initial tokens
		name = tokenName;                                   // Set the name for display purposes
		symbol = tokenSymbol;                               // Set the symbol for display purposes
	}



	//NOT USED IN CURRENT VERSION
	function setToll(uint256 value) public { //change the toll (only by owner)
		require(owner==msg.sender);
		toll=value;
	}

	//approves a user as Vendor type.
	function approveVendor(address vnd) public {
		require(msg.sender == owner);
		addressData[vnd].typeId = 1;
	}

	// transfer tokens.
	function transfer(address recip, uint256 amount) public payable {
		require(addressData[msg.sender].balanceOf>=amount);
		addressData[msg.sender].balanceOf -=amount;
		addressData[recip].balanceOf +=amount;
	}


	function becomeVendor() public { //sets usertype to Vendor.
		addressData[msg.sender].typeId = 1;
	}

	function becomePerson() public { //sets usertype to Person
		addressData[msg.sender].typeId = 0;
	}

	//Cash out function.
	function cashOut(uint256 amount) public {
		require(1 == addressData[msg.sender].typeId); //checks to see if sender is actually vendor
		if (amount==0){ //if "0" is payout amount send, pay out everything
			totalSupply -= addressData[msg.sender].balanceOf;                      // Updates totalSupply
			msg.sender.transfer(addressData[msg.sender].balanceOf/conversionfactor);//pays the tokens value in ethereum to the sender
			addressData[msg.sender].balanceOf=0; //resets the senders balance
		}
		else{
			require(addressData[msg.sender].balanceOf >= amount);   // Check if the sender has enough
			addressData[msg.sender].balanceOf -= amount;            // Subtract from the sender
			totalSupply -= amount;                      // Updates totalSupply
			addressData[owner].balanceOf -= amount;
			msg.sender.transfer(amount*toll/conversionfactor);
		}

	}
}