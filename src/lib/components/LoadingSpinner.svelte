<script lang="ts">
    export let show = false; //control the visibility of the loading overlay
  </script>
  
  {#if show}
  <div class="loading-overlay">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>
  {/if}
  
  <style>
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  
    .spinner {
      width: 40px;
      height: 40px;
      position: relative;
    }
  
    .double-bounce1, .double-bounce2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #333;
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      animation: sk-bounce 2.0s infinite ease-in-out;
    }
  
    .double-bounce2 {
      animation-delay: -1.0s;
    }
  
    @keyframes sk-bounce {
      0%, 100% { transform: scale(0.0) }
      50% { transform: scale(1.0) }
    }
  </style>