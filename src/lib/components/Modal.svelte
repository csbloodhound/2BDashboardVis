<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    export let open = false;
    export let w = "200px";
    export let spec;
    let views = ["ChoroplethMap", "Hexmap", "WaffleChart", "WaffleChart"];
    export let display;
  
    let width;
    $: width = w.toString() + "px";

    function closeModal() {
        open = false;
        dispatch('close');
    }

    function confirmModal() {
        open = false;
        dispatch('confirm');
    }

</script>
  
{#if open}
<div class="modal" style="width: {width}">
    <p>The view has changed to {spec.views[display].viewSugData.viewName}, this is because {spec.views[display].viewSugData.advantage}</p>
    <div class="modal-operation">
        <button class="switch2bestView-button" on:click={confirmModal}>Switch to {views[display]}</button>
        <button class="keep-currentView-button" on:click={closeModal}>Keep the current view</button>
    </div>
</div>
{/if}

<style>
    .modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 1em;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        border-radius: 5px;
        padding: 20px;
        background-color: #fafafa;
        width: auto;
    }

    .modal-operation {
        display: flex;
        margin-top: 16px;
        gap: 12px;
    }

    .switch2bestView-button{
        background-color: #12ad39;
        color: white;
        border: 1px solid #12ad39;
        border-radius: 4px;
        padding: 10px 24px;
        text-align: center;
        display: inline-block;
        font-size: 12px;
        margin: 4px 2px;
        cursor: pointer;
    }

    .switch2bestView-button:hover {
		background-color: white; 
		color: #12ad39; 
		border: 1px solid #12ad39;
	}

    .keep-currentView-button {
		background-color: #3f51b5;
		color: white;
		border: 1px solid #3f51b5;
		border-radius: 4px;
		padding: 10px 24px;
		text-align: center;
		display: inline-block;
		font-size: 12px;
		margin: 4px 2px;
		cursor: pointer;
	}

    .keep-currentView-button:hover {
		background-color: white; 
		color: #3f51b5; 
		border: 1px solid #3f51b5;
	}

    p {
        font-size: 14px;
    }
</style>