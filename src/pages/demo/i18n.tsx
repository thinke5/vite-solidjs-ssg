import { changeLanguage, lang, t } from '~/lib/i18n'
import { Counter } from '.'

/**  */
export default function I18n() {
  return (
    <div>
      <div class="mr-1 s-3 animate-spin rd bg-cyan"></div>
      <p>{t('other:dang-qian-yu-yan-wei')}{lang()}</p>
      <div class="f-c/c gap-3 py-3">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('zh')}>中文</button>
      </div>
      <p>{t('this-is-i18n')};{t('example_message', { username: '名字1' })}</p>
      <p>{t('other:other')}</p>
      <Counter />
      <hr />

    </div>
  )
};
