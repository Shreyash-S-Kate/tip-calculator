const billInput=document.getElementById('bill-input');//bill amt input field

const tipButtons=document.querySelectorAll('.tip-percent-btn');//Select all predefined tip percent buttons,querySelectorAll because there are multiple buttons with the class 'tip-percent-btn'.

const customTipInput=document.getElementById('custom-tip');//Select custom tip percent input field

const peopleInput=document.getElementById('num-people');//Select the number of people input field

const tipAmountDisplay=document.getElementById('tip-amount-display');//tip amount per person will be displayed

const totalAmountDisplay=document.getElementById('total-amount-display');//total amount per person will be displayed

const resetButton=document.getElementById('reset-button');//Select the Reset button


// Listen to entered input
billInput.addEventListener('input', calculateTip)


// Listen to tip button input
tipButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
        // Remove active class from all buttons
        tipButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Clear custom tip input
        if (customTipInput.value) {
            customTipInput.value = '';
        }
        // Trigger calculation
        calculateTip();
    });
});

// Listen to custom tip input focus
customTipInput.addEventListener('focus', function() {
    // Remove active class from all tip buttons when custom input is focused
    tipButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    // Clear any existing value if a button was previously selected
    if (document.querySelector('.tip-percent-btn.active')) {
        this.value = '';
    }
});

// Listen to custom tip input
customTipInput.addEventListener('input', function() {
    // Ensure no button is active when typing in custom tip
    tipButtons.forEach(btn => btn.classList.remove('active'));
    // Trigger calculation
    calculateTip();
});

//Listen to number of people entered
peopleInput.addEventListener('input',calculateTip);

//checking for reset button and clicking
if(resetButton){
    resetButton.addEventListener('click',function(event){ 
        resetCalculator();
    });
}


//calculateTip function for calculating tips 

function calculateTip(){

    const billValuestr= billInput.value; //getting raw string from bill input field
    const peopleValuestr=peopleInput.value; //getting value of no. of people
    const customTipValuestr=customTipInput.value; //getting custom tip percentage entered by user
    let selectedButtonTipstr=null;
    const activeButton=document.querySelector('.tip-percent-btn.active'); //finding button with active class
    if(activeButton){
        selectedButtonTipstr=activeButton.dataset.tip; //if button is active , get its percent from 'data-tip' 
    }


    //converting of obtained string value to float value is done using parseFloat function in js
    const billValue=parseFloat(billValuestr);
    const numOfPeople=parseFloat(peopleValuestr);
    const customTip=parseFloat(customTipValuestr);
    const selectedButtonTip=selectedButtonTipstr ? parseFloat(selectedButtonTipstr) : null;

    const isbillValid= !isNaN(billValue) && billValue>=0;//checking if entered bill amt is valid number and not negative number
    const isCustomTipValid = customTipValuestr === '' || (!isNaN(customTip) && customTip >= 0); //checking if custom tip input is valid and not negative
    const ispeopleValid=!isNaN(numOfPeople) && numOfPeople>=0 && Number.isInteger(numOfPeople);// checking if people entered is valid or not

    //checking if tip percent is valid or not
    let actualTipPercent=0;
    if (customTipValuestr !== '' && !isNaN(customTip) && customTip >= 0) {
         actualTipPercent = customTip;
    } 
    else if (customTipValuestr === '') { // If custom input is empty, check buttons
        const activeButton = document.querySelector('.tip-percent-btn.active');
        if (activeButton) {
            const selectedButtonTipPercent = parseFloat(activeButton.dataset.tip);
            if (!isNaN(selectedButtonTipPercent) && selectedButtonTipPercent >= 0) {
                actualTipPercent = selectedButtonTipPercent;
            }
        }
    } 

    const istipValid= !isNaN(actualTipPercent) && actualTipPercent >= 0; //checking if tip percent is valid and not negative 

    //getting tip value by calculations
    let totalTipAmount=0;
    if (isbillValid && istipValid) {
        totalTipAmount = billValue * (actualTipPercent / 100);
    }

    //calculating total bill amt with tip 
    let totalBill=0;
    if (isbillValid) { 
        totalBill = billValue + totalTipAmount;
    }

    //calculating tip amt per person
    let tipPerPerson=0;

    //calculating total amt per person
    let amtPerPerson=0;
    
    if (isbillValid && istipValid && ispeopleValid) {
        if (!isNaN(totalBill)) { 
            tipPerPerson = totalTipAmount /numOfPeople;
            amtPerPerson = totalBill / numOfPeople;
        } else {
             // This case should ideally not be reached if isBillValid is false when billAmount is NaN.
             // But as a fallback, ensure per-person amounts are 0.
             tipPerPerson = 0;
             amtPerPerson = 0;
             console.warn("Error");
        }
    } else {
        // One or more inputs are invalid. Per-person amounts remain 0.
        // Log a warning to the console for debugging.
        if (!ispeopleValid) {
             console.warn(`Cannot calculate as invalid people input.`);
        } else if (!isBillValid) {
             console.warn("Cannot calculate as invalid bill input.");
        } else if (!istipValid) {
             console.warn("Cannot calculate as invalid tip input.");
        }
    }


    //formatting tip and total amt by rounding off to 2 decimal places
    const formattedTip=tipPerPerson.toFixed(2);
    const formattedTotal=amtPerPerson.toFixed(2);
    const displayTip=`₹${formattedTip}`;
    const displayTotal=`₹${formattedTotal}`;

    //checking if element exists
    if(tipAmountDisplay){
        tipAmountDisplay.textContent=displayTip;
    }
    
    if(totalAmountDisplay){
        totalAmountDisplay.textContent=displayTotal;
    }
    
    //adding error class
    if(billInput){
        billInput.classList.toggle(`error`,!isbillValid);
    }
    if(peopleInput){
        peopleInput.classList.toggle(`error`,!ispeopleValid);
    }
    if(customTipInput){
        customTipInput.classList.toggle(`error`,!isCustomTipValid);
    }



    console.log("Tip per person:",displayTip);
    console.log("Total amt per person:",displayTotal);
}

//function to reset everything to initial (zero) state
function resetCalculator(){
    

    if(billInput){
        billInput.value='';
        console.log("Bill input reset to empty");
    }
    else{
        console.error("Error: billInput not found");
    }
    if(customTipInput){
        customTipInput.value='';
        console.log("Custom tip input reset to empty");
    }
    else{
        console.log("Error: Custom tip not found");
    }
    if(peopleInput){
        peopleInput.value='';
        console.log("People reset to empty");
    }
    else{
        console.log("Error: People input not found");
    }
    if(tipButtons && tipButtons.length>0){
        tipButtons.forEach(function(button){
            button.classList.remove(`active`);
        });
        console.log("Active class removed from tip buttons");
    }
    else if(tipButtons){
        console.log("No tip buttons to reset");
    }
    else{
        console.error("Error: tip buttons not found");
    }
    if(tipAmountDisplay){
        tipAmountDisplay.textContent='₹0.00';
        console.log("Tip per person reset");
    }
    else{
        console.log("Error: Tip per person not found");
    }
    if(totalAmountDisplay){
        totalAmountDisplay.textContent='₹0.00'
        console.log("Total amt per person reset");
    }
    else{
        console.log("Error: Total amt per person not found");
    }

    if(billInput){
        billInput.classList.remove('error');
        console.log('Error styling removed from bill input.');
    }
    if(customTipInput){
        customTipInput.classList.remove('error');
        console.log('Error styling removed from custom tip input');
    }
    if(peopleInput){
        peopleInput.classList.remove('error');
        console.log('Error styling removed from people input');
    }
    console.log("Calculator is reset");
}

document.addEventListener('DOMContentLoaded', calculateTip);// sets everything to 0 initially when page loads
