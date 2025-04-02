import { useEffect, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todos";

const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

export default function Page() {
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [page, setPages] = useState<number>(1);
  const [todos, setTodos] = useState<HomeTodo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const todosPage = todoController.filterTodosByContent<HomeTodo>(
    todos,
    search,
  );
  const hasMorePages = totalPages > page;
  const hasNoTodos = todosPage.length === 0;

  useEffect(() => {
    if (initialLoad) {
      todoController
        .get({ page: page })
        .then(({ todos, pages }) => {
          setTotalPages(pages);
          setTodos(todos);
          setInitialLoad(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles themeName="indigo" />

      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>

        <form>
          <input type="text" placeholder="Correr, Estudar..." />

          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {todosPage.map((todo) => {
              return (
                <tr key={todo.id}>
                  <td>
                    <input type="checkbox" checked={todo.done} />
                  </td>
                  <td>{todo.id.substring(0, 5)}</td>
                  <td>{todo.content}</td>
                  <td align="right">
                    <button data-type="delete">Apagar</button>
                  </td>
                </tr>
              );
            })}

            {loading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && !loading && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setLoading(true);

                      const nextPage = page + 1;

                      setPages(nextPage);

                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTotalPages(pages);
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
