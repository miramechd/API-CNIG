import IGNSearch from 'facade/ignsearch';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  center: [-467062.8225, 4683459.6216],
  controls: ['getfeatureinfo'],
  zoom: 6,
});

const mp = new IGNSearch({
  servicesToSearch: 'gn',
  maxResults: 10,
  noProcess: 'poblacion',
  countryCode: 'es',
  isCollapsed: true,
  collapsible: true,
  position: 'TL',
  reverse: true,
  searchPosition: 'geocoder,nomenclator',
  resultVisibility: false,
  // urlCandidates: 'http://sergiotorrijos:8084/geocoder/api/geocoder/candidatesJsonp',
  // urlFind: 'http://sergiotorrijos:8084/geocoder/api/geocoder/findJsonp',
  // urlReverse: 'http://sergiotorrijos:8084/geocoder/api/geocoder/reverseGeocode',

  // urlCandidates: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
  // urlFind: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
  // urlReverse: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',
  nomenclatorSearchType: [
    'Estado',
    'Isla administrativa',
    'Comarca administrativa',
    'Jurisdicción',
    'Distrito municipal',
    'Entidad singular',
    'Construcción/instalación abierta',
    'Edificación',
    'Vértice Geodésico',
    'Alineación montañosa',
    'Montaña',
    'Paso de montaña',
    'Llanura',
    'Depresión',
    'Vertientes',
    'Comarca geográfica',
    'Paraje',
    'Elemento puntual del paisaje',
    'Saliente costero',
    'Playa',
    'Isla',
    'Otro relieve costero',
    'Espacio protegido restante',
    'Instalación portuaria',
    'Camino y vía pecuaria',
    'Curso natural de agua',
    'Masa de agua',
    'Curso artificial de agua',
    'Embalse',
    'Hidrónimo puntual',
    'Glaciares',
    'Mar',
    'Entrante costero y estrecho marítimo',
    'Relieve submarino',
  ],
});

map.addPlugin(mp);


window.map = map;

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const layerUA = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});

M.proxy(false);
