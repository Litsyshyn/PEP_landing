import './scss/main.scss';
import { allowedLanguages, t, changeLang } from './localization';

$('.link-platform').on('click', function () {
    window.open(process.env.DO_FRONTEND_HOST + '/system/home/?lang=' + localStorage.getItem('lang'));
});

$('.link-landing').on('click', function () {
    window.open('https://dataocean.us/?lang='+ localStorage.getItem('lang'));
});

$('.link-cpk').on('click', function () {
    window.open('https://pep.org.ua/'+ localStorage.getItem('lang'));
});