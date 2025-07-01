export class ApiConfig {
  static readonly BASE_URL = 'https://localhost:44351/api/v1';
  static readonly OVERVIEW = `${ApiConfig.BASE_URL}/overview`;
  static readonly PRODUCTS = `${ApiConfig.BASE_URL}/products`;
  static readonly BASE_IMAGE_URL = 'https://localhost:44351/images';
  static readonly REGISTER = `${ApiConfig.BASE_URL}/identity/register`;
  static readonly LOGIN = `${ApiConfig.BASE_URL}/identity/login`;
  static readonly SEARCH = `${ApiConfig.BASE_URL}/search`;

}
