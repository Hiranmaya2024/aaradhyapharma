
//staff.js
document.addEventListener('DOMContentLoaded', async () => {
    const stockTable = document.getElementById('stockTable');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const customerLedgerTable = document.getElementById('customerLedgerTable');
    const paginationContainerStock = document.getElementById('paginationContainerStock');
    const paginationContainerCustomer = document.getElementById('paginationContainerCustomer');

    // Check authentication
    if (!sessionStorage.getItem('isAuthenticated') || sessionStorage.getItem('userType') !== 'staff') {
        window.location.href = '../index.html';
        return;
    }

    // Load stock data
    const stockData = await window.getStocksData();
    stockData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        stockTable.querySelector('tbody').appendChild(tr);
    });
    paginateTable(stockTable, paginationContainerStock, 10); // Apply pagination

});


stockTableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-button')) {
        const item = event.target.getAttribute('data-item');
        const rate = parseFloat(event.target.getAttribute('data-rate'));
        const quantityInput = stockTableBody.querySelector(`.quantity-input[data-item="${item}"]`);
        const quantity = parseInt(quantityInput.value);
        if (quantity > 0) {
            cart.push({ item, rate, quantity });
            updateCart();
        } else {
            alert('Please enter a valid quantity.');
        }
    }
});

confirmOrderButton.addEventListener('click', () => {
    cartContainer.style.display = 'block';
    updateCart();
});

finalizeOrderButton.addEventListener('click', () => {
    const orderDetails = cart.map(item => `${item.quantity} x ${item.item} @ ${item.rate}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.rate * item.quantity, 0);
    const message = `Order Details:\n${orderDetails}\nTotal Amount: ${total}`;
    const whatsappUrl = `https://wa.me/9533762508?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

function updateCart() {
    cartList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.quantity} x ${item.item} @ ${item.rate}`;
        cartList.appendChild(li);
    });
    const total = cart.reduce((sum, item) => sum + item.rate * item.quantity, 0);
    totalAmount.textContent = `Total Amount: ${total}`;
}