export interface IAphorism {
    author: string;
    id: string;
    text: string;
    numb: number;
    isEditable?: boolean;
}

export interface IScrollTopObj {
    top: number;
    time: number;
}

export interface IStore {
    isLoadedPage: boolean;
    aphorisms: IAphorism[];
    unBlured: boolean;
    filterWord: string;
}
