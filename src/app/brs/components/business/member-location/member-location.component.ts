import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { icon, latLng, tileLayer } from 'leaflet';
import { GlobalService } from 'src/app/shared';
import { BrsService } from '../brs.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-member-location',
  templateUrl: './member-location.component.html',
  styleUrls: ['./member-location.component.scss']
})
export class MemberLocationComponent implements OnInit {
  location: any;
  customPopup = '';
  markers = [];
  private lat = 0;
  private lng = 0;


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
    center: latLng([this.lat, this.lng])
  };

  private createIcon() {
    return icon({
      iconSize: [16, 16],
      iconAnchor: [8, 16],
      iconUrl: 'assets/map/saved-location-marker.png'
    });
  }

  markerOnClick(event: any) {
    this.globalService.setLoading(true);
    const redgNo: string = event.target.options.title.toString().substr(11);
    const newMarker = this.markers.filter(x => x.redgNo === redgNo.toString().trim());
    let id = 0;
    if (newMarker.length > 0) {
      id = newMarker[0].id;
    }

    this.brsService.getBusiness(+id).subscribe(x => {
      const popup = event.target.getPopup();
      const div =
        `
        <div style="background-color:#fafafa;color:#3f51b5;border:1px solid #3f51b5; padding: 5px; border-radius:8px;">
        दर्ता नं. : <strong style='color: black;'>
        ${x.business.fullRedgNo}
        </strong></br>ब्यवसाय : <strong style='color: black;'>
        ${x.business.businessName}
        </strong></br>ब्यवसायीकाे नाम : <strong style='color: black;'>
        ${x.business.member.nameInNepali}
        </strong></br>वडा नं. : <strong style='color: black;'>
        ${x.business.houseOwners[0].wardNo}
        </strong></br>फाेन नं. : <strong style='color: black;'>
        ${x.business.member.mobileNo}
        </div>`;
      popup.setContent(div);
      this.globalService.setLoading(false);
    });
  }


  onMapReady(map: any) {
    this.map = map;
    this.brsService.getWardLocation().subscribe(x => {
      this.lat = x.palikaLocation[0].lat;
      this.lng = x.palikaLocation[0].lng;
      this.map.panTo([this.lat, this.lng]);
    });
    this.brsService.getBusinessLocation().subscribe(x => {
      for (let i = 0; i < x.length; i++) {
        this.markers.push({
          id: +x[i].business.id,
          redgNo: x[i].business.fullRedgNo,
          latLng: [
            x[i].lat ? x[i].lat : 0,
            x[i].lng ? x[i].lng : 0
          ],
          wardIcon: 'assets/map/saved-location-marker.png',
          wardIconSize: [18, 18]
        });
      }
      this.addMarker();
    });
  }

  addMarker() {
    for (let i = 0; i < this.markers.length; i++) {
      L.marker([this.markers[i].latLng[0], this.markers[i].latLng[1]], {
        title: 'दर्ता नं. : ' + this.markers[i].redgNo,
        icon: this.createIcon(),
        draggable: false
      })
        .addTo(this.map)
        .on('click', this.markerOnClick, this)
        .bindPopup('');
    }
    this.globalService.setLoading(false);
  }

  constructor(
    private brsService: BrsService,
    private globalService: GlobalService
  ) {
    this.globalService.setPageTitle('ब्यवसायकाे लाेकेसन');
  }


  ngOnInit() {
  }

}
