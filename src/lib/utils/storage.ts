// export interface PinLocation {
//     lat: number;
//     lng: number;
//   }
  
//   // to run in a web worker using PartyTown
//   export function setupPartyTownFunctions() {
//     if (typeof window !== 'undefined') {
//       (window as any).storePinLocation = (location: PinLocation): void => {
//         try {
//           const serialized = JSON.stringify(location);
//           localStorage.setItem('pinLocation', serialized);
//           // success message to main thread
//           (window as any).postMessage({
//             type: 'storage-success',
//             action: 'store',
//             timestamp: Date.now(),
//           });
//         } catch (error: unknown) {
//           (window as any).postMessage({
//             type: 'storage-error',
//             action: 'store',
//             error: error instanceof Error ? error.message : String(error),
//           });
//         }
//       };
  
//       (window as any).getPinLocation = (): PinLocation => {
//         try {
//           const stored = localStorage.getItem('pinLocation');
//           if (stored) return JSON.parse(stored);
//         } catch (error: unknown) {
//           console.error('Error retrieving pin location:', error);
//         }
//         // Return default position if storage retrieval fails
//         return { lat: 51.505, lng: -0.09 };
//       };
//     }
//   }

// storage.ts
export interface PinLocation {
  lat: number;
  lng: number;
}

export function setupPartyTownFunctions() {
  if (typeof window !== 'undefined') {
      (window as any).storePinLocation = (location: PinLocation): void => {
          try {
              const serialized = JSON.stringify(location);
              localStorage.setItem('pinLocation', serialized);
              (window as any).postMessage({ type: 'storage-success', action: 'store', timestamp: Date.now() });
          } catch (error) {
              (window as any).postMessage({ type: 'storage-error', action: 'store', error: error instanceof Error ? error.message : String(error) });
          }
      };

      (window as any).getPinLocation = (): PinLocation => {
          try {
              const stored = localStorage.getItem('pinLocation');
              if (stored) return JSON.parse(stored);
          } catch (error) {
              console.error('Error retrieving pin location:', error);
          }
          return { lat: 51.505, lng: -0.09 };
      };
  }
}
