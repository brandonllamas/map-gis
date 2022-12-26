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
import LayerList from '@arcgis/core/widgets/LayerList';
import config from '@arcgis/core/config';
import MapView from '@arcgis/core/views/MapView';
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

    const groupLayer = new GroupLayer({
      title: 'Capas',
      layers: [
        // title layer es para los mapserver
        // new TileLayer({
        //   url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
        // }),
        //  Image serve
        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Fal_AerofotografiasOrtorectificadas/ImageServer',
          title:"Aerofotografias",
          visible:false
        }),

        //  Image serve
        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_Orixp_R01/ImageServer',
          title:"Radar Falso color",
          visible:true
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/RapidEye_3A/ImageServer',
          title:"RapidEye 3A",
          visible:false
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_CorredorRioCauca/ImageServer',
          title:"Corredor Rio Cauca",
          visible:false
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Ingeovista_CentrosPoblados/ImageServer',
          title:"Centros Poblados",
          visible:false
        }),

        new ImageryTileLayer({
          url: 'https://geo.cvc.gov.co/arcgis/rest/services/IMAGENES/Drones_D1/ImageServer',
          title:"Drone Humedales",
          visible:false
        }),


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
      content:   new LayerList({
        view,
      }),
      expanded: false,
    });

    view.ui.add(
      btnExpandCapas,
      'top-right'
    );
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
