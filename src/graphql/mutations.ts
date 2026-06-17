import { gql } from '@apollo/client'
import { PROJECT_FIELDS, TASK_FIELDS } from './fragments'

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFields
      project {
        id
      }
    }
  }
  ${TASK_FIELDS}
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
      project {
        id
      }
    }
  }
  ${TASK_FIELDS}
`

export const MOVE_TASK = gql`
  mutation MoveTask($id: ID!, $status: TaskStatus!) {
    moveTask(id: $id, status: $status) {
      ...TaskFields
      project {
        id
      }
    }
  }
  ${TASK_FIELDS}
`

export const ASSIGN_TASK = gql`
  mutation AssignTask($id: ID!, $userId: ID) {
    assignTask(id: $id, userId: $userId) {
      ...TaskFields
      project {
        id
      }
    }
  }
  ${TASK_FIELDS}
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      project {
        id
      }
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`
