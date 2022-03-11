/* eslint-diasble */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic21lYjEyIiwiYSI6ImNsMDd5Y2JhYTB4eGYzaW81eHFqcmEyOXIifQ.rkrm2jZMXfsmHLdWiI8wiQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/smeb12/cl081tamx000e14o4kz69tw71',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 4,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} : ${loc.description} </p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      botton: 150,
      left: 100,
      right: 100,
    },
  });
};
