const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const cocktailCardCon = document.getElementById('cocktail-cards-container');
const singleCardDetails = document.getElementById('single-card-details');

// errors 

const searchBoxEmpty = document.getElementById('search-box-empty');
const nothingFound = document.getElementById('nothing-found');

searchBtn.addEventListener('click', function () {
    const searchValue = searchBar.value;
    // showing error if empty 
    if (searchBar.value == '') {
        cocktailCardCon.textContent = '';
        searchBoxEmpty.style.display = 'block';
        nothingFound.style.display = 'none';
        return;
    }

    else {
        // clearing the cards container 
        cocktailCardCon.textContent = '';
        // clearing the search field 
        searchBar.value = '';
        // clearing the error msg 
        searchBoxEmpty.style.display = 'none';

        // displaying card loader 
        for (let i = 0; i < 4; i++) {
            cocktailDiv = document.createElement('div');
            cocktailDiv.innerHTML = `
                <div class="bg-white p-4 rounded-md">
                    <div class="w-64 h-44 bg-gray-200 animate-pulse"></div>
                    <div class="mt-8 h-32 w-full space-y-3">
                    <div class="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="w-full h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="w-full h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="w-1/2 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            `;
            cocktailCardCon.appendChild(cocktailDiv);
        }

        // loading api data 
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`)
            .then(res => res.json())
            .then(data => displayDrinks(data.drinks))
    }

});

// display drinks function 
const displayDrinks = (drinksArray) => {
    // showing error if nothing found 
    if (drinksArray == null) {
        cocktailCardCon.textContent = '';
        nothingFound.style.display = 'block';
        searchBoxEmpty.style.display = 'none';
        return;
    }

    else {

        // clearing card container 
        cocktailCardCon.textContent = '';
        // clearing error msg 
        nothingFound.style.display = 'none';
        // clearing the single card details 
        singleCardDetails.textContent = '';

        drinksArray.forEach(singleDrinkInfo => {

            const singleCard = document.createElement('div');
            singleCard.innerHTML = `
            <div class="bg-white border-2 border-purple-400 h-full">
                <img src="${singleDrinkInfo.strDrinkThumb}" alt="" class="w-full h-48 sm:h-56 object-cover" />

                <div class="px-6 py-6 mb-4 text-center">
                    <div class="text-3xl font-bold text-purple-500 mb-8">${singleDrinkInfo.strDrink.slice(0, 19)}</div> 
                    <h1 class="text-2xl">Ingredients</h1>
                    <p class="text-blue-600 mt-2 font-bold">${singleDrinkInfo.strIngredient1}, ${singleDrinkInfo.strIngredient2}</p>
                </div>


                <button class="w-full text-lg h-16 text-white font-extrabold bg-purple-500" onclick="showCardDetails('${singleDrinkInfo.idDrink}')">VIEW DETAILS</button>
            </div>
        `;
            cocktailCardCon.appendChild(singleCard);
        });
    }
};

// loading single card details when view details btn is clicked 
const showCardDetails = async (drinkId) => {

    // displaying loader for single card
    const singleCardLoader = document.getElementById('single-card-loader');
    singleCardLoader.textContent = '';
    singleCardLoader.innerHTML = `
        <div class="transform">
            <div style="border-top-color:transparent"
                class="border-solid animate-spin  rounded-full border-purple-600 border-4 h-20 w-20"></div>
        </div>
    `;

    // fetching api data using id of the drink 
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
    const data = await res.json();
    console.log(data);

    // clearing the loader 
    singleCardLoader.textContent = '';

    // clearing the container 
    singleCardDetails.textContent = '';

    // creating a div for selected card 
    const selectedCard = document.createElement('div');
    selectedCard.innerHTML = `
        <div class="relative rounded-lg flex flex-col md:flex-row items-center md:shadow-xl md:h-72 mx-2 text-left">

            <div class="z-0 order-1 md:order-2 relative w-full md:w-2/5 h-80 md:h-full overflow-hidden rounded-lg md:rounded-none md:rounded-r-lg">

                <div class="absolute inset-0 w-full h-full object-fill object-center bg-blue-400 bg-opacity-30 bg-cover" style="background-image: url( ${data.drinks[0].strDrinkThumb}); background-blend-mode: multiply;"></div>

                <div class="md:hidden absolute inset-0 h-full p-6 pb-6 flex flex-col-reverse justify-start items-start bg-gradient-to-b from-transparent via-transparent to-gray-900">

                    <h3 class="w-full font-bold text-2xl text-white leading-tight mb-2">${data.drinks[0].strDrink.toUpperCase()}</h3>

                    <h4 class="w-full text-xl text-gray-100 leading-tight">${data.drinks[0].strCategory}</h4>
                </div>
                <svg class="hidden md:block absolute inset-y-0 h-full w-24 fill-current text-white -ml-12" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="50,0 100,0 50,100 0,100" />
                </svg>
            </div>

            <div class="z-10 order-2 md:order-1 w-full h-full md:w-3/5 flex items-center -mt-6 md:mt-0">

                <div class="p-8 md:pr-18 md:pl-14 md:py-12 mx-2 md:mx-0 h-full bg-white rounded-lg md:rounded-none md:rounded-l-lg shadow-xl md:shadow-none">

                    <h4 class="hidden md:block text-xl text-gray-400 mb-3">${data.drinks[0].strCategory}</h4>

                    <h3 class="hidden md:block font-bold text-2xl text-pink-500 mb-3">${data.drinks[0].strDrink.toUpperCase()}</h3>

                    <p class="text-gray-600 text-justify">${data.drinks[0].strInstructions.slice(0, 1000)}</p>
                    
                </div>
            </div>

        </div>
    `;
    singleCardDetails.appendChild(selectedCard);
}