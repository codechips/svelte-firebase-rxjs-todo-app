<script>
  import { onMount } from 'svelte';
  import { createTodo } from './todos';

  let action = '';
  // input field element reference
  let ref = null;

  onMount(() => {
    // focus the input field on app load
    ref.focus();
  });

  const createHandler = async () => {
    if (!action) return;
    await createTodo(action);
    action = '';
  };
</script>

<header class="header">
  <h1>todos</h1>
  <form on:submit|preventDefault={createHandler}>
    <input
      class="new-todo"
      type="text"
      bind:value={action}
      bind:this={ref}
      placeholder="What needs to be done?"
    />
  </form>
</header>
