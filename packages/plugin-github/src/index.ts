import { BasePlugin } from '@bitx-sh/config/plugins'
import type { Schema } from '@bitx-sh/config/types'

export default class GitHubPlugin extends BasePlugin {
  name = '@bitx-sh/plugin-github'
  version = '0.0.1'

  private readonly defaultSchema: Schema = {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Workflow name' },
      on: {
        type: 'object',
        properties: {
          push: {
            type: 'object',
            properties: {
              branches: { type: 'array', items: { type: 'string' } }
            }
          },
          pull_request: {
            type: 'object',
            properties: {
              branches: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      jobs: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            runs-on: { type: 'string' },
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  uses: { type: 'string' },
                  with: { type: 'object', additionalProperties: true },
                  run: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }

  protected async initialize(): Promise<void> {
    // Register transformers
    this.context.registerTransformer('github-workflow', {
      async transform(config: any) {
        return config
      }
    })
  }

  async loadSchema(): Promise<Schema> {
    return this.defaultSchema
  }

  async generate(schema: Schema, options: any = {}): Promise<any> {
    return {
      name: 'CI',
      on: {
        push: {
          branches: ['main']
        },
        pull_request: {
          branches: ['main']
        }
      },
      jobs: {
        test: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              uses: 'actions/checkout@v4'
            },
            {
              uses: 'oven-sh/setup-bun@v1'
            },
            {
              run: 'bun install'
            },
            {
              run: 'bun test'
            }
          ]
        }
      },
      ...options
    }
  }
}
