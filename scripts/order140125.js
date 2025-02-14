document.addEventListener('DOMContentLoaded', async function() {
   // const companySelect = document.getElementById('companySelect');
 //   const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const stockTableContainer = document.getElementById('stockTableContainer');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    let cart = [];
    const paginationContainer = document.getElementById('paginationContainer');
    const cartContainer = document.getElementById('cartContainer');
    const cartList = document.getElementById('cartList');
    const totalAmount = document.getElementById('totalAmount');
    const finalizeOrderButton = document.getElementById('finalizeOrderButton');

    // Fetch company names and populate the dropdown
    const loadingIndicator = document.getElementById('loadingIndicator');
  //  loadingIndicator.style.display = 'block';
  //  const stockData = await window.getStocksData();
  //  document.addEventListener('DOMContentLoaded', async function() {
        const companySelect = document.getElementById('companySelect');
        const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
        const itemImage = document.getElementById('itemImage');
       // let stockData = [];
    
        // Function to load stock data
       async function loadStockData() {
            stockData = await window.getStocksData(); // Replace with actual data fetching logic
            const companyNames = [...new Set(stockData.map(row => row[0]))];
            console.log('Stock data', stockData);
            console.log('Company Names', companyNames);
            companyNames.forEach(company => {
                const option = document.createElement('option');
                option.value = company;
                option.textContent = company;
                companySelect.appendChild(option);
            });
        }
    
        // Load stock data
        loadStockData();
    
        companySelect.addEventListener('change', () => {
            const selectedCompany = companySelect.value;
            console.log('Company Selected', selectedCompany);
    
            if (selectedCompany) {
                const companyItems = stockData.filter(row => row[0] === selectedCompany && parseFloat(row[6]) > 0);
                stockTableBody.innerHTML = ''; // Clear existing rows
                companyItems.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="item-name" data-image="${item[7]}">${item[1]}</td>
                        <td>${item[2]}</td>
                        <td>${item[3]}</td>
                        <td>${item[4]}</td>
                        <td>${item[5]}</td>
                        <td>${item[6]}</td>
                        <td><input type="number" class="form-control quantity-input quantity-input-small" data-item="${item[1]}" data-rate="${item[2]}" min="1"></td>
                        <td><button class="btn btn-sm btn-primary add-to-cart-button" data-item="${item[1]}" data-rate="${item[2]}">Add</button></td>
                    `;
                    stockTableBody.appendChild(tr);
                });
            }
        });
    
        // Event listener for item name clicks
        stockTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('item-name')) {
                const imageUrl = event.target.getAttribute('data-image');
                console.log('Image URL:', 'images/image1.PNG'); // Debugging statement
                itemImage.src = imageUrl;
                itemImage.style.display = 'block';
            }
        });
    });
   //         console.log('TableBasedOnCompanySelected', companyItems);
     //       stockTableContainer.style.display = 'block';
     //       confirmOrderButton.style.display = 'block';
     //   //    paginateTable(document.getElementById('stockTable'), paginationContainer, 10); // Apply pagination
     //   } else {
    //        stockTableContainer.style.display = 'none';
    //        confirmOrderButton.style.display = 'none';
    //    }
               
      //  paginateTable(document.getElementById('stockTable'), paginationContainer, 10); // Apply pagination

   // });


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
    };