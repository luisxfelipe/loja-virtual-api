export class PaginationMetaDto {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;

  constructor(
    itemsPerPage: number,
    totalItems: number,
    currentPage: number,
    totalPages: number,
  ) {
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }
}

export class PaginationDto<T> {
  meta: PaginationMetaDto;
  data: T;

  constructor(pagationMega: PaginationMetaDto, data: T) {
    this.meta = pagationMega;
    this.data = data;
  }
}
