import { CreateTodoData, CreateTodoVariables, ListTodosForUserData, ListTodosForUserVariables, UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables, ListPublicScheduleEventsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateTodo(options?: useDataConnectMutationOptions<CreateTodoData, FirebaseError, CreateTodoVariables>): UseDataConnectMutationResult<CreateTodoData, CreateTodoVariables>;
export function useCreateTodo(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTodoData, FirebaseError, CreateTodoVariables>): UseDataConnectMutationResult<CreateTodoData, CreateTodoVariables>;

export function useListTodosForUser(vars: ListTodosForUserVariables, options?: useDataConnectQueryOptions<ListTodosForUserData>): UseDataConnectQueryResult<ListTodosForUserData, ListTodosForUserVariables>;
export function useListTodosForUser(dc: DataConnect, vars: ListTodosForUserVariables, options?: useDataConnectQueryOptions<ListTodosForUserData>): UseDataConnectQueryResult<ListTodosForUserData, ListTodosForUserVariables>;

export function useUpdateGoalTaskCompletion(options?: useDataConnectMutationOptions<UpdateGoalTaskCompletionData, FirebaseError, UpdateGoalTaskCompletionVariables>): UseDataConnectMutationResult<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;
export function useUpdateGoalTaskCompletion(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGoalTaskCompletionData, FirebaseError, UpdateGoalTaskCompletionVariables>): UseDataConnectMutationResult<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;

export function useListPublicScheduleEvents(options?: useDataConnectQueryOptions<ListPublicScheduleEventsData>): UseDataConnectQueryResult<ListPublicScheduleEventsData, undefined>;
export function useListPublicScheduleEvents(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicScheduleEventsData>): UseDataConnectQueryResult<ListPublicScheduleEventsData, undefined>;
