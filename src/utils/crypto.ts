import CryptoJS from 'crypto-js';

// 환경 변수에서 SALT 값을 가져옴
const SALT = process.env.REACT_APP_PASSWORD_SALT;

if (!SALT) {
  throw new Error('REACT_APP_PASSWORD_SALT is not defined in environment variables');
}

export const sha256 = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

export const cryptoUtils = {
  /**
   * 안전한 난수 생성
   * @param length 생성할 난수의 길이 (바이트)
   * @returns 16진수 문자열
   */
  generateSecureRandom: (length: number): string => {
    return CryptoJS.lib.WordArray.random(length).toString();
  },

  /**
   * 패스워드 해시화
   * @param password 원본 패스워드
   * @returns 해시된 패스워드
   */
  hashPassword: (password: string): string => {
    if (!password) {
      throw new Error('Password is required');
    }
    // SALT와 함께 SHA-256 해시 생성
    return sha256(password + SALT);
  },

  /**
   * 새로운 SALT 값 생성
   * @returns 32바이트 길이의 SALT 값
   */
  generateSalt: (): string => {
    return cryptoUtils.generateSecureRandom(32);
  },
}; 