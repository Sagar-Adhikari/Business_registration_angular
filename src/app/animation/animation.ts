import {
    trigger,
    animate,
    transition,
    style,
    state,
    query
} from '@angular/animations';

export const showHideAnimation =
    trigger('showHideAnimation', [
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('0 => 1', animate('.90s')),
        transition('1 => 0', animate('.90s'))
    ]);

export const fadeAnimation = trigger('fadeAnimation', [
    transition('* => *', [
        query(
            ':enter',
            [style({ opacity: 0 })],
            { optional: true }
        ),
        query(
            ':leave',
            [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
            { optional: true }
        ),
        query(
            ':enter',
            [style({ opacity: 0 }), animate('0.2s', style({ opacity: 1 }))],
            { optional: true }
        )
    ])
]);
