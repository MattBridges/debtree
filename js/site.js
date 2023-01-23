// Get the Inputs-Entry
function GetValues(){
  let loanAmount =parseInt(document.getElementById('loanAmount').value);
  let termLength = parseInt(document.getElementById('termLength').value);
  let interestRate = parseFloat(document.getElementById('interestRate').value);


  calculateTotals(loanAmount,interestRate,termLength);

}

// Calculate the results

function calculateTotals(loanAmt, interest, termLength){
  let loanData=[];
 
  //Get Initial Values
  let payment = CalculateTotalMonthlyPayment(loanAmt,interest,termLength);
  let currentPrincipal = 0;
  let currentInterest = 0;
  let totalInterest = 0;
  let balance = loanAmt;
  let previousMonthsBalance = balance; 

  
  //loop through each month
  for(let i=1;i<=termLength;i++){
    currentInterest = CalculateInterestPayment(balance,interest);
    currentPrincipal = payment-currentInterest;
    totalInterest +=currentInterest;
    balance -= currentPrincipal;

    let monthlyData = {
      month:i,
      payment:payment,
      principal:currentPrincipal,
      interest:currentInterest,
      totalInterest:totalInterest,
      balance:balance
    }
    previousMonthsBalance = monthlyData.balance;
    loanData.push(monthlyData);

  }

  DisplayTotalResults(loanData,loanAmt);

}

// Display Results
function DisplayTotalResults(loanPmtData, loanAmount){
  let totalPrincipal = parseFloat(document.getElementById('loanAmount').value);
  let totalInterest = parseFloat(loanPmtData[loanPmtData.length-1].totalInterest);
  let totalCost = parseFloat(totalPrincipal)+parseFloat(totalInterest);

  document.getElementById('totalPayment').textContent = parseFloat(loanPmtData[0].payment).toLocaleString('en-US', {style:'currency',currency:'USD'});
  document.getElementById('totalPrincipal').textContent = totalPrincipal.toLocaleString('en-US', {style:'currency',currency:'USD'});
  document.getElementById('totalInterest').textContent = totalInterest.toLocaleString('en-US', {style:'currency',currency:'USD'});
  document.getElementById('totalCost').textContent = totalCost.toLocaleString('en-US', {style:'currency',currency:'USD'});



  /*-------------------------Build Table--------------------------------*/
  let resultsTable = document.getElementById('resultsTableBody');
  const resultsRowTemplate = document.getElementById('resultsRowTemplate');

  //Clear the table
  resultsTable.innerHTML='';

  //Loop through each payment to build the chart
  for(let i=0; i<loanPmtData.length; i++){
   let resultsRow = document.importNode(resultsRowTemplate.content,true);
   let currentMonth = loanPmtData[i];

    let resultCells = resultsRow.querySelectorAll('td');

    //Build row
    resultCells[0].textContent = currentMonth.month;
    resultCells[1].textContent= currentMonth.payment.toFixed(2);
    resultCells[2].textContent=currentMonth.principal.toFixed(2);
    resultCells[3].textContent=currentMonth.interest.toFixed(2);
    resultCells[4].textContent=currentMonth.totalInterest.toFixed(2);
    resultCells[5].textContent=currentMonth.balance.toFixed(2);

    //Append new row to the results table
    resultsTable.appendChild(resultsRow);
    
  }
}


// Provided Formulas
function CalculateTotalMonthlyPayment(amountLoaned, rate, numberOfMonths){
  return (amountLoaned*(rate/1200))/(1-(1+rate/1200)**-numberOfMonths);
}

function CalculateInterestPayment(previousRemainingBalance, rate){
  return previousRemainingBalance*(rate/1200)
}

