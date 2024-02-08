<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
 import "../app.css";
 import { showInfo, explorerPrefix, anchorExplorerPrefix } from '../stores.js';
 let slug, showMobileMenu, prevSlug;

 $: {
   slug = $page.url.pathname.substr(1);
   if (slug != prevSlug){
     showMobileMenu = false;
   }
   prevSlug = slug;
   console.log('changed slug from', prevSlug, 'to', slug, showMobileMenu);
 }
 let recentReset = import.meta.env.VITE_RECENT_RESET == 'true';
 const NETWORK = (import.meta.env.VITE_APP_NETWORK || 'Ethereum').toLocaleLowerCase();
 anchorExplorerPrefix.set(import.meta.env.VITE_ANCHOR_EXPLORER || 'https://polygonscan.com')
 let networkImage;
 switch (NETWORK){
   case 'polygon':
   explorerPrefix.set('https://polygonscan.com');
     networkImage= "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";
   break;
   default:
   explorerPrefix.set('https://etherscan.io');
     networkImage = "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";
   break;
 }
 const INFO_URL = import.meta.env.VITE_APP_INFO_URL || 'https://v2.info.uniswap.org/home';
 const APP_NAME = import.meta.env.VITE_APP_NAME || 'AAVE';
 onMount(async () => {
   setTimeout(() => {
     const checkInfo = localStorage.getItem('powerloom_'+APP_NAME);
     if (location.hash == "#about" || !checkInfo){
       showInfo.set(true);
       localStorage.setItem('powerloom_'+APP_NAME, true);
     }
   }, 500);
 });

 function handleKeydown(e){
   if (showInfo && e.key == "Escape"){
     console.log('got escape, closing modal');
     showInfo.set(false);
   }
 }

</script>

<svelte:window on:keydown={handleKeydown}/>

<!-- This example requires Tailwind CSS v2.0+ -->
<!--
 This example requires updating your template:

 ```
 <html class="h-full">
 <body class="h-full">
 ```
-->
<div class="min-h-full">
 <nav class="bg-white border-b border-gray-200">
   <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div class="flex justify-between h-16">
       <div class="flex">
         <div class="flex-shrink-0 flex items-center">
           <button on:click={() => {location.href ="/";
           //showInfo.set(true);
         }}>
             <img class="block lg:hidden h-6 w-auto" src="./powerloom-logo.svg" alt="PowerLoom">
             <img class="hidden lg:block h-7 w-auto" src="./powerloom-logo.svg" alt="PowerLoom">
           </button>
         </div>
         <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
           <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
           <a href="/" class="{slug == '' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" aria-current="page">
             Overview
           </a>

            <a href="/assets" class="{slug == 'pairs' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
             Assets
           </a>

           <a href="/volume" class="{slug == 'tokens' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
             Asset Volume
           </a>
           <!--
           <a href="/about" class="{slug == 'about' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
             About
           </a>
           -->
         </div>
       </div>
       <div class="hidden sm:ml-6 sm:flex sm:items-center">
         <!-- Profile dropdown -->
         <div class="ml-3 relative">
           <div>
             <button type="button" class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true" on:click={() => alert('Support for multiple networks coming soon!')}>
               <span class="sr-only">Open user menu</span>
               <img class="h-8 w-8 rounded-full" src="data:image/png;base64,{networkImage}" alt="{NETWORK} logo"> &nbsp; <span class="capitalize">{NETWORK}</span> <!--<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>-->
             </button>
           </div>
         </div>
       </div>
       <div class="-mr-2 flex items-center sm:hidden">
         <!-- Mobile menu button -->
         <button type="button" class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-controls="mobile-menu" on:click={() => showMobileMenu = !showMobileMenu} aria-expanded="false">
           <span class="sr-only">Open main menu</span>
           <!--
             Heroicon name: outline/menu

             Menu open: "hidden", Menu closed: "block"
           -->
           <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
           </svg>
           <!--
             Heroicon name: outline/x

             Menu open: "block", Menu closed: "hidden"
           -->
           <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>
     </div>
   </div>

   <!-- Mobile menu, show/hide based on menu state. -->
   {#if showMobileMenu}
   <div class="sm:hidden" id="mobile-menu">
     <div class="pt-2 pb-3 space-y-1">
       <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" -->
       <a href="/" class="{slug == '' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium" aria-current="page">
         Overview
       </a>

       <a href="/assets" class="{slug == 'pairs' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
         Assets
       </a>

       <!-- <a href="/tokens" class="{slug == 'tokens' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
         Tokens
       </a> -->
       <!--
       <a href="/about" class="{slug == 'about' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
         About
       </a>
       -->
     </div>
     <div class="pt-4 pb-3 border-t border-gray-200">
       <div class="flex items-center px-4">
         <div class="flex-shrink-0">
           <img class="h-10 w-10 rounded-full" src="data:image/png;base64,{networkImage}" alt="{NETWORK} logo"> <span class="capitalize">{NETWORK}</span>
         </div>
       </div>
     </div>
   </div>
   {/if}
 </nav>

 <div class="py-10">
   {#if slug != "about"}
   <header>
     <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <h1 class="text-3xl font-bold leading-tight text-gray-900">
         {APP_NAME} <span class="capitalize">{slug == "" ? "overview" : slug.includes("details") ? "Asset Details" : slug}</span>
         <button on:click={() => {showInfo.set(true);}}>
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         </button>
       </h1>
     </div>
   </header>
   {/if}
   <main>
     {#if $showInfo}
     <!-- This example requires Tailwind CSS v2.0+ -->
     <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
       <!--
         Background backdrop, show/hide based on modal state.

         Entering: "ease-out duration-300"
           From: "opacity-0"
           To: "opacity-100"
         Leaving: "ease-in duration-200"
           From: "opacity-100"
           To: "opacity-0"
       -->
       <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

       <div class="fixed z-10 inset-0 overflow-y-auto">
         <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
           <!--
             Modal panel, show/hide based on modal state.

             Entering: "ease-out duration-300"
               From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
               To: "opacity-100 translate-y-0 sm:scale-100"
             Leaving: "ease-in duration-200"
               From: "opacity-100 translate-y-0 sm:scale-100"
               To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
           -->
           <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
             <div>
               <div class="mx-auto flex items-center justify-center">
                 <img class="h-40" src="./Powerloom-logo.svg" alt="PowerLoom logo">
               </div>
               <div class="text-center">
                 <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">{APP_NAME} Info by PowerLoom Protocol</h3>
                 <div class="mt-2">
                   <p class="text-sm text-gray-500">We snapshot on-chain data from <a href="{INFO_URL}" class="text-black hover:text-gray-500" target="_blank" rel="noopener noreferer">{APP_NAME}</a> to give you actionable insights in a transparent way. Read more about this on our <a href="https://github.com/PowerLoom/pooler" target="_blank" rel="noopener noreferer" class="text-black hover:text-gray-500">Pooler repo</a>. If something seems off, feel free to ping us on <a href="https://discord.gg/powerloom" class="text-black hover:text-gray-500" target="_blank" rel="noopener noreferer">Discord</a>.<br/><strong>New:</strong> You can now participate in Powerloom Network's Incentivized Testnet to contribute as a snapshotter! <a href="https://coinlist.co/powerloom-testnet" target="_blank" rel="noopener noreferer" class="text-black hover:text-gray-500">Visit Coinlist</a> for details.</p>
                 </div>
               </div>
             </div>
             <div class="mt-5 sm:mt-6">
               <button type="button" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" on:click={()=> {
                 if (location.hash = "#about"){
                   history.pushState("", document.title, window.location.pathname+ window.location.search);
                 }
                 showInfo.set(false);
               }}>Cool 👍</button>
             </div>
           </div>
         </div>
       </div>
     </div>
     {/if}
     <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
       <!-- Replace with your content -->
       <div class="px-4 py-8 sm:px-0">
         <slot />
       </div>
       <!-- /End replace -->
     </div>
   </main>

   <!-- This example requires Tailwind CSS v2.0+ -->
   <footer class="bg-white">
     <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
       <div class="flex justify-center py-4 space-x-6 md:order-3">
         <a href="https://discord.gg/powerloom" target="_blank" rel="noopener noreferer">
         <img class="h-12" src="./join_discord.png" alt="Discord" />
       </a>
       </div>
       <div class="flex justify-center space-x-6 md:order-3">
         <a href="https://PowerLoom.io" target="_blank" class="text-gray-400 hover:text-gray-500">
           <span class="sr-only">Website</span>
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
         </a>
         <a href="https://twitter.com/PowerLoomHQ" target="_blank" rel="noopener noreferer" class="text-gray-400 hover:text-gray-500">
           <span class="sr-only">Twitter</span>
           <svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
             <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
           </svg>
         </a>
         <a href="https://medium.com/powerloom" target="_blank" rel="noopener noreferer" class="text-gray-400 hover:text-gray-500">
           <span class="sr-only">Medium</span>
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
         </a>
         <a href="https://github.com/PowerLoom" target="_blank" rel="noopener noreferer" class="text-gray-400 hover:text-gray-500">
           <span class="sr-only">GitHub</span>
           <svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
             <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
           </svg>
         </a>
       </div>
       <div class="mt-8 md:mt-0 md:order-1">
         <p class="text-center text-base text-gray-400">&copy; {new Date().getFullYear()} PowerLoom, Inc. All rights reserved.</p>
       </div>
     </div>
   </footer>
 </div>
</div>

