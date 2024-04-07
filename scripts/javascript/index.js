function readMore() {
    let dots = document.getElementById("dots");
    let moreText = document.getElementById("more");
    let btnText = document.getElementById("readMoreButton");

    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.textContent = "Read more...";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.textContent = "...Read less";
        moreText.style.display = "inline";
    }
}

document.querySelector('#readMoreButton').addEventListener('click', event => readMore());