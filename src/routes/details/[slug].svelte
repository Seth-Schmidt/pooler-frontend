<script>
    
    import { page } from '$app/stores';
    import axios from "axios";
    import { onMount } from 'svelte';

    function DollarFormat(value) 
    {
    // Nine Zeroes for Billions
    return Number(value) >= 1.0e+9

        ? parseFloat(Number(value) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions 
        : Number(value) >= 1.0e+6

        ? parseFloat(Number(value) / 1.0e+6).toFixed(2) + "M"
        // Three Zeroes for Thousands
        : Number(value) >= 1.0e+3

        ? parseFloat(Number(value) / 1.0e+3).toFixed(2) + "K"

        : Number(value);

    }

    let slug = $page.url.pathname.substr(1).split("/")[1];
    let address = slug.toLowerCase()

    let epochInfo = null;
    let assetData = null;
    let topData = null;
    let lastBlock = null;
    let available = null;
    let price = null;
    let util = null;
    
    let asset_project_prefix = import.meta.env.VITE_ASSET_PROJECT_PREFIX;
    let assets_project_id = import.meta.env.VITE_TOP_ASSETS_PROJECT_ID;
    let namespace = import.meta.env.VITE_PROJECT_NAMESPACE;
    let project_id = `${asset_project_prefix}:${address}:${namespace}`

    const API_PREFIX = import.meta.env.VITE_API_PREFIX || 'static';
    const APP_NAME = import.meta.env.VITE_APP_NAME || "AAVE";

    onMount(async () => {
        console.log('API', API_PREFIX);
        
        let response;

        try {
            console.log("Requesting: ")
            console.log(API_PREFIX+`/last_finalized_epoch/${project_id}`)
            response = await axios.get(API_PREFIX+`/last_finalized_epoch/${project_id}`);
            console.log('got last finalized epoch', response.data);
            if (response.data) {
                epochInfo = response.data;
                console.log(epochInfo)
            } else {
                throw new Error(JSON.stringify(response.data));
            }
        }
        catch (e){
            console.error('last finalized epoch', e);
        }

        try {
            console.log("Requesting: ")
            console.log(API_PREFIX+`/data/${epochInfo.epochId}/${project_id}/`)
            response = await axios.get(API_PREFIX+`/data/${epochInfo.epochId}/${project_id}/`);
            console.log('got asset details data', response.data);
            if (response.data) {
                assetData = response.data;
            } else {
                throw new Error(JSON.stringify(response.data));
            }
        }
        catch (e){
            console.error('asset details', e);
        }

        try {
            console.log("Requesting: ")
            console.log(API_PREFIX+`/data/${epochInfo.epochId}/${assets_project_id}/`)
            response = await axios.get(API_PREFIX+`/data/${epochInfo.epochId}/${assets_project_id}/`);
            console.log('got assets', response.data);
            if (response.data) {
                topData = response.data;
            } else {
                throw new Error(JSON.stringify(response.data));
            }
        }
        catch (e){
            console.error('assets', e);
        }

        topData = topData.assets.filter((x) => {
            return x.address.toLowerCase() === address;
        });

        topData = topData[0];
        lastBlock = Object.keys(assetData.assetDetails).slice(-1)[0];
        price = topData.totalAToken.usd_supply / topData.totalAToken.token_supply

        available = assetData.assetDetails[lastBlock].borrowCap === 0 
            ? assetData.availableLiquidity[lastBlock].usd_supply 
            : Math.min(
                (assetData.assetDetails[lastBlock].borrowCap * price
                - topData.totalVariableDebt.usd_debt),
                assetData.availableLiquidity[lastBlock].usd_supply 
            )

        util = topData.totalVariableDebt.token_debt / topData.totalAToken.token_supply
        util = parseFloat(util * 100).toFixed(2)

  });

</script>

{#if topData && assetData}
<div>
    <dl class="grid auto-cols-auto grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-2">
        <div class="relative pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow rounded-lg overflow-hidden">
            <dt>
                <p class="text-sm font-medium text-gray-500 truncate">{topData.symbol}</p> 
            </dt>
            <dd class="">
                <p class="text-l font-semibold text-gray-900">
                {topData.name}
                </p>
            </dd>
        </div>
        <div class="relative pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow rounded-lg overflow-hidden">
        <dl class="grid grid-cols-4 auto-cols-auto sm:grid-cols-2 lg:grid-cols-4">
            <div class="">
                <dt>
                    <p class="text-sm font-medium text-gray-500 truncate">Reserve Size</p>
                </dt>
                <dd class="">
                    <p class="text-l font-semibold text-gray-900">
                    {"$"+DollarFormat(topData.totalAToken.usd_supply)}
                    </p>
                </dd>
            </div>
            <div >
                <dt>
                    <p class="text-sm font-medium text-gray-500 truncate">Available Liquidity</p>
                </dt>
                <dd class="">
                    <p class="text-l font-semibold text-gray-900">
                    {"$"+DollarFormat(available)}
                    </p>
                </dd>
            </div>
            <div class="">
                <dt>
                    <p class="text-sm font-medium text-gray-500 truncate">Utilization Rate</p>
                </dt>
                <dd class="">
                    <p class="text-l font-semibold text-gray-900">
                    {util + "%"}
                    </p>
                </dd>
            </div>
            <div class="">
                <dt>
                    <p class="text-sm font-medium text-gray-500 truncate">Oracle Price</p>
                </dt>
                <dd class="">
                    <p class="text-l font-semibold text-gray-900">
                    {"$"+parseFloat(price).toFixed(2)}
                    </p>
                </dd>
            </div>
        </dl>
        </div>
    </dl>
</div>

    <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div class="relative mt-5 pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow rounded-lg overflow-hidden">
            <h2>Asset Configuration</h2>
            <div class="relative pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow overflow-hidden">
                <div class="pb-3">
                    <p class="text-xl underline font-bold text-gray-900">Supply Data</p>
                </div>
                <dl class="grid grid-cols-3 grid-rows-2 auto-cols-auto sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <dt>
                            <p class="text-base font-medium text-gray-500 truncate">Total Supplied</p>
                        </dt>
                        <dd>
                            <p class="text-lg font-semibold text-gray-900">
                            {DollarFormat(topData.totalAToken.token_supply)} of {DollarFormat(assetData.assetDetails[lastBlock].supplyCap)}
                            </p>
                            <p class="text-sm font-semibold text-gray-500">
                                {"$"+DollarFormat(topData.totalAToken.usd_supply)} of {"$"+DollarFormat(assetData.assetDetails[lastBlock].supplyCap * price)}
                            </p>
                        </dd>
                    </div>
                    <div>
                        <dt>
                            <p class="text-base font-medium text-gray-500 truncate">APY</p>
                        </dt>
                        <dd>
                            <p class="text-lg font-semibold text-gray-900">
                            {parseFloat(topData.liquidityApy).toFixed(2)+"%"}
                            </p>
                        </dd>
                    </div>
                    <div>
                        <dt>
                            <p class="text-base font-medium text-gray-500 truncate">Supply Cap</p>
                        </dt>
                        <dd>
                            <p class="text-lg font-semibold text-gray-900">
                            {DollarFormat(assetData.assetDetails[lastBlock].supplyCap)}
                            </p>
                            <p class="text-sm font-semibold text-gray-500">
                            {"$"+DollarFormat(assetData.assetDetails[lastBlock].supplyCap * price)}
                            </p>
                        </dd>
                    </div>
                    <div class="pt-4">
                        <dt>
                            <p class="text-base font-medium text-gray-500 truncate">Max LTV</p>
                        </dt>
                        <dd>
                            <p class="text-lg font-semibold text-gray-900">
                            {parseFloat(assetData.assetDetails[lastBlock].ltv).toFixed(2)+"%"}
                            </p>
                        </dd>
                    </div>
                    <div class="pt-4">
                        <dt>
                            <p class="text-base font-medium text-gray-500 truncate">Liquidation Threshold</p>
                        </dt>
                        <dd>
                            <p class="text-lg font-semibold text-gray-900">
                            {parseFloat(assetData.assetDetails[lastBlock].liqThreshold).toFixed(2)+"%"}
                            </p>
                        </dd>
                    </div>
                    <div class="pt-4">
                        <dt>
                            <p class="text-base font-medium text-gray-500 truncate">Liquidation Penalty</p>
                        </dt>
                        <dd>
                            <p class="text-lg font-semibold text-gray-900">
                            {parseFloat(assetData.assetDetails[lastBlock].liqBonus).toFixed(2)+"%"}
                            </p>
                        </dd>
                    </div>
                </dl>
            </div>
                <div class="relative pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow overflow-hidden">
                    <div class="pb-3">
                        <p class="text-xl underline font-bold text-gray-900">Borrow Data</p>
                    </div>
                    <dl class="grid grid-cols-3 grid-rows-2 auto-cols-auto sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Total Borrowed</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {DollarFormat(topData.totalVariableDebt.token_debt)} of {DollarFormat(assetData.assetDetails[lastBlock].borrowCap)}
                                </p>
                                <p class="text-sm font-semibold text-gray-500">
                                {"$"+DollarFormat(topData.totalVariableDebt.usd_debt)} of {"$"+DollarFormat(assetData.assetDetails[lastBlock].borrowCap * price)}
                                </p>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Variable APY</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {parseFloat(topData.variableApy).toFixed(2)+"%"}
                                </p>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Borrow Cap</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {DollarFormat(assetData.assetDetails[lastBlock].borrowCap)}
                                </p>
                                <p class="text-sm font-semibold text-gray-500">
                                {"$"+DollarFormat(assetData.assetDetails[lastBlock].borrowCap * price)}
                                </p>
                            </dd>
                        </div>
                        <div class="pt-4">
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Reserve Factor</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {parseFloat(assetData.assetDetails[lastBlock].resFactor).toFixed(2)+"%"}
                                </p>
                            </dd>
                        </div>
                    </dl>
                </div>
                {#if assetData.assetDetails[lastBlock].eLtv > 0}
                <div class="relative pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow overflow-hidden">
                    <div class="pb-3">
                        <p class="text-xl underline font-bold text-gray-900">eMode Data</p>
                    </div>
                    <dl class="grid grid-cols-3 grid-rows-1 auto-cols-auto sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Max LTV</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {parseFloat(assetData.assetDetails[lastBlock].eLtv).toFixed(2)+"%"}
                                </p>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Liquidation Threshold</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {parseFloat(assetData.assetDetails[lastBlock].eliqThreshold).toFixed(2)+"%"}
                                </p>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Liquidation Penalty</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {parseFloat(assetData.assetDetails[lastBlock].eliqBonus).toFixed(2)+"%"}
                                </p>
                            </dd>
                        </div>
                    </dl>
                </div>
                {/if}
                <div class="relative pt-5 px-4 pb-3 sm:pt-6 sm:px-6 bg-white shadow overflow-hidden">
                    <div class="pb-3">
                        <p class="text-xl underline font-bold text-gray-900">Utilization Data</p>
                    </div>
                    <dl class="grid grid-cols-3 grid-rows-1 auto-cols-auto sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Utilization Rate</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {util + "%"}
                                </p>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <p class="text-base font-medium text-gray-500 truncate">Optimal Rate</p>
                            </dt>
                            <dd>
                                <p class="text-lg font-semibold text-gray-900">
                                {parseFloat(assetData.assetDetails[lastBlock].optimalRate * 100).toFixed(2)+"%"}
                                </p>
                            </dd>
                    </dl>
                </div>
        </div>
    </div>
    </div>
    </div>
    </div>

{/if}