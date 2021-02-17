import './scss/main.scss';
import { allowedLanguages, t, changeLang } from './localization';

$('.link-platform').on('click', function () {
    location.replace(`${process.env.DO_FRONTEND_HOST}/system/home/?lang=${localStorage.getItem('lang')}`);
});

$('.link-landing').on('click', function () {
    location.replace(`${process.env.DO_MAIN_LANDING}/?lang=${localStorage.getItem('lang')}`);
});

$('.link-cpk').on('click', function () {
    location.replace(`https://pep.org.ua/${localStorage.getItem('lang')}`);
});

// let getHomeUrl = () => {
//     let path = window.location.href;
//     window.location.replace(path.substr(0, path.lastIndexOf("/")));
// };
