import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateTodoData {
  todo_insert: Todo_Key;
}

export interface CreateTodoVariables {
  userId: UUIDString;
  title: string;
  isCompleted: boolean;
  createdAt: TimestampString;
}

export interface GoalTask_Key {
  id: UUIDString;
  __typename?: 'GoalTask_Key';
}

export interface Goal_Key {
  id: UUIDString;
  __typename?: 'Goal_Key';
}

export interface ListPublicScheduleEventsData {
  scheduleEvents: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    startTime: TimestampString;
    endTime: TimestampString;
    location?: string | null;
  } & ScheduleEvent_Key)[];
}

export interface ListTodosForUserData {
  todos: ({
    id: UUIDString;
    title: string;
    isCompleted: boolean;
    description?: string | null;
    dueDate?: TimestampString | null;
    category?: string | null;
  } & Todo_Key)[];
}

export interface ListTodosForUserVariables {
  userId: UUIDString;
}

export interface ScheduleEvent_Key {
  id: UUIDString;
  __typename?: 'ScheduleEvent_Key';
}

export interface Todo_Key {
  id: UUIDString;
  __typename?: 'Todo_Key';
}

export interface UpdateGoalTaskCompletionData {
  goalTask_update?: GoalTask_Key | null;
}

export interface UpdateGoalTaskCompletionVariables {
  id: UUIDString;
  isCompleted: boolean;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateTodoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTodoVariables): MutationRef<CreateTodoData, CreateTodoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTodoVariables): MutationRef<CreateTodoData, CreateTodoVariables>;
  operationName: string;
}
export const createTodoRef: CreateTodoRef;

export function createTodo(vars: CreateTodoVariables): MutationPromise<CreateTodoData, CreateTodoVariables>;
export function createTodo(dc: DataConnect, vars: CreateTodoVariables): MutationPromise<CreateTodoData, CreateTodoVariables>;

interface ListTodosForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTodosForUserVariables): QueryRef<ListTodosForUserData, ListTodosForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTodosForUserVariables): QueryRef<ListTodosForUserData, ListTodosForUserVariables>;
  operationName: string;
}
export const listTodosForUserRef: ListTodosForUserRef;

export function listTodosForUser(vars: ListTodosForUserVariables): QueryPromise<ListTodosForUserData, ListTodosForUserVariables>;
export function listTodosForUser(dc: DataConnect, vars: ListTodosForUserVariables): QueryPromise<ListTodosForUserData, ListTodosForUserVariables>;

interface UpdateGoalTaskCompletionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGoalTaskCompletionVariables): MutationRef<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGoalTaskCompletionVariables): MutationRef<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;
  operationName: string;
}
export const updateGoalTaskCompletionRef: UpdateGoalTaskCompletionRef;

export function updateGoalTaskCompletion(vars: UpdateGoalTaskCompletionVariables): MutationPromise<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;
export function updateGoalTaskCompletion(dc: DataConnect, vars: UpdateGoalTaskCompletionVariables): MutationPromise<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;

interface ListPublicScheduleEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicScheduleEventsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicScheduleEventsData, undefined>;
  operationName: string;
}
export const listPublicScheduleEventsRef: ListPublicScheduleEventsRef;

export function listPublicScheduleEvents(): QueryPromise<ListPublicScheduleEventsData, undefined>;
export function listPublicScheduleEvents(dc: DataConnect): QueryPromise<ListPublicScheduleEventsData, undefined>;

