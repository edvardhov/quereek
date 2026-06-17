import { gql } from '@apollo/client'
import { PROJECT_FIELDS, TASK_FIELDS } from './fragments'

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`

export const GET_PROJECT_BOARD = gql`
  query GetProjectBoard($projectId: ID!) {
    project(id: $projectId) {
      ...ProjectFields
      tasks {
        ...TaskFields
      }
    }
    users {
      id
      name
      email
    }
  }
  ${PROJECT_FIELDS}
  ${TASK_FIELDS}
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`
