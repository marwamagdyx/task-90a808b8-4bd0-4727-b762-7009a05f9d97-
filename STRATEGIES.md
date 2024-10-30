# **Implementation Strategies**

## Table of Contents
| Section | Description |
| ----------- | ----------- |
| [Map Implementation](#map-implementation)| The implementation used for the map. |
| [Storage Strategy](#storage-strategy)| storage strategy used in the application. |
| [Mobile-First Approach](#mobile-first-approach)| Mobile First approach. |

--- 
--- 
## Map Implementation
1. Used OpenStreetMap and Leaflet.js for rendering maps
2. Added draggable marker for easy location selection
3. Optimized map tile loading and caching for better performance

## Storage Strategy
1. Primary: LocalStorage for persistent storage
2. Asynchronous storage operations to prevent UI blocking
3. Third party used: Partytown for improved performance and non-blocking

## Mobile-First Approach
1. Responsive design using viewport units
2. Touch-friendly interactions optimized for mobile
3. Performance optimization for slow internet connections
4. UI/UX tailored for mobile devices and web browsers
