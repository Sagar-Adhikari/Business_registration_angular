import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

type PaneType = 'left' | 'right';


@Component({
  selector: 'app-slide-panel',
  styleUrls: ['./slide-panel.component.scss'],
  templateUrl: './slide-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({
        transform: 'translateX(0%)',
        // 'display': 'flex'
      })),
      state('right', style({
        transform: 'translateX(-50%)',
        //  'display': 'block'
      })),
      transition('* => *', animate(300))
    ])
  ]
})

export class SlidePanelComponent {
  @Input() activePane: PaneType = 'left';
  isLeftView = true;
  isRightView = true;

  animStart(e: any) {
    this.isLeftView = true;
    this.isRightView = true;
  }

  animEnd(e: any) {
    if (e.toState === 'right') {
      this.isRightView = true;
      this.isLeftView = false;
    } else {
      this.isLeftView = true;
      this.isRightView = false;
    }
  }
}

