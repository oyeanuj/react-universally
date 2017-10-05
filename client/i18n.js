import config from '../config';

config('locales').each((locale) => {
  require(`../shared/translations/${locale}.json`);
});
