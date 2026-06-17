/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  fragment TaskFields on Task {\n    id\n    title\n    description\n    status\n    createdAt\n    assignee {\n      ...UserFields\n    }\n  }\n  \n": typeof types.TaskFieldsFragmentDoc,
    "\n  fragment ProjectFields on Project {\n    id\n    name\n    description\n    createdAt\n  }\n": typeof types.ProjectFieldsFragmentDoc,
    "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n  \n": typeof types.CreateProjectDocument,
    "\n  mutation CreateTask($input: CreateTaskInput!) {\n    createTask(input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": typeof types.CreateTaskDocument,
    "\n  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n    updateTask(id: $id, input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": typeof types.UpdateTaskDocument,
    "\n  mutation MoveTask($id: ID!, $status: TaskStatus!) {\n    moveTask(id: $id, status: $status) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": typeof types.MoveTaskDocument,
    "\n  mutation AssignTask($id: ID!, $userId: ID) {\n    assignTask(id: $id, userId: $userId) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": typeof types.AssignTaskDocument,
    "\n  mutation DeleteTask($id: ID!) {\n    deleteTask(id: $id) {\n      id\n      project {\n        id\n      }\n    }\n  }\n": typeof types.DeleteTaskDocument,
    "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteProjectDocument,
    "\n  query GetProjects {\n    projects {\n      ...ProjectFields\n    }\n  }\n  \n": typeof types.GetProjectsDocument,
    "\n  query GetProjectBoard($projectId: ID!) {\n    project(id: $projectId) {\n      ...ProjectFields\n      tasks {\n        ...TaskFields\n      }\n    }\n    users {\n      id\n      name\n      email\n    }\n  }\n  \n  \n": typeof types.GetProjectBoardDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      email\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  subscription TaskChanged($projectId: ID!) {\n    taskChanged(projectId: $projectId) {\n      action\n      taskId\n      projectId\n      task {\n        ...TaskFields\n        project {\n          id\n        }\n      }\n    }\n  }\n  \n": typeof types.TaskChangedDocument,
};
const documents: Documents = {
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n": types.UserFieldsFragmentDoc,
    "\n  fragment TaskFields on Task {\n    id\n    title\n    description\n    status\n    createdAt\n    assignee {\n      ...UserFields\n    }\n  }\n  \n": types.TaskFieldsFragmentDoc,
    "\n  fragment ProjectFields on Project {\n    id\n    name\n    description\n    createdAt\n  }\n": types.ProjectFieldsFragmentDoc,
    "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n  \n": types.CreateProjectDocument,
    "\n  mutation CreateTask($input: CreateTaskInput!) {\n    createTask(input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": types.CreateTaskDocument,
    "\n  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n    updateTask(id: $id, input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": types.UpdateTaskDocument,
    "\n  mutation MoveTask($id: ID!, $status: TaskStatus!) {\n    moveTask(id: $id, status: $status) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": types.MoveTaskDocument,
    "\n  mutation AssignTask($id: ID!, $userId: ID) {\n    assignTask(id: $id, userId: $userId) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n": types.AssignTaskDocument,
    "\n  mutation DeleteTask($id: ID!) {\n    deleteTask(id: $id) {\n      id\n      project {\n        id\n      }\n    }\n  }\n": types.DeleteTaskDocument,
    "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n": types.DeleteProjectDocument,
    "\n  query GetProjects {\n    projects {\n      ...ProjectFields\n    }\n  }\n  \n": types.GetProjectsDocument,
    "\n  query GetProjectBoard($projectId: ID!) {\n    project(id: $projectId) {\n      ...ProjectFields\n      tasks {\n        ...TaskFields\n      }\n    }\n    users {\n      id\n      name\n      email\n    }\n  }\n  \n  \n": types.GetProjectBoardDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      email\n    }\n  }\n": types.GetUsersDocument,
    "\n  subscription TaskChanged($projectId: ID!) {\n    taskChanged(projectId: $projectId) {\n      action\n      taskId\n      projectId\n      task {\n        ...TaskFields\n        project {\n          id\n        }\n      }\n    }\n  }\n  \n": types.TaskChangedDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment TaskFields on Task {\n    id\n    title\n    description\n    status\n    createdAt\n    assignee {\n      ...UserFields\n    }\n  }\n  \n"): (typeof documents)["\n  fragment TaskFields on Task {\n    id\n    title\n    description\n    status\n    createdAt\n    assignee {\n      ...UserFields\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProjectFields on Project {\n    id\n    name\n    description\n    createdAt\n  }\n"): (typeof documents)["\n  fragment ProjectFields on Project {\n    id\n    name\n    description\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n  \n"): (typeof documents)["\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTask($input: CreateTaskInput!) {\n    createTask(input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation CreateTask($input: CreateTaskInput!) {\n    createTask(input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n    updateTask(id: $id, input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n    updateTask(id: $id, input: $input) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MoveTask($id: ID!, $status: TaskStatus!) {\n    moveTask(id: $id, status: $status) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation MoveTask($id: ID!, $status: TaskStatus!) {\n    moveTask(id: $id, status: $status) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AssignTask($id: ID!, $userId: ID) {\n    assignTask(id: $id, userId: $userId) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation AssignTask($id: ID!, $userId: ID) {\n    assignTask(id: $id, userId: $userId) {\n      ...TaskFields\n      project {\n        id\n      }\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTask($id: ID!) {\n    deleteTask(id: $id) {\n      id\n      project {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTask($id: ID!) {\n    deleteTask(id: $id) {\n      id\n      project {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjects {\n    projects {\n      ...ProjectFields\n    }\n  }\n  \n"): (typeof documents)["\n  query GetProjects {\n    projects {\n      ...ProjectFields\n    }\n  }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectBoard($projectId: ID!) {\n    project(id: $projectId) {\n      ...ProjectFields\n      tasks {\n        ...TaskFields\n      }\n    }\n    users {\n      id\n      name\n      email\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query GetProjectBoard($projectId: ID!) {\n    project(id: $projectId) {\n      ...ProjectFields\n      tasks {\n        ...TaskFields\n      }\n    }\n    users {\n      id\n      name\n      email\n    }\n  }\n  \n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUsers {\n    users {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription TaskChanged($projectId: ID!) {\n    taskChanged(projectId: $projectId) {\n      action\n      taskId\n      projectId\n      task {\n        ...TaskFields\n        project {\n          id\n        }\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  subscription TaskChanged($projectId: ID!) {\n    taskChanged(projectId: $projectId) {\n      action\n      taskId\n      projectId\n      task {\n        ...TaskFields\n        project {\n          id\n        }\n      }\n    }\n  }\n  \n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;