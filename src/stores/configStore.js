import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * ============================================================
 * [Pinia Store] 서버 설정 전역 관리
 * ============================================================
 *
 * 역할:
 * - /api/app/info에서 받은 서버 설정 데이터 저장
 * - 전역에서 사용할 수 있도록 getter 제공
 * - LocalStorage에 백업 (오프라인 대응)
 * - CSS 변수로 테마 자동 적용
 *
 * Vue2 vs Vue3:
 * - Vue2: Vuex의 state, getters, mutations, actions
 * - Vue3: Pinia의 setup 방식 (ref, computed 직접 사용)
 *
 * 사용 예시:
 * import { useConfigStore } from '@/stores/configStore'
 * const configStore = useConfigStore()
 * const logo = configStore.logoImageUrl
 *
 * **/
export const useConfigStore = defineStore("config", () => {
  // State (상태 정의)
  /**
   * 서버에서 받은 원본 데이터
   * 전체 응답 구조를 그대로 저장
   */
  const serverConfig = ref(null);
  /**
   * 로딩 상태
   * - true: API 호출 중
   * - false: 로딩 완료
   */
  const isLoading = ref(false);
  /**
   * 에러 상태
   * API 호출 실패 시 에러 메시지 저장
   */
  const error = ref(null);

  // Getters - Common (공통 설정)
  /**
   * 회사명 (Office)
   * 예: "OCI"
   */
  const office = computed(() => {
    return serverConfig.value?.data?.info?.common?.office || "KTDS";
  });

  /**
   * 이미지 서버 기본 URL
   */
  const imageServerUrl = computed(() => {
    return serverConfig.value?.data?.info?.common?.imageServerUrl || "";
  });

  /**
   * Favicon 이미지 전체 URL
   */
  const faviconImageUrl = computed(() => {
    const base = imageServerUrl.value;
    const path = serverConfig.value?.data?.info?.common?.faviconImageUrl || "";
    return base + path;
  });

  /**
   * 기업고유의 프로필 이미지 URL
   */
  const defaultProfileImage = computed(() => {
    const base = imageServerUrl.value;
    const path =
      serverConfig.value?.data?.info?.login?.defaultProfileImage || "";
    return base + path;
  });

  /**
   * Main color에대한 hover hex code
   */
  const mainColorHexCode = computed(() => {
    return serverConfig.value?.data?.info?.common?.mainColorHexCode || "";
  });

  /**
   * Main color의 hover에 대한 hover hex code
   */
  const mainHoverColorHexCode = computed(() => {
    return serverConfig.value?.data?.info?.common?.mainHoverColorHexCode || "";
  });

  /**
   * Main color의 hover에 대한 hover hex code
   */
  const backgroundGradientStandardColor = computed(() => {
    return (
      serverConfig.value?.data?.info?.common?.backgroundGradientStandardColor ||
      ""
    );
  });

  const logoImageUrl = computed(() => {
    const base = imageServerUrl.value;
    const path = serverConfig.value?.data?.info?.common?.logoImageUrl || "";
    return base + path;
  });

  const opengraphImageUrl = computed(() => {
    const base = imageServerUrl.value;
    const path =
      serverConfig.value?.data?.info?.common?.opengraphImageUrl || "";
    return base + path;
  });

  const opengraphDescription = computed(() => {
    return serverConfig.value?.data?.info?.common?.opengraphDescription || "";
  });

  /**
   * 서브 색상 (HEX)
   * 예: "#545454"
   */
  const subColorHexCode = computed(() => {
    return serverConfig.value?.data?.info?.common?.subColorHexCode || "";
  });

  /**
   * 서브 Hover 색상 (HEX)
   * 예: "#999999"
   */
  const subHoverColorHexCode = computed(() => {
    return serverConfig.value?.data?.info?.common?.subHoverColorHexCode || "";
  });

  // Getters - Login (로그인 페이지)
  /**
   * 로그인 패널 이미지 URL
   */
  const loginPannelImageUrl = computed(() => {
    const base = imageServerUrl.value;
    const path = serverConfig.value?.data?.info?.login?.pannelImageUrl || "";
    return base + path;
  });

  /**
   * AI 모델 목록
   * 예: [{ id: "1", modelName: "GPT-5", ... }, ...]
   */
  const aiModels = computed(() => {
    return serverConfig.value?.data?.info?.main?.aiModels || [];
  });

  /**
   * AI Agent 카드 목록
   * 예: [{ id: "1", type: "chatCard", title: "사규AI", ... }, ...]
   */
  const aiAgentCards = computed(() => {
    return serverConfig.value?.data?.info?.main?.aiAgentCards || [];
  });

  /**
   * AI Agent 버튼 그라디언트 설정
   */
  const aiAgentButtonConfig = computed(() => {
    return (
      serverConfig.value?.data?.info?.main?.aiAgentButtonConfig || {
        startGradientColor: "",
        endGradientColor: "",
      }
    );
  });

  /**
   * 업로드 기능 설정
   */
  const uploadFeatureConfig = computed(() => {
    return (
      serverConfig.value?.data?.info?.main?.uploadFeatureConfig || {
        fileUploadUsage: "",
        imageUploadUsage: "",
      }
    );
  });

  /**
   * 채팅 Agent URL
   */
  const chatAgentUrl = computed(() => {
    return serverConfig.value?.data?.info?.main?.chat?.agentUrl || "";
  });

  /**
   * 파일 업로드 사용 가능 여부
   * "true" -> true, "false" -> false 변환
   */
  const isFileUploadEnabled = computed(() => {
    return uploadFeatureConfig.value.fileUploadUsage === "true";
  });

  /**
   * 이미지 업로드 사용 가능 여부
   * "true" -> true, "false" -> false 변환
   */
  const isImageUploadEnabled = computed(() => {
    return uploadFeatureConfig.value.imageUploadUsage === "true";
  });

  /**
   * 전체 설정이 로드되었는지 확인
   */
  const isConfigLoaded = computed(() => {
    return serverConfig.value !== null;
  });

  // Actions (메서드)
  /**
   * 서버에서 설정 데이터 가져오기
   *
   * @param {string} apiUrl - API 엔드포인트 (기본값: '/api/app/info')
   * @returns {Promise<Object>} 서버 응답 데이터
   *
   * 동작:
   * 1. API 호출 (실제 API 없을 때는 Mock 데이터 반환)
   * 2. 응답 데이터를 serverConfig에 저장
   * 3. LocalStorage에 백업
   * 4. CSS 변수로 테마 적용
   */

  /**
   * 서버에서 설정 데이터 가져오기
   *
   * @param {string} apiUrl - API 엔드포인트 (기본값: '/api/app/info')
   * @returns {Promise<Object>} 서버 응답 데이터
   *
   * 동작:
   * 1. API 호출 (실제 API 없을 때는 Mock 데이터 반환)
   * 2. 응답 데이터를 serverConfig에 저장
   * 3. LocalStorage에 백업
   * 4. CSS 변수로 테마 적용
   */
  async function fetchConfig(apiUrl = "/api/app/info") {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("📡 Fetching config from:", apiUrl);

      // ============================================================
      // TODO: 실제 API 호출로 교체
      // const response = await fetch(apiUrl)
      // const data = await response.json()
      // ============================================================

      // 🔥 임시 Mock 데이터 (실제 API 없을 때 사용)
      const data = getMockConfigData();

      // 서버 데이터 저장
      serverConfig.value = data;

      // LocalStorage에 백업 (오프라인 대비)
      localStorage.setItem("config_cache", JSON.stringify(data));
      // localStorage.setItem('config_timestamp', Date.now().toString())
      applyThemeToDOM();
      console.log("✅ Config loaded successfully!");
      console.log("📦 Config data:", data);

      return data;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Failed to fetch config:", err);

      // 에러 발생 시 LocalStorage 캐시 사용
      // tryRestoreFromCache();

      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 임시 Mock 데이터
   */
  function getMockConfigData() {
    const office = "komsco";
    const privateImageServerUrl =
      "https://raw.githubusercontent.com/Developer-Brandon/image-temp-repo/refs/heads/main";
    if (office === "oci") {
      return {
        status: 200,
        message: "success",
        data: {
          info: {
            common: {
              office: `${office}`.toUpperCase(),
              imageServerUrl: `${privateImageServerUrl}`,
              faviconImageUrl: `/${office}/favicon.png`,
              opengraphImageUrl: `/${office}/opengraph.png`,
              opengraphDescription: `OCI의 컴퓨트·스토리지·네트워크·보안 자원을 자동화하고 운영 효율을 극대화하는 클라우드 AI 솔루션입니다.`,
              logoImageUrl: `/${office}/logo.png`,
              mainColorHexCode: "#D0021B",
              mainHoverColorHexCode: "#FFF3F3",
              subColorHexCode: "#545454",
              subHoverColorHexCode: "#999999",
              backgroundGradientStandardColor: "#F7EFEF",
            },
            login: {
              defaultProfileImage: `/${office}/default_profile.png`,
              pannelImageUrl: `/${office}/pannel.png`,
            },
            main: {
              aiModels: [
                {
                  id: "1",
                  madeBy: "OpenAI",
                  modelName: "GPT-5",
                  realUsageCount: "90",
                  wholeUsageCount: "100",
                  modelIntroduction: "복잡한 분석, 고난이도 작업에 유리한 모델",
                },
                {
                  id: "2",
                  madeBy: "OpenAI",
                  modelName: "GPT-4.1",
                  realUsageCount: "100",
                  wholeUsageCount: "100",
                  modelIntroduction:
                    "빠른 속도와 안정적인 품질을 제공하는 모델",
                },
                {
                  id: "3",
                  madeBy: "OpenAI",
                  modelName: "GPT-4",
                  realUsageCount: "100",
                  wholeUsageCount: "100",
                  modelIntroduction: "표준 업무, 반복 작업, 신뢰성 높은 모델",
                },
                {
                  id: "4",
                  madeBy: "Anthropic",
                  modelName: "Sonnet4.5",
                  realUsageCount: "100",
                  wholeUsageCount: "100",
                  modelIntroduction:
                    "높은 언어 이해로 일상적인 작업에 좋은 모델",
                },
              ],
              aiAgentCards: [
                {
                  id: "1",
                  order: "1",
                  type: "chatCard",
                  cardThumbnailUrl: `/${office}/card_image1.png`,
                  title: "사규AI",
                  explain:
                    "사내규정에 기반하여 신속하고 정확한 답변을 제공하고 있습니다",
                },
                {
                  id: "2",
                  order: "2",
                  type: "chatCard",
                  cardThumbnailUrl: `/${office}/card_image2.png`,
                  title: "Onboarding  AI",
                  explain:
                    "신입사원을 위한 사내 다양한 프로세스 관한 질문을 시원하게 답변해드려요",
                },
                {
                  id: "3",
                  order: "3",
                  type: "questionCard",
                  cardThumbnailUrl: "",
                  title: "OCIC 자주하는 질문",
                  questionList: [
                    "Q. 제공하는 언어모델 종류가 궁금해요",
                    "Q. Agent 사용 시 차이가 어떤가요?",
                    "Q. 내부문서를 업로드 할 수 있나요?",
                    "Q. 대화 목록은 언제까지 저장되나요?",
                    "Q. API 사용량이나 비용은 어디서 확인할 수 있나요?",
                    "Q. 팀원과 대화 기록을 공유할 수 있나요?",
                    "Q. 모델 응답 속도가 느려질 때 해결 방법이 있나요?",
                    "Q. 파일 업로드 시 최대 용량 제한이 있나요?",
                    "Q. 보안 관련해서 어떤 인증 방식을 지원하나요?",
                    "Q. 모바일 환경에서도 동일하게 사용할 수 있나요?",
                  ],
                },
              ],
              aiAgentButtonConfig: {
                startGradientColor: "#D0021B",
                endGradientColor: "#006400",
              },
              uploadFeatureConfig: {
                fileUploadUsage: "true",
                imageUploadUsage: "false",
              },
              chat: {
                agentUrl: "",
              },
            },
          },
        },
      };
    } else if (office === "komsco") {
      return {
        status: 200,
        message: "success",
        data: {
          info: {
            common: {
              office: `${office}`.toUpperCase(),
              imageServerUrl: `${privateImageServerUrl}`,
              faviconImageUrl: `/${office}/favicon.png`,
              opengraphImageUrl: `/${office}/opengraph.png`,
              opengraphDescription: `조폐공사의 예산·감사·특허·자료 분석 업무를 자동화하고 효율화하는 맞춤형 AI 솔루션입니다.`,
              logoImageUrl: `/${office}/logo.png`,
              mainColorHexCode: "#2384C6",
              mainHoverColorHexCode: "#E6EEF5",
              subColorHexCode: "#545454",
              subHoverColorHexCode: "#999999",
              backgroundGradientStandardColor: "#D3EDFF",
            },
            login: {
              defaultProfileImage: `/${office}/default_profile.png`,
              pannelImageUrl: `/${office}/pannel.png`,
            },
            main: {
              aiModels: [
                {
                  id: "1",
                  madeBy: "OpenAI",
                  modelName: "GPT-5",
                  realUsageCount: "90",
                  wholeUsageCount: "100",
                  modelIntroduction: "복잡한 분석, 고난이도 작업에 유리한 모델",
                },
                {
                  id: "2",
                  madeBy: "OpenAI",
                  modelName: "GPT-4.1",
                  realUsageCount: "100",
                  wholeUsageCount: "100",
                  modelIntroduction:
                    "빠른 속도와 안정적인 품질을 제공하는 모델",
                },
                {
                  id: "3",
                  madeBy: "OpenAI",
                  modelName: "GPT-4",
                  realUsageCount: "100",
                  wholeUsageCount: "100",
                  modelIntroduction: "표준 업무, 반복 작업, 신뢰성 높은 모델",
                },
                {
                  id: "4",
                  madeBy: "Anthropic",
                  modelName: "Sonnet4.5",
                  realUsageCount: "100",
                  wholeUsageCount: "100",
                  modelIntroduction:
                    "높은 언어 이해로 일상적인 작업에 좋은 모델",
                },
              ],
              aiAgentCards: [
                {
                  id: "1",
                  order: "1",
                  type: "chatCard",
                  cardThumbnailUrl: `/${office}/card_image1.png`,
                  title: "국정감사AI",
                  explain:
                    "국정감사 관련한 다양한 질의에 대해서 빠르게 답변해 드립니다",
                },
                {
                  id: "2",
                  order: "2",
                  type: "chatCard",
                  cardThumbnailUrl: `/${office}/card_image2.png`,
                  title: "사규AI",
                  explain:
                    "사내규정에 기반하여 신속하고 정확한 답변을 제공하고 있습니다",
                },
                {
                  id: "3",
                  order: "3",
                  type: "questionCard",
                  cardThumbnailUrl: "",
                  title: "KOSCOM 자주하는 질문",
                  questionList: [
                    "Q. 사업별 예산 편성의 기준이 궁금해요",
                    "Q. 특허 관련 자료를 분석해주세요",
                    "Q. 최근 5년간 국정감사 보고자료 분석",
                    "Q. 출장관련 비용에 대한 감사내역",
                    "Q. 한국조폐공사의 주요 사업 구조와 ...",
                    "Q. 최근 발행된 화폐·주화 제작 단가 ...",
                    "Q. 한국조폐공사와 관련된 공공기관 ...",
                    "Q. 블록체인·모바일 공인인증 등 한국...",
                    "Q. 조폐공사 주요 해외 수출 실적(여권...",
                    "Q. 조폐공사와 관련된 입찰·계약 정보...",
                  ],
                },
              ],
              aiAgentButtonConfig: {
                startGradientColor: "#D0021B",
                endGradientColor: "#006400",
              },
              uploadFeatureConfig: {
                fileUploadUsage: "true",
                imageUploadUsage: "false",
              },
              chat: {
                agentUrl: "",
              },
            },
          },
        },
      };
    }
  }

  /**
   * CSS 변수로 테마 적용
   *
   * 동작:
   * - 서버에서 받은 색상을 CSS Custom Properties로 변환
   * - :root에 적용하여 모든 컴포넌트에서 사용 가능
   *
   * 예시:
   * --color-main: #D0021B
   *
   * 사용법 (SCSS):
   * .button { background: var(--color-main);
   * }
   */

  function applyThemeToDOM() {
    if (!serverConfig.value) {
      console.warn("⚠️ serverConfig is null");
      return;
    }

    const root = document.documentElement;

    // 적용할 값 모아두기
    const themeValues = {
      "--login-pannel-image": `url(${loginPannelImageUrl.value})`,
      "--primary-color": mainColorHexCode.value,
      "--sub-color": subColorHexCode.value,
    };

    // 실제 DOM에 스타일 적용
    Object.entries(themeValues).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 검증 로그 출력
    console.dir(themeValues);
  }

  /**
   * LocalStorage 캐시에서 설정 복원
   * 사용 시나리오:
   * - API 호출 실패 시
   * - 오프라인 상태일 때
   */
  function tryRestoreFromCache() {
    try {
      const cached = localStorage.getItem("config_cache");
      if (cached) {
        serverConfig.value = JSON.parse(cached);
        applyThemeToDOM();
        console.log("⚠️ Using cached config data");
      } else {
        console.warn("⚠️ No cached config available, using defaults");
      }
    } catch (err) {
      console.error("❌ Failed to restore from cache:", err);
    }
  }

  /**
   * 캐시 유효성 검사
   * 1시간 이상 지난 캐시는 무효로 간주
   * TODO: 도입여부 검토
   */
  function isCacheValid() {
    const timestamp = localStorage.getItem("config_timestamp");
    if (!timestamp) return false;

    const ONE_HOUR = 60 * 60 * 1000;
    return Date.now() - parseInt(timestamp) < ONE_HOUR;
  }

  // Return (외부 노출)
  return {
    // State
    serverConfig,
    isLoading,
    error,
    // Getters - Common
    office,
    imageServerUrl,
    faviconImageUrl,
    logoImageUrl,
    opengraphImageUrl,
    opengraphDescription,
    mainColorHexCode,
    mainHoverColorHexCode,
    subColorHexCode,
    subHoverColorHexCode,
    backgroundGradientStandardColor,
    // Getters - Login
    defaultProfileImage,
    loginPannelImageUrl,
    // Getters - Main
    aiModels,
    aiAgentCards,
    aiAgentButtonConfig,
    uploadFeatureConfig,
    chatAgentUrl,
    isFileUploadEnabled,
    isImageUploadEnabled,
    // Computed
    isConfigLoaded,
    // Actions
    fetchConfig,
    applyThemeToDOM,
    isCacheValid,
  };
});
