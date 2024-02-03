<script>
    import { Chart } from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let chartData

        onMount(async () => {
            console.log("Inside Chart Data: ", chartData)
            const ctx = document.getElementById('chart');
            const myChart = new Chart(ctx, chartData);
            myChart.update()
        })

</script>


<div>
    <canvas id="chart"></canvas>
</div>