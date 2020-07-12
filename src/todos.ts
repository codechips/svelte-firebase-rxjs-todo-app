import { db } from './firebase';
import firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import { collectionData } from 'rxfire/firestore';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

interface Todo {
  id: string;
  action: string;
  completed: boolean;
  createdAt: firebase.firestore.Timestamp;
}

const filters = {
  completed: (todo: Todo) => todo.completed,
  active: (todo: Todo) => !todo.completed,
  all: (todo: Todo) => todo
};

// todos Firebase collection reference
const todoCollection = db().collection('todos');

// rxfire wrapped collection
export const todos = collectionData(
  todoCollection.orderBy('createdAt', 'desc'),
  'id'
).pipe(startWith([]));

// completed todos stream
export const completedTodos = todos.pipe(
  map(todos => todos.filter(filters.completed))
);

// active todos stream
export const activeTodos = todos.pipe(
  map(todos => todos.filter(filters.active))
);

export const createTodo = async (action: string) => {
  // guard function to check if todo is not empty
  if (!action) return;
  await todoCollection.add({
    action,
    completed: false,
    createdAt: timestamp()
  });
};

export const toggleTodo = async (todo: Todo) => {
  await todoCollection.doc(todo.id).update({ completed: !todo.completed });
};

export const deleteTodo = async (todo: Todo) => {
  await todoCollection.doc(todo.id).delete();
};

export const updateTodo = async (id: string, action: string) => {
  if (action.trim()) await todoCollection.doc(id).update({ action });
};

// filter observable
const todoFilter = new BehaviorSubject('all');

// Export the Subject's next function as setFilter
export const setFilter = todoFilter.next.bind(todoFilter);

export const filteredTodos = combineLatest(todos, todoFilter).pipe(
  map(([todos, filter]) => {
    // filter todos on current filter, default to all if not found
    return todos.filter(filters[filter] || filters.all);
  })
);

export const clearCompleted = async () => {
  // Firestore query reference to all completed todo items
  const completed = await todoCollection.where('completed', '==', true).get();

  // loop over it and delete each one
  completed.forEach(async doc => {
    await todoCollection.doc(doc.id).delete();
  });
};

export const checkAll = async (completed: boolean) => {
  // Firebase query reference to all todo items
  const allTodos = await todoCollection.get();

  allTodos.forEach(async doc => {
    // change the item status if it's not the same as supplied
    if (doc.data().completed !== completed) {
      await todoCollection.doc(doc.id).update({ completed });
    }
  });
};
