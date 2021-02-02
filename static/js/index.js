import $ from 'jquery';
import 'jquery-validation';
import 'jquery-modal';

const allowedLanguages = ['uk', 'en'];

let langs = {
    messageSuccess: {
        uk: 'Дякуємо за звернення! Постараємося відповісти якнайшвидше.',
        en: 'Thank you for contacting us! We will get back to you soon.',
    },
    messageError: {
        uk: 'Помилка. Дані не відправлені',
        en: 'Error. Data isn\'t sent',
    },
    messageErrorUnknown: {
        uk: 'Невідома помилка: ',
        en: 'Unknown error: ',
    },
    minSymbols: {
        uk: 'Замала кількість символів',
        en: 'Too few symbols',
    },
    maxSymbols: { 
        uk: 'Завелика кількість символів',
        en: 'Too many symbols',
    },
    usernameRequired: {
        uk: 'Будь ласка, введіть Ваше ім\'я',
        en: 'Enter your First Name, please',
    },
    surnameRequired: {
        uk: 'Будь ласка, введіть Ваше прізвище',
        en: 'Enter your Last Name, please',
    },
    emailRequired: {
        uk: 'Будь ласка, введіть адресу',
        en: 'Enter your email, please',
    },
    emailCorrect: {
        uk: 'Будь ласка, введіть коректно адресу',
        en: 'Enter your correct email, please',
    },
    questionAsk: {
        uk: 'Будь ласка, поставте своє запитання',
        en: 'Ask us your question, please',
    },
    placeholderName: {
        uk: 'Петро',
        en: 'John',
    },
    placeholderLastName: {
        uk: 'Іваненко',
        en: 'Galt',
    },
    placeholderQuestion: {
        uk: 'Текст повідомлення',
        en: 'Your message'
    },
};

const t = (key) => {
    let currentLang = localStorage.getItem('lang');
    return langs[key][currentLang];
};

const getSchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            username: {
                required: true,
                minlength: 2,
            },
            surname: {
                required: true,
                minlength: 2,
            },
            email: {
                required: true,
                email: true,
            },
            question: {
                required: true,
            },
        },
        messages: {
            username: {
                required: t('usernameRequired'),
                minlength: t('minSymbols'),
            },
            surname: {
                required: t('surnameRequired'),
                minlength: t('minSymbols'),
            },
            email: {
                required: t('emailRequired'),
                email: t('emailCorrect'),
            },
            question: {
                required: t('questionAsk'),
            }
        }
    }
};

function changeLang (languageCode) {  
    if (allowedLanguages.includes(languageCode)) {
        window.localStorage.setItem('lang', languageCode); 
        $('#name')[0].placeholder = t('placeholderName');
        $('#surname')[0].placeholder = t('placeholderLastName');
        $('#question')[0].placeholder = t('placeholderQuestion');
        $("[lang]").each(function () {
            if ($(this).attr("lang") === languageCode) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
    } else {
        throw new Error("LangCode " + languageCode + " not supported");
    }
}

$('#change-lang').click(function(event) {
    event.preventDefault();
    let langUser = 'uk';
    if (localStorage.getItem('lang') === 'uk') {
        langUser = 'en'; 
    }
    changeLang(langUser);
});

$(document).ready(() => {
    const langFromLocalStorage = localStorage.getItem('lang');
    const langFromUrl = new URLSearchParams(location.search).get('lang');
    
    if ( !langFromUrl ) {
        return
    }
    if (allowedLanguages.includes(langFromUrl)) {
        changeLang(langFromUrl);
    } else if (allowedLanguages.includes(langFromLocalStorage)) {
        changeLang(langFromLocalStorage);
    } else {
        changeLang('uk');
    }
});

$('#contact-form').submit(function(event){
    event.preventDefault();
    let form = $(this);
    form.validate(getSchema())
    if (!form.valid()) {
        return
    }
    
    let data = {
        name: this.username.value + ' ' + this.surname.value,
        email: this.email.value,
        subject: this.username.value + ' ' + this.surname.value, 
        message: this.question.value,
    }

    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/landing_mail/',
        type: "POST",
        dataType: "json",
        data: data,
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            alert(t('messageSuccess'));
            form[0].reset();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            if (jqXhr.status === 400 || jqXhr.status === 503) {
                alert(t('messageError'));
            }
            else {
                alert(t('messageErrorUnknown') + errorMessage);
            }
        }
    })
});

$('.link-platform').on('click', function () {
    window.open(process.env.DO_FRONTEND_HOST + '/system/home/?lang=' + localStorage.getItem('lang')); 
});

$('.link-landing').on('click', function () {
    window.open('https://dataocean.us/?lang='+ localStorage.getItem('lang')); 
});

$('.link-cpk').on('click', function () {
    window.open('https://pep.org.ua/'+ localStorage.getItem('lang')); 
});

$('#api-docs').on('click', function () {
    window.open(process.env.DO_BACKEND_HOST + '/schema/redoc/'); 
});


$('#terms_and_conditions').on('click', function () {
    if (localStorage.getItem('lang') === 'uk') {
        window.location.assign(process.env.DO_FRONTEND_HOST + '/docs/TermsAndConditionsUk.html');
    } else {
        window.location.assign(process.env.DO_FRONTEND_HOST + '/docs/TermsAndConditionsEn.html');
    }
});

$('#privacy_policy').on('click', function () {
    if (localStorage.getItem('lang') === 'uk') {
        window.open(process.env.DO_FRONTEND_HOST + '/docs/PrivacyPolicyUk.html');
    } else {
        window.open(process.env.DO_FRONTEND_HOST + '/docs/PrivacyPolicyEn.html');
    }
});

$('.menu-btn').on('click', function (event) {
    event.preventDefault();
    $('.menu-btn').toggleClass('open-menu');
    $('.menu-navigation').fadeToggle();

    $('.navigation__item').on('click', function (event) {
        $('.menu-btn').removeClass('open-menu');
        $('.menu-navigation').fadeOut();
    })
});

$.ajax({
    url: process.env.DO_BACKEND_HOST + '/api/payment/subscriptions/',
    type : 'get',
    error: function() {
        alert('ERROR.');
      },
    success : function(data){
        let elements = [];
        const imgPay = [
            'static/img/icon_free.svg',
            'static/img/icon_basic.svg',
            'static/img/icon_premium.svg'
        ];

            data.forEach (function(subscription, i) {
            let html = `
            <div class="payment-card">

            <img src="${imgPay[i]}" alt='tarif_logo'></img>

            <div class="payment-card__name h3">
                <span>${subscription.name}</span>
            </div>

            <div class="payment-card__title">
                <span lang="uk">
                    Тривалість ${subscription.duration} днів. 
                    <br>
                        Максимальна кількість запитів:     
                        ${subscription.requests_limit}
                    </br>
                </span>
                <span lang="en">
                    Duration ${subscription.duration} days. 
                    <br>
                        Maximum number of requests:
                        ${subscription.requests_limit}
                    </br>
                </span>
            </div>

                <div class="payment-card__priсe h1 payment-card__priсe_required">
                    ${subscription.price}
                    <span lang="uk">грн/міс</span>
                    <span lang="en">UAH/p.m.</span>
                </div>

                <button type="button" class="btn-primary link-platform js-subscription-select" data-id="${subscription.id}">
                    <span lang="uk">Обрати</span>
                    <span lang="en">Choose</span>
                </button>
            </div>
            `
          elements.push(html);
        });

        $('#payment-box').html(elements)

        changeLang (window.localStorage.getItem('lang'))
        
        $('.js-subscription-select').on('click', function () {
            const subId = $(this).data('id')
            window.open(process.env.DO_FRONTEND_HOST + '/system/subscriptions/?lang=' +
             localStorage.getItem('lang') + `&subscription=${subId}`); 
        });
    }
  });
