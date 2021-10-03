export class DataDictionary {

    constructor() { }

    public StatusList() {
        return [
            { id: 1, text: 'unverified' },
            { id: 2, text: 'verified' },
            { id: 3, text: 'printed' },
            { id: 4, text: 'process for renew' },
            { id: 5, text: 'renewed' },
            { id: 6, text: 'expired' }
        ];
    }


}

export interface ParamValue {
    paramCode: string;
    dataTypeId: number;
    defaultValue?: any;
}
