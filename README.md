Prototype UI for ONC

## Testing build locally

```
npm i spa-http-server -g
npm run build
cd build
http-server --push-state -p 8091 -o
```



## TODO

- [ ] Save filter and map state in url
- [ ] Update `axiom-maps` to allow geojson to be updatd on existing layer with the goal of removingthe flicker after filter