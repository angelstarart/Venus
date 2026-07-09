import React, { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../../../../server/amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const Authentication: React.FunctionComponent = ()=> {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  const createTodo = async (): Promise<void> => {
    await client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  const deleteTodo = async (id: string): Promise<void> => {
    await client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
      <div>
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default Authentication;
