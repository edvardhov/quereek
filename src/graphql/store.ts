import { gql } from '@apollo/client'

export const STORE_SNAPSHOT = gql`
  query StoreSnapshot {
    storeSnapshot {
      users {
        id
        name
        email
      }
      projects {
        id
        name
        description
        createdAt
      }
      tasks {
        id
        title
        description
        status
        projectId
        assigneeId
        createdAt
      }
    }
  }
`

export const UPDATE_RAW_TASK = gql`
  mutation UpdateRawTask($id: ID!, $patch: RawTaskPatch!) {
    updateRawTask(id: $id, patch: $patch) {
      id
      title
      description
      status
      projectId
      assigneeId
      createdAt
    }
  }
`

export const UPDATE_RAW_PROJECT = gql`
  mutation UpdateRawProject($id: ID!, $patch: RawProjectPatch!) {
    updateRawProject(id: $id, patch: $patch) {
      id
      name
      description
      createdAt
    }
  }
`

export const UPDATE_RAW_USER = gql`
  mutation UpdateRawUser($id: ID!, $patch: RawUserPatch!) {
    updateRawUser(id: $id, patch: $patch) {
      id
      name
      email
    }
  }
`

export const RESET_STORE = gql`
  mutation ResetStore {
    resetStore {
      users {
        id
        name
        email
      }
      projects {
        id
        name
        description
        createdAt
      }
      tasks {
        id
        title
        description
        status
        projectId
        assigneeId
        createdAt
      }
    }
  }
`
