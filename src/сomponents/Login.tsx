/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { createUser } from '../api/todos';
import { User } from '../types/User';

type Props = {
  setUser: (userId: User) => void;
  showError: (error: string) => void;
};

export const Login: React.FC<Props> = ({ setUser, showError }) => {
  const [email, setEmail] = useState('');

  const hadleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createUser(email)
      .then((res) => {
        setEmail('');
        setUser(res);
        localStorage.setItem('user', JSON.stringify(res));
      })
      .catch(() => showError('Something wrong, try again later'));
  };

  return (
    <form className="box mt-5" onSubmit={hadleSubmit}>
      <h1 className="title is-3">Log in to open todos</h1>

      <div className="field">
        <label className="label" htmlFor="user-email">
          Email
        </label>

        <div className="control has-icons-left">
          <input
            type="email"
            id="user-email"
            className="input"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>
      </div>

      <div className="field">
        <button type="submit" className="button is-primary">
          Login
        </button>
      </div>
    </form>
  );
};
