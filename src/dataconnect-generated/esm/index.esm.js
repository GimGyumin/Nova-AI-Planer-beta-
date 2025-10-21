import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'nova-10-main',
  location: 'us-east4'
};

export const createTodoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTodo', inputVars);
}
createTodoRef.operationName = 'CreateTodo';

export function createTodo(dcOrVars, vars) {
  return executeMutation(createTodoRef(dcOrVars, vars));
}

export const listTodosForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTodosForUser', inputVars);
}
listTodosForUserRef.operationName = 'ListTodosForUser';

export function listTodosForUser(dcOrVars, vars) {
  return executeQuery(listTodosForUserRef(dcOrVars, vars));
}

export const updateGoalTaskCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGoalTaskCompletion', inputVars);
}
updateGoalTaskCompletionRef.operationName = 'UpdateGoalTaskCompletion';

export function updateGoalTaskCompletion(dcOrVars, vars) {
  return executeMutation(updateGoalTaskCompletionRef(dcOrVars, vars));
}

export const listPublicScheduleEventsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicScheduleEvents');
}
listPublicScheduleEventsRef.operationName = 'ListPublicScheduleEvents';

export function listPublicScheduleEvents(dc) {
  return executeQuery(listPublicScheduleEventsRef(dc));
}

