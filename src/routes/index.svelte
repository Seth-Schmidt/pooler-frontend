<script context="module">
  export const prerender = true;
</script>

<script>
  import axios from "axios";
  import { onMount } from 'svelte';
  import Time from "svelte-time";
  import { explorerPrefix } from '../stores.js';

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  let billion = 1000000000

  let assetsData = null;
  let volumeData = null;
  let volumeDataTrimmed = null;
  let statsData = null;
  let epochInfo = null;
  let showChangeData = true;
  const API_PREFIX = import.meta.env.VITE_API_PREFIX || 'static'; //change this to AXIOS config later 
  let recentReset = import.meta.env.VITE_RECENT_RESET == 'true';
	const APP_NAME = import.meta.env.VITE_APP_NAME || "AAVE";
  
  let assets_cid = '';
  let assets_project_id = import.meta.env.VITE_TOP_ASSETS_PROJECT_ID;
  let stats_cid = '';
  let market_stats_project_id = import.meta.env.VITE_MARKET_STATS_PROJECT_ID;
  let assets_volume_project_id = import.meta.env.VITE_VOLUME_PROJECT_ID;
  let volume_cid = '';
  

  onMount(async () => {
    console.log('API', API_PREFIX);
    
    let response;

    // NOTE: This flow for UI load is simplified a bit by assuming if all project IDs got finalized in last processed epoch.
    // It is however possible to build a more robust UI that can handle the case where some project IDs are not finalized yet.

    try {
      console.log("Requesting: ")
      console.log(API_PREFIX+`/last_finalized_epoch/${assets_project_id}`)
      response = await axios.get(API_PREFIX+`/last_finalized_epoch/${assets_project_id}`);
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
      console.log(API_PREFIX+`/data/${epochInfo.epochId}/${assets_project_id}/`)
      response = await axios.get(API_PREFIX+`/data/${epochInfo.epochId}/${assets_project_id}/`);
      console.log('got assets data', response.data);
      if (response.data) {
        assetsData = response.data.assets.slice(0, 5);
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('assets', e);
    }

    try {
      response = await axios.get(API_PREFIX+`/cid/${epochInfo.epochId}/${assets_project_id}/`);
      console.log('got assets cid', response.data);
      if (response.data) {
        assets_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('top assets cid', e);
    }

    try {
      response = await axios.get(API_PREFIX+`/cid/${epochInfo.epochId}/${market_stats_project_id}/`);
      console.log('got market stats cid', response.data);
      if (response.data) {
        stats_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('market stats cid', e);
    }

    try {
      console.log("Requesting: ")
      console.log(API_PREFIX+`/data/${epochInfo.epochId}/${market_stats_project_id}/`)
      response = await axios.get(API_PREFIX+`/data/${epochInfo.epochId}/${market_stats_project_id}/`);
      console.log('got market stats', response.data);
      if (response.data) {
        statsData = response.data;
        if (!statsData.complete){
          recentReset = true;
        }
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('market stats', e);
    }

    try {
      console.log("Requesting: ")
      console.log(API_PREFIX+`/data/${epochInfo.epochId}/${assets_volume_project_id}/`)
      response = await axios.get(API_PREFIX+`/data/${epochInfo.epochId}/${assets_volume_project_id}/`);
      console.log('got volume data', response.data);
      if (response.data) {
        volumeData = response.data;
        if (!volumeData.complete){
          recentReset = true;
        }
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('volume', e);
    }

    try {
      response = await axios.get(API_PREFIX+`/cid/${epochInfo.epochId}/${assets_volume_project_id}/`);
      console.log('got volume cid', response.data);
      if (response.data) {
        volume_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('volume_cid', e);
    }

    volumeDataTrimmed = []
    assetsData.map(({address}) => {
      volumeDataTrimmed.push(volumeData.assets.find((x) => x.address == address))
    })


  });

</script>

<svelte:head>
  <title>{APP_NAME} Overview</title>
</svelte:head>

{#if recentReset}
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="rounded-md bg-yellow-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/exclamation -->
      <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-yellow-800">Reset in progress</h3>
      <div class="mt-2 text-sm text-yellow-700">
        <p>This node recently started snapshotting from scratch - 24 hour data will catch up soon!</p>
      </div>
    </div>
  </div>
</div>
{/if}

{#if stats_cid}
<div class="flex pull-right ">

<a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{stats_cid}">
  <!-- Heroicon name: solid/phone -->

  <svg role="img" class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>IPFS icon</title><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"/></svg>
  <span> Data </span>
</a>
</div>
{/if}

{#if statsData}
<div>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/users -->
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m14.556 7.799-2.43 5.482A2 2 0 0 0 14 15.98h3.114a2.001 2.001 0 0 0 1.873-2.7l-2.43-5.482v-.925c.33.07.664.107 1 .107a1 1 0 1 0 0-2 3.378 3.378 0 0 1-2.267-1.006 8.567 8.567 0 0 0-2.79-1.571 3 3 0 0 0-5.888.034c-.827.32-1.585.8-2.228 1.412a3.6 3.6 0 0 1-2.827 1.13 1 1 0 0 0 0 2 7.379 7.379 0 0 0 1-.07v.889L.127 13.28A2 2 0 0 0 2 15.98h3.114a2.001 2.001 0 0 0 1.873-2.7l-2.43-5.482v-1.57a8.355 8.355 0 0 0 1.133-.865 5.713 5.713 0 0 1 1.282-.882 2.993 2.993 0 0 0 1.585 1.316V17.98h-7a1 1 0 1 0 0 2h16a1 1 0 0 0 0-2h-7V5.797a3 3 0 0 0 1.62-1.384 7.17 7.17 0 0 1 1.89 1.143c.16.124.327.25.5.377 0 .017-.01.03-.01.048v1.818Zm-5-3.818a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
          </svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Total Market Size 24H</p>
      </dt>
      <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
        <p class="text-xl font-semibold text-gray-900">
          {USDollar.format((statsData.totalMarketSize / billion)) + "B"}
        </p>
        {#if showChangeData}
        {#if statsData.marketChange24h == undefined || statsData.marketChange24h > 0}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          {`${(statsData.marketChange24h).toFixed(2)}%`}
        </p>
        {:else}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          {`${(statsData.marketChange24h).toFixed(2)}%`}
        </p>
        {/if}
        {/if}
      </dd>
    </div>

    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/cursor-click -->
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
          </svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Total Available 24H</p>
      </dt>
      <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
        <p class="text-xl font-semibold text-gray-900">
          {USDollar.format((statsData.totalAvailable / billion)) + "B"}
        </p>
        {#if showChangeData}
        {#if statsData.availableChange24h == undefined || statsData.availableChange24h > 0}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          {`${(statsData.availableChange24h).toFixed(2)}%`}
        </p>
        {:else}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          {`${(statsData.availableChange24h).toFixed(2)}%`}
        </p>
        {/if}
        {/if}
      </dd>
    </div>

    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/mail-open -->
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12V1m0 0L4 5m4-4 4 4m3 5v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
          </svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Total Borrowed 24H</p>
      </dt>
      <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
        <p class="text-xl font-semibold text-gray-900">
          {USDollar.format((statsData.totalBorrows / billion)) + "B"}
        </p>
        {#if showChangeData}
        {#if statsData.borrowChange24h == undefined || statsData.borrowChange24h > 0}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          {`${(statsData.borrowChange24h).toFixed(2)}%`}
        </p>
        {:else}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          {`${(statsData.borrowChange24h).toFixed(2)}%`}
        </p>
        {/if}
        {/if}
      </dd>
    </div>

  </dl>
</div>
{/if}

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="pt-4">
<div class="bg-white px-4 py-5 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg sm:px-6 ">
  <div class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
    <div class="ml-4 mt-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Top Assets</h3>
          <p class="text-sm text-gray-500">
            {#if epochInfo }Synced to <a href="{$explorerPrefix}/block/{epochInfo.epochEnd}"class="text-indigo-800" target="_blank">{epochInfo.epochEnd}</a> <Time relative timestamp={(epochInfo.timestamp * 1000)} />
            {/if}
          </p>
        </div>
      </div>
    </div>
    <div class="ml-4 mt-4 flex-shrink-0 flex">
      <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{assets_cid}">
        <!-- Heroicon name: solid/phone -->
        <svg role="img" class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>IPFS icon</title><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"/></svg>
        <span> Data </span>
      </a>
      
    </div>
  </div>
</div>
</div>
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Supplied
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supply APY
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Borrowed
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrow APY, variable
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                More Info
              </th>
            </tr>
          </thead>
          <tbody>
            {#if assetsData}
            {#each assetsData as asset, index}
            <tr class={(index + 1)%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div class="text-lg">{asset.name}</div>
                <div class="">{asset.symbol}</div>
                {#if asset.isIsolated}
                <div class="text-sm">Isolated</div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="text-lg">{asset.totalAToken.token_supply.toLocaleString('en-US')}</div>
                <div class="">{USDollar.format(asset.totalAToken.usd_supply)}</div> 
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                {parseFloat(asset.liquidityApy).toFixed(2)+"%"}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="text-lg">{asset.totalVariableDebt.token_debt.toLocaleString('en-US')}</div>
                <div class="">{USDollar.format(asset.totalVariableDebt.usd_debt)}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                {parseFloat(asset.variableApy).toFixed(2)+"%"}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="/details/{asset.address}">
                  Details
                </a>
              </td>
            </tr>
            {/each}
            {/if}
          </tbody>
      </table>
      <div class="">
        <a href="/assets" class="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"> View all </a>
      </div>
</div>
    </div>
  </div>
</div>

<div class="pt-4">
  <div class="bg-white px-4 py-5 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg sm:px-6 ">
    <div class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
      <div class="ml-4 mt-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Asset Volume 24H</h3>
            <p class="text-sm text-gray-500">
              {#if epochInfo }Synced to <a href="{$explorerPrefix}/block/{epochInfo.epochEnd}"class="text-indigo-800" target="_blank">{epochInfo.epochEnd}</a> <Time relative timestamp={(epochInfo.timestamp * 1000)} />
              {/if}
            </p>
          </div>
        </div>
      </div>
      <div class="ml-4 mt-4 flex-shrink-0 flex">
        <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{volume_cid}">
          <svg role="img" class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>IPFS icon</title><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"/></svg>
          <span> Data </span>
        </a>
      </div>
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Borrowed
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Repaid
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Supplied
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Withdrawn
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collateral Liquidated
              </th>
            </tr>
          </thead>
          <tbody>
            {#if volumeDataTrimmed}
            {#each volumeDataTrimmed as asset, index}
            <tr class={(index + 1)%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div class="text-lg">{asset.name}</div>
                <div class="text-sm">{asset.symbol}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {#if asset.totalBorrow.totalToken > 0}
                <div class="text-lg">{asset.totalBorrow.totalToken.toLocaleString('en-US')}</div>
                <div class="text-sm flex">
                  <span>{USDollar.format(asset.totalBorrow.totalUSD)}</span>
                  {#if asset.borrowChange24h == undefined || asset.borrowChange24h > 0}
                    <p class="flex items-baseline text-sm font-semibold text-green-600">
                      <!-- Heroicon name: solid/arrow-sm-up -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Increased by
                      </span>
                      {`${(asset.borrowChange24h).toFixed(2)}%`}
                    </p>
                  {:else}
                    <p class="flex items-baseline text-sm font-semibold text-red-600">
                      <!-- Heroicon name: solid/arrow-sm-down -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Decreased by
                      </span>
                      {`${(asset.borrowChange24h).toFixed(2)}%`}
                    </p>
                  {/if}
                </div>
                {:else}
                <div class="text-lg"> - </div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                {#if asset.totalRepay.totalToken > 0}
                <div class="text-lg">{asset.totalRepay.totalToken.toLocaleString('en-US')}</div>
                <div class="text-sm flex">
                  <span>{USDollar.format(asset.totalRepay.totalUSD)}</span>
                  {#if asset.repayChange24h == undefined || asset.repayChange24h > 0}
                    <p class="flex items-baseline text-sm font-semibold text-green-600">
                      <!-- Heroicon name: solid/arrow-sm-up -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Increased by
                      </span>
                      {`${(asset.repayChange24h).toFixed(2)}%`}
                    </p>
                  {:else}
                    <p class="flex items-baseline text-sm font-semibold text-red-600">
                      <!-- Heroicon name: solid/arrow-sm-down -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Decreased by
                      </span>
                      {`${(asset.repayChange24h).toFixed(2)}%`}
                    </p>
                  {/if}
                </div>
                {:else}
                <div class="text-lg"> - </div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {#if asset.totalSupply.totalToken > 0}
                <div class="text-lg">{asset.totalSupply.totalToken.toLocaleString('en-US')}</div>
                <div class="text-sm flex">
                  <span>{USDollar.format(asset.totalSupply.totalUSD)}</span>
                  {#if asset.supplyChange24h == undefined || asset.supplyChange24h > 0}
                    <p class="flex items-baseline text-sm font-semibold text-green-600">
                      <!-- Heroicon name: solid/arrow-sm-up -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Increased by
                      </span>
                      {`${(asset.supplyChange24h).toFixed(2)}%`}
                    </p>
                  {:else}
                    <p class="flex items-baseline text-sm font-semibold text-red-600">
                      <!-- Heroicon name: solid/arrow-sm-down -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Decreased by
                      </span>
                      {`${(asset.supplyChange24h).toFixed(2)}%`}
                    </p>
                  {/if}
                </div>
                {:else}
                <div class="text-lg"> - </div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                {#if asset.totalWithdraw.totalToken > 0}
                <div class="text-lg">{asset.totalWithdraw.totalToken.toLocaleString('en-US')}</div>
                <div class="text-sm flex">
                  <span>{USDollar.format(asset.totalWithdraw.totalUSD)}</span>
                  {#if asset.withdrawChange24h == undefined || asset.withdrawChange24h > 0}
                    <p class="flex items-baseline text-sm font-semibold text-green-600">
                      <!-- Heroicon name: solid/arrow-sm-up -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Increased by
                      </span>
                      {`${(asset.withdrawChange24h).toFixed(2)}%`}
                    </p>
                  {:else}
                    <p class="flex items-baseline text-sm font-semibold text-red-600">
                      <!-- Heroicon name: solid/arrow-sm-down -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Decreased by
                      </span>
                      {`${(asset.withdrawChange24h).toFixed(2)}%`}
                    </p>
                  {/if}
                </div>
                {:else}
                <div class="text-lg"> - </div>
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                {#if asset.totalLiquidatedCollateral.token_supply > 0}
                <div class="text-lg">{asset.totalLiquidatedCollateral.totalToken.toLocaleString('en-US')}</div>
                <div class="text-sm flex">
                  <span>{USDollar.format(asset.totalLiquidatedCollateral.totalUSD)}</span>
                  {#if asset.liquidationChange24h == undefined || asset.liquidationChange24h > 0}
                    <p class="flex items-baseline text-sm font-semibold text-green-600">
                      <!-- Heroicon name: solid/arrow-sm-up -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Increased by
                      </span>
                      {`${(asset.liquidationChange24h).toFixed(2)}%`}
                    </p>
                  {:else}
                    <p class="flex items-baseline text-sm font-semibold text-red-600">
                      <!-- Heroicon name: solid/arrow-sm-down -->
                      <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="sr-only">
                        Decreased by
                      </span>
                      {`${(asset.liquidationChange24h).toFixed(2)}%`}
                    </p>
                  {/if}
                </div>
                {:else}
                <div class="text-lg"> - </div>
                {/if}
              </td>
            </tr>
            {/each}
            {/if}
          </tbody>
      </table>
        <div class="">
          <a href="/volume" class="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"> View all </a>
        </div>
        </div>
    </div>
  </div>
</div>

