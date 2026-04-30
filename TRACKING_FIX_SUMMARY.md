# 🔍 Issue Analysis

## Problem
`MapViewDirections` automatically calls `fitToCoordinates()` when it renders, causing map to reset when user zooms/pans.

## Root Cause
- Line 217-268: Three `MapViewDirections` components render
- Each one internally fits map to show full route
- This overrides user's manual zoom/pan

## Solution Options

### Option 1: Use Polyline instead of MapViewDirections (RECOMMENDED)
- Fetch route coordinates once using Directions API
- Store in state
- Render using `<Polyline>` component
- No auto-fitting behavior

### Option 2: Render MapViewDirections only once
- Fetch routes on mount
- Hide MapViewDirections after getting coordinates
- Draw with Polyline

### Option 3: Custom Directions API call
- Direct fetch() call to Google Directions API
- Decode polyline manually
- Full control over rendering

## Recommended Fix
Use Option 1 - Replace MapViewDirections with manual API call + Polyline
