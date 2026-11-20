# Todo App (Vite + TypeScript)

A todo list app built from scratch with Vite and TypeScript, with no framework. I built it to learn how JavaScript, TypeScript and the DOM work under the hood.

**Live demo:** https://todo-app-typescript-ruby.vercel.app/


## Features

This app supports full CRUD (create, read, update, delete):

- **Add** a todo by typing in the input field and clicking **Add**. Empty todos are ignored.
- **Complete** a todo by ticking its checkbox. Completed todos are crossed out and faded.
- **Edit** a todo with its **Edit** button or by double-clicking its text. Press **Enter** to save or **Escape** to cancel. Saving empty text keeps the original.
- **Delete** a todo with its **Delete** button.
- **Filter** the list:
  - **All**: every todo
  - **Active**: todos that are not done yet
  - **Completed**: todos that are done

  The selected filter is highlighted.
- **Items left** counter, with correct plurals ("1 item left", "2 items left").
- **Saved automatically** in the browser (localStorage), so todos are still there after a refresh.
- **Load samples** fetches 3 example todos from a public API ([JSONPlaceholder](https://jsonplaceholder.typicode.com/)). It shows a loading state and a friendly error message if the request fails.

## Built with

Vite, TypeScript, HTML and CSS. No framework.

## Project structure

| File | What it does |
| --- | --- |
| `src/main.ts` | Finds the page elements, listens for events and draws the list |
| `src/todo.ts` | Decides which todos to show for the current filter (a pure function) |
| `src/storage.ts` | Saves and loads todos, and checks loaded data before using it |
| `src/api.ts` | Fetches sample todos, checks them and converts them to my `Todo` shape |
| `src/types.ts` | The `Todo` and `Filter` types |

## What I learned / key decisions

- **One source of truth.** All todos live in one array. Every change updates the array, saves it, and then redraws the list from it, so the page always matches the data.
- **Calculate, don't store.** The "items left" count is worked out from the todos each time instead of being kept in a separate variable that could get out of sync.
- **Preventing XSS (cross-site scripting).** User text is inserted with `textContent`, never `innerHTML`, so typed HTML or scripts are shown as plain text instead of being run.
- **Never trusting outside data.** Data from localStorage and from the API starts as `unknown`. I check it with type guards (type predicates) before using it, so bad data can't break the app.
- **Converting API data.** The API's todos have a different shape (`title`, `completed`, number ids), so I map them to my own `Todo` type and give each one a fresh unique id.
- **Handling async errors.** Fetching uses `async`/`await` with `try`/`catch`/`finally`. The button is disabled while loading, which stops double clicks from adding duplicate todos.
- **Event delegation.** One listener on the list handles delete, double-click edit and keyboard events for every todo, instead of one listener per item.
- **Exhaustive checks with `never`.** If a new filter is added to the `Filter` type but not handled, TypeScript shows an error.

## What I'd improve next

- Better accessibility: visually hidden form label, and leaving edit mode by clicking away
- Unit tests for the pure functions with Vitest

## Run it locally

```bash
npm install
npm run dev
```

Then open the link Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
```
