import { gql } from '@apollo/client'
import { TASK_FIELDS } from './fragments'

export const TASK_CHANGED = gql`
  subscription TaskChanged($projectId: ID!) {
    taskChanged(projectId: $projectId) {
      action
      taskId
      projectId
      task {
        ...TaskFields
        project {
          id
        }
      }
    }
  }
  ${TASK_FIELDS}
`
