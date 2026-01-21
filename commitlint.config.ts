const commitTypes = [
  'chore',
  'fix',
  'feat',
  'docs',
  'style',
  'refactor',
  'test',
  'ci',
  'build',
  'revert',
  'wip',
]

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', commitTypes],
  },
}
