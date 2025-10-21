const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'nova-10-main',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createTodoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTodo', inputVars);
}
createTodoRef.operationName = 'CreateTodo';
exports.createTodoRef = createTodoRef;

exports.createTodo = function createTodo(dcOrVars, vars) {
  return executeMutation(createTodoRef(dcOrVars, vars));
};

const listTodosForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTodosForUser', inputVars);
}
listTodosForUserRef.operationName = 'ListTodosForUser';
exports.listTodosForUserRef = listTodosForUserRef;

exports.listTodosForUser = function listTodosForUser(dcOrVars, vars) {
  return executeQuery(listTodosForUserRef(dcOrVars, vars));
};

const updateGoalTaskCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGoalTaskCompletion', inputVars);
}
updateGoalTaskCompletionRef.operationName = 'UpdateGoalTaskCompletion';
exports.updateGoalTaskCompletionRef = updateGoalTaskCompletionRef;

exports.updateGoalTaskCompletion = function updateGoalTaskCompletion(dcOrVars, vars) {
  return executeMutation(updateGoalTaskCompletionRef(dcOrVars, vars));
};

const listPublicScheduleEventsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicScheduleEvents');
}
listPublicScheduleEventsRef.operationName = 'ListPublicScheduleEvents';
exports.listPublicScheduleEventsRef = listPublicScheduleEventsRef;

exports.listPublicScheduleEvents = function listPublicScheduleEvents(dc) {
  return executeQuery(listPublicScheduleEventsRef(dc));
};
