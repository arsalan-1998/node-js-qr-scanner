

window.onload = setTimeout(() => { 
    document.getElementById('preloader-wrapper').style.display = 'none';
    document.getElementById('app_navbar').classList.toggle('show');
    document.getElementById('app_footer').classList.toggle('show');
    document.getElementById('main-content').classList.toggle('show');
    }, 3000);