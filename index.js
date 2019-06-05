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
import {defaults as defaultInteractions, Select, Translate} from 'ol/interaction.js';


var geojsonObject = {
    'type': 'FeatureCollection',
    'crs': {
      'type': 'name',
      'properties': {
        'name': 'EPSG:4326'
      }
    },
    'features':[{
      'type': 'Feature',
      'id': 'polygon',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
      }},{
        'type': 'Feature',
        'id': 'point0',
        'geometry': {
          'type': 'Point',
          'coordinates': [1e6, -6e6]
        }
      },{
        'type': 'Feature',
        'id': 'point1',
        'geometry': {
          'type': 'Point',
          'coordinates': [2e6, -4e6]
        }
      },{
        'type': 'Feature',
        'id': 'point2',
        'geometry': {
          'type': 'Point',
          'coordinates': [3e6, -6e6]
        }
      }
    ]
};

var vectorSource = new VectorSource({
  features: (new GeoJSON()).readFeatures(geojsonObject),
  projection: 'EPSG:4326',
});

// vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

var vectorLayer = new VectorLayer({
  source: vectorSource  
});

var select = new Select();
console.log(select.getFeatures(), 'seee');
var translate = new Translate({
  features: select.getFeatures()
});
translate.on('translateend', evt => {
  console.log(evt.features, 'translated features');
  console.log(vectorLayer.getSource().getFeatureById('polygon').getGeometry().getCoordinates(),'polygon coord');
  var point0 = vectorLayer.getSource().getFeatureById('point0').getGeometry().getCoordinates();
  var point1 = vectorLayer.getSource().getFeatureById('point1').getGeometry().getCoordinates();
  var point2 = vectorLayer.getSource().getFeatureById('point2').getGeometry().getCoordinates();
  console.log(point0, point1, point2, 'points')
  var new_coords = [];
  new_coords.push(point0);
  new_coords.push(point1);
  new_coords.push(point2);
  vectorLayer.getSource().getFeatureById('polygon').getGeometry().setCoordinates([new_coords]);
  // evt.features.forEach(feat => {
  //   // process every feature
  // })
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
    center: [0, 0],
    zoom: 2
  })
});

