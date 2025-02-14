document.addEventListener('DOMContentLoaded', function() {
function adjustOffersLayout() {
    const offerCards = document.querySelectorAll('.offer-card');
    const offersContainer = document.querySelector('.offers-container');

    // Check the number of offers and add classes accordingly
    const totalOffers = offerCards.length;
    
    if (totalOffers === 2) {
        offersContainer.classList.add('two-offers');
    } else if (totalOffers === 3) {
        offersContainer.classList.add('three-offers');
    } else if (totalOffers % 2 === 0) {
        offersContainer.classList.add('four-offers');
    }
    else {
        console.error('Offers container not found.');
    }
}

// Call this function when the page loads or when offers are dynamically loaded
adjustOffersLayout();
});
