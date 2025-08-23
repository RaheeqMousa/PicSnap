let page = 1;
let isLoading = false;

const modal = document.querySelector('.modal');
const loadingContainer = document.querySelector(".loader-container");
const loader = document.querySelector(".loader");


/*......................This function is to get data from the API...................*/

async function getImages() {
    try {
        const elements = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
        const data = await elements.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}


/*......................This function is to put the data into html code...................*/

const structurePage = async function () {
    if (isLoading) return;
    isLoading = true;

    // Show loader
    loader.classList.remove("stop-loader");
    loadingContainer.classList.remove("stop-loader");

    try {
        const images = await getImages();

        for (let i = 0; i < images.length; i += 6) {
            const group = images.slice(i, i + 6);

            document.querySelector("main #images").innerHTML += `
            <div class="image-row">
                <div class="grid-style">
                    <div class="image-wrapper single-img-div">
                        <img src='${group[0].download_url}' alt='${group[0].author}' title='${group[0].author}' width="${group[0].width}" height="${group[0].height}">
                    </div>
                    <div class="two-img-div">
                        <div class="image-wrapper">
                            <img src='${group[1].download_url}' alt='${group[1].author}' title='${group[1].author}' width="${group[1].width}" height="${group[1].height}">
                        </div>
                        <div class="image-wrapper">
                            <img src='${group[2].download_url}' alt='${group[2].author}' title='${group[2].author}' width="${group[2].width}" height="${group[2].height}">
                        </div>
                    </div>
                </div>


                <div class="grid-style">
                    <div class="two-img-div">
                        <div class="image-wrapper">
                            <img src='${group[3].download_url}' alt='${group[3].author}' title='${group[3].author}' width="${group[3].width}" height="${group[3].height}">
                        </div>
                        <div class="image-wrapper">
                            <img src='${group[4].download_url}' alt='${group[4].author}' title='${group[4].author}' width="${group[4].width}" height="${group[4].height}">
                        </div>
                    </div>
                    <div class="image-wrapper single-img-div">
                        <img src='${group[5].download_url}' alt='${group[5].author}' title='${group[5].author}' width="${group[5].width}" height="${group[5].height}">
                    </div>
                </div>
            </div>
            `;

            getToast("Data has been loaded successfully",2000);
        }

    } catch (error) {
        console.log(error);
    } finally {
        // Hide loader and release lock
        loader.classList.add("stop-loader");
        loadingContainer.classList.add("stop-loader");
        isLoading = false;
    }
};

structurePage();

/*................................For infinite scroll and fetching with each page ends........................................*/


document.addEventListener("DOMContentLoaded",()=>{
    const observer= new IntersectionObserver(entries=>{
        const entry = entries[0]; // this is the scroll-responser div

        if(entry.isIntersecting && !isLoading){
            page++;
            structurePage();
        }
    },{
        root:null, //This means the root element (the reference area for the observer) is the browser’s viewport.
        rootMargin:"0px",//This adds a virtual margin of 200px around the viewport (by default on all sides), so you can preload images or content before the user reaches the bottom
        threshold:0 //The threshold in an Intersection Observer controls how much of the target element must be visible before the callback is triggered
    });

    observer.observe(document.querySelector('.scroll-responser'));

    structurePage() //to upload the first page
});


/*.................................Modal..............................*/

function openModal() {

    const closeBtn = document.querySelector('.close-button-wrapper button');
    const imagesContainer = document.querySelector("#images");


    imagesContainer.addEventListener('click', function (e) {

        const clickedImage = e.target;

        if (clickedImage.tagName == "IMG" && clickedImage.closest('.image-wrapper')) {
            modal.classList.remove("display-none-modal");

            modal.querySelector(".image-modal .img-options").innerHTML = `
                <span>${clickedImage.getAttribute('title')}</span>
                <button id="download-btn">
                    <i class="fa-solid fa-download"></i>
                </button>
            `;

            document.getElementById("download-btn").addEventListener("click", async function () {
                const imageURL = clickedImage.src;

                try {
                    const response = await fetch(imageURL, { mode: 'cors' });
                    const blob = await response.blob();
                    const blobTempURL = await URL.createObjectURL(blob);
  
                    const link = document.createElement('a');
                    link.href = blobTempURL;
                    link.download = `${clickedImage.getAttribute('title') || "image"}.jpg`;
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.open(blobTempURL,'_self');

                    URL.revokeObjectURL(blobTempURL);
                } catch (error) {
                    console.error("Download failed:", error);
                    getToast("Unable to download image due to cross-origin restrictions \"CORS\".",6000);
                }
            });

            modal.querySelector(".image-modal .image-wrapper").innerHTML = `
                <img src="${clickedImage.src}" alt="${clickedImage.alt}" title="${clickedImage.title}"/>
            `;
        }
    });

    closeBtn.addEventListener("click", function (e) {
        modal.classList.add('display-none-modal');
    });

}

document.addEventListener("DOMContentLoaded",()=>{
    openModal();
});

document.addEventListener("keydown", (e) => {
    if (e.code === 'Escape') {
        modal.classList.add('display-none-modal');
    }
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.classList.add("display-none-modal");
    }
}

/*.............................Show Toast.................................*/

function getToast(message, time){
    const toast=document.querySelector(".toast");
    toast.querySelector('p').textContent=message;
    toast.classList.remove("display-none-modal");
    toast.classList.add("right-left");

    setTimeout(()=>{
        toast.classList.remove("right-left");
        toast.classList.add("display-none-modal");
    },time);
}