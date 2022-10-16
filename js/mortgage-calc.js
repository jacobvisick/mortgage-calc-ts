function getValues() {
    var amountInput = document.getElementById('amount');
    var termInput = document.getElementById('term');
    var rateInput = document.getElementById('rate');
    var amount = Number(amountInput.value);
    var term = Number(termInput.value);
    var rate = Number(rateInput.value) / 1200;
    if (!amount || !term || !rate || isNaN(amount) || isNaN(term) || isNaN(rate)) {
        // @ts-ignore
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Please enter valid numbers for loan details'
        });
        return;
    }
    amountInput.value = '';
    amountInput.placeholder = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    termInput.value = '';
    termInput.placeholder = "".concat(term, " months");
    rateInput.placeholder = "".concat(rateInput.value, "%");
    rateInput.value = '';
    var loanTotals = calculateTotals(amount, term, rate);
    displayTotals(loanTotals);
    var payments = calculatePayments(loanTotals.monthlyPayment, amount, term, rate);
    displayPayments(loanTotals.monthlyPayment, payments);
}
function calculateTotals(amount, term, rate) {
    var monthlyPayment = (amount * rate) / (1 - Math.pow((1 + rate), -term));
    var loanTotals = {
        monthlyPayment: monthlyPayment,
        principal: amount,
        interest: (monthlyPayment * term) - amount,
        cost: monthlyPayment * term
    };
    return loanTotals;
}
function calculatePayments(monthlyPayment, amount, term, rate) {
    var payments = [];
    for (var index = 0; index < term; index++) {
        var previousBalance = (index === 0 ? amount : payments[index - 1].remainingBalance);
        var previousTotalInterest = (index === 0 ? 0 : payments[index - 1].totalInterest);
        var interestPayment = previousBalance * rate;
        var principalPayment = monthlyPayment - interestPayment;
        var remainingBalance = previousBalance - principalPayment;
        var totalInterest = previousTotalInterest + interestPayment;
        if (remainingBalance < 0)
            remainingBalance = 0;
        var payment = {
            month: index + 1,
            principal: principalPayment,
            interest: interestPayment,
            totalInterest: totalInterest,
            remainingBalance: remainingBalance
        };
        payments.push(payment);
    }
    return payments;
}
function displayTotals(_a) {
    var _b, _c;
    var monthlyPayment = _a.monthlyPayment, principal = _a.principal, interest = _a.interest, cost = _a.cost;
    var stringOptions = {
        style: 'currency',
        currency: 'USD'
    };
    var monthlyPaymentString = monthlyPayment.toLocaleString('en-US', stringOptions);
    var principalString = principal.toLocaleString('en-US', stringOptions);
    var interestString = interest.toLocaleString('en-US', stringOptions);
    var costString = cost.toLocaleString('en-US', stringOptions);
    document.getElementById('monthly-payment').textContent = monthlyPaymentString;
    document.getElementById('total-principal').textContent = principalString;
    document.getElementById('total-interest').textContent = interestString;
    document.getElementById('total-cost').textContent = costString;
    (_b = document.getElementById('instructions')) === null || _b === void 0 ? void 0 : _b.classList.add('d-none');
    (_c = document.getElementById('totals')) === null || _c === void 0 ? void 0 : _c.classList.remove('d-none');
}
function displayPayments(monthlyPayment, payments) {
    var _a, _b;
    var options = {
        style: 'currency',
        currency: 'USD'
    };
    var paymentTemplate = document.getElementById('payment-row');
    var paymentTable = document.getElementById('loan-table');
    paymentTable.innerHTML = '';
    payments.forEach(function (payment) {
        var row = document.importNode(paymentTemplate.content, true);
        var cells = row.querySelectorAll('td');
        cells[0].textContent = payment.month.toString();
        cells[1].textContent = monthlyPayment.toLocaleString('en-US', options);
        cells[2].textContent = payment.principal.toLocaleString('en-US', options);
        cells[3].textContent = payment.interest.toLocaleString('en-US', options);
        cells[4].textContent = payment.totalInterest.toLocaleString('en-US', options);
        cells[5].textContent = payment.remainingBalance.toLocaleString('en-US', options);
        paymentTable.appendChild(row);
    });
    (_a = document.querySelector('.table-responsive')) === null || _a === void 0 ? void 0 : _a.classList.remove('d-none');
    (_b = paymentTable.lastElementChild) === null || _b === void 0 ? void 0 : _b.classList.add('table-success');
}
function resetView() {
    var _a, _b, _c, _d;
    (_a = document.querySelector('form')) === null || _a === void 0 ? void 0 : _a.reset();
    var amountInput = document.getElementById('amount');
    var termInput = document.getElementById('term');
    var rateInput = document.getElementById('rate');
    amountInput.placeholder = 'Enter a loan amount';
    termInput.placeholder = 'Enter loan term in months';
    rateInput.placeholder = 'APR %';
    (_b = document.querySelector('.table-responsive')) === null || _b === void 0 ? void 0 : _b.classList.add('d-none');
    (_c = document.getElementById('totals')) === null || _c === void 0 ? void 0 : _c.classList.add('d-none');
    (_d = document.getElementById('instructions')) === null || _d === void 0 ? void 0 : _d.classList.remove('d-none');
}
