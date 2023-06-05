//I am using asynchronous because we want the cars to show as soons as the age is loaded but I have to use 
//the callback function to hanlde the response when it arrives because the image may not load immediately.
window.addEventListener("load" , ()=>{
    const loading = document.querySelector(".loading");
    loading.classList.add("loading-hidden");
    // applyTheme();
    PageLoad();
    if(document.cookie.indexOf('validated')){
        setTimeout(applyFilters,400);
    }
})
const loading  = document.querySelector(".loading");

function showloading(){
    loading.style.display = 'flex';
    loading.style.transition = '0.2s'
}
function hideloading(){
    loading.style.display = 'none';
}
//Const for section where cars are displayed
function getCookieValue(cookieName) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=');
      if (parts[0] === cookieName) {
        return decodeURIComponent(parts[1]);
      }
    }
    return '';
  }

//This function gets all the information about the cars
function PageLoad(){
    showloading();
    const carlist = document.querySelector('.car-wrapper');
    //1. Create the XMLHttpRequest Object
    let request = new XMLHttpRequest();
    var body = JSON.stringify({
                "type":"getWines",
                "return":"*"
        })

    //I am using asynchronous because we want the cars to show as soons as the age is loaded.
    //2. create request
    var url = "../COS221/globals/api.php";
    request.open("POST",url,true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function(){
        if(request.readyState==4 && request.status == 200){
            console.log(JSON.parse(request.responseText).data[0]);
            let Q1=JSON.parse(request.responseText);
            var cars = Q1.data;
            if(cars.length == 0){
                const html = `<h2>Sorry seems like we don't have what you're looking for in stock<h2>`
                carlist.insertAdjacentHTML('beforeend',html);
            }else{
                for(let i=0; i<Q1.data.length; i++){
                    const html = `<div class="car">
                        <img class="wineimage" src="${Q1.data[i]['Image']}" alt="${Q1.data[i]['Name']}">
                        <h2>${Q1.data[i]['Name']}</h2>
                        <h3>${Q1.data[i]['Grape_Varietal']}</h3>
                        <li>Price: R${Q1.data[i]['Price']}</li>
                        <li>Bottle Size: ${Q1.data[i]['Bottle_Size']}ml</li>
                        <li>pH: ${Q1.data[i]['pH']}</li>
                        <li>Alcohol Content: ${Q1.data[i]['Alcohol_Content']}%</li>
                        <li>Region: ${Q1.data[i]['RegionName']}, ${Q1.data[i]['Country']}</li>
                    </div>`
                    carlist.insertAdjacentHTML('beforeend',html);
               } 
            }
        }else{
            console.log("Error:"+request.responseText.message);
        }
    }
    request.send(body);   
}


const apiKey = getCookieValue('api_key');
console.log(apiKey);

function refine(){
    showloading();
    let input = document.getElementById("search-input").value;
    const carlist = document.querySelector('.car-wrapper');
    let SortStyle = document.getElementById('filter-select-sort').value;
    let filterby = document.getElementById('filter-select-filter').value;
    // console.log(input+SortStyle+filterby);
    var order = null;
    var search = null; 
    var sort = null;
    var filter = null;
    const searchbody = {};

    const prebody = {
        "type":"getWines",
        "return":"*"
    }
    

    if(SortStyle == "Price(Highest - Lowest)"){
        sort = "Price";
        order = "DESC"
    }else if(SortStyle == "Price(Lowest - Highest)"){
        sort = "Price";
        order = "ASC"
    }else if(SortStyle == "Alcohol Content(Highest - Lowest)"){
        sort = "Alcohol_Content";
        order = "DESC"
    }else if(SortStyle == "Alcohol Content(Lowest - Highest)"){
        sort = "Alcohol_Content";
        order = "ASC"
    }

    if(filterby == "red") {
        filter = "red";
    } else if(filterby == "white"){
        filter = "white";
    } else if(filterby == "rosé"){
        filter = "rose";
    } else if(filterby == "sparkling"){
        filter = "sparkling";
    } else if(filterby == "dessert"){
        filter = "dessert";
    } else if(filterby == "fortified"){
        filter = "fortified";
    }

    if (input != ''){
        search = input;
    }

    if (sort !== null) {
        prebody.sort = sort;
        prebody.order = order;
    }

    if (filter != null) {
        searchbody.filter = filter;
        prebody.search = searchbody;
    }

    if (search !== null) {
        searchbody.Name = search;
        prebody.search = searchbody;
    }

    console.log(prebody);
    const body = JSON.stringify(prebody);
    
    carlist.innerHTML = '';
    //1. Create the XMLHttpRequest Object
    let request = new XMLHttpRequest();
    
    // console.log(SortStyle);
    //I am using asynchronous because we want the cars to show as soon as the data is loaded.
    //2. create request
    request.open("POST","../COS221/globals/api.php",true);
    request.onreadystatechange = function(){
        if(request.readyState== 4 && request.status == 200){
            let Q1=JSON.parse(request.responseText);
            console.log(Q1);
            var cars = Q1.data;
            if(cars.length == 0){
                const html = `<h2>Sorry seems like we don't have what you're looking for in stock<h2>`
                carlist.insertAdjacentHTML('beforeend',html);
            }else{
                for(let i=0; i<Q1.data.length; i++){
                    const html = `<div class="car">
                    <img class="wineimage" src="${Q1.data[i]['Image']}" alt="${Q1.data[i]['Name']}">
                    <h2>${Q1.data[i]['Name']}</h2>
                    <h3>${Q1.data[i]['Grape_Varietal']}</h3>
                    <li>Price: R${Q1.data[i]['Price']}</li>
                    <li>Bottle Size: ${Q1.data[i]['Bottle_Size']}ml </li>
                    <li>pH: ${Q1.data[i]['pH']}</li>
                    <li>Alcohol Content: ${Q1.data[i]['Alcohol_Content']}%</li>
                    <li>Region: ${Q1.data[i]['RegionName']}, ${Q1.data[i]['Country']}</li>
                </div>`
                carlist.insertAdjacentHTML('beforeend',html); 
               } 
            }
        hideloading();    
        }else{
            hideloading();
        }
    };
    //3. Send the request
    request.send(body);
}

function toggleActive() {
    const links = document.querySelectorAll('.nav-link'); // get all the nav links
    links.forEach(link => link.classList.remove('active')); // remove active class from all links
  
    this.classList.add('active'); // add active class to the clicked link
  }
  
  const links = document.querySelectorAll('.nav-link'); // get all the nav links
  links.forEach(link => link.addEventListener('click', toggleActive)); // add event listener to each link 
