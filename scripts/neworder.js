import { populateCompanySelect, populateStockTable, paginateTable } from './orderUtils.js';

document.addEventListener('DOMContentLoaded', async function() {
    const companySelect = document.getElementById('companySelect');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const stockTableContainer = document.getElementById('stockTableContainer');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    const paginationContainer = document.getElementById('paginationContainer');
    const cartContainer = document.getElementById('cartContainer');
    const cartList = document.getElementById('cartList');
    const totalAmount = document.getElementById('totalAmount');
    const finalizeOrderButton = document.getElementById('finalizeOrderButton');
    let cart = [];

    // Populate company select dropdown
    await populateCompanySelect(companySelect);

    // Handle company selection and populate stock table
    companySelect.addEventListener('change', async () => {
        const selectedCompany = companySelect.value;
        console.log('Company Selected', selectedCompany);

        if (selectedCompany) {
            await populateStockTable(selectedCompany, stockTableBody, stockTableContainer, confirmOrderButton, paginationContainer);
        } else {
            stockTableContainer.style.display = 'none';
            confirmOrderButton.style.display = 'none';
        }
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
});