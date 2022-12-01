/**
 * @module M/language
 */
import en from './en';
import es from './es';
import Exception from '../exception/exception';

import pluginsLanguage from './plugins';

/**
 * Default object with es and en internacionalization.
 *
 * @const
 * @type {object}
 */
const configuration = {
  translations: {
    en,
    es,
  },
  lang: 'es',
};

/**
 * This function sets a new language internacionalization.
 * @param {string} lang
 * @param {JSON} json
 * @public
 * @api
 */
export const addTranslation = (lang, json) => {
  configuration.translations[lang] = json;
};

/**
 * This function gets a language internacionalization.
 *
 * @param {string} lang
 * @return {JSON}
 * @public
 * @api
 */
export const getTranslation = (lang) => {
  if (lang === 'es') {
    configuration.translations[lang].fulltoc = pluginsLanguage.fulltoc.esFulltoc;
  } else if (lang === 'en') {
    configuration.translations[lang].fulltoc = pluginsLanguage.fulltoc.enFulltoc;
  }
  return configuration.translations[lang];
};

/**
 * This function gets a language value from key
 *
 * @public
 * @param {string}
 * @param {string}
 * @return {string}
 * @public
 * @api
 */
export const getValue = (key, lang = configuration.lang) => {
  return getTranslation(lang)[key];
};

/**
 * This function sets the language of the library
 *
 * @function
 * @public
 * @api
 */
export const setLang = (lang) => {
  if (!Object.keys(configuration.translations).includes(lang)) {
    Exception(getValue('exception').unsupported_lang);
  }
  configuration.lang = lang;
};

/**
 * This function gets the language of the library
 *
 * @function
 * @public
 * @api
 */
export const getLang = () => {
  return configuration.lang;
};
