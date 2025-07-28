// Users API数据类型定义
export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
};

export type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
};

export type Geo = {
    lat: string;
    lng: string;
};

export type Company = {
    name: string;
    catchPhrase: string;
    bs: string;
}; 

// API 请求参数类型定义
export type FetchUsersParams = {
    // 目前用户 API 不需要参数，但保留扩展性
};

// API 响应结果类型定义
export type FetchUsersResult = User[];

// API 错误类型定义
export type UsersApiError = {
    message: string;
    status?: number;
}; 