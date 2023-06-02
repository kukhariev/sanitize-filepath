import { expect } from 'chai';
import { sanitize, sanitizePath } from './sanitize';

describe('test', () => {
  describe('sanitize', () => {
    it('truncate', () => {
      expect(sanitize('Привет 😊😊😊', { truncate: 19 })).equal('Привет 😊');
      expect(sanitize('Привет 😊😊😊', { truncate: 18 })).equal('Привет 😊');
      expect(sanitize('Привет 😊😊😊', { truncate: 17 })).equal('Привет 😊');
      expect(sanitize('Привет 😊😊😊', { truncate: 16 })).equal('Привет ');
      expect(sanitize('Привет 😊😊😊', { truncate: 15 })).equal('Привет ');
    });

    it('illegal', () => {
      expect(sanitize('../тест')).equal('..тест');
      expect(sanitize('./тест')).equal('.тест');
      expect(sanitize('../../тест')).equal('....тест');
      expect(sanitize('con')).equal('');
      expect(sanitize('com9')).equal('');
      expect(sanitize('con.com')).equal('com');
      expect(sanitize('con com')).equal('con com');
      expect(sanitize('..con..')).equal('..con');
      expect(sanitize('?cmd=rm+/tmp/*')).equal('cmd=rm+tmp');
    });

    it('spaces', () => {
      expect(sanitize('./test  file', { whitespaceReplacer: '_' })).equal('.test__file');
      expect(sanitize('./test  ', { whitespaceReplacer: '_' })).equal('.test');
    });
  });
  
  describe('sanitizePath', () => {
    it('absolute', () => {
      expect(sanitizePath('./test')).equal('test');
      expect(sanitizePath('../test')).equal('test');
      expect(sanitizePath('.....///test')).equal('test');
      expect(sanitizePath('//test')).equal('test');
      expect(sanitizePath('/test')).equal('test');
      expect(sanitizePath('c:\\test')).equal('test');
      expect(sanitizePath('\\test')).equal('test');
      expect(sanitizePath('c:\\test')).equal('test');
      expect(sanitizePath('c://test')).equal('test');
      expect(sanitizePath('c:/test')).equal('test');
    });

    it('relative', () => {
      expect(sanitizePath('./test/file')).equal('test/file');
      expect(sanitizePath('./test//file')).equal('test/file');
      expect(sanitizePath('./test\\file')).equal('test/file');
    });
  });
});
