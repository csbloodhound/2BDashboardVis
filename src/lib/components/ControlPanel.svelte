<script>
    import {tooltip} from "./tooltips/tooltip"


    export let w = "200px";
    export let finalDis = 0;
    export let recommendedIndex;

    let width;
    $: width = w.toString() + "px";

    let buttons = [
        "ChoroplethMap",
        "Hexmap",
        "Vertical WaffleChart",
        "Horizontal WaffleChart"
    ];

    const handleClick = (index) => {
        finalDis = index;   
    };

</script>

<div class="button-container" style="width: {width}">
    {#each buttons as button, index}
        <button class="vistype" 
                style:background-color={index === finalDis ? "orange" : (index === recommendedIndex) ? "green" : "transparent"}
                on:click={() => handleClick(index)}
                title="heng"
                path="$lib/di_logo.png"
                use:tooltip
                >
            {button}
        </button>
    {/each}
</div> 

<style>
    .button-container{
        display: flex;
        justify-content: space-between;
        border: 1px solid black;
        flex-wrap: wrap;
    }
    
    .vistype {
        flex-grow: 1;
        width: 50%;
        word-wrap: break-word;
        box-sizing: border-box;
    }
</style>
