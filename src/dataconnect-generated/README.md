# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTodosForUser*](#listtodosforuser)
  - [*ListPublicScheduleEvents*](#listpublicscheduleevents)
- [**Mutations**](#mutations)
  - [*CreateTodo*](#createtodo)
  - [*UpdateGoalTaskCompletion*](#updategoaltaskcompletion)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListTodosForUser
You can execute the `ListTodosForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTodosForUser(vars: ListTodosForUserVariables): QueryPromise<ListTodosForUserData, ListTodosForUserVariables>;

interface ListTodosForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTodosForUserVariables): QueryRef<ListTodosForUserData, ListTodosForUserVariables>;
}
export const listTodosForUserRef: ListTodosForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTodosForUser(dc: DataConnect, vars: ListTodosForUserVariables): QueryPromise<ListTodosForUserData, ListTodosForUserVariables>;

interface ListTodosForUserRef {
  ...
  (dc: DataConnect, vars: ListTodosForUserVariables): QueryRef<ListTodosForUserData, ListTodosForUserVariables>;
}
export const listTodosForUserRef: ListTodosForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTodosForUserRef:
```typescript
const name = listTodosForUserRef.operationName;
console.log(name);
```

### Variables
The `ListTodosForUser` query requires an argument of type `ListTodosForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTodosForUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListTodosForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTodosForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListTodosForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTodosForUser, ListTodosForUserVariables } from '@dataconnect/generated';

// The `ListTodosForUser` query requires an argument of type `ListTodosForUserVariables`:
const listTodosForUserVars: ListTodosForUserVariables = {
  userId: ..., 
};

// Call the `listTodosForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTodosForUser(listTodosForUserVars);
// Variables can be defined inline as well.
const { data } = await listTodosForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTodosForUser(dataConnect, listTodosForUserVars);

console.log(data.todos);

// Or, you can use the `Promise` API.
listTodosForUser(listTodosForUserVars).then((response) => {
  const data = response.data;
  console.log(data.todos);
});
```

### Using `ListTodosForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTodosForUserRef, ListTodosForUserVariables } from '@dataconnect/generated';

// The `ListTodosForUser` query requires an argument of type `ListTodosForUserVariables`:
const listTodosForUserVars: ListTodosForUserVariables = {
  userId: ..., 
};

// Call the `listTodosForUserRef()` function to get a reference to the query.
const ref = listTodosForUserRef(listTodosForUserVars);
// Variables can be defined inline as well.
const ref = listTodosForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTodosForUserRef(dataConnect, listTodosForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.todos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.todos);
});
```

## ListPublicScheduleEvents
You can execute the `ListPublicScheduleEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicScheduleEvents(): QueryPromise<ListPublicScheduleEventsData, undefined>;

interface ListPublicScheduleEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicScheduleEventsData, undefined>;
}
export const listPublicScheduleEventsRef: ListPublicScheduleEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicScheduleEvents(dc: DataConnect): QueryPromise<ListPublicScheduleEventsData, undefined>;

interface ListPublicScheduleEventsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicScheduleEventsData, undefined>;
}
export const listPublicScheduleEventsRef: ListPublicScheduleEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicScheduleEventsRef:
```typescript
const name = listPublicScheduleEventsRef.operationName;
console.log(name);
```

### Variables
The `ListPublicScheduleEvents` query has no variables.
### Return Type
Recall that executing the `ListPublicScheduleEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicScheduleEventsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListPublicScheduleEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicScheduleEvents } from '@dataconnect/generated';


// Call the `listPublicScheduleEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicScheduleEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicScheduleEvents(dataConnect);

console.log(data.scheduleEvents);

// Or, you can use the `Promise` API.
listPublicScheduleEvents().then((response) => {
  const data = response.data;
  console.log(data.scheduleEvents);
});
```

### Using `ListPublicScheduleEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicScheduleEventsRef } from '@dataconnect/generated';


// Call the `listPublicScheduleEventsRef()` function to get a reference to the query.
const ref = listPublicScheduleEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicScheduleEventsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.scheduleEvents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.scheduleEvents);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTodo
You can execute the `CreateTodo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTodo(vars: CreateTodoVariables): MutationPromise<CreateTodoData, CreateTodoVariables>;

interface CreateTodoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTodoVariables): MutationRef<CreateTodoData, CreateTodoVariables>;
}
export const createTodoRef: CreateTodoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTodo(dc: DataConnect, vars: CreateTodoVariables): MutationPromise<CreateTodoData, CreateTodoVariables>;

interface CreateTodoRef {
  ...
  (dc: DataConnect, vars: CreateTodoVariables): MutationRef<CreateTodoData, CreateTodoVariables>;
}
export const createTodoRef: CreateTodoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTodoRef:
```typescript
const name = createTodoRef.operationName;
console.log(name);
```

### Variables
The `CreateTodo` mutation requires an argument of type `CreateTodoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTodoVariables {
  userId: UUIDString;
  title: string;
  isCompleted: boolean;
  createdAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateTodo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTodoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTodoData {
  todo_insert: Todo_Key;
}
```
### Using `CreateTodo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTodo, CreateTodoVariables } from '@dataconnect/generated';

// The `CreateTodo` mutation requires an argument of type `CreateTodoVariables`:
const createTodoVars: CreateTodoVariables = {
  userId: ..., 
  title: ..., 
  isCompleted: ..., 
  createdAt: ..., 
};

// Call the `createTodo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTodo(createTodoVars);
// Variables can be defined inline as well.
const { data } = await createTodo({ userId: ..., title: ..., isCompleted: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTodo(dataConnect, createTodoVars);

console.log(data.todo_insert);

// Or, you can use the `Promise` API.
createTodo(createTodoVars).then((response) => {
  const data = response.data;
  console.log(data.todo_insert);
});
```

### Using `CreateTodo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTodoRef, CreateTodoVariables } from '@dataconnect/generated';

// The `CreateTodo` mutation requires an argument of type `CreateTodoVariables`:
const createTodoVars: CreateTodoVariables = {
  userId: ..., 
  title: ..., 
  isCompleted: ..., 
  createdAt: ..., 
};

// Call the `createTodoRef()` function to get a reference to the mutation.
const ref = createTodoRef(createTodoVars);
// Variables can be defined inline as well.
const ref = createTodoRef({ userId: ..., title: ..., isCompleted: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTodoRef(dataConnect, createTodoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.todo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.todo_insert);
});
```

## UpdateGoalTaskCompletion
You can execute the `UpdateGoalTaskCompletion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateGoalTaskCompletion(vars: UpdateGoalTaskCompletionVariables): MutationPromise<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;

interface UpdateGoalTaskCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGoalTaskCompletionVariables): MutationRef<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;
}
export const updateGoalTaskCompletionRef: UpdateGoalTaskCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGoalTaskCompletion(dc: DataConnect, vars: UpdateGoalTaskCompletionVariables): MutationPromise<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;

interface UpdateGoalTaskCompletionRef {
  ...
  (dc: DataConnect, vars: UpdateGoalTaskCompletionVariables): MutationRef<UpdateGoalTaskCompletionData, UpdateGoalTaskCompletionVariables>;
}
export const updateGoalTaskCompletionRef: UpdateGoalTaskCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGoalTaskCompletionRef:
```typescript
const name = updateGoalTaskCompletionRef.operationName;
console.log(name);
```

### Variables
The `UpdateGoalTaskCompletion` mutation requires an argument of type `UpdateGoalTaskCompletionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGoalTaskCompletionVariables {
  id: UUIDString;
  isCompleted: boolean;
}
```
### Return Type
Recall that executing the `UpdateGoalTaskCompletion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGoalTaskCompletionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGoalTaskCompletionData {
  goalTask_update?: GoalTask_Key | null;
}
```
### Using `UpdateGoalTaskCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGoalTaskCompletion, UpdateGoalTaskCompletionVariables } from '@dataconnect/generated';

// The `UpdateGoalTaskCompletion` mutation requires an argument of type `UpdateGoalTaskCompletionVariables`:
const updateGoalTaskCompletionVars: UpdateGoalTaskCompletionVariables = {
  id: ..., 
  isCompleted: ..., 
};

// Call the `updateGoalTaskCompletion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGoalTaskCompletion(updateGoalTaskCompletionVars);
// Variables can be defined inline as well.
const { data } = await updateGoalTaskCompletion({ id: ..., isCompleted: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGoalTaskCompletion(dataConnect, updateGoalTaskCompletionVars);

console.log(data.goalTask_update);

// Or, you can use the `Promise` API.
updateGoalTaskCompletion(updateGoalTaskCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.goalTask_update);
});
```

### Using `UpdateGoalTaskCompletion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGoalTaskCompletionRef, UpdateGoalTaskCompletionVariables } from '@dataconnect/generated';

// The `UpdateGoalTaskCompletion` mutation requires an argument of type `UpdateGoalTaskCompletionVariables`:
const updateGoalTaskCompletionVars: UpdateGoalTaskCompletionVariables = {
  id: ..., 
  isCompleted: ..., 
};

// Call the `updateGoalTaskCompletionRef()` function to get a reference to the mutation.
const ref = updateGoalTaskCompletionRef(updateGoalTaskCompletionVars);
// Variables can be defined inline as well.
const ref = updateGoalTaskCompletionRef({ id: ..., isCompleted: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGoalTaskCompletionRef(dataConnect, updateGoalTaskCompletionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goalTask_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goalTask_update);
});
```

