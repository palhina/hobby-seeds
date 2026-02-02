/**
 * カスタムJestリゾルバー
 *
 * Expo SDK 54のwinter runtimeモジュールを空のモジュールにリダイレクト
 */

const path = require('path');

module.exports = (request, options) => {
  // expo/src/winter配下のモジュールは空のモックにリダイレクト
  if (request.includes('expo/src/winter')) {
    return path.resolve(__dirname, '__mocks__/expo-winter.js');
  }

  // デフォルトのリゾルバーを使用
  return options.defaultResolver(request, options);
};
