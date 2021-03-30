import $ from 'jquery';
import {refreshLang, generateHtml} from "./localization";


class SubscriptionsTable {
  constructor(tableSelector) {
    this.$table = $(tableSelector);
    this.$thead = $(this.$table).find('thead');
    this.$tbody = $(this.$table).find('tbody');
    this.data = [];
  }

  init() {
    this.fetchData((data) => {
      this.generateThead();
      this.generateTbody();
      this.connectEventListeners();
      refreshLang();
    });
  }

  fetchData(onSuccess) {
    $.ajax({
      url: `${process.env.DO_BACKEND_HOST}/api/payment/subscriptions/`,
      success: (data) => {
        this.data = data;
        onSuccess(data);
      },
    });
  }

  connectEventListeners() {
    $('.js-subscription-select').on('click', function () {
      const subId = $(this).data('id')
      window.open(`${process.env.DO_FRONTEND_HOST}/system/subscriptions/?lang=${localStorage.getItem('lang')}&subscription=${subId}`);
    });

    $('#open-payform').on('click', function () {
      $('.open-payform').fadeToggle();
    });
  }

  getHeaders() {
    const discount = `
      <div class="subscription-discount">
        -10%*
      </div>
    `
    const elements = this.data.map((sub) => {
      return (`
        <th class="sub-name">
          ${sub.yearly_subscription ? discount : ''}
          <div class="sub-name__name">${sub.name}</div>
          <div class="sub-name__price">${sub.price}</div>
          <div class="sub-name__currency">
            ${generateHtml('грн/міс', 'UAH/month')}
          </div>
        </th>
      `)
    })
    return elements.join('')
  }

  getViews() {
    const elements = this.data.map((sub) => {
      return (`
        <td class="subscription-data${sub.is_default ? '_filled' : ''}">
          ${sub.is_default ? sub.platform_requests_limit : generateHtml('Необмежено', 'Unlimited')}
        </td>
      `)
    })
    return (`
      <tr>
        <td>${generateHtml('Перевірки через веб-сайт', 'UI usage')}</td>
        ${elements.join('')}
        <td rowspan="6" style="white-space: nowrap;">${generateHtml('За домовленістю', 'Contact sales')}</td>
      </tr>
    `)
  }

  getRequests() {
    const elements = this.data.map((sub) => {
      return (`
        <td class="subscription-data_filled">
          ${sub.requests_limit}
        </td>
      `)
    })
    return (`
      <tr>
        <td>${generateHtml(
          'АРІ-запити (оновлення РЕР, групові перевірки)',
          'API requests (PEP updates, group checks)',
        )}</td>
        ${elements.join('')}
      </tr>
    `)
  }

  getPEPChecks() {
    const elements = this.data.map((sub) => {
      return (`
        <td class="subscription-data${sub.pep_checks ? '_filled' : ''}">
          ${sub.pep_checks ? sub.pep_checks_per_minute : ''}
        </td>
      `)
    })
    return (`
      <tr>
        <td>${generateHtml(
          'Індивідуальні перевірки РЕР (пошук за іменем і датою народження), запитів/хв',
          'Individual PEP checks (search by name and date of birth), requests per min',
        )}</td>
        ${elements.join('')}
      </tr>
    `)
  }

  getContract() {
    const elements = this.data.map((sub) => {
      return (`
        <td class="subscription-data">
          ${!sub.is_default ? '<img src="img/check.svg" alt="yes"/>' : ''}
        </td>
      `)
    })
    return (`
      <tr>
        <td>${generateHtml('Договір', 'Contract')}</td>
        ${elements.join('')}
      </tr>
    `)
  }

  getSupport() {
    const elements = this.data.map((sub) => {
      return (`
        <td class="subscription-data">
          ${!sub.is_default ? '<img src="img/check.svg" alt="yes"/>' : ''}
        </td>
      `)
    })
    return (`
      <tr>
        <td>${generateHtml('Технічна підтримка', 'Tech Support')}</td>
        ${elements.join('')}
      </tr>
    `)
  }

  getPEPDBLoad() {
    const elements = this.data.map((sub) => {
      return (`
        <td class="subscription-data">
          ${sub.pep_db_downloading_if_yearly ? generateHtml('При оплаті за рік', 'For annual payment') : ''}
        </td>
      `)
    })
    return (`
      <tr>
        <td>${generateHtml('Завантаження всієї бази РЕР', 'Download PEP database')}</td>
        ${elements.join('')}
      </tr>
    `)
  }

  getButtons() {
    const elements = this.data.map((sub) => {
      return (`
        <td>
          <button class="js-subscription-select btn btn-success" data-id="${sub.id}">
            ${generateHtml('Обрати', 'Choose')}
          </button>
        </td>
      `)
    })
    return (`
      <tr class="subs-buttons">
        <td>*${generateHtml('Знижка дійсна при оплаті за рік', 'Discount is valid for annual payment only')}</td>
        ${elements.join('')}
        <td>
          <button id="open-payform" class="btn btn-success">
            ${generateHtml('Обрати', 'Choose')}
          </button>
        </td>
      </tr>
    `)
  }

  generateThead() {
    this.$thead.append(`
      <tr>
        <th><div></div></th>
        ${this.getHeaders()}
        <th>
          <div>
            <div class="sub-name__name">Custom</div>
          </div>
        </th>
      </tr>
    `)
  }

  generateTbody() {
    this.$tbody.append(this.getViews());
    this.$tbody.append(this.getRequests());
    this.$tbody.append(this.getPEPChecks());
    this.$tbody.append(this.getContract());
    this.$tbody.append(this.getSupport());
    this.$tbody.append(this.getPEPDBLoad());
    this.$tbody.append(this.getButtons());
  }
}

export default SubscriptionsTable;
