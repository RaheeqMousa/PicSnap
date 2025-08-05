let page = 1;
let isLoading = false;

const loading_container = document.querySelector(".loader-container");
const loader = document.querySelector(".loader");

/*......................This function is to get data from the API...................*/

async function getImages() {
    try {
        const elements = await fetch(`https://picsum.photos/v2/list?page=${page}`);
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
    loading_container.classList.remove("stop-loader");

    try {
        const images = await getImages();

        for(let i=0;i<images.length;i+=6){
            const group=images.slice(i, i+6);

            document.querySelector("main #images").innerHTML += `
            <div class="imageRow">
                <div class="gridStyle">
                    <div class="imageWrapper singleImgDiv">
                        <img src='${group[0].download_url}' alt='${group[0].author}' title='${group[0].author}'>
                    </div>
                    <div class="twoImgDiv">
                        <div class="imageWrapper">
                            <img src='${group[1].download_url}' alt='${group[1].author}' title='${group[1].author}'>
                        </div>
                        <div class="imageWrapper">
                            <img src='${group[2].download_url}' alt='${group[2].author}' title='${group[2].author}'>
                        </div>
                    </div>
                </div>
                <div class="gridStyle">
                    <div class="twoImgDiv">
                        <div class="imageWrapper">
                            <img src='${group[3].download_url}' alt='${group[3].author}' title='${group[3].author}'>
                        </div>
                        <div class="imageWrapper">
                            <img src='${group[4].download_url}' alt='${group[4].author}' title='${group[4].author}'>
                        </div>
                    </div>
                    <div class="imageWrapper singleImgDiv">
                        <img src='${group[5].download_url}' alt='${group[5].author}' title='${group[5].author}'>
                    </div>
                </div>
            </div>
            `
        }

        modal();

    } catch (error) {
        console.log(error);
    } finally {
        // Hide loader and release lock
        loader.classList.add("stop-loader");
        loading_container.classList.add("stop-loader");
        isLoading = false;
    }
};

structurePage();

/*................................For infinite scroll and fetching with each page ends........................................*/
window.onscroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight - 100;

    if (!isLoading && scrollPosition >= threshold) {
        page++;
        structurePage();
    }
};