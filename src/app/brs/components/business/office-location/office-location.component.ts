import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { icon, latLng, tileLayer } from 'leaflet';
import { GlobalService } from 'src/app/shared';
import { BrsService } from '../brs.service';
import { WardLocationInput } from 'src/app/generated/graphql';
import * as L from 'leaflet';

@Component({
  selector: 'app-office-location',
  templateUrl: './office-location.component.html',
  styleUrls: ['./office-location.component.scss']
})
export class OfficeLocationComponent implements OnInit {
  private defalultLat = 27.673955320113336;
  private defaultLng = 85.63057540814657;
  private map: any;

  private streetMaps = tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      detectRetina: true,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  );

  options: any = {
    layers: [this.streetMaps],
    zoom: 11,
    center: latLng([this.defalultLat, this.defaultLng])
  };

  location: any;
  vdc = '';
  markers = [];

  private createIcon(iconId: any) {
    return icon({
      iconSize: this.markers[iconId].wardIconSize,
      iconAnchor: [8, 6],
      iconUrl: this.markers[iconId].wardIcon.toString()
    });
  }

  constructor(
    private brsService: BrsService,
    private globalService: GlobalService
  ) {

    this.globalService.setPageTitle('कार्यालय लाेकेसन');

    this.brsService.getWardLocation().subscribe(x => {
      x.palikaLocation.forEach((element: { id: string | number; lat: any; lng: any; telNo: any; }) => {
        this.defalultLat = element.lat;
        this.defaultLng = element.lng;

        this.markers.push({
          wardNo: +element.id,
          latLng: [
            element.lat ? element.lat : this.defalultLat,
            element.lng ? element.lng : this.defaultLng
          ],
          wardIcon: 'assets/map/saved-location-marker2.png',
          wardIconSize: [26, 26],
          telNo: element.telNo
        });
        this.vdc = x.palikaLocation[0].palikaName;
      });
      x.wardLocation.forEach((element: { id: string | number; lat: any; lng: any; telNo: any; }) => {
        this.markers.push({
          wardNo: +element.id,
          latLng: [
            element.lat ? element.lat : this.defalultLat,
            element.lng ? element.lng : this.defaultLng
          ],
          wardIcon: 'assets/map/saved-location-marker.png',
          wardIconSize: [18, 18],
          telNo: element.telNo
        });
      });
      this.addMarker();
    });
  }

  markerOnClick(event: any) {
    let id = +event.target.options.title.toString().substr(10);
    const popup = event.target.getPopup();

    if (!id) {
      id = 0;
      const div =
        `<div style="color:#3f51b5;">
        <strong>
      ${this.vdc}
      </strong>
      </br>फाेन नं. : <strong style='color: black;'>
      ${this.markers[0].telNo}
      </div>`;
      popup.setContent(div);
    } else {
      const div =
        `<div style="color:#3f51b5;">
        <strong>
      ${this.vdc}
      </strong>
      </br>वडा नं. : <strong style='color: black;'>
      ${this.markers[id].wardNo.toString()}
      </strong>
      </br>फाेन नं. : <strong style='color: black;'>
      ${this.markers[id].telNo.toString()}
      </div>`;
      popup.setContent(div);
    }
  }

  addMarker() {
    for (let i = 0; i < this.markers.length; i++) {
      L.marker([this.markers[i].latLng[0], this.markers[i].latLng[1]], {
        title: i === 0 ? this.vdc : 'वडा नं. :  ' + i.toString(),
        icon: this.createIcon(i),
        draggable: true
      })
        .addTo(this.map)
        .on('click', this.markerOnClick, this)
        .bindPopup('')
        .on('dragend', e => {
        //  const id = +e.target.options.title.toString().substr(10);
          this.markers[i].latLng = [e.target._latlng.lat, e.target._latlng.lng];
        });
    }
    this.map.panTo([this.defalultLat, this.defaultLng]);
    this.globalService.setLoading(false);
  }

  onMapReady(map: any) {
    this.map = map;
    this.addMarker();
  }

  saveLocation() {
    this.globalService.setLoading(true);
    const id = [];
    const lat = [];
    const lng = [];
    this.markers.forEach(element => {
      id.push(element.wardNo);
      lat.push(element.latLng[0]);
      lng.push(element.latLng[1]);
    });
    const location: WardLocationInput = {
      id: id,
      lat: lat,
      lng: lng
    };
    this.brsService.setWardLocation(location).subscribe(
      x => {
        if (x === true) {
          this.globalService.showSuccessMessage('Location saved successfully');
          // console.log(this.markers[0], this.markers[0].latLng[0], this.markers[0].latLng[1]);
          this.map.panTo([this.markers[0].latLng[0], this.markers[0].latLng[1]]);
        } else {
          this.globalService.showErrorMessage('Error on location update');
        }
      },
      error => {
        this.globalService.showErrorMessage(error.message);
      }
    );
  }

  ngOnInit() {
  }
}
