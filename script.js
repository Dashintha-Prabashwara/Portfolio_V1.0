let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x')
    navbar.classList.toggle('active');
}

document.getElementById("connectBtn").addEventListener("click", function() {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("getcv").addEventListener("click", function(event) {
    event.preventDefault();

    let fileId = "1nvvn0-hNgHuaOF21VkZmQIFw8-OuE9Og"; 
    let downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    let a = document.createElement("a");
    a.href = downloadLink;
    a.download = "CV.pdf"; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

