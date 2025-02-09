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
    darkModeName: string;
    filterWord: string;
    isLoadedPage: boolean;
    savedDarkModeName: string;
    unBlured: boolean;
}
