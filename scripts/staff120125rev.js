document.addEventListener('DOMContentLoaded', async () => {
    const todayDayElement = document.getElementById('today-day');
    const areaCountElement = document.getElementById('area-count');
    const areaNameElement = document.getElementById('area-name');
    const totalBalanceElement = document.getElementById('total-balance');
    const totalClientsElement = document.getElementById('total-clients');
    const clientsIdElement = document.getElementById('clients-id');
    const productIdsElement = document.getElementById('product-ids');
    const offerIdElement = document.getElementById('offer-id');
    const distantIdElement = document.getElementById('distant-id');
    const timeIdElement = document.getElementById('time-id');
    const calendar = document.getElementById('calendar');
    const errorMessageElement = document.getElementById('error-message');

    console.log('DOM fully loaded and parsed');
   
    // Fetch the username from session storage
        const username = sessionStorage.getItem('username');
        console.log('Fetched username from sessionStorage:', username);
        const customerData = await window.getCustomerLedger();
        console.log(sessionStorage.getItem('username'));
        console.log('Customer Data:', customerData);    
     //  const filtrdcustomerData = customerData.filter(row => row[5] === todayDay);
      //  console.log('Filtered Customer Data:', filtrdcustomerData);
  
        const customerNameElement = document.getElementById('customer-name');
        if (customerNameElement) {
            customerNameElement.textContent = username || 'Guest'; // Fallback to 'Guest' if username is null
        }
    // Function to update the dashboard data
    async function updateDashboardData(date) {
        try {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const todayDay = daysOfWeek[date.getDay()];
           // const todayDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            todayDayElement.textContent = `${todayDay} (${formattedDate})`;
            const filtrdcustomerData = customerData.filter(row => row[5] === todayDay);
            console.log('Filtered Customer Data:', filtrdcustomerData);
            console.log('Revised date:', date);
            // Calculate the sum of the balance from the filtered data set
const totalBalance = filtrdcustomerData.reduce((sum, row) => sum + parseFloat(row[1]), 0); // Assuming balance is in row[1]
console.log('Total Balance:', totalBalance);
            const totalBalanceElement = document.getElementById('total-balance');
            if (totalBalanceElement) {
                totalBalanceElement.textContent = totalBalance.toFixed(2); // Format to 2 decimal places
               }
               const areaCountElement = document.getElementById('area-count');
               // Find total number of unique areas to visit
const uniqueAreas = new Set(filtrdcustomerData.map(row => row[7]));
console.log('Unique Areas:', uniqueAreas);

               if (areaCountElement) {
                areaCountElement.textContent = uniqueAreas.size;
               }
               // Find area names to visit
const areaNames = Array.from(uniqueAreas).join(', ');
console.log('Area Names:', areaNames);
               const areaNamesElement = document.getElementById('area-name');
               if (areaNamesElement) {
                areaNamesElement.textContent = areaNames;
               }
               // Find total number of shops to visit
const totalShops = filtrdcustomerData.length;
console.log('Total Shops:', totalShops);
               const totalShopsElement = document.getElementById('total-clients');
               if (totalShopsElement) {
                totalShopsElement.textContent = totalShops;
               }
               // Find shop names to visit
const shopNames = filtrdcustomerData.map(row => row[6]).join(', ');
console.log('Shop Names:', shopNames);
const shopNamesElement = document.getElementById('clients-id');
               if (shopNamesElement) {
                shopNamesElement.textContent = shopNames;
               }
        //    productIdsElement.textContent = data.starproducts.join(', ');
          //  offerIdElement.textContent = data.offerss.join(', ');
         //   distantIdElement.textContent = data.distanceid;
        //    timeIdElement.textContent = data.timeid;
        } catch (error) {
            console.error('Error updating dashboard data:', error);
            errorMessageElement.textContent = 'Failed to update dashboard data. Please try again later.';
        }

      //  async function displayOutstandingBalance() {
     //       try {
              const allData = await window.getLedger(); // Get all data from Google Sheet
              console.log('All data:', allData);
              // Filter data where type is "sale"
              const saleData = allData.filter(row => row[2] === "Sale"); 
              console.log('Sales data:', saleData);
              // Filter saleData where overdue is greater than or equal to 30 days
              const overdueSaleData = saleData.filter(row => row[8] >= 30); 
              console.log('Overdue sales data:', overdueSaleData);
              // Calculate total outstanding balance
              const totalOutstandingBalance = overdueSaleData.reduce((total, row) => total + parseFloat(row[4]), 0); 
              console.log('Outstanding Balance:', totalOutstandingBalance);
              // Display the total outstanding balance
              document.getElementById('outstandingBalance').textContent = `Total Outstanding Balance: ${totalOutstandingBalance}`; 
          
         //   } catch (error) {
         //     console.error("Error fetching or processing data:", error);
              // Handle the error appropriately (e.g., display an error message to the user)
        //    }
        
 // Get today's date
const today = new Date();

// Convert today's date to 'MMMM YYYY' format
const options = { year: 'numeric', month: 'long' };
const formattedDate = today.toLocaleDateString('en-US', options);

console.log('Formatted Date:', formattedDate); // Example output: "January 2025"
const jansaleData = saleData.filter(row => row[12].includes(formattedDate));
console.log('January Sales Data:', jansaleData);
const sumJanuary2025Sales = jansaleData.reduce((sum, row) => sum + parseFloat(row[4]), 0);
    console.log('Sum of sales in January 2025:', sumJanuary2025Sales);
    
  // Assuming sumJanuary2025SalesElement is the HTML element where you want to display the result
  const sumJanuary2025SalesElement = document.getElementById('totalDebitJanuary2025');
  if (sumJanuary2025SalesElement) {
      sumJanuary2025SalesElement.textContent = `Total Sales in January 2025: ${sumJanuary2025Sales}`;
      console.log('Updated sumJanuary2025SalesElement:', sumJanuary2025SalesElement.textContent);
  } else {
      console.error('Element with ID "totalDebitJanuary2025" not found.');
  }
    // Function to fetch data for a specific date


 // Filter data where type is "Rcpt"
 const colData = allData.filter(row => row[2] === "Rcpt"); 
 console.log('Col data:', colData);

 const jancolData = colData.filter(row => row[12].includes(formattedDate));
 console.log('January Col Data:', jancolData);
 const sumJanuary2025col = jancolData.reduce((sum, row) => sum + parseFloat(row[5]), 0);
     console.log('Sum of Coll in January 2025:', sumJanuary2025col);
     
   // Assuming sumJanuary2025SalesElement is the HTML element where you want to display the result
   const sumJanuary2025colElement = document.getElementById('totalCreditJanuary2025');
   if (sumJanuary2025colElement) {
       sumJanuary2025colElement.textContent = `Total Col in January 2025: ${sumJanuary2025col}`;
       console.log('Updated sumJanuary2025colElement:', sumJanuary2025colElement.textContent);
   } else {
       console.error('Element with ID "totalCreditJanuary2025" not found.');
   }}

   // Event listener for date selection
   calendar.addEventListener('change', (event) => {
    const selectedDate = new Date(event.target.value);
    if (selectedDate) {
        updateDashboardData(selectedDate);
    } else {
        // Reset to the actual date if no date is selected
        const actualDate = new Date();
        updateDashboardData(actualDate);
    }
})

// Initialize the dashboard with the actual date
const actualDate = new Date();
updateDashboardData(actualDate);
});
    //async function fetchDataForDate(date) {
        // Implement the logic to fetch data for the selected date
        // This could be an API call or fetching data from Google Sheets
        // For now, returning mock data 
     //   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     //   const today = new Date();
    //    const todayDay = daysOfWeek[today.getDay()];
       // const todayDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
     //   const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    //    todayDayElement.textContent = `${todayDay} (${formattedDate})`;
      //  const filtrdcustomerData = customerData.filter(row => row[5] === todayDay);


        // Fetch and update other dashboard data based on the selected date
      //  const data = await fetchDataForDate(date);
      //  console.log('Updated DasboardDate:', date);
       // console.log('Updated DasboardData:', data);
// Calculate the sum of the balance from the filtered data set
//const totalBalance = filtrdcustomerData.reduce((sum, row) => sum + parseFloat(row[1]), 0); // Assuming balance is in row[1]
//console.log('Total Balance:', totalBalance);

// Update the DOM element for total balance
//const totalBalanceElement = document.getElementById('total-balance');
//if (totalBalanceElement) {
 //totalBalanceElement.textContent = totalBalance.toFixed(2); // Format to 2 decimal places
//}

// Find total number of unique areas to visit
//const uniqueAreas = new Set(filtrdcustomerData.map(row => row[7]));
//console.log('Unique Areas:', uniqueAreas);

// Update the DOM element for area count
//const areaCountElement = document.getElementById('area-count');
//if (areaCountElement) {
// areaCountElement.textContent = uniqueAreas.size;
//}

// Find area names to visit
//const areaNames = Array.from(uniqueAreas).join(', ');
//console.log('Area Names:', areaNames);

// Update the DOM element for area names
//const areaNamesElement = document.getElementById('area-name');
//if (areaNamesElement) {
// areaNamesElement.textContent = areaNames;
//}

// Find total number of shops to visit
//const totalShops = filtrdcustomerData.length;
//console.log('Total Shops:', totalShops);

// Update the DOM element for total shops
//const totalShopsElement = document.getElementById('total-clients');
//if (totalShopsElement) {
 //totalShopsElement.textContent = totalShops;
//}

// Find shop names to visit
//const shopNames = filtrdcustomerData.map(row => row[6]).join(', ');
//console.log('Shop Names:', shopNames);

// Update the DOM element for shop names
//const shopNamesElement = document.getElementById('clients-id');
//if (shopNamesElement) {
 //shopNamesElement.textContent = shopNames;
//}

       
//console.log('Total rev Balance:', totalBalance);
//console.log('Unique rev Areas:', uniqueAreas);
//console.log('Total rev Shopsnames:', totalShopnames);
//console.log('Shopnames rev Today:', ShopnamesToday);

//return {
 //   totalBalance,
 //   uniqueAreas: [],
 //   totalShopnames: 0,
  //  ShopnamesToday: [],
 //   starproducts: [],
 //   offerss: [],
 //   distanceid: 0,
 //   timeid: 0
//};
  

    

    