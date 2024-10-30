# Performance Considerations

## Metrics
- Target FPS: 60
- Initial load time: < 2s
- Time to Interactive: < 3s
- Smooth marker dragging on mobile devices

## Optimizations
1. Lazy loading of map components
2. Progressive tile loading
3. Efficient marker position updates
4. LocalStorage for faster data access
5. Minimal bundle size through code splitting
6. Map tile caching
7. Touch event optimization
8. No blocking during storage operations
9. Storage operations run in a web worker

## Mobile Performance
1. Reduced tile quality on slower connections
2. Debounced position updates during marker drag
3. Optimized touch interactions
4. Efficient DOM updates using Svelte


### Performance Optimizations

#### 1. Debouncing
We implemented a debounce function to prevent excessive calls to the location storage function when the user drags the marker. This reduces redundant updates and enhances performance.

#### 2. Asynchronous Loading with PartyTown
By offloading certain tasks to PartyTown (like managing pin location storage), we reduced the main thread load, improving responsiveness and overall performance.

#### 3. Leaflet Map Optimization
- Set an appropriate `maxZoom` for the map, limiting data rendering beyond useful levels.
- Adjusted tile layer loading for faster map interactions.

#### 4. Lazy Loading
Modules like Leaflet are imported asynchronously using `await import('leaflet')` to delay loading until needed, reducing the initial load time.

#### 5. Browser-Specific Performance
Targeted optimizations for Chrome on Android, including use of LocalStorage for asynchronous data handling, tailored for mobile performance.
