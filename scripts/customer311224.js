document.addEventListener('DOMContentLoaded', async () => {
    const ledgerTable = document.getElementById('ledgerTable');
    const paginationContainer = document.getElementById('paginationContainer');
    const username = sessionStorage.getItem('username');
    //cconsole.log('Fetched username from sessionStorage:', username); // Add this line to log the username
    const welcomeMessage = document.getElementById('welcome-message');
    const totalBalance = document.getElementById('current-due');
    //const sumFilteredSales = document.getElementById('default-due');
    const lastOrderDate = document.getElementById('last-order-date');
    const lastOrderId = document.getElementById('last-order-id');
    const lastOrderAmount = document.getElementById('last-order-amount');
    const lastPaymentDate = document.getElementById('last-payment-date');
    const lastPaymentId = document.getElementById('last-payment-id');
    const lastPaymentAmount = document.getElementById('last-payment-amount');
    const viewLedger = document.getElementById('view-ledger');
    const ledgerContainer = document.getElementById('ledgerContainer');
    const payButton = document.getElementById('payButton');

    // Check authentication
    if (!sessionStorage.getItem('isAuthenticated') || sessionStorage.getItem('userType') !== 'customer') {
        window.location.href = '../index.html';
        return;
    }

  //  welcomeMessage.textContent = `Hello, ${username}!`;

    // Load customer ledger
    const ledger = await window.getLedger();
    const userLedger = ledger.filter(row => row[0] === username);
    const userLedger1 = ledger.filter(row => row[0] === username);
    if (userLedger.length > 0) {
        // Display total outstanding balance
        //const lastRow = userLedger[userLedger.length - 1];
       // totalBalance.textContent = `Your Total Outstanding Balance is: ${lastRow[lastRow.length - 4]}`;
     // Calculate total balance
     let totalDebit = 0;
     let totalCredit = 0;

     userLedger.forEach(row => {
         const description = row[2];
         const debit = parseFloat(row[4]) || 0;
         const credit = parseFloat(row[5]) || 0;

         if (description === 'sale') {
             totalDebit += debit;
         } else if (description === 'Rcpt') {
             totalCredit += credit;
         }
     });

     const totalBalanceAmount = totalDebit - totalCredit;
     totalBalance.textContent = `Your Total Outstanding Balance is: ${totalBalanceAmount.toFixed(2)}`;
 
        // Find last order
        const today = new Date();
        const todayTimestamp = today.getTime();

        // Ensure consistent parsing of DD/MM/YYYY format
        function parseDate(dateString) {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}T00:00:00`);
        }

        // Filter rows where the Type is 'Sale'
        const filteredSales = userLedger.filter(row => row[2] === 'Sale');




        // Log the filtered sales data to the console
        console.log('***Filtered Sales Data:', filteredSales);

        // Find the row with the minimum difference between today's date and row[1] date
        const closestRow = filteredSales
            .map(row => {
                const rowDate = parseDate(row[1]);
                const rowTimestamp = rowDate.getTime();
                const diff = Math.abs(todayTimestamp - rowTimestamp);
                return { row, date: rowDate, diff };
            })
            .sort((a, b) => a.diff - b.diff)[0];

        // Log the closest row data to the console
        console.log('Closest Row Data:', closestRow);

        if (closestRow) {
            lastOrderDate.textContent = `${closestRow.row[1]}`;
            lastOrderId.textContent = `${closestRow.row[3]}`;
            lastOrderAmount.textContent = `${closestRow.row[4]}`;
        } else {
            lastOrderDate.textContent = 'No orders found.';
            lastOrderId.textContent = 'No orders found.';
            lastOrderAmount.textContent = 'No orders found.';
        }
        

        // Find last Payment
        const today1 = new Date();
        const todayTimestamp1 = today1.getTime();

        // Filter rows where the Type is 'Pymt'
        const filteredPymt = userLedger1.filter(row => row[2] === 'Rcpt');

        // Log the filtered sales data to the console
        console.log('Filtered Payments Data:', filteredPymt);

        // Find the row with the minimum difference between today's date and row[1] date
        const closestRow1 = filteredPymt
            .map(row => {
                const rowDate1 = parseDate(row[1]);
                const rowTimestamp1 = rowDate1.getTime();
                const diff1 = Math.abs(todayTimestamp - rowTimestamp1);
                return { row, date: rowDate1, diff1 };
            })
            .sort((a, b) => a.diff1 - b.diff1)[0];

        // Log the closest row data to the console
        console.log('Closest Row Data:', closestRow1);

        if (closestRow) {
            lastPaymentDate.textContent = `${closestRow1.row[1]}`;
            lastPaymentId.textContent = `${closestRow1.row[3]}`;
            lastPaymentAmount.textContent = `${closestRow1.row[5]}`;
        } else {
            lastPaymentDate.textContent = 'No orders found.';
            lastPaymentId.textContent = 'No orders found.';
            lastPaymentAmount.textContent = 'No orders found.';
        }
    }
        const userLedger2 = ledger.filter(row => row[0] === username);
    console.log('Filtered Data:', userLedger2);
    userLedger2.forEach(row => {
        const tr = document.createElement('tr');
      //  row.slice(1).forEach(cell => {
       //     const td = document.createElement('td');
        //    td.textContent = cell;
       //     tr.appendChild(td);
        // Fetch specific elements: 2nd to 6th, 8th, and 9th
    const selectedCells = [row[1], row[2], row[3], row[4], row[5], row[6], row[8],row[9]];
    selectedCells.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
        });
        ledgerTable.querySelector('tbody').appendChild(tr);
    });
    paginateTable(ledgerTable, paginationContainer, 10); // Apply pagination
//customer information
// Define the dynamic src value
//const dynamicSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.274257380938!2d-70.56068388481569!3d41.45496659976631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e52963ac45bbcb%3A0xf05e8d125e82af10!2sDos%20Mas!5e0!3m2!1sen!2sus!4v1671220374408!5m2!1sen!2sus";

// Set the src attribute dynamically
const dynamicSrc= document.getElementById("map-frame")
const mapId= document.getElementById("map-id")
const customernam = document.getElementById('customer-nam');
const customerrname= document.getElementById('customer-name');
const address = document.getElementById('customer-address');
const phone = document.getElementById('customer-phone');
const shopName = document.getElementById('shop-name');
const tourday = document.getElementById('tour-day');
const nextVisit = document.getElementById('next-visit');
if (!customerrname || !address || !phone || !shopName || !tourday || !nextVisit) {
    console.error('One or more customer info elements not found.');
    return;
}

try {
    const ledgr = await window.getCustomerLedger();
    const userLedgr = ledgr.find(row => row[0] === username);
    console.log('Customer Data with elements:', userLedgr);
    if (userLedgr) {
        tourday.textContent = userLedgr[5] || 'No Data found.';
        shopName.textContent = userLedgr[6] || 'No Data found.';
        address.textContent = userLedgr[7] || 'No Data found.';
        customerrname.textContent = userLedgr[8] || 'No Data found.';
        phone.textContent = userLedgr[9] || 'No Data found.';
        const dynamicSrc = userLedgr[10] || 'No Data found.';
        customernam.textContent = userLedgr[8];
       // sessionStorage.setItem('username', username);
        //mapId.textContent = userLedgr[10] || 'No Data found.';
        document.getElementById("map-frame").src = dynamicSrc;
                    // Compare TourDay with today's day
                    const tourDayValue = userLedgr[5];
                    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const today = new Date();
                    const todayDay = daysOfWeek[today.getDay()];
                    sessionStorage.setItem('customer-name', customerrname);
                    sessionStorage.setItem('shop-name', shopName);
                    if (tourDayValue === todayDay) {
                        nextVisit.textContent = today.toLocaleDateString();
                    } else {
                        let nextDate = new Date(today);
                        for (let i = 1; i <= 7; i++) {
                            nextDate.setDate(today.getDate() + i);
                            if (daysOfWeek[nextDate.getDay()] === tourDayValue) {
                                nextVisit.textContent = nextDate.toLocaleDateString();
                                break;
                            }
                        }
                    }
    } else {
        tourday.textContent = 'No Data found.';
        customerrname.textContent = 'No Data found.';
        address.textContent = 'No Data found.';
        phone.textContent = 'No Data found.';
        shopName.textContent = 'No Data found.';
        //mapId.textContent = 'No Data found.';
    }
} catch (error) {
    console.error('Error fetching customer ledger:', error);
    customerrname.textContent = 'Error fetching data.';
    address.textContent = 'Error fetching data.';
    phone.textContent = 'Error fetching data.';
    shopName.textContent = 'Error fetching data.';
}
 });


