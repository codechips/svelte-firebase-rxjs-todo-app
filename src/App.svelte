<script>
  // import TodoMVC stylesheets
  import './base.css';
  import './index.css';

  // import components
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

  // import Todo component
  import Todo from './Todo.svelte';

  import { todos, filteredTodos, completedTodos, checkAll } from './todos';

  // on:change handler
  const markAll = event => {
    checkAll(event.target.checked);
  };

  // used for checkbox auto status
  $: allCompleted = $todos.length === $completedTodos.length;
</script>

<section class="todoapp">
  <Header />

  <!-- display only if there are todo items -->
  {#if $todos.length}
    <section class="main">
      <input
        on:change={markAll}
        id="toggle-all"
        class="toggle-all"
        checked={allCompleted}
        type="checkbox"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- iterate over filteredTodos stream -->
        {#each $filteredTodos as todo (todo.id)}
          <Todo {todo} />
        {/each}
      </ul>
    </section>
  {/if}

  <Footer />

</section>
