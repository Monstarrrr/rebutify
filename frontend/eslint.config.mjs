/*
  Error: "Parsing error: No Babel config file detected" - eslint
  Status:  
  - Rebutify: https://github.com/Monstarrrr/rebutify/issues/24
  - VSCode ESLint: https://github.com/microsoft/vscode-eslint/issues/1397#issuecomment-2082499728
*/
import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
]
