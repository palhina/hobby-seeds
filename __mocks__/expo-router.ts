/**
 * expo-routerのモック
 *
 * useRouter、useLocalSearchParams等のモック実装
 */

export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

export const mockSearchParams: Record<string, string> = {};

export const useRouter = jest.fn(() => mockRouter);

export const useLocalSearchParams = jest.fn(() => mockSearchParams);

export const usePathname = jest.fn(() => "/");

export const useSegments = jest.fn(() => []);

export const useGlobalSearchParams = jest.fn(() => ({}));

export const useFocusEffect = jest.fn((callback: () => void) => {
  callback();
});

export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
}));

export const router = mockRouter;

export const resetMockRouter = () => {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
  mockRouter.setParams.mockClear();
};

export const setMockSearchParams = (params: Record<string, string>) => {
  Object.assign(mockSearchParams, params);
};

export const clearMockSearchParams = () => {
  Object.keys(mockSearchParams).forEach((key) => {
    delete mockSearchParams[key];
  });
};
