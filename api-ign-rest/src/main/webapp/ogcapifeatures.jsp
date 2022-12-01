<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
    <%@ page import="java.util.Map" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="mapea" content="yes">
            <title>Layer OGCAPIFeatures</title>
            <link type="text/css" rel="stylesheet"
                href="https://ignogcapiguadaltel.desarrollo.guadaltel.es/api-core/assets/css/apiign.ol.min.css">

            <style type="text/css">
                html,
                body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: auto;
                }
            </style>
        </head>

        <body>
            <div>

                <label for="urlToSearch">URL</label>
                <input type="text" name="urlToSearch" id="urlToSearch" list="optionsurlToSearch" value="https://ignsolarguadaltel.desarrollo.guadaltel.es/collections/rutas/items/?">
                <datalist id="optionsurlToSearch">
                    <!--<option value="https://ignsolarguadaltel.desarrollo.guadaltel.es/"></option>-->
                    <option value="https://ignsolarguadaltel.desarrollo.guadaltel.es/collections/rutas/items/?f=json">
                    </option>
                    <option value="https://ignsolarguadaltel.desarrollo.guadaltel.es/collections/rutas/items/?">
                    </option>
                </datalist>

                <!-- <label for="nombreCapa">Nombre Capa</label>
        <input type="text" name="nombreCapa" id="nombreCapa" list="optionsnombreCapa">
        <datalist id="optionsnombreCapa">
          <option value="rutas"></option>
          <option value="unidades_administrativas"></option>
        </datalist> -->

                <label for="format">Format</label>
                <input type="text" name="format" id="format" list="optionsformat" value="json">
                <datalist id="optionsformat">
                    <option value="json"></option>
                </datalist>

                <label for="limit">Limit</label>
                <input type="number" name="limit" min="1" id="limit" list="optionslimit" value="10">
                <datalist id="optionslimit">
                    <option value="10"></option>
                    <option value="100"></option>
                    <option value="1000"></option>
                </datalist>

                <label for="offset">Offset</label>
                <input type="number" name="offset" min="1" id="offset" list="optionsoffset" value="0">
                <datalist id="optionsoffset">
                    <option value="10"></option>
                    <option value="100"></option>
                    <option value="1000"></option>
                </datalist>

                <label for="bbox">bbox</label>
                <input type="text" name="bbox" min="1" id="bbox" list="optionsbbox" value="-4.976807,36.668419,-3.938599,37.112146">
                <datalist id="optionsbbox">
                    <option value="-4.976807,36.668419,-3.938599,37.112146"></option>
                    <option value="[-4.976807,36.668419,-3.938599,37.112146]"></option>
                </datalist>

                <!-- <label for="CQL">CQL</label>
        <input type="text" name="CQL" id="CQL" list="optionsCQL">
        <datalist id="optionsCQL">
        </datalist> -->


                <!-- <label for="id">id</label>
        <input type="number" name="id" min="1" id="id" list="optionsid">
        <datalist id="optionsid">
          <option value="1"></option>
          <option value="55"></option>
          <option value="89"></option>
        </datalist>
    
        <label for="crs">CRS</label>
        <input type="text" name="crs" id="crs" list="optionscrs">
        <datalist id="optionscrs">
        </datalist>
    
    
    
        <label for="nombreCapa">Nombre Capa</label>
        <input type="text" name="nombreCapa" id="nombreCapa" list="optionsnombreCapa">
        <datalist id="optionsnombreCapa">
        </datalist>
    
        <label for="leyenda">Leyenda</label>
        <input type="text" name="leyenda" id="leyenda" list="optionsleyenda">
        <datalist id="optionsleyenda">
        </datalist>
    
        <label for="geometryType">Tipo de geometría</label>
        <input type="text" name="geometryType" id="geometryType" list="optionsgeometryType">
        <datalist id="optionsgeometryType">
          <option value="LINE"></option>
        </datalist>
    
        <label for="minZoom">minZoom</label>
        <input type="number" name="minZoom" min="0" max="21" id="minZoom" list="optionsminZoom">
        <datalist id="optionsminZoom">
        </datalist>
    
    
        <label for="maxZoom">maxZoom</label>
        <input type="number" name="maxZoom" min="1" max="22" id="maxZoom" list="optionsmaxZoom">
        <datalist id="optionsmaxZoom">
        </datalist> -->


                <br>
                <button id="btnActualizarCapa">Actualizar capa</button>

                <br>
                <br>
            </div>
            <div id="mapjs" class="m-container"></div>
            <script type="text/javascript"
                src="https://ignogcapiguadaltel.desarrollo.guadaltel.es/api-core/vendor/browser-polyfill.js"></script>
            <script type="text/javascript"
                src="https://ignogcapiguadaltel.desarrollo.guadaltel.es/api-core/js/apiign.ol.min.js"></script>
            <script type="text/javascript"
                src="https://ignogcapiguadaltel.desarrollo.guadaltel.es/api-core/js/configuration.js"></script>


            <script type="text/javascript">
                const urlParams = new URLSearchParams(window.location.search);
                M.language.setLang(urlParams.get('language') || 'es');

                const map = M.map({
                    container: 'mapjs',
                    zoom: 5,
                    maxZoom: 20,
                    minZoom: 4,
                    center: [-467062.8225, 4783459.6216],
                });


                const tst = new M.layer.OGCAPIFeatures({
                    url: 'http://ignsolarguadaltel.desarrollo.guadaltel.es/collections/rutas/items/?',
                    //url: 'http://ignsolarguadaltel.desarrollo.guadaltel.es/collections/rutas/items/3?f=json',
                    //limit: 2,
                    //id: 5,
                    //bbox: (-4.976807,36.668419,-3.938599,37.112146)
                    format: "json",
                    bbox: [-4.976807, 36.668419, -3.938599, 37.112146],
                    //nombreEs: "Puerto del León por Totalán"
                    //cql: "BBOX(geometry, -4.976807, 36.668419, -3.938599, 37.112146)"
                });
                window.tst = tst;
                map.addLayers(tst);

                // let mp;

                // let sToSearch, mxResults, collapsed = true,
                //     collapsible = true,
                //     zoom,
                //     posicion, noProcess, countryCode, reverse = true,
                //     urlCandidates, urlFind, urlReverse, searchposition, pointStyle;
                // addLayer({
                //     servicesToSearch: sToSearch,
                //     maxResults: mxResults,
                //     noProcess: noProcess,
                //     countryCode: countryCode,
                //     isCollapsed: collapsed,
                //     collapsible: collapsible,
                //     position: posicion,
                //     reverse: reverse,
                //     zoom: zoom,
                //     urlCandidates: urlCandidates,
                //     urlFind: urlFind,
                //     urlReverse: urlReverse,
                //     searchPosition: searchposition,
                //     pointStyle: pointStyle
                // });


                const inputUrlToSearch = document.getElementById("urlToSearch");
                const inputFormat = document.getElementById("format");
                const inputLimit = document.getElementById("limit");
                const inputOffset = document.getElementById("offset");
                // const inputId = document.getElementById("id");
                const inputBbox = document.getElementById("bbox");
                // const inputCrs = document.getElementById("crs");
                //const inputCQL = document.getElementById("CQL");
                // const inputNombreCapa = document.getElementById("nombreCapa");
                // const inputLeyenda = document.getElementById("leyenda");
                // const inputGeometryType = document.getElementById("geometryType");
                // const inputMinZoom = document.getElementById("minZoom");
                // const inputMaxZoom = document.getElementById("maxZoom");

                const btnActualizarCapa = document.getElementById("btnActualizarCapa");

                btnActualizarCapa.addEventListener('click', cambiarTest);



                function cambiarTest() {

                    let objeto = {}
                    objeto.url = inputUrlToSearch.value != "" ? inputUrlToSearch.value : undefined;
                    objeto.format = inputFormat.value != "" ? inputFormat.value : undefined;
                    objeto.limit = inputLimit.value != "" ? inputLimit.value : undefined;
                    objeto.offset = inputOffset.value != "" ? inputOffset.value : undefined;
                    //objeto.id = inputId.value != "" ? inputId.value : undefined;
                    objeto.bbox = inputBbox.value != "" ? inputBbox.value : undefined;
                    // objeto.crs = inputCrs.value != "" ? inputCrs.value : undefined;
                    //objeto.cql = inputCQL.value != "" ? inputCQL.value : undefined;
                    // objeto.name = inputNombreCapa.value != "" ? inputNombreCapa.value : undefined;

                    //leyenda????
                    // objeto.leyenda = inputLeyenda.value != "" ? inputLeyenda.value : undefined;


                    // objeto.geometry = inputGeometryType.value != "" ? inputGeometryType.value : undefined;

                    // objeto.minzoom = inputMinZoom.value != "" ? inputMinZoom.value : undefined;

                    // objeto.maxzoom = inputMaxZoom.value != "" ? inputMaxZoom.value : undefined;


                    Object.keys(objeto).forEach(key => objeto[key] === undefined ? delete objeto[key] : {});

                    //console.log(objeto);

                    // map.removePlugins(mp);
                    addLayer(objeto);
                }

                function addLayer(propiedades) {

                    layers = map.getOGCAPIFeatures();
                    //console.log(layers);

                    if (map.getOGCAPIFeatures().length > 0) {
                        map.removeLayers(map.getOGCAPIFeatures());
                    }
                    const layer = new M.layer.OGCAPIFeatures(propiedades)
                    map.addLayers(layer);
                }
        // let mp2 = new M.plugin.ShareMap({
        //     baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-core')) + "api-core/",
        //     position: "TR",
        // });
        // map.addPlugin(mp2);
        // const botonEliminar = document.getElementById("botonEliminar");
        // botonEliminar.addEventListener("click", function() {
        //     map.removePlugins(mp);
        // });
            </script>
        </body>

        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-163660977-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'UA-163660977-1');
        </script>

        </html>