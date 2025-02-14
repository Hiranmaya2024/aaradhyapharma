document.addEventListener('DOMContentLoaded', async () => {
    //const username = sessionStorage.getItem('username');
       // Fetch the username from session storage
       const username = sessionStorage.getItem('username');
       console.log('Fetched username from sessionStorage:', username);
       
       const customerNameElement = document.getElementById('customer-name');
       if (customerNameElement) {
           customerNameElement.textContent = username || 'Guest'; // Fallback to 'Guest' if username is null
       }
   
   
   

     
       // Load customer ledger
      // document.addEventListener('DOMContentLoaded', async () => {
        try {
            const customerData = await window.getCustomerLedger();
            const username = sessionStorage.getItem('username');
            const userLedger = customerData.filter(row => row[0] === username);
    
            const transactionList = document.getElementById("transaction-list");
            transactionList.innerHTML = "";
    
            userLedger.forEach((row) => {
                const detail = row[3];
                const date = row[1];
                const amount = row[5];
                const transactionItem = document.createElement("div");
                transactionItem.className = "transaction-item";
                transactionItem.innerHTML = `
                    <div class="transaction-detail">
                        <strong>${detail}</strong>
                        <p>Date: ${date}</p>
                    </div>
                    <div class="transaction-amount">$${amount}</div>
                `;
                transactionList.appendChild(transactionItem);
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    });