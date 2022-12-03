
let store = Immutable.Map({
    user: { name: "Student" },
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    apod: '',

})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
        <h1 class="text-success text-center p-4">Mars Dashboard</h1>
        <nav>
        <div class="nav nav-tabs nav-fill bg-dark" id="nav-tab" role="tablist">
          <button class=" text-success nav-link ${Array(store.apod?.latest_photos)?.[0]?.[0].rover.name =='Opportunity' ?'active':''}" id="nav-opportunity-tab" data-bs-toggle="tab" data-bs-target="#nav-opportunity" type="button" role="tab" aria-controls="nav-opportunity" aria-selected="true" onclick="getOpportunity()">Opportunity</button>
          <button class=" text-success nav-link ${Array(store.apod?.latest_photos)?.[0]?.[0].rover.name =='Curiosity' ?'active':''}"" id="nav-curiosity-tab" data-bs-toggle="tab" data-bs-target="#nav-curiosity" type="button" role="tab" aria-controls="nav-curiosity" aria-selected="false" onclick="getCuriosity()">Curiosity</button>
          <button class=" text-success nav-link ${Array(store.apod?.latest_photos)?.[0]?.[0].rover.name =='Spirit' ?'active':''}"" id="nav-spirit-tab" data-bs-toggle="tab" data-bs-target="#nav-spirit" type="button" role="tab" aria-controls="nav-spirit" aria-selected="false" onclick="getSpirit()">Spirit</button>
 
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">

         ${getRoverInfo()}
 
      <div class="d-flex justify-content-center flex-wrap gap-2" >
        ${updatePhotos()}
         </div>
      </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})


// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/spirit`)
        .then(res => res.json())  
        .then(apod => updateStore(store,{ apod }));

    return data
}

const getSpirit = () => {
    fetch(`http://localhost:3000/spirit`)
        .then(res => res.json())
        .then(apod => updateStore(store,{ apod }));
    return store
}

const getCuriosity = () => {
    fetch(`http://localhost:3000/curiosity`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }));

    return store
}

const getOpportunity = () => {
    fetch(`http://localhost:3000/opportunity`)
        .then(res => res.json())
        .then(apod => updateStore(store,{ apod }));
    return store
}

const updatePhoto = (array) => {
    return array.map((item) => 
        `      
        <div class="card" style="width: 12rem;">
        <img src="${item.img_src}" class="card-img-top" alt="...">
        </div>
        `
        ).slice(0, 100).join("") 
}

const updatePhotos = () => {
    if (store?.apod?.latest_photos) {
        return updatePhoto(store?.apod?.latest_photos)
    }
return ''
}


const updateRoverInfo = (rover) => {
    return  `     
    <div class="card m-3 bg-dark text-light">
    <div class="card-body d-flex justify-content-center p-3 gap-1 flex-wrap">
    <div class="d-flex justify-content-center flex-wrap  gap-1">   
        <span class="badge bg-success">Landing Date</span>
        <span class="">${rover.landing_date}</span> 
    </div>
    <div class="vr"></div>
    <div class="d-flex justify-content-center flex-wrap  gap-1">   
    <span class="badge bg-success">Launch Date</span>
    <span class="">${rover.launch_date}</span> 
    </div>
    <div class="vr"></div>
    <div class="d-flex justify-content-center flex-wrap  gap-1">   
    <span class="badge bg-success">Status</span>
    <span class="">${rover.status}</span> 
    </div>
    </div>
    </div>
    `
 }
 
const getRoverInfo = () => {
    const rover = Array(store.apod?.latest_photos)?.[0]?.[0].rover;
    if (rover != undefined) {
        return updateRoverInfo(rover)
    }  
    return ''
    
}


