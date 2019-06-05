import 'ol/ol.css';
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import $ from 'jquery';

import {
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer.js';
import {
  OSM,
  Vector as VectorSource
} from 'ol/source.js';
import {
  defaults as defaultInteractions,
  Select,
  Translate
} from 'ol/interaction.js';


var geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name'
  },
  'features': [{
    "geometry": {
      "coordinates": [
        [
          [
            78.349,
            17
          ],
          [
            78.5,
            17.413
          ],
          [
            78.548,
            17.5
          ],
          [
            79,
            17.844
          ],
          [
            79.5,
            17.89
          ],
          [
            80,
            17.752
          ],
          [
            80.5,
            17.738
          ],
          [
            80.657,
            18
          ],
          [
            80.978,
            18.5
          ],
          [
            81,
            18.622
          ],
          [
            81.038,
            19
          ],
          [
            81.04,
            19.5
          ],
          [
            81.5,
            19.752
          ],
          [
            82,
            19.978
          ],
          [
            82.5,
            19.786
          ],
          [
            82.773,
            19.5
          ],
          [
            83,
            19.344
          ],
          [
            83.392,
            19
          ],
          [
            83.5,
            18.852
          ],
          [
            83.818,
            18.5
          ],
          [
            83.845,
            18
          ],
          [
            83.54,
            17.5
          ],
          [
            83.5,
            17.459
          ],
          [
            83,
            17.044
          ],
          [
            82.948,
            17
          ],
          [
            82.5,
            17
          ],
          [
            82,
            17
          ],
          [
            81.5,
            17
          ],
          [
            81,
            17
          ],
          [
            80.5,
            17
          ],
          [
            80,
            17
          ],
          [
            79.5,
            17
          ],
          [
            79,
            17
          ],
          [
            78.5,
            17
          ],
          [
            78.349,
            17
          ]
        ]
      ],
      "type": "Polygon"
    },
    "properties": {
      "color": "rgba(166, 242, 143, 0.6)",
      "val": 1
    },
    "type": "Feature",
    "id": "polygon"
  }]
};
// console.log(geojsonObject.features[0].geometry.coordinates[0].length);
var poly_points = geojsonObject.features[0].geometry.coordinates[0];
for(var i = 0; i < poly_points.length; i++){
  var pt = poly_points[i];
  geojsonObject.features.push({
    'type': 'Feature',
    'id': 'point' + i,
    'geometry': {
      'type': 'Point',
      'coordinates': [pt[0], pt[1]]
    }
  });
}
// console.log(geojsonObject, 'geojsonobj')
var vectorSource = new VectorSource({
  features: (new GeoJSON()).readFeatures(geojsonObject)
});

// vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

var vectorLayer = new VectorLayer({
  source: vectorSource
});

var select = new Select();

var translate = new Translate({
  features: select.getFeatures()
});
var temp_points = [];
translate.on('translateend', evt => {
  temp_points = [];  
  for(var k = 0; k < poly_points.length; k++){
    temp_points.push(vectorLayer.getSource().getFeatureById('point' + k).getGeometry().getCoordinates());
  }
  
  vectorLayer.getSource().getFeatureById('polygon').getGeometry().setCoordinates([temp_points]);
  
});
var map = new Map({
  interactions: defaultInteractions().extend([select, translate]),
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 2
  })
});