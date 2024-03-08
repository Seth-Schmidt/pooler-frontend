<script context="module">
    export const prerender = true;
  </script>
  
<script>
import axios from "axios";
import { onMount } from 'svelte';
import Time from "svelte-time";
import { anchorExplorerPrefix, explorerPrefix } from '../stores.js';


const API_PREFIX = import.meta.env.VITE_API_PREFIX || 'static'; //change this to AXIOS config later 
let recentReset = import.meta.env.VITE_RECENT_RESET == 'true';
const APP_NAME = import.meta.env.VITE_APP_NAME || "AAVE";
let assets_cid = '';
let assets_project_id = import.meta.env.VITE_TOP_ASSETS_PROJECT_ID;

let assetsData = null;
let epochInfo = null;

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

onMount(async () => {
    name = location.search.substr(8);
    console.log('search', name);
    let response;
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
      console.log("Requesting: ")
      console.log(API_PREFIX+`/data/${epochInfo.epochId}/${assets_project_id}/`)
      response = await axios.get(API_PREFIX+`/data/${epochInfo.epochId}/${assets_project_id}/`);
      console.log('got assets', response.data);
      if (response.data) {
        assetsData = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('assets', e);
    }
});

</script>

<svelte:head>
<title>{APP_NAME} Assets</title>
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
        <p>We observed an issue with snapshotting and have reset the data - volume and other 24 hour data will catch up soon!</p>
    </div>
    </div>
</div>
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
            <h3 class="text-lg leading-6 font-medium text-gray-900">Top Tokens</h3>
            <p class="text-sm text-gray-500">
            {#if epochInfo}Synced to <a href="{$explorerPrefix}/block/{epochInfo.epochEnd}"class="text-indigo-800" target="_blank">{epochInfo.epochEnd}</a> <Time relative timestamp={(epochInfo.timestamp * 1000)} />{/if}
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
            {#each assetsData.assets as asset, index}
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
      </div>
    </div>
  </div>
</div>