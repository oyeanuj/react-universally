import config from '../config';

config('locales').each((locale) => {
  require(`../src/translations/${locale}.json`);
});
