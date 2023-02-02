const btn = document.querySelector(".navigation__btn-menu");
btn.addEventListener("click",(event)=>{
    const ul = document.querySelector(".navigation__list");
    ul.classList.toggle("navigation__list--active");
    const svg = btn.querySelectorAll("svg");
    svg.forEach((elem)=>{
        elem.classList.toggle("navigation__btn-close");
    })
})