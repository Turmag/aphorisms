export interface IAphorism {
    author: string;
    id: string;
    isEditable?: boolean;
    numb: number;
    text: string;
}

export interface IScrollTopObject {
    time: number;
    top: number;
}

export interface IStore {
    aphorisms: IAphorism[];
    filterWord: string;
    isLoadedPage: boolean;
    unBlured: boolean;
}
