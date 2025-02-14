document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentDetailsDiv = document.getElementById('paymentDetails');

    paymentMethodSelect.addEventListener('change', () => {
        const selectedMethod = paymentMethodSelect.value;
        let paymentDetailsHtml = '';

        switch (selectedMethod) {
            case 'upi':
                paymentDetailsHtml = `
                    <label for="upiId">UPI ID:</label>
                    <input type="text" id="upiId" name="upiId" placeholder="Enter your UPI ID">
                `;
                break;
            case 'debitCard':
                paymentDetailsHtml = `
                    <label for="debitCardNumber">Debit Card Number:</label>
                    <input type="text" id="debitCardNumber" name="debitCardNumber" placeholder="Enter your Debit Card Number">
                    <label for="debitCardExpiry">Expiry Date:</label>
                    <input type="text" id="debitCardExpiry" name="debitCardExpiry" placeholder="MM/YY">
                    <label for="debitCardCvv">CVV:</label>
                    <input type="text" id="debitCardCvv" name="debitCardCvv" placeholder="Enter CVV">
                `;
                break;
            case 'creditCard':
                paymentDetailsHtml = `
                    <label for="creditCardNumber">Credit Card Number:</label>
                    <input type="text" id="creditCardNumber" name="creditCardNumber" placeholder="Enter your Credit Card Number">
                    <label for="creditCardExpiry">Expiry Date:</label>
                    <input type="text" id="creditCardExpiry" name="creditCardExpiry" placeholder="MM/YY">
                    <label for="creditCardCvv">CVV:</label>
                    <input type="text" id="creditCardCvv" name="creditCardCvv" placeholder="Enter CVV">
                `;
                break;
        }

        paymentDetailsDiv.innerHTML = paymentDetailsHtml;
    });

    // Trigger change event to load initial payment details
    paymentMethodSelect.dispatchEvent(new Event('change'));
});