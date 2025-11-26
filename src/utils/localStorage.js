/**
 * src/utils/localStorage.js
 *
 * LocalStorage를 안전하게 사용하기 위한 유틸리티 함수들
 *
 * 장점:
 * 1. 에러 처리 자동화 (try-catch)
 * 2. 저장소 키 중앙화 (constants에서 관리)
 * 3. JSON 직렬화/역직렬화 자동화
 * 4. 타입 안정성
 *
 * 주의사항:
 * - LocalStorage는 최대 5-10MB 용량
 * - 민감한 정보는 저장하면 안 됨 (현재 프로젝트는 SSO 인증)
 * - 서버 마이그레이션 시 이 함수들은 제거될 예정
 *
 * 사용 예시:
 * import { saveData, getData, removeData } from '@/utils/localStorage'
 *
 * saveData('messages', [{ id: 1, text: '안녕' }])
 * const messages = getData('messages', []) // 기본값 []
 * removeData('messages')
 */

import { STORAGE_KEYS } from "./constants";

/**
 * LocalStorage 저장 (안전하게)
 *
 * @param {string} key - 저장소 키
 * @param {any} value - 저장할 값 (자동으로 JSON 변환)
 * @returns {boolean} - 성공 여부
 *
 * 예시:
 * saveData(STORAGE_KEYS.CHAT_MESSAGES, messages)
 */
export function saveData(key, value) {
  try {
    // 값이 null/undefined면 저장하지 않음
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return true;
    }

    // JSON으로 변환 후 저장
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);

    console.log(`✅ LocalStorage 저장 성공: ${key}`);
    return true;
  } catch (error) {
    // LocalStorage 용량 초과 등의 에러 처리
    if (error.name === "QuotaExceededError") {
      console.error(`❌ LocalStorage 용량 초과: ${key}`);
    } else {
      console.error(`❌ LocalStorage 저장 실패 (${key}):`, error);
    }
    return false;
  }
}

/**
 * LocalStorage 읽기 (안전하게)
 *
 * @param {string} key - 저장소 키
 * @param {any} defaultValue - 없을 때 반환할 기본값
 * @returns {any} - 저장된 값 또는 기본값
 *
 * 예시:
 * const messages = getData(STORAGE_KEYS.CHAT_MESSAGES, [])
 */
export function getData(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);

    // 저장된 값이 없으면 기본값 반환
    if (item === null) {
      return defaultValue;
    }

    // JSON 파싱 (에러 시 기본값 반환)
    const parsed = JSON.parse(item);
    console.log(`✅ LocalStorage 로드 성공: ${key}`);
    return parsed;
  } catch (error) {
    console.error(`❌ LocalStorage 로드 실패 (${key}):`, error);
    return defaultValue;
  }
}

/**
 * LocalStorage 삭제
 *
 * @param {string} key - 저장소 키
 * @returns {boolean} - 성공 여부
 *
 * 예시:
 * removeData(STORAGE_KEYS.CHAT_MESSAGES)
 */
export function removeData(key) {
  try {
    localStorage.removeItem(key);
    console.log(`✅ LocalStorage 삭제 성공: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ LocalStorage 삭제 실패 (${key}):`, error);
    return false;
  }
}

/**
 * LocalStorage 전체 초기화
 * (주의: 신중하게 사용!)
 *
 * @returns {boolean} - 성공 여부
 */
export function clearAll() {
  try {
    localStorage.clear();
    console.log("✅ LocalStorage 전체 초기화 성공");
    return true;
  } catch (error) {
    console.error("❌ LocalStorage 전체 초기화 실패:", error);
    return false;
  }
}

/**
 * LocalStorage에 객체 필드 추가 (기존 값 유지)
 *
 * @param {string} key - 저장소 키
 * @param {Object} fields - 추가할 필드들 { field1: value1, ... }
 * @returns {boolean} - 성공 여부
 *
 * 예시:
 * // 기존 사용자 설정에 새로운 필드 추가
 * mergeData(STORAGE_KEYS.USER_PREFERENCES, { theme: 'dark' })
 */
export function mergeData(key, fields) {
  try {
    const existing = getData(key, {});
    const merged = { ...existing, ...fields };
    return saveData(key, merged);
  } catch (error) {
    console.error(`❌ LocalStorage 병합 실패 (${key}):`, error);
    return false;
  }
}

/**
 * LocalStorage 저장소 크기 확인
 *
 * @returns {Object} - { used: bytes, percentage: 0-100 }
 *
 * 예시:
 * const size = getStorageSize()
 * console.log(`사용량: ${size.used} bytes (${size.percentage}%)`)
 */
export function getStorageSize() {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }

    // LocalStorage 일반적 제한: 5-10MB (5,242,880 바이트)
    const limit = 5 * 1024 * 1024;
    const percentage = ((total / limit) * 100).toFixed(2);

    return {
      used: total,
      limit: limit,
      percentage: percentage,
    };
  } catch (error) {
    console.error("LocalStorage 크기 확인 실패:", error);
    return { used: 0, limit: 0, percentage: 0 };
  }
}

/**
 * LocalStorage 모든 키 조회
 *
 * @returns {Array<string>} - 저장된 모든 키의 배열
 */
export function getAllKeys() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  } catch (error) {
    console.error("LocalStorage 키 조회 실패:", error);
    return [];
  }
}

/**
 * LocalStorage 전체 내용 조회 (디버깅용)
 *
 * @returns {Object} - 모든 저장된 데이터
 *
 * 예시 (콘솔에서):
 * const data = getAll()
 * console.table(data)
 */
export function getAll() {
  try {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = getData(key);
    }
    return data;
  } catch (error) {
    console.error("LocalStorage 조회 실패:", error);
    return {};
  }
}

/**
 * LocalStorage 사용 가능 여부 확인
 * (일부 브라우저 설정에서 비활성화될 수 있음)
 *
 * @returns {boolean} - 사용 가능 여부
 */
export function isLocalStorageAvailable() {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn("LocalStorage를 사용할 수 없습니다:", error);
    return false;
  }
}

/**
 * 특정 키 존재 여부 확인
 *
 * @param {string} key - 확인할 키
 * @returns {boolean} - 존재 여부
 */
export function hasKey(key) {
  return localStorage.getItem(key) !== null;
}

/**
 * 키 프리픽스로 데이터 조회
 * (특정 유형의 저장소 키만 가져올 때 유용)
 *
 * @param {string} prefix - 프리픽스 (예: 'oci_ai_')
 * @returns {Object} - 매칭되는 모든 데이터
 *
 * 예시:
 * const chatData = getByPrefix('oci_ai_works_chat')
 */
export function getByPrefix(prefix) {
  try {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        data[key] = getData(key);
      }
    }
    return data;
  } catch (error) {
    console.error("프리픽스 조회 실패:", error);
    return {};
  }
}
