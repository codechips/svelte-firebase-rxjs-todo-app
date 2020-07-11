<script>
  import { todos, activeTodos, clearCompleted, setFilter } from './todos';

  let filterValue = 'all';

  // every time the filterValue changes we call our setFilter function
  $: setFilter(filterValue);
  // auto-computed pluralization
  $: itemsLabel = $activeTodos.length === 1 ? 'item' : 'items';
</script>

{#if $todos.length}
  <footer class="footer">
    <span class="todo-count">
      <strong>{$activeTodos.length}</strong>
      {itemsLabel} left
    </span>
    <ul class="filters">
      <li>
        <label>
          <input
            name="filter"
            type="radio"
            bind:group={filterValue}
            value="all"
          />
          all
        </label>
      </li>
      <li>
        <label>
          <input
            name="filter"
            type="radio"
            bind:group={filterValue}
            value="active"
          />
          active
        </label>
      </li>
      <li>
        <label>
          <input
            name="filter"
            type="radio"
            bind:group={filterValue}
            value="completed"
          />
          completed
        </label>
      </li>
    </ul>
    <button class="clear-completed" on:click={clearCompleted}>
      Clear completed
    </button>
  </footer>
{/if}
