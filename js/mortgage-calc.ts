interface MonthlyPayment {
    month: number;
    principal: number;
    interest: number;
    totalInterest: number;
    remainingBalance: number;
}

interface LoanTotals {
    monthlyPayment: number;
    principal: number;
    interest: number;
    cost: number;
}

function getValues() {
    let amountInput = document.getElementById('amount') as HTMLInputElement
    let termInput = document.getElementById('term') as HTMLInputElement
    let rateInput = document.getElementById('rate') as HTMLInputElement

    let amount = Number(amountInput.value);
    let term = Number(termInput.value);
    let rate = Number(rateInput.value) / 1200;

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
    termInput.placeholder = `${term} months`;

    rateInput.placeholder = `${rateInput.value}%`
    rateInput.value = '';

    let loanTotals = calculateTotals(amount, term, rate);
    displayTotals(loanTotals);

    let payments = calculatePayments(loanTotals.monthlyPayment, amount, term, rate);
    displayPayments(loanTotals.monthlyPayment, payments);
}

function calculateTotals(amount: number, term: number, rate: number): LoanTotals {
    let monthlyPayment = (amount * rate) / (1 - Math.pow((1 + rate), -term));

    let loanTotals: LoanTotals = {
        monthlyPayment: monthlyPayment,
        principal: amount,
        interest: (monthlyPayment * term) - amount,
        cost: monthlyPayment * term
    };

    return loanTotals;
}

function calculatePayments(monthlyPayment: number, amount: number, term: number, rate: number): ReadonlyArray<MonthlyPayment> {
    let payments: MonthlyPayment[] = [];
    
    for (let index = 0; index < term; index++) {
        let previousBalance = (index === 0 ? amount : payments[index - 1].remainingBalance);
        let previousTotalInterest = (index === 0 ? 0 : payments[index - 1].totalInterest);

        let interestPayment = previousBalance * rate;
        let principalPayment = monthlyPayment - interestPayment;
        let remainingBalance = previousBalance - principalPayment;
        let totalInterest = previousTotalInterest + interestPayment;

        if (remainingBalance < 0) remainingBalance = 0;

        let payment: MonthlyPayment = {
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

function displayTotals({ monthlyPayment, principal, interest, cost }: LoanTotals) {
    let stringOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
    }

    let monthlyPaymentString = monthlyPayment.toLocaleString('en-US', stringOptions);
    let principalString = principal.toLocaleString('en-US', stringOptions);
    let interestString = interest.toLocaleString('en-US', stringOptions);
    let costString = cost.toLocaleString('en-US', stringOptions);

    document.getElementById('monthly-payment')!.textContent = monthlyPaymentString;
    document.getElementById('total-principal')!.textContent = principalString;
    document.getElementById('total-interest')!.textContent = interestString;
    document.getElementById('total-cost')!.textContent = costString;

    document.getElementById('instructions')?.classList.add('d-none');
    document.getElementById('totals')?.classList.remove('d-none');
}

function displayPayments(monthlyPayment: number, payments: ReadonlyArray<MonthlyPayment>) {
    let options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'USD',
    };

    let paymentTemplate = document.getElementById('payment-row') as HTMLTemplateElement;
    let paymentTable = document.getElementById('loan-table') as HTMLTableElement;
    paymentTable.innerHTML = '';

    payments.forEach(payment => {
        let row = document.importNode(paymentTemplate.content, true);
        let cells = row.querySelectorAll('td');

        cells[0].textContent = payment.month.toString();
        cells[1].textContent = monthlyPayment.toLocaleString('en-US', options);
        cells[2].textContent = payment.principal.toLocaleString('en-US', options);
        cells[3].textContent = payment.interest.toLocaleString('en-US', options);
        cells[4].textContent = payment.totalInterest.toLocaleString('en-US', options);
        cells[5].textContent = payment.remainingBalance.toLocaleString('en-US', options);

        paymentTable.appendChild(row);
    });

    document.querySelector('.table-responsive')?.classList.remove('d-none');
    paymentTable.lastElementChild?.classList.add('table-success');
}

function resetView() {
    document.querySelector('form')?.reset();

    let amountInput = document.getElementById('amount') as HTMLInputElement;
    let termInput = document.getElementById('term') as HTMLInputElement;
    let rateInput = document.getElementById('rate') as HTMLInputElement;

    amountInput.placeholder = 'Enter a loan amount';
    termInput.placeholder = 'Enter loan term in months';
    rateInput.placeholder = 'APR %';

    document.querySelector('.table-responsive')?.classList.add('d-none');
    document.getElementById('totals')?.classList.add('d-none');
    document.getElementById('instructions')?.classList.remove('d-none');
}