<script>
  import { afterUpdate } from 'svelte';
  import { deleteTodo, toggleTodo, updateTodo } from './todos';

  export let todo = null;
  // keep action in own variable. needed for reverting editing changes
  let action = todo.action;
  // editing state
  let editing = false;
  // reference to the input field
  let ref = null;

  const updateHandler = async () => {
    await updateTodo(todo.id, action);
    // turn off editing state
    editing = false;
  };

  const editHandler = () => {
    // turn on editing state
    editing = true;
    // copy todo item's action
    action = todo.action;
  };

  // handler for blur and keyup events
  const doneEditing = event => {
    // if match, turn off editing state
    if (event.type === 'blur' || event.key === 'Escape') editing = false;
  };

  afterUpdate(() => {
    // focus input field if component is in edit mode
    if (editing) {
      ref.focus();
    }
  });

  $: completed = todo.completed;
</script>

<li class:completed class:editing>
  {#if editing}
    <form on:submit|preventDefault={updateHandler}>
      <input
        bind:this={ref}
        class="edit"
        type="text"
        on:blur={doneEditing}
        on:keyup={doneEditing}
        bind:value={action}
      />
    </form>
  {:else}
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        checked={todo.completed}
        on:change={() => toggleTodo(todo)}
      />
      <label on:dblclick={editHandler}>{todo.action}</label>
      <button class="destroy" on:click={() => deleteTodo(todo)} />
    </div>
  {/if}
</li>
