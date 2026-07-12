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

export type TExtendedError = Error & {
    response?: {
        data?: {
            title?: string;
            validation_errors?: Record<string, string>;
        };
        statusText?: string;
        title?: string;
    };
};

export interface IAccessTokenByRefreshTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    success: boolean;
    token_type: string;
}

export interface IDecodedToken {
    exp: number;
    iat: number;
    iss: string;
    sub: string;
}

export interface IAuthorizeResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    success: boolean;
    token_type: string;
}
