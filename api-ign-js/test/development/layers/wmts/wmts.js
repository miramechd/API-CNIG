import WMTS from 'M/layer/WMTS';

export const wmts_001 = new WMTS({
  url: 'https://wmts-mapa-lidar.idee.es/lidar',
  name: 'EL.GridCoverageDSM',
  legend: 'Modelo Digital de Superficies LiDAR',
  matrixSet: 'EPSG:4326',
  // visibility: true,
  //   isBase: false,
  //   transparent: true,
  // attribution: {
  //     name: 'Name Prueba WMTS',
  //     description: 'Description Prueba',
  //     url: 'https://www.ign.es',
  //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //     contentType: 'kml',
  //   },
}, {});

export const wmts_002 = 'WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*imagen*true*image/jpeg*true*true*true';


export const wmts_003 = new WMTS({
  url: 'https://servicios.idee.es/wmts/ocupacion-suelo',
  name: 'LC.LandCoverSurfaces',
  legend: 'LC.LandCoverSurfaces l',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
});


export const wmts_004 = new WMTS({
  url: 'https://www.ign.es/wmts/planos?',
  name: 'MancelliMadrid',
  legend: 'MancelliMadrid',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
});
