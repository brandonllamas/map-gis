//#region  Importaciones
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import ImageryTileLayer from '@arcgis/core/layers/ImageryLayer';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import FeatureLayerSource from '@arcgis/core/layers/featureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Search from '@arcgis/core/widgets/Search';
import Swipe from '@arcgis/core/widgets/Swipe';
import LayerList from '@arcgis/core/widgets/LayerList';
import config from '@arcgis/core/config';
import MapView from '@arcgis/core/views/MapView';

import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D';
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D';

import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import { environment } from 'src/environments/environment';
import { DataRender } from './models/general';
//#endregion

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'map-gis';
  private readonly key = environment.api_key;

  public view: any = null;
  layerG?: DataRender;
  //observamos el div
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  ngOnInit(): any {
    //cargamos el mapa por defecto
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log('The map is ready.');
    });
  }

  async initLayers(): Promise<DataRender> {
    const url =
      'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_Orixp_R01/ImageServer';
    // https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServe
    const layer = new ImageryTileLayer({
      url: url,
      title: 'World Elevation ImageryTileLayer',
      // blendMode: 'destination-in',
    });
    await layer.load();
    layer.renderer;

    const generalLayer = new GroupLayer({
      title: 'General layer',
      layers: [
        new TileLayer({
          url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer',
          title: 'Map server global',
          visible: false,
        }),

        new TileLayer({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
          title: 'Map server global Relieve cvc',
          visible: false,
        }),

      ],
    });

    const CartografiaBase = new GroupLayer({
      title: 'Cartografia Base',
      layers: [
        new TileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/CARTO_BASICA/Infraestructura/MapServer',
          title: 'Infraestructura',
          visible: false,
        }),

        new FeatureLayerSource({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/CARTO_BASICA/Red_Geodesica_CVC/MapServer',
          title: 'Red Geodesica CVC',
          visible: false,

        }),

        new TileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/CARTO_BASICA/Relieve/MapServer',
          title: 'Relieve',
          visible: false,
        }),


        new FeatureLayerSource({
          url: ' https://geo.cvc.gov.co/arcgis/rest/services/CARTO_BASICA/Division_politica/MapServer',
          title: 'Division politica',
          visible: false,
        }),

      ],
    });


    const agua = new GroupLayer({
      title: 'Agua',
      layers: [
        // new FeatureLayerSource({


        // }),
        new MapImageLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/AGUA/Captaciones_y_Vertimientos/MapServer',
          title: 'Captaciones y vertimientos',
          visible: false,
          sublayers:[
            {
              id:0,
              title:"sub layer1"
            },
            {
              id:1,
              title:"sub layer 2"
            }
          ]
        }),

      ],
    });

    const cambioClimatico = new GroupLayer({
      title: 'Cambio climatico',
      layers: [
        // new FeatureLayerSource({


        // }),
        new MapImageLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/CAMBIO_CLIMATICO/Temperatura/MapServer',
          title: 'Temperatura',
          visible: false,
          sublayers:[
            {
              id:0,
              title:"sub layer1",

            },
            {
              id:1,
              title:"sub layer 2"
            }
          ]
        }),

        new MapImageLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/CAMBIO_CLIMATICO/Red_Hidroclimatologica/MapServer',
          title: 'Red Hidroclimatologica',
          visible: false,
          sublayers:[
            {
              id:0,
              title:"sub layer1",

            },

          ]
        }),

      ],
    });


    const groupLayer = new GroupLayer({
      title: 'Capas',
      layers: [
        generalLayer,
        // title layer es para los mapserver
        // new TileLayer({
        //   url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
        // }),
        //  Image serve
        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Fal_AerofotografiasOrtorectificadas/ImageServer',
          title: 'Aerofotografias',
          visible: false,
        }),

        //  Image serve
        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_Orixp_R01/ImageServer',
          title: 'Radar Falso color',
          visible: false,
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/RapidEye_3A/ImageServer',
          title: 'RapidEye 3A',
          visible: false,
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_CorredorRioCauca/ImageServer',
          title: 'Corredor Rio Cauca',
          visible: false,
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_CentrosPoblados/ImageServer',
          title: 'Centros Poblados',
          visible: false,
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Drones_D1/ImageServer',
          title: 'Drone Humedales',
          visible: false,
        }),
        CartografiaBase,
        agua,
        cambioClimatico
      ],

    });

    return {
      GroupLayer: groupLayer,
      ImageryTileLayer: layer,
    };
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    config.apiKey = this.key;
    this.layerG = await this.initLayers();
    let layer = this.layerG;

    const webmap = new WebMap({
      basemap: 'topo-vector',
      layers: [layer.GroupLayer],

    });

    const view = new MapView({
      container,
      map: webmap,
      center: [-76.95939816904708, 3.849113361611799],
      zoom: 8,
    });

    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    //#region  Botones
    // const bkExpand = new Expand({
    //   view,
    //   content: bookmarks,
    //   expanded: false,
    // });

    const btnExpandCapas = new Expand({
      view,
      content: new LayerList({
        view,

      }),
      expanded: false,
    });

    const btnSearch = new Expand({
      view,
      content: new Search({
        view,
      }),
      expanded: false,
    });

    const btnSwipe =  new Swipe({
        // leadingLayers: [infrared],
        // trailingLayers: [nearInfrared],
        position: 35, // set position of widget to 35%
        view: view

    });
    const btnCalculate = new Expand({
      view,
      content: new DistanceMeasurement2D({
        view: view
      }),
      expanded: false,
    });


    view.ui.add(btnSearch, 'top-right');
    view.ui.add(btnExpandCapas, 'top-right');
    view.ui.add(btnCalculate, 'top-right');
    // view.ui.add(btnSwipe);
    // Add the widget to the top-right corner of the view
    // view.ui.add(bkExpand, 'top-right');

    //#endregion

    // bonus - how many bookmarks in the webmap?
    // webmap.when(() => {
    //   if (webmap.bookmarks && webmap.bookmarks.length) {
    //     console.log('Bookmarks: ', webmap.bookmarks.length);
    //     console.log(webmap.bookmarks);
    //   } else {
    //     console.log('No bookmarks in this webmap.');
    //   }
    // });
    let activeWidget = null;

    this.view = view;
    return this.view.when();
  }





  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
