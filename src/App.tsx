import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { Login } from './сomponents/Login';
import { AddTodo } from './сomponents/AddTodo';
import { TodosFilter } from './сomponents/TodosFilter';
import { TodoList } from './сomponents/TodoList';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { getUser } from './utils/getUser';

export const App: React.FC = () => {
  const [user, setUser] = useState(getUser());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>(Filter.all);
  const [todosIdInLoading, setTodosIdInLoading] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    const timeoutID = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeoutID);
  };

  useEffect(() => {
    if (user.id) {
      todoService.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Unable to load a todos'));
    }
  }, [user]);

  const createTodo = (newTitle: string) => {
    const tempTodoId = 0;

    setTempTodo({
      id: tempTodoId,
      userId: user.id,
      title: newTitle,
      completed: false,
    });

    setTodosIdInLoading(current => [...current, tempTodoId]);

    return todoService.addTodo(user.id, newTitle)
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch(() => {
        showError('Unable to add a todos');
      })
      .finally(() => {
        setTempTodo(null);
        setTodosIdInLoading(current => current.filter(id => id !== 0));
      });
  };

  const changeTodo = (todo: Todo) => {
    setTodosIdInLoading(current => [...current, todo.id]);

    todoService.updateTodo(todo)
      .then(updated => {
        setTodos(current => current
          .map(item => (item.id === updated.id ? updated : item)));
      })
      .catch(() => {
        showError('Unable to update a todos');
      })
      .finally(() => setTodosIdInLoading(
        current => current.filter(id => id !== todo.id),
      ));
  };

  const deleteTodo = (id: number) => {
    setTodosIdInLoading(current => [...current, id]);

    todoService.delTodo(id)
      .then(() => {
        setTodos(curentTodos => curentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todos');
      })
      .finally(() => setTodosIdInLoading(
        current => current.filter(todoId => todoId !== id),
      ));
  };

  useEffect(() => {
    switch (filterStatus) {
      case Filter.active:
        setFilteredTodos(todos.filter(todo => todo.completed === false));
        break;

      case Filter.completed:
        setFilteredTodos(todos.filter(todo => todo.completed === true));
        break;

      case Filter.all:
      default:
        setFilteredTodos([...todos]);
    }
  }, [filterStatus, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {!user.id && <Login setUser={setUser} showError={showError} />}

      {!!user.id && (
        <div className="todoapp__content">
          <AddTodo
            filteredTodosCount={filteredTodos.length}
            todos={todos}
            createTodo={createTodo}
            changeTodo={changeTodo}
            setError={showError}
          />

          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            changeTodo={changeTodo}
            todosIdInLoading={todosIdInLoading}
            deleteTodo={deleteTodo}
          />

          {!!todos.length && (
            <TodosFilter
              status={filterStatus}
              onChangeStatus={setFilterStatus}
              todos={todos}
              deleteTodo={deleteTodo}
            />
          )}
        </div>
      )}

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          aria-label="Close error message"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
