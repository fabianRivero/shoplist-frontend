import { ShopList } from "../../shop-list/models/shopListModel"

export interface item{
    logs: ShopList[],
    period: string,
    startDate: string,
    endDate: string
} 

export interface register {
    register: item
}

export interface items {
    items: register[]
}