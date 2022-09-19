export interface ICategoryID {
    name: string,
    categoryIds: number[]
}

export default interface IConstants {
    categoryIds: ICategoryID[]
}