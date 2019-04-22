
export interface Post {
    url: string;
    description: string;
    extended?: string;
    tags?: string;
    shared?: boolean;
    toRead?: boolean;
}
