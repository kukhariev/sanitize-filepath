import { expect } from 'chai';
import { sanitize, sanitizePath } from './sanitize';

describe('test', () => {
  describe('sanitize', () => {
    it('truncate', () => {
      expect(sanitize('Привет 😊😊😊', { maxLength: 19 })).equal('Привет 😊');
      expect(sanitize('Привет 😊😊😊', { maxLength: 18 })).equal('Привет 😊');
      expect(sanitize('Привет 😊😊😊', { maxLength: 17 })).equal('Привет 😊');
      expect(sanitize('Привет 😊😊😊', { maxLength: 16 })).equal('Привет');
      expect(sanitize('Привет 😊😊😊', { maxLength: 15 })).equal('Привет');
    });

    it('illegal', () => {
      // expect(sanitize([] as unknown as string)).equal('');
      expect(sanitize('../тест')).equal('тест');
      expect(sanitize('./тест')).equal('тест');
      expect(sanitize('../../тест')).equal('тест');
      expect(sanitize('.тест')).equal('.тест');
      expect(sanitize('con')).equal('');
      expect(sanitize('com9')).equal('');
      expect(sanitize('con.com')).equal('com');
      expect(sanitize('con com')).equal('con com');
      expect(sanitize('..con..')).equal('..con');
      expect(sanitize('?cmd=rm+/tmp/*')).equal('cmd=rm+tmp');
      expect(sanitize('./test\t')).equal('test');
      expect(sanitize('./test\n')).equal('test');
    });

    it('spaces', () => {
      expect(sanitize('./test  file', { whitespaceReplacement: '_' })).equal('test__file');
      expect(sanitize('./test  ', { whitespaceReplacement: '_' })).equal('test');
      expect(sanitize('./test\t', { whitespaceReplacement: '_' })).equal('test');
      expect(sanitize('./test  .ext', { whitespaceReplacement: '_' })).equal('test__.ext');
      expect(sanitize('./test\t\t.ext', { whitespaceReplacement: '_' })).equal('test__.ext');
    });
  });

  describe('sanitizePath', () => {
    it('absolute', () => {
      expect(sanitizePath('//test')).equal('test');
      expect(sanitizePath('/test')).equal('test');
      expect(sanitizePath('c:\\test')).equal('test');
      expect(sanitizePath('\\test')).equal('test');
      expect(sanitizePath('c:\\test')).equal('test');
      expect(sanitizePath('c://test')).equal('test');
      expect(sanitizePath('c:/test')).equal('test');
      expect(sanitizePath('c:/test.com')).equal('test.com');
    });

    it('relative', () => {
      expect(sanitizePath('../test')).equal('test');
      expect(sanitizePath('../.test')).equal('.test');
      expect(sanitizePath('.....///test')).equal('...test');
      expect(sanitizePath('./test/file')).equal('test/file');
      expect(sanitizePath('./test/../../file')).equal('test/file');
      expect(sanitizePath('./test/./../file')).equal('test/file');
      expect(sanitizePath('./test//file')).equal('test/file');
      expect(sanitizePath('./test\\file')).equal('test/file');
    });
  });
});
