import Util from 'util';

function initLocaleChoice() {
    let locale = Util.getQueryString('locale') || localStorage.getItem('eos_user_locale');

    if (!locale) {
        locale = localStorage.getItem('eos_user_locale');

        if (!locale) {
            let language;

            if (navigator.language) {
                language = navigator.language;
            } else {
                language = navigator.browserLanguage;
            }

            locale = language.split('-');

            locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : language;
        }
    }

    return locale;
}

function loadAllLocaleResources() {
    const req = require.context('../locales', true, /\.js$/);
    const resources = {};

    req.keys().forEach((file) => {
        const locale = file.replace('./', '').replace('.js', '');
        resources[locale] = req(file).default;
    });

    return resources;
}

function getString(rMap, key) {
    const keyArr = key.split('.');

    for (let idx = 0, len = keyArr.length; idx < len; ++idx) {
        if (idx === len - 1) {
            if (rMap) {
                return rMap[keyArr[idx]];
            } else {
                return undefined;
            }
        } else {
            if (rMap) {
                // eslint-disable-next-line no-param-reassign
                rMap = rMap[keyArr[idx]];
            } else {
                return undefined;
            }
        }
    }

    return undefined;
}

function getFormatString(rMap, key, valueArr) {
    let strTemplate = getString(rMap, key);

    if (!strTemplate) {
        return undefined;
    }

    valueArr.forEach((item, idx) => {
        // eslint-disable-next-line no-param-reassign, prefer-template
        strTemplate = strTemplate.replace(new RegExp('\\{' + idx + '\\}', 'g'), item);
    });

    return strTemplate;
}

const selectedLocale = initLocaleChoice();
const localeResourceMap = loadAllLocaleResources();

export default function msg(key, ...valueArr) {
    const value = getFormatString(localeResourceMap[selectedLocale], key, valueArr);

    if (!value) {
        return key;
    }

    return value;
}

msg.locale = selectedLocale;
